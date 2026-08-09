"use client"

/**
 * lib/storage/hooks.ts
 *
 * React hooks that wrap LocalStore. All UI state reads/writes go through here.
 * No component imports localStorage directly after this file exists.
 */

import { useCallback, useEffect, useState, useMemo } from "react"
import type { AppSettings, StoredAttempt, Question } from "../domain/types"
import { LOCAL_USER_ID, GATE_CSE_EXAM_ID, DEFAULT_SETTINGS } from "../domain/types"
import { QUESTIONS } from "../exams/gate-cse/question-bank"
import { getStore, COLLECTIONS } from "./store"
import type { Collection, CollectionTypeMap, Query } from "./store"

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection])

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

import { getActiveExamId, getQuestions } from "../exams/registry"

// ─── useAttempts — backward-compatible replacement for lib/use-attempts.ts ───

export interface UseAttemptsResult {
  attempts: StoredAttempt[]
  ready: boolean
  save: (attempt: StoredAttempt) => void
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
    (attempt: StoredAttempt) => {
      const stamped: StoredAttempt = {
        ...attempt,
        userId: attempt.userId ?? LOCAL_USER_ID,
        examId: attempt.examId ?? activeExamId,
      }
      put(stamped)
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

