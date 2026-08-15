/**
 * lib/domain/types.ts
 *
 * Canonical hierarchy: Exam → Subject → Chapter → Concept → Question
 *
 * Every entity carries a stable, namespaced string id in the form:
 *   gate-cse:subject-slug:chapter-slug:concept-slug
 *
 * Every user-generated record carries `userId` and `examId` so that a future
 * multi-user / multi-exam migration is a data change, not a code change.
 * For now both are hardcoded constants from the active exam registry.
 */

// ─── Identifiers ────────────────────────────────────────────────────────────

/** A namespaced string id, e.g. "gate-cse:algo:sorting:quicksort" */
export type EntityId = string

export const LOCAL_USER_ID = "local" as const
export const GATE_CSE_EXAM_ID = "gate-cse" as const

// ─── Base for all user-generated records ────────────────────────────────────

export interface UserRecord {
  userId: string  // hardcoded "local" for now; swap to real userId later
  examId: string  // hardcoded "gate-cse" for now; enables future multi-exam
}

// ─── Exam ────────────────────────────────────────────────────────────────────

export interface Exam {
  id: EntityId
  name: string
  shortName: string
  /** Total marks in the full paper */
  totalMarks: number
  /** Total duration in minutes */
  durationMinutes: number
  /** Number of questions in a full mock */
  totalQuestions: number
  /** The exam date this aspirant is targeting (ISO date string) */
  examDate?: string
  markingRules: MarkingRules
  sections: ExamSection[]
}

export interface ExamSection {
  id: EntityId
  name: string
  marks: number
  questionCount: number
}

export interface MarkingRules {
  /** MCQ: negative fraction of marks for wrong answer (e.g. 1/3) */
  mcqNegativeFraction: number
  /** MSQ: all-or-nothing, no partial, no negative */
  msqPartialCredit: false
  msqNegative: false
  /** NAT: no negative */
  natNegative: false
}

// ─── Subject ─────────────────────────────────────────────────────────────────

export interface Subject {
  id: EntityId
  examId: EntityId
  name: string
  shortName?: string
  /** Average marks per year across historical papers */
  avgMarksPerYear: number
}

// ─── Chapter ─────────────────────────────────────────────────────────────────

export type StudyPhase = 1 | 2 | 3 | 4
export type Difficulty = "Easy" | "Medium" | "Hard"
export type Trend = "Increasing" | "Stable" | "Decreasing"
export type Depth = "Low" | "Medium" | "High"

export interface Chapter {
  id: EntityId
  subjectId: EntityId
  examId: EntityId
  name: string
  avgMarksPerYear: number
  trend: Trend
  pyqCount: number
  difficulty: Difficulty
  depth: Depth
  /** Theory + note-making hours (question practice budgeted separately) */
  studyHours: number
  phase: StudyPhase
  priorityScore: number
  reference?: string
  practice?: string
  prerequisites?: EntityId[]
  removed?: boolean
  note?: string
}

// ─── Concept ─────────────────────────────────────────────────────────────────

export type ConceptKind =
  | "definition"
  | "theorem"
  | "algorithm"
  | "formula"
  | "technique"
  | "pitfall"

export interface Concept {
  id: EntityId
  subjectId: EntityId
  chapterId: EntityId
  label: string
  name?: string
  category?: string
  kind: ConceptKind
  /** 1–2 sentences, exam-focused */
  summary: string
  /** LaTeX string */
  formula?: string
  /** e.g. "avg O(n log n) / worst O(n^2)" */
  complexity?: string
  /** Code snippet or pseudocode describing the algorithm */
  pseudocode?: string
  /** concept ids — the real value of this graph */
  prerequisites: EntityId[]
  /** 1–5 scale */
  examRelevance: 1 | 2 | 3 | 4 | 5
  commonTraps?: string[]
  pyqIds?: string[]
  keyFormulae?: string[]
  codeSnippet?: string
  mindmap?: string | { core: string; branches: string[] }
  imageUrl?: string
  pyqMapping?: string[]
  resources?: { label: string; ref: string }[]
}

// ─── Question ─────────────────────────────────────────────────────────────────

export type QuestionType = "MCQ" | "MSQ" | "NAT"
export type Marks = 1 | 2 | 4

export interface Question {
  /** Stable unique id. Convention: "gate-cse:subject-slug:nnn" */
  id: string
  /** Must match a Subject name so results wire back to the priority matrix */
  subject: string
  /** Free-text chapter/topic label */
  topic?: string
  chapterId?: string
  type: QuestionType
  marks: Marks
  /** Question stem. Supports plain text; use `code` for monospace block */
  text: string
  /** Optional monospace block rendered under the stem */
  code?: string
  /**
   * MCQ  → single index, e.g. 2
   * MSQ  → array of indices, e.g. [0, 3]
   * NAT  → number, or { min, max } for tolerance range
   */
  answer: number | number[] | { min: number; max: number }
  options?: string[]
  explanation?: string
  source?: string
  expectedSeconds?: number
  // Extended fields (P1 will populate these)
  conceptIds?: string[]
  year?: number
  paper?: string
  questionNumber?: number
  difficulty?: 1 | 2 | 3 | 4 | 5
  verified: boolean
  verificationSource?: string
  confidence?: "low" | "medium" | "high"
  tags?: string[]
  imageUrl?: string
  answerAliases?: string[]
}

