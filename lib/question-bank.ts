/**
 * lib/question-bank.ts — SHIM
 *
 * This file exists only for backward compatibility.
 * Values have moved to lib/exams/gate-cse/question-bank.ts.
 * New code should use: import { registry } from "./exams/registry"
 */

export {
  QUESTIONS,
  TESTS,
  QUESTION_MAP,
  getTest,
  getQuestions,
  testMarks,
} from "./exams/gate-cse/question-bank"
