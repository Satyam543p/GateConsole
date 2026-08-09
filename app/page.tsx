"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Flame, Check, Play, BookOpen, Map, Target, Terminal, Code, Cpu, Database, Network } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSettings, useQuestionBank, useAttempts, useCollection } from "@/lib/storage/hooks"
import { COLLECTIONS } from "@/lib/storage/store"
import { StoredExamResult } from "@/lib/domain/types"

const SUBJECTS = [
  { id: "general-aptitude", name: "General Aptitude", weightage: 15 },
  { id: "programming-data-structures", name: "Programming & Data Structures", weightage: 11 },
  { id: "discrete-mathematics", name: "Discrete Mathematics", weightage: 9 },
  { id: "engineering-mathematics", name: "Engineering Mathematics", weightage: 9 },
  { id: "operating-systems", name: "Operating Systems", weightage: 8.5 },
  { id: "computer-networks", name: "Computer Networks", weightage: 8.5 },
  { id: "computer-organization", name: "Computer Organization", weightage: 8 },
  { id: "algorithms", name: "Algorithms", weightage: 7.5 },
  { id: "databases", name: "Databases", weightage: 7 },
  { id: "theory-of-computation", name: "Theory of Computation", weightage: 7 },
  { id: "digital-logic", name: "Digital Logic", weightage: 6.5 },
  { id: "compiler-design", name: "Compiler Design", weightage: 4.5 },
]

