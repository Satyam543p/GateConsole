/**
 * lib/analytics/prescriptive.ts
 *
 * Prescriptive Analytics Engine for GATE CSE:
 *  - Expected GATE score interval estimator [low, mid, high] with confidence breakdown.
 *  - Marks-per-hour yield ranking per subject (actual vs priority model).
 *  - Time-bleed diagnosis (identifying time black hole topics: high time, low accuracy).
 *  - Silly mistake index per subject.
 *  - Single highest-yield hour recommendation for today.
 */

import type { StoredAttempt, StudySession, MistakeEntry, Question } from "@/lib/domain/types"
import { TOPICS, priorityScore } from "@/lib/exams/gate-cse/data"

// ─── 1. Score Interval Estimator ──────────────────────────────────────────────

export interface ScoreIntervalEstimate {
  low: number
  mid: number
  high: number
  confidence: "Low" | "Medium" | "High"
  basisReason: string
}

export function estimateGateScoreInterval(
  attempts: StoredAttempt[]
): ScoreIntervalEstimate {
  const mocks = attempts.filter((a) => a.kind === "mock" && a.totalMarks > 0)

  if (attempts.length === 0) {
    return {
      low: 35,
      mid: 50,
      high: 62,
      confidence: "Low",
      basisReason: "Based on initial GATE CSE syllabus weightage model (0 test attempts recorded).",
    }
  }

  if (mocks.length > 0) {
    const mockPcts = mocks.map((m) => (m.scored / m.totalMarks) * 100)
    const avg = mockPcts.reduce((s, p) => s + p, 0) / mockPcts.length
    const stdDev =
      mockPcts.length > 1
        ? Math.sqrt(mockPcts.reduce((s, p) => s + Math.pow(p - avg, 2), 0) / mockPcts.length)
        : 8

    const mid = Math.round(avg)
    const low = Math.max(0, Math.round(mid - Math.max(6, stdDev * 1.5)))
    const high = Math.min(100, Math.round(mid + Math.max(6, stdDev * 1.5)))
    const confidence = mocks.length >= 3 ? "High" : "Medium"

    return {
      low,
      mid,
      high,
      confidence,
      basisReason: `Based on ${mocks.length} full mock exam attempts (Average: ${mid}%).`,
    }
  }

  // Fallback to subject drill accuracy
  const totalScored = attempts.reduce((s, a) => s + Math.max(0, a.scored), 0)
  const totalMarks = attempts.reduce((s, a) => s + a.totalMarks, 0)
  const overallPct = totalMarks > 0 ? (totalScored / totalMarks) * 100 : 50

  const mid = Math.round(overallPct * 0.85) // conservative scaling for full paper
  const low = Math.max(0, mid - 10)
  const high = Math.min(100, mid + 12)

  return {
    low,
    mid,
    high,
    confidence: "Low",
    basisReason: `Estimated from ${attempts.length} subject drill attempts (Average accuracy: ${Math.round(overallPct)}%).`,
  }
}

// ─── 2. Marks-per-Hour Yield Ranking ──────────────────────────────────────────

export interface YieldStat {
  subject: string
  hoursSpent: number
  marksScored: number
  actualYield: number // marks per hour
  modelPriority: number
}

export function getMarksPerHourYield(
  attempts: StoredAttempt[],
  sessions: StudySession[]
): YieldStat[] {
  const subjectHours = new Map<string, number>()
  const subjectMarks = new Map<string, number>()

  for (const s of sessions) {
    if (!s.subject) continue
    const hrs = (s.activeSeconds || s.durationSeconds || 0) / 3600
    subjectHours.set(s.subject, (subjectHours.get(s.subject) || 0) + hrs)
  }

  for (const a of attempts) {
    if (!a.subject) continue
    subjectMarks.set(a.subject, (subjectMarks.get(a.subject) || 0) + Math.max(0, a.scored))
  }

  const result: YieldStat[] = []
  const subjectPriority = new Map<string, number>()

  for (const topic of TOPICS.filter((t) => !t.removed)) {
    const pScore = priorityScore(topic)
    subjectPriority.set(topic.subject, (subjectPriority.get(topic.subject) || 0) + pScore)
  }

  for (const subject of subjectPriority.keys()) {
    const hoursSpent = Math.max(0.5, Number((subjectHours.get(subject) || 1).toFixed(1)))
    const marksScored = Number((subjectMarks.get(subject) || 0).toFixed(1))
    const actualYield = Number((marksScored / hoursSpent).toFixed(2))
    const modelPriority = Number((subjectPriority.get(subject) || 0).toFixed(1))

    result.push({
      subject,
      hoursSpent,
      marksScored,
      actualYield,
      modelPriority,
    })
  }

  result.sort((a, b) => b.actualYield - a.actualYield)
  return result
}

// ─── 3. Time-Bleed Diagnosis (Time Black Holes) ───────────────────────────────

export interface TimeBleedTopic {
  subject: string
  topic: string
  avgTimeSeconds: number
  accuracyPct: number
  recommendation: string
}

