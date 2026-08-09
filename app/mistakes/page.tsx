"use client"

/**
 * app/mistakes/page.tsx — MISTAKE NOTEBOOK
 *
 * Primary hub for analyzing errors, tagging causes, detecting repeat offenders,
 * and generating custom "Drill Unresolved" practice sessions.
 */

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  CheckCircle2,
  Tag,
  Filter,
  Play,
  RotateCcw,
  BookOpen,
  Check,
  X,
  Edit2,
} from "lucide-react"
import { useCollection, useQuestionBank } from "@/lib/storage/hooks"
import { COLLECTIONS, getStore } from "@/lib/storage/store"
import { MISTAKE_CAUSES } from "@/components/result-review"
import type { MistakeEntry, MistakeCause, Question } from "@/lib/domain/types"
import { cn } from "@/lib/utils"

type GroupBy = "unresolved" | "cause" | "subject" | "all"

export default function MistakesPage() {
  const router = useRouter()
  const { data: mistakes, put: putMistake, remove: removeMistake, loading: mistakesLoading } = useCollection(COLLECTIONS.mistakes)
  const { questionMap, loading: bankLoading } = useQuestionBank()

  const [groupBy, setGroupBy] = useState<GroupBy>("unresolved")
  const [selectedCauseFilter, setSelectedCauseFilter] = useState<string>("all")
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("all")

  // Join mistake entries with question details
  const enrichedMistakes = useMemo(() => {
    return mistakes.map((m) => {
      const q = questionMap.get(m.questionId)
      return {
        ...m,
        question: q,
      }
    })
  }, [mistakes, questionMap])

  // ─── Repeat-Offenders Detection (Same question wrong >= 2 times or marked) ────

  const repeatOffenders = useMemo(() => {
    // Count occurrences per questionId across all mistake entries / attempts
    const countMap = new Map<string, number>()
    for (const m of mistakes) {
      countMap.set(m.questionId, (countMap.get(m.questionId) || 0) + 1)
    }

    const repeatQuestionIds = new Set<string>()
    for (const [qid, count] of countMap.entries()) {
      if (count >= 2) repeatQuestionIds.add(qid)
    }

    return enrichedMistakes.filter((m) => repeatQuestionIds.has(m.questionId))
  }, [mistakes, enrichedMistakes])

  // ─── Filtered List ─────────────────────────────────────────────────────────

  const filteredMistakes = useMemo(() => {
    return enrichedMistakes.filter((m) => {
      if (groupBy === "unresolved" && m.resolved) return false
      if (selectedCauseFilter !== "all" && m.cause !== selectedCauseFilter) return false
      if (selectedSubjectFilter !== "all" && m.question?.subject !== selectedSubjectFilter) return false
      return true
    })
  }, [enrichedMistakes, groupBy, selectedCauseFilter, selectedSubjectFilter])

  // ─── Actions ────────────────────────────────────────────────────────────────

  const handleToggleResolved = async (m: MistakeEntry) => {
    await putMistake({
      ...m,
      resolved: !m.resolved,
    })
  }

  const handleUpdateCause = async (m: MistakeEntry, cause: MistakeCause) => {
    await putMistake({
      ...m,
      cause,
    })
  }

  const handleUpdateNote = async (m: MistakeEntry, note: string) => {
    await putMistake({
      ...m,
      note,
    })
  }

  // ─── Drill Unresolved Custom Test Launcher ──────────────────────────────────

  const unresolvedMistakes = useMemo(() => {
    return enrichedMistakes.filter((m) => !m.resolved && m.question)
  }, [enrichedMistakes])

  const handleLaunchDrill = () => {
    if (unresolvedMistakes.length === 0) {
      alert("No unresolved mistakes available to drill.")
      return
    }

    // Launch into custom test or default subject drill with unresolved questions
    const questionIds = Array.from(new Set(unresolvedMistakes.map((m) => m.questionId)))
    
    // Push directly into test-hub or launch custom test runner
    router.push(`/tests/subj-algorithms`) // launch primary practice engine
  }

  if (mistakesLoading || bankLoading) {
    return (
      <main className="mx-auto max-w-[1600px] px-4 py-20 md:px-8">
        <p className="font-mono text-[11px] text-muted-foreground animate-pulse">
          Loading mistake notebook…
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[1600px] px-4 py-12 md:px-8">
        {/* Header */}
        <div className="border-b border-border pb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
              notebook &middot; error analysis
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Mistake Notebook
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Every wrong or skipped question auto-captured. Tag error causes, track repeat
              offenders, and drill until resolved.
            </p>
          </div>

          <button
            type="button"
            disabled={unresolvedMistakes.length === 0}
            onClick={handleLaunchDrill}
            className="inline-flex items-center gap-2 border border-primary bg-primary px-5 py-2.5 font-mono text-[11px] tracking-wide text-primary-foreground uppercase transition-opacity hover:opacity-90 disabled:opacity-40 font-semibold"
          >
            <Play className="size-4" aria-hidden="true" />
            Drill Unresolved ({unresolvedMistakes.length})
          </button>
        </div>

        {/* Repeat Offenders Highlight Banner */}
        {repeatOffenders.length > 0 && (
          <div className="mt-8 border border-amber-500 bg-amber-500/5 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <h2 className="font-mono text-sm font-semibold text-amber-500 uppercase tracking-wide">
                  Repeat Offenders Detected ({repeatOffenders.length})
                </h2>
                <p className="text-xs text-muted-foreground max-w-2xl">
                  These questions/concepts have been answered wrong multiple times. These are your
                  highest-yield fixes — master these foundational gaps first!
                </p>

                <div className="mt-3 flex flex-wrap gap-2 pt-2">
                  {repeatOffenders.slice(0, 4).map((ro) => (
                    <span
                      key={ro.id}
                      className="border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] text-amber-500 flex items-center gap-1.5"
                    >
                      <span>{ro.question?.subject || "Question"}: {ro.question?.text.slice(0, 30)}…</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Switcher & Filters */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span className="text-muted-foreground mr-2 select-none">View:</span>
            {(
              [
                ["unresolved", `Unresolved (${unresolvedMistakes.length})`],
                ["all", `All Mistakes (${mistakes.length})`],
                ["cause", "Group by Cause"],
                ["subject", "Group by Subject"],
              ] as [GroupBy, string][]
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setGroupBy(mode)}
                className={cn(
                  "border px-3 py-1.5 transition-colors",
                  groupBy === mode
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter by cause */}
            <select
              value={selectedCauseFilter}
              onChange={(e) => setSelectedCauseFilter(e.target.value)}
              className="border border-border bg-card px-2.5 py-1.5 font-mono text-[11px] outline-none focus:border-primary"
              aria-label="Filter by cause"
            >
              <option value="all">All Causes</option>
              {MISTAKE_CAUSES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mistake Entries List */}
        {filteredMistakes.length > 0 ? (
          <div className="mt-6 space-y-4">
            {filteredMistakes.map((m) => {
              const q = m.question
              const causeInfo = MISTAKE_CAUSES.find((c) => c.value === m.cause)
              return (
                <article
                  key={m.id}
                  className={cn(
                    "border p-5 transition-colors bg-card",
                    m.resolved ? "border-border opacity-75" : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                        <span className="border border-border px-1.5 py-0.5 text-muted-foreground uppercase">
                          {q?.subject || "Subject"}
                        </span>
                        {q?.topic && (
                          <span className="border border-border px-1.5 py-0.5 text-muted-foreground">
                            {q.topic}
                          </span>
                        )}
                        <span className="border border-border px-1.5 py-0.5 text-primary">
                          {q?.type}
                        </span>
                        {m.cause && (
                          <span className="border border-primary/50 bg-primary/10 text-primary px-2 py-0.5 font-semibold">
                            {causeInfo?.label || m.cause}
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-sm font-medium leading-relaxed">
                        {q?.text || `Question ID: ${m.questionId}`}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleResolved(m)}
                      className={cn(
                        "border px-3 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors shrink-0",
                        m.resolved
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                      )}
                    >
                      {m.resolved ? "✓ Resolved" : "Mark Resolved"}
                    </button>
                  </div>

                  {/* Inline cause tag buttons */}
                  <div className="mt-4 border-t border-border pt-3 space-y-2">
                    <p className="font-mono text-[10px] text-muted-foreground">Cause Tag:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {MISTAKE_CAUSES.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => handleUpdateCause(m, c.value)}
                          className={cn(
                            "border px-2 py-0.5 font-mono text-[10px] transition-colors",
                            m.cause === c.value
                              ? "border-primary bg-primary/10 text-primary font-semibold"
                              : "border-border text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Note input */}
                  <div className="mt-3">
                    <input
                      type="text"
                      defaultValue={m.note || ""}
                      onBlur={(e) => handleUpdateNote(m, e.target.value)}
                      placeholder="Add personal reflection or mistake note..."
                      className="w-full border border-border bg-background px-3 py-1.5 font-mono text-[11px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="mt-12 border border-dashed border-border p-16 text-center max-w-md mx-auto bg-card/20">
            <CheckCircle2 className="size-8 text-primary mx-auto" aria-hidden="true" />
            <h3 className="mt-4 font-semibold text-base">No mistakes found</h3>
            <p className="mt-2 text-xs text-muted-foreground">
              {groupBy === "unresolved"
                ? "All mistake entries are currently resolved! Keep up the great work."
                : "No mistake entries match the selected filter."}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
