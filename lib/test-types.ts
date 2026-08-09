/**
 * GATE test engine — schema + scoring rules.
 *
 * This file is the contract. When you paste AI-researched JSON into
 * `lib/question-bank.ts`, it must match `Question` / `TestDefinition` below.
 * Nothing else in the app needs to change when you add questions.
 */

export type QuestionType = "MCQ" | "MSQ" | "NAT"

/** GATE awards questions at either 1 or 2 marks; JEE/NEET add 4-mark questions. */
export type Marks = 1 | 2 | 4

export interface Question {
  /** Stable unique id. Convention: `<subject-slug>-<nnn>`, e.g. "algo-001". */
  id: string
  /** Must match a `subject` string used in lib/gate-data.ts so results can
   *  be mapped back onto the priority matrix. */
  subject: string
  /** Free-text chapter/topic label, e.g. "Greedy algorithms". */
  topic?: string
  type: QuestionType
  marks: Marks
  /** The question stem. Supports plain text; use `code` for a code block. */
  text: string
  /** Optional monospace block rendered under the stem (code, tables, matrices). */
  code?: string
  /**
   * MCQ / MSQ only. Exactly 4 entries by GATE convention, but any number works.
   * Ignored for NAT.
   */
  options?: string[]
  /**
   * MCQ  -> single index, e.g. 2
   * MSQ  -> array of indices, e.g. [0, 3]
   * NAT  -> number, or { min, max } to allow a tolerance range
   */
  answer: number | number[] | { min: number; max: number }
  /** Worked solution shown on the review screen. */
  explanation?: string
  /** Source attribution, e.g. "GATE 2019 CS, Q42". */
  source?: string
  /** Rough expected solve time in seconds — used for pacing feedback. */
  expectedSeconds?: number
  // Extended fields (P1)
  conceptIds?: string[]
  year?: number
  paper?: string
  questionNumber?: number
  difficulty?: 1 | 2 | 3 | 4 | 5
  verified?: boolean
  verificationSource?: string
  confidence?: "low" | "medium" | "high"
  tags?: string[]
  imageUrl?: string
  answerAliases?: string[]
}

export interface TestDefinition {
  /** Stable unique id, used in the URL: /tests/<id> */
  id: string
  title: string
  /** "subject" tests are single-subject drills; "mock" tests are full papers. */
  kind: "subject" | "mock" | "practice" | "drill" | "daily"
  /** Present on subject tests; omit for mocks. */
  subject?: string
  /** Total duration in minutes. GATE full paper is 180. */
  durationMinutes: number
  description: string
  questionIds: string[]
}

/* ------------------------------------------------------------------ *
 * Scoring — real GATE rules
 *
 * MCQ: negative marking. 1-mark wrong = -1/3, 2-mark wrong = -2/3.
 * MSQ: no negative marking, but no partial credit either — all-or-nothing.
 * NAT: no negative marking.
 * Unattempted always scores 0.
 * ------------------------------------------------------------------ */

export type Response = number | number[] | string | null

export function isAttempted(r: Response): boolean {
  if (r === null || r === undefined) return false
  if (Array.isArray(r)) return r.length > 0
  if (typeof r === "string") return r.trim() !== ""
  return true
}

export function isCorrect(q: Question, r: Response): boolean {
  if (!isAttempted(r)) return false

  if (q.type === "MCQ") {
    return typeof r === "number" && r === q.answer
  }

  if (q.type === "MSQ") {
    if (!Array.isArray(r) || !Array.isArray(q.answer)) return false
    const given = [...r].sort((a, b) => a - b)
    const want = [...q.answer].sort((a, b) => a - b)
    return given.length === want.length && given.every((v, i) => v === want[i])
  }

  // NAT — numeric entry, compared with tolerance.
  const value = typeof r === "string" ? Number.parseFloat(r) : typeof r === "number" ? r : Number.NaN
  if (Number.isNaN(value)) return false

  if (typeof q.answer === "object" && !Array.isArray(q.answer)) {
    return value >= q.answer.min && value <= q.answer.max
  }
  if (typeof q.answer === "number") {
    // Default tolerance covers the 0.01 rounding GATE allows on decimal answers.
    return Math.abs(value - q.answer) < 0.011
  }
  return false
}

