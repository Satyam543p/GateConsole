import { z } from "zod"
import type { Question } from "../domain/types"

// Official GATE CSE Subjects
export const OFFICIAL_SUBJECTS = [
  "Algorithms",
  "Data Structures",
  "Operating Systems",
  "DBMS",
  "Computer Networks",
  "Theory of Computation",
  "Compiler Design",
  "Digital Logic",
  "Computer Organization & Architecture",
  "Discrete Mathematics",
  "Engineering Mathematics",
  "Aptitude",
]

// ─── Simple Levenshtein distance for fuzzy matching ──────────────────────────

export function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length
  const n = s2.length
  const d: number[][] = []
  for (let i = 0; i <= m; i++) d[i] = [i]
  for (let j = 0; j <= n; j++) d[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1].toLowerCase() === s2[j - 1].toLowerCase() ? 0 : 1
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      )
    }
  }
  return d[m][n]
}

export function findClosestSubject(subject: string): string | null {
  const clean = subject.trim().toLowerCase()
  if (!clean) return null

  // Exact or substring match first
  for (const official of OFFICIAL_SUBJECTS) {
    if (official.toLowerCase() === clean) return official
    if (official.toLowerCase().includes(clean) || clean.includes(official.toLowerCase())) {
      return official
    }
  }

  // Fallback to Levenshtein distance
  let minDistance = Infinity
  let closest: string | null = null

  for (const official of OFFICIAL_SUBJECTS) {
    const d = levenshteinDistance(clean, official.toLowerCase())
    if (d < minDistance && d <= 4) { // Only suggest if fairly close
      minDistance = d
      closest = official
    }
  }

  return closest
}

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

// Base schema for validation
export const RawQuestionSchema = z.object({
  id: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  topic: z.string().optional(),
  type: z.enum(["MCQ", "MSQ", "NAT"]),
  marks: z.union([z.literal(1), z.literal(2), z.literal(4), z.literal(1.0), z.literal(2.0), z.literal(4.0)]).optional(),
  text: z.string().min(5, "Question text must be at least 5 chars"),
  code: z.string().optional(),
  options: z.array(z.string()).optional(),
  answer: z.any(),
  explanation: z.string().optional(),
  source: z.string().optional(),
  expectedSeconds: z.number().optional(),
  conceptIds: z.array(z.string()).optional(),
  year: z.number().optional(),
  paper: z.string().optional(),
  questionNumber: z.number().optional(),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
  verified: z.boolean().optional(),
  verificationSource: z.string().optional(),
  confidence: z.enum(["low", "medium", "high"]).optional(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
  answerAliases: z.array(z.string()).optional(),
})

export type ValidationRowStatus = {
  index: number
  id: string
  status: "ok" | "warning" | "error"
  messages: { field: string; message: string; severity: "warning" | "error" }[]
}

// Helper to normalize question text for duplication hashing
export function getQuestionTextHash(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // strip punctuation
    .replace(/\s+/g, "") // strip all whitespace
}

// ─── Verification & Validation pipeline ──────────────────────────────────────

export function validateQuestionRow(
  raw: any,
  index: number,
  existingSubjects: string[] = OFFICIAL_SUBJECTS
): ValidationRowStatus {
  const id = raw.id || `row-${index}`
  const messages: ValidationRowStatus["messages"] = []

  const parsed = RawQuestionSchema.safeParse(raw)

  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      messages.push({
        field: issue.path.join("."),
        message: issue.message,
        severity: "error",
      })
    }
  } else {
    // Structural checks beyond Zod
    const data = parsed.data

    // 1. Verify subject
    if (!existingSubjects.includes(data.subject)) {
      const closest = findClosestSubject(data.subject)
      messages.push({
        field: "subject",
        message: closest
          ? `Subject "${data.subject}" unrecognized. Suggest mapping to "${closest}".`
          : `Subject "${data.subject}" unrecognized. Map manually before importing.`,
        severity: closest ? "warning" : "error",
      })
    }

    // 2. MCQ Check: must have options, answer must be number in bounds
    if (data.type === "MCQ") {
      if (!data.options || data.options.length === 0) {
        messages.push({
          field: "options",
          message: "MCQ questions must have an options array.",
          severity: "error",
        })
      } else {
        const ans = Number(data.answer)
        if (Number.isNaN(ans) || ans < 0 || ans >= data.options.length) {
          messages.push({
            field: "answer",
            message: `MCQ answer must be index between 0 and ${data.options.length - 1}.`,
            severity: "error",
          })
        }
      }
    }

    // 3. MSQ Check: must have options, answer must be array of indices in bounds
    if (data.type === "MSQ") {
      if (!data.options || data.options.length === 0) {
        messages.push({
          field: "options",
          message: "MSQ questions must have an options array.",
          severity: "error",
        })
      } else {
        const answers = Array.isArray(data.answer) ? data.answer : [data.answer]
        const cleanAnswers = answers.map((a: any) => Number(a))
        if (cleanAnswers.some((a) => Number.isNaN(a) || a < 0 || a >= (data.options?.length ?? 4))) {
          messages.push({
            field: "answer",
            message: "MSQ answer indices are out of options bounds.",
            severity: "error",
          })
        }
      }
    }

    // 4. NAT Check: answer must be a number or a range { min, max }
    if (data.type === "NAT") {
      const ans = data.answer
      const isNum = typeof ans === "number" || (!Number.isNaN(Number(ans)) && typeof ans !== "object")
      const isRange = ans && typeof ans === "object" && typeof ans.min === "number" && typeof ans.max === "number"
      if (!isNum && !isRange) {
        messages.push({
          field: "answer",
          message: "NAT answer must be a number or a tolerance range { min, max }.",
          severity: "error",
        })
      }
    }
  }

  const hasError = messages.some((m) => m.severity === "error")
  const hasWarning = messages.some((m) => m.severity === "warning")

  return {
    index,
    id,
    status: hasError ? "error" : hasWarning ? "warning" : "ok",
    messages,
  }
}

