"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight, Clock, FileText, Layers, CheckCircle2 } from "lucide-react"
import type { TestDefinition } from "@/lib/test-types"
import { useAttempts } from "@/lib/use-attempts"
import { useQuestionBank, useTests, useSettings } from "@/lib/storage/hooks"
import type { Question } from "@/lib/domain/types"
import { getSubjectsForExam, getActiveExamId } from "@/lib/exams/registry"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Terminal, Code, Cpu, Database, Network } from "lucide-react"

type Filter = "all" | "mock" | "subject" | "drill"

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
  const cardBorderAccent = isMock ? "pink" : "blue"

  return (
    <Card accentBorder={cardBorderAccent} className="flex flex-col p-5 group h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] font-heading text-[12px] tracking-wide uppercase font-black border-[2px] border-[#1F2937] shadow-neo-sm",
              isMock
                ? "bg-[#CE82FF] text-white"
                : "bg-[#1CB0F6] text-white",
            )}
          >
            {isMock ? <Layers className="size-4" strokeWidth={3} /> : <FileText className="size-4" strokeWidth={3} />}
            {test.kind}
          </span>
          <h3 className="mt-3 text-[18px] font-heading font-bold text-primary-text leading-tight">{test.title}</h3>
        </div>
        {ready && best !== null && (
          <div className="shrink-0 text-right bg-[#FFC800] px-3 py-1.5 rounded-[12px] border-[3px] border-[#1F2937] shadow-neo-sm">
            <p className="font-heading font-black text-[20px] text-[#1F2937] leading-none">{best.toFixed(1)}</p>
            <p className="font-heading text-[10px] text-[#1F2937] uppercase tracking-wider font-black mt-1">Best Score</p>
          </div>
        )}
      </div>

      <p className="mt-3 text-[14px] leading-relaxed text-secondary-text flex-1">{test.description}</p>

      {/* Metadata Tags */}
      <div className="mt-5 flex flex-wrap gap-2">
        <div className="bg-white border-[2px] border-[#1F2937] px-2.5 py-1 rounded-[8px] text-[12px] font-black text-[#1F2937] shadow-neo-sm">
          {questions.length} Questions
        </div>
        <div className="bg-white border-[2px] border-[#1F2937] px-2.5 py-1 rounded-[8px] text-[12px] font-black text-[#1F2937] shadow-neo-sm">
          {marks} Marks
        </div>
        <div className="flex items-center gap-1.5 bg-white border-[2px] border-[#1F2937] px-2.5 py-1 rounded-[8px] text-[12px] font-black text-[#1F2937] shadow-neo-sm">
          <Clock className="size-3" strokeWidth={3} /> {test.durationMinutes} min
        </div>
      </div>

      <Link
        href={`/tests/${test.id}`}
        className={cn(
          "mt-6 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[12px] font-heading font-black text-[14px] transition-all w-full border-[3px] border-[#1F2937] shadow-neo-sm hover:-translate-y-0.5 active:translate-y-1 active:translate-x-1 active:shadow-none uppercase",
          history.length > 0 
            ? "bg-[#FF9600] text-white"
            : "bg-[#58CC02] text-white"
        )}
      >
        {history.length > 0 ? (
          <><CheckCircle2 className="size-5" strokeWidth={3} /> Retake Test</>
        ) : (
          <>Start Test <ArrowRight className="size-5" strokeWidth={3} /></>
        )}
      </Link>
    </Card>
  )
}

export function TestHub() {
  const [filter, setFilter] = useState<Filter>("all")
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null)
  
  const TESTS = useTests()
  const { settings } = useSettings()
  const activeExamId = getActiveExamId(settings.profile)
  const SUBJECTS = useMemo(() => getSubjectsForExam(activeExamId), [activeExamId])
  
  // Reset subject selection when changing top-level filter
  const handleFilterChange = (newFilter: Filter) => {
    setFilter(newFilter)
    setSelectedSubjectId(null)
  }

  // Filter tests based on mode and selected subject
  const tests = useMemo(() => {
    let filtered = TESTS
    if (filter !== "all") {
      filtered = filtered.filter((t) => t.kind === filter)
    }
    if (selectedSubjectId) {
      const subject = SUBJECTS.find(s => s.id === selectedSubjectId)
      filtered = filtered.filter(t => t.subject === subject?.name || t.subject === selectedSubjectId)
    }
    return filtered
  }, [TESTS, filter, selectedSubjectId, SUBJECTS])

  const showSubjectSelection = (filter === "subject" || filter === "drill") && !selectedSubjectId

  return (
    <main className="min-h-dvh relative overflow-x-hidden bg-[#FAFBFF]">
      
      {/* Playful Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-5">
        <Terminal className="absolute top-20 left-10 size-32 text-[#6C8EF2] -rotate-12 animate-pulse" strokeWidth={2} />
        <Code className="absolute bottom-40 right-20 size-40 text-[#FFB020] rotate-12 animate-bounce" strokeWidth={2} />
        <Cpu className="absolute top-40 right-1/4 size-24 text-[#1CB0F6] rotate-45 animate-pulse" strokeWidth={2} />
        <Database className="absolute bottom-10 left-1/4 size-28 text-[#FF4B4B] -rotate-6 animate-bounce" style={{ animationDelay: '1s' }} strokeWidth={2} />
        <Network className="absolute top-1/2 -left-10 size-48 text-[#58CC02] animate-[spin_15s_linear_infinite]" strokeWidth={2} />
      </div>

      <div className="relative z-10 pt-12 pb-24 px-4 md:px-6 max-w-6xl mx-auto space-y-6">
      
      <header className="mb-8">
        <h1 className="text-[32px] font-heading font-black text-primary-text uppercase tracking-tight">
          Test Centre
        </h1>
        <p className="text-[16px] text-secondary-text mt-1 max-w-2xl font-bold">
          Practise under authentic exam rules with negative marking. Every attempt is timed, scored, and broken down by subject.
        </p>
      </header>

      {/* 3-Pill Tab Layout */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border-[3px] border-[#1F2937] rounded-[16px] inline-flex shadow-neo-sm">
        {(
          [
            ["all", "All Tests"],
            ["mock", "Full Mocks"],
            ["subject", "Subject Drills"],
            ["drill", "Chapter Drills"],
          ] as [Filter, string][]
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => handleFilterChange(value)}
            aria-pressed={filter === value}
            className={cn(
              "px-5 py-2 min-h-11 rounded-[12px] font-heading font-black text-[14px] tracking-wide transition-all outline-none border-[2px] border-transparent uppercase",
              filter === value
                ? "bg-[#1CB0F6] text-white border-[#1F2937] shadow-neo-sm"
                : "bg-transparent text-secondary-text hover:text-[#1F2937] hover:bg-gray-100 border-transparent",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {showSubjectSelection ? (
        <div className="pt-4">
          <h2 className="text-[20px] font-heading font-black text-[#1F2937] mb-6 uppercase">Select a Subject for {filter === "drill" ? "Chapter Drills" : "Subject Drills"}</h2>
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
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tests.length > 0 ? (
              tests.map((t) => (
                <TestCard key={t.id} test={t} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-secondary-text bg-white border-[3px] border-[#1F2937] rounded-[24px] shadow-neo-sm">
                <FileText className="size-12 mx-auto mb-4 opacity-30" />
                <p className="font-heading font-bold text-[18px]">No tests available.</p>
                <p className="text-[14px] mt-1">Check back later for new content.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
    </main>
  )
}