export default function HomePage() {
  const { settings, updateSettings } = useSettings()
  const { questions } = useQuestionBank()
  const { attempts } = useAttempts()
  const { data: examResults } = useCollection(COLLECTIONS.examResults)

  const subjectProgress = settings.subjectProgress || {}

  const toggleCompleted = (id: string) => {
    updateSettings({
      subjectProgress: {
        ...subjectProgress,
        [id]: {
          ...subjectProgress[id],
          completed: !subjectProgress[id]?.completed,
        },
      },
    })
  }

  const toggleRevised = (id: string) => {
    updateSettings({
      subjectProgress: {
        ...subjectProgress,
        [id]: {
          ...subjectProgress[id],
          revised: !subjectProgress[id]?.revised,
        },
      },
    })
  }

  // Calculate Weighted Completion Score
  const { totalWeight, completedWeight } = useMemo(() => {
    let tW = 0
    let cW = 0
    SUBJECTS.forEach((sub) => {
      tW += sub.weightage
      if (subjectProgress[sub.id]?.completed) {
        cW += sub.weightage
      }
    })
    return { totalWeight: tW, completedWeight: cW }
  }, [subjectProgress])

  const completionPercentage = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0

  // Calculate Revision Debt (Completed but not revised)
  const revisionDebt = useMemo(() => {
    return SUBJECTS.filter(s => subjectProgress[s.id]?.completed && !subjectProgress[s.id]?.revised)
      .sort((a, b) => b.weightage - a.weightage)
  }, [subjectProgress])

  // Daily Challenge Logic: Pick a random question from high weightage, non-completed subjects first
  const dailyChallenge = useMemo(() => {
    if (questions.length === 0) return null
    // Bias: subjects not completed but high weightage
    const incompleteSubjects = SUBJECTS.filter(s => !subjectProgress[s.id]?.completed)
    const targetSubjectId = incompleteSubjects.length > 0 
      ? incompleteSubjects[0].id 
      : SUBJECTS[0].id

    const validQuestions = questions.filter(q => q.subject === targetSubjectId)
    if (validQuestions.length === 0) return questions[0]
    return validQuestions[Math.floor(Math.random() * validQuestions.length)]
  }, [questions, subjectProgress])

  return (
    <main className="min-h-screen relative overflow-x-hidden bg-[#FAFBFF]">
      
      {/* Playful Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-5">
        <Terminal className="absolute top-20 left-10 size-32 text-[#6C8EF2] -rotate-12 animate-pulse" strokeWidth={2} />
        <Code className="absolute bottom-40 right-20 size-40 text-[#FFB020] rotate-12 animate-bounce" strokeWidth={2} />
        <Cpu className="absolute top-40 right-1/4 size-24 text-[#1CB0F6] rotate-45 animate-pulse" strokeWidth={2} />
        <Database className="absolute bottom-10 left-1/4 size-28 text-[#FF4B4B] -rotate-6 animate-bounce" style={{ animationDelay: '1s' }} strokeWidth={2} />
        <Network className="absolute top-1/2 -left-10 size-48 text-[#58CC02] animate-[spin_15s_linear_infinite]" strokeWidth={2} />
      </div>

      <div className="relative z-10 pt-12 pb-24 px-6 max-w-5xl mx-auto space-y-8">
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-[32px] font-heading font-black text-primary-text uppercase tracking-tight">
            Good evening, Satyam
          </h1>
          <p className="text-[16px] text-secondary-text mt-1 font-bold">
            Track your progress and drill your weak areas.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[#FFC800] p-3 rounded-2xl neo-card transition-transform hover:rotate-2">
          <div className="size-12 rounded-xl bg-white border-[3px] border-[#1F2937] flex items-center justify-center shadow-neo-sm">
            <Target className="size-6 text-[#1F2937]" />
          </div>
          <div className="pr-2">
            <p className="text-[12px] font-black text-[#1F2937] uppercase tracking-wider">Readiness Score</p>
            <p className="text-[24px] font-heading font-black text-[#1F2937] leading-none mt-1">{completionPercentage}%</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Daily Challenge Card */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-[20px] font-heading font-black text-primary-text uppercase">
            Daily Challenge
          </h2>
          <Card className="p-6 bg-[#1CB0F6] text-white border-[3px] border-[#1F2937] shadow-neo transition-transform hover:-rotate-1">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="size-6 text-[#FF9600] drop-shadow-md" fill="#FF9600" />
                  <span className="text-[15px] font-black tracking-wide uppercase drop-shadow-sm">
                    Challenge of the Day
                  </span>
                </div>
                {dailyChallenge ? (
                  <>
                    <h3 className="text-[20px] font-bold mb-2 line-clamp-3 leading-tight drop-shadow-sm">
                      {dailyChallenge.text.substring(0, 150)}...
                    </h3>
                    <p className="text-[14px] font-bold opacity-90 mb-6 drop-shadow-sm">
                      Subject: {SUBJECTS.find(s => s.id === dailyChallenge.subject)?.name || dailyChallenge.subject}
                    </p>
                  </>
                ) : (
                  <p className="font-bold opacity-90">Loading challenge...</p>
                )}
              </div>
              
              <Link href="/tests" className={cn(buttonVariants({ variant: "outline" }), "w-fit gap-2 border-[3px] border-[#1F2937] bg-white text-[#1F2937] shadow-neo-sm hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none hover:bg-white")}>
                Attempt Challenge <ArrowRight className="size-5" />
              </Link>
            </div>
          </Card>
        </div>

        {/* Mini Analytics Dashboards */}
        <div className="space-y-4">
          <h2 className="text-[20px] font-heading font-black text-primary-text uppercase">
            Revision Debt
          </h2>
          <Card className="p-4 h-[216px] overflow-y-auto neo-card bg-[#CE82FF] transition-transform hover:rotate-1">
            {revisionDebt.length > 0 ? (
              <ul className="space-y-3">
                {revisionDebt.map(sub => (
                  <li key={sub.id} className="flex items-center justify-between bg-white border-[3px] border-[#1F2937] rounded-xl p-2 shadow-neo-sm">
                    <span className="text-[14px] font-bold text-primary-text line-clamp-1 flex-1 pr-2">
                      {sub.name}
                    </span>
                    <span className="text-[11px] font-black text-white bg-[#FF4B4B] px-2 py-1 rounded-lg shrink-0 border-[2px] border-[#1F2937]">
                      URGENT
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center bg-white border-[3px] border-[#1F2937] rounded-xl p-4 shadow-neo-sm">
                <Check className="size-10 text-[#58CC02] mb-2" strokeWidth={3} />
                <p className="text-[16px] font-black text-primary-text uppercase">No Revision Debt!</p>
                <p className="text-[14px] font-bold text-secondary-text mt-1">You are fully caught up.</p>
              </div>
            )}
          </Card>
        </div>

      </div>

      {/* Subject Table */}
      <section className="pt-4">
        <h2 className="text-[24px] font-heading font-black text-primary-text mb-4 uppercase">
          Subject Tracking
        </h2>
        <Card className="overflow-hidden neo-card bg-white p-0">
          <div className="overflow-x-auto custom-scrollbar pb-2">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#DDF4FF] border-b-[3px] border-[#1F2937]">
                  <th className="py-4 px-6 font-heading font-black text-[#1F2937] text-[13px] md:text-[16px] uppercase tracking-wider w-5/12">
                    Subject
                  </th>
                  <th className="py-4 px-4 font-heading font-black text-[#1F2937] text-[13px] md:text-[16px] uppercase tracking-wider text-center border-l-[3px] border-[#1F2937]">
                    Status
                  </th>
                  <th className="py-4 px-4 font-heading font-black text-[#1F2937] text-[13px] md:text-[16px] uppercase tracking-wider text-center border-l-[3px] border-[#1F2937]">
                    Revision
                  </th>
                  <th className="py-4 px-4 font-heading font-black text-[#1F2937] text-[13px] md:text-[16px] uppercase tracking-wider text-center border-l-[3px] border-[#1F2937]">
                    Practice
                  </th>
                  <th className="py-4 px-4 font-heading font-black text-[#1F2937] text-[13px] md:text-[16px] uppercase tracking-wider text-center border-l-[3px] border-[#1F2937]">
                    Mindmap
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-[3px] divide-[#1F2937]">
                {SUBJECTS.map((sub, idx) => {
                  const isCompleted = subjectProgress[sub.id]?.completed
                  const isRevised = subjectProgress[sub.id]?.revised
                  
                  return (
                    <tr 
                      key={sub.id} 
                      className={cn(
                        "transition-colors hover:bg-muted/50 group",
                        isCompleted && isRevised && "bg-[#58CC02]/10"
                      )}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "size-8 md:size-10 rounded-[12px] border-[3px] border-[#1F2937] flex items-center justify-center font-heading font-black text-[14px] md:text-[16px] shrink-0 transition-all shadow-neo-sm",
                            isCompleted 
                              ? "bg-[#58CC02] text-white" 
                              : "bg-white text-[#1F2937]"
                          )}>
                            {idx + 1}
                          </div>
                          <div>
                            <p className={cn(
                              "font-black text-[14px] md:text-[16px] transition-colors leading-tight mb-1",
                              isCompleted ? "text-[#1F2937]" : "text-primary-text"
                            )}>
                              {sub.name}
                            </p>
                            <p className="text-[11px] md:text-[13px] font-bold text-secondary-text uppercase tracking-wider">
                              Weight: {sub.weightage} marks
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4 text-center border-l-[3px] border-[#1F2937]">
                        <button
                          onClick={() => toggleCompleted(sub.id)}
                          className={cn(
                            "relative size-10 rounded-[12px] border-[3px] border-[#1F2937] flex items-center justify-center transition-all mx-auto shadow-neo-sm hover:-translate-y-1 active:translate-y-1 active:translate-x-1 active:shadow-none overflow-hidden",
                            isCompleted 
                              ? "bg-[#58CC02] text-white"
                              : "bg-white text-transparent hover:bg-gray-50"
                          )}
                        >
                          <Check 
                            className={cn(
                              "absolute size-7 transition-all duration-300 ease-out", 
                              isCompleted ? "scale-100 opacity-100" : "scale-150 opacity-0"
                            )} 
                            strokeWidth={4} 
                          />
                        </button>
                      </td>

                      <td className="py-4 px-4 text-center border-l-[3px] border-[#1F2937]">
                        <button
                          onClick={() => toggleRevised(sub.id)}
                          className={cn(
                            "relative size-10 rounded-[12px] border-[3px] border-[#1F2937] flex items-center justify-center transition-all mx-auto shadow-neo-sm hover:-translate-y-1 active:translate-y-1 active:translate-x-1 active:shadow-none overflow-hidden",
                            isRevised 
                              ? "bg-[#CE82FF] text-white"
                              : "bg-white text-transparent hover:bg-gray-50"
                          )}
                        >
                          <Check 
                            className={cn(
                              "absolute size-7 transition-all duration-300 ease-out", 
                              isRevised ? "scale-100 opacity-100" : "scale-150 opacity-0"
                            )} 
                            strokeWidth={4} 
                          />
                        </button>
                      </td>

                      <td className="py-4 px-4 text-center border-l-[3px] border-[#1F2937]">
                        <Link 
                          href={`/tests/subj-${sub.id}?mode=practice`}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#FF9600] border-[3px] border-[#1F2937] text-white rounded-[12px] font-heading font-black text-[11px] md:text-[13px] hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 shadow-neo-sm active:shadow-none transition-all uppercase"
                        >
                          <Play className="size-3 fill-current" />
                          Drill
                        </Link>
                      </td>
                      
                      <td className="py-4 px-4 text-center border-l-[3px] border-[#1F2937]">
                        <Link 
                          href={`/map?subject=${sub.id}`}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border-[3px] border-[#1F2937] text-[#1F2937] rounded-[12px] font-heading font-black text-[11px] md:text-[13px] hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 shadow-neo-sm active:shadow-none transition-all uppercase"
                        >
                          <Map className="size-3" strokeWidth={3} />
                          Map
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

    </div>
    </main>
  )
}
