"use client"

import { useState, useMemo, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, X, AlertTriangle, Sigma, ArrowLeft, Network, Terminal, Code, Cpu, Database } from "lucide-react"
import { useConcepts, useSettings } from "@/lib/storage/hooks"
import { getSubjectsForExam, getActiveExamId } from "@/lib/exams/registry"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
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

  const subjectConcepts = useMemo(() => {
    if (!activeSubjectId) return []
    // If a chapter is selected, only show concepts for that chapter
    if (activeChapterId) {
      return allConcepts.filter((c: any) => c.chapterId === activeChapterId || c.chapterId === activeChapter?.name)
    }
    // Otherwise show all concepts for the subject
    return allConcepts.filter((c: any) => c.subjectId === activeSubjectName || c.subjectId === activeSubjectId)
  }, [allConcepts, activeSubjectId, activeSubjectName, activeChapterId, activeChapter])

  const filteredConcepts = useMemo(() => {
    if (!searchQuery) return subjectConcepts
    const q = searchQuery.toLowerCase()
    return subjectConcepts.filter((c) => 
      c.label.toLowerCase().includes(q) || 
      c.summary.toLowerCase().includes(q)
    )
  }, [subjectConcepts, searchQuery])

  // VIEW 1: Select Subject
  if (!activeSubjectId) {
    return (
      <main className="min-h-screen pt-12 pb-24 px-6 max-w-5xl mx-auto space-y-8 bg-[#FAFBFF]">
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
      <main className="min-h-screen pt-12 pb-24 px-6 max-w-5xl mx-auto space-y-8 bg-[#FAFBFF]">
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
          {activeSubject.chapters!.map(ch => {
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
    <main className="min-h-screen w-full relative bg-[#FAFBFF] overflow-x-hidden">
      
      {/* Playful Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
        <Terminal className="absolute top-20 left-10 size-24 text-[#6C8EF2] animate-[spin_10s_linear_infinite]" strokeWidth={2} />
        <Code className="absolute top-40 right-20 size-32 text-[#FFB020] animate-bounce" strokeWidth={2} />
        <Cpu className="absolute bottom-40 left-32 size-28 text-[#1CB0F6] animate-pulse" strokeWidth={2} />
        <Database className="absolute bottom-20 right-1/4 size-20 text-[#FF4B4B] animate-bounce" style={{ animationDelay: '1s' }} strokeWidth={2} />
        <Network className="absolute top-1/2 right-10 size-24 text-[#58CC02] animate-[spin_12s_linear_infinite]" strokeWidth={2} />
      </div>

      {/* Header / Search */}
      <div className="sticky top-0 z-20 bg-white border-b-[4px] border-[#1F2937] px-4 md:px-6 py-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-neo-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={() => {
              if (hasChapters) {
                router.push(`/map?subject=${activeSubjectId}`)
              } else {
                router.push('/map')
              }
            }}
            className="size-12 bg-white border-[3px] border-[#1F2937] rounded-full flex items-center justify-center shadow-neo-sm hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all shrink-0"
          >
            <ArrowLeft className="size-6 text-[#1F2937]" strokeWidth={3} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-[20px] md:text-[24px] font-heading font-black text-primary-text uppercase flex-1 truncate leading-tight">
              {activeChapter ? activeChapter.name : activeSubjectName}
            </h1>
            {activeChapter && (
              <span className="text-[12px] font-bold text-secondary-text uppercase tracking-wider">
                {activeSubjectName}
              </span>
            )}
          </div>
        </div>
        <div className="relative w-full md:w-96 shrink-0">
          <Search className="size-5 text-[#1F2937] absolute left-4 top-3.5" strokeWidth={3} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts..."
            className="w-full h-12 border-[3px] border-[#1F2937] bg-white rounded-full pl-12 pr-4 font-heading font-bold text-[15px] outline-none shadow-neo-sm focus:translate-y-1 focus:shadow-none transition-all text-[#1F2937]"
          />
        </div>
      </div>

      {/* Timeline / Linear Feed */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12 space-y-12">
        {(() => {
          if (filteredConcepts.length === 0) return null

          // Group concepts by chapterId if we are at the subject level (should only happen for exams without chapters)
          const grouped = new Map<string, any[]>()
          filteredConcepts.forEach(c => {
            const cid = c.chapterId || c.subjectId
            if (!grouped.has(cid)) grouped.set(cid, [])
            grouped.get(cid)!.push(c)
          })

          const renderConcept = (concept: any, isLast: boolean) => {
            let badgeColor = "bg-[#1F2937] text-white"
            if (concept.kind === "algorithm") badgeColor = "bg-[#58CC02] text-white"
            else if (concept.kind === "theorem") badgeColor = "bg-[#FFB020] text-white"
            else if (concept.kind === "technique") badgeColor = "bg-[#CE82FF] text-white"

            return (
              <div key={concept.id} className="relative group/card">
                {!isLast && (
                  <div className="absolute left-10 top-20 bottom-[-3rem] w-[4px] bg-[#1F2937] z-0 opacity-20 group-hover/card:bg-[#6C8EF2] group-hover/card:opacity-100 transition-colors" />
                )}
                
                <Card className="relative z-10 p-6 md:p-8 bg-white border-[4px] border-[#1F2937] rounded-[24px] shadow-neo hover:translate-x-1 hover:-translate-y-1 transition-transform mb-8">
                  <div className="flex flex-col gap-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className={cn("text-[12px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border-[3px] border-[#1F2937] shadow-neo-sm", badgeColor)}>
                          {concept.kind}
                        </span>
                        <h2 className="text-[22px] md:text-[28px] font-heading font-black text-primary-text mt-5 leading-tight">
                          {concept.label}
                        </h2>
                      </div>
                    </div>

                    <div className="text-[16px] text-[#1F2937] leading-relaxed font-medium mt-2">
                      <Latex>{concept.summary}</Latex>
                    </div>

                    {concept.pseudocode && (
                      <div className="bg-[#1F2937] border-[4px] border-[#1F2937] rounded-[16px] p-5 md:p-6 text-[#A7F3D0] shadow-neo-sm overflow-x-auto">
                        <h3 className="text-[15px] font-heading font-black flex items-center gap-2 mb-3 uppercase tracking-wide text-white">
                          <Code className="size-5" strokeWidth={3} /> Pseudocode / Snippet
                        </h3>
                        <pre className="font-mono text-[12px] md:text-[15px] font-bold leading-relaxed whitespace-pre-wrap">
                          {concept.pseudocode}
                        </pre>
                      </div>
                    )}

                    {concept.formula && (
                      <div className="bg-[#1CB0F6] border-[4px] border-[#1F2937] rounded-[16px] p-5 md:p-6 text-white shadow-neo-sm">
                        <h3 className="text-[15px] font-heading font-black flex items-center gap-2 mb-4 uppercase tracking-wide">
                          <Sigma className="size-5" strokeWidth={3} /> Key Formulas / Rules
                        </h3>
                        <div className="text-[13px] md:text-[18px] font-bold overflow-x-auto bg-white/20 p-4 rounded-xl custom-scrollbar">
                          <Latex>{`$$${concept.formula}$$`}</Latex>
                        </div>
                        {concept.complexity && (
                          <div className="mt-4 pt-4 border-t-2 border-white/20 font-heading font-bold text-[15px]">
                            <span className="opacity-80 uppercase text-[12px] tracking-wider block mb-1">Complexity</span>
                            <Latex>{concept.complexity}</Latex>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {concept.complexity && !concept.formula && (
                      <div className="bg-[#1CB0F6] border-[4px] border-[#1F2937] rounded-[16px] p-5 text-white shadow-neo-sm">
                         <h3 className="text-[14px] font-heading font-black flex items-center gap-2 mb-2 uppercase">
                          <Sigma className="size-5" strokeWidth={3} /> Complexity
                        </h3>
                        <div className="font-heading font-bold text-[15px]">
                            <Latex>{concept.complexity}</Latex>
                        </div>
                      </div>
                    )}

                    {concept.commonTraps && concept.commonTraps.length > 0 && (
                      <div className="bg-[#FF4B4B] border-[4px] border-[#1F2937] rounded-[16px] p-5 md:p-6 text-white shadow-neo-sm">
                        <h3 className="text-[15px] font-heading font-black flex items-center gap-2 mb-4 uppercase tracking-wide">
                          <AlertTriangle className="size-5" strokeWidth={3} /> Exam Traps
                        </h3>
                        <ul className="space-y-3">
                          {concept.commonTraps.map((trap, idx) => (
                            <li key={idx} className="flex gap-3 text-[15px] font-bold leading-relaxed">
                              <span className="text-white mt-1.5 size-2.5 rounded-full bg-white shrink-0" />
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

          return Array.from(grouped.entries()).map(([chapterId, concepts]) => {
            const chapter = activeSubject?.chapters?.find(ch => ch.id === chapterId)
            
            return (
              <div key={chapterId} className="relative pt-4">
                {/* Only render chapter header if we're not already scoped to this chapter explicitly */}
                {chapter && !activeChapterId && (
                  <div className="mb-8 flex items-center gap-4">
                    <div className="h-[4px] flex-1 bg-[#1F2937] opacity-20" />
                    <h3 className="text-[20px] font-heading font-black text-primary-text px-4 py-2 bg-[#E5F9D6] border-[3px] border-[#1F2937] rounded-[12px] shadow-neo-sm uppercase">
                      {chapter.name}
                    </h3>
                    <div className="h-[4px] flex-1 bg-[#1F2937] opacity-20" />
                  </div>
                )}
                <div className="space-y-0">
                  {concepts.map((concept, index) => renderConcept(concept, index === concepts.length - 1))}
                </div>
              </div>
            )
          })
        })()}
        
        {filteredConcepts.length === 0 && (
          <div className="text-center py-20 bg-white border-[4px] border-[#1F2937] rounded-[24px] shadow-neo">
            <Search className="size-12 text-[#1F2937]/30 mx-auto mb-4" strokeWidth={3} />
            <p className="text-[20px] font-heading font-bold text-[#1F2937]">No concepts found.</p>
            <p className="text-[15px] text-[#1F2937]/70 font-medium mt-2">Try adjusting your search term.</p>
          </div>
        )}
      </div>
    </main>
  )
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFBFF] p-6">Loading Map...</div>}>
      <MapContent />
    </Suspense>
  )
}
