"use client"

/**
 * app/import/page.tsx
 *
 * In-app bulk question importer with live Zod validation, auto-repairs,
 * fuzzy subject mapping, duplicate side-by-side resolution, and merge commit.
 */

import { useState, useMemo, useRef, useTransition } from "react"
import Link from "next/link"
import {
  Upload,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  FileJson,
  Check,
  AlertTriangle,
  RefreshCw,
  Info,
  Trash2,
} from "lucide-react"
import { useQuestionBank } from "@/lib/storage/hooks"
import { getStore, COLLECTIONS } from "@/lib/storage/store"
import { cn } from "@/lib/utils"
import {
  validateQuestionRow,
  autoRepairQuestion,
  detectDuplicates,
  OFFICIAL_SUBJECTS,
  ValidationRowStatus,
} from "@/lib/storage/validation"
import type { Question } from "@/lib/domain/types"

type SubjectMapping = Record<string, string>

export default function ImportPage() {
  const { questions: existingBank, refresh: refreshBank } = useQuestionBank()
  const [rawText, setRawText] = useState("")
  const [parsedData, setParsedData] = useState<any[] | null>(null)
  const [validationStatuses, setValidationStatuses] = useState<ValidationRowStatus[]>([])
  
  // Mapping state: unrecognizedSubject -> officialSubject
  const [subjectMappings, setSubjectMappings] = useState<SubjectMapping>({})
  
  // Duplicate action state: incomingQuestionId -> "skip" | "replace" | "import"
  const [dupActions, setDupActions] = useState<Record<string, "skip" | "replace" | "import">>({})
  
  const [importReport, setImportReport] = useState<{
    added: number
    replaced: number
    skipped: number
  } | null>(null)

  const [isPending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  // ─── Live Validation & Parse ───────────────────────────────────────────────

  function handleParse(text: string) {
    if (!text.trim()) {
      setParsedData(null)
      setValidationStatuses([])
      return
    }
    try {
      const parsed = JSON.parse(text)
      const items = Array.isArray(parsed)
        ? parsed
        : parsed.questions && Array.isArray(parsed.questions)
        ? parsed.questions
        : null

      if (!items) {
        alert("Invalid format: Must be a JSON array of questions, or a JSON object with a 'questions' array key.")
        return
      }

      setParsedData(items)
      runValidation(items, subjectMappings)
      setImportReport(null)
    } catch (e) {
      alert(e instanceof Error ? `JSON Parse Error: ${e.message}` : "Invalid JSON format.")
    }
  }

  function runValidation(items: any[], mappings: SubjectMapping) {
    const statuses = items.map((item, index) => {
      // Apply manual mappings before validating
      const mappedSubject = mappings[item.subject] || item.subject
      const mappedItem = { ...item, subject: mappedSubject }
      return validateQuestionRow(mappedItem, index, OFFICIAL_SUBJECTS)
    })
    setValidationStatuses(statuses)

    // Initialise duplicate actions
    const dups = detectDuplicates(items, existingBank)
    const initialActions: Record<string, "skip" | "replace" | "import"> = {}
    for (const d of dups) {
      initialActions[d.incoming.id || ""] = "skip" // default action
    }
    setDupActions(initialActions)
  }

  // ─── Auto-Repairs ─────────────────────────────────────────────────────────────

  function handleAutoRepair() {
    if (!parsedData) return
    const repaired = parsedData.map((item, index) => autoRepairQuestion(item, index))
    setParsedData(repaired)
    setRawText(JSON.stringify(repaired, null, 2))
    
    // Reset mappings for newly repaired items (fuzzy matching will have mapped most subjects)
    setSubjectMappings({})
    runValidation(repaired, {})
  }

  // ─── File Drop Handling ──────────────────────────────────────────────────────

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const raw = ev.target?.result as string
      setRawText(raw)
      handleParse(raw)
    }
    reader.readAsText(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const raw = ev.target?.result as string
      setRawText(raw)
      handleParse(raw)
    }
    reader.readAsText(file)
  }

  // ─── Mapping unrecognized subjects ──────────────────────────────────────────

  const unrecognizedSubjects = useMemo(() => {
    if (!parsedData) return []
    const unrec = new Set<string>()
    for (const item of parsedData) {
      if (item.subject && !OFFICIAL_SUBJECTS.includes(item.subject)) {
        unrec.add(item.subject)
      }
    }
    return Array.from(unrec)
  }, [parsedData])

  function updateSubjectMapping(unrecSub: string, officialSub: string) {
    const nextMappings = { ...subjectMappings, [unrecSub]: officialSub }
    setSubjectMappings(nextMappings)
    if (parsedData) {
      runValidation(parsedData, nextMappings)
    }
  }

  // ─── Duplicates ─────────────────────────────────────────────────────────────

  const duplicatesList = useMemo(() => {
    if (!parsedData) return []
    return detectDuplicates(parsedData, existingBank)
  }, [parsedData, existingBank])

  // ─── Commit Import ──────────────────────────────────────────────────────────

  const canImport = useMemo(() => {
    if (validationStatuses.length === 0) return false
    
    // Check if there are any blocking errors (errors that are NOT warnings)
    const hasErrors = validationStatuses.some((status) => {
      if (status.status === "error") return true
      
      // If warning is about subject unrecognized, and it has not been mapped, it is a block
      return status.messages.some(
        (m) => m.field === "subject" && m.severity === "error"
      )
    })

    // Check if any unrecognized subject remains unmapped
    const hasUnmapped = unrecognizedSubjects.some((sub) => !subjectMappings[sub])

    return !hasErrors && !hasUnmapped
  }, [validationStatuses, unrecognizedSubjects, subjectMappings])

  async function handleCommitImport() {
    if (!parsedData || !canImport) return

    startTransition(async () => {
      const store = getStore()
      let added = 0
      let replaced = 0
      let skipped = 0

      for (const item of parsedData) {
        const mappedSubject = subjectMappings[item.subject] || item.subject
        const question: Question = {
          verified: false,
          ...item,
          subject: mappedSubject,
        }

        const isDup = duplicatesList.some((d) => d.incoming.id === question.id)
        const action = dupActions[question.id] || "import"

        if (isDup && action === "skip") {
          skipped++
          continue
        }

        if (isDup && action === "replace") {
          // Put will overwrite since store key is namespaced by question.id
          await store.put(COLLECTIONS.questions, question)
          replaced++
        } else {
          await store.put(COLLECTIONS.questions, question)
          added++
        }
      }

      await refreshBank()
      setImportReport({ added, replaced, skipped })
      
      // Reset
      setParsedData(null)
      setRawText("")
      setValidationStatuses([])
      setSubjectMappings({})
    })
  }

  return (
    <main className="min-h-dvh">
      <div className="mx-auto max-w-[1600px] px-4 py-12 md:px-8">
        {/* Header */}
        <div className="border-b border-border pb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
              content pipeline
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Question Importer
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Import bulk questions compiled by research LLMs. Validate inputs
              against the syllabus schemas, fuzzy map topics, and resolve duplicates.
            </p>
          </div>
          <Link
            href="/import/review"
            className="border border-border hover:border-primary px-3 py-1.5 min-h-11 font-mono text-[11px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
          >
            Open verification queue
          </Link>
        </div>

        {importReport && (
          <div className="mt-8 border border-primary bg-primary/5 p-4 flex items-start gap-3">
            <CheckCircle className="size-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h2 className="font-mono text-sm font-semibold text-primary uppercase tracking-wide">
                Import complete
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Successfully processed. Added{" "}
                <span className="text-foreground font-semibold font-mono">{importReport.added}</span>,
                replaced{" "}
                <span className="text-foreground font-semibold font-mono">{importReport.replaced}</span>,
                and skipped{" "}
                <span className="text-foreground font-semibold font-mono">{importReport.skipped}</span> questions.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Paste & Upload Area */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-border p-5 space-y-4">
              <h2 className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
                Input Data
              </h2>

              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Drop JSON files or browse"
                onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-border bg-muted/20 py-8 text-center transition-colors hover:border-primary hover:bg-primary/5"
              >
                <FileJson className="size-6 text-muted-foreground" aria-hidden="true" />
                <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                  Drop question .json here or click to browse
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".json,application/json"
                  className="sr-only"
                  onChange={handleFileChange}
                  aria-label="Upload question json file"
                />
              </div>

              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder='[{"subject": "Algorithms", "type": "MCQ", "text": "...", "answer": 2}]'
                rows={12}
                className="w-full resize-y border border-border bg-muted/10 p-3 font-mono text-[11px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                aria-label="Paste question JSON"
              />

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={!rawText.trim()}
                  onClick={() => handleParse(rawText)}
                  className="inline-flex items-center gap-1.5 border border-primary bg-primary px-4 py-2 min-h-11 font-mono text-[11px] tracking-wide text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  <Upload className="size-3.5" aria-hidden="true" />
                  Parse &amp; validate
                </button>

                <button
                  type="button"
                  disabled={!parsedData}
                  onClick={handleAutoRepair}
                  className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 min-h-11 font-mono text-[11px] text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-40"
                  title="Trim inputs, normalise option letters, coerce strings and check suggestions"
                >
                  <RefreshCw className="size-3.5" aria-hidden="true" />
                  Auto-repair
                </button>
              </div>
            </div>

            {/* Subject Mapper */}
            {unrecognizedSubjects.length > 0 && (
              <div className="border border-border p-5 space-y-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h2 className="font-mono text-[11px] tracking-[0.2em] text-amber-500 uppercase">
                      Syllabus Mapping Required
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Some questions have subject names not in the syllabus. Map them
                      manually before committing.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {unrecognizedSubjects.map((unrec) => (
                    <div key={unrec} className="flex items-center justify-between gap-3 border-b border-border pb-2 last:border-0">
                      <span className="font-mono text-[11px] truncate">{unrec}</span>
                      <select
                        value={subjectMappings[unrec] || ""}
                        onChange={(e) => updateSubjectMapping(unrec, e.target.value)}
                        className="border border-border bg-card px-2 py-1 font-mono text-[11px] max-w-[200px]"
                        aria-label={`Map subject ${unrec}`}
                      >
                        <option value="">Select subject…</option>
                        {OFFICIAL_SUBJECTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Validation & Duplication Reports */}
          <div className="lg:col-span-7 space-y-6">
            {/* Validation Table */}
            {validationStatuses.length > 0 ? (
              <div className="border border-border p-5 space-y-4">
                <h2 className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
                  Validation Queue ({validationStatuses.length} rows)
                </h2>

                <div className="overflow-x-auto border border-border">
                  <table className="w-full font-mono text-[11px] text-left">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-muted-foreground select-none">
                        <th className="px-3 py-2 font-normal">Index</th>
                        <th className="px-3 py-2 font-normal">ID</th>
                        <th className="px-3 py-2 font-normal">Status</th>
                        <th className="px-3 py-2 font-normal">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {validationStatuses.map((row) => (
                        <tr
                          key={row.index}
                          className="border-b border-border last:border-0 hover:bg-muted/10"
                        >
                          <td className="px-3 py-2 tabular-nums">{row.index + 1}</td>
                          <td className="px-3 py-2 text-muted-foreground max-w-[120px] truncate">
                            {row.id}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={cn(
                                "inline-flex px-1 py-0.5 uppercase text-[9px] font-semibold border",
                                row.status === "ok" && "border-primary bg-primary/10 text-primary",
                                row.status === "warning" && "border-amber-500 bg-amber-500/10 text-amber-500",
                                row.status === "error" && "border-destructive bg-destructive/10 text-destructive"
                              )}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs">
                            {row.messages.length > 0 ? (
                              <ul className="space-y-1">
                                {row.messages.map((m, i) => (
                                  <li key={i} className="text-muted-foreground">
                                    <span className="text-foreground font-semibold">{m.field}</span>:{" "}
                                    {m.message}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-primary/70">Ready to import</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Duplicates resolving */}
                {duplicatesList.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <h3 className="font-mono text-[11px] tracking-[0.2em] text-amber-500 uppercase">
                          Duplicate records detected ({duplicatesList.length})
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Match found by text hash or source citation. Choose action:
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {duplicatesList.map((dup) => {
                        const id = dup.incoming.id || ""
                        return (
                          <div
                            key={id}
                            className="border border-border p-3 space-y-2 text-xs"
                          >
                            <div className="flex items-center justify-between border-b border-border pb-1">
                              <span className="font-mono text-[10px] font-semibold">
                                ID: {id} ({dup.reason})
                              </span>
                              <div className="flex items-center gap-2">
                                {(["skip", "replace"] as const).map((act) => (
                                  <button
                                    key={act}
                                    type="button"
                                    onClick={() =>
                                      setDupActions((prev) => ({ ...prev, [id]: act }))
                                    }
                                    className={cn(
                                      "border px-2 py-0.5 font-mono text-[9px] uppercase transition-colors",
                                      (dupActions[id] || "skip") === act
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border text-muted-foreground hover:text-foreground"
                                    )}
                                  >
                                    {act}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <p className="font-mono text-[9px] text-muted-foreground">Incoming text:</p>
                                <p className="mt-1 line-clamp-3 text-muted-foreground">{dup.incoming.text}</p>
                              </div>
                              <div>
                                <p className="font-mono text-[9px] text-muted-foreground">Existing text:</p>
                                <p className="mt-1 line-clamp-3 text-muted-foreground">{dup.existing.text}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-6 border-t border-border pt-4 flex items-center justify-between">
                  <div>
                    {canImport ? (
                      <p className="text-xs text-primary flex items-center gap-1.5">
                        <Check className="size-4 shrink-0" aria-hidden="true" />
                        All validations pass. Ready to commit.
                      </p>
                    ) : (
                      <p className="text-xs text-destructive flex items-center gap-1.5">
                        <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
                        Resolve errors or unrecognized mappings first.
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={!canImport || isPending}
                    onClick={handleCommitImport}
                    className="inline-flex items-center gap-1.5 border border-primary bg-primary px-5 py-2.5 font-mono text-[11px] tracking-widest text-primary-foreground uppercase transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    Commit Import
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-border p-12 text-center h-full flex flex-col items-center justify-center bg-card/10">
                <Info className="size-6 text-muted-foreground" aria-hidden="true" />
                <h3 className="mt-3 font-semibold">No questions loaded</h3>
                <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                  Paste JSON questions array or upload a file on the left, then click
                  &quot;Parse &amp; validate&quot; to begin validation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
