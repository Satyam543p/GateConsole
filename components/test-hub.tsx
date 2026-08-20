"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Clock, FileText, Layers, CheckCircle2, Search, X, Star, Wrench, Sparkles, Zap, Check, CheckSquare, Square, AlertCircle, Sliders, ChevronDown } from "lucide-react"
import type { TestDefinition } from "@/lib/test-types"
import { useAttempts } from "@/lib/use-attempts"
import { useQuestionBank, useTests, useSettings, useCollection } from "@/lib/storage/hooks"
import { COLLECTIONS } from "@/lib/storage/store"
import type { Question, MistakeEntry } from "@/lib/domain/types"
import { getSubjectsForExam, getActiveExamId } from "@/lib/exams/registry"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Terminal, Code, Cpu, Database, Network } from "lucide-react"

type Filter = "all" | "subject" | "mock"

function TestCard({ test }: { test: TestDefinition }) {
  const { attempts, ready } = useAttempts()
  const { questionMap, loading } = useQuestionBank()

  const questions = useMemo(() => {
    return test.questionIds.map(id => questionMap.get(id)).filter((q): q is Question => Boolean(q))
  }, [test.questionIds, questionMap])

  const marks = useMemo(() => {
    return questions.reduce((s, q) => s + q.marks, 0)
  }, [questions])

  const history = attempts.filter((a) => a.testId === test.id)
  const best = history.length > 0 ? Math.max(...history.map((a) => a.scored)) : null

  const mix = useMemo(() => {
    const counts = { MCQ: 0, MSQ: 0, NAT: 0 }
    for (const q of questions) counts[q.type] += 1
    return counts
  }, [questions])

  if (loading) {
    return (
      <Card className="flex h-40 items-center justify-center p-6 text-sm text-muted-text">
        Loading test details…
      </Card>
    )
  }

  const isMock = test.kind === "mock"
  const isPyq = test.id.includes("pyq") || test.title.includes("Official GATE PYQ")
  const cardBorderAccent = isPyq ? "amber" : isMock ? "pink" : "blue"

  return (
    <Card accentBorder={cardBorderAccent} className="flex flex-col p-3 sm:p-4 md:p-5 group h-full">
      <div className="flex items-start justify-between gap-2 md:gap-3">
        <div>
          <span
            className={cn(
              "inline-flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-0.5 md:py-1 rounded-[6px] md:rounded-[8px] font-heading text-[9px] md:text-[12px] tracking-wide uppercase font-black border-[2px] border-[#1F2937] shadow-neo-sm",
              isPyq
                ? "bg-[#FF9600] text-white"
                : isMock
                ? "bg-[#CE82FF] text-white"
                : "bg-[#1CB0F6] text-white",
            )}
          >
            {isPyq ? (
              <><Star className="size-3 md:size-4 fill-white" /> Official PYQ</>
            ) : isMock ? (
              <><Layers className="size-3 md:size-4" strokeWidth={3} /> Full Mock</>
            ) : (
              <><FileText className="size-3 md:size-4" strokeWidth={3} /> Practice Drill</>
            )}
          </span>
          <h3 className="mt-2 md:mt-3 text-[14px] sm:text-[16px] md:text-[18px] font-heading font-bold text-primary-text leading-tight">{test.title}</h3>
        </div>
        {ready && best !== null && (
          <div className="shrink-0 text-right bg-[#FFC800] px-2 md:px-3 py-1 md:py-1.5 rounded-[8px] md:rounded-[12px] border-[2px] md:border-[3px] border-[#1F2937] shadow-neo-sm">
            <p className="font-heading font-black text-[14px] md:text-[20px] text-[#1F2937] leading-none">{best.toFixed(1)}</p>
            <p className="font-heading text-[8px] md:text-[10px] text-[#1F2937] uppercase tracking-wider font-black mt-0.5 md:mt-1">Best</p>
          </div>
        )}
      </div>

      <p className="mt-2 md:mt-3 text-[11px] md:text-[14px] leading-snug md:leading-relaxed text-secondary-text flex-1 line-clamp-3 md:line-clamp-none">{test.description}</p>

      {/* Metadata Tags */}
      <div className="mt-3 md:mt-5 flex flex-wrap gap-1.5 md:gap-2">
        <div className="bg-white border-[2px] border-[#1F2937] px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-[6px] md:rounded-[8px] text-[10px] md:text-[12px] font-black text-[#1F2937] shadow-neo-sm">
          {questions.length} Qs
        </div>
        <div className="bg-white border-[2px] border-[#1F2937] px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-[6px] md:rounded-[8px] text-[10px] md:text-[12px] font-black text-[#1F2937] shadow-neo-sm">
          {marks} Marks
        </div>
        <div className="flex items-center gap-1 md:gap-1.5 bg-white border-[2px] border-[#1F2937] px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-[6px] md:rounded-[8px] text-[10px] md:text-[12px] font-black text-[#1F2937] shadow-neo-sm">
          <Clock className="size-3 md:size-3" strokeWidth={3} /> {test.durationMinutes} m
        </div>
      </div>

      <Link
        href={`/tests/${test.id}`}
        className={cn(
          "mt-3 md:mt-6 inline-flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-4 py-1.5 md:py-2.5 rounded-[8px] md:rounded-[12px] font-heading font-black text-[11px] md:text-[14px] transition-all w-full border-[2px] md:border-[3px] border-[#1F2937] shadow-neo-sm hover:-translate-y-0.5 active:translate-y-1 active:translate-x-1 active:shadow-none uppercase",
          history.length > 0 
            ? "bg-[#FF9600] text-white"
            : "bg-[#58CC02] text-white"
        )}
      >
        {history.length > 0 ? (
          <><CheckCircle2 className="size-3 md:size-5" strokeWidth={3} /> Retake</>
        ) : (
          <>Start <ArrowRight className="size-3 md:size-5" strokeWidth={3} /></>
        )}
      </Link>
    </Card>
  )
}