export function getTimeBleedDiagnosis(
  attempts: StoredAttempt[],
  questionMap: Map<string, Question>
): TimeBleedTopic[] {
  const stats = new Map<string, { totalTime: number; count: number; correct: number }>()

  for (const a of attempts) {
    if (!a.questionIds || !a.timePerQuestion) continue
    for (const qid of a.questionIds) {
      const q = questionMap.get(qid)
      if (!q) continue

      const time = a.timePerQuestion[qid] || 0
      const resp = a.responses[qid]
      const isCorrect =
        resp !== undefined &&
        resp !== null &&
        ((q.type === "MCQ" && resp === q.answer) ||
          (q.type === "NAT" && typeof q.answer === "number" && Number(resp) === q.answer))

      const current = stats.get(q.subject) || { totalTime: 0, count: 0, correct: 0 }
      current.totalTime += time
      current.count += 1
      if (isCorrect) current.correct += 1
      stats.set(q.subject, current)
    }
  }

  const bleeds: TimeBleedTopic[] = []

  for (const [subject, data] of stats.entries()) {
    if (data.count === 0) continue
    const avgTimeSeconds = Math.round(data.totalTime / data.count)
    const accuracyPct = Math.round((data.correct / data.count) * 100)

    // Highlight as Time Bleed if avg time > 180s and accuracy < 60%
    if (avgTimeSeconds > 180 && accuracyPct < 60) {
      bleeds.push({
        subject,
        topic: `${subject} Question Solving`,
        avgTimeSeconds,
        accuracyPct,
        recommendation: `You spend ${Math.floor(avgTimeSeconds / 60)}m ${avgTimeSeconds % 60}s per question but land only ${accuracyPct}% accuracy. Skip or mark for review early to avoid time drain.`,
      })
    }
  }

  bleeds.sort((a, b) => b.avgTimeSeconds - a.avgTimeSeconds)
  return bleeds
}

// ─── 4. Silly Mistake Index ───────────────────────────────────────────────────

export interface SillyMistakeStat {
  subject: string
  sillyCount: number
  marksLost: number
}

export function getSillyMistakeIndex(
  mistakes: MistakeEntry[],
  questionMap: Map<string, Question>
): SillyMistakeStat[] {
  const subjectMap = new Map<string, { count: number; marksLost: number }>()

  const sillyCauses = new Set(["silly", "calculation", "misread", "guessed-wrong"])

  for (const m of mistakes) {
    if (!m.cause || !sillyCauses.has(m.cause)) continue
    const q = questionMap.get(m.questionId)
    const subject = q?.subject || "General"
    const marks = q?.marks || 1

    const cur = subjectMap.get(subject) || { count: 0, marksLost: 0 }
    cur.count += 1
    cur.marksLost += marks
    subjectMap.set(subject, cur)
  }

  const result: SillyMistakeStat[] = []
  for (const [subject, data] of subjectMap.entries()) {
    result.push({
      subject,
      sillyCount: data.count,
      marksLost: data.marksLost,
    })
  }

  result.sort((a, b) => b.marksLost - a.marksLost)
  return result
}

// ─── 5. Highest-Yield Hour Recommendation ──────────────────────────────────────

export interface HighestYieldHour {
  title: string
  subject: string
  impactMarks: string
  reason: string
  actionLink: string
}

export function getHighestYieldHourSuggestion(
  attempts: StoredAttempt[],
  yieldStats: YieldStat[],
  timeBleeds: TimeBleedTopic[],
  sillyStats: SillyMistakeStat[]
): HighestYieldHour {
  // If there are silly mistakes, fixing calculation/misread errors is top priority
  if (sillyStats.length > 0) {
    const topSilly = sillyStats[0]
    return {
      title: `Eliminate Avoidable Errors in ${topSilly.subject}`,
      subject: topSilly.subject,
      impactMarks: `+${topSilly.marksLost} marks potential`,
      reason: `You lost ${topSilly.marksLost} marks to calculation or misread errors in ${topSilly.subject}. Review these in Mistake Notebook to recover easy marks.`,
      actionLink: "/mistakes",
    }
  }

  // If there are time bleeds
  if (timeBleeds.length > 0) {
    const topBleed = timeBleeds[0]
    return {
      title: `Fix Time Drain in ${topBleed.subject}`,
      subject: topBleed.subject,
      impactMarks: "+3–5 marks pacing boost",
      reason: `Your average solve time in ${topBleed.subject} is ${Math.floor(topBleed.avgTimeSeconds / 60)}m but accuracy is ${topBleed.accuracyPct}%. Practice targeted drills to speed up.`,
      actionLink: `/tests/subj-${topBleed.subject.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
    }
  }

  // Default high priority topic
  return {
    title: "Master Algorithms Dynamic Programming",
    subject: "Algorithms",
    impactMarks: "+6–8 marks high yield",
    reason: "Algorithms carries the highest weightage-to-effort ratio (priority score 9.2). Spend 1 hour solving PYQs.",
    actionLink: "/tests/subj-algorithms",
  }
}
