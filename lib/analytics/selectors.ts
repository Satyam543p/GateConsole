/**
 * lib/analytics/selectors.ts
 *
 * Memoized analytics selectors for computing derived metrics from stored
 * attempts, study sessions, and question banks.
 *
 * Rule: Compute derived stats in selectors, never inline in UI components.
 */

import type { StoredAttempt, StudySession, Question, AppSettings, DailyChallenge, SubjectProgressState } from "@/lib/domain/types"
import { TOPICS, priorityScore, type Topic } from "@/lib/exams/gate-cse/data"

// ─── Today's Date Helper (ISO YYYY-MM-DD in local time) ──────────────────────

export function getTodayIsoDate(): string {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// ─── Study Minutes Today ─────────────────────────────────────────────────────

export function getStudyMinutesToday(sessions: StudySession[]): number {
  const today = getTodayIsoDate()
  return sessions
    .filter((s) => s.startedAt && s.startedAt.startsWith(today))
    .reduce((sum, s) => sum + Math.round((s.activeSeconds || s.durationSeconds || 0) / 60), 0)
}

// ─── Questions Solved Today ──────────────────────────────────────────────────

export function getQuestionsSolvedToday(attempts: StoredAttempt[]): number {
  const today = getTodayIsoDate()
  return attempts
    .filter((a) => a.submittedAt.startsWith(today))
    .reduce((sum, a) => sum + (a.questionIds?.length || 0), 0)
}

// ─── Study Streak (Consecutive days with at least 1 attempt or session) ──────

export function getStudyStreak(attempts: StoredAttempt[], sessions: StudySession[]): number {
  const activeDates = new Set<string>()

  for (const a of attempts) {
    if (a.submittedAt) activeDates.add(a.submittedAt.slice(0, 10))
  }
  for (const s of sessions) {
    if (s.startedAt) activeDates.add(s.startedAt.slice(0, 10))
  }

  if (activeDates.size === 0) return 0

  let streak = 0
  const d = new Date()

  // If today is active, start counting from today. If not today, check yesterday first.
  let todayIso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  if (!activeDates.has(todayIso)) {
    d.setDate(d.getDate() - 1)
    todayIso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    if (!activeDates.has(todayIso)) return 0
  }

  while (true) {
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    if (activeDates.has(iso)) {
      streak++
      d.setDate(d.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

// ─── Daily Challenge (seed + streak) ─────────────────────────────────────────

/** Shift an ISO date (YYYY-MM-DD) by a number of days. Negative → past. */
export function getDateOffsetIso(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + days)
  const yy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  return `${yy}-${mm}-${dd}`
}

/**
 * Daily-challenge streak: consecutive days ending today (or yesterday, if today
 * is still unanswered) on which the challenge was answered correctly.
 *
 * Rule (locked): increments on a correct answer only; a wrong answer resets to 0.
 */
export function getDailyChallengeStreak(records: DailyChallenge[], today?: string): number {
  const todayIso = today ?? getTodayIsoDate()
  const todayRecord = records.find((r) => r.id === todayIso)
  if (todayRecord?.correct === true) return todayRecord.streak
  if (todayRecord?.correct === false) return 0

  // Today unanswered — the chain stays alive at yesterday's value if it was correct.
  const yesterday = records.find((r) => r.id === getDateOffsetIso(todayIso, -1))
  if (yesterday?.correct === true) return yesterday.streak
  return 0
}

export interface ChallengeSeedSubject {
  id: string
  name: string
  weightage: number
}

/**
 * Pick today's challenge question. Bias (moved from the dashboard card):
 * prefer questions from non-completed subjects with the highest weightage;
 * once everything is complete, fall back to the highest-weightage subject.
 * Matches questions to subjects by *name* (the bank uses names like "Algorithms"),
 * which also fixes the old id-vs-name mismatch that silently served questions[0].
 */
export function seedChallengeQuestionId(
  questions: Question[],
  subjects: ChallengeSeedSubject[],
  subjectProgress: Record<string, SubjectProgressState>
): string {
  if (questions.length === 0) return ""

  const byName = new Map<string, ChallengeSeedSubject>()
  for (const s of subjects) byName.set(s.name.toLowerCase().trim(), s)

  const scored = questions.map((q) => {
    const sub = byName.get(q.subject.toLowerCase().trim())
    return {
      q,
      weightage: sub?.weightage ?? 0,
      completed: sub ? !!subjectProgress[sub.id]?.completed : false,
    }
  })

  const incomplete = scored.filter((s) => !s.completed)
  const pool = incomplete.length > 0 ? incomplete : scored

  let maxWeight = -1
  for (const s of pool) if (s.weightage > maxWeight) maxWeight = s.weightage
  const top = pool.filter((s) => s.weightage === maxWeight)

  return top[Math.floor(Math.random() * top.length)].q.id
}

// ─── Readiness Meter Heuristic (0 to 100%) ────────────────────────────────────

export interface ReadinessBreakdown {
  score: number // 0 to 100
  mockAverage: number
  syllabusCoverage: number
  levers: { label: string; impact: string }[]
}

import { calculateMultiMetricReadiness } from "@/lib/planner/generator"
import type { MistakeEntry, SrsCard } from "@/lib/domain/types"

export function getReadinessScore(
  attempts: StoredAttempt[],
  sessions: StudySession[],
  mistakes: MistakeEntry[] = [],
  srsCards: SrsCard[] = []
) {
  return calculateMultiMetricReadiness(attempts, sessions, mistakes, srsCards)
}

// ─── Weak-Topic List (ranked by weakness × weightage) ───────────────────────

export interface WeakTopicStat {
  subject: string
  topic: string
  accuracy: number
  attemptsCount: number
  priorityScore: number
}

export function getWeakestTopics(
  attempts: StoredAttempt[],
  questionMap: Map<string, Question>
): WeakTopicStat[] {
  const subjectStats = new Map<string, { correct: number; total: number; count: number }>()

  for (const a of attempts) {
    if (!a.questionIds || !a.responses) continue
    for (const qid of a.questionIds) {
      const q = questionMap.get(qid)
      if (!q) continue
      const resp = a.responses[qid]
      if (resp === undefined || resp === null) continue

      const s = subjectStats.get(q.subject) || { correct: 0, total: 0, count: 0 }
      s.total += q.marks
      s.count += 1

      if (q.type === "MCQ" && resp === q.answer) s.correct += q.marks
      else if (q.type === "NAT" && typeof q.answer === "number" && Number(resp) === q.answer) s.correct += q.marks
      else if (q.type === "MSQ" && Array.isArray(resp) && Array.isArray(q.answer)) {
        if (resp.length === q.answer.length && resp.every((v) => (q.answer as number[]).includes(v))) {
          s.correct += q.marks
        }
      }

      subjectStats.set(q.subject, s)
    }
  }

  const result: WeakTopicStat[] = []

  for (const topic of TOPICS.filter((t) => !t.removed)) {
    const stat = subjectStats.get(topic.subject)
    let accuracy = 100 // default if never tested
    let count = 0

    if (stat && stat.total > 0) {
      accuracy = Math.round((stat.correct / stat.total) * 100)
      count = stat.count
    }

    const pScore = priorityScore(topic)

    // Higher weight if low accuracy & high priority score
    result.push({
      subject: topic.subject,
      topic: topic.topic,
      accuracy,
      attemptsCount: count,
      priorityScore: pScore,
    })
  }

  // Sort: lowest accuracy first; tie-break with highest priority score
  result.sort((a, b) => {
    if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy
    return b.priorityScore - a.priorityScore
  })

  return result
}

// ─── Next Action Card Recommendation ─────────────────────────────────────────

export interface NextActionRecommendation {
  type: "drill" | "theory" | "mock"
  title: string
  subject: string
  reason: string
  estimatedMinutes: number
  testId?: string
}

export function getNextActionRecommendation(
  attempts: StoredAttempt[],
  weakTopics: WeakTopicStat[]
): NextActionRecommendation {
  if (attempts.length === 0) {
    return {
      type: "drill",
      title: "Algorithms Subject Drill",
      subject: "Algorithms",
      reason: "Algorithms carries 10+ marks per year and highest priority score. Start your first drill.",
      estimatedMinutes: 20,
      testId: "subj-algorithms",
    }
  }

  // Find the top weak topic that has been tested, or highest priority un-tested topic
  const topWeak = weakTopics[0]
  if (topWeak && topWeak.accuracy < 70) {
    return {
      type: "drill",
      title: `${topWeak.subject} Targeted Practice`,
      subject: topWeak.subject,
      reason: `Accuracy is currently ${topWeak.accuracy}% in ${topWeak.subject} (Weightage priority: ${topWeak.priorityScore.toFixed(1)}).`,
      estimatedMinutes: 15,
      testId: `subj-${topWeak.subject.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
    }
  }

  return {
    type: "mock",
    title: "Full Mock Test 01",
    subject: "Full Syllabus",
    reason: "Your subject accuracy is high. Take a 180-minute full mock to test exam pacing.",
    estimatedMinutes: 180,
    testId: "mock-full-01",
  }
}
