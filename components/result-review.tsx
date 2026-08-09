"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Check, ChevronLeft, Clock, Flag, Minus, RotateCcw, X, Tag, MessageSquare, CheckCircle2 } from "lucide-react"
import { type QuestionOutcome, type StoredAttempt, formatClock, scoreAttempt } from "@/lib/test-types"
import { getAttempt } from "@/lib/use-attempts"
import { useQuestionBank, useCollection } from "@/lib/storage/hooks"
import { getStore, COLLECTIONS } from "@/lib/storage/store"
import type { MistakeCause, MistakeEntry } from "@/lib/domain/types"
import { LOCAL_USER_ID, GATE_CSE_EXAM_ID } from "@/lib/domain/types"
import { cn } from "@/lib/utils"

type OutcomeFilter = "all" | "correct" | "wrong" | "skipped" | "flagged"

export const MISTAKE_CAUSES: { key: string; value: MistakeCause; label: string }[] = [
  { key: "1", value: "conceptual", label: "Conceptual gap" },
  { key: "2", value: "formula-forgotten", label: "Formula forgotten" },
  { key: "3", value: "calculation", label: "Calculation error" },
  { key: "4", value: "misread", label: "Misread stem" },
  { key: "5", value: "silly", label: "Silly mistake" },
  { key: "6", value: "time-pressure", label: "Time pressure" },
  { key: "7", value: "guessed-wrong", label: "Guessed wrong" },
  { key: "8", value: "knew-but-blanked", label: "Knew but blanked" },
]

function answerLabel(o: QuestionOutcome): string {
  const { question: q, response: r } = o
  if (q.type === "NAT") {
    return r === null || r === "" ? "—" : String(r)
  }
  if (q.type === "MSQ") {
    if (!Array.isArray(r) || r.length === 0) return "—"
    return r.map((i) => String.fromCharCode(65 + i)).join(", ")
  }
  return typeof r === "number" ? String.fromCharCode(65 + r) : "—"
}

function correctLabel(o: QuestionOutcome): string {
  const { question: q } = o
  if (q.type === "NAT") {
    if (typeof q.answer === "object" && !Array.isArray(q.answer)) return `${q.answer.min} to ${q.answer.max}`
    return String(q.answer)
  }
  if (Array.isArray(q.answer)) return q.answer.map((i) => String.fromCharCode(65 + i)).join(", ")
  return typeof q.answer === "number" ? String.fromCharCode(65 + q.answer) : "—"
}

