/**
 * lib/storage/store.ts
 *
 * Async StudyStore interface + LocalStore (localStorage-backed) implementation.
 *
 * Architecture:
 *  - All UI reads/writes go through this interface.
 *  - No component or hook may touch localStorage directly.
 *  - Every call is async (resolves instantly for LocalStore) so swapping in a
 *    network store later changes no call sites.
 *  - Namespaced keys: gcc:v{schemaVersion}:{collection}
 *  - Schema version + MIGRATIONS array for forward migrations.
 *  - Quota errors and corrupt JSON are caught and reported; never thrown to UI.
 */

import type {
  StoredAttempt,
  AppSettings,
  MistakeEntry,
  SrsCard,
  StudySession,
  PlanBlock,
  ConceptNote,
  Question,
  StoredExamResult,
  DailyChallenge,
} from "../domain/types"
import { LOCAL_USER_ID, GATE_CSE_EXAM_ID } from "../domain/types"

// ─── Collections ──────────────────────────────────────────────────────────────

export const COLLECTIONS = {
  attempts:   "attempts",
  mistakes:   "mistakes",
  srsCards:   "srs-cards",
  sessions:   "sessions",
  planBlocks: "plan-blocks",
  notes:      "notes",
  questions:  "questions",   // user-imported questions (P1)
  settings:   "settings",
  examResults: "exam-results",
  daily:      "daily",
} as const

export type Collection = typeof COLLECTIONS[keyof typeof COLLECTIONS]

// Map collection name → its TypeScript type
export type CollectionTypeMap = {
  attempts:   StoredAttempt
  mistakes:   MistakeEntry
  "srs-cards": SrsCard
  sessions:   StudySession
  "plan-blocks": PlanBlock
  notes:      ConceptNote
  questions:  import("../domain/types").Question
  settings:   AppSettings
  "exam-results": StoredExamResult
  daily:      DailyChallenge
}

// ─── Backup / import types ────────────────────────────────────────────────────

export interface StudyBackup {
  version: number
  exportedAt: string
  examId: string
  userId: string
  data: Partial<{
    [K in Collection]: unknown[]
  }>
}

export interface ImportReport {
  mode: "merge" | "replace"
  collections: {
    [K in Collection]?: {
      total: number
      added: number
      updated: number
      skipped: number
    }
  }
  errors: string[]
}

// ─── Query helper ─────────────────────────────────────────────────────────────

export interface Query {
  /** Filter by a top-level string field value */
  where?: Record<string, unknown>
  /** Sort by a top-level field */
  orderBy?: { field: string; direction?: "asc" | "desc" }
  limit?: number
}

// ─── StorageError ─────────────────────────────────────────────────────────────

export type StorageErrorKind = "quota-exceeded" | "corrupt-json" | "unknown"

export interface StorageError {
  kind: StorageErrorKind
  message: string
  collection?: Collection
}

// ─── StudyStore interface ─────────────────────────────────────────────────────

export interface StudyStore {
  /** List records in a collection, optionally filtered and sorted. */
  list<K extends Collection>(
    collection: K,
    query?: Query
  ): Promise<CollectionTypeMap[K][]>

  /** Get a single record by id. Returns null if not found. */
  get<K extends Collection>(
    collection: K,
    id: string
  ): Promise<CollectionTypeMap[K] | null>

  /** Upsert a record (insert or replace by id). */
  put<K extends Collection>(
    collection: K,
    record: CollectionTypeMap[K]
  ): Promise<CollectionTypeMap[K]>

  /** Remove a record by id. No-op if not found. */
  remove(collection: Collection, id: string): Promise<void>

  /** Export all collections into a single versioned backup blob. */
  exportAll(): Promise<StudyBackup>

  /**
   * Import a backup blob.
   * "merge"   → update existing records, add new ones, keep unreferenced ones.
   * "replace" → wipe each collection present in the backup, then insert.
   */
  importAll(
    backup: StudyBackup,
    mode: "merge" | "replace"
  ): Promise<ImportReport>

  /** Last error observed, if any. Null means healthy. */
  lastError: StorageError | null
}

// ─── Schema version + migrations ─────────────────────────────────────────────

const SCHEMA_VERSION = 2

type Migration = {
  version: number
  description: string
  up: (raw: Record<string, string>) => Record<string, string>
}