export function TestHub() {
  const searchParams = useSearchParams()

  // Read URL params so external links (e.g. the DRILL button on the dashboard)
  // can deep-link directly into a subject's drill listing.
  const urlFilter = (searchParams.get("filter") ?? "all") as Filter
  const urlSubject = searchParams.get("subject")

  const [filter, setFilter] = useState<Filter>(urlFilter)
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(urlSubject)
  const [searchQuery, setSearchQuery] = useState("")
  
  const TESTS = useTests()
  const router = useRouter()
  const { questionMap } = useQuestionBank()
  const { attempts } = useAttempts()
  const { data: mistakes } = useCollection(COLLECTIONS.mistakes)
  const { settings } = useSettings()
  const activeExamId = getActiveExamId(settings.profile)
  const SUBJECTS = useMemo(() => getSubjectsForExam(activeExamId), [activeExamId])

  // Custom Test Builder state
  const [showCustomBuilder, setShowCustomBuilder] = useState(false)
  const [customSubjects, setCustomSubjects] = useState<string[]>([])
  const [customTypes, setCustomTypes] = useState<("MCQ" | "MSQ" | "NAT")[]>(["MCQ", "MSQ", "NAT"])
  const [customSource, setCustomSource] = useState<"all" | "pyq" | "untouched" | "mistakes">("all")
  const [customCount, setCustomCount] = useState<number>(15)
  const [customTimerMode, setCustomTimerMode] = useState<"practice" | "timed">("practice")
  const [customDuration, setCustomDuration] = useState<number>(30)

  // Initialize all subjects selected by default
  const allSubjectNames = useMemo(() => SUBJECTS.map((s) => s.name), [SUBJECTS])
  const effectiveCustomSubjects = customSubjects.length === 0 ? allSubjectNames : customSubjects

  const toggleSubject = (name: string) => {
    if (customSubjects.length === 0) {
      // First deselect
      setCustomSubjects(allSubjectNames.filter((s) => s !== name))
    } else if (customSubjects.includes(name)) {
      setCustomSubjects(customSubjects.filter((s) => s !== name))
    } else {
      setCustomSubjects([...customSubjects, name])
    }
  }

  const toggleType = (t: "MCQ" | "MSQ" | "NAT") => {
    if (customTypes.includes(t)) {
      if (customTypes.length > 1) setCustomTypes(customTypes.filter((x) => x !== t))
    } else {
      setCustomTypes([...customTypes, t])
    }
  }

  // Set of attempted question IDs
  const attemptedQids = useMemo(() => {
    const set = new Set<string>()
    for (const a of attempts) {
      if (a.questionIds) {
        for (const qid of a.questionIds) set.add(qid)
      }
    }
    return set
  }, [attempts])

  // Set of mistake question IDs
  const mistakeQids = useMemo(() => {
    return new Set(mistakes.map((m) => m.questionId))
  }, [mistakes])

  // Matching questions for custom builder
  const matchingCustomQuestions = useMemo(() => {
    const allQuestions = Array.from(questionMap.values())
    return allQuestions.filter((q) => {
      // 1. Subject match
      if (effectiveCustomSubjects.length > 0) {
        const matchesSub = effectiveCustomSubjects.some((sName) => {
          if (!q.subject) return false
          const normQ = q.subject.toLowerCase().replace(/[^a-z0-9]/g, "")
          const normS = sName.toLowerCase().replace(/[^a-z0-9]/g, "")
          return normQ.includes(normS) || normS.includes(normQ)
        })
        if (!matchesSub) return false
      }

      // 2. Type match
      if (!customTypes.includes(q.type)) return false

      // 3. Source match
      if (customSource === "pyq") {
        const isPyq = Boolean(q.year || q.source?.toLowerCase().includes("gate") || q.provenance?.toLowerCase().includes("gate") || q.id.includes("pyq"))
        if (!isPyq) return false
      } else if (customSource === "untouched") {
        if (attemptedQids.has(q.id)) return false
      } else if (customSource === "mistakes") {
        if (!mistakeQids.has(q.id)) return false
      }

      return true
    })
  }, [questionMap, effectiveCustomSubjects, customTypes, customSource, attemptedQids, mistakeQids])

  const handleLaunchCustomTest = () => {
    if (matchingCustomQuestions.length === 0) return
    const shuffled = [...matchingCustomQuestions].sort(() => Math.random() - 0.5)
    const selectedQids = shuffled.slice(0, customCount).map((q) => q.id)

    const customTestId = `custom-${Date.now()}`
    try {
      localStorage.setItem(`remedial_qids_${customTestId}`, JSON.stringify(selectedQids))
    } catch {}

    setShowCustomBuilder(false)
    router.push(`/tests/${customTestId}?mode=${customTimerMode}`)
  }

  const counts = useMemo(() => {
    const mockCount = TESTS.filter(t => t.kind === "mock").length
    const subjectCount = TESTS.filter(t => t.kind === "subject").length
    return {
      all: TESTS.length,
      subject: subjectCount,
      mock: mockCount,
    }
  }, [TESTS])
  
  // Reset subject selection when changing top-level filter
  const handleFilterChange = (newFilter: Filter) => {
    setFilter(newFilter)
    setSelectedSubjectId(null)
  }

  // Filter tests based on mode, selected subject, and search query
  const tests = useMemo(() => {
    let filtered = TESTS
    if (filter !== "all") {
      filtered = filtered.filter((t) => t.kind === filter)
    }

    if (selectedSubjectId) {
      const subject = SUBJECTS.find(s => s.id === selectedSubjectId)
      filtered = filtered.filter(t => t.subject === subject?.name || t.subject === selectedSubjectId)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.subject?.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      )
    }
    return filtered
  }, [TESTS, filter, selectedSubjectId, SUBJECTS, searchQuery])

  const showSubjectSelection = filter === "subject" && !selectedSubjectId && !searchQuery.trim()

  return (
    <div className="relative z-10 pt-2 md:pt-10 pb-28 md:pb-56 px-3 sm:px-4 md:px-6 max-w-5xl mx-auto space-y-4 md:space-y-8 animate-in fade-in duration-500">
      
      {/* Header section */}
      <div className="bg-[#FFF8EE] border-[3px] border-[#1F2937] rounded-2xl sm:rounded-3xl p-4 md:p-8 shadow-neo relative overflow-hidden mb-4 sm:mb-8">
        <div className="absolute -top-10 -right-10 size-40 bg-[#FFB020] opacity-20 rounded-full blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 relative z-10">
          <div className="min-w-0 flex-1 space-y-1 md:space-y-3">
            <div className="hidden md:inline-flex items-center gap-2 bg-white border-2 border-[#1F2937] px-3 py-1 rounded-xl shadow-neo-xs">
              <CheckCircle2 className="size-4 text-[#FF9600]" strokeWidth={2.5} />
              <p className="font-mono text-[10px] sm:text-xs font-black tracking-widest text-foreground uppercase">
                Mock Tests &amp; Drills
              </p>
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-heading font-black text-foreground uppercase tracking-tighter break-words">
              Test Centre
            </h1>
            <p className="block text-[10px] md:text-sm lg:text-base text-foreground/80 max-w-2xl font-bold leading-snug md:leading-normal">
              Practise under authentic exam rules with negative marking. Every attempt is timed, scored, and broken down by subject.
            </p>
          </div>

          {/* Custom Test Builder Trigger Button */}
          <div className="shrink-0 mt-2 md:mt-0">
            <button
              type="button"
              onClick={() => setShowCustomBuilder(true)}
              className="neo-btn bg-[#58CC02] text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-heading font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-neo hover:-translate-y-1 transition-all"
            >
              <Wrench className="size-4 fill-white" />
              Build Custom Drill
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
        {/* 3-Pill Tab Layout (Responsive grid) */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-white border-[3px] border-[#1F2937] rounded-[16px] shadow-neo-sm w-full sm:w-auto">
          {(
            [
              ["all", `All (${counts.all})`],
              ["subject", `Drills (${counts.subject})`],
              ["mock", `Mocks (${counts.mock})`],
            ] as [Filter, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => handleFilterChange(value)}
              aria-pressed={filter === value}
              className={cn(
                "px-2 sm:px-4 md:px-5 py-2 rounded-[12px] font-heading font-black text-[11px] sm:text-[13px] md:text-[14px] tracking-wide transition-all outline-none border-[2px] uppercase text-center truncate",
                filter === value
                  ? "bg-[#1CB0F6] text-white border-[#1F2937] shadow-neo-xs"
                  : "bg-transparent text-secondary-text hover:text-[#1F2937] hover:bg-gray-100 border-transparent",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search Input Box */}
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drills, mocks, topics..."
            className="w-full bg-white border-[3px] border-[#1F2937] rounded-[16px] pl-10 pr-10 py-2 sm:py-2.5 font-bold text-xs sm:text-sm text-[#1F2937] placeholder:text-muted-foreground shadow-neo-sm outline-none focus:border-[#1CB0F6] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#1F2937] p-1"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* CUSTOM TEST BUILDER MODAL */}
      {showCustomBuilder && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center pt-[70px] pb-[80px] px-3 md:p-6 overflow-hidden animate-in fade-in duration-200">
          <div className="neo-card bg-white border-[3px] border-[#1F2937] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-3xl w-full shadow-neo max-h-full overflow-y-auto space-y-5 sm:space-y-6 flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b-2 border-[#1F2937]/15 pb-4">
              <div>
                <span className="font-mono text-xs font-black text-[#58CC02] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="size-4" /> Custom Test Generator
                </span>
                <h2 className="text-2xl font-heading font-black text-foreground uppercase tracking-tight mt-1">
                  Build Custom Drill or Mock
                </h2>
                <p className="text-xs font-bold text-secondary-text mt-0.5">
                  Curate your own targeted practice test from 1,260 authenticated questions.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCustomBuilder(false)}
                className="size-10 rounded-xl border-2 border-[#1F2937] bg-muted/40 hover:bg-muted text-foreground flex items-center justify-center font-black transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Step 1: Subjects */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="font-heading font-black text-sm uppercase text-foreground">
                  1. Target Subjects ({effectiveCustomSubjects.length}/{allSubjectNames.length})
                </label>
                <div className="flex gap-2 font-mono text-[11px]">
                  <button
                    type="button"
                    onClick={() => setCustomSubjects(allSubjectNames)}
                    className="text-[#1CB0F6] font-bold hover:underline"
                  >
                    Select All
                  </button>
                  <span>&middot;</span>
                  <button
                    type="button"
                    onClick={() => setCustomSubjects([allSubjectNames[0]])}
                    className="text-secondary-text font-bold hover:underline"
                  >
                    Clear Others
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                {allSubjectNames.map((sName) => {
                  const isSelected = effectiveCustomSubjects.includes(sName)
                  return (
                    <button
                      key={sName}
                      type="button"
                      onClick={() => toggleSubject(sName)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 sm:px-3 sm:py-2 rounded-full border-2 text-left font-bold text-[10px] sm:text-xs transition-all",
                        isSelected
                          ? "border-[#1F2937] bg-[#E5F6FF] text-[#1CB0F6] shadow-neo-xs font-black"
                          : "border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground hover:border-[#1F2937]/30"
                      )}
                    >
                      {isSelected && <Check className="size-3 sm:size-3.5 shrink-0" strokeWidth={3} />}
                      <span className="leading-tight">{sName}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step 2 & 3: Question Types & Question Source */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t-2 border-[#1F2937]/10">
              {/* Question Types */}
              <div className="space-y-2">
                <label className="font-heading font-black text-sm uppercase text-foreground">
                  2. Question Types
                </label>
                <div className="flex gap-2">
                  {(["MCQ", "MSQ", "NAT"] as const).map((t) => {
                    const isSelected = customTypes.includes(t)
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleType(t)}
                        className={cn(
                          "flex-1 py-2 rounded-xl border-2 font-mono text-xs font-black uppercase tracking-wider transition-all",
                          isSelected
                            ? "border-[#1F2937] bg-[#DDF4FF] text-[#1899D6] shadow-neo-xs"
                            : "border-border/60 bg-muted/20 text-muted-foreground"
                        )}
                      >
                        {t}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Question Source */}
              <div className="space-y-2">
                <label className="font-heading font-black text-sm uppercase text-foreground">
                  3. Question Source
                </label>
                <select
                  value={customSource}
                  onChange={(e) => setCustomSource(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border-2 border-[#1F2937] bg-white font-bold text-xs text-foreground shadow-neo-xs outline-none focus:border-[#1CB0F6]"
                >
                  <option value="all">All Bank Questions (1,260 Qs)</option>
                  <option value="pyq">⭐ Official GATE PYQs Only</option>
                  <option value="untouched">Untouched Questions (Never Attempted)</option>
                  <option value="mistakes">Mistake Notebook Questions ({mistakeQids.size} Qs)</option>
                </select>
              </div>
            </div>

            {/* Step 4 & 5: Question Count & Timer Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t-2 border-[#1F2937]/10">
              {/* Question Count */}
              <div className="space-y-2">
                <label className="font-heading font-black text-sm uppercase text-foreground">
                  4. Question Count
                </label>
                <div className="flex flex-wrap gap-2">
                  {[5, 10, 15, 20, 30, 45, 65].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setCustomCount(cnt)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl border-2 font-mono text-xs font-black transition-all",
                        customCount === cnt
                          ? "border-[#1F2937] bg-[#FFC800] text-[#1F2937] shadow-neo-xs"
                          : "border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {cnt} Qs
                    </button>
                  ))}
                </div>
              </div>

              {/* Timer Mode */}
              <div className="space-y-2">
                <label className="font-heading font-black text-sm uppercase text-foreground">
                  5. Timing Mode
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomTimerMode("practice")}
                    className={cn(
                      "flex-1 py-2 rounded-xl border-2 font-heading text-xs font-black uppercase tracking-wider transition-all",
                      customTimerMode === "practice"
                        ? "border-[#1F2937] bg-[#58CC02] text-white shadow-neo-xs"
                        : "border-border/60 bg-muted/20 text-muted-foreground"
                    )}
                  >
                    Stopwatch Drill
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomTimerMode("timed")}
                    className={cn(
                      "flex-1 py-2 rounded-xl border-2 font-heading text-xs font-black uppercase tracking-wider transition-all",
                      customTimerMode === "timed"
                        ? "border-[#1F2937] bg-[#FF4B4B] text-white shadow-neo-xs"
                        : "border-border/60 bg-muted/20 text-muted-foreground"
                    )}
                  >
                    Timed Mock
                  </button>
                </div>
              </div>
            </div>

            {/* Matching Preview & Launch Bar */}
            <div className="pt-4 border-t-2 border-[#1F2937]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="font-mono text-xs font-bold text-secondary-text">
                Pool Available:{" "}
                <span className="font-black text-[#1CB0F6] text-sm">
                  {matchingCustomQuestions.length} Questions
                </span>
                {matchingCustomQuestions.length < customCount && (
                  <span className="text-[#FF4B4B] ml-2 font-black">
                    (Test will serve all {matchingCustomQuestions.length} available)
                  </span>
                )}
              </div>

              <button
                type="button"
                disabled={matchingCustomQuestions.length === 0}
                onClick={handleLaunchCustomTest}
                className="neo-btn bg-[#1CB0F6] text-white px-6 py-3 rounded-2xl font-heading font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-neo-sm hover:-translate-y-0.5 disabled:opacity-40 w-full sm:w-auto justify-center"
              >
                <Zap className="size-4 fill-white" />
                Launch Custom Test ({Math.min(customCount, matchingCustomQuestions.length)} Qs)
              </button>
            </div>
          </div>
        </div>
      )}

      {showSubjectSelection ? (
        <div className="pt-4">
          <h2 className="text-[20px] font-heading font-black text-[#1F2937] mb-6 uppercase">Select a Subject for Subject Drills</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {SUBJECTS.map(sub => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className="text-left w-full"
              >
                <Card className="p-5 h-full hover:shadow-md transition-shadow group border-[3px] border-[#1F2937] hover:-translate-y-1 hover:translate-x-1 hover:shadow-none shadow-neo-sm transition-all bg-white rounded-[16px]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-heading font-black text-[18px] text-[#1F2937] group-hover:text-[#6C8EF2] transition-colors line-clamp-2">
                        {sub.name}
                      </h3>
                      <p className="text-[12px] font-bold text-secondary-text mt-2 uppercase tracking-wide">
                        {sub.weightage} Marks Weightage
                      </p>
                    </div>
                    <div className="size-10 rounded-full border-[3px] border-[#1F2937] bg-[#E5F9D6] flex items-center justify-center shrink-0 group-hover:bg-[#58CC02] transition-colors">
                      <FileText className="size-5 text-[#1F2937]" strokeWidth={3} />
                    </div>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="pt-4 space-y-6">
          {selectedSubjectId && (
            <div className="flex items-center gap-4">
               <button
                  onClick={() => setSelectedSubjectId(null)}
                  className="mb-6 inline-flex items-center gap-2 text-[14px] font-bold text-secondary-text hover:text-primary-text transition-colors"
                >
                  <ArrowRight className="size-4 rotate-180" /> Back to Subjects
              </button>
              <h2 className="text-[20px] font-heading font-black text-[#1F2937] mb-6 uppercase flex-1">
                {SUBJECTS.find(s => s.id === selectedSubjectId)?.name} Drills
              </h2>
            </div>
          )}

          {searchQuery.trim() && (
            <p className="text-sm font-bold text-secondary-text">
              Found {tests.length} test{tests.length === 1 ? "" : "s"} matching &ldquo;{searchQuery}&rdquo;
            </p>
          )}
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {tests.length > 0 ? (
              tests.map((t) => (
                <TestCard key={t.id} test={t} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-secondary-text bg-white border-[3px] border-[#1F2937] rounded-[24px] shadow-neo-sm">
                <FileText className="size-12 mx-auto mb-4 opacity-30" />
                <p className="font-heading font-bold text-[18px]">No tests matching your criteria.</p>
                <p className="text-[14px] mt-1">Try a different search term or category filter.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

