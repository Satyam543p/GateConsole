import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react"
import type { Depth, Difficulty, Phase, Trend } from "@/lib/gate-data"
import { cn } from "@/lib/utils"

const PHASE_STYLES: Record<Phase, string> = {
  1: "bg-primary text-primary-foreground border-primary",
  2: "bg-primary/12 text-primary border-primary/50",
  3: "bg-secondary text-secondary-foreground border-border",
  4: "bg-transparent text-muted-foreground border-border border-dashed",
}

export function PhaseTag({ phase, className }: { phase: Phase; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-1.5 py-0.5 font-mono text-[10px] leading-none tracking-widest uppercase",
        PHASE_STYLES[phase],
        className,
      )}
    >
      P{phase}
    </span>
  )
}

export function TrendTag({ trend }: { trend: Trend }) {
  const Icon = trend === "Increasing" ? ArrowUpRight : trend === "Decreasing" ? ArrowDownRight : ArrowRight
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-mono text-[11px] tracking-wide",
        trend === "Increasing" ? "text-primary" : "text-muted-foreground",
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden="true" />
      {trend === "Increasing" ? "up" : trend === "Decreasing" ? "down" : "flat"}
    </span>
  )
}

const LEVELS: Record<Difficulty | Depth, number> = {
  Easy: 1,
  Low: 1,
  Medium: 2,
  Hard: 3,
  High: 3,
}

export function LevelMeter({ level, label }: { level: Difficulty | Depth; label: string }) {
  const filled = LEVELS[level]
  return (
    <span className="inline-flex items-center gap-1.5" title={`${label}: ${level}`}>
      <span className="flex items-end gap-0.5" aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "w-1 rounded-[1px]",
              i === 1 ? "h-1.5" : i === 2 ? "h-2.5" : "h-3.5",
              i <= filled ? (filled === 3 ? "bg-primary" : "bg-foreground/70") : "bg-foreground/15",
            )}
          />
        ))}
      </span>
      <span className="font-mono text-[11px] text-muted-foreground">{level}</span>
      <span className="sr-only">
        {label}: {level}
      </span>
    </span>
  )
}

export function ScoreMeter({ score, max }: { score: number; max: number }) {
  const pct = max > 0 ? Math.max(2, Math.round((score / max) * 100)) : 0
  return (
    <div className="flex items-center gap-2">
      <span className="w-10 shrink-0 font-mono text-sm tabular-nums text-foreground">{score.toFixed(1)}</span>
      <span className="relative block h-1.5 w-16 shrink-0 bg-foreground/10" aria-hidden="true">
        <span className="absolute inset-y-0 left-0 bg-primary" style={{ width: `${pct}%` }} />
      </span>
    </div>
  )
}