/**
 * Each migration receives the raw localStorage key→value map and returns the
 * updated map. Migrations run in order from the stored version to SCHEMA_VERSION.
 * Add new entries here when the stored shape changes — never mutate old ones.
 */
export const MIGRATIONS: Migration[] = [
  // v0 → v1: normalize the old flat gate-attempts-v1 key into the new
  //           namespaced collection format.
  {
    version: 1,
    description: "Migrate gate-attempts-v1 flat key to gcc:v1:attempts",
    up(raw) {
      const oldKey = "gate-attempts-v1"
      const newKey = `gcc:v1:attempts`
      if (raw[oldKey] && !raw[newKey]) {
        try {
          const parsed = JSON.parse(raw[oldKey])
          if (Array.isArray(parsed)) {
            // Stamp userId/examId onto legacy records that lack them
            const stamped = parsed.map((a: StoredAttempt) => ({
              ...a,
              userId: a.userId ?? LOCAL_USER_ID,
              examId: a.examId ?? GATE_CSE_EXAM_ID,
            }))
            const next = { ...raw }
            next[newKey] = JSON.stringify(stamped)
            delete next[oldKey]
            return next
          }
        } catch {
          // corrupt old data — skip migration for this key
        }
      }
      return raw
    },
  },
  {
    version: 2,
    description: "Initialize examResults collection if absent",
    up(raw) {
      // Nothing really needed since empty collection defaults to [] on read
      return raw
    }
  }
]

// ─── LocalStore ───────────────────────────────────────────────────────────────

const KEY_PREFIX = "gcc"

function storageKey(collection: Collection): string {
  return `${KEY_PREFIX}:v${SCHEMA_VERSION}:${collection}`
}

const META_KEY = `${KEY_PREFIX}:meta`

interface StoreMeta {
  schemaVersion: number
  lastExportAt?: string
}

function readMeta(): StoreMeta {
  if (typeof window === "undefined") return { schemaVersion: SCHEMA_VERSION }
  try {
    const raw = window.localStorage.getItem(META_KEY)
    if (!raw) return { schemaVersion: 0 }
    return JSON.parse(raw) as StoreMeta
  } catch {
    return { schemaVersion: 0 }
  }
}

function writeMeta(meta: StoreMeta): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(META_KEY, JSON.stringify(meta))
  } catch {
    // quota — non-fatal for meta
  }
}

function runMigrations(): void {
  if (typeof window === "undefined") return
  const meta = readMeta()
  let currentVersion = meta.schemaVersion

  if (currentVersion >= SCHEMA_VERSION) return

  // Snapshot all localStorage entries
  const raw: Record<string, string> = {}
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i)
    if (k) raw[k] = window.localStorage.getItem(k) ?? ""
  }

  // Apply pending migrations
  let updated = raw
  for (const migration of MIGRATIONS) {
    if (migration.version > currentVersion) {
      try {
        updated = migration.up(updated)
        currentVersion = migration.version
      } catch (e) {
        console.error(`[store] Migration v${migration.version} failed:`, e)
      }
    }
  }

  // Write back all changed keys
  for (const [k, v] of Object.entries(updated)) {
    if (v !== raw[k]) {
      try {
        window.localStorage.setItem(k, v)
      } catch {
        // quota — skip this key
      }
    }
  }
  // Remove keys that migrations deleted
  for (const k of Object.keys(raw)) {
    if (!(k in updated)) {
      window.localStorage.removeItem(k)
    }
  }

  writeMeta({ ...meta, schemaVersion: SCHEMA_VERSION })
}

// ─── LocalStore implementation ────────────────────────────────────────────────

class LocalStoreImpl implements StudyStore {
  lastError: StorageError | null = null

  private _migrated = false

  private ensureMigrated(): void {
    if (!this._migrated) {
      runMigrations()
      this._migrated = true
    }
  }

  private readCollection<T>(collection: Collection): T[] {
    if (typeof window === "undefined") return []
    this.ensureMigrated()
    const key = storageKey(collection)
    try {
      const raw = window.localStorage.getItem(key)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return []
      this.lastError = null
      return parsed as T[]
    } catch {
      this.lastError = {
        kind: "corrupt-json",
        message: `Collection "${collection}" contains corrupt JSON.`,
        collection,
      }
      return []
    }
  }

