"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight, Trash2, TrendingDown, TrendingUp, Printer, Target, Flame, ShieldAlert, Sparkles, Zap, AlertTriangle } from "lucide-react"
import { type StoredAttempt, formatClock, scoreAttempt } from "@/lib/test-types"
import { useAttempts } from "@/lib/use-attempts"
import { useQuestionBank, useCollection, useTests } from "@/lib/storage/hooks"
import { COLLECTIONS } from "@/lib/storage/store"
import type { StudySession, MistakeEntry } from "@/lib/domain/types"
import {
  estimateGateScoreInterval,
  getMarksPerHourYield,
  getTimeBleedDiagnosis,
  getSillyMistakeIndex,
  getHighestYieldHourSuggestion,
} from "@/lib/analytics/prescriptive"
import { cn } from "@/lib/utils"

/** Percentage score for an attempt, floored at 0 so negatives don't break scales. */
function pct(a: StoredAttempt): number {
  return a.totalMarks > 0 ? (Math.max(0, a.scored) / a.totalMarks) * 100 : 0
}

/** Dependency-free SVG line chart of score progression (oldest → newest). */
function TrendChart({ attempts }: { attempts: StoredAttempt[] }) {
  const series = [...attempts].reverse() // stored newest-first
  const W = 720
  const H = 200
  const PAD = { top: 16, right: 16, bottom: 28, left: 34 }
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom

  if (series.length < 2) {
    return (
      <div className="border border-dashed border-border bg-card/50 p-8 text-center">
        <p className="font-mono text-[11px] text-muted-foreground">
          Take at least two tests to see a trend line. {series.length === 1 ? "One attempt recorded so far." : ""}
        </p>
      </div>
    )
  }

  const x = (i: number) => PAD.left + (i / (series.length - 1)) * innerW
  const y = (v: number) => PAD.top + innerH - (v / 100) * innerH

  const line = series.map((a, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(pct(a)).toFixed(1)}`).join(" ")
  const area = `${line} L${x(series.length - 1).toFixed(1)},${(PAD.top + innerH).toFixed(1)} L${x(0).toFixed(1)},${(PAD.top + innerH).toFixed(1)} Z`

  return (
    <div className="border border-border bg-card p-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Score progression across ${series.length} attempts, from ${pct(series[0]).toFixed(0)}% to ${pct(series[series.length - 1]).toFixed(0)}%`}
      >
        {/* gridlines */}
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(v)}
              y2={y(v)}
              stroke="currentColor"
              className="text-border"
              strokeWidth="1"
            />
            <text
              x={PAD.left - 8}
              y={y(v) + 3.5}
              textAnchor="end"
              className="fill-muted-foreground font-mono"
              fontSize="9"
            >
              {v}
            </text>
          </g>
        ))}

        <path d={area} className="fill-primary/12" />
        <path d={line} fill="none" className="stroke-primary" strokeWidth="2" strokeLinejoin="round" />

        {series.map((a, i) => (
          <g key={a.id}>
            <circle cx={x(i)} cy={y(pct(a))} r="3.5" className="fill-primary" />
            <title>
              {a.testTitle} — {pct(a).toFixed(1)}% ({a.scored.toFixed(1)}/{a.totalMarks})
            </title>
          </g>
        ))}

        {/* x labels: first, middle, last only, to avoid crowding */}
        {[0, Math.floor((series.length - 1) / 2), series.length - 1]
          .filter((v, i, arr) => arr.indexOf(v) === i)
          .map((i) => (
            <text
              key={i}
              x={x(i)}
              y={H - 8}
              textAnchor={i === 0 ? "start" : i === series.length - 1 ? "end" : "middle"}
              className="fill-muted-foreground font-mono"
              fontSize="9"
            >
              {new Date(series[i].submittedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </text>
          ))}
      </svg>
    </div>
  )
}