export function ResultReview({ attemptId }: { attemptId: string }) {
  const [attempt, setAttempt] = useState<StoredAttempt | null>(null)
  const [attemptReady, setAttemptReady] = useState(false)
  const { questionMap, loading: bankLoading } = useQuestionBank()
  const { data: mistakesList, put: putMistake } = useCollection(COLLECTIONS.mistakes)
  const [filter, setFilter] = useState<OutcomeFilter>("all")
  const [open, setOpen] = useState<Record<string, boolean>>({})

  const handleTagCause = async (qid: string, cause: MistakeCause) => {
    const existing = mistakesList.find((m) => m.questionId === qid)
    if (existing) {
      await putMistake({ ...existing, cause })
    } else {
      await putMistake({
        userId: LOCAL_USER_ID,
        examId: GATE_CSE_EXAM_ID,
        id: `mistake-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        questionId: qid,
        attemptId,
        cause,
        resolved: false,
        createdAt: new Date().toISOString(),
        correctAfter: [],
      })
    }
  }

  const handleUpdateNote = async (qid: string, note: string) => {
    const existing = mistakesList.find((m) => m.questionId === qid)
    if (existing) {
      await putMistake({ ...existing, note })
    }
  }

  const handleToggleResolved = async (qid: string) => {
    const existing = mistakesList.find((m) => m.questionId === qid)
    if (existing) {
      await putMistake({ ...existing, resolved: !existing.resolved })
    }
  }

  useEffect(() => {
    getAttempt(attemptId).then((a) => {
      setAttempt(a)
      setAttemptReady(true)
    })
  }, [attemptId])

  if (!attemptReady || bankLoading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 md:px-8">
        <p className="font-mono text-[11px] text-muted-foreground">Loading attempt and question bank…</p>
      </main>
    )
  }

  if (!attempt) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 md:px-8">
        <h1 className="text-2xl font-semibold tracking-tight">Attempt not found</h1>
        <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground text-pretty">
          Results are stored in this browser only. This attempt may have been recorded in a different browser, or the
          saved history was cleared.
        </p>
        <Link
          href="/tests"
          className="mt-6 inline-flex items-center gap-1.5 border border-primary bg-primary px-4 py-2 font-mono text-[11px] tracking-wide text-primary-foreground"
        >
          Back to test centre
        </Link>
      </main>
    )
  }

  // Replay the exact question list that was served, in order.
  const finalQuestions = (attempt.questionIds ?? [])
    .map((id) => questionMap.get(id))
    .filter((q): q is NonNullable<typeof q> => Boolean(q))

  const scoredResult = scoreAttempt(finalQuestions, attempt.responses, attempt.timePerQuestion)
  const markedSet = new Set(attempt.markedForReview)

  const outcomes = scoredResult.outcomes.filter((o) => {
    if (filter === "correct") return o.correct
    if (filter === "wrong") return o.attempted && !o.correct
    if (filter === "skipped") return !o.attempted
    if (filter === "flagged") return markedSet.has(o.question.id)
    return true
  })

  const maxSubjectMarks = Math.max(...scoredResult.bySubject.map((s) => s.total), 1)
  const weakest = [...scoredResult.bySubject]
    .filter((s) => s.count > 0)
    .sort((a, b) => a.scored / a.total - b.scored / b.total)
    .slice(0, 3)

  const avgSeconds =
    finalQuestions.length > 0 ? attempt.durationSeconds / finalQuestions.length : 0

  return (
    <main className="min-h-screen relative z-10 bg-background pb-12">
      <section className="relative overflow-hidden border-b-3 border-border">
        <div className="grid-lines absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1600px] px-4 py-10 md:px-8 md:py-14">
          <Link
            href="/progress"
            className="inline-flex items-center gap-1.5 font-bold text-sm text-foreground hover:text-primary transition-colors border-2 border-transparent hover:border-border rounded-xl px-2 py-1"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            All attempts
          </Link>

          <p className="mt-8 font-mono text-xs tracking-widest text-primary font-bold uppercase">Result</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance md:text-5xl">{attempt.testTitle}</h1>
          <p className="mt-3 font-mono text-[11px] text-muted-foreground">
            submitted{" "}
            {new Date(attempt.submittedAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}{" "}
            · {formatClock(attempt.durationSeconds)} spent · {avgSeconds.toFixed(0)}s avg per question
          </p>

          {/* headline score */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="neo-card bg-card p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#1CB0F6] rounded-bl-[100px] opacity-20 pointer-events-none" />
              <dd className="font-mono text-5xl font-black leading-none tabular-nums text-[#1899D6]">
                {scoredResult.scored.toFixed(2)}
              </dd>
              <dt className="mt-3 font-bold text-sm uppercase tracking-wider text-muted-foreground">of {scoredResult.totalMarks} marks</dt>
              <p className="mt-1 font-mono text-xs font-bold text-foreground">
                {scoredResult.percentage.toFixed(1)}% score
              </p>
            </div>
            {[
              { v: scoredResult.correct, l: "correct", color: "bg-[#58CC02]", tone: "text-[#58CC02]" },
              { v: scoredResult.wrong, l: "wrong", color: "bg-[#FF4B4B]", tone: "text-[#FF4B4B]" },
              { v: scoredResult.skipped, l: "skipped", color: "bg-muted-foreground", tone: "text-muted-foreground" },
              { v: `${scoredResult.accuracy.toFixed(0)}%`, l: "accuracy on attempted", color: "bg-[#CE82FF]", tone: "text-foreground" },
            ].map((s) => (
              <div key={s.l} className="neo-card bg-card p-6 relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-16 h-16 ${s.color} rounded-bl-[100px] opacity-20 pointer-events-none`} />
                <dd className={cn("font-mono text-5xl font-black leading-none tabular-nums", s.tone)}>{s.v}</dd>
                <dt className="mt-3 font-bold text-sm uppercase tracking-wider text-muted-foreground">{s.l}</dt>
              </div>
            ))}
          </div>

          {/* negative marking note */}
          {scoredResult.wrong > 0 && (
            <p className="mt-4 max-w-3xl border-l-2 border-destructive/60 pl-4 text-[13px] leading-relaxed text-muted-foreground text-pretty">
              Negative marking cost you{" "}
              <span className="text-destructive">
                {scoredResult.outcomes
                  .filter((o) => o.attempted && !o.correct)
                  .reduce((s, o) => s + Math.abs(Math.min(0, o.score)), 0)
                  .toFixed(2)}
              </span>{" "}
              marks across {scoredResult.wrong} wrong answer{scoredResult.wrong === 1 ? "" : "s"}. Only MCQs carry a
              penalty — leaving a genuinely unknown MCQ blank is often the higher-expected-value play.
            </p>
          )}
        </div>
      </section>

      {/* subject breakdown */}
      <section className="border-b-3 border-border bg-[#FAFBFF]">
        <div className="mx-auto max-w-[1600px] px-4 py-10 md:px-8">
          <p className="font-mono text-xs font-bold tracking-widest text-primary uppercase">01 / subject breakdown</p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <ul className="space-y-2.5">
              {scoredResult.bySubject.map((s) => {
                const pct = s.total > 0 ? (Math.max(0, s.scored) / s.total) * 100 : 0
                return (
                  <li key={s.subject} className="flex items-center gap-3">
                    <span className="w-40 shrink-0 truncate text-[13px] sm:w-56" title={s.subject}>
                      {s.subject}
                    </span>
                    <span
                      className="relative block h-5 flex-1 bg-foreground/5 rounded-full overflow-hidden border-2 border-border/20"
                      style={{ maxWidth: `${(s.total / maxSubjectMarks) * 100}%` }}
                      aria-hidden="true"
                    >
                      <span
                        className={cn("absolute inset-y-0 left-0", pct >= 60 ? "bg-[#58CC02]" : "bg-[#FF4B4B]")}
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="w-24 shrink-0 text-right font-mono text-[12px] font-bold tabular-nums text-muted-foreground">
                      {s.scored.toFixed(1)}/{s.total}
                    </span>
                    <span className="hidden w-14 shrink-0 text-right font-mono text-[12px] font-bold tabular-nums text-muted-foreground sm:block">
                      {s.accuracy.toFixed(0)}%
                    </span>
                  </li>
                )
              })}
            </ul>

            <div className="neo-card bg-card p-6 self-start">
              <h2 className="font-mono text-xs font-bold tracking-widest text-[#FF9600] uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF9600]" /> What to fix first
              </h2>
              {weakest.length > 0 ? (
                <ol className="mt-5 space-y-4">
                  {weakest.map((s, i) => (
                    <li key={s.subject} className="flex gap-4 items-start">
                      <span className="flex items-center justify-center size-6 bg-[#FFE5E5] text-[#FF4B4B] font-mono text-xs font-bold border-2 border-[#FF4B4B] rounded-full shrink-0">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-foreground">{s.subject}</p>
                        <p className="mt-1 font-mono text-xs text-muted-foreground leading-relaxed">
                          {s.scored.toFixed(1)}/{s.total} marks · <span className="text-[#58CC02] font-semibold">{s.correct}R</span> / <span className="text-[#FF4B4B] font-semibold">{s.wrong}W</span> / {s.skipped}S
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-5 text-[14px] font-medium text-muted-foreground">No subject data for this attempt.</p>
              )}
              <Link
                href="/"
                className="mt-6 neo-btn bg-background text-foreground text-center block w-full py-2 px-4 text-sm hover:text-primary hover:border-primary"
              >
                Open priority matrix
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* per-question review */}
      <section className="mx-auto max-w-[1600px] px-4 py-10 md:px-8">
        <div className="flex flex-wrap items-center gap-4">
          <p className="font-mono text-xs font-bold tracking-widest text-primary uppercase">02 / question review</p>
          <div className="ml-auto flex flex-wrap gap-2">
            {(
              [
                ["all", `All ${scoredResult.outcomes.length}`],
                ["wrong", `Wrong ${scoredResult.wrong}`],
                ["skipped", `Skipped ${scoredResult.skipped}`],
                ["correct", `Correct ${scoredResult.correct}`],
                ["flagged", `Flagged ${markedSet.size}`],
              ] as [OutcomeFilter, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                aria-pressed={filter === value}
                className={cn(
                  "border-2 rounded-xl px-3 py-1.5 font-mono text-xs font-bold tracking-wide transition-colors shadow-neo-sm hover:-translate-y-0.5 active:translate-y-0 active:shadow-none",
                  filter === value
                    ? "border-[#1CB0F6] bg-[#1CB0F6] text-white"
                    : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-[#F3F4F6]",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <ol className="mt-8 space-y-6">
          {outcomes.map((o) => {
            const q = o.question
            const expanded = open[q.id] ?? filter !== "all"
            const pace = q.expectedSeconds ? o.seconds / q.expectedSeconds : null
            return (
              <li key={q.id} className="neo-card bg-card overflow-hidden">
                <div className="flex flex-wrap items-center gap-3 border-b-3 border-border px-5 py-4 bg-[#FAFBFF]">
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center border-2 rounded-full",
                      o.correct
                        ? "border-[#58CC02] bg-[#58CC02] text-white"
                        : o.attempted
                          ? "border-[#FF4B4B] bg-[#FF4B4B] text-white"
                          : "border-border bg-white text-muted-foreground shadow-neo-sm",
                    )}
                    aria-hidden="true"
                  >
                    {o.correct ? (
                      <Check className="size-4" strokeWidth={3} />
                    ) : o.attempted ? (
                      <X className="size-4" strokeWidth={3} />
                    ) : (
                      <Minus className="size-4" strokeWidth={3} />
                    )}
                  </span>

                  <span className="border-2 border-border bg-white rounded-md px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest uppercase text-foreground">
                    {q.type}
                  </span>
                  <span className="truncate font-mono text-[12px] font-bold text-muted-foreground ml-2">
                    {q.subject}
                    {q.topic ? ` · ${q.topic}` : ""}
                  </span>
                  {markedSet.has(q.id) && (
                    <Flag className="size-4 shrink-0 text-[#CE82FF] fill-[#CE82FF]" aria-label="Flagged during exam" />
                  )}

                  <span className="ml-auto flex shrink-0 items-center gap-4 font-mono text-[12px] font-bold tabular-nums">
                    <span className="flex items-center gap-1.5 text-muted-foreground bg-white border-2 border-border px-2 py-1 rounded-md shadow-neo-sm">
                      <Clock className="size-3.5" aria-hidden="true" />
                      {formatClock(o.seconds)}
                      {pace !== null && pace > 1.5 && <span className="text-[#FF4B4B] ml-1">slow</span>}
                    </span>
                    <span className={cn("text-lg", o.score > 0 ? "text-[#58CC02]" : o.score < 0 ? "text-[#FF4B4B]" : "text-muted-foreground")}>
                      {o.score > 0 ? "+" : ""}
                      {o.score.toFixed(2)}
                    </span>
                  </span>
                </div>

                <div className="px-5 py-6">
                  <p className="text-[16px] font-medium leading-relaxed text-pretty">{q.text}</p>
                  {q.code && (
                    <pre className="mt-4 overflow-x-auto border-3 border-border rounded-xl bg-[#1F2937] p-5 font-mono text-[11px] sm:text-[13px] leading-relaxed text-white shadow-neo-sm custom-scrollbar">
                      {q.code}
                    </pre>
                  )}

                  <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs font-bold">
                    <div className="flex flex-col gap-1">
                      <dt className="text-muted-foreground tracking-widest uppercase text-[10px]">your answer</dt>
                      <dd className={cn("text-lg", o.correct ? "text-[#58CC02]" : o.attempted ? "text-[#FF4B4B]" : "text-muted-foreground")}>
                        {answerLabel(o)}
                      </dd>
                    </div>
                    <div className="flex flex-col gap-1">
                      <dt className="text-muted-foreground tracking-widest uppercase text-[10px]">correct</dt>
                      <dd className="text-lg text-[#1899D6]">{correctLabel(o)}</dd>
                    </div>
                  </dl>

                  {q.options && (
                    <ul className="mt-6 space-y-2.5">
                      {q.options.map((opt, i) => {
                        const isRight = Array.isArray(q.answer) ? q.answer.includes(i) : q.answer === i
                        const chose = Array.isArray(o.response) ? o.response.includes(i) : o.response === i
                        return (
                          <li
                            key={i}
                            className={cn(
                              "flex items-start gap-3 border-3 rounded-xl px-4 py-3 text-[14px] font-medium leading-relaxed shadow-neo-sm",
                              isRight
                                ? "border-[#58CC02] bg-[#E5F9D6] text-foreground"
                                : chose
                                  ? "border-[#FF4B4B] bg-[#FFE5E5] text-foreground"
                                  : "border-border bg-white text-muted-foreground",
                            )}
                          >
                            <span className="mt-0.5 font-mono text-[11px] font-bold text-muted-foreground border-2 border-muted-foreground/30 rounded-md px-1.5 py-0.5">
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className="flex-1 text-pretty ml-1">{opt}</span>
                            {isRight && <Check className="mt-1 size-4 shrink-0 text-[#58CC02]" strokeWidth={3} aria-label="Correct option" />}
                            {chose && !isRight && (
                              <X className="mt-1 size-4 shrink-0 text-[#FF4B4B]" strokeWidth={3} aria-label="Your incorrect choice" />
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  )}

                  {q.explanation && (
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => setOpen((s) => ({ ...s, [q.id]: !expanded }))}
                        aria-expanded={expanded}
                        className="neo-btn bg-background px-4 py-2 font-bold text-xs text-foreground"
                      >
                        {expanded ? "Hide solution" : "Show solution"}
                      </button>
                      {expanded && (
                        <div className="mt-4 border-3 border-[#1CB0F6] bg-[#DDF4FF] p-5 rounded-xl shadow-neo-sm relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-[#1899D6] rounded-bl-[100px] opacity-10 pointer-events-none" />
                          <h4 className="font-mono text-[11px] font-bold tracking-widest text-[#1899D6] uppercase mb-2">Explanation</h4>
                          <p className="text-[15px] font-medium leading-relaxed text-foreground text-pretty">
                            {q.explanation}
                          </p>
                          {q.source && (
                            <p className="mt-3 font-mono text-[10px] font-bold text-[#1899D6] opacity-80">source: {q.source}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mistake Notebook Tagging Card */}
                  {(!o.correct || mistakesList.some((m) => m.questionId === q.id)) && (
                    <div className="mt-8 border-t-3 border-border pt-6 space-y-5">
                      <div className="flex items-center justify-between font-mono text-[11px] font-bold text-foreground uppercase tracking-wider">
                        <span className="flex items-center gap-2">
                          <Tag className="size-4 text-[#CE82FF]" aria-hidden="true" />
                          Mistake Notebook Entry
                        </span>
                        {mistakesList.find((m) => m.questionId === q.id) && (
                          <button
                            type="button"
                            onClick={() => handleToggleResolved(q.id)}
                            className={cn(
                              "px-3 py-1 border-2 text-[10px] uppercase font-bold transition-all shadow-neo-sm rounded-md",
                              mistakesList.find((m) => m.questionId === q.id)?.resolved
                                ? "border-[#58CC02] bg-[#E5F9D6] text-[#58CC02]"
                                : "border-border bg-white text-muted-foreground hover:-translate-y-0.5"
                            )}
                          >
                            {mistakesList.find((m) => m.questionId === q.id)?.resolved ? "Resolved" : "Unresolved"}
                          </button>
                        )}
                      </div>

                      {/* Cause Tag Selector */}
                      <div>
                        <p className="font-mono text-[11px] font-bold text-muted-foreground mb-3">Tag Cause of Error:</p>
                        <div className="flex flex-wrap gap-2">
                          {MISTAKE_CAUSES.map((c) => {
                            const existingM = mistakesList.find((m) => m.questionId === q.id)
                            const isSelected = existingM?.cause === c.value
                            return (
                              <button
                                key={c.value}
                                type="button"
                                onClick={() => handleTagCause(q.id, c.value)}
                                className={cn(
                                  "border-2 px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-neo-sm hover:-translate-y-0.5",
                                  isSelected
                                    ? "border-[#FF9600] bg-[#FFF2DE] text-[#B36900]"
                                    : "border-border bg-white text-muted-foreground"
                                )}
                              >
                                <span className="opacity-60">[{c.key}]</span>
                                <span>{c.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Note Input */}
                      <div>
                        <input
                          type="text"
                          defaultValue={mistakesList.find((m) => m.questionId === q.id)?.note || ""}
                          onBlur={(e) => handleUpdateNote(q.id, e.target.value)}
                          placeholder="Add a personal reflection note for this mistake..."
                          className="w-full border-3 rounded-xl border-border shadow-neo-sm bg-background px-4 py-3 font-mono text-[13px] font-bold text-foreground placeholder:text-muted-foreground focus:border-[#1CB0F6] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ol>

        {outcomes.length === 0 && (
          <p className="mt-8 border-3 border-dashed border-border rounded-xl bg-card/50 p-12 text-center font-mono text-sm font-bold text-muted-foreground">
            No questions match this filter.
          </p>
        )}

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href={`/tests/${attempt.testId}`}
            className="neo-btn bg-primary px-6 py-3 font-bold text-sm text-primary-foreground flex items-center gap-2"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Retake this test
          </Link>
          <Link
            href="/tests"
            className="neo-btn bg-card px-6 py-3 font-bold text-sm hover:text-primary hover:border-primary"
          >
            Test centre
          </Link>
          <Link
            href="/progress"
            className="neo-btn bg-card px-6 py-3 font-bold text-sm hover:text-primary hover:border-primary"
          >
            Attempt history
          </Link>
        </div>
      </section>
    </main>
  )
}
