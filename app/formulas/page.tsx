"use client"

/**
 * app/formulas/page.tsx — FORMULA & ONE-LINER SHEET
 *
 * Auto-collected formula sheet for GATE CSE.
 * Features:
 *  - Subject grouping & search filter.
 *  - "Shaky only" filter (focus on weak formulas).
 *  - Blur-to-reveal recall mode (formulas blurred until click/hover).
 *  - Printable layout (@media print CSS styles for clean PDF/print export).
 */

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Printer, Eye, EyeOff, Sparkles, Filter } from "lucide-react"
import { useCollection, useQuestionBank, useAttempts, useConcepts } from "@/lib/storage/hooks"
import { COLLECTIONS } from "@/lib/storage/store"
import { deriveMasteryState } from "@/lib/analytics/graph-selectors"
import type { Concept } from "@/lib/domain/types"
import { cn } from "@/lib/utils"

export default function FormulasPage() {
  const { attempts } = useAttempts()
  const { data: srsCards } = useCollection(COLLECTIONS.srsCards)
  const { questionMap } = useQuestionBank()
  const CURATED_CONCEPTS = useConcepts()

  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isBlurMode, setIsBlurMode] = useState(false)
  const [shakyOnly, setShakyOnly] = useState(false)

  // Filter concepts that contain formulas
  const formulaConcepts = useMemo(() => {
    return CURATED_CONCEPTS.filter((c: any) => Boolean(c.formula))
  }, [CURATED_CONCEPTS])

  // Filtered formula list based on search, subject, and shaky state
  const filteredFormulas = useMemo(() => {
    return formulaConcepts.filter((c: any) => {
      if (selectedSubject !== "all" && c.subjectId !== selectedSubject) return false

      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchLabel = c.label.toLowerCase().includes(q)
        const matchFormula = c.formula?.toLowerCase().includes(q)
        const matchSubject = c.subjectId.toLowerCase().includes(q)
        if (!matchLabel && !matchFormula && !matchSubject) return false
      }

      if (shakyOnly) {
        const state = deriveMasteryState(c, attempts, srsCards, questionMap)
        if (state !== "shaky" && state !== "learning" && state !== "untouched") return false
      }

      return true
    })
  }, [formulaConcepts, selectedSubject, searchQuery, shakyOnly, attempts, srsCards, questionMap])

  // Group formulas by subject
  const groupedBySubject = useMemo(() => {
    const map = new Map<string, Concept[]>()
    for (const c of filteredFormulas) {
      const list = map.get(c.subjectId) || []
      list.push(c)
      map.set(c.subjectId, list)
    }
    return map
  }, [filteredFormulas])

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Non-printable Control Header */}
      <header className="border-b border-border bg-card p-6 print:hidden">
        <div className="mx-auto max-w-[1600px] flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
              Formulas &middot; Final Week Revision
            </p>
            <h1 className="text-2xl font-bold tracking-tight">GATE CSE Formula Cheat Sheet</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
            {/* Blur-to-reveal mode */}
            <button
              type="button"
              onClick={() => setIsBlurMode(!isBlurMode)}
              className={cn(
                "flex items-center gap-2 border px-3 py-2 transition-colors",
                isBlurMode
                  ? "border-amber-500 bg-amber-500/10 text-amber-400 font-semibold"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              )}
            >
              {isBlurMode ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              Blur-to-reveal: {isBlurMode ? "ON" : "OFF"}
            </button>

            {/* Shaky only filter */}
            <button
              type="button"
              onClick={() => setShakyOnly(!shakyOnly)}
              className={cn(
                "flex items-center gap-2 border px-3 py-2 transition-colors",
                shakyOnly
                  ? "border-primary bg-primary/10 text-primary font-semibold"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              )}
            >
              <Filter className="size-3.5" />
              Shaky Formulas Only: {shakyOnly ? "ON" : "OFF"}
            </button>

            {/* Print button */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 border border-primary bg-primary px-4 py-2 text-primary-foreground font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity"
            >
              <Printer className="size-3.5" />
              Print Cheat Sheet
            </button>
          </div>
        </div>

        {/* Search & Subject Filter Bar */}
        <div className="mx-auto max-w-[1600px] mt-4 flex flex-wrap items-center gap-3 pt-3 border-t border-border/50">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="size-3.5 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formulas by concept or LaTeX expression..."
              className="w-full border border-border bg-background pl-8 pr-3 py-1.5 font-mono text-[11px] outline-none focus:border-primary"
            />
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="border border-border bg-background px-3 py-1.5 font-mono text-[11px] outline-none focus:border-primary"
          >
            <option value="all">All Subjects ({formulaConcepts.length} formulas)</option>
            {Array.from(new Set(formulaConcepts.map((c) => c.subjectId))).map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Formula Content Body (Printable) */}
      <div className="mx-auto max-w-[1600px] px-4 py-8 md:px-8 print:p-0 print:max-w-none space-y-8">
        {/* Printable Header */}
        <div className="hidden print:block border-b border-black pb-4 mb-6">
          <h1 className="text-xl font-bold font-mono">GATE CSE Official Formula Sheet</h1>
          <p className="text-xs font-mono text-gray-600">
            Total {filteredFormulas.length} formulas indexed across {groupedBySubject.size} subjects.
          </p>
        </div>

        {Array.from(groupedBySubject.entries()).map(([subject, list]) => (
          <section key={subject} className="space-y-4 print:space-y-2 break-inside-avoid">
            <h2 className="font-mono text-xs font-semibold text-primary uppercase tracking-widest border-b border-border pb-1 print:text-black print:border-black">
              {subject} ({list.length})
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-2 print:gap-2">
              {list.map((c) => (
                <div
                  key={c.id}
                  className="border border-border bg-card p-4 space-y-2 print:border-black print:bg-white print:p-2"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground print:text-black">
                    <span className="font-semibold text-foreground print:text-black">{c.label}</span>
                    <span>★{c.examRelevance}</span>
                  </div>

                  {/* Formula Box */}
                  <div
                    className={cn(
                      "font-mono text-xs p-3 bg-muted/20 border border-primary/30 text-primary transition-all duration-200 select-none cursor-pointer print:bg-gray-100 print:text-black print:border-gray-400 print:filter-none",
                      isBlurMode && "filter blur-sm hover:blur-none"
                    )}
                    title={isBlurMode ? "Hover/Click to unblur" : undefined}
                  >
                    {c.formula}
                  </div>

                  {c.complexity && (
                    <p className="font-mono text-[10px] text-muted-foreground print:text-gray-700">
                      Complexity: {c.complexity}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        {filteredFormulas.length === 0 && (
          <div className="border border-dashed border-border p-12 text-center max-w-md mx-auto">
            <p className="font-mono text-xs text-muted-foreground">
              No formulas match the active filters.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
