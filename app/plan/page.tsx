"use client"

/**
 * app/plan/page.tsx — ADAPTIVE PLANNER CONSOLE
 *
 * Adaptive study planner powered by lib/planner/generator.ts.
 * Features:
 *  - Multi-metric readiness meter header with top 3 actionable levers.
 *  - Today's ordered action blocks with 1-click start buttons & completion toggles.
 *  - 7-day weekly timeline with blackout date indicators.
 *  - Manual reflowing without overdue task debt accumulation.
 */

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Calendar,
  Clock,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Zap,
  Lock,
  Sliders,
  ArrowRight,
  ShieldAlert,
} from "lucide-react"
import { useAttempts, useCollection, useSettings, useQuestionBank } from "@/lib/storage/hooks"
import { COLLECTIONS } from "@/lib/storage/store"
import { generateAdaptivePlan, calculateMultiMetricReadiness } from "@/lib/planner/generator"
import type { StudySession, MistakeEntry, SrsCard, PlanBlock, BlockKind } from "@/lib/domain/types"
import { cn } from "@/lib/utils"

export default function PlanPage() {
  const { attempts } = useAttempts()
  const { data: sessions } = useCollection(COLLECTIONS.sessions)
  const { data: mistakes } = useCollection(COLLECTIONS.mistakes)
  const { data: srsCards } = useCollection(COLLECTIONS.srsCards)
  const { data: userBlocks, put: putBlock } = useCollection(COLLECTIONS.planBlocks)
  const { settings } = useSettings()

  const [selectedDateIso, setSelectedDateIso] = useState<string>(
    new Date().toISOString().slice(0, 10)
  )

  // ─── Generate Adaptive Plan ──────────────────────────────────────────────────

  const generatedPlan = useMemo(() => {
    return generateAdaptivePlan(
      attempts,
      sessions as StudySession[],
      mistakes as MistakeEntry[],
      srsCards as SrsCard[],
      settings,
      settings.examDate || "2027-02-07"
    )
  }, [attempts, sessions, mistakes, srsCards, settings])

  const readiness = useMemo(() => {
    return calculateMultiMetricReadiness(
      attempts,
      sessions as StudySession[],
      mistakes as MistakeEntry[],
      srsCards as SrsCard[]
    )
  }, [attempts, sessions, mistakes, srsCards])

  // Merge user-persisted block overrides with generated plan
  const activeDayBlocks = useMemo(() => {
    const defaultBlocks = generatedPlan.weeklyBlocks[selectedDateIso] || []
    return defaultBlocks.map((genBlock) => {
      const userOverride = userBlocks.find((ub) => ub.id === genBlock.id)
      return userOverride ? { ...genBlock, ...userOverride } : genBlock
    })
  }, [generatedPlan, selectedDateIso, userBlocks])

  // Block completion toggle
  const handleToggleBlock = async (block: PlanBlock) => {
    await putBlock({
      ...block,
      completed: !block.completed,
    })
  }

  const kindBadge: Record<BlockKind, { label: string; style: string }> = {
    "new-study": { label: "New Study", style: "border-primary bg-primary/10 text-primary" },
    drill: { label: "Practice Drill", style: "border-blue-500 bg-blue-500/10 text-blue-400" },
    revision: { label: "SRS Revision", style: "border-emerald-500 bg-emerald-500/10 text-emerald-400" },
    mock: { label: "Full Mock", style: "border-amber-500 bg-amber-500/10 text-amber-400 font-bold" },
  }

  return (
    <main className="min-h-dvh bg-background">
      {/* Header & Readiness Section */}
      <header className="border-b border-border bg-card/50 p-6 md:p-8">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
                Adaptive Planner &middot; Zero Overdue Debt
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
                Dynamic Schedule Console
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/settings"
                className="inline-flex items-center gap-2 border border-border bg-background px-3.5 py-2 font-mono text-[11px] text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
              >
                <Sliders className="size-3.5" />
                Availability &amp; Blackouts
              </Link>
            </div>
          </div>

          {/* Macro Phase & Countdown Banner */}
          <div className="border border-border bg-background p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="px-2.5 py-1 bg-primary text-primary-foreground font-semibold uppercase text-[10px] tracking-wider">
                Current Phase
              </span>
              <span className="font-semibold text-foreground">{generatedPlan.phaseName}</span>
            </div>

            <div className="font-mono text-xs text-muted-foreground">
              <strong className="text-primary text-sm font-bold tabular-nums">
                {generatedPlan.daysRemaining}
              </strong>{" "}
              days remaining to target exam
            </div>
          </div>

          {/* Multi-Metric Readiness Meter & Levers */}
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4 border border-border bg-card p-6 flex flex-col justify-between">
              <div>
                <p className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
                  Readiness Score
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-mono text-5xl font-extrabold text-primary tabular-nums">
                    {readiness.score}%
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">multi-factor</span>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4 font-mono text-[10px]">
                  <div>
                    <dt className="text-muted-foreground">Coverage</dt>
                    <dd className="text-foreground font-semibold">{readiness.syllabusCoverage}%</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Mock Avg</dt>
                    <dd className="text-foreground font-semibold">{readiness.mockAverage}%</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">SRS Mastery</dt>
                    <dd className="text-foreground font-semibold">{readiness.srsMasteryPct}%</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Errors Resolved</dt>
                    <dd className="text-foreground font-semibold">{readiness.mistakeResolutionPct}%</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Top 3 Action Levers */}
            <div className="lg:col-span-8 border border-border bg-card p-6 space-y-4">
              <h3 className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
                Top 3 Actionable Levers to Boost Readiness
              </h3>

              <div className="space-y-3">
                {readiness.levers.map((lever, idx) => (
                  <div
                    key={idx}
                    className="flex flex-wrap items-center justify-between gap-3 border border-border bg-background p-3.5 text-xs"
                  >
                    <div>
                      <span className="font-mono text-[10px] text-primary font-bold mr-2">#{idx + 1}</span>
                      <span className="font-medium text-foreground">{lever.label}</span>
                      <span className="block font-mono text-[10px] text-primary mt-0.5">{lever.impact}</span>
                    </div>

                    <Link
                      href={lever.link}
                      className="inline-flex items-center gap-1 border border-border hover:border-primary px-3 py-1 min-h-11 font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors shrink-0"
                    >
                      Execute <ArrowRight className="size-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Schedule & Timeline Body */}
      <div className="mx-auto max-w-[1600px] px-4 py-10 md:px-8 space-y-10">
        {/* 7-Day Timeline Bar */}
        <section aria-labelledby="timeline-heading" className="space-y-4">
          <h2 id="timeline-heading" className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
            7-Day Schedule Overview
          </h2>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-7">
            {Object.keys(generatedPlan.weeklyBlocks).map((isoDate) => {
              const blocks = generatedPlan.weeklyBlocks[isoDate] || []
              const isSelected = isoDate === selectedDateIso
              const isBlackout = settings.weeklyAvailability.blackoutDates.includes(isoDate)
              const dateObj = new Date(isoDate)
              const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" })

              return (
                <button
                  key={isoDate}
                  type="button"
                  onClick={() => setSelectedDateIso(isoDate)}
                  className={cn(
                    "border p-3.5 text-left font-mono transition-colors flex flex-col justify-between h-28 bg-card",
                    isSelected
                      ? "border-primary ring-1 ring-primary"
                      : "border-border hover:border-foreground/40",
                    isBlackout && "bg-amber-500/5 border-amber-500/40"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{dayName}</span>
                      <span>{isoDate.slice(5)}</span>
                    </div>
                    {isBlackout ? (
                      <p className="mt-2 text-[10px] text-amber-500 font-semibold flex items-center gap-1">
                        <ShieldAlert className="size-3" /> Blackout
                      </p>
                    ) : (
                      <p className="mt-2 text-sm font-bold text-foreground">
                        {blocks.length} blocks
                      </p>
                    )}
                  </div>

                  {!isBlackout && (
                    <p className="text-[10px] text-muted-foreground">
                      {blocks.reduce((s, b) => s + b.targetMinutes, 0)}m allocated
                    </p>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* Selected Day Action Blocks */}
        <section aria-labelledby="daily-blocks-heading" className="space-y-4 border border-border p-6 md:p-8 bg-card">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 id="daily-blocks-heading" className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">
                Action Plan for {selectedDateIso}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Each block is sized to your configured availability and reflows without overdue debt.
              </p>
            </div>

            <span className="font-mono text-xs text-primary font-semibold">
              {activeDayBlocks.length} Blocks Assigned
            </span>
          </div>

          {activeDayBlocks.length > 0 ? (
            <div className="space-y-4 pt-2">
              {activeDayBlocks.map((block, idx) => {
                const badge = kindBadge[block.kind]
                return (
                  <div
                    key={block.id}
                    className={cn(
                      "border p-5 transition-all flex flex-wrap items-start justify-between gap-4 bg-background",
                      block.completed ? "border-emerald-500/40 bg-emerald-500/5 opacity-75" : "border-border hover:border-primary/60"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleBlock(block)}
                        className="mt-0.5 text-muted-foreground hover:text-primary transition-colors"
                        title="Toggle block completion"
                      >
                        <CheckCircle2
                          className={cn(
                            "size-5",
                            block.completed ? "text-emerald-500 fill-emerald-500/20" : "text-muted-foreground"
                          )}
                        />
                      </button>

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                          <span className="text-primary font-bold">#{idx + 1}</span>
                          <span className={cn("border px-2 py-0.5 text-[9px] uppercase font-semibold", badge.style)}>
                            {badge.label}
                          </span>
                          <span className="border border-border px-2 py-0.5 text-muted-foreground">
                            {block.targetMinutes} mins
                          </span>
                        </div>

                        <p className="text-sm font-medium text-foreground">{block.reason}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Direct Start Action Button */}
                      <Link
                        href={
                          block.kind === "mock"
                            ? "/tests/mock-full-01"
                            : block.kind === "revision"
                            ? "/revise"
                            : "/tests"
                        }
                        className="inline-flex items-center gap-2 border border-primary bg-primary px-4 py-2 font-mono text-[11px] text-primary-foreground uppercase tracking-wide font-semibold hover:opacity-90 transition-opacity"
                      >
                        <Play className="size-3.5" />
                        Start Block
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="border border-dashed border-border p-12 text-center bg-card/40">
              <Calendar className="size-8 text-muted-foreground mx-auto" />
              <p className="mt-3 font-mono text-xs text-muted-foreground">
                No study blocks assigned for this date (Blackout date or 0 hours allocated).
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
