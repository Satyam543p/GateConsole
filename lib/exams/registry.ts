/**
 * lib/exams/registry.ts
 *
 * The single source of truth for which exam is active.
 * Components must import exam data through here — never from
 * lib/exams/<examId>/ directly. This is the seam that makes
 * multi-exam support additive (a data folder + a registry entry).
 */

import { TOPICS, SUBJECT_WEIGHTAGE, PHASE_META, DIFFICULTY_FACTOR, HIGH_WEIGHT_CUTOFF, priorityScore, studyPhase } from "./gate-cse/data"
import { QUESTIONS, TESTS } from "./gate-cse/question-bank"
import type { Topic, Trend, Difficulty, Depth, Phase } from "./gate-cse/data"
import type { Question, TestDefinition } from "../test-types"

// ─── Exam descriptor ─────────────────────────────────────────────────────────

export interface ExamDescriptor {
  id: string
  name: string
  shortName: string
  totalMarks: number
  durationMinutes: number
  totalQuestions: number
  /** Target exam date — update in settings */
  examDate: string
  markingRules: {
    mcqNegativeFraction: number
    msqAllOrNothing: true
    msqNegative: false
    natNegative: false
  }
}

export const GATE_CSE_EXAM: ExamDescriptor = {
  id: "gate-cse",
  name: "GATE Computer Science & Information Technology",
  shortName: "GATE CSE",
  totalMarks: 100,
  durationMinutes: 180,
  totalQuestions: 65,
  examDate: "2026-02-01", // Update to the actual exam date
  markingRules: {
    mcqNegativeFraction: 1 / 3,
    msqAllOrNothing: true,
    msqNegative: false,
    natNegative: false,
  },
}

// ─── Active exam (the only one for now) ──────────────────────────────────────

export const ACTIVE_EXAM = GATE_CSE_EXAM

// ─── Registry interface ───────────────────────────────────────────────────────

export interface ExamRegistry {
  exam: ExamDescriptor
  getTopics(): Topic[]
  getSubjectWeightage(): typeof SUBJECT_WEIGHTAGE
  getPhaseMeta(): typeof PHASE_META
  getDifficultyFactor(): typeof DIFFICULTY_FACTOR
  getHighWeightCutoff(): number
  priorityScore(t: Topic): number
  studyPhase(t: Topic): Phase
  getQuestions(): Question[]
  getTests(): TestDefinition[]
}

export const registry: ExamRegistry = {
  exam: GATE_CSE_EXAM,
  getTopics: () => TOPICS,
  getSubjectWeightage: () => SUBJECT_WEIGHTAGE,
  getPhaseMeta: () => PHASE_META,
  getDifficultyFactor: () => DIFFICULTY_FACTOR,
  getHighWeightCutoff: () => HIGH_WEIGHT_CUTOFF,
  priorityScore,
  studyPhase,
  getQuestions: () => QUESTIONS,
  getTests: () => TESTS,
}

// ─── Re-exports for convenience ───────────────────────────────────────────────
// These let existing imports of individual functions keep working via the
// shim in lib/gate-data.ts, but new code should use `registry.*`.

export type { Topic, Trend, Difficulty, Depth, Phase }