// ─── Test ─────────────────────────────────────────────────────────────────────

export interface TestDefinition {
  id: string
  title: string
  kind: "subject" | "mock" | "practice" | "drill" | "daily"
  subject?: string
  durationMinutes: number
  description: string
  questionIds: string[]
  /** Optional explicit timer mode. "stopwatch" = untimed drill showing elapsed time; "countdown" = counts down with auto-submit. */
  timerType?: "stopwatch" | "countdown"
}

// ─── Daily Challenge ──────────────────────────────────────────────────────────

export interface DailyChallenge extends UserRecord {
  /** ISO date (YYYY-MM-DD) — one record per day */
  id: string
  /** Today's seeded question — identical all day */
  questionId: string
  /** true once today's challenge has been answered */
  solved: boolean
  /** Today's result; null until answered */
  correct: boolean | null
  /** Streak after today's outcome (0 = broken) */
  streak: number
  /** ISO timestamp of today's answer */
  answeredAt?: string
}

// ─── Attempt ─────────────────────────────────────────────────────────────────

export type Response = number | number[] | string | null

export interface StoredAttempt extends UserRecord {
  id: string
  testId: string
  testTitle: string
  kind: TestDefinition["kind"]
  subject?: string
  questionIds: string[]
  submittedAt: string
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

// ─── Exam Result ─────────────────────────────────────────────────────────────

export interface StoredExamResult extends UserRecord {
  id: string
  examName: string
  subjectId?: string
  score: number
  maxScore: number
  date: string
  weakTopics: string[]
}

// ─── SRS / Revision ──────────────────────────────────────────────────────────

export type SrsRating = "again" | "hard" | "good" | "easy"
export type MasteryState = "untouched" | "learning" | "shaky" | "solid" | "mastered"

export interface SrsCard extends UserRecord {
  id: string
  conceptId: EntityId
  interval: number         // days until next review
  easeFactor: number       // SM-2 ease factor
  dueDate: string          // ISO date
  lastReviewDate?: string
  masteryState: MasteryState
  repetitions: number
}

// ─── Mistake ─────────────────────────────────────────────────────────────────

export type MistakeCause =
  | "conceptual"
  | "formula-forgotten"
  | "calculation"
  | "misread"
  | "silly"
  | "time-pressure"
  | "guessed-wrong"
  | "knew-but-blanked"

export interface MistakeEntry extends UserRecord {
  id: string
  questionId: string
  attemptId: string
  cause?: MistakeCause
  note?: string
  rootConceptId?: EntityId
  resolved: boolean
  createdAt: string
  /** ISO dates of subsequent correct answers on this concept */
  correctAfter: string[]
}

// ─── Session ─────────────────────────────────────────────────────────────────

export interface StudySession extends UserRecord {
  id: string
  chapterId?: EntityId
  subject?: string
  topic?: string
  startedAt: string
  endedAt?: string
  /** Seconds of active study (paused time excluded) */
  activeSeconds: number
  durationSeconds?: number
  paused?: boolean
}

// ─── Plan ────────────────────────────────────────────────────────────────────

export type BlockKind = "new-study" | "drill" | "revision" | "mock"

export interface PlanBlock {
  id: string
  date: string               // ISO date
  kind: BlockKind
  chapterId?: EntityId
  conceptIds?: EntityId[]
  targetMinutes: number
  reason: string             // one-sentence plain-English explanation
  completed: boolean
  overridden?: boolean       // user manually changed this block
}

export interface WeeklyAvailability {
  /** Hours available per weekday: index 0 = Monday … 6 = Sunday */
  hoursPerDay: [number, number, number, number, number, number, number]
  /** ISO date strings of blackout dates (exams, holidays, etc.) */
  blackoutDates: string[]
}

// ─── Settings ────────────────────────────────────────────────────────────────

export interface UserProfile {
  name: string
  exam: string
  domain?: string
  onboardingComplete: boolean
}

export interface SubjectProgressState {
  completed: boolean
  revised: boolean
}

export interface AppSettings extends UserRecord {
  id: "settings"             // singleton
  examDate?: string          // ISO date, e.g. "2026-02-01"
  weeklyAvailability: WeeklyAvailability
  lastExportAt?: string      // ISO timestamp, used by stale-backup banner
  includeUnverifiedInAnalytics: boolean
  paceCoachEnabled: boolean
  subjectProgress: Record<string, SubjectProgressState>
  profile?: UserProfile
}

export const DEFAULT_SETTINGS: Omit<AppSettings, "userId" | "examId"> = {
  id: "settings",
  weeklyAvailability: {
    hoursPerDay: [4, 4, 4, 4, 4, 3, 3],
    blackoutDates: [],
  },
  includeUnverifiedInAnalytics: false,
  paceCoachEnabled: false,
  subjectProgress: {},
}

// ─── Concept Notes (user-authored, persisted) ─────────────────────────────────

export interface ConceptNote extends UserRecord {
  id: string            // same as conceptId for easy lookup
  conceptId: EntityId
  text: string
  updatedAt: string
}
