"use client"

/**
 * app/formulas/page.tsx — FORMULA & ONE-LINER SHEET
 *
 * Auto-collected formula sheet for GATE CSE.
 * Features:
 *  - Subject grouping & search filter.
 *  - "Shaky only" filter (focus on weak formulas).
 *  - Blur-to-reveal recall mode (formulas blurred until click/hover).
 *  - 1-Click Practice Drill for any formula concept.
 *  - Copy LaTeX formula button.
 *  - Printable layout (@media print CSS styles for clean PDF/print export).
 */

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Printer, Eye, EyeOff, Sparkles, Filter, Copy, Check, Zap, ArrowRight, X, Loader2 } from "lucide-react"
import { useCollection, useQuestionBank, useAttempts, useConcepts } from "@/lib/storage/hooks"
import { COLLECTIONS } from "@/lib/storage/store"
import { deriveMasteryState } from "@/lib/analytics/graph-selectors"
import type { Concept } from "@/lib/domain/types"
import { cn } from "@/lib/utils"
import { FormattedContent } from "@/components/formatted-content"

export default function FormulasPage() {
  const router = useRouter()
  const { attempts } = useAttempts()
  const { data: srsCards } = useCollection(COLLECTIONS.srsCards)
  const { questionMap } = useQuestionBank()
  const CURATED_CONCEPTS = useConcepts()

  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isBlurMode, setIsBlurMode] = useState(false)
  const [shakyOnly, setShakyOnly] = useState(false)
  const [visibleCount, setVisibleCount] = useState(15)

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(15)
  }, [searchQuery, selectedSubject, shakyOnly])

  const handlePracticeConcept = (concept: Concept) => {
    // Find all questions associated with this concept
    const matchingQids: string[] = []
    for (const [qid, q] of questionMap.entries()) {
      if (q.conceptIds && q.conceptIds.includes(concept.id)) {
        matchingQids.push(qid)
      }
    }

    // Fallback: If no direct conceptIds linked, grab questions from matching subject
    if (matchingQids.length === 0) {
      for (const [qid, q] of questionMap.entries()) {
        if (q.subject && q.subject.toLowerCase().includes(concept.subjectId.toLowerCase())) {
          matchingQids.push(qid)
          if (matchingQids.length >= 5) break
        }
      }
    }

    if (matchingQids.length === 0) return

    const remedialTestId = `remedial-concept-${concept.id}`
    try {
      localStorage.setItem(`remedial_qids_${remedialTestId}`, JSON.stringify(matchingQids))
    } catch {}

    router.push(`/tests/${remedialTestId}?mode=practice`)
  }

  // Filter concepts that contain formulas
  const formulaConcepts = useMemo(() => {
    return CURATED_CONCEPTS.filter((c: any) => Boolean(c.formula))
  }, [CURATED_CONCEPTS])

  // Filtered formula list based on search, subject, and shaky state
  const allFilteredFormulas = useMemo(() => {
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

  const filteredFormulas = useMemo(() => {
    return allFilteredFormulas.slice(0, visibleCount)
  }, [allFilteredFormulas, visibleCount])

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
    <main className="w-full overflow-x-hidden min-w-0 min-h-dvh bg-transparent pt-4 md:pt-8 pb-28 md:pb-56 px-4 md:px-6 max-w-5xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-300 print:p-0 print:max-w-none print:overflow-visible">
      {/* Back to Home & Non-printable Header */}
      <header className="space-y-2.5 md:space-y-4 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary-text hover:text-foreground transition-colors mb-2"
        >
          <ArrowRight className="size-3.5 rotate-180" /> Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-start lg:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="hidden md:block font-mono text-[11px] sm:text-xs font-bold tracking-widest text-[#1CB0F6] uppercase">
              Formulas &middot; Rapid Revision Engine
            </p>
            <h1 className="mt-1 text-2xl md:text-4xl lg:text-5xl font-heading font-black text-primary-text uppercase tracking-tighter break-words">
              Formula Cheat Sheet
            </h1>
            <p className="hidden md:block text-xs sm:text-sm md:text-base font-bold text-secondary-text mt-1 max-w-2xl">
              All high-yield mathematical equations, algorithmic complexities, and core formulas with 1-click concept practice.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {/* Blur-to-reveal mode */}
            <button
              type="button"
              onClick={() => setIsBlurMode(!isBlurMode)}
              className={cn(
                "neo-btn px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-neo-xs",
                isBlurMode
                  ? "bg-[#FF9600] text-white border-[#1F2937]"
                  : "bg-white text-foreground hover:bg-[#FFF8EE]"
              )}
            >
              {isBlurMode ? <EyeOff className="size-3.5 sm:size-4" /> : <Eye className="size-3.5 sm:size-4" />}
              <span>Blur: {isBlurMode ? "ON" : "OFF"}</span>
            </button>

            {/* Shaky only filter */}
            <button
              type="button"
              onClick={() => setShakyOnly(!shakyOnly)}
              className={cn(
                "neo-btn px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-neo-xs",
                shakyOnly
                  ? "bg-[#FF4B4B] text-white border-[#1F2937]"
                  : "bg-white text-foreground hover:bg-[#FFF2F2]"
              )}
            >
              <Filter className="size-3.5 sm:size-4" />
              <span>Shaky: {shakyOnly ? "ON" : "OFF"}</span>
            </button>

            {/* Print button */}
            <button
              type="button"
              onClick={handlePrint}
              className="neo-btn bg-[#1CB0F6] text-white px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-neo-xs"
            >
              <Printer className="size-3.5 sm:size-4" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative pt-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none mt-1" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search formulas by concept or LaTeX expression (e.g. Dijkstra, QuickSort, Paging, Page Fault)..."
            className="w-full bg-white border-3 border-[#1F2937] rounded-2xl pl-10 pr-10 py-3 font-bold text-sm text-[#1F2937] placeholder:text-muted-foreground shadow-neo-sm outline-none focus:border-[#1CB0F6] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#1F2937] p-1 mt-1"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Horizontal Scrollable Subject Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 pt-1">
          <button
            type="button"
            onClick={() => setSelectedSubject("all")}
            className={cn(
              "px-4 py-1.5 rounded-xl font-heading text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border-2",
              selectedSubject === "all"
                ? "bg-[#1CB0F6] text-white border-[#1F2937] shadow-neo-xs"
                : "bg-white text-secondary-text border-[#1F2937]/30 hover:border-[#1F2937]"
            )}
          >
            All Subjects ({formulaConcepts.length})
          </button>
          {Array.from(new Set(formulaConcepts.map((c) => c.subjectId))).map((sub) => {
            const count = formulaConcepts.filter((c) => c.subjectId === sub).length
            return (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubject(sub)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl font-heading text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border-2",
                  selectedSubject === sub
                    ? "bg-[#1CB0F6] text-white border-[#1F2937] shadow-neo-xs"
                    : "bg-white text-secondary-text border-[#1F2937]/30 hover:border-[#1F2937]"
                )}
              >
                {sub} ({count})
              </button>
            )
          })}
        </div>
      </header>

      {/* Main Formula Content Body (Printable) */}
      <div className="space-y-8 print:p-0 print:max-w-none print:space-y-4">
        {/* Printable Header - Branded */}
        <div className="hidden print:flex flex-col border-b-4 border-[#1F2937] pb-4 mb-6 mt-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#1CB0F6] text-white font-heading font-black px-3 py-1 text-xl border-2 border-[#1F2937] rounded-xl shadow-neo-sm">
              GateConsole
            </div>
            <h1 className="text-3xl font-black font-heading tracking-tight text-[#1F2937] uppercase">Formula Cheat Sheet</h1>
          </div>
          <p className="text-sm font-mono font-bold text-secondary-text mt-3 bg-[#F3F4F6] inline-block self-start px-3 py-1 rounded-lg border-2 border-[#1F2937]/10">
            Total {filteredFormulas.length} formulas indexed across {groupedBySubject.size} subjects.
          </p>
        </div>

        {Array.from(groupedBySubject.entries()).map(([subject, list]) => (
          <section key={subject} className="space-y-4 print:space-y-3">
            <h2 className="font-heading text-sm font-black text-foreground uppercase tracking-wider flex flex-wrap items-center gap-2 border-b-2 border-[#1F2937]/15 pb-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-[#E5F6FF] text-[#1899D6] border-2 border-[#1F2937] text-xs">
                {subject}
              </span>
              <span className="font-mono text-xs text-secondary-text shrink-0">({list.length} Formulas)</span>
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-2 print:gap-4">
              {list.map((c) => (
                <div
                  key={c.id}
                  className="neo-card min-w-0 border-3 border-[#1F2937] bg-white p-5 space-y-3.5 rounded-2xl shadow-neo-sm hover:border-[#1CB0F6] transition-all flex flex-col justify-between print:border-[#1F2937] print:bg-white print:p-4 print:rounded-2xl print:shadow-neo-xs hover:-translate-y-0.5 print:break-inside-avoid"
                >
                  <div className="space-y-2.5 min-w-0">
                    <div className="flex items-start justify-between gap-2 font-mono text-xs">
                      <span className="font-heading font-black text-foreground text-sm leading-snug print:text-black">{c.label}</span>
                      <span className="bg-[#FFC800] text-[#1F2937] px-2 py-0.5 rounded-md font-black border border-[#1F2937] shadow-neo-xs shrink-0 text-[11px]">
                        ★ {c.examRelevance} / 5
                      </span>
                    </div>

                    {c.summary && (
                      <div className="text-xs text-secondary-text leading-relaxed font-medium">
                        <FormattedContent content={c.summary} />
                      </div>
                    )}

                    {/* Formula Box with KaTeX rendering */}
                    <div
                      className={cn(
                        "p-3.5 rounded-xl bg-[#FAFBFF] border-2 border-[#1CB0F6]/40 text-[#1899D6] font-mono text-xs transition-all duration-200 cursor-pointer overflow-x-auto select-none print:bg-gray-100 print:text-black print:border-gray-400 print:filter-none shadow-neo-xs",
                        isBlurMode && "filter blur-sm hover:blur-none"
                      )}
                      title={isBlurMode ? "Hover/Click to unblur" : undefined}
                    >
                      <FormattedContent content={c.formula && c.formula.includes("$") ? c.formula : `$${c.formula}$`} />
                    </div>

                    {c.complexity && (
                      <div className="font-mono text-xs font-bold text-secondary-text print:text-gray-700 flex flex-col gap-1.5 min-w-0">
                        <span>Complexity:</span>
                        <div className="font-black text-[#FF9600] overflow-x-auto custom-scrollbar pb-1 min-w-0">
                          <FormattedContent content={c.complexity.includes("$") ? c.complexity : `$${c.complexity}$`} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions (Non-printable) */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-[#1F2937]/10 print:hidden font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => handlePracticeConcept(c)}
                      className="neo-btn bg-[#58CC02] text-white px-3.5 py-1.5 rounded-xl font-black flex items-center gap-1 hover:bg-[#46A302] transition-colors uppercase tracking-wider text-xs shadow-neo-xs"
                      title="Practice questions for this concept"
                    >
                      <Zap className="size-3.5 fill-white" /> Practice →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {filteredFormulas.length === 0 && (
          <div className="border-3 border-dashed border-[#1F2937]/20 rounded-2xl p-12 text-center max-w-md mx-auto bg-white">
            <p className="font-heading font-black text-sm text-secondary-text uppercase">
              No formulas match the active filters.
            </p>
          </div>
        )}

        {allFilteredFormulas.length > visibleCount && (
          <div className="flex justify-center pt-8 pb-12 print:hidden">
            <button
              onClick={() => setVisibleCount((prev) => prev + 15)}
              className="neo-btn bg-[#FF9600] text-white px-8 py-3 rounded-2xl font-heading font-black uppercase tracking-wider flex items-center gap-2 shadow-neo"
            >
              <Loader2 className="size-5 animate-spin" />
              Load More Formulas ({allFilteredFormulas.length - visibleCount} left)
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
