"use client"

import { useState } from "react"
import { Check, Flag } from "lucide-react"
import { ROADMAP, TOPICS, studyPhase } from "@/lib/gate-data"
import { PhaseTag } from "@/components/indicators"
import { cn } from "@/lib/utils"

const BY_ID = new Map(TOPICS.map((t) => [t.id, t]))

const MONTH_LABELS: Record<number, string> = {
  1: "Month 1 — Phase 1 launch: maths spine, Digital Logic, Data Structures",
  2: "Month 2 — Phase 1 core: OS, COA, Algorithms",
  3: "Month 3 — Phase 1 close-out: DBMS, CN, then into Phase 2",
  4: "Month 4 — Phase 2 hard hitters, then Phase 3/4 sweep",
  5: "Month 5 — Revision cycles and 12+ full-length mocks",
}

export function Roadmap() {
  const [doneWeeks, setDoneWeeks] = useState<Record<number, boolean>>({})
  const months = [1, 2, 3, 4, 5]

  return (
    <section id="roadmap" className="border-t border-border">
      <div className="mx-auto max-w-[1600px] px-4 py-12 md:px-8">
        <header className="max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">03 / 20-week roadmap</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance md:text-3xl">
            Five months at 4&ndash;5 hrs/day &asymp; 600 hours
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
            Budget: ~390 hours theory and note-making, ~210 hours dedicated PYQ practice and mocks. The 50+ questions
            per chapter rule is folded into each week&apos;s allocation &mdash; a week is not closed until its
            checkpoint is met. Phase 1 finishes at week 11, which puts about 78% of the paper&apos;s marks in hand
            before you touch anything hard.
          </p>
        </header>

        <div className="mt-10 space-y-10">
          {months.map((m) => (
            <div key={m}>
              <div className="flex items-center gap-4">
                <h3 className="font-mono text-[11px] tracking-[0.16em] text-primary uppercase">{MONTH_LABELS[m]}</h3>
                <span className="h-px flex-1 bg-border" />
              </div>

              <ol className="mt-4 space-y-px bg-border">
                {ROADMAP.filter((w) => w.month === m).map((w) => {
                  const isDone = !!doneWeeks[w.week]
                  const topics = w.topicIds.map((id) => BY_ID.get(id)!).filter(Boolean)
                  const hours = topics.reduce((s, t) => s + t.hours, 0)
                  return (
                    <li key={w.week} className={cn("bg-card p-4 md:p-5", isDone && "opacity-45")}>
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <button
                            type="button"
                            onClick={() => setDoneWeeks((d) => ({ ...d, [w.week]: !d[w.week] }))}
                            aria-pressed={isDone}
                            aria-label={`Mark week ${w.week} complete`}
                            className={cn(
                              "mt-0.5 flex size-5 shrink-0 items-center justify-center border transition-colors",
                              isDone
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-foreground/25 hover:border-primary",
                            )}
                          >
                            {isDone && <Check className="size-3.5" aria-hidden="true" />}
                          </button>
                          <div>
                            <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                              week {String(w.week).padStart(2, "0")}
                            </p>
                            <h4 className="mt-1 text-base font-medium tracking-tight text-pretty">{w.title}</h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {typeof w.phase === "number" ? (
                            <PhaseTag phase={w.phase} />
                          ) : (
                            <span className="border border-primary/50 bg-primary/12 px-1.5 py-0.5 font-mono text-[10px] tracking-widest text-primary uppercase">
                              {w.phase}
                            </span>
                          )}
                          {hours > 0 && (
                            <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                              {hours}h theory
                            </span>
                          )}
                        </div>
                      </div>

                      {topics.length > 0 && (
                        <ul className="mt-4 flex flex-wrap gap-1.5 md:ml-9">
                          {topics.map((t) => (
                            <li
                              key={t.id}
                              className="flex items-center gap-2 border border-border bg-background px-2 py-1"
                            >
                              <PhaseTag phase={studyPhase(t)} />
                              <span className="text-[12px] leading-tight">{t.topic.split(" — ")[0]}</span>
                              <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                                {t.avgMarks.toFixed(1)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {w.extras && (
                        <ul className="mt-4 space-y-1.5 md:ml-9">
                          {w.extras.map((e) => (
                            <li key={e} className="flex gap-2 text-[12px] leading-relaxed text-muted-foreground">
                              <span className="mt-1.5 size-1 shrink-0 bg-primary" aria-hidden="true" />
                              <span className="text-pretty">{e}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {w.checkpoint && (
                        <p className="mt-4 flex items-start gap-2 border-l-2 border-primary bg-primary/[0.06] px-3 py-2 text-[12px] leading-relaxed md:ml-9">
                          <Flag className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
                          <span className="text-pretty">
                            <span className="font-mono text-[10px] tracking-widest text-primary uppercase">
                              checkpoint{" "}
                            </span>
                            {w.checkpoint}
                          </span>
                        </p>
                      )}
                    </li>
                  )
                })}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
