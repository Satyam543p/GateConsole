"use client"

import { useMemo, useState } from "react"
import { Check, Search } from "lucide-react"
import {
  HIGH_WEIGHT_CUTOFF,
  PHASE_META,
  SUBJECTS,
  TOPICS,
  priorityScore,
  studyPhase,
  type Difficulty,
  type Phase,
  type Topic,
} from "@/lib/gate-data"
import { LevelMeter, PhaseTag, ScoreMeter, TrendTag } from "@/components/indicators"
import { cn } from "@/lib/utils"

type SortKey = "priority" | "marks" | "pyq" | "hours" | "subject"

interface Row extends Topic {
  score: number
  phase: Phase
  rank: number
}

const ROWS: Row[] = TOPICS.map((t) => ({ ...t, score: priorityScore(t), phase: studyPhase(t), rank: 0 }))
  .sort((a, b) => b.score - a.score)
  .map((r, i) => ({ ...r, rank: i + 1 }))

const MAX_SCORE = Math.max(...ROWS.map((r) => r.score))

const PHASES: Phase[] = [1, 2, 3, 4]
const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"]

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "border px-2.5 py-1 font-mono text-[11px] tracking-wide whitespace-nowrap transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-foreground/25 hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}

const TH =
  "sticky top-0 z-10 bg-card px-3 py-2.5 text-left align-bottom font-mono text-[10px] font-medium tracking-widest text-muted-foreground uppercase whitespace-nowrap"
const TD = "px-3 py-3 align-top text-[13px] leading-snug"