  private writeCollection<T>(collection: Collection, records: T[]): StorageError | null {
    if (typeof window === "undefined") return null
    const key = storageKey(collection)
    try {
      window.localStorage.setItem(key, JSON.stringify(records))
      this.lastError = null
      return null
    } catch (e) {
      const err: StorageError = {
        kind:
          e instanceof DOMException && e.name === "QuotaExceededError"
            ? "quota-exceeded"
            : "unknown",
        message: e instanceof Error ? e.message : "Unknown storage error",
        collection,
      }
      this.lastError = err
      return err
    }
  }

  private getActiveExamId(): string {
    const settings = this.readCollection<AppSettings>("settings")[0]
    const profile = (settings as any)?.profile
    if (!profile || !profile.exam) return "gate-cse"
    if (profile.exam === "gate" && profile.domain) return `gate-${profile.domain}`
    return profile.exam
  }

  async list<K extends Collection>(
    collection: K,
    query?: Query
  ): Promise<CollectionTypeMap[K][]> {
    let records = this.readCollection<CollectionTypeMap[K]>(collection)

    // Automatically scope exam-specific collections
    if (collection !== "settings" && collection !== "questions") {
      const activeExamId = this.getActiveExamId()
      records = records.filter(r => (r as any).examId === activeExamId || !(r as any).examId)
    }

    if (query?.where) {
      const conditions = query.where
      records = records.filter((r) =>
        Object.entries(conditions).every(
          ([k, v]) => (r as unknown as Record<string, unknown>)[k] === v
        )
      )
    }

    if (query?.orderBy) {
      const { field, direction = "asc" } = query.orderBy
      records = [...records].sort((a, b) => {
        const av = (a as unknown as Record<string, unknown>)[field]
        const bv = (b as unknown as Record<string, unknown>)[field]
        if (av == null && bv == null) return 0
        if (av == null) return direction === "asc" ? -1 : 1
        if (bv == null) return direction === "asc" ? 1 : -1
        if (av < bv) return direction === "asc" ? -1 : 1
        if (av > bv) return direction === "asc" ? 1 : -1
        return 0
      })
    }

    if (query?.limit) {
      records = records.slice(0, query.limit)
    }

    return records
  }

  async get<K extends Collection>(
    collection: K,
    id: string
  ): Promise<CollectionTypeMap[K] | null> {
    const records = this.readCollection<CollectionTypeMap[K]>(collection)
    const record = records.find((r) => (r as { id: string }).id === id) ?? null
    
    // Enforce scoping on direct get if applicable
    if (record && collection !== "settings" && collection !== "questions") {
      if ((record as any).examId && (record as any).examId !== this.getActiveExamId()) {
        return null
      }
    }
    return record
  }