export function AttemptHistory() {
  const { attempts, ready, remove, clear } = useAttempts()
  const { questionMap } = useQuestionBank()
  const TESTS = useTests()
  const { data: sessions } = useCollection(COLLECTIONS.sessions)
  const { data: mistakes } = useCollection(COLLECTIONS.mistakes)

  const [testFilter, setTestFilter] = useState<string>("all")
  const [includeUnverified, setIncludeUnverified] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  const scoreEstimate = useMemo(() => estimateGateScoreInterval(attempts), [attempts])
  const yieldStats = useMemo(() => getMarksPerHourYield(attempts, sessions as StudySession[]), [attempts, sessions])
  const timeBleeds = useMemo(() => getTimeBleedDiagnosis(attempts, questionMap), [attempts, questionMap])
  const sillyStats = useMemo(() => getSillyMistakeIndex(mistakes as MistakeEntry[], questionMap), [mistakes, questionMap])
  const highestYieldHour = useMemo(
    () => getHighestYieldHourSuggestion(attempts, yieldStats, timeBleeds, sillyStats),
    [attempts, yieldStats, timeBleeds, sillyStats]
  )

  const filtered = attempts.filter((a) => testFilter === "all" || a.testId === testFilter)

  /** Aggregate per-subject accuracy across every attempt. */
  const subjectStats = useMemo(() => {
    const map = new Map<string, { correct: number; wrong: number; skipped: number; scored: number; total: number }>()
    for (const a of attempts) {
      const qs = (a.questionIds ?? [])
        .map((id) => questionMap.get(id))
        .filter((q): q is NonNullable<typeof q> => Boolean(q))
        .filter((q) => includeUnverified || q.verified !== false)
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
      .sort((a, b) => a.yield - b.yield)
  }, [attempts])

  const best = filtered.length > 0 ? Math.max(...filtered.map(pct)) : 0
  const avg = filtered.length > 0 ? filtered.reduce((s, a) => s + pct(a), 0) / filtered.length : 0
  const latest = filtered[0]
  const previous = filtered[1]
  const delta = latest && previous ? pct(latest) - pct(previous) : null

  const testsWithAttempts = TESTS.filter((t) => attempts.some((a) => a.testId === t.id))

  if (!ready) {
    return (
      <main className="mx-auto max-w-[1600px] px-4 py-20 md:px-8">
        <p className="font-mono text-[11px] text-muted-foreground">Loading attempt history…</p>
      </main>
    )
  }

  if (attempts.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 md:px-8">
        <p className="font-mono text-[11px] tracking-[0.24em] text-primary uppercase">Progress</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          No attempts recorded yet.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
          Once you submit a test, your score, per-subject accuracy and pacing land here and build into a trend line
          across attempts. Results are saved in this browser.
        </p>
        <Link
          href="/tests"
          className="mt-8 inline-flex items-center gap-2 border border-primary bg-primary px-5 py-2.5 font-mono text-[11px] tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
        >
          Go to test centre
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen relative z-10 bg-background pb-12">
      <section className="relative overflow-hidden border-b-3 border-border">
        <div className="grid-lines absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1600px] px-4 py-10 md:px-8 md:py-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs tracking-widest text-[#CE82FF] font-bold uppercase">Prescriptive Analytics &amp; Progress</p>
              <h1 className="mt-2 max-w-3xl text-4xl leading-[1.1] font-bold tracking-tight text-balance md:text-5xl">
                {delta === null
                  ? "Your attempt history & predictive yield."
                  : delta >= 0
                    ? `Up ${delta.toFixed(1)} points on your last attempt.`
                    : `Down ${Math.abs(delta).toFixed(1)} points on your last attempt.`}
              </h1>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="neo-btn bg-white text-foreground hover:text-primary transition-colors print:hidden flex items-center gap-2 px-4 py-2"
            >
              <Printer className="size-4" />
              Print Progress Report
            </button>
          </div>

          {/* SINGLE HIGHEST-YIELD HOUR HIGHLIGHT */}
          <div className="mt-10 border-3 border-[#CE82FF] bg-[#F6E8FF] rounded-2xl p-8 relative overflow-hidden shadow-neo">
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-white rounded-full opacity-50 pointer-events-none mix-blend-overlay" />
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2 font-mono text-[11px] tracking-wider text-primary uppercase font-bold">
                  <Sparkles className="size-4" />
                  Single Highest-Yield Hour You Can Spend Today
                </div>
                <h3 className="text-xl font-bold text-foreground">{highestYieldHour.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{highestYieldHour.reason}</p>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-3 shrink-0 relative z-10 mt-4 sm:mt-0">
                <span className="font-mono text-xl font-black text-[#CE82FF] bg-white border-3 border-[#CE82FF] px-4 py-2 rounded-xl shadow-neo-sm">
                  {highestYieldHour.impactMarks}
                </span>
                <Link
                  href={highestYieldHour.actionLink}
                  className="neo-btn bg-[#CE82FF] text-white flex items-center gap-2 px-5 py-2.5"
                >
                  Start Action <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* EXPECTED GATE SCORE INTERVAL & STATS GRID */}
          <div className="mt-8 grid gap-6 md:grid-cols-12">
            {/* Score Estimator */}
            <div className="md:col-span-6 neo-card bg-card p-8 flex flex-col justify-between">
              <div>
                <p className="font-mono text-xs font-bold tracking-widest text-[#FF9600] uppercase">
                  Expected GATE Score Interval
                </p>
                <div className="mt-4 flex items-baseline gap-4">
                  <span className="font-mono text-5xl font-black text-foreground tracking-tight">
                    {scoreEstimate.low} &ndash;{" "}
                    <span className="text-[#FF9600]">{scoreEstimate.mid}</span> &ndash; {scoreEstimate.high}
                  </span>
                  <span className="font-mono text-sm font-bold text-muted-foreground">/ 100 marks</span>
                </div>
                <p className="mt-3 text-[14px] font-medium text-muted-foreground leading-relaxed">
                  {scoreEstimate.basisReason}
                </p>
              </div>

              <div className="mt-6 border-t-3 border-border pt-4 flex items-center justify-between font-mono text-[13px] font-bold">
                <span className="text-muted-foreground">Estimate Confidence</span>
                <span className="text-[#FF9600] uppercase bg-[#FFF2DE] border-2 border-[#FF9600] px-3 py-1 rounded-md">{scoreEstimate.confidence} Confidence</span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="md:col-span-6 grid grid-cols-2 gap-4">
              {[
                { v: String(filtered.length), l: "attempts", sub: `${attempts.length} total recorded`, color: "bg-[#1CB0F6]", tone: "text-[#1899D6]" },
                { v: `${best.toFixed(1)}%`, l: "best score", sub: "highest percentage", color: "bg-[#58CC02]", tone: "text-[#58CC02]" },
                { v: `${avg.toFixed(1)}%`, l: "average score", sub: "across filtered attempts", color: "bg-[#FF9600]", tone: "text-[#FF9600]" },
                {
                  v: latest ? `${pct(latest).toFixed(1)}%` : "—",
                  l: "latest score",
                  sub: latest ? latest.testTitle : "",
                  color: "bg-[#CE82FF]", tone: "text-[#CE82FF]"
                },
              ].map((s) => (
                <div key={s.l} className="neo-card bg-card p-5 relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 w-12 h-12 ${s.color} rounded-bl-[100px] opacity-20 pointer-events-none`} />
                  <dd className={cn("font-mono text-3xl font-black leading-none tabular-nums", s.tone)}>{s.v}</dd>
                  <dt className="mt-2 font-bold text-[13px] uppercase tracking-wider text-foreground">{s.l}</dt>
                  <p className="mt-1 truncate font-mono text-[11px] font-medium text-muted-foreground">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* MARKS PER HOUR YIELD & TIME BLEED DIAGNOSIS */}
          <div className="mt-10 grid gap-8 lg:grid-cols-12">
            {/* Marks per Hour Yield Table */}
            <div className="lg:col-span-7 neo-card bg-card p-0 overflow-hidden space-y-0">
              <div className="p-5 border-b-3 border-border bg-[#FAFBFF]">
                <h3 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                  Marks-per-Hour Yield Ranking
                </h3>
              </div>
              <div className="overflow-x-auto p-2">
                <table className="w-full min-w-[500px] text-left font-mono text-[13px] font-medium">
                  <thead>
                    <tr className="text-muted-foreground uppercase tracking-widest text-[10px]">
                      <th className="p-3">Subject</th>
                      <th className="p-3 text-right">Hours</th>
                      <th className="p-3 text-right">Scored</th>
                      <th className="p-3 text-right">Yield (M/Hr)</th>
                      <th className="p-3 text-right">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yieldStats.slice(0, 6).map((y, index) => (
                      <tr key={`${y.subject}-${index}`} className="hover:bg-muted/50 rounded-xl transition-colors">
                        <td className="p-3 font-bold text-foreground">{y.subject}</td>
                        <td className="p-3 text-right text-muted-foreground">{y.hoursSpent}h</td>
                        <td className="p-3 text-right text-foreground">{y.marksScored}m</td>
                        <td className="p-3 text-right font-black text-[#58CC02]">{y.actualYield}</td>
                        <td className="p-3 text-right font-bold text-muted-foreground">{y.modelPriority}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Time Bleed & Silly Mistakes */}
            <div className="lg:col-span-5 space-y-6">
              {/* Time Bleed Diagnosis */}
              <div className="neo-card bg-card p-6 space-y-4">
                <h3 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <span className="flex items-center justify-center bg-[#FFF2DE] border-2 border-[#FF9600] rounded-full p-1.5">
                    <ShieldAlert className="size-4 text-[#FF9600]" />
                  </span>
                  Time-Bleed Diagnosis
                </h3>

                {timeBleeds.length > 0 ? (
                  <div className="space-y-3">
                    {timeBleeds.map((tb, index) => (
                      <div key={`${tb.subject}-${index}`} className="border-2 border-[#FF9600] rounded-xl bg-[#FFF2DE] p-4 text-[13px] space-y-1 shadow-neo-sm">
                        <p className="font-bold text-[#B36900]">{tb.subject}</p>
                        <p className="text-[#B36900]/80 font-medium">{tb.recommendation}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] font-medium text-muted-foreground bg-muted p-4 rounded-xl border-2 border-border/50">
                    No severe time bleeds detected. Pacing is optimal across subjects.
                  </p>
                )}
              </div>

              {/* Silly Mistake Index */}
              <div className="neo-card bg-card p-6 space-y-4">
                <h3 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <span className="flex items-center justify-center bg-[#FFE5E5] border-2 border-[#FF4B4B] rounded-full p-1.5">
                    <AlertTriangle className="size-4 text-[#FF4B4B]" />
                  </span>
                  Avoidable Error Bleed
                </h3>

                {sillyStats.length > 0 ? (
                  <div className="space-y-3 font-mono text-[13px] font-bold">
                    {sillyStats.map((s, index) => (
                      <div key={`${s.subject}-${index}`} className="flex items-center justify-between border-2 border-border bg-muted/30 rounded-xl p-3 shadow-neo-sm">
                        <span className="text-foreground">{s.subject}</span>
                        <span className="text-[#FF4B4B]">-{s.marksLost} marks ({s.sillyCount} errors)</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] font-medium text-muted-foreground bg-muted p-4 rounded-xl border-2 border-border/50">
                    Zero calculation/silly errors logged in Mistake Notebook.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* trend */}
      <section className="border-b-3 border-border bg-[#FAFBFF]">
        <div className="mx-auto max-w-[1600px] px-4 py-10 md:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <p className="font-mono text-xs font-bold tracking-widest text-[#1CB0F6] uppercase">01 / score progression</p>
            <div className="ml-auto flex items-center gap-4">
              <label className="flex cursor-pointer items-center gap-2 font-mono text-[11px] font-bold tracking-wide text-muted-foreground hover:text-foreground">
                <input
                  type="checkbox"
                  checked={includeUnverified}
                  onChange={(e) => setIncludeUnverified(e.target.checked)}
                  className="rounded border-border accent-[#1CB0F6] focus:ring-0"
                />
                <span>Include unverified</span>
              </label>
              <label htmlFor="test-filter" className="sr-only">
                Filter by test
              </label>
              <select
                id="test-filter"
                value={testFilter}
                onChange={(e) => setTestFilter(e.target.value)}
                className="border-2 border-border rounded-xl bg-card px-3 py-1.5 font-mono text-[11px] font-bold tracking-wide outline-none transition-colors shadow-neo-sm focus:border-[#1CB0F6]"
              >
                <option value="all">All tests</option>
                {testsWithAttempts.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-8 neo-card bg-card p-6">
            <TrendChart attempts={filtered} />
          </div>
        </div>
      </section>

      {/* subject accuracy across all attempts */}
      <section className="border-b-3 border-border">
        <div className="mx-auto max-w-[1600px] px-4 py-10 md:px-8">
          <p className="font-mono text-xs font-bold tracking-widest text-[#58CC02] uppercase">02 / subject strength</p>
          <p className="mt-3 max-w-2xl text-[14px] font-medium leading-relaxed text-muted-foreground text-pretty">
            Marks captured as a share of marks available, aggregated across every attempt. Weakest first — these are the
            subjects to re-prioritise in the matrix.
          </p>
          <ul className="mt-8 space-y-4">
            {subjectStats.map((s, index) => (
              <li key={`${s.subject}-${index}`} className="flex items-center gap-4 border-2 border-border/50 bg-card rounded-xl p-3 shadow-neo-sm">
                <span className="w-40 shrink-0 truncate text-[14px] font-bold sm:w-56" title={s.subject}>
                  {s.subject}
                </span>
                <span className="relative block h-5 flex-1 bg-foreground/5 rounded-full overflow-hidden border-2 border-border/20" aria-hidden="true">
                  <span
                    className={cn("absolute inset-y-0 left-0", s.yield >= 60 ? "bg-[#58CC02]" : "bg-[#FF4B4B]")}
                    style={{ width: `${Math.max(1, s.yield)}%` }}
                  />
                </span>
                <span className="w-16 shrink-0 text-right font-mono text-[14px] font-black tabular-nums text-foreground">
                  {s.yield.toFixed(0)}%
                </span>
                <span className="hidden w-40 shrink-0 text-right font-mono text-[12px] font-bold tabular-nums text-muted-foreground sm:block">
                  <span className="text-[#58CC02]">{s.correct}R</span> / <span className="text-[#FF4B4B]">{s.wrong}W</span> / {s.skipped}S
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* attempt log */}
      <section className="mx-auto max-w-[1600px] px-4 py-10 md:px-8 bg-[#FAFBFF]">
        <div className="flex flex-wrap items-center gap-4">
          <p className="font-mono text-xs font-bold tracking-widest text-[#FF9600] uppercase">03 / attempt log</p>
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="ml-auto inline-flex items-center gap-2 border-2 border-border rounded-xl bg-card px-4 py-2 font-mono text-xs font-bold tracking-wide text-muted-foreground shadow-neo-sm transition-all hover:-translate-y-0.5 hover:border-[#FF4B4B] hover:text-[#FF4B4B]"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            Clear all history
          </button>
        </div>

        {confirmClear && (
          <div className="mt-6 border-3 border-[#FF4B4B] rounded-2xl bg-[#FFE5E5] p-6 shadow-neo">
            <p className="text-[15px] font-bold leading-relaxed text-[#FF4B4B]">
              Delete all {attempts.length} saved attempts? This cannot be undone.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  clear()
                  setConfirmClear(false)
                }}
                className="neo-btn bg-[#FF4B4B] text-white px-5 py-2 text-sm"
              >
                Delete everything
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="neo-btn bg-white text-foreground px-5 py-2 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 neo-card bg-card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse text-left">
              <thead>
                <tr className="border-b-3 border-border bg-[#FAFBFF]">
                  {["Test", "Submitted", "Score", "%", "R / W / S", "Time", ""].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-5 py-4 font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => {
                  const p = pct(a)
                  return (
                    <tr key={a.id} className="border-b border-border transition-colors last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-4">
                        <Link href={`/results/${a.id}`} className="text-[14px] font-bold transition-colors hover:text-[#1CB0F6]">
                          {a.testTitle}
                        </Link>
                        <p className="mt-1 font-mono text-[11px] font-bold text-muted-foreground">{a.kind}</p>
                      </td>
                      <td className="px-5 py-4 font-mono text-[12px] font-medium text-muted-foreground">
                        {new Date(a.submittedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        <span className="ml-1.5">
                          {new Date(a.submittedAt).toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-[14px] font-black tabular-nums">
                        {a.scored.toFixed(1)}
                        <span className="text-muted-foreground text-[12px] ml-1 font-bold">/{a.totalMarks}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 font-mono text-[14px] font-black tabular-nums border-2 rounded-lg px-2 py-1",
                            p >= 60 ? "text-[#58CC02] border-[#58CC02] bg-[#E5F9D6]" : "text-[#FF4B4B] border-[#FF4B4B] bg-[#FFE5E5]",
                          )}
                        >
                          {p >= 60 ? (
                            <TrendingUp className="size-3.5" aria-hidden="true" />
                          ) : (
                            <TrendingDown className="size-3.5" aria-hidden="true" />
                          )}
                          {p.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-[12px] font-bold tabular-nums text-muted-foreground">
                        <span className="text-[#58CC02]">{a.correct}</span> / <span className="text-[#FF4B4B]">{a.wrong}</span>{" "}
                        / {a.skipped}
                      </td>
                      <td className="px-5 py-4 font-mono text-[12px] font-bold tabular-nums text-muted-foreground">
                        {formatClock(a.durationSeconds)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/results/${a.id}`}
                            className="border-2 border-border rounded-lg bg-white px-3 py-1.5 font-mono text-xs font-bold tracking-wide transition-all shadow-neo-sm hover:-translate-y-0.5 hover:border-[#1CB0F6] hover:text-[#1CB0F6]"
                          >
                            Review
                          </Link>
                          <button
                            type="button"
                            onClick={() => remove(a.id)}
                            aria-label={`Delete attempt from ${new Date(a.submittedAt).toLocaleString()}`}
                            className="border-2 border-border rounded-lg bg-white p-2 text-muted-foreground shadow-neo-sm transition-all hover:-translate-y-0.5 hover:border-[#FF4B4B] hover:text-[#FF4B4B] hover:bg-[#FFE5E5]"
                          >
                            <Trash2 className="size-4" />
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

        <p className="mt-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
          Attempts are stored in this browser only. Clearing site data will remove them.
        </p>
      </section>
    </main>
  )
}
