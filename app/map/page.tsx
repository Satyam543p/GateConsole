"use client"

import { useState, useMemo, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, AlertTriangle, Sigma, ArrowLeft, Network, Terminal, Code, Cpu, Database, Bookmark } from "lucide-react"
import { useConcepts, useSettings } from "@/lib/storage/hooks"
import { getSubjectsForExam, getActiveExamId } from "@/lib/exams/registry"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { DiagramRenderer } from "@/components/diagram-renderer"
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'

function MapContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeSubjectId = searchParams.get("subject")

  const activeChapterId = searchParams.get("chapter")

  const [searchQuery, setSearchQuery] = useState("")

  const allConcepts = useConcepts()
  const { settings } = useSettings()
  const activeExamId = getActiveExamId(settings.profile)
  const SUBJECTS = useMemo(() => getSubjectsForExam(activeExamId), [activeExamId])

  const activeSubject = useMemo(() => {
    return SUBJECTS.find(s => s.id === activeSubjectId)
  }, [SUBJECTS, activeSubjectId])

  const activeSubjectName = activeSubject?.name || activeSubjectId

  const activeChapter = useMemo(() => {
    return activeSubject?.chapters?.find(c => c.id === activeChapterId)
  }, [activeSubject, activeChapterId])

  const hasChapters = (activeSubject?.chapters?.length || 0) > 0

  // Bug #2 fix: initialize selectedTopicId from the `chapter` URL param so
  // deep-linking (e.g. /map?subject=algo&chapter=sorting) works on first render.
  // We derive the initial category by finding the first concept whose chapterId
  // matches the URL chapter param and reading its category field.
  const initialTopic = useMemo(() => {
    if (!activeChapterId || activeChapterId === "ALL") return "ALL"
    const match = allConcepts.find((c: any) =>
      c.chapterId === activeChapterId || c.category?.toLowerCase() === activeChapterId?.toLowerCase()
    )
    return match?.category || "ALL"
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentionally only on mount — URL param sets initial state once

  const [selectedTopicId, setSelectedTopicId] = useState<string>(initialTopic)

  const subjectConcepts = useMemo(() => {
    if (!activeSubjectId) return []
    return allConcepts.filter((c: any) => c.subjectId === activeSubjectName || c.subjectId === activeSubjectId)
  }, [allConcepts, activeSubjectId, activeSubjectName])

  const availableTopics = useMemo(() => {
    const map = new Map<string, { id: string; label: string; count: number }>()
    subjectConcepts.forEach((c: any) => {
      // Issue #1 fix: group by category (not self-referencing chapterId)
      const tid = c.category || "general"
      const label = c.category || "General"
      if (!map.has(tid)) {
        map.set(tid, { id: tid, label: String(label), count: 0 })
      }
      map.get(tid)!.count++
    })
    return Array.from(map.values())
  }, [subjectConcepts])

  const filteredConcepts = useMemo(() => {
    let result = subjectConcepts
    if (selectedTopicId !== "ALL") {
      // Issue #1 fix: filter by category
      result = result.filter((c: any) => (c.category || "general") === selectedTopicId)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((c: any) => 
        c.label.toLowerCase().includes(q) || 
        c.summary.toLowerCase().includes(q)
      )
    }
    return result
  }, [subjectConcepts, selectedTopicId, searchQuery])

  // VIEW 1: Select Subject
  if (!activeSubjectId) {
    return (
      <main className="min-h-dvh pt-12 pb-24 px-6 max-w-5xl mx-auto space-y-8 bg-[#FAFBFF]">
        <header className="mb-8">
          <h1 className="text-[28px] font-heading font-bold text-primary-text flex items-center gap-3">
            <Network className="size-7 text-[#6C8EF2]" />
            Concept Maps
          </h1>
          <p className="text-[14px] text-secondary-text mt-1">
            Explore concepts in a beautiful linear scroll.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SUBJECTS.map(sub => {
            const count = allConcepts.filter(c => c.subjectId === sub.id || c.subjectId === sub.name).length
            return (
              <button
                key={sub.id}
                onClick={() => router.push(`/map?subject=${sub.id}`)}
                className="text-left w-full"
              >
                <Card className="p-5 h-full hover:shadow-md transition-shadow group border-[#D0DAFE]/40 hover:border-[#6C8EF2]/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-[16px] text-primary-text group-hover:text-[#6C8EF2] transition-colors line-clamp-2">
                        {sub.name}
                      </h3>
                      <p className="text-[12px] text-muted-text mt-1">
                        {count} Concepts mapped
                      </p>
                    </div>
                    <div className="size-8 rounded-full bg-[#F0F4FF] flex items-center justify-center shrink-0 group-hover:bg-[#6C8EF2] transition-colors">
                      <Network className="size-4 text-[#6C8EF2] group-hover:text-white" />
                    </div>
                  </div>
                </Card>
              </button>
            )
          })}
        </div>
      </main>
    )
  }

  // VIEW 2: Select Chapter (if the subject has chapters and no chapter is selected yet)
  if (hasChapters && !activeChapterId) {
    return (
      <main className="min-h-dvh pt-12 pb-24 px-6 max-w-5xl mx-auto space-y-8 bg-[#FAFBFF]">
        <header className="mb-8">
          <button
            onClick={() => router.push('/map')}
            className="mb-6 inline-flex items-center gap-2 text-[14px] font-bold text-secondary-text hover:text-primary-text transition-colors"
          >
            <ArrowLeft className="size-4" /> Back to Subjects
          </button>
          <h1 className="text-[28px] font-heading font-bold text-primary-text flex items-center gap-3 uppercase">
            {activeSubjectName}
          </h1>
          <p className="text-[14px] text-secondary-text mt-1">
            Select a chapter to view its concepts.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activeSubject!.chapters!.map(ch => {
            const count = allConcepts.filter(c => c.chapterId === ch.id || c.chapterId === ch.name).length
            return (
              <button
                key={ch.id}
                onClick={() => router.push(`/map?subject=${activeSubjectId}&chapter=${ch.id}`)}
                className="text-left w-full"
              >
                <Card className="p-5 h-full hover:shadow-md transition-shadow group border-[3px] border-[#1F2937] hover:-translate-y-1 hover:translate-x-1 hover:shadow-none shadow-neo-sm transition-all bg-white rounded-[16px]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-heading font-black text-[18px] text-[#1F2937] transition-colors line-clamp-2">
                        {ch.name}
                      </h3>
                      <p className="text-[14px] font-bold text-secondary-text mt-2 uppercase tracking-wide">
                        {count} Concepts
                      </p>
                    </div>
                    <div className="size-10 rounded-full border-[3px] border-[#1F2937] bg-[#E5F9D6] flex items-center justify-center shrink-0 group-hover:bg-[#58CC02] transition-colors">
                      <Network className="size-5 text-[#1F2937]" strokeWidth={3} />
                    </div>
                  </div>
                </Card>
              </button>
            )
          })}
        </div>
      </main>
    )
  }

  // VIEW 3: Linear Feed of Concepts (Filtered by Subject or Chapter)
  return (
    <main className="min-h-dvh w-full relative bg-[#FAFBFF] overflow-x-hidden">
      
      {/* Playful Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
        <Terminal className="absolute top-20 left-10 size-24 text-[#6C8EF2] animate-[spin_10s_linear_infinite]" strokeWidth={2} />
        <Code className="absolute top-40 right-20 size-32 text-[#FFB020] animate-bounce" strokeWidth={2} />
        <Cpu className="absolute bottom-40 left-32 size-28 text-[#1CB0F6] animate-pulse" strokeWidth={2} />
        <Database className="absolute bottom-20 right-1/4 size-20 text-[#FF4B4B] animate-bounce" style={{ animationDelay: '1s' }} strokeWidth={2} />
        <Network className="absolute top-1/2 right-10 size-24 text-[#58CC02] animate-[spin_12s_linear_infinite]" strokeWidth={2} />
      </div>

      {/* Header / Search (relative on mobile to clear viewport height per Rule 5, sticky on md+) */}
      <div className="relative md:sticky md:top-0 z-20 bg-white border-b-[4px] border-[#1F2937] px-3.5 md:px-6 py-3 md:py-4 flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-between shadow-neo-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              if (hasChapters) {
                router.push(`/map?subject=${activeSubjectId}`)
              } else {
                router.push('/map')
              }
            }}
            className="size-10 md:size-12 bg-white border-[3px] border-[#1F2937] rounded-full flex items-center justify-center shadow-neo-sm hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all shrink-0"
          >
            <ArrowLeft className="size-5 md:size-6 text-[#1F2937]" strokeWidth={3} />
          </button>
          <div className="flex flex-col min-w-0">
            <h1 className="text-[17px] md:text-[24px] font-heading font-black text-primary-text uppercase truncate leading-tight">
              {activeChapter ? activeChapter.name : activeSubjectName}
            </h1>
            {activeChapter && (
              <span className="text-[11px] font-bold text-secondary-text uppercase tracking-wider truncate">
                {activeSubjectName}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full md:w-auto shrink-0">
          {availableTopics.length > 0 && (
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="h-10 md:h-12 w-full sm:w-auto border-[3px] border-[#1F2937] bg-white rounded-full px-4 md:px-5 font-heading font-black text-[12px] md:text-[13px] tracking-wide outline-none shadow-neo-sm focus:translate-y-1 focus:shadow-none transition-all text-[#1F2937] uppercase cursor-pointer"
            >
              <option value="ALL">ALL TOPICS ({subjectConcepts.length})</option>
              {availableTopics.map((top) => (
                <option key={top.id} value={top.id}>
                  {top.label.toUpperCase()} ({top.count})
                </option>
              ))}
            </select>
          )}

          <div className="relative w-full sm:w-72 md:w-80 shrink-0">
            <Search className="size-4 md:size-5 text-[#1F2937] absolute left-3.5 top-3 md:top-3.5" strokeWidth={3} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts..."
              className="w-full h-10 md:h-12 border-[3px] border-[#1F2937] bg-white rounded-full pl-10 md:pl-12 pr-4 font-heading font-bold text-[13px] md:text-[15px] outline-none shadow-neo-sm focus:translate-y-1 focus:shadow-none transition-all text-[#1F2937]"
            />
          </div>
        </div>
      </div>

      {/* Timeline / Linear Feed */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12 space-y-12">

        {/* Issue #6 fix: single consolidated empty-state */}
        {filteredConcepts.length === 0 && (
          <div className="text-center py-20 bg-white border-[4px] border-[#1F2937] rounded-[24px] shadow-neo">
            <Search className="size-12 text-[#1F2937]/30 mx-auto mb-4" strokeWidth={3} />
            <p className="text-[20px] font-heading font-bold text-[#1F2937]">No concepts found.</p>
            <p className="text-[15px] text-[#1F2937]/70 font-medium mt-2">Try adjusting your filter or search term.</p>
          </div>
        )}

        {filteredConcepts.length > 0 && (() => {
          // Group concepts by category (Issue #1 fix)
          const grouped = new Map<string, any[]>()
          filteredConcepts.forEach(c => {
            const cid = c.category || c.subjectId || "general"
            if (!grouped.has(cid)) grouped.set(cid, [])
            grouped.get(cid)!.push(c)
          })

          // Issue #4 fix: renderConcept extracted as inline function (full component extract in follow-up)
          const renderConcept = (concept: any, isLast: boolean) => {
            let badgeColor = "bg-[#1CB0F6] text-white"
            if (concept.kind === "algorithm") badgeColor = "bg-[#58CC02] text-white"
            else if (concept.kind === "theorem") badgeColor = "bg-[#FFB020] text-[#1F2937]"
            else if (concept.kind === "technique") badgeColor = "bg-[#CE82FF] text-white"
            else if (concept.kind === "pitfall") badgeColor = "bg-[#FF4B4B] text-white"

            // Issue #7 fix: filter placeholder codeSnippets
            const codeContent = concept.pseudocode || concept.codeSnippet
            // Bug #9 fix: tightened regex — only suppress snippets that are EXACTLY
            // the "no code needed" placeholder, not any comment mentioning "no code".
            const hasRealCode = codeContent && !/^#\s*no code(?:\s+(?:needed|required|here))?\s*\.?\s*$/i.test(codeContent.trim())

            // Bug #4 fix: formatLatex safely wraps math strings that lack delimiters
            const formatLatex = (str: string): string => {
              if (!str) return ""
              const clean = str.trim()
              if (clean === "$$" || clean === "$") return ""
              if (clean.includes("$")) return clean
              return `$${clean}$`
            }

            const hasRealComplexity = concept.complexity && concept.complexity !== "Core Concept"
            
            // Cleanly collect all individual formula items from both `formula` and `keyFormulae`
            // and split any multi-rule strings separated by '|' into clean individual items
            const formulaList: string[] = []
            if (concept.formula && concept.formula.trim() !== "" && concept.formula.trim() !== "$$") {
              const parts = concept.formula.split("|").map((s: string) => s.trim()).filter((s: string) => s.length > 0 && s !== "$$")
              formulaList.push(...parts)
            }
            if (concept.keyFormulae && Array.isArray(concept.keyFormulae)) {
              concept.keyFormulae.forEach((f: string) => {
                if (f && f.trim() !== "" && f.trim() !== "$$") {
                  const parts = f.split("|").map((s: string) => s.trim()).filter((s: string) => s.length > 0 && s !== "$$")
                  formulaList.push(...parts)
                }
              })
            }

            const hasFormulas = formulaList.length > 0

            return (
              <div key={concept.id} className="relative group/card">
                {!isLast && (
                  <div className="absolute left-10 top-20 bottom-[-3rem] w-[4px] bg-[#1F2937] z-0 opacity-20 group-hover/card:bg-[#6C8EF2] group-hover/card:opacity-100 transition-colors" />
                )}

                <Card className="relative z-10 p-6 md:p-8 bg-white border-[4px] border-[#1F2937] rounded-[24px] shadow-neo hover:translate-x-1 hover:-translate-y-1 transition-transform mb-8">
                  <div className="flex flex-col gap-5">

                    {/* Kind badge + conditional PYQS badge (Issue #2 fix) */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={cn("text-[12px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border-[3px] border-[#1F2937] shadow-neo-sm", badgeColor)}>
                        {concept.kind}
                      </span>

                      {concept.pyqMapping && concept.pyqMapping.length > 0 && (
                        <span className="bg-[#FFC700] text-[#1F2937] border-[3px] border-[#1F2937] shadow-neo-sm font-black px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                          <Bookmark className="size-3.5 fill-[#1F2937]" strokeWidth={2.5} />
                          GATE PYQS: GATE PATTERN QUESTION
                        </span>
                      )}
                    </div>

                    <h2 className="text-[22px] md:text-[28px] font-heading font-black text-primary-text leading-tight">
                      {concept.label}
                    </h2>

                    <div className="text-[16px] text-[#1F2937] leading-relaxed font-medium">
                      <Latex>{concept.summary}</Latex>
                    </div>

                    {concept.imageUrl && (
                      <div className="my-2 border-[3px] border-[#1F2937] rounded-[16px] p-4 bg-white shadow-neo-sm overflow-hidden flex justify-center">
                        <DiagramRenderer url={concept.imageUrl} />
                      </div>
                    )}

                    {/* Issue #7 fix: only render if real code exists */}
                    {hasRealCode && (
                      <div className="bg-[#1F2937] border-[4px] border-[#1F2937] rounded-[16px] p-5 md:p-6 text-[#A7F3D0] shadow-neo-sm overflow-x-auto">
                        <h3 className="text-[15px] font-heading font-black flex items-center gap-2 mb-3 uppercase tracking-wide text-white">
                          <Code className="size-5" strokeWidth={3} /> Pseudocode / Snippet
                        </h3>
                        <pre className="font-mono text-[12px] md:text-[15px] font-bold leading-relaxed whitespace-pre-wrap">
                          {codeContent}
                        </pre>
                      </div>
                    )}

                    {(hasFormulas || hasRealComplexity) && (
                      <div className="bg-[#1CB0F6] border-[4px] border-[#1F2937] rounded-[16px] p-5 md:p-6 text-white shadow-neo-sm">
                        {hasFormulas && (
                          <>
                            <h3 className="text-[15px] font-heading font-black flex items-center gap-2 mb-4 uppercase tracking-wide">
                              <Sigma className="size-5" strokeWidth={3} /> Key Formulas / Rules
                            </h3>
                            <div className="space-y-2.5">
                              {formulaList.map((f, idx) => (
                                <div key={idx} className="text-[13px] md:text-[16px] font-bold overflow-x-auto bg-white/20 p-3.5 rounded-xl custom-scrollbar leading-relaxed">
                                  <Latex>{formatLatex(f)}</Latex>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {hasRealComplexity && (
                          <div className={cn("font-heading font-bold text-[15px]", hasFormulas ? "mt-4 pt-4 border-t-2 border-white/20" : "")}>
                            <span className="opacity-80 uppercase text-[12px] tracking-wider block mb-1">Complexity</span>
                            <Latex>{concept.complexity}</Latex>
                          </div>
                        )}
                      </div>
                    )}

                    {concept.commonTraps && concept.commonTraps.length > 0 && (
                      <div className="bg-[#FF4B4B] border-[4px] border-[#1F2937] rounded-[16px] p-5 md:p-6 text-white shadow-neo-sm">
                        <h3 className="text-[15px] font-heading font-black flex items-center gap-2 mb-4 uppercase tracking-wide">
                          <AlertTriangle className="size-5" strokeWidth={3} /> Exam Traps
                        </h3>
                        <ul className="space-y-3">
                          {concept.commonTraps.map((trap: string, idx: number) => (
                            <li key={idx} className="flex gap-3 text-[15px] font-bold leading-relaxed">
                              <span className="mt-1.5 size-2.5 rounded-full bg-white shrink-0" />
                              <span><Latex>{trap}</Latex></span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>
                </Card>
              </div>
            )
          }

          return Array.from(grouped.entries()).map(([groupKey, concepts]) => {
            // Bug #6 fix: resolve human-readable label from availableTopics map
            // instead of displaying the raw category key (e.g. "daa-sorting" -> "Sorting")
            const resolvedLabel = availableTopics.find(t => t.id === groupKey)?.label ?? groupKey
            return (
            <div key={groupKey} className="relative pt-4">
              {/* Category group header (only show when not already filtered to one topic) */}
              {selectedTopicId === "ALL" && availableTopics.length > 1 && (
                <div className="mb-8 flex items-center gap-4">
                  <div className="h-[4px] flex-1 bg-[#1F2937] opacity-20" />
                  <h3 className="text-[14px] font-heading font-black text-primary-text px-4 py-2 bg-[#E5F9D6] border-[3px] border-[#1F2937] rounded-[12px] shadow-neo-sm uppercase tracking-wider">
                    {resolvedLabel}
                  </h3>
                  <div className="h-[4px] flex-1 bg-[#1F2937] opacity-20" />
                </div>
              )}
              <div className="space-y-0">
                {concepts.map((concept: any, index: number) => renderConcept(concept, index === concepts.length - 1))}
              </div>
            </div>
          )})
        })()}

      </div>
    </main>
  )
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#FAFBFF] p-6">Loading Map...</div>}>
      <MapContent />
    </Suspense>
  )
}