  async put<K extends Collection>(
    collection: K,
    record: CollectionTypeMap[K]
  ): Promise<CollectionTypeMap[K]> {
    // Automatically stamp new records with the active examId if applicable
    if (collection !== "settings" && collection !== "questions") {
      const rec = record as any
      if (!rec.examId) {
        rec.examId = this.getActiveExamId()
      }
      if (!rec.userId) {
        rec.userId = "local"
      }
    }

    const records = this.readCollection<CollectionTypeMap[K]>(collection)
    const id = (record as { id: string }).id
    const idx = records.findIndex((r) => (r as { id: string }).id === id)
    if (idx >= 0) {
      records[idx] = record
    } else {
      records.unshift(record) // newest first
    }
    this.writeCollection(collection, records)
    // Notify same-tab listeners (cross-tab is handled by the 'storage' event)
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("gcc-store-change", { detail: { collection } }))
    }
    return record
  }

  async remove(collection: Collection, id: string): Promise<void> {
    const records = this.readCollection<{ id: string }>(collection)
    const next = records.filter((r) => r.id !== id)
    this.writeCollection(collection, next)
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("gcc-store-change", { detail: { collection } }))
    }
  }

  async exportAll(): Promise<StudyBackup> {
    this.ensureMigrated()
    const data: StudyBackup["data"] = {}
    for (const col of Object.values(COLLECTIONS) as Collection[]) {
      // Export all records from localStorage directly so backup includes all exams
      const records = this.readCollection(col)
      if (records.length > 0) {
        data[col] = records
      }
    }

    const backup: StudyBackup = {
      version: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      examId: this.getActiveExamId(),
      userId: LOCAL_USER_ID,
      data,
    }

    // Record the export timestamp in meta for the stale-backup banner
    const meta = readMeta()
    writeMeta({ ...meta, lastExportAt: backup.exportedAt })

    // Also persist last-export time in settings collection so it survives
    // meta key loss (belt-and-suspenders)
    const settingsRecords = this.readCollection<AppSettings>("settings")
    const settings = settingsRecords[0]
    if (settings) {
      await this.put("settings", { ...settings, lastExportAt: backup.exportedAt })
    }

    return backup
  }

  async importAll(backup: StudyBackup, mode: "merge" | "replace"): Promise<ImportReport> {
    this.ensureMigrated()
    const report: ImportReport = { mode, collections: {}, errors: [] }

    if (!backup?.data || typeof backup.data !== "object") {
      report.errors.push("Backup has no valid data object.")
      return report
    }

    const backupExamId = backup.examId || this.getActiveExamId()

    for (const [col, incoming] of Object.entries(backup.data) as [Collection, unknown[]][]) {
      if (!incoming || !Array.isArray(incoming)) continue

      const existing = this.readCollection<{ id: string }>(col)
      const existingById = new Map(existing.map((r) => [r.id, r]))

      let added = 0
      let updated = 0
      let skipped = 0

      if (mode === "replace") {
        // Wipe and insert all incoming records
        const stamped = incoming.map((r) => ({
          userId: LOCAL_USER_ID,
          examId: backupExamId,
          ...(r as object),
        }))
        const err = this.writeCollection(col, stamped as unknown as { id: string }[])
        if (err) report.errors.push(`${col}: ${err.message}`)
        added = incoming.length
      } else {
        // Merge: update existing, add new
        const merged = [...existing]
        for (const item of incoming) {
          const r = item as { id?: string }
          if (!r.id) { skipped++; continue }
          if (existingById.has(r.id)) {
            const idx = merged.findIndex((e) => e.id === r.id)
            merged[idx] = { ...r, id: r.id, userId: (r as {userId?: string}).userId ?? LOCAL_USER_ID, examId: (r as {examId?: string}).examId ?? backupExamId } as { id: string }
            updated++
          } else {
            merged.push({ ...r, id: r.id!, userId: (r as {userId?: string}).userId ?? LOCAL_USER_ID, examId: (r as {examId?: string}).examId ?? backupExamId } as { id: string })
            added++
          }
        }
        const err = this.writeCollection(col, merged)
        if (err) report.errors.push(`${col}: ${err.message}`)
      }

      report.collections[col] = {
        total: incoming.length,
        added,
        updated,
        skipped,
      }
    }

    // Notify all hooks
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("gcc-store-change", { detail: { collection: "all" } }))
    }

    return report
  }
}

// ─── Singleton export ─────────────────────────────────────────────────────────

let _store: LocalStoreImpl | null = null

/**
 * Get the active StudyStore singleton.
 * Server-side calls are safe — reads/writes are no-ops server-side.
 */
export function getStore(): StudyStore {
  if (!_store) _store = new LocalStoreImpl()
  return _store
}

// ─── Last-export timestamp (for the stale-backup banner) ─────────────────────

export function getLastExportTimestamp(): string | null {
  if (typeof window === "undefined") return null
  try {
    const meta = readMeta()
    return meta.lastExportAt ?? null
  } catch {
    return null
  }
}

export async function getQuestionBank(): Promise<Question[]> {
  const store = getStore()
  const userQuestions = await store.list(COLLECTIONS.questions)
  const merged = new Map<string, Question>()

  // 1. Curated seed questions
  const { QUESTIONS } = await import("../exams/gate-cse/question-bank")
  for (const q of QUESTIONS) {
    merged.set(q.id, q as unknown as Question)
  }

  // 2. User-imported questions (override on collision)
  for (const q of userQuestions) {
    merged.set(q.id, q)
  }

  return Array.from(merged.values())
}

// ─── Type re-exports so importers don't need two imports ─────────────────────

export type { AppSettings, StoredAttempt, MistakeEntry, SrsCard, StudySession, PlanBlock, ConceptNote, Question, StoredExamResult, DailyChallenge }