// ─── Auto-Repairs ─────────────────────────────────────────────────────────────

export function autoRepairQuestion(raw: any, index: number): any {
  const rep = { ...raw }

  // Auto-apply trim to all root string fields and array of strings
  for (const k of ["id", "subject", "topic", "text", "code", "explanation", "source", "verificationSource"]) {
    if (typeof rep[k] === "string") {
      rep[k] = rep[k].trim()
    }
  }
  if (Array.isArray(rep.options)) {
    rep.options = rep.options.map((o: any) => (typeof o === "string" ? o.trim() : o))
  }

  // 2. Coerce numbers
  if (rep.marks !== undefined && rep.marks !== null) {
    const coerced = parseInt(rep.marks, 10)
    if (coerced === 1 || coerced === 2 || coerced === 4) rep.marks = coerced
  }
  if (rep.year !== undefined && rep.year !== null) {
    const coerced = parseInt(rep.year, 10)
    if (!isNaN(coerced)) rep.year = coerced
  }
  if (rep.questionNumber !== undefined && rep.questionNumber !== null) {
    const coerced = parseInt(rep.questionNumber, 10)
    if (!isNaN(coerced)) rep.questionNumber = coerced
  }
  if (rep.difficulty !== undefined && rep.difficulty !== null) {
    const coerced = parseInt(rep.difficulty, 10)
    if ([1, 2, 3, 4, 5].includes(coerced)) rep.difficulty = coerced
  }
  if (rep.expectedSeconds !== undefined && rep.expectedSeconds !== null) {
    const coerced = parseInt(rep.expectedSeconds, 10)
    if (!isNaN(coerced)) rep.expectedSeconds = coerced
  }

  // 3. Infer marks from type if not set
  if (rep.marks === undefined || isNaN(Number(rep.marks))) {
    rep.marks = 1 // default
  }

  // 4. Generate stable ID if missing
  if (!rep.id) {
    const subSlug = (rep.subject || "unk").toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 8)
    rep.id = `imp-${subSlug}-${Date.now().toString(36)}-${index}`
  }

  // 5. Normalise MCQ/MSQ option letters A,B,C,D to numbers 0,1,2,3
  const letters = ["A", "B", "C", "D"]
  if (rep.type === "MCQ" && typeof rep.answer === "string") {
    const idx = letters.indexOf(rep.answer.trim().toUpperCase())
    if (idx !== -1) rep.answer = idx
  }
  if (rep.type === "MSQ" && typeof rep.answer === "string") {
    // split by comma or spaces, map
    const split = rep.answer.split(/[,\s]+/)
    const parsed = split.map((s: string) => letters.indexOf(s.trim().toUpperCase())).filter((x: number) => x !== -1)
    if (parsed.length > 0) rep.answer = parsed
  }
  if (rep.type === "MSQ" && Array.isArray(rep.answer)) {
    rep.answer = rep.answer.map((x: any) => {
      if (typeof x === "string") {
        const idx = letters.indexOf(x.trim().toUpperCase())
        return idx !== -1 ? idx : x
      }
      return x
    })
  }

  // 6. Normalise NAT answers
  if (rep.type === "NAT") {
    if (typeof rep.answer === "string") {
      const parsed = parseFloat(rep.answer)
      if (!isNaN(parsed)) rep.answer = parsed
    }
  }

  // 7. Fuzzy match subject name
  if (rep.subject) {
    const matched = findClosestSubject(rep.subject)
    if (matched) rep.subject = matched
  }

  return rep
}

// ─── Duplicate Checker ────────────────────────────────────────────────────────

export type DuplicatePair = {
  incoming: any
  existing: Question
  reason: "text_hash" | "source_citation"
}

export function detectDuplicates(
  incoming: any[],
  existingBank: Question[]
): DuplicatePair[] {
  const duplicates: DuplicatePair[] = []

  // Create lookup tables for existing
  const textHashes = new Map<string, Question>()
  const sourceCitations = new Map<string, Question>()

  for (const q of existingBank) {
    const textHash = getQuestionTextHash(q.text)
    textHashes.set(textHash, q)

    if (q.source) {
      const cleanSource = q.source.trim().toLowerCase()
      sourceCitations.set(cleanSource, q)
    }
  }

  for (const inc of incoming) {
    // Check text hash first
    const incTextHash = getQuestionTextHash(inc.text || "")
    const textDup = textHashes.get(incTextHash)
    if (textDup) {
      duplicates.push({
        incoming: inc,
        existing: textDup,
        reason: "text_hash",
      })
      continue
    }

    // Check source year & number citation
    if (inc.source) {
      const incCleanSource = inc.source.trim().toLowerCase()
      const srcDup = sourceCitations.get(incCleanSource)
      if (srcDup) {
        duplicates.push({
          incoming: inc,
          existing: srcDup,
          reason: "source_citation",
        })
      }
    }
  }

  return duplicates
}
