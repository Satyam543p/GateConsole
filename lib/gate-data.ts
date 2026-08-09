/**
 * lib/gate-data.ts — SHIM
 *
 * This file exists only for backward compatibility.
 * Values have moved to lib/exams/gate-cse/data.ts.
 * New code should use the registry: import { registry } from "./exams/registry"
 *
 * All existing component imports from this path still resolve unchanged.
 */

export {
  TOPICS,
  SUBJECTS,
  ROADMAP,
  SUBJECT_WEIGHTAGE,
  PHASE_META,
  DIFFICULTY_FACTOR,
  HIGH_WEIGHT_CUTOFF,
  priorityScore,
  studyPhase,
} from "./exams/gate-cse/data"

export type {
  Topic,
  Trend,
  Difficulty,
  Depth,
  Phase,
  Week,
} from "./exams/gate-cse/data"
