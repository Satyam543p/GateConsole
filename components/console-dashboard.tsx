"use client"

import React, { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Flame, Check, Play, Map, Target, BookOpen, Sparkles, Zap, ClipboardList } from "lucide-react"
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
    <div className="relative z-10 pt-10 sm:pt-12 md:pt-12 pb-28 md:pb-44 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-6 mb-6 md:mb-8">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-primary-text uppercase tracking-tight leading-[1.1]">
            {greeting},<br className="sm:hidden" /> {userName}
          </h1>
          <p className="text-sm md:text-base text-secondary-text font-bold mt-2">
            Track your progress and drill your weak areas. {activeExamId !== "gate-cse" && <span className="text-[#FF9600]">[{activeExamId.toUpperCase()}]</span>}
          </p>
        </div>
        
        <div className="w-full md:w-auto mt-1 md:mt-0">
          <div className="flex items-center gap-3 sm:gap-4 bg-[#FFC800] px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 rounded-2xl sm:rounded-3xl border-[3px] border-[#1F2937] shadow-neo shrink-0 cursor-default">
            <div className="size-12 sm:size-14 rounded-full bg-white border-[3px] border-[#1F2937] flex items-center justify-center shrink-0">
              <Target className="size-6 sm:size-7 text-[#1F2937]" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[10px] sm:text-xs font-black text-[#1F2937] uppercase tracking-wider mb-0.5">Readiness Score</p>
              <p className="text-3xl sm:text-4xl font-heading font-black text-[#1F2937] leading-none">{completionPercentage}%</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── DASHBOARD WIDGETS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 items-start mt-4 md:mt-2">

        {/* Daily Challenge – 2 cols */}
        <div className="md:col-span-2 flex flex-col space-y-2">
          <h2 className="text-sm md:text-[18px] font-heading font-black text-primary-text uppercase tracking-wide">Daily Challenge</h2>
          <Card className="p-4 sm:p-6 bg-[#1CB0F6] text-white border-[3px] border-[#1F2937] shadow-neo-sm sm:shadow-neo hover:-rotate-1 transition-transform flex-1">
            <div className="flex flex-col h-full gap-2">
              <div className="flex items-center gap-1.5">
                <Flame className="size-4 text-[#FF9600] shrink-0" fill="#FF9600" />
                <span className="text-[10px] sm:text-[11px] font-black tracking-wide uppercase">Challenge of the Day</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading text-4xl sm:text-5xl font-black leading-none">{dailyLoading ? "…" : streak}</span>
                <span className="text-[10px] sm:text-[12px] font-black uppercase opacity-90">day streak</span>
              </div>
              <p className="text-xs sm:text-sm font-bold opacity-90">
                {streak === 0 ? "Solve today's question to start a streak." : "Answer today correctly to keep the streak alive."}
              </p>
              <Link
                href="/daily"
                className="mt-3 sm:mt-auto inline-flex items-center justify-center gap-1.5 border-[2.5px] border-[#1F2937] bg-white text-[#1F2937] shadow-neo-xs hover:-translate-y-0.5 hover:bg-white rounded-xl font-black uppercase tracking-wide transition-all text-xs sm:text-sm px-4 py-2 sm:py-2.5 w-full"
              >
                Attempt Challenge <ArrowRight className="size-3.5 sm:size-4" />
              </Link>
            </div>
          </Card>
        </div>


        {/* Revision Debt – 1 col */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm md:text-[18px] font-heading font-black text-primary-text uppercase tracking-wide">Revision Debt</h2>
            {revisionDebt.length > 0 && (
              <span className="text-[10px] md:text-xs font-black bg-[#FF4B4B] text-white px-2 py-0.5 rounded-full border-2 border-[#1F2937] leading-none shadow-neo-xs mt-0.5">
                {revisionDebt.length}
              </span>
            )}
          </div>
          <Card className="px-4 pt-4 pb-4 flex flex-col overflow-hidden neo-card bg-[#CE82FF] hover:rotate-1 transition-transform border-[3px] shadow-neo-sm sm:shadow-neo">
            {revisionDebt.length > 0 ? (
              <ul className="space-y-2 overflow-y-auto custom-scrollbar pr-1 max-h-[100px] md:max-h-[160px]">
                {revisionDebt.map(sub => (
                  <li key={sub.id} className="flex items-center justify-between bg-white border-[2.5px] border-[#1F2937] rounded-xl p-2 shadow-neo-xs">
                    <span className="text-xs sm:text-[14px] font-bold text-primary-text line-clamp-1 flex-1 pr-2">{sub.name}</span>
                    <span className="text-[9px] sm:text-[11px] font-black text-white bg-[#FF4B4B] px-1.5 py-0.5 rounded-md sm:rounded-lg shrink-0 border-2 border-[#1F2937]">URGENT</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center bg-white border-[2.5px] border-[#1F2937] rounded-xl p-4 shadow-neo-xs min-h-[100px]">
                <Check className="size-8 sm:size-10 text-[#58CC02] mb-1.5 sm:mb-2" strokeWidth={3} />
                <p className="text-xs sm:text-[14px] font-black text-primary-text uppercase">No Revision Debt!</p>
                <p className="text-[10px] sm:text-[12px] font-bold text-secondary-text mt-0.5 sm:mt-1">You are fully caught up.</p>
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
                              href={`/tests?filter=subject&subject=${sub.id}`}
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