export function PriorityMatrix() {
  const [query, setQuery] = useState("")
  const [subject, setSubject] = useState<string | null>(null)
  const [phases, setPhases] = useState<Phase[]>([])
  const [difficulties, setDifficulties] = useState<Difficulty[]>([])
  const [sort, setSort] = useState<SortKey>("priority")
  const [done, setDone] = useState<Record<string, boolean>>({})
  const [hideDone, setHideDone] = useState(false)

  const toggle = <T,>(list: T[], value: T) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = ROWS.filter((r) => {
      if (subject && r.subject !== subject) return false
      if (phases.length && !phases.includes(r.phase)) return false
      if (difficulties.length && !difficulties.includes(r.difficulty)) return false
      if (hideDone && done[r.id]) return false
      if (q && !`${r.subject} ${r.topic} ${r.reference} ${r.prereqs}`.toLowerCase().includes(q)) return false
      return true
    })
    const sorted = [...filtered]
    if (sort === "marks") sorted.sort((a, b) => b.avgMarks - a.avgMarks)
    else if (sort === "pyq") sorted.sort((a, b) => b.pyqCount - a.pyqCount)
    else if (sort === "hours") sorted.sort((a, b) => b.hours - a.hours)
    else if (sort === "subject")
      sorted.sort((a, b) => a.subject.localeCompare(b.subject) || b.score - a.score)
    else sorted.sort((a, b) => b.score - a.score)
    return sorted
  }, [query, subject, phases, difficulties, sort, hideDone, done])

  const isFiltered = !!query || !!subject || phases.length > 0 || difficulties.length > 0 || hideDone

  const clearFilters = () => {
    setQuery("")
    setSubject(null)
    setPhases([])
    setDifficulties([])
    setHideDone(false)
  }

  const doneCount = ROWS.filter((r) => done[r.id]).length
  const doneMarks = ROWS.filter((r) => done[r.id]).reduce((s, r) => s + r.avgMarks, 0)
  const totalMarks = ROWS.reduce((s, r) => s + r.avgMarks, 0)
  const pct = Math.round((doneMarks / totalMarks) * 100)

  return (
    <section id="matrix" className="border-t border-border">
      <div className="mx-auto max-w-[1600px] px-4 py-12 md:px-8">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">02 / priority matrix</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance md:text-3xl">
              {ROWS.length} chapters, ranked by marks per unit of effort
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
              Priority score = average marks per year &divide; difficulty factor (Easy 1.0, Medium 1.45, Hard 1.9),
              scaled &times;10. A chapter counts as high weightage above{" "}
              <span className="font-mono text-foreground">{HIGH_WEIGHT_CUTOFF} marks/yr</span>, which is where the
              distribution splits cleanly. Phase follows directly from those two axes.
            </p>
          </div>

          <div className="w-full max-w-xs">
            <div className="flex items-baseline justify-between font-mono text-[11px] tracking-wide text-muted-foreground">
              <span>syllabus covered</span>
              <span className="text-foreground">
                {doneCount}/{ROWS.length} &middot; {pct}% of marks
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-foreground/10">
              <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 font-mono text-[10px] text-muted-foreground/70">
              Tick-offs are session-only. Ask for a Neon database to persist progress across devices.
            </p>
          </div>
        </header>

        {/* Controls */}
        <div className="mt-8 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search chapter, book, prerequisite…"
                aria-label="Search chapters"
                className="h-9 w-full border border-border bg-card pr-3 pl-9 font-mono text-[12px] text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
              />
            </div>
            <label className="flex h-9 items-center gap-2 border border-border bg-card px-3 font-mono text-[11px] tracking-wide text-muted-foreground">
              sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Sort table"
                className="bg-transparent text-foreground focus:outline-none"
              >
                <option value="priority">priority score</option>
                <option value="marks">avg marks</option>
                <option value="pyq">PYQ count</option>
                <option value="hours">study hours</option>
                <option value="subject">subject</option>
              </select>
            </label>
            <FilterChip active={hideDone} onClick={() => setHideDone(!hideDone)}>
              hide completed
            </FilterChip>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 font-mono text-[10px] tracking-widest text-muted-foreground/70 uppercase">
              phase
            </span>
            {PHASES.map((p) => (
              <FilterChip key={p} active={phases.includes(p)} onClick={() => setPhases(toggle(phases, p))}>
                P{p}
              </FilterChip>
            ))}
            <span className="mx-2 h-4 w-px bg-border" />
            <span className="mr-1 font-mono text-[10px] tracking-widest text-muted-foreground/70 uppercase">
              difficulty
            </span>
            {DIFFICULTIES.map((d) => (
              <FilterChip
                key={d}
                active={difficulties.includes(d)}
                onClick={() => setDifficulties(toggle(difficulties, d))}
              >
                {d.toLowerCase()}
              </FilterChip>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 font-mono text-[10px] tracking-widest text-muted-foreground/70 uppercase">
              subject
            </span>
            <FilterChip active={subject === null} onClick={() => setSubject(null)}>
              all
            </FilterChip>
            {SUBJECTS.map((s) => (
              <FilterChip key={s} active={subject === s} onClick={() => setSubject(s === subject ? null : s)}>
                {s}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* Result count */}
        <p className="mt-6 font-mono text-[11px] tracking-wide text-muted-foreground">
          showing <span className="text-foreground">{rows.length}</span> of {ROWS.length} chapters &middot;{" "}
          <span className="text-foreground">{rows.reduce((s, r) => s + r.avgMarks, 0).toFixed(1)}</span> of{" "}
          {totalMarks.toFixed(1)} marks in view{" "}
          {isFiltered && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-3 border-b border-primary/40 text-primary transition-colors hover:border-primary"
            >
              reset filters
            </button>
          )}
        </p>

        {/* Phase legend — counts follow the active filters */}
        <dl className="mt-4 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {PHASES.map((p) => (
            <div key={p} className="bg-card p-4">
              <dt className="flex items-center gap-2">
                <PhaseTag phase={p} />
                <span className="font-mono text-[11px] tracking-wide text-muted-foreground">
                  {rows.filter((r) => r.phase === p).length} chapters &middot;{" "}
                  {rows.filter((r) => r.phase === p).reduce((s, r) => s + r.avgMarks, 0).toFixed(1)} marks
                </span>
              </dt>
              <dd className="mt-2 text-[12px] leading-relaxed text-muted-foreground text-pretty">
                {PHASE_META[p].blurb}
              </dd>
            </div>
          ))}
        </dl>

        {/* Desktop table */}
        <div className="mt-6 hidden overflow-x-auto border border-border md:block">
          <table className="w-full min-w-[1720px] border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className={cn(TH, "w-10 sticky left-0 z-30 bg-card shadow-[1px_0_0_0_theme(colors.border)]")}>
                  <span className="sr-only">Done</span>
                </th>
                <th scope="col" className={cn(TH, "w-12 sticky left-[40px] z-30 bg-card shadow-[1px_0_0_0_theme(colors.border)]")}>
                  #
                </th>
                <th scope="col" className={cn(TH, "w-[150px] sticky left-[88px] z-30 bg-card shadow-[1px_0_0_0_theme(colors.border)]")}>
                  Subject
                </th>
                <th scope="col" className={cn(TH, "w-[300px] sticky left-[238px] z-30 bg-card shadow-[inset_-1px_0_0_0_theme(colors.border)] shadow-[1px_0_10px_0_rgba(0,0,0,0.5)] border-r border-border")}>
                  Chapter / Topic
                </th>
                <th scope="col" className={cn(TH, "w-[76px] pl-6")}>
                  Avg mks
                  <br />
                  /yr
                </th>
                <th scope="col" className={cn(TH, "w-[70px]")}>
                  Trend
                </th>
                <th scope="col" className={cn(TH, "w-[64px]")}>
                  PYQ
                  <br />
                  10 yr
                </th>
                <th scope="col" className={cn(TH, "w-[110px]")}>
                  Difficulty
                </th>
                <th scope="col" className={cn(TH, "w-[110px]")}>
                  Depth
                </th>
                <th scope="col" className={cn(TH, "w-[120px]")}>
                  Priority
                </th>
                <th scope="col" className={cn(TH, "w-[64px]")}>
                  Phase
                </th>
                <th scope="col" className={cn(TH, "w-[56px]")}>
                  Hrs
                </th>
                <th scope="col" className={cn(TH, "w-[230px]")}>
                  Standard reference
                </th>
                <th scope="col" className={cn(TH, "w-[230px]")}>
                  Practice source (50+ Qs)
                </th>
                <th scope="col" className={cn(TH, "w-[200px]")}>
                  Prerequisites
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const isDone = !!done[r.id]
                return (
                  <tr
                    key={r.id}
                    className={cn(
                      "group border-b border-border/60 transition-colors last:border-0 hover:bg-foreground/[0.03]",
                      isDone && "opacity-45",
                      r.removed && "bg-foreground/[0.015]",
                    )}
                  >
                    <td className={cn(TD, "pr-0 sticky left-0 z-20 bg-card group-hover:bg-muted/40 shadow-[1px_0_0_0_theme(colors.border)]")}>
                      <button
                        type="button"
                        onClick={() => setDone((d) => ({ ...d, [r.id]: !d[r.id] }))}
                        aria-pressed={isDone}
                        aria-label={`Mark ${r.topic} as done`}
                        className={cn(
                          "flex size-4 items-center justify-center border transition-colors",
                          isDone
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-foreground/25 hover:border-primary",
                        )}
                      >
                        {isDone && <Check className="size-3" aria-hidden="true" />}
                      </button>
                    </td>
                    <td className={cn(TD, "font-mono text-[11px] text-muted-foreground tabular-nums sticky left-[40px] z-20 bg-card group-hover:bg-muted/40 shadow-[1px_0_0_0_theme(colors.border)]")}>
                      {r.removed ? "—" : String(r.rank).padStart(2, "0")}
                    </td>
                    <td className={cn(TD, "text-[12px] text-muted-foreground sticky left-[88px] z-20 bg-card group-hover:bg-muted/40 shadow-[1px_0_0_0_theme(colors.border)]")}>{r.subject}</td>
                    <td className={cn(TD, "font-medium text-foreground text-pretty sticky left-[238px] z-20 bg-card group-hover:bg-muted/40 shadow-[inset_-1px_0_0_0_theme(colors.border)] shadow-[1px_0_10px_0_rgba(0,0,0,0.5)] border-r border-border")}>
                      {r.topic}
                      {r.note && <span className="mt-1 block text-[11px] font-normal text-primary/80">{r.note}</span>}
                    </td>
                    <td className={cn(TD, "font-mono text-sm tabular-nums pl-6")}>{r.avgMarks.toFixed(1)}</td>
                    <td className={TD}>
                      <TrendTag trend={r.trend} />
                    </td>
                    <td className={cn(TD, "font-mono text-sm text-muted-foreground tabular-nums")}>{r.pyqCount}</td>
                    <td className={TD}>
                      <LevelMeter level={r.difficulty} label="Difficulty" />
                    </td>
                    <td className={TD}>
                      <LevelMeter level={r.depth} label="Conceptual depth" />
                    </td>
                    <td className={TD}>
                      <ScoreMeter score={r.score} max={MAX_SCORE} />
                    </td>
                    <td className={TD}>
                      <PhaseTag phase={r.phase} />
                    </td>
                    <td className={cn(TD, "font-mono text-sm tabular-nums")}>{r.hours || "—"}</td>
                    <td className={cn(TD, "text-[12px] text-muted-foreground text-pretty")}>{r.reference}</td>
                    <td className={cn(TD, "text-[12px] text-muted-foreground text-pretty")}>{r.practice}</td>
                    <td className={cn(TD, "text-[12px] text-muted-foreground text-pretty")}>{r.prereqs}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <ul className="mt-6 space-y-px bg-border md:hidden">
          {rows.map((r) => {
            const isDone = !!done[r.id]
            return (
              <li key={r.id} className={cn("bg-card p-4", isDone && "opacity-45")}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                      {r.removed ? "—" : `#${String(r.rank).padStart(2, "0")}`} &middot; {r.subject}
                    </p>
                    <h3 className="mt-1 text-sm font-medium text-pretty">{r.topic}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDone((d) => ({ ...d, [r.id]: !d[r.id] }))}
                    aria-pressed={isDone}
                    aria-label={`Mark ${r.topic} as done`}
                    className={cn(
                      "mt-1 flex size-5 shrink-0 items-center justify-center border",
                      isDone ? "border-primary bg-primary text-primary-foreground" : "border-foreground/25",
                    )}
                  >
                    {isDone && <Check className="size-3.5" aria-hidden="true" />}
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <PhaseTag phase={r.phase} />
                  <ScoreMeter score={r.score} max={MAX_SCORE} />
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {r.avgMarks.toFixed(1)} mks/yr &middot; {r.pyqCount} PYQs &middot; {r.hours}h
                  </span>
                  <TrendTag trend={r.trend} />
                  <LevelMeter level={r.difficulty} label="Difficulty" />
                  <LevelMeter level={r.depth} label="Conceptual depth" />
                </div>
                <dl className="mt-3 space-y-1.5 text-[12px] leading-relaxed">
                  <div>
                    <dt className="inline font-mono text-[10px] tracking-widest text-muted-foreground/70 uppercase">
                      ref{" "}
                    </dt>
                    <dd className="inline text-muted-foreground">{r.reference}</dd>
                  </div>
                  <div>
                    <dt className="inline font-mono text-[10px] tracking-widest text-muted-foreground/70 uppercase">
                      practice{" "}
                    </dt>
                    <dd className="inline text-muted-foreground">{r.practice}</dd>
                  </div>
                  <div>
                    <dt className="inline font-mono text-[10px] tracking-widest text-muted-foreground/70 uppercase">
                      prereq{" "}
                    </dt>
                    <dd className="inline text-muted-foreground">{r.prereqs}</dd>
                  </div>
                </dl>
              </li>
            )
          })}
        </ul>

        {rows.length === 0 && (
          <p className="mt-6 border border-dashed border-border p-8 text-center font-mono text-[12px] text-muted-foreground">
            No chapters match those filters.
          </p>
        )}
      </div>
    </section>
  )
}
