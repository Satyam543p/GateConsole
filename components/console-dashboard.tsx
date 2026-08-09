"use client"

import React, { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Flame, Check, Play, Map, Target } from "lucide-react"
import { Card } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSettings, useDailyChallenge } from "@/lib/storage/hooks"
import { getSubjectsForExam, getActiveExamId } from "@/lib/exams/registry"

export function ConsoleDashboard() {
  const { settings, updateSettings } = useSettings()

  const subjectProgress = useMemo(() => settings.subjectProgress || {}, [settings.subjectProgress])
  const activeExamId = getActiveExamId(settings.profile)
  const SUBJECTS = useMemo(() => getSubjectsForExam(activeExamId), [activeExamId])

  const userName = settings.profile?.name || "Guest"

  // Time-aware greeting (effect-synced so the statically-prerendered HTML never mismatches)
  const [greeting, setGreeting] = useState("Good evening")
  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening")
  }, [])

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
  }, [subjectProgress, SUBJECTS])

  const completionPercentage = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0

  // Calculate Revision Debt (Completed but not revised)
  const revisionDebt = useMemo(() => {
    return SUBJECTS.filter(s => subjectProgress[s.id]?.completed && !subjectProgress[s.id]?.revised)
      .sort((a, b) => b.weightage - a.weightage)
  }, [subjectProgress, SUBJECTS])

  // Daily Challenge — real streak + same-day question, sourced from the shared hook.
  const { streak, loading: dailyLoading } = useDailyChallenge()

  return (
    <div className="relative z-10 pt-12 pb-24 px-4 md:px-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-[32px] font-heading font-black text-primary-text uppercase tracking-tight">
            {greeting}, {userName}
          </h1>
          <p className="text-[16px] text-secondary-text mt-1 font-bold">
            Track your progress and drill your weak areas. {activeExamId !== "gate-cse" && <span className="text-[#FF9600]">[{activeExamId.toUpperCase()} Demo]</span>}
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
                <div className="flex items-end gap-2 mb-2">
                  <span className="font-heading text-[40px] font-black leading-none drop-shadow-sm">
                    {dailyLoading ? "…" : streak}
                  </span>
                  <span className="text-[13px] font-black uppercase opacity-90 mb-1">
                    day streak
                  </span>
                </div>
                <p className="text-[14px] font-bold opacity-90 mb-6 drop-shadow-sm">
                  {streak === 0
                    ? "Solve today's question to start a streak."
                    : "Answer today correctly to keep the streak alive."}
                </p>
              </div>

              <Link href="/daily" className={cn(buttonVariants({ variant: "outline" }), "w-fit gap-2 border-[3px] border-[#1F2937] bg-white text-[#1F2937] shadow-neo-sm hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none hover:bg-white")}>
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
          <div className="overflow-x-auto custom-scrollbar pb-0 md:pb-2">
            <table className="w-full text-left block md:table md:border-collapse min-w-0 bg-white md:bg-transparent">
              <thead className="hidden md:table-header-group">
                <tr className="bg-[#DDF4FF] border-b-[3px] border-[#1F2937]">
                  <th className="md:sticky md:left-0 md:z-20 bg-[#DDF4FF] border-r-[3px] border-[#1F2937] py-3 md:py-4 px-3 md:px-6 font-heading font-black text-[#1F2937] text-[11px] md:text-[16px] uppercase tracking-wider md:min-w-[200px] md:w-5/12 min-w-0">
                    <span className="hidden md:inline">Subject / Chapter</span>
                  </th>
                  <th className="py-3 md:py-4 px-1 md:px-4 font-heading font-black text-[#1F2937] text-[10px] md:text-[16px] uppercase tracking-wider text-center border-l-[3px] border-[#1F2937]">
                    <span className="hidden md:inline">Status</span>
                  </th>
                  <th className="py-3 md:py-4 px-1 md:px-4 font-heading font-black text-[#1F2937] text-[10px] md:text-[16px] uppercase tracking-wider text-center border-l-[3px] border-[#1F2937]">
                    <span className="hidden md:inline">Revision</span>
                  </th>
                  <th className="py-3 md:py-4 px-1 md:px-4 font-heading font-black text-[#1F2937] text-[10px] md:text-[16px] uppercase tracking-wider text-center border-l-[3px] border-[#1F2937]">
                    <span className="hidden md:inline">Practice</span>
                  </th>
                  <th className="py-3 md:py-4 px-1 md:px-4 font-heading font-black text-[#1F2937] text-[10px] md:text-[16px] uppercase tracking-wider text-center border-l-[3px] border-[#1F2937]">
                    <span className="hidden md:inline">Mindmap</span>
                  </th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group divide-y-[3px] divide-[#1F2937]">
                {SUBJECTS.map((sub, idx) => {
                  const hasChapters = sub.chapters && sub.chapters.length > 0
                  
                  // A subject with chapters is complete if all chapters are complete
                  const isCompleted = hasChapters 
                    ? sub.chapters!.every((ch: any) => subjectProgress[ch.id]?.completed)
                    : subjectProgress[sub.id]?.completed
                    
                  // A subject with chapters is revised if all chapters are revised
                  const isRevised = hasChapters
                    ? sub.chapters!.every((ch: any) => subjectProgress[ch.id]?.revised)
                    : subjectProgress[sub.id]?.revised
                  
                  const rowBg = isCompleted && isRevised ? "bg-[#E6F7E1]" : "bg-white"

                  return (
                    <React.Fragment key={sub.id}>
                      <tr 
                        className={cn(
                          "grid grid-cols-4 md:table-row transition-colors hover:bg-muted/50 group",
                          rowBg
                        )}
                      >
                        <td className={cn(
                          "col-span-4 block md:table-cell md:sticky md:left-0 md:z-10 border-b-[3px] md:border-b-0 border-[#1F2937] md:border-r-[3px] py-3 md:py-4 px-3 md:px-6 group-hover:bg-muted/50 transition-colors min-w-0",
                          rowBg
                        )}>
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className={cn(
                              "hidden md:flex size-8 md:size-10 rounded-[12px] border-[3px] border-[#1F2937] items-center justify-center font-heading font-black text-[14px] md:text-[16px] shrink-0 transition-all shadow-neo-sm",
                              isCompleted
                                ? "bg-[#58CC02] text-white"
                                : "bg-white text-[#1F2937]"
                            )}>
                              {idx + 1}
                            </div>
                            <div className="min-w-0">
                              <p className={cn(
                                "font-black text-[13px] md:text-[16px] transition-colors leading-tight mb-1 truncate min-w-0",
                                isCompleted ? "text-[#1F2937]" : "text-primary-text"
                              )} title={sub.name}>
                                {sub.name}
                              </p>
                              <p className="text-[10px] md:text-[13px] font-bold text-secondary-text uppercase tracking-wider">
                                Weight: {sub.weightage} marks
                              </p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="col-span-1 block md:table-cell align-middle py-3 md:py-4 px-1 md:px-4 border-r-[3px] border-[#1F2937] md:border-r-0 md:border-l-[3px] bg-white md:bg-transparent">
                          <div className="flex flex-col justify-center items-center h-full">
                            <span className="md:hidden text-[9px] font-black uppercase text-secondary-text mb-1.5">Status</span>
                            <button
                              onClick={() => !hasChapters && toggleCompleted(sub.id)}
                              disabled={hasChapters}
                              className={cn(
                                "relative size-9 md:size-10 rounded-[12px] border-[3px] border-[#1F2937] flex items-center justify-center transition-all mx-auto shadow-neo-sm overflow-hidden",
                                isCompleted 
                                  ? "bg-[#58CC02] text-white"
                                  : "bg-white text-transparent",
                                hasChapters 
                                  ? "opacity-70 cursor-default shadow-none" 
                                  : "hover:-translate-y-1 active:translate-y-1 active:translate-x-1 active:shadow-none hover:bg-gray-50"
                              )}
                              title={hasChapters ? "Complete all chapters to unlock" : "Toggle completion"}
                              aria-label={hasChapters ? "Complete all chapters to unlock" : "Toggle completion"}
                            >
                              <Check 
                                className={cn(
                                  "absolute size-7 transition-all duration-300 ease-out", 
                                  isCompleted ? "scale-100 opacity-100" : "scale-150 opacity-0"
                                )} 
                                strokeWidth={4} 
                              />
                            </button>
                          </div>
                        </td>

                        <td className="col-span-1 block md:table-cell align-middle py-3 md:py-4 px-1 md:px-4 border-r-[3px] border-[#1F2937] md:border-r-0 md:border-l-[3px] bg-white md:bg-transparent">
                          <div className="flex flex-col justify-center items-center h-full">
                            <span className="md:hidden text-[9px] font-black uppercase text-secondary-text mb-1.5">Revise</span>
                            <button
                              onClick={() => !hasChapters && toggleRevised(sub.id)}
                              disabled={hasChapters}
                              className={cn(
                                "relative size-9 md:size-10 rounded-[12px] border-[3px] border-[#1F2937] flex items-center justify-center transition-all mx-auto shadow-neo-sm overflow-hidden",
                                isRevised 
                                  ? "bg-[#CE82FF] text-white"
                                  : "bg-white text-transparent",
                                hasChapters 
                                  ? "opacity-70 cursor-default shadow-none" 
                                  : "hover:-translate-y-1 active:translate-y-1 active:translate-x-1 active:shadow-none hover:bg-gray-50"
                              )}
                              title={hasChapters ? "Revise all chapters to unlock" : "Toggle revision"}
                              aria-label={hasChapters ? "Revise all chapters to unlock" : "Toggle revision"}
                            >
                              <Check 
                                className={cn(
                                  "absolute size-7 transition-all duration-300 ease-out", 
                                  isRevised ? "scale-100 opacity-100" : "scale-150 opacity-0"
                                )} 
                                strokeWidth={4} 
                              />
                            </button>
                          </div>
                        </td>

                        <td className="col-span-1 block md:table-cell align-middle py-3 md:py-4 px-1 md:px-4 border-r-[3px] border-[#1F2937] md:border-r-0 md:border-l-[3px] bg-white md:bg-transparent">
                          <div className="flex flex-col justify-center items-center h-full">
                            <span className="md:hidden text-[9px] font-black uppercase text-secondary-text mb-1.5">Practice</span>
                            <Link
                              href={`/tests/subj-${sub.id}?mode=practice`}
                              title={`Drill ${sub.name}`}
                              aria-label={`Drill ${sub.name}`}
                              className="inline-flex items-center justify-center gap-1.5 size-9 md:size-auto md:px-3 md:py-1.5 md:min-h-0 bg-[#FF9600] border-[3px] border-[#1F2937] text-white rounded-[12px] font-heading font-black text-[11px] md:text-[13px] hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 shadow-neo-sm active:shadow-none transition-all uppercase mx-auto"
                            >
                              <Play className="size-4 md:size-3 fill-current" />
                              <span className="hidden md:inline">Drill</span>
                            </Link>
                          </div>
                        </td>

                        <td className="col-span-1 block md:table-cell align-middle py-3 md:py-4 px-1 md:px-4 md:border-l-[3px] border-[#1F2937] bg-white md:bg-transparent">
                          <div className="flex flex-col justify-center items-center h-full">
                            <span className="md:hidden text-[9px] font-black uppercase text-secondary-text mb-1.5">Mindmap</span>
                            <Link
                              href={`/map?subject=${sub.id}`}
                              title={`Map ${sub.name}`}
                              aria-label={`Map ${sub.name}`}
                              className="inline-flex items-center justify-center gap-1.5 size-9 md:size-auto md:px-3 md:py-1.5 md:min-h-0 bg-white border-[3px] border-[#1F2937] text-[#1F2937] rounded-[12px] font-heading font-black text-[11px] md:text-[13px] hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 shadow-neo-sm active:shadow-none transition-all uppercase mx-auto"
                            >
                              <Map className="size-4 md:size-3" strokeWidth={3} />
                              <span className="hidden md:inline">Map</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Nested Chapter Rows */}
                      {hasChapters && sub.chapters!.map((ch: any, chIdx: number) => {
                        const chCompleted = subjectProgress[ch.id]?.completed
                        const chRevised = subjectProgress[ch.id]?.revised
                        return (
                          <tr key={ch.id} className="grid grid-cols-4 md:table-row bg-slate-50/50 hover:bg-slate-100/50 transition-colors group/ch border-t-[3px] md:border-t-0 border-[#1F2937]">
                            <td className="col-span-4 block md:table-cell md:sticky md:left-0 md:z-10 bg-[#F8FAFC] group-hover/ch:bg-slate-100 border-b-[3px] md:border-b-0 border-[#1F2937] md:border-r-[3px] py-2.5 md:py-3 px-3 md:px-6 pl-6 md:pl-16 md:border-t-[2px] md:border-dashed md:border-slate-300 transition-colors min-w-0">
                              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                                <div className="size-2 rounded-full bg-slate-300 shrink-0"></div>
                                <p className={cn(
                                  "font-bold text-[11px] md:text-[14px] truncate min-w-0",
                                  chCompleted ? "text-[#1F2937]" : "text-secondary-text"
                                )} title={ch.name}>
                                  {ch.name}
                                </p>
                              </div>
                            </td>
                            <td className="col-span-1 block md:table-cell align-middle py-2.5 md:py-3 px-1 md:px-4 border-r-[3px] border-[#1F2937] md:border-r-0 md:border-l-[3px] md:border-t-[2px] md:border-dashed md:border-slate-300 bg-white md:bg-transparent">
                              <div className="flex flex-col justify-center items-center h-full">
                                <button
                                  onClick={() => toggleCompleted(ch.id)}
                                  aria-label={`Mark ${ch.name} complete`}
                                  title={`Mark ${ch.name} complete`}
                                  className={cn(
                                    "relative size-9 md:size-8 rounded-[10px] border-[3px] border-[#1F2937] flex items-center justify-center transition-all mx-auto shadow-neo-sm hover:-translate-y-1 active:translate-y-1 active:translate-x-1 active:shadow-none overflow-hidden",
                                    chCompleted ? "bg-[#58CC02] text-white" : "bg-white text-transparent hover:bg-gray-50"
                                  )}
                                >
                                  <Check className={cn("absolute size-5 transition-all duration-300", chCompleted ? "scale-100 opacity-100" : "scale-150 opacity-0")} strokeWidth={4} />
                                </button>
                              </div>
                            </td>
                            <td className="col-span-1 block md:table-cell align-middle py-2.5 md:py-3 px-1 md:px-4 border-r-[3px] border-[#1F2937] md:border-r-0 md:border-l-[3px] md:border-t-[2px] md:border-dashed md:border-slate-300 bg-white md:bg-transparent">
                              <div className="flex flex-col justify-center items-center h-full">
                                <button
                                  onClick={() => toggleRevised(ch.id)}
                                  aria-label={`Mark ${ch.name} revised`}
                                  title={`Mark ${ch.name} revised`}
                                  className={cn(
                                    "relative size-9 md:size-8 rounded-[10px] border-[3px] border-[#1F2937] flex items-center justify-center transition-all mx-auto shadow-neo-sm hover:-translate-y-1 active:translate-y-1 active:translate-x-1 active:shadow-none overflow-hidden",
                                    chRevised ? "bg-[#CE82FF] text-white" : "bg-white text-transparent hover:bg-gray-50"
                                  )}
                                >
                                  <Check className={cn("absolute size-5 transition-all duration-300", chRevised ? "scale-100 opacity-100" : "scale-150 opacity-0")} strokeWidth={4} />
                                </button>
                              </div>
                            </td>
                            <td className="col-span-1 block md:table-cell align-middle py-2.5 md:py-3 px-1 md:px-4 border-r-[3px] border-[#1F2937] md:border-r-0 md:border-l-[3px] md:border-t-[2px] md:border-dashed md:border-slate-300 bg-white md:bg-transparent">
                              <div className="flex flex-col justify-center items-center h-full">
                                <Link
                                  href={`/tests/${ch.id}?mode=practice`}
                                  title={`Drill ${ch.name}`}
                                  aria-label={`Drill ${ch.name}`}
                                  className="inline-flex items-center justify-center gap-1.5 size-9 md:size-8 md:px-3 md:py-1.5 md:min-h-0 bg-[#FF9600] border-[3px] border-[#1F2937] text-white rounded-[12px] md:rounded-[10px] font-heading font-black text-[11px] hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 shadow-neo-sm active:shadow-none transition-all uppercase mx-auto"
                                >
                                  <Play className="size-4 md:size-3 fill-current" />
                                  <span className="hidden md:inline">Drill</span>
                                </Link>
                              </div>
                            </td>
                            <td className="col-span-1 block md:table-cell align-middle py-2.5 md:py-3 px-1 md:px-4 md:border-l-[3px] border-[#1F2937] md:border-t-[2px] md:border-dashed md:border-slate-300 bg-white md:bg-transparent">
                              <div className="flex flex-col justify-center items-center h-full">
                                <Link
                                  href={`/map?subject=${sub.id}&chapter=${ch.id}`}
                                  title={`Map ${ch.name}`}
                                  aria-label={`Map ${ch.name}`}
                                  className="inline-flex items-center justify-center gap-1.5 size-9 md:size-8 md:px-3 md:py-1.5 md:min-h-0 bg-white border-[3px] border-[#1F2937] text-[#1F2937] rounded-[12px] md:rounded-[10px] font-heading font-black text-[11px] hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 shadow-neo-sm active:shadow-none transition-all uppercase mx-auto"
                                >
                                  <Map className="size-4 md:size-3" strokeWidth={3} />
                                  <span className="hidden md:inline">Map</span>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

    </div>
  )
}
