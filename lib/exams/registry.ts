/**
 * lib/exams/registry.ts
 *
 * The single source of truth for which exam is active.
 * Components must import exam data through here — never from
 * lib/exams/<examId>/ directly. This is the seam that makes
 * multi-exam support additive (a data folder + a registry entry).
 */

import { TOPICS, SUBJECT_WEIGHTAGE as GATE_CSE_SUBJECTS, PHASE_META, DIFFICULTY_FACTOR, HIGH_WEIGHT_CUTOFF, priorityScore, studyPhase } from "./gate-cse/data"
import { QUESTIONS as GATE_CSE_QUESTIONS, TESTS as GATE_CSE_TESTS } from "./gate-cse/question-bank"
import { CONCEPTS as GATE_CSE_CONCEPTS } from "./gate-cse/concepts"
import type { Topic, Trend, Difficulty, Depth, Phase } from "./gate-cse/data"
import type { Question, TestDefinition } from "../test-types"

// Dynamic exam imports
import { SUBJECT_WEIGHTAGE as JEE_SUBJECTS } from "./jee/data"
import { QUESTIONS as JEE_QUESTIONS, TESTS as JEE_TESTS } from "./jee/question-bank"
import { CONCEPTS as JEE_CONCEPTS } from "./jee/concepts"

import { SUBJECT_WEIGHTAGE as NEET_SUBJECTS } from "./neet/data"
import { QUESTIONS as NEET_QUESTIONS, TESTS as NEET_TESTS } from "./neet/question-bank"
import { CONCEPTS as NEET_CONCEPTS } from "./neet/concepts"

import { SUBJECT_WEIGHTAGE as GATE_ECE_SUBJECTS } from "./gate-ece/data"
import { QUESTIONS as GATE_ECE_QUESTIONS, TESTS as GATE_ECE_TESTS } from "./gate-ece/question-bank"
import { CONCEPTS as GATE_ECE_CONCEPTS } from "./gate-ece/concepts"

import { SUBJECT_WEIGHTAGE as GATE_ME_SUBJECTS } from "./gate-me/data"
import { QUESTIONS as GATE_ME_QUESTIONS, TESTS as GATE_ME_TESTS } from "./gate-me/question-bank"
import { CONCEPTS as GATE_ME_CONCEPTS } from "./gate-me/concepts"

import { SUBJECT_WEIGHTAGE as GATE_CE_SUBJECTS } from "./gate-ce/data"
import { QUESTIONS as GATE_CE_QUESTIONS, TESTS as GATE_CE_TESTS } from "./gate-ce/question-bank"
import { CONCEPTS as GATE_CE_CONCEPTS } from "./gate-ce/concepts"

// ─── Multi-Exam Constants ───────────────────────────────────────────────────

export const EXAMS = [
  { id: "gate", name: "GATE" },
  { id: "jee", name: "JEE (Demo)" },
  { id: "neet", name: "NEET (Demo)" },
]

export const GATE_DOMAINS = [
  { id: "cse", name: "Computer Science" },
  { id: "ece", name: "Electronics (Demo)" },
  { id: "me", name: "Mechanical (Demo)" },
  { id: "ce", name: "Civil (Demo)" },
]

// ─── Exam descriptor ─────────────────────────────────────────────────────────

export interface ExamDescriptor {
  id: string
  name: string
  shortName: string
  totalMarks: number
  durationMinutes: number
  totalQuestions: number
  examDate: string
  markingRules: {
    mcqNegativeFraction: number
    msqAllOrNothing: boolean
    msqNegative: boolean
    natNegative: boolean
  }
}

export const GATE_CSE_EXAM: ExamDescriptor = {
  id: "gate-cse",
  name: "GATE Computer Science & Information Technology",
  shortName: "GATE CSE",
  totalMarks: 100,
  durationMinutes: 180,
  totalQuestions: 65,
  examDate: "2026-02-01",
  markingRules: {
    mcqNegativeFraction: 1 / 3,
    msqAllOrNothing: true,
    msqNegative: false,
    natNegative: false,
  },
}

export const ACTIVE_EXAM = GATE_CSE_EXAM

// ─── Helper Functions ───────────────────────────────────────────────────────

export function getActiveExamId(profile?: { exam?: string; domain?: string }): string {
  if (!profile || !profile.exam) return "gate-cse"
  if (profile.exam === "gate" && profile.domain) return `gate-${profile.domain}`
  return profile.exam
}

export interface SubjectInfo {
  id: string
  name: string
  weightage: number
  chapters?: { id: string; name: string }[]
}

function mapSubjects(subjects: any[]): SubjectInfo[] {
  return subjects
    .filter(item => item.marks > 0)
    .map((item) => ({
      id: item.subject.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: item.subject,
      weightage: item.marks,
      chapters: item.chapters,
    }))
}

export function getSubjectsForExam(activeExamId: string): SubjectInfo[] {
  switch (activeExamId) {
    case "gate-cse": return mapSubjects(GATE_CSE_SUBJECTS)
    case "jee": return mapSubjects(JEE_SUBJECTS)
    case "neet": return mapSubjects(NEET_SUBJECTS)
    case "gate-ece": return mapSubjects(GATE_ECE_SUBJECTS)
    case "gate-me": return mapSubjects(GATE_ME_SUBJECTS)
    case "gate-ce": return mapSubjects(GATE_CE_SUBJECTS)
    default: return mapSubjects(GATE_CSE_SUBJECTS)
  }
}

