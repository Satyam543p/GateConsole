"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  ArrowRight,
  Trash2,
  TrendingDown,
  TrendingUp,
  Printer,
  Sparkles,
  BarChart3,
  Clock,
  Search,
} from "lucide-react"
import { type StoredAttempt, formatClock, scoreAttempt } from "@/lib/test-types"
import { useAttempts, useQuestionBank, useCollection, useTests } from "@/lib/storage/hooks"
import { COLLECTIONS } from "@/lib/storage/store"
import { estimateGateScoreInterval, getTimeBleedDiagnosis, getSillyMistakeIndex, getHighestYieldHourSuggestion, getMarksPerHourYield } from "@/lib/analytics/prescriptive"
import { cn } from "@/lib/utils"

/** Percentage score for an attempt, floored at 0 so negatives don't break scales. */
function pct(a: StoredAttempt): number {
  return a.totalMarks > 0 ? (Math.max(0, a.scored) / a.totalMarks) * 100 : 0
}



export function AttemptHistory() {
  const { attempts, ready, remove, clear } = useAttempts()
  const { questionMap } = useQuestionBank()
  const TESTS = useTests()
  const { data: sessions } = useCollection(COLLECTIONS.sessions)
  const { data: mistakes } = useCollection(COLLECTIONS.mistakes)

  const [searchHistory, setSearchHistory] = useState("")
  const [confirmClear, setConfirmClear] = useState(false)

  const scoreEstimate = useMemo(() => estimateGateScoreInterval(attempts), [attempts])
  const yieldStats = useMemo(() => getMarksPerHourYield(attempts, sessions || []), [attempts, sessions])
  const timeBleeds = useMemo(() => getTimeBleedDiagnosis(attempts, questionMap), [attempts, questionMap])
  const sillyStats = useMemo(() => getSillyMistakeIndex(mistakes || [], questionMap), [mistakes, questionMap])
  const nextAction = useMemo(() => getHighestYieldHourSuggestion(attempts, yieldStats, timeBleeds, sillyStats), [attempts, yieldStats, timeBleeds, sillyStats])

  const searchedAttempts = useMemo(() => {
    if (!searchHistory.trim()) return attempts
    const q = searchHistory.toLowerCase().trim()
    return attempts.filter(
      (a) =>
        a.testTitle.toLowerCase().includes(q) ||
        (a.subject && a.subject.toLowerCase().includes(q)) ||
        a.kind.toLowerCase().includes(q)
    )
  }, [attempts, searchHistory])

  /** Aggregate per-subject accuracy across every attempt. */
  const subjectStats = useMemo(() => {
    const map = new Map<string, { correct: number; wrong: number; skipped: number; scored: number; total: number }>()
    for (const a of attempts) {
      const qs = (a.questionIds ?? [])
        .map((id) => questionMap.get(id))
        .filter((q): q is NonNullable<typeof q> => Boolean(q))
      if (qs.length === 0) continue
      const r = scoreAttempt(qs, a.responses, a.timePerQuestion)
      for (const s of r.bySubject) {
        const prev = map.get(s.subject) ?? { correct: 0, wrong: 0, skipped: 0, scored: 0, total: 0 }
        map.set(s.subject, {
          correct: prev.correct + s.correct,
          wrong: prev.wrong + s.wrong,
          skipped: prev.skipped + s.skipped,
          scored: prev.scored + s.scored,
          total: prev.total + s.total,
        })
      }
    }
    return Array.from(map.entries())
      .map(([subject, v]) => ({
        subject,
        ...v,
        accuracy: v.correct + v.wrong > 0 ? (v.correct / (v.correct + v.wrong)) * 100 : 0,
        yield: v.total > 0 ? (Math.max(0, v.scored) / v.total) * 100 : 0,
      }))
      .sort((a, b) => b.yield - a.yield)
  }, [attempts, questionMap])



  if (!ready) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-20 md:px-8">
        <p className="font-mono text-xs font-bold text-secondary-text animate-pulse">Loading performance analytics…</p>
      </main>
    )
  }

  if (attempts.length === 0) {
    return (
      <main className="min-h-screen bg-transparent pt-3 sm:pt-6 md:pt-10 pb-28 md:pb-40 px-3 sm:px-4 md:px-6 max-w-3xl mx-auto space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary-text hover:text-foreground transition-colors mb-1"
        >
          <ArrowRight className="size-3.5 rotate-180" /> Back to Dashboard
        </Link>

        <div className="neo-card bg-white border-2 sm:border-3 border-[#1F2937] p-5 sm:p-10 text-center rounded-2xl sm:rounded-3xl shadow-neo-xs sm:shadow-neo space-y-3">
          <BarChart3 className="size-10 sm:size-14 text-[#1CB0F6] mx-auto" />
          <h1 className="text-lg sm:text-2xl font-heading font-black text-foreground uppercase tracking-tight">
            No Test Attempts Recorded Yet
          </h1>
          <p className="text-xs sm:text-sm font-bold text-secondary-text max-w-md mx-auto leading-relaxed">
            Take a mock test or practice drill in the Test Centre. Your score trends, subject accuracy, and real-time GATE Rank predictions will automatically generate here.
          </p>
          <div className="pt-2">
            <Link
              href="/tests"
              className="neo-btn bg-[#58CC02] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-heading font-black text-xs sm:text-sm uppercase tracking-wider inline-flex items-center gap-2 shadow-neo-xs sm:shadow-neo-sm hover:-translate-y-0.5"
            >
              Go to Test Centre
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-transparent pt-3 sm:pt-6 md:pt-10 pb-28 md:pb-40 px-3 sm:px-4 md:px-6 max-w-6xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in duration-300">
      {/* Top Header & Breadcrumb */}
      <header className="space-y-3 sm:space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary-text hover:text-foreground transition-colors mb-1"
        >
          <ArrowRight className="size-3.5 rotate-180" /> Back to Dashboard
        </Link>

        <div className="bg-[#F0FFF4] border-[3px] border-[#1F2937] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-neo relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute -top-10 -right-10 size-40 bg-[#58CC02] opacity-20 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
              <div className="inline-flex items-center gap-2 bg-white border-2 border-[#1F2937] px-3 py-1 rounded-xl shadow-neo-xs">
                <BarChart3 className="size-4 text-[#58CC02]" />
                <p className="font-mono text-[10px] sm:text-xs font-black tracking-widest text-foreground uppercase">
                  Prescriptive Analytics
                </p>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-foreground uppercase tracking-tighter">
                Performance Insights
              </h1>
              <p className="text-xs sm:text-sm font-bold text-foreground/80 max-w-xl">
                Predictive GATE score model, subject yield, time-bleed analytics &amp; mistake diagnosis.
              </p>
            </div>
            
            <div className="hidden sm:flex items-center shrink-0 mt-4 md:mt-0">
              <button
                type="button"
                onClick={() => window.print()}
                className="neo-btn bg-white text-foreground px-5 py-3 text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 shadow-neo hover:-translate-y-1 transition-all rounded-xl border-2 border-[#1F2937]"
              >
                <Printer className="size-4" />
                Print Report
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO PREDICTIVE AI CARD */}
      <div className="neo-card bg-[#FAFBFF] border-2 sm:border-3 border-[#1F2937] p-2.5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-neo-xs sm:shadow-neo space-y-2.5 sm:space-y-6 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 border-b-2 border-[#1F2937]/15 pb-2.5 sm:pb-4">
          <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-xs font-black text-[#1899D6] uppercase tracking-wider">
            <Sparkles className="size-3.5 sm:size-4 text-[#1CB0F6] shrink-0" />
            <span>GATE 2027 Intelligence Score &amp; Rank Predictor</span>
          </div>
          <span className="bg-[#FFF8EE] border-2 border-[#1F2937] text-[#FF9600] px-2 py-0.5 sm:px-3 sm:py-1 rounded-xl text-[9px] sm:text-xs font-black uppercase shadow-neo-xs">
            {scoreEstimate.confidence} Confidence &middot; {scoreEstimate.percentile}
          </span>
        </div>

        {/* 4 Core Intelligence Metrics (2x2 on mobile, 4-col on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Predicted Raw Marks */}
          <div className="bg-white border-[3px] border-[#1F2937] p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-neo hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform flex flex-col gap-1">
            <p className="text-[10px] sm:text-[11px] font-heading font-black uppercase text-secondary-text tracking-wider">Predicted Raw</p>
            <div className="flex items-baseline gap-1 min-w-0">
              <span className="font-heading text-3xl md:text-4xl font-black text-foreground tabular-nums tracking-tighter">
                {scoreEstimate.rawMid}
              </span>
              <span className="font-mono text-[9px] sm:text-xs font-bold text-secondary-text shrink-0">/ 100</span>
            </div>
            <p className="font-mono text-[10px] sm:text-xs font-bold text-[#1CB0F6]">
              {scoreEstimate.rawLow}–{scoreEstimate.rawHigh}
            </p>
          </div>

          {/* Normalized Score */}
          <div className="bg-white border-[3px] border-[#1F2937] p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-neo hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform flex flex-col gap-1">
            <p className="text-[10px] sm:text-[11px] font-heading font-black uppercase text-secondary-text tracking-wider">GATE Score</p>
            <div className="flex items-baseline gap-1 min-w-0">
              <span className="font-heading text-3xl md:text-4xl font-black text-[#58CC02] tabular-nums tracking-tighter">
                {scoreEstimate.gateScoreMid}
              </span>
              <span className="font-mono text-[9px] sm:text-[11px] font-bold text-secondary-text shrink-0">/ 1k</span>
            </div>
            <p className="font-mono text-[9px] sm:text-[11px] font-bold text-[#58CC02]">
              {scoreEstimate.gateScoreLow}–{scoreEstimate.gateScoreHigh}
            </p>
          </div>

          {/* Predicted AIR */}
          <div className="bg-white border-[3px] border-[#1F2937] p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-neo hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform flex flex-col gap-1">
            <p className="text-[10px] sm:text-[11px] font-heading font-black uppercase text-secondary-text tracking-wider">AIR Rank</p>
            <div className="min-w-0">
              <span className="font-heading text-2xl sm:text-3xl md:text-4xl font-black text-[#CE82FF] truncate block leading-tight tracking-tighter">
                {scoreEstimate.airLabel}
              </span>
            </div>
            <p className="font-mono text-[9px] sm:text-[11px] font-bold text-[#FF9600]">
              Top {scoreEstimate.percentile}
            </p>
          </div>

          {/* Admission Tier */}
          <div className="bg-white border-[3px] border-[#1F2937] p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-neo hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform flex flex-col gap-1">
            <p className="text-[10px] sm:text-[11px] font-heading font-black uppercase text-secondary-text tracking-wider">Admissions</p>
            <div className="min-w-0 flex-1">
              <span className="font-heading text-xs sm:text-sm md:text-base font-black text-[#1CB0F6] leading-snug line-clamp-3">
                {scoreEstimate.admissionsTier}
              </span>
            </div>
            <p className="font-mono text-[9px] sm:text-[10px] font-bold text-secondary-text">Cutoffs</p>
          </div>
        </div>

        <p className="font-mono text-[9px] sm:text-xs font-bold text-secondary-text">
          💡 <span className="text-foreground font-black">Methodology:</span> {scoreEstimate.basisReason}
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
        {/* HIGHEST-YIELD ACTION BANNER */}
        <div className="neo-card bg-white border-[3px] border-[#1F2937] p-4 sm:p-6 rounded-2xl shadow-neo flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-mono text-[10px] sm:text-xs font-black text-[#FF4B4B] uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="size-3.5" /> Highest-Yield Action
            </p>
            <h2 className="font-heading font-black text-lg sm:text-xl text-foreground">
              {nextAction.title}
            </h2>
            <p className="text-xs sm:text-sm font-bold text-secondary-text max-w-2xl">
              {nextAction.reason}
            </p>
          </div>
          <div className="flex flex-col items-end shrink-0 w-full sm:w-auto gap-2">
            <span className="font-mono text-[10px] sm:text-xs font-black text-[#58CC02] bg-[#F0FFF4] border-2 border-[#58CC02] px-2 py-0.5 rounded-lg">
              {nextAction.impactMarks}
            </span>
            <Link href={nextAction.actionLink} className="neo-btn bg-[#1F2937] text-white px-5 py-2 rounded-xl font-black uppercase text-xs sm:text-sm w-full text-center hover:bg-[#1CB0F6] transition-colors shadow-neo-sm">
              Start Now
            </Link>
          </div>
        </div>

          {/* Subject-Wise Predicted Marks Grid */}
          <div className="neo-card bg-white border-2 border-[#1F2937] p-3 sm:p-5 md:p-8 rounded-2xl sm:rounded-3xl shadow-neo-xs sm:shadow-neo space-y-3 sm:space-y-6">
            <div>
              <h2 className="text-sm sm:text-xl font-heading font-black text-foreground uppercase tracking-tight">
                Subject-Wise Predicted Marks Breakdown
              </h2>
              <p className="text-[10px] sm:text-xs font-bold text-secondary-text mt-0.5">
                Estimated marks per subject based on current accuracy and GATE weightages.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] sm:max-h-none overflow-y-auto p-1 -m-1">
              {scoreEstimate.subjectScores.map((s, i) => {
                return (
                  <div
                    key={s.subject}
                    className="bg-white border-[2.5px] border-[#1F2937] p-3.5 sm:p-4 rounded-2xl shadow-neo-sm flex flex-col justify-between space-y-2.5 sm:space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                    <span className="font-heading font-black text-xs sm:text-sm text-foreground truncate">{s.subject}</span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-md font-mono text-[9px] sm:text-[10px] font-black uppercase shrink-0 border",
                        s.status === "Strong"
                          ? "bg-[#F0FFF4] text-[#58CC02] border-[#58CC02]"
                          : s.status === "Moderate"
                          ? "bg-[#FFF8EE] text-[#FF9600] border-[#FF9600]"
                          : s.status === "Needs Focus"
                          ? "bg-[#FFE5E5] text-[#FF4B4B] border-[#FF4B4B]"
                          : "bg-gray-100 text-gray-400 border-gray-300"
                      )}
                    >
                      {s.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[11px] sm:text-xs">
                      <span className="text-secondary-text font-bold">Predicted:</span>
                      <span className="font-black text-foreground">
                        {s.predictedMarks} / {s.maxGateMarks} Marks
                      </span>
                    </div>

                    <div className="h-3 w-full bg-white border-[2px] border-[#1F2937] rounded-full overflow-hidden p-[1px]">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all border-r-[1.5px] border-[#1F2937]/20",
                          s.status === "Untested" ? "bg-transparent" : s.accuracy >= 70 ? "bg-[#58CC02]" : s.accuracy >= 45 ? "bg-[#FF9600]" : "bg-[#FF4B4B]"
                        )}
                        style={{ width: `${s.accuracy}%` }}
                      />
                    </div>
                  </div>
                </div>
                )
              })}
            </div>
          </div>

          {/* TIME BLEED & SILLY MISTAKE DIAGNOSIS */}
          {(timeBleeds.length > 0 || sillyStats.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Time Bleeds */}
              {timeBleeds.length > 0 && (
                <div className="neo-card bg-white border-[2.5px] border-[#1F2937] p-4 sm:p-6 rounded-2xl shadow-neo-sm space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-[#1F2937]/10 pb-3">
                    <div>
                      <h3 className="font-heading font-black text-sm sm:text-base uppercase flex items-center gap-1.5 text-foreground">
                        <Clock className="size-4 text-[#FF9600]" /> Time Bleeds
                      </h3>
                      <p className="font-mono text-[9px] sm:text-[10px] text-secondary-text font-bold mt-0.5">High time, low accuracy topics</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {timeBleeds.slice(0, 3).map(bleed => (
                      <div key={bleed.topic} className="p-3 bg-[#FAFBFF] border-2 border-[#1F2937]/10 rounded-xl space-y-1.5">
                        <div className="flex justify-between items-start">
                          <span className="font-heading font-black text-xs sm:text-sm text-foreground">{bleed.topic}</span>
                          <span className="font-mono text-[10px] font-bold text-[#FF4B4B] bg-[#FFE5E5] px-1.5 py-0.5 rounded border border-[#FF4B4B]/20">{bleed.accuracyPct}% Acc</span>
                        </div>
                        <p className="font-mono text-[10px] sm:text-xs font-bold text-secondary-text">
                          {bleed.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Silly Mistakes */}
              {sillyStats.length > 0 && (
                <div className="neo-card bg-white border-[2.5px] border-[#1F2937] p-4 sm:p-6 rounded-2xl shadow-neo-sm space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-[#1F2937]/10 pb-3">
                    <div>
                      <h3 className="font-heading font-black text-sm sm:text-base uppercase flex items-center gap-1.5 text-foreground">
                        <TrendingDown className="size-4 text-[#FF4B4B]" /> Careless Errors
                      </h3>
                      <p className="font-mono text-[9px] sm:text-[10px] text-secondary-text font-bold mt-0.5">Marks lost to silly mistakes</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {sillyStats.slice(0, 3).map(stat => (
                      <div key={stat.subject} className="flex items-center justify-between p-3 bg-[#FAFBFF] border-2 border-[#1F2937]/10 rounded-xl">
                        <span className="font-heading font-black text-xs sm:text-sm text-foreground">{stat.subject}</span>
                        <div className="text-right">
                          <span className="block font-heading font-black text-sm sm:text-base text-[#FF4B4B]">
                            -{stat.marksLost} Marks
                          </span>
                          <span className="font-mono text-[9px] font-bold text-secondary-text">
                            {stat.sillyCount} mistakes
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      {/* TEST ATTEMPT HISTORY LOG */}
        <div className="neo-card bg-white border-2 sm:border-3 border-[#1F2937] p-3 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-neo-xs sm:shadow-neo space-y-4 sm:space-y-6 animate-in fade-in duration-200 w-full overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 border-b-2 border-[#1F2937]/15 pb-3 sm:pb-4">
            <div>
              <h2 className="text-sm sm:text-xl font-heading font-black text-foreground uppercase tracking-tight">
                Completed Test History Log
              </h2>
              <p className="text-[11px] sm:text-xs font-bold text-secondary-text mt-0.5">
                Review question breakdowns, solutions, and time spent on past attempts.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
              {/* Search History */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchHistory}
                  onChange={(e) => setSearchHistory(e.target.value)}
                  placeholder="Filter attempts..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border-2 border-[#1F2937] bg-white font-bold text-xs shadow-neo-xs outline-none focus:border-[#1CB0F6]"
                />
              </div>

              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="neo-btn bg-white text-[#FF4B4B] border-[#FF4B4B] px-3.5 py-1.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-neo-xs whitespace-nowrap shrink-0"
              >
                <Trash2 className="size-3.5" /> Clear History
              </button>
            </div>
          </div>

          {confirmClear && (
            <div className="border-3 border-[#FF4B4B] rounded-2xl bg-[#FFE5E5] p-5 shadow-neo-xs space-y-3">
              <p className="text-sm font-black text-[#FF4B4B]">
                Delete all {attempts.length} saved test attempts? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    clear()
                    setConfirmClear(false)
                  }}
                  className="neo-btn bg-[#FF4B4B] text-white px-4 py-2 text-xs font-black uppercase"
                >
                  Confirm Delete All
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="neo-btn bg-white text-foreground px-4 py-2 text-xs font-black uppercase"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Mobile Card List (Visible on sm and below) */}
          <div className="grid grid-cols-1 gap-4 md:hidden max-h-[380px] overflow-y-auto pr-1">
            {searchedAttempts.map((a) => {
              const p = pct(a)
              return (
                <div key={a.id} className="border-[3px] border-[#1F2937] bg-white rounded-[20px] p-5 shadow-neo space-y-4 hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <Link href={`/results/${a.id}`} className="font-heading font-black text-sm sm:text-base text-foreground hover:text-[#1CB0F6] leading-tight line-clamp-2">
                        {a.testTitle}
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="font-mono text-[10px] font-black text-secondary-text uppercase bg-[#FAFBFF] border-2 border-[#1F2937]/10 px-2 py-0.5 rounded-lg">{a.kind}</span>
                        <span className="font-mono text-[10px] text-secondary-text font-bold flex items-center gap-1">
                          <Clock className="size-3" /> {new Date(a.submittedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 font-mono text-xs font-black border-2 rounded-xl px-2.5 py-1 shadow-neo-xs shrink-0",
                        p >= 60 ? "text-[#58CC02] border-[#58CC02] bg-[#F0FFF4]" : "text-[#FF4B4B] border-[#FF4B4B] bg-[#FFE5E5]"
                      )}
                    >
                      {p >= 60 ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                      {p.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t-2 border-[#1F2937]/5 pt-3">
                    <div className="font-mono text-[11px] sm:text-xs font-bold text-secondary-text">
                      Score: <span className="text-foreground font-black">{a.scored.toFixed(1)}</span>
                      <span className="mx-1.5 sm:mx-2 text-[#1F2937]/20">|</span>
                      {formatClock(a.durationSeconds)}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => remove(a.id)}
                        className="p-2 rounded-xl border-2 border-border/40 hover:border-[#FF4B4B] text-secondary-text hover:text-[#FF4B4B] bg-[#FAFBFF] transition-all shadow-neo-xs"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                      <Link
                        href={`/results/${a.id}`}
                        className="neo-btn bg-[#1CB0F6] text-white px-4 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl shadow-neo-sm"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Desktop Table (Visible on md and up) */}
          <div className="hidden md:block overflow-auto w-full pb-2 rounded-xl border-[2.5px] border-[#1F2937] shadow-neo max-h-[500px]">
            <table className="w-full min-w-[760px] text-left font-mono text-xs border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#1F2937] text-white uppercase text-[11px] font-black">
                  <th className="p-3 pl-4">Test Title</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Score</th>
                  <th className="p-3 text-center">Outcome</th>
                  <th className="p-3 text-right">R / W / S</th>
                  <th className="p-3 text-right">Duration</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchedAttempts.map((a) => {
                  const p = pct(a)
                  return (
                    <tr key={a.id} className="border-b border-[#1F2937]/10 hover:bg-[#FAFBFF] transition-colors">
                      <td className="p-3">
                        <Link href={`/results/${a.id}`} className="font-heading font-black text-sm text-foreground hover:text-[#1CB0F6]">
                          {a.testTitle}
                        </Link>
                        <span className="block font-mono text-[10px] text-secondary-text uppercase font-bold mt-0.5">{a.kind}</span>
                      </td>
                      <td className="p-3 text-secondary-text font-bold">
                        {new Date(a.submittedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </td>
                      <td className="p-3 text-right font-black text-foreground text-sm">
                        {a.scored.toFixed(1)} / {a.totalMarks}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 font-mono text-xs font-black border-2 rounded-lg px-2 py-0.5 shadow-neo-xs",
                            p >= 60 ? "text-[#58CC02] border-[#58CC02] bg-[#F0FFF4]" : "text-[#FF4B4B] border-[#FF4B4B] bg-[#FFE5E5]"
                          )}
                        >
                          {p >= 60 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                          {p.toFixed(1)}%
                        </span>
                      </td>
                      <td className="p-3 text-right font-bold text-secondary-text">
                        <span className="text-[#58CC02]">{a.correct}</span> / <span className="text-[#FF4B4B]">{a.wrong}</span> / {a.skipped}
                      </td>
                      <td className="p-3 text-right font-bold text-secondary-text">
                        {formatClock(a.durationSeconds)}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/results/${a.id}`}
                            className="neo-btn bg-[#1CB0F6] text-white px-3 py-1 text-xs font-black uppercase tracking-wider"
                          >
                            Review
                          </Link>
                          <button
                            type="button"
                            onClick={() => remove(a.id)}
                            className="p-1.5 rounded-lg border-2 border-border/40 hover:border-[#FF4B4B] text-secondary-text hover:text-[#FF4B4B] bg-white transition-all shadow-neo-xs"
                            title="Delete attempt"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      {/* Generous bottom scroll clearance */}
      <div className="h-12 w-full" aria-hidden="true" />
    </main>
  )
}
