"use client"

import { useState, useMemo, Suspense, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Search,
  AlertTriangle,
  Sigma,
  ArrowLeft,
  Network,
  Terminal,
  Code,
  Cpu,
  Database,
  Bookmark,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  Target,
  Layers,
  ChevronRight,
  GitBranch,
  FileCheck,
  ChevronDown
} from "lucide-react"
import { useConcepts, useSettings, useAttempts, useQuestionBank, useCollection } from "@/lib/storage/hooks"
import { COLLECTIONS } from "@/lib/storage/store"
import { deriveMasteryState } from "@/lib/analytics/graph-selectors"
import { getSubjectsForExam, getActiveExamId, getAllTests } from "@/lib/exams/registry"
import type { Concept, MasteryState } from "@/lib/domain/types"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { DiagramRenderer } from "@/components/diagram-renderer"
import 'katex/dist/katex.min.css'
import dynamic from 'next/dynamic'

const Latex = dynamic(() => import('react-latex-next'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-4 rounded w-16 inline-block" />
})

type StatusFilter = "all" | "mastered" | "learning" | "untouched"

const FormattedSummary = ({ summary }: { summary?: string }) => {
  if (!summary) return null
  
  // Replace backticks with KaTeX \texttt
  const processed = summary.replace(/`([^`]+)`/g, '$\\texttt{$1}$')
  
  // Split on numbering patterns like "1. ", "2. ", etc., but keep the number
  const parts = processed.split(/(?=\b[1-9]\.\s+[A-Z])/)
  
  return (
    <div className="flex flex-col gap-3">
      {parts.map((part, idx) => {
        const trimmed = part.trim()
        if (!trimmed) return null
        
        // Check if this part is a list item
        const match = trimmed.match(/^([1-9]\.)\s+([\s\S]*)/)
        
        if (match) {
          // Remove trailing semicolon if any
          const content = match[2].replace(/;\s*$/, '').trim()
          return (
            <div key={idx} className="flex gap-2.5 bg-[#F3F4F6]/60 p-2.5 md:p-3 rounded-[10px] border-[1.5px] border-[#1F2937]/10">
              <div className="w-5 h-5 shrink-0 bg-[#1F2937] text-white rounded-full flex items-center justify-center font-heading font-black text-[11px] shadow-sm mt-0.5">
                {match[1].replace('.', '')}
              </div>
              <div className="text-[13px] sm:text-[14px] font-bold text-[#374151] leading-relaxed">
                <Latex>{content}</Latex>
              </div>
            </div>
          )
        }
        
        // Regular paragraph
        return (
          <div key={idx} className="text-[13.5px] sm:text-[14px] md:text-[15px] text-[#1F2937] leading-relaxed font-medium">
            <Latex>{trimmed}</Latex>
          </div>
        )
      })}
    </div>
  )
}


function MapContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeSubjectId = searchParams.get("subject")
  const activeChapterId = searchParams.get("chapter")

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  const allConcepts = useConcepts()
  const { settings } = useSettings()
  const { attempts } = useAttempts()
  const { data: srsCards } = useCollection(COLLECTIONS.srsCards)
  const { questionMap } = useQuestionBank()
  
  const activeExamId = getActiveExamId(settings.profile)
  const SUBJECTS = useMemo(() => getSubjectsForExam(activeExamId), [activeExamId])
  const allTests = useMemo(() => getAllTests(), [])

  // Map each concept to its derived mastery state
  const conceptMasteryMap = useMemo(() => {
    const map = new Map<string, MasteryState>()
    allConcepts.forEach((c: Concept) => {
      map.set(c.id, deriveMasteryState(c, attempts, srsCards, questionMap))
    })
    return map
  }, [allConcepts, attempts, srsCards, questionMap])

  // Overall syllabus stats across all concepts
  const overallStats = useMemo(() => {
    let mastered = 0
    let learning = 0
    let untouched = 0
    allConcepts.forEach((c: Concept) => {
      const state = conceptMasteryMap.get(c.id) || "untouched"
      if (state === "mastered" || state === "solid") mastered++
      else if (state === "learning" || state === "shaky") learning++
      else untouched++
    })
    return {
      total: allConcepts.length,
      mastered,
      learning,
      untouched,
      masteryPercent: allConcepts.length > 0 ? Math.round((mastered / allConcepts.length) * 100) : 0,
    }
  }, [allConcepts, conceptMasteryMap])

  const activeSubject = useMemo(() => {
    return SUBJECTS.find(s => s.id === activeSubjectId)
  }, [SUBJECTS, activeSubjectId])

  const activeSubjectName = activeSubject?.name || activeSubjectId

  const activeChapter = useMemo(() => {
    return activeSubject?.chapters?.find(c => c.id === activeChapterId)
  }, [activeSubject, activeChapterId])

  const hasChapters = (activeSubject?.chapters?.length || 0) > 0

  // Topic filter state initialized from chapter param if any
  const initialTopic = useMemo(() => {
    if (!activeChapterId || activeChapterId === "ALL") return "ALL"
    const match = allConcepts.find((c: any) =>
      c.chapterId === activeChapterId || c.category?.toLowerCase() === activeChapterId?.toLowerCase()
    )
    return match?.category || "ALL"
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [selectedTopicId, setSelectedTopicId] = useState<string>(initialTopic)
  const [expandedConcepts, setExpandedConcepts] = useState<Set<string>>(new Set())

  const toggleConcept = (id: string) => {
    setExpandedConcepts(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  const subjectConcepts = useMemo(() => {
    if (!activeSubjectId) return []
    return allConcepts.filter((c: any) => c.subjectId === activeSubjectName || c.subjectId === activeSubjectId)
  }, [allConcepts, activeSubjectId, activeSubjectName])

  // Available topic categories for current subject
  const availableTopics = useMemo(() => {
    const map = new Map<string, { id: string; label: string; count: number }>()
    subjectConcepts.forEach((c: any) => {
      const tid = c.category || "general"
      const label = c.category || "General"
      if (!map.has(tid)) {
        map.set(tid, { id: tid, label: String(label), count: 0 })
      }
      map.get(tid)!.count++
    })
    return Array.from(map.values())
  }, [subjectConcepts])

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery)
  const [visibleCount, setVisibleCount] = useState(20)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setVisibleCount(20) // Reset pagination on search
    }, 300)
    return () => clearTimeout(handler)
  }, [searchQuery])

  // Filtered concepts based on topic, status filter, and search query
  const allFilteredConcepts = useMemo(() => {
    let result = subjectConcepts
    if (selectedTopicId !== "ALL") {
      result = result.filter((c: any) => (c.category || "general") === selectedTopicId)
    }

    if (statusFilter !== "all") {
      result = result.filter((c: Concept) => {
        const state = conceptMasteryMap.get(c.id) || "untouched"
        if (statusFilter === "mastered") return state === "mastered" || state === "solid"
        if (statusFilter === "learning") return state === "learning" || state === "shaky"
        if (statusFilter === "untouched") return state === "untouched"
        return true
      })
    }

    if (debouncedSearchQuery) {
      const q = debouncedSearchQuery.toLowerCase()
      result = result.filter((c: any) => 
        c.label.toLowerCase().includes(q) || 
        c.summary.toLowerCase().includes(q) ||
        (c.formula && c.formula.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q)) ||
        (c.commonTraps && c.commonTraps.some((t: string) => t.toLowerCase().includes(q)))
      )
    }
    return result
  }, [subjectConcepts, selectedTopicId, statusFilter, debouncedSearchQuery, conceptMasteryMap])

  const filteredConcepts = useMemo(() => {
    return allFilteredConcepts.slice(0, visibleCount)
  }, [allFilteredConcepts, visibleCount])

  // Helper to find matching drill URL for a concept
  const getConceptDrillLink = (concept: Concept): string => {
    // 1. Try to find a specific test matching the concept's chapterId
    if (concept.chapterId) {
      const exactTest = allTests.find(t => t.id === concept.chapterId || t.id === `subj-${concept.chapterId}`)
      if (exactTest) return `/tests/${exactTest.id}?mode=practice`
    }

    // 2. Default to subject-level drill
    const subSlug = (activeSubjectId || concept.subjectId).toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return `/tests/subj-${subSlug}?mode=practice`
  }

  // VIEW 1: Select Subject & Syllabus Statistics
  if (!activeSubjectId) {
    return (
      <main className="min-h-screen pt-3 sm:pt-6 md:pt-10 pb-28 md:pb-40 px-3 sm:px-4 md:px-6 max-w-6xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 bg-transparent">
        {/* Top Header */}
        <div className="bg-[#E5F6FF] border-[3px] border-[#1F2937] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-neo relative overflow-hidden mb-6">
          <div className="absolute -top-10 -right-10 size-40 bg-[#1CB0F6] opacity-20 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
              <div className="inline-flex items-center gap-2 bg-white border-2 border-[#1F2937] px-3 py-1 rounded-xl shadow-neo-xs">
                <Network className="size-4 text-[#1CB0F6]" strokeWidth={2.5} />
                <p className="font-mono text-[10px] sm:text-xs font-black tracking-widest text-foreground uppercase">
                  Subject Mastery
                </p>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-foreground uppercase tracking-tighter">
                Knowledge Graph &amp; Syllabus Map
              </h1>
              <p className="text-xs sm:text-sm font-bold text-foreground/80 max-w-xl">
                Explore atomic concepts, dependency prerequisites, and KaTeX formulas across all 12 GATE CSE subjects.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <Link href="/revise" className="group block h-full">
            <Card className="p-4 sm:p-5 md:p-6 bg-[#FAFBFF] border-2 sm:border-[3px] border-[#1F2937] rounded-2xl sm:rounded-[24px] shadow-neo-xs hover:-translate-y-1 hover:shadow-neo transition-all h-full flex flex-col justify-center items-center text-center gap-2 sm:gap-3 overflow-hidden relative">
              <div className="absolute -top-6 -right-6 size-24 bg-[#6C8EF2]/30 md:bg-[#E8EEFF] rounded-full opacity-70 md:opacity-50 blur-xl group-hover:bg-[#6C8EF2] transition-colors duration-500" />
              <div className="relative size-12 sm:size-14 md:size-16 rounded-full border-[2px] sm:border-[3px] border-[#1F2937] bg-white flex items-center justify-center group-hover:bg-[#1CB0F6] group-hover:border-[#1CB0F6] transition-colors z-10 shadow-sm">
                <Target className="size-5 sm:size-6 md:size-8 text-[#1CB0F6] group-hover:text-white transition-colors" strokeWidth={3} />
              </div>
              <div className="relative z-10">
                <h3 className="font-heading font-black text-[13px] sm:text-base md:text-xl text-primary-text uppercase tracking-wide">Smart Revise</h3>
                <p className="text-[9px] sm:text-[10px] md:text-xs font-bold text-secondary-text mt-1 max-w-[200px] mx-auto leading-snug">Review weak concepts via Spaced Repetition</p>
              </div>
            </Card>
          </Link>

          <Link href="/formulas" className="group block h-full">
            <Card className="p-4 sm:p-5 md:p-6 bg-[#FAFBFF] border-2 sm:border-[3px] border-[#1F2937] rounded-2xl sm:rounded-[24px] shadow-neo-xs hover:-translate-y-1 hover:shadow-neo transition-all h-full flex flex-col justify-center items-center text-center gap-2 sm:gap-3 overflow-hidden relative">
              <div className="absolute -bottom-6 -left-6 size-24 bg-[#FFB020]/30 md:bg-[#FFF4D6] rounded-full opacity-70 md:opacity-50 blur-xl group-hover:bg-[#FFB020] transition-colors duration-500" />
              <div className="relative size-12 sm:size-14 md:size-16 rounded-full border-[2px] sm:border-[3px] border-[#1F2937] bg-white flex items-center justify-center group-hover:bg-[#FFB020] group-hover:border-[#FFB020] transition-colors z-10 shadow-sm">
                <Sigma className="size-5 sm:size-6 md:size-8 text-[#FFB020] group-hover:text-white transition-colors" strokeWidth={3} />
              </div>
              <div className="relative z-10">
                <h3 className="font-heading font-black text-[13px] sm:text-base md:text-xl text-primary-text uppercase tracking-wide">Formula Sheet</h3>
                <p className="text-[9px] sm:text-[10px] md:text-xs font-bold text-secondary-text mt-1 max-w-[200px] mx-auto leading-snug">Quick access to all math & logic rules</p>
              </div>
            </Card>
          </Link>
        </div>

        {/* Subject Cards Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-lg font-heading font-black text-primary-text uppercase tracking-wide">
              All 12 GATE CSE Subjects
            </h2>
            <span className="text-[11px] sm:text-xs font-bold text-secondary-text hidden sm:inline">
              Select a subject to explore concepts
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3.5">
            {SUBJECTS.map(sub => {
              const subConcepts = allConcepts.filter(c => c.subjectId === sub.id || c.subjectId === sub.name)
              const count = subConcepts.length
              const masteredCount = subConcepts.filter(c => {
                const s = conceptMasteryMap.get(c.id)
                return s === "mastered" || s === "solid"
              }).length
              const pct = count > 0 ? Math.round((masteredCount / count) * 100) : 0

              return (
                <button
                  key={sub.id}
                  onClick={() => router.push(`/map?subject=${sub.id}`)}
                  className="text-left w-full h-full group"
                >
                  <Card className="p-2.5 sm:p-4 h-full bg-white border-2 sm:border-[3px] border-[#1F2937] rounded-xl sm:rounded-[18px] shadow-neo-xs hover:-translate-y-0.5 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1.5 sm:mb-2.5">
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-[#E8EEFF] text-[#4F75E2] border border-[#1F2937]">
                          {sub.weightage} Marks
                        </span>
                        <div className="size-5 sm:size-7 rounded-full border border-[#1F2937] bg-[#F0F4FF] flex items-center justify-center shrink-0 group-hover:bg-[#6C8EF2] group-hover:text-white transition-colors">
                          <ChevronRight className="size-3 sm:size-3.5" strokeWidth={3} />
                        </div>
                      </div>

                      <h3 className="font-heading font-black text-xs sm:text-base text-primary-text group-hover:text-[#6C8EF2] transition-colors leading-snug line-clamp-2">
                        {sub.name}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] font-bold text-secondary-text mt-0.5">
                        {count} Concepts
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#1F2937]/10">
                      <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold text-secondary-text mb-0.5">
                        <span>Mastery</span>
                        <span className="font-black text-foreground">{pct}%</span>
                      </div>
                      <div className="w-full h-1 sm:h-1.5 bg-gray-100 border border-[#1F2937] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#58CC02] transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </Card>
                </button>
              )
            })}
          </div>
        </div>
      </main>
    )
  }

  // VIEW 2: Select Chapter (if the subject has chapters and no chapter is selected yet)
  if (hasChapters && !activeChapterId) {
    return (
      <main className="min-h-dvh pt-8 md:pt-12 pb-24 px-4 sm:px-6 max-w-5xl mx-auto space-y-8 bg-transparent">
        <header className="mb-6">
          <button
            onClick={() => router.push('/map')}
            className="mb-4 inline-flex items-center gap-2 text-[14px] font-black text-secondary-text hover:text-primary-text transition-colors"
          >
            <ArrowLeft className="size-4" strokeWidth={3} /> Back to All Subjects
          </button>
          <h1 className="text-[26px] md:text-[30px] font-heading font-black text-primary-text flex items-center gap-3 uppercase">
            {activeSubjectName}
          </h1>
          <p className="text-[14px] text-secondary-text font-medium mt-1">
            Select a chapter to explore atomic concepts and practice drills.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activeSubject!.chapters!.map(ch => {
            const count = allConcepts.filter(c => c.chapterId === ch.id || c.chapterId === ch.name).length
            return (
              <button
                key={ch.id}
                onClick={() => router.push(`/map?subject=${activeSubjectId}&chapter=${ch.id}`)}
                className="text-left w-full group"
              >
                <Card className="p-5 h-full bg-white border-[3px] border-[#1F2937] rounded-[16px] shadow-neo-sm hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-heading font-black text-[17px] text-primary-text group-hover:text-[#6C8EF2] transition-colors line-clamp-2">
                        {ch.name}
                      </h3>
                      <p className="text-[13px] font-bold text-secondary-text mt-2 uppercase tracking-wide">
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

  // VIEW 3: Linear Feed of Concepts (Filtered by Subject, Chapter, Topic, Status, and Search)
  return (
    <main className="min-h-dvh w-full relative bg-transparent overflow-x-hidden">

      {/* Header & Controls Bar (relative on mobile per Rule 5, sticky on md+) */}
      <div className="relative md:sticky md:top-0 z-20 bg-white border-b-[4px] border-[#1F2937] px-3.5 sm:px-6 py-3.5 md:py-4 shadow-neo-sm">
        <div className="max-w-5xl mx-auto flex flex-col gap-3">
          
          {/* Top Row: Back Button, Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => {
                if (hasChapters && activeChapterId) {
                  router.push(`/map?subject=${activeSubjectId}`)
                } else {
                  router.push('/map')
                }
              }}
              className="size-10 md:size-11 bg-white border-[3px] border-[#1F2937] rounded-full flex items-center justify-center shadow-neo-sm hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all shrink-0"
              aria-label="Go Back"
            >
              <ArrowLeft className="size-5 text-[#1F2937]" strokeWidth={3} />
            </button>
            
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-[17px] md:text-[22px] font-heading font-black text-primary-text uppercase truncate leading-tight">
                  {activeChapter ? activeChapter.name : activeSubjectName}
                </h1>
              </div>
              {activeChapter && (
                <span className="text-[11px] font-bold text-secondary-text uppercase tracking-wider truncate">
                  {activeSubjectName}
                </span>
              )}
            </div>
          </div>

          {/* Middle Row: Filters (Subject & Topic) */}
          <div className="flex flex-col md:flex-row md:items-center gap-2.5 w-full">
            <select
              value={activeSubjectId || ""}
              onChange={(e) => router.push(`/map?subject=${e.target.value}`)}
              className="flex-1 min-w-0 h-9 md:h-10 border-[2.5px] border-[#1F2937] bg-[#FAFBFF] rounded-full px-3 md:px-4 font-heading font-bold text-[12px] md:text-[13px] outline-none shadow-neo-sm cursor-pointer text-[#1F2937] truncate"
            >
              {SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            {availableTopics.length > 0 && (
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="flex-1 min-w-0 h-9 md:h-10 border-[2.5px] border-[#1F2937] bg-white rounded-full px-3 md:px-4 font-heading font-black text-[11px] md:text-[12px] tracking-wide outline-none shadow-neo-sm text-[#1F2937] uppercase cursor-pointer truncate"
              >
                <option value="ALL">ALL TOPICS ({subjectConcepts.length})</option>
                {availableTopics.map((top) => (
                  <option key={top.id} value={top.id}>
                    {top.label.toUpperCase()} ({top.count})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Bottom Row: Search Box */}
          <div className="relative w-full">
            <Search className="size-4 text-[#1F2937] absolute left-3 top-2.5 md:top-3" strokeWidth={3} />
            <input
              type="text"
              placeholder="Search concepts (e.g. B+ Trees)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 md:h-10 pl-9 pr-4 rounded-full border-[2.5px] border-[#1F2937] text-[13px] font-medium outline-none shadow-neo-sm placeholder:text-[#6B7280] focus:border-[#1F2937] transition-all"
            />
          </div>

        </div>
      </div>

      {/* Main Concept Feed */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-10">

        {/* Empty State */}
        {filteredConcepts.length === 0 && (
          <div className="text-center py-16 bg-white border-[3px] border-[#1F2937] rounded-[20px] shadow-neo p-6">
            <Search className="size-12 text-[#1F2937]/30 mx-auto mb-3" strokeWidth={3} />
            <p className="text-[18px] md:text-[20px] font-heading font-black text-[#1F2937]">No concepts match your criteria.</p>
            <p className="text-[14px] text-secondary-text font-medium mt-1">
              Try adjusting your search query, topic, or status filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
                setSelectedTopicId("ALL")
              }}
              className="mt-4 px-4 py-2 bg-[#6C8EF2] text-white border-[2.5px] border-[#1F2937] rounded-full font-heading font-black text-[12px] uppercase shadow-neo-sm hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

        {filteredConcepts.length > 0 && (() => {
          // Group concepts by category
          const grouped = new Map<string, Concept[]>()
          filteredConcepts.forEach(c => {
            const cid = c.category || c.subjectId || "general"
            if (!grouped.has(cid)) grouped.set(cid, [])
            grouped.get(cid)!.push(c)
          })

          const renderConcept = (concept: Concept, isLast: boolean) => {
            const mastery = conceptMasteryMap.get(concept.id) || "untouched"

            let badgeColor = "bg-[#1CB0F6] text-white"
            if (concept.kind === "algorithm") badgeColor = "bg-[#58CC02] text-white"
            else if (concept.kind === "theorem") badgeColor = "bg-[#FFB020] text-[#1F2937]"
            else if (concept.kind === "technique") badgeColor = "bg-[#CE82FF] text-white"
            else if (concept.kind === "pitfall") badgeColor = "bg-[#FF4B4B] text-white"

            const codeContent = concept.pseudocode || concept.codeSnippet
            const hasRealCode = codeContent && !/^#\s*no code(?:\s+(?:needed|required|here))?\s*\.?\s*$/i.test(codeContent.trim())

            const formatLatex = (str: string): string => {
              if (!str) return ""
              const clean = str.trim()
              if (clean === "$$" || clean === "$") return ""
              if (clean.includes("$")) return clean
              return `$${clean}$`
            }

            const hasRealComplexity = concept.complexity && concept.complexity !== "Core Concept"
            
            // Cleanly collect all individual formula items from both `formula` and `keyFormulae`
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
            const drillLink = getConceptDrillLink(concept)

            // Mastery status badge color and label
            const masteryBadgeConfig: Record<MasteryState, { label: string; color: string; icon: any }> = {
              mastered: { label: "Mastered", color: "bg-[#CE82FF] text-white", icon: CheckCircle2 },
              solid: { label: "Solid", color: "bg-[#58CC02] text-white", icon: CheckCircle2 },
              learning: { label: "Learning", color: "bg-[#1CB0F6] text-white", icon: Clock },
              shaky: { label: "Needs Practice", color: "bg-[#FFC800] text-[#1F2937]", icon: AlertTriangle },
              untouched: { label: "Unvisited", color: "bg-gray-200 text-gray-700", icon: Layers },
            }

            const currentMasteryMeta = masteryBadgeConfig[mastery] || masteryBadgeConfig.untouched
            const MasteryIcon = currentMasteryMeta.icon

            const isExpanded = expandedConcepts.has(concept.id) || searchQuery.length > 0;

            return (
              <div key={concept.id} className="relative group/card">
                {!isLast && (
                  <div className="absolute left-8 md:left-10 top-20 bottom-[-2.5rem] w-[3px] md:w-[4px] bg-[#1F2937] z-0 opacity-20 group-hover/card:bg-[#6C8EF2] group-hover/card:opacity-100 transition-colors" />
                )}

                <Card className={cn("relative z-10 p-5 sm:p-7 md:p-8 bg-white border-[3.5px] border-[#1F2937] rounded-[22px] transition-transform mb-8", isExpanded ? "shadow-neo" : "shadow-neo-sm hover:translate-x-0.5 hover:-translate-y-0.5 cursor-pointer")}>
                  <div className="flex flex-col gap-4 md:gap-5">

                    <div 
                      className="cursor-pointer group flex flex-col gap-3 md:gap-4"
                      onClick={() => toggleConcept(concept.id)}
                    >
                      <div className="flex items-center w-full">
                        {/* Badges Bar: Kind, Status, Weightage, PYQ tag */}
                        <div className="flex items-center gap-1.5 w-full pb-1 -mb-1 min-w-0">
                          <span className={cn("text-[9px] sm:text-[10px] md:text-[11px] shrink-0 font-black uppercase tracking-wide px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border-[1.5px] border-[#1F2937] shadow-neo-sm", badgeColor)}>
                            {concept.kind}
                          </span>

                          {/* Mastery Badge */}
                          <span className={cn("text-[9px] sm:text-[10px] md:text-[11px] shrink-0 font-black uppercase tracking-wide px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border-[1.5px] border-[#1F2937] shadow-neo-sm inline-flex items-center gap-1 sm:gap-1.5", currentMasteryMeta.color)}>
                            <MasteryIcon className="size-2.5 sm:size-3 md:size-3.5" strokeWidth={3} />
                            {currentMasteryMeta.label}
                          </span>

                          {/* Exam Weightage / Relevance */}
                          <span className="bg-[#FFF9E5] text-[#1F2937] border-[1.5px] border-[#1F2937] shadow-neo-sm font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full inline-flex items-center gap-1 text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-wide shrink-0">
                            <Sparkles className="size-2.5 sm:size-3 md:size-3.5 text-[#FFB020] fill-[#FFB020]" />
                            {concept.examRelevance || 5}/5
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-end gap-3 w-full">
                        <div className="flex-1 flex flex-col gap-2 min-w-0">
                          {/* Concept Title */}
                          <h2 className="text-[20px] sm:text-[24px] md:text-[28px] font-heading font-black text-primary-text leading-tight pr-2">
                            {concept.label}
                          </h2>

                          {/* Collapsed Preview */}
                          {!isExpanded && concept.summary && (
                            <div className="text-[13px] sm:text-[14px] text-secondary-text leading-relaxed font-medium line-clamp-2 pr-2 whitespace-pre-line">
                              <Latex>{concept.summary.replace(/`([^`]+)`/g, '$\\texttt{$1}$').replace(/(\s+)(?=[1-9]\.\s+[A-Z])/g, '\n')}</Latex>
                            </div>
                          )}
                        </div>

                        {/* Toggle Icon (Now at bottom right of header) */}
                        <div className="p-1.5 md:p-2 rounded-full border-[2px] border-[#1F2937] bg-white group-hover:bg-[#F3F4F6] transition-colors shrink-0 self-end mb-1 md:mb-1.5">
                          <ChevronDown className={cn("size-3.5 md:size-4 transition-transform", isExpanded && "rotate-180")} strokeWidth={3} />
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="flex flex-col gap-4 md:gap-5 animate-in slide-in-from-top-2 fade-in duration-200">
                        {/* Concept Summary / Explanation with Formatted Layout */}
                        <FormattedSummary summary={concept.summary} />

                    {/* Prerequisites and Dependency Relationship */}
                    {concept.prerequisites && concept.prerequisites.length > 0 && (
                      <div className="p-3 bg-[#F8FAFC] border-[2px] border-[#1F2937] rounded-[14px] flex flex-wrap items-center gap-2 text-[12px] font-bold">
                        <span className="text-secondary-text uppercase tracking-wider inline-flex items-center gap-1">
                          <GitBranch className="size-3.5 text-[#6C8EF2]" strokeWidth={3} /> Prerequisites:
                        </span>
                        {concept.prerequisites.map((prereqId: string) => {
                          const prereqConcept = allConcepts.find(c => c.id === prereqId)
                          const label = prereqConcept ? prereqConcept.label : prereqId
                          return (
                            <button
                              key={prereqId}
                              onClick={() => {
                                if (prereqConcept) {
                                  setSearchQuery(prereqConcept.name || prereqConcept.label)
                                }
                              }}
                              className="px-2.5 py-0.5 bg-white border-[1.5px] border-[#1F2937] rounded-full text-[#1F2937] hover:bg-[#6C8EF2] hover:text-white transition-colors"
                            >
                              {label}
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {/* Mindmap Subtopics */}
                    {typeof concept.mindmap === "object" && concept.mindmap !== null && Array.isArray(concept.mindmap.branches) && concept.mindmap.branches.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] font-bold text-secondary-text uppercase tracking-wider mr-1">
                          Core Aspects:
                        </span>
                        {concept.mindmap.branches.map((branch: string, bIdx: number) => (
                          <span
                            key={bIdx}
                            className="px-2.5 py-0.5 bg-[#E8EEFF] text-[#3B66E0] border-[1.5px] border-[#1F2937]/30 rounded-md text-[11px] font-bold"
                          >
                            {branch}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Visual Diagram */}
                    {concept.imageUrl && (
                      <div className="my-1 border-[3px] border-[#1F2937] rounded-[16px] p-3 md:p-4 bg-white shadow-neo-sm overflow-hidden flex justify-center">
                        <DiagramRenderer url={concept.imageUrl} />
                      </div>
                    )}

                    {/* Pseudocode / Code Snippet */}
                    {hasRealCode && (
                      <div className="bg-[#1F2937] border-[3.5px] border-[#1F2937] rounded-[16px] p-3 sm:p-4 md:p-5 text-[#A7F3D0] shadow-neo-sm overflow-x-auto custom-scrollbar">
                        <h3 className="text-[12px] md:text-[13px] font-heading font-black flex items-center gap-2 mb-2.5 uppercase tracking-wide text-white">
                          <Code className="size-4 md:size-5" strokeWidth={3} /> Pseudocode / Algorithm
                        </h3>
                        <pre className="font-mono text-[10px] sm:text-[11px] md:text-[13px] font-bold leading-relaxed whitespace-pre">
                          {codeContent}
                        </pre>
                      </div>
                    )}

                    {/* Key Formulas & Math Rules */}
                    {(hasFormulas || hasRealComplexity) && (
                      <div className="bg-[#1CB0F6] border-[3.5px] border-[#1F2937] rounded-[16px] p-4 sm:p-5 md:p-6 text-white shadow-neo-sm">
                        {hasFormulas && (
                          <>
                            <h3 className="text-[13px] md:text-[14px] font-heading font-black flex items-center gap-2 mb-3 uppercase tracking-wide">
                              <Sigma className="size-4 md:size-5" strokeWidth={3} /> Key Formulas & Mathematical Rules
                            </h3>
                            <div className="space-y-2">
                              {formulaList.map((f, idx) => (
                                <div key={idx} className="text-[12px] sm:text-[14px] md:text-[15px] font-bold overflow-x-auto bg-white/20 p-3 rounded-xl custom-scrollbar leading-relaxed">
                                  <Latex>{formatLatex(f)}</Latex>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {hasRealComplexity && (
                          <div className={cn("font-heading font-bold text-[14px]", hasFormulas ? "mt-3 pt-3 border-t-2 border-white/20" : "")}>
                            <span className="opacity-80 uppercase text-[11px] tracking-wider block mb-1">Time & Space Complexity</span>
                            <Latex>{String(concept.complexity || "")}</Latex>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Common Exam Traps */}
                    {concept.commonTraps && concept.commonTraps.length > 0 && (
                      <div className="bg-[#FF4B4B] border-[3.5px] border-[#1F2937] rounded-[16px] p-4 sm:p-5 md:p-6 text-white shadow-neo-sm">
                        <h3 className="text-[13px] md:text-[14px] font-heading font-black flex items-center gap-2 mb-3 uppercase tracking-wide">
                          <AlertTriangle className="size-4 md:size-5" strokeWidth={3} /> GATE Exam Traps & Pitfalls
                        </h3>
                        <ul className="space-y-2.5">
                          {concept.commonTraps.map((trap: string, idx: number) => (
                            <li key={idx} className="flex gap-2.5 text-[13px] sm:text-[14px] md:text-[15px] font-bold leading-relaxed">
                              <span className="mt-1.5 size-2 rounded-full bg-white shrink-0" />
                              <span><Latex>{trap}</Latex></span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    </div>
                  )}

                  </div>
                </Card>
              </div>
            )
          }

          return Array.from(grouped.entries()).map(([groupKey, concepts]) => {
            const resolvedLabel = availableTopics.find(t => t.id === groupKey)?.label ?? groupKey
            return (
              <div key={groupKey} className="relative pt-2">
                {selectedTopicId === "ALL" && availableTopics.length > 1 && (
                  <div className="mb-6 flex items-center gap-4">
                    <div className="h-[3px] flex-1 bg-[#1F2937] opacity-20" />
                    <h3 className="text-[13px] md:text-[14px] font-heading font-black text-primary-text px-4 py-1.5 bg-[#E5F9D6] border-[2.5px] border-[#1F2937] rounded-[12px] shadow-neo-sm uppercase tracking-wider">
                      {resolvedLabel}
                    </h3>
                    <div className="h-[3px] flex-1 bg-[#1F2937] opacity-20" />
                  </div>
                )}
                <div className="space-y-0">
                  {concepts.map((concept: Concept, index: number) => renderConcept(concept, index === concepts.length - 1))}
                </div>
              </div>
            )
          })
        })()}

      </div>

      {allFilteredConcepts.length > visibleCount && (
        <div className="flex justify-center pt-8 pb-12">
          <button
            onClick={() => setVisibleCount((prev) => prev + 20)}
            className="neo-btn bg-[#FF9600] text-white px-8 py-3 rounded-2xl font-heading font-black uppercase tracking-wider shadow-neo"
          >
            Load More Concepts ({allFilteredConcepts.length - visibleCount} left)
          </button>
        </div>
      )}
    </main>
  )
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#FAFBFF] p-6 font-heading font-bold">Loading Knowledge Graph...</div>}>
      <MapContent />
    </Suspense>
  )
}