export function getQuestions(activeExamId: string): Question[] {
  switch (activeExamId) {
    case "gate-cse": return GATE_CSE_QUESTIONS
    case "jee": return JEE_QUESTIONS
    case "neet": return NEET_QUESTIONS
    case "gate-ece": return GATE_ECE_QUESTIONS
    case "gate-me": return GATE_ME_QUESTIONS
    case "gate-ce": return GATE_CE_QUESTIONS
    default: return GATE_CSE_QUESTIONS
  }
}

export function getTests(activeExamId: string): TestDefinition[] {
  switch (activeExamId) {
    case "gate-cse": return GATE_CSE_TESTS
    case "jee": return JEE_TESTS
    case "neet": return NEET_TESTS
    case "gate-ece": return GATE_ECE_TESTS
    case "gate-me": return GATE_ME_TESTS
    case "gate-ce": return GATE_CE_TESTS
    default: return GATE_CSE_TESTS
  }
}

export function getAllTests(): TestDefinition[] {
  const explicitTests = [
    ...GATE_CSE_TESTS,
    ...JEE_TESTS,
    ...NEET_TESTS,
    ...GATE_ECE_TESTS,
    ...GATE_ME_TESTS,
    ...GATE_CE_TESTS,
  ]

  const allQuestions = [
    ...GATE_CSE_QUESTIONS,
    ...JEE_QUESTIONS,
    ...NEET_QUESTIONS,
    ...GATE_ECE_QUESTIONS,
    ...GATE_ME_QUESTIONS,
    ...GATE_CE_QUESTIONS,
  ]

  const chapterTests: TestDefinition[] = []
  
  // We need to iterate over all exams to find all chapters
  const allExamIds = ["gate-cse", "jee", "neet", "gate-ece", "gate-me", "gate-ce"]
  
  for (const examId of allExamIds) {
    const subjects = getSubjectsForExam(examId)
    for (const sub of subjects) {
      if (sub.chapters) {
        for (const ch of sub.chapters) {
          // If a test with this chapter ID already exists explicitly, skip
          if (explicitTests.some(t => t.id === ch.id)) continue
          
          // Otherwise, auto-generate a test for this chapter
          // Find questions where topic matches the chapter name
          const questionIds = allQuestions
            .filter(q => q.subject === sub.name && q.topic === ch.name)
            .map(q => q.id)
            
          chapterTests.push({
            id: ch.id,
            title: `${ch.name} Chapter Drill`,
            kind: "drill",
            subject: sub.name,
            durationMinutes: 30,
            description: `Targeted practice on ${ch.name}.`,
            questionIds,
          })
        }
      }
    }
  }

  return [...explicitTests, ...chapterTests]
}

export function getTest(testId: string): TestDefinition | undefined {
  return getAllTests().find((t) => t.id === testId)
}

function mapConcepts(concepts: any[]): any[] {
  return concepts.map((c) => {
    if (c.label && c.summary) return c

    let kind = "definition"
    if (c.category) {
      const cat = c.category.toLowerCase()
      if (cat.includes("math") || cat.includes("algebra") || cat.includes("calc")) kind = "theorem"
      else if (cat.includes("mechanics") || cat.includes("physics")) kind = "formula"
      else kind = "technique"
    }

    return {
      id: c.id,
      subjectId: c.subjectId,
      chapterId: c.chapterId || c.subjectId,
      label: c.name || c.label || "Concept",
      summary: c.description || c.summary || "",
      kind,
      formula: c.formula,
      complexity: c.complexity,
      pseudocode: c.pseudocode,
      prerequisites: [],
      examRelevance: c.importance === "high" ? 5 : c.importance === "medium" ? 3 : 1,
    }
  })
}

export function getConcepts(activeExamId: string): any[] {
  switch (activeExamId) {
    case "gate-cse": return GATE_CSE_CONCEPTS
    case "jee": return mapConcepts(JEE_CONCEPTS)
    case "neet": return mapConcepts(NEET_CONCEPTS)
    case "gate-ece": return mapConcepts(GATE_ECE_CONCEPTS)
    case "gate-me": return mapConcepts(GATE_ME_CONCEPTS)
    case "gate-ce": return mapConcepts(GATE_CE_CONCEPTS)
    default: return GATE_CSE_CONCEPTS
  }
}

// ─── Registry interface ───────────────────────────────────────────────────────

export interface ExamRegistry {
  exam: ExamDescriptor
  getTopics(): Topic[]
  getSubjectWeightage(): typeof GATE_CSE_SUBJECTS
  getPhaseMeta(): typeof PHASE_META
  getDifficultyFactor(): typeof DIFFICULTY_FACTOR
  getHighWeightCutoff(): number
  priorityScore(t: Topic): number
  studyPhase(t: Topic): Phase
}

export const registry: ExamRegistry = {
  exam: GATE_CSE_EXAM,
  getTopics: () => TOPICS,
  getSubjectWeightage: () => GATE_CSE_SUBJECTS,
  getPhaseMeta: () => PHASE_META,
  getDifficultyFactor: () => DIFFICULTY_FACTOR,
  getHighWeightCutoff: () => HIGH_WEIGHT_CUTOFF,
  priorityScore,
  studyPhase,
}

export type { Topic, Trend, Difficulty, Depth, Phase }
