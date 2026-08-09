import { SUBJECT_WEIGHTAGE, TOPICS, priorityScore, studyPhase } from "@/lib/gate-data"
import { cn } from "@/lib/utils"

const MAX = Math.max(...SUBJECT_WEIGHTAGE.map((s) => s.marks))

export function SubjectWeightage() {
  return (
    <section id="weightage" className="border-t border-border">
      <div className="mx-auto max-w-[1600px] px-4 py-12 md:px-8">
        <header className="max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">01 / where the marks are</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance md:text-3xl">
            Subject-wise weightage, GATE 2014&ndash;2025 average
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
            Out of 100 marks: General Aptitude is a fixed 15, the CS core is 85. Four subjects &mdash; Programming
            &amp; Data Structures, the two maths blocks, and Operating Systems &mdash; account for roughly 37 of the 85
            core marks. Compiler Design averages 4.5 and is the only core subject worth deprioritising.
          </p>
        </header>

        <ol className="mt-8 space-y-px bg-border">
          {SUBJECT_WEIGHTAGE.map((s) => {
            const chapters = TOPICS.filter((t) => t.subject === s.subject)
            const topPick = [...chapters].sort((a, b) => priorityScore(b) - priorityScore(a))[0]
            const phase1 = chapters.filter((t) => studyPhase(t) === 1).length
            return (
              <li key={s.subject} className="bg-card px-4 py-3.5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-lg tabular-nums text-primary">{s.marks.toFixed(1)}</span>
                  <h3 className="text-sm font-medium">{s.subject}</h3>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {chapters.length} chapters &middot; {phase1} in Phase 1
                  </span>
                </div>
                <div className="mt-2 h-1 w-full bg-foreground/10" aria-hidden="true">
                  <div
                    className={cn("h-full", s.marks === 0 ? "bg-transparent" : "bg-primary")}
                    style={{ width: `${(s.marks / MAX) * 100}%` }}
                  />
                </div>
                <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground text-pretty">
                  {s.note}
                  {topPick && !topPick.removed && (
                    <>
                      {" · start with: "}
                      <span className="text-foreground">{topPick.topic.split(" — ")[0].split(",")[0]}</span>
                    </>
                  )}
                </p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
