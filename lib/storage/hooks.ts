"use client"

/**
 * lib/storage/hooks.ts
 *
 * React hooks that wrap LocalStore. All UI state reads/writes go through here.
 * No component imports localStorage directly after this file exists.
 */

import { useCallback, useEffect, useState, useMemo, useRef } from "react"
import type { AppSettings, StoredAttempt, Question, DailyChallenge } from "../domain/types"
import { LOCAL_USER_ID, GATE_CSE_EXAM_ID, DEFAULT_SETTINGS } from "../domain/types"
import { QUESTIONS } from "../exams/gate-cse/question-bank"
import { getStore, COLLECTIONS } from "./store"
import type { Collection, CollectionTypeMap, Query } from "./store"
import { getTodayIsoDate, getDateOffsetIso, getDailyChallengeStreak, seedChallengeQuestionId } from "../analytics/selectors"
import { isCorrect, scoreAttempt } from "../test-types"
import type { Response } from "../test-types"

// ─── Generic collection hook ──────────────────────────────────────────────────

export interface UseCollectionResult<T> {
  data: T[]
  loading: boolean
  error: string | null
  put: (record: T) => Promise<void>
  remove: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

/**
 * Subscribes to a collection and returns live data.
 * Re-fetches on same-tab writes (gcc-store-change) and cross-tab writes
 * (storage event).
 */
export function useCollection<K extends Collection>(
  collection: K,
  query?: Query
): UseCollectionResult<CollectionTypeMap[K]> {
  const store = getStore()
  const [data, setData] = useState<CollectionTypeMap[K][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const queryStr = JSON.stringify(query)
  
  const fetch = useCallback(async () => {
    try {
      const records = await store.list(collection, query)
      setData(records)
      setError(store.lastError?.message ?? null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [collection, queryStr])

  useEffect(() => {
    fetch()

    const onStoreChange = (e: Event) => {
      const col = (e as CustomEvent<{ collection: string }>).detail?.collection
      if (col === collection || col === "all") fetch()
    }
    const onStorageEvent = (e: StorageEvent) => {
      if (e.key?.includes(collection) || e.key === null) fetch()
    }

    window.addEventListener("gcc-store-change", onStoreChange)
    window.addEventListener("storage", onStorageEvent)
    return () => {
      window.removeEventListener("gcc-store-change", onStoreChange)
      window.removeEventListener("storage", onStorageEvent)
    }
  }, [collection, fetch])

  const put = useCallback(
    async (record: CollectionTypeMap[K]) => {
      await store.put(collection, record)
    },
    [collection, store]
  )

  const remove = useCallback(
    async (id: string) => {
      await store.remove(collection, id)
    },
    [collection, store]
  )

  return { data, loading, error, put, remove, refresh: fetch }
}

import { getActiveExamId, getQuestions, getSubjectsForExam } from "../exams/registry"

// ─── useAttempts — backward-compatible replacement for lib/use-attempts.ts ───

export interface UseAttemptsResult {
  attempts: StoredAttempt[]
  ready: boolean
  save: (attempt: StoredAttempt) => Promise<void>
  remove: (id: string) => void
  clear: () => void
}

export function useAttempts(): UseAttemptsResult {
  const store = getStore()
  const { settings } = useSettings()
  const activeExamId = getActiveExamId(settings.profile)
  
  const query = useMemo(() => ({ where: { examId: activeExamId } }), [activeExamId])
  const { data, loading, put, remove: removeItem } = useCollection(COLLECTIONS.attempts, query)

  const save = useCallback(
    (attempt: StoredAttempt): Promise<void> => {
      const stamped: StoredAttempt = {
        ...attempt,
        userId: attempt.userId ?? LOCAL_USER_ID,
        examId: attempt.examId ?? activeExamId,
      }
      // Bug #1 fix: return the promise so callers can await it before navigating
      return put(stamped)
    },
    [put, activeExamId]
  )

  const remove = useCallback(
    (id: string) => {
      removeItem(id)
    },
    [removeItem]
  )

  const clear = useCallback(async () => {
    const all = await store.list(COLLECTIONS.attempts)
    for (const a of all) {
      await store.remove(COLLECTIONS.attempts, a.id)
    }
  }, [store])

  return {
    attempts: data as StoredAttempt[],
    ready: !loading,
    save,
    remove,
    clear,
  }
}

// ─── useSettings ──────────────────────────────────────────────────────────────

export function useSettings(): {
  settings: AppSettings
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>
  loading: boolean
} {
  const { data, loading, put } = useCollection(COLLECTIONS.settings)

  const settings: AppSettings = (data[0] as AppSettings | undefined) ?? {
    ...DEFAULT_SETTINGS,
    userId: LOCAL_USER_ID,
    examId: GATE_CSE_EXAM_ID,
  }

  const updateSettings = useCallback(
    async (patch: Partial<AppSettings>) => {
      await put({ ...settings, ...patch } as AppSettings)
    },
    [put, settings]
  )

  return { settings, updateSettings, loading }
}

// ─── getAttempt — one-time read for review page ───────────────────────────────

export async function getAttempt(id: string): Promise<StoredAttempt | null> {
  return getStore().get(COLLECTIONS.attempts, id)
}

// ─── newAttemptId — stable unique id factory ──────────────────────────────────

export function newAttemptId(): string {
  return `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

// ─── useQuestionBank ──────────────────────────────────────────────────────────

export function useQuestionBank(): {
  questions: Question[]
  questionMap: Map<string, Question>
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
} {
  const { data: userQuestions, loading, error, refresh } = useCollection(COLLECTIONS.questions)
  const { settings } = useSettings()
  const activeExamId = getActiveExamId(settings.profile)

  const questions = useMemo(() => {
    const merged = new Map<string, Question>()

    // 1. Static seed based on exam
    const staticQuestions = getQuestions(activeExamId)
    for (const q of staticQuestions) {
      merged.set(q.id, q as unknown as Question)
    }

    // 2. User-imported (wins on collision)
    for (const q of userQuestions) {
      merged.set(q.id, q)
    }

    return Array.from(merged.values())
  }, [userQuestions, activeExamId])

  const questionMap = useMemo(() => {
    return new Map(questions.map((q) => [q.id, q]))
  }, [questions])

  return { questions, questionMap, loading, error, refresh }
}

// ─── useTests ──────────────────────────────────────────────────────────

import { getTests, getConcepts } from "../exams/registry"

export function useTests() {
  const { settings } = useSettings()
  const activeExamId = getActiveExamId(settings.profile)
  return useMemo(() => getTests(activeExamId), [activeExamId])
}

export function useConcepts() {
  const { settings } = useSettings()
  const activeExamId = getActiveExamId(settings.profile)
  return useMemo(() => getConcepts(activeExamId), [activeExamId])
}

// ─── useDailyChallenge ────────────────────────────────────────────────────────

let globalSeededFor: string | null = null

export interface UseDailyChallengeResult {
  record: DailyChallenge | null
  question: Question | null
  streak: number
  loading: boolean
  submit: (response: Response) => Promise<{ correct: boolean; streak: number }>
  reroll: () => Promise<void>
}

export function useDailyChallenge(): UseDailyChallengeResult {
  const { settings } = useSettings()
  const { questions, questionMap, loading: questionsLoading } = useQuestionBank()
  const activeExamId = getActiveExamId(settings.profile)
  const SUBJECTS = useMemo(() => getSubjectsForExam(activeExamId), [activeExamId])
  const subjectProgress = useMemo(() => settings.subjectProgress || {}, [settings.subjectProgress])

  const today = getTodayIsoDate()
  const { data, loading: recordsLoading, put } = useCollection(COLLECTIONS.daily)

  const todayRecord = useMemo(
    () => data.find((r) => r.id === today) ?? null,
    [data, today],
  )

  const question = useMemo(
    () => (todayRecord ? questionMap.get(todayRecord.questionId) ?? null : null),
    [todayRecord, questionMap],
  )

  const rerollCountRef = useRef(0)

  // Seed today's challenge once per day, after questions are ready.
  useEffect(() => {
    if (questionsLoading || recordsLoading) return
    if (todayRecord) return
    if (globalSeededFor === today) return
    globalSeededFor = today
    const qid = seedChallengeQuestionId(questions, SUBJECTS, subjectProgress, today, 0)
    if (qid) {
      void put({
        userId: LOCAL_USER_ID,
        examId: activeExamId,
        id: today,
        questionId: qid,
        solved: false,
        correct: null,
        streak: 0,
      } satisfies DailyChallenge)
    }
  }, [questionsLoading, recordsLoading, todayRecord, today, questions, SUBJECTS, subjectProgress, put, activeExamId])

  const streak = useMemo(() => getDailyChallengeStreak(data, today), [data, today])

  const isSubmittingRef = useRef(false)
  const submit = useCallback(
    async (response: Response): Promise<{ correct: boolean; streak: number }> => {
      if (!todayRecord || !question) return { correct: false, streak: 0 }
      if (isSubmittingRef.current) return { correct: false, streak: 0 }
      // Day locked once answered — return the stored outcome.
      if (todayRecord.solved) {
        return { correct: todayRecord.correct === true, streak: todayRecord.streak }
      }

      isSubmittingRef.current = true
      try {
        const correct = isCorrect(question, response)
        const yesterday = data.find((r) => r.id === getDateOffsetIso(today, -1))
        const nextStreak = correct ? (yesterday?.correct ? yesterday.streak : 0) + 1 : 0
        const answeredAt = new Date().toISOString()

        await put({
          ...todayRecord,
          solved: true,
          correct,
          streak: nextStreak,
          answeredAt,
        } satisfies DailyChallenge)

        // Record a StoredAttempt (kind "daily") so it shows in history/analytics.
        const result = scoreAttempt([question], { [question.id]: response })
        void getStore().put(COLLECTIONS.attempts, {
          userId: LOCAL_USER_ID,
          examId: activeExamId,
          id: newAttemptId(),
          testId: `daily-${today}`,
          testTitle: "Daily Challenge",
          kind: "daily",
          subject: question.subject,
          questionIds: [question.id],
          submittedAt: answeredAt,
          durationSeconds: 0,
          responses: { [question.id]: response },
          timePerQuestion: {},
          markedForReview: [],
          scored: result.scored,
          totalMarks: result.totalMarks,
          correct: result.correct,
          wrong: result.wrong,
          skipped: result.skipped,
        } satisfies StoredAttempt)

        return { correct, streak: nextStreak }
      } finally {
        isSubmittingRef.current = false
      }
    },
    [todayRecord, question, data, today, put, activeExamId],
  )

  const reroll = useCallback(async () => {
    if (!todayRecord || todayRecord.solved) return
    const currentId = todayRecord.questionId
    rerollCountRef.current += 1
    let qid = seedChallengeQuestionId(questions, SUBJECTS, subjectProgress, today, rerollCountRef.current)
    if (qid === currentId && questions.length > 1) {
      rerollCountRef.current += 1
      qid = seedChallengeQuestionId(questions, SUBJECTS, subjectProgress, today, rerollCountRef.current)
    }
    if (qid && qid !== currentId) {
      await put({ ...todayRecord, questionId: qid } satisfies DailyChallenge)
    }
  }, [todayRecord, questions, SUBJECTS, subjectProgress, today, put])

  return {
    record: todayRecord,
    question,
    streak,
    loading: recordsLoading || questionsLoading,
    submit,
    reroll,
  }
}
