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

// ─── 1. Score & Rank Prediction Engine ──────────────────────────────────────

export interface ScoreIntervalEstimate {
  rawLow: number
  rawMid: number
  rawHigh: number
  gateScoreLow: number
  gateScoreMid: number
  gateScoreHigh: number
  airBest: number
  airConservative: number
  airLabel: string
  admissionsTier: string
  percentile: string
  confidence: "Insufficient Data" | "Low" | "Medium" | "High"
  basisReason: string
  subjectScores: {
    subject: string
    maxGateMarks: number
    predictedMarks: number
    accuracy: number
    status: "Strong" | "Moderate" | "Needs Focus" | "Untested"
  }[]
}

export const GATE_SUBJECT_WEIGHTAGES: Record<string, number> = {
  "General Aptitude": 15,
  "Engineering Mathematics": 7,
  "Discrete Mathematics": 8,
  "Programming & Data Structures": 8,
  "Algorithms": 8,
  "Computer Organization": 9,
  "Operating Systems": 9,
  "Databases": 8,
  "Computer Networks": 9,
  "Theory of Computation": 8,
  "Compiler Design": 5,
  "Digital Logic": 4,
}

export function rawMarksToGateScore(raw: number): number {
  if (raw <= 0) return 0
  const Mq = 26.0 // Approximate general qualifying cutoff
  const Mt = 78.0 // Approximate mean of top 0.1%
  const Sq = 350  // Qualifying score
  const St = 900  // Score for top 0.1%

  if (raw < Mq) {
    return Math.max(100, Math.round((raw / Mq) * Sq))
  }
  const score = Sq + ((St - Sq) * (raw - Mq)) / (Mt - Mq)
  return Math.min(1000, Math.max(100, Math.round(score)))
}

export function rawMarksToRankEstimate(raw: number): { best: number; conservative: number; label: string; tier: string; percentile: string } {
  if (raw >= 82) {
    return { best: 1, conservative: 35, label: "AIR 1 – 35", tier: "IISc / IIT Bombay / Direct PSU Shortlist", percentile: "99.98%" }
  } else if (raw >= 72) {
    return { best: 36, conservative: 160, label: "AIR 36 – 160", tier: "Top Old IITs (IITB, IITD, IITM, IITK) CSE", percentile: "99.85%" }
  } else if (raw >= 62) {
    return { best: 161, conservative: 550, label: "AIR 161 – 550", tier: "Old IITs (IIT Kgp, IITR, IITG) & Top NITs", percentile: "99.40%" }
  } else if (raw >= 52) {
    return { best: 551, conservative: 1600, label: "AIR 551 – 1,600", tier: "Newer IITs (IIT Hyd, IIT Indore) & Top NITs", percentile: "98.20%" }
  } else if (raw >= 42) {
    return { best: 1601, conservative: 4200, label: "AIR 1,601 – 4,200", tier: "NITs, IIITs & State University M.Tech", percentile: "95.50%" }
  } else if (raw >= 32) {
    return { best: 4201, conservative: 9500, label: "AIR 4,201 – 9,500", tier: "Qualified Bracket (CCMT Counseling)", percentile: "90.00%" }
  } else {
    return { best: 9501, conservative: 25000, label: "> AIR 9,500", tier: "Foundation Building Phase", percentile: "< 85.00%" }
  }
}

export function estimateGateScoreInterval(
  attempts: StoredAttempt[]
): ScoreIntervalEstimate {
  const mocks = attempts.filter((a) => a.kind === "mock" && a.totalMarks > 0)
  const drills = attempts.filter((a) => a.kind !== "mock" && a.totalMarks > 0)

  // Subject accuracy calculation
  const subjectAccuracyMap = new Map<string, { scored: number; total: number }>()
  for (const a of attempts) {
    if (a.subject) {
      const cur = subjectAccuracyMap.get(a.subject) || { scored: 0, total: 0 }
      cur.scored += Math.max(0, a.scored)
      cur.total += a.totalMarks
      subjectAccuracyMap.set(a.subject, cur)
    }
  }

  const subjectScores = Object.entries(GATE_SUBJECT_WEIGHTAGES).map(([sub, weight]) => {
    const stat = subjectAccuracyMap.get(sub)
    let acc = 0
    let status: "Strong" | "Moderate" | "Needs Focus" | "Untested" = "Untested"

    if (stat && stat.total > 0) {
      acc = Math.min(100, (Math.max(0, stat.scored) / stat.total) * 100)
      status = acc >= 70 ? "Strong" : acc >= 40 ? "Moderate" : "Needs Focus"
    }

    const predictedMarks = Number(((acc / 100) * weight).toFixed(1))

    return {
      subject: sub,
      maxGateMarks: weight,
      predictedMarks,
      accuracy: Math.round(acc),
      status,
    }
  })

  let rawMid = 0
  let rawLow = 0
  let rawHigh = 0
  let confidence: "Insufficient Data" | "Low" | "Medium" | "High" = "Insufficient Data"
  let basisReason = "Not enough data. Take mock tests or subject drills to unlock rank predictions."

  const totalAttemptedMarks = attempts.reduce((s, a) => s + a.totalMarks, 0)

  if (totalAttemptedMarks >= 30) {
    if (mocks.length > 0) {
      const mockPcts = mocks.map((m) => (m.scored / m.totalMarks) * 100)
      const avgMock = mockPcts.reduce((s, p) => s + p, 0) / mockPcts.length
      const stdDev =
        mockPcts.length > 1
          ? Math.sqrt(mockPcts.reduce((s, p) => s + Math.pow(p - avgMock, 2), 0) / mockPcts.length)
          : 6

      rawMid = Math.round(avgMock)
      rawLow = Math.max(0, Math.round(rawMid - Math.max(4, stdDev * 1.2)))
      rawHigh = Math.min(100, Math.round(rawMid + Math.max(4, stdDev * 1.2)))
      confidence = mocks.length >= 3 ? "High" : "Medium"
      basisReason = `Calculated from ${mocks.length} full mock test attempts.`
    } else if (drills.length > 0) {
      const subjectSum = subjectScores.reduce((s, item) => s + item.predictedMarks, 0)
      const totalWeightCovered = subjectScores.filter(s => s.status !== "Untested").reduce((s, i) => s + i.maxGateMarks, 0)
      
      if (totalWeightCovered > 0) {
        rawMid = Math.round(subjectSum)
        rawLow = Math.max(0, rawMid - 5)
        rawHigh = Math.min(100, rawMid + 8)
        confidence = drills.length >= 5 && totalWeightCovered >= 40 ? "Medium" : "Low"
        basisReason = `Derived from performance across ${Math.round(totalWeightCovered)}% of the GATE syllabus.`
      }
    }
  }

  const gateScoreLow = rawMarksToGateScore(rawLow)
  const gateScoreMid = rawMarksToGateScore(rawMid)
  const gateScoreHigh = rawMarksToGateScore(rawHigh)

  const rankData = rawMarksToRankEstimate(rawMid)

  return {
    rawLow,
    rawMid,
    rawHigh,
    gateScoreLow,
    gateScoreMid,
    gateScoreHigh,
    airBest: rankData.best,
    airConservative: rankData.conservative,
    airLabel: rankData.label,
    admissionsTier: rankData.tier,
    percentile: rankData.percentile,
    confidence,
    basisReason,
    subjectScores,
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
      reason: `You lost ${topSilly.marksLost} marks to calculation or misread errors in ${topSilly.subject}. Review these topics to recover easy marks.`,
      actionLink: "/todo",
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