/** Marks lost for a wrong answer. MSQ and NAT carry no penalty. */
export function penaltyFor(q: Question): number {
  if (q.type !== "MCQ") return 0
  return q.marks === 1 ? 1 / 3 : 2 / 3
}

export function scoreFor(q: Question, r: Response): number {
  if (!isAttempted(r)) return 0
  return isCorrect(q, r) ? q.marks : -penaltyFor(q)
}

export interface QuestionOutcome {
  question: Question
  response: Response
  attempted: boolean
  correct: boolean
  score: number
  seconds: number
}

export interface SubjectBreakdown {
  subject: string
  total: number
  scored: number
  correct: number
  wrong: number
  skipped: number
  count: number
  accuracy: number
}

export interface ScoredAttempt {
  outcomes: QuestionOutcome[]
  totalMarks: number
  scored: number
  correct: number
  wrong: number
  skipped: number
  accuracy: number
  percentage: number
  bySubject: SubjectBreakdown[]
}

export function scoreAttempt(
  questions: Question[],
  responses: Record<string, Response>,
  timePerQuestion: Record<string, number> = {},
): ScoredAttempt {
  const outcomes: QuestionOutcome[] = questions.map((q) => {
    const response = responses[q.id] ?? null
    const attempted = isAttempted(response)
    const correct = isCorrect(q, response)
    return {
      question: q,
      response,
      attempted,
      correct,
      score: scoreFor(q, response),
      seconds: timePerQuestion[q.id] ?? 0,
    }
  })

  const totalMarks = questions.reduce((s, q) => s + q.marks, 0)
  const scored = outcomes.reduce((s, o) => s + o.score, 0)
  const correct = outcomes.filter((o) => o.correct).length
  const wrong = outcomes.filter((o) => o.attempted && !o.correct).length
  const skipped = outcomes.filter((o) => !o.attempted).length
  const attemptedCount = correct + wrong

  const subjects = Array.from(new Set(questions.map((q) => q.subject)))
  const bySubject: SubjectBreakdown[] = subjects
    .map((subject) => {
      const rows = outcomes.filter((o) => o.question.subject === subject)
      const sCorrect = rows.filter((o) => o.correct).length
      const sWrong = rows.filter((o) => o.attempted && !o.correct).length
      const sAttempted = sCorrect + sWrong
      return {
        subject,
        total: rows.reduce((s, o) => s + o.question.marks, 0),
        scored: rows.reduce((s, o) => s + o.score, 0),
        correct: sCorrect,
        wrong: sWrong,
        skipped: rows.filter((o) => !o.attempted).length,
        count: rows.length,
        accuracy: sAttempted > 0 ? (sCorrect / sAttempted) * 100 : 0,
      }
    })
    .sort((a, b) => b.total - a.total)

  return {
    outcomes,
    totalMarks,
    scored,
    correct,
    wrong,
    skipped,
    accuracy: attemptedCount > 0 ? (correct / attemptedCount) * 100 : 0,
    percentage: totalMarks > 0 ? (Math.max(0, scored) / totalMarks) * 100 : 0,
    bySubject,
  }
}

/* ------------------------------------------------------------------ *
 * Stored attempt records (localStorage)
 * ------------------------------------------------------------------ */

export interface StoredAttempt {
  id: string
  testId: string
  testTitle: string
  kind: TestDefinition["kind"]
  subject?: string
  /** Ordered question ids as served, so the review screen is reproducible
   *  even if the bank is edited afterwards. */
  questionIds: string[]
  /** ISO timestamp of submission. */
  submittedAt: string
  /** Seconds actually spent in the exam. */
  durationSeconds: number
  responses: Record<string, Response>
  timePerQuestion: Record<string, number>
  markedForReview: string[]
  scored: number
  totalMarks: number
  correct: number
  wrong: number
  skipped: number
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (n: number) => String(n).padStart(2, "0")
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`
}
