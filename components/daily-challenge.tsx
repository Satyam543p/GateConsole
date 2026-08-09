"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import Latex from "react-latex-next"
import { ArrowRight, Check, ChevronLeft, Flame, RefreshCw, X } from "lucide-react"

import { isAttempted } from "@/lib/test-types"
import type { Response } from "@/lib/test-types"
import { useDailyChallenge } from "@/lib/storage/hooks"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function DailyChallenge() {
  const { record, question, streak, loading, submit, reroll } = useDailyChallenge()
  const [response, setResponse] = useState<Response>(null)
  const [natDraft, setNatDraft] = useState("")
  const [outcome, setOutcome] = useState<{ correct: boolean; streak: number } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Effect-synced so the statically-prerendered HTML never mismatches (timezone/locale).
  const [todayLabel, setTodayLabel] = useState("")
  useEffect(() => {
    setTodayLabel(new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" }))
  }, [])

  // Reset local answer state whenever the day's question changes (seed / re-roll).
  useEffect(() => {
    setResponse(null)
    setNatDraft("")
    setOutcome(null)
  }, [record?.questionId])

  const answered = record?.solved === true
  const showFeedback = answered || outcome !== null
  const shownOutcome =
    outcome ?? (record ? { correct: record.correct === true, streak: record.streak } : null)

  const handleSubmit = async () => {
    if (!isAttempted(response) || submitting) return
    setSubmitting(true)
    const res = await submit(response)
    setOutcome(res)
    setSubmitting(false)
  }

  const toggleMsq = (optIndex: number) => {
    const arr = Array.isArray(response) ? response : []
    setResponse(arr.includes(optIndex) ? arr.filter((i) => i !== optIndex) : [...arr, optIndex].sort((a, b) => a - b))
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#FAFBFF] font-mono text-[11px] text-muted-foreground">
        Loading challenge…
      </div>
    )
  }

  if (!question) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center bg-[#FAFBFF] px-4 text-center">
        <p className="font-heading font-black text-[24px] uppercase text-primary-text">No challenge available</p>
        <p className="mt-3 max-w-md text-[14px] font-bold text-secondary-text">
          Add questions to your exam's question bank to unlock the Daily Challenge.
        </p>
        <Link href="/" className="neo-btn mt-8 bg-primary px-6 py-3 text-sm font-bold tracking-wide text-primary-foreground">
          Back to dashboard
        </Link>
      </main>
    )
  }

  return (
    <main className="relative z-10 mx-auto max-w-3xl px-4 pb-24 pt-12 md:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground transition-colors hover:text-primary"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        Back to dashboard
      </Link>

      <header className="mt-6 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#FF9600]">Daily Challenge</p>
          <h1 className="mt-1 font-heading text-3xl font-black uppercase tracking-tight text-primary-text md:text-4xl">
            {todayLabel || "Today's Challenge"}
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-xl border-[3px] border-[#1F2937] bg-[#FF9600] px-3 py-2 text-white shadow-neo-sm">
          <Flame className="size-6 animate-pulse fill-white text-white" strokeWidth={2} />
          <div className="leading-none">
            <p className="font-heading text-[20px] font-black leading-none">{streak}</p>
            <p className="mt-1 text-[10px] font-black uppercase tracking-wider opacity-90">day streak</p>
          </div>
        </div>
      </header>

      {showFeedback && shownOutcome ? (
        <FeedbackCard outcome={shownOutcome} explanation={question.explanation} />
      ) : (
        <Card className="overflow-hidden rounded-2xl border-[3px] border-[#1F2937] bg-white p-0 shadow-neo">
          {/* question header */}
          <div className="flex flex-wrap items-center gap-2 border-b-[3px] border-[#1F2937] bg-[#DDF4FF] px-5 py-3">
            <span className="rounded-md border-2 border-[#1F2937] bg-white px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#1F2937]">
              {question.type}
            </span>
            <span className="font-mono text-[11px] font-bold text-[#1F2937]">
              {question.marks} mark{question.marks > 1 ? "s" : ""}
            </span>
            <span className="ml-auto truncate font-mono text-[11px] font-bold text-secondary-text">
              {question.subject}
              {question.topic ? ` · ${question.topic}` : ""}
            </span>
          </div>

          <div className="px-5 py-6">
            <div className="space-y-4 text-[15px] font-medium leading-relaxed text-pretty md:text-[16px]">
              <Latex>{question.text}</Latex>
            </div>

            {question.code && (
              <pre className="mt-5 overflow-x-auto rounded-xl border-[3px] border-[#1F2937] bg-[#1F2937] p-4 font-mono text-[11px] leading-relaxed text-white sm:text-[13px] custom-scrollbar">
                {question.code}
              </pre>
            )}

            <div className="mt-7">
              {question.type === "NAT" ? (
                <div>
                  <label htmlFor="daily-nat" className="font-mono text-[12px] font-bold tracking-wide text-[#1F2937]">
                    Your answer (numeric)
                  </label>
                  <input
                    id="daily-nat"
                    type="text"
                    inputMode="decimal"
                    value={natDraft}
                    onChange={(e) => {
                      const v = e.target.value
                      if (v === "" || /^-?\d*\.?\d*$/.test(v)) {
                        setNatDraft(v)
                        setResponse(v === "" ? null : v)
                      }
                    }}
                    placeholder="e.g. 12.5"
                    className="mt-3 block w-full max-w-xs rounded-xl border-[3px] border-[#1F2937] bg-white px-4 py-3 font-mono text-lg font-bold tabular-nums outline-none transition-colors focus:border-[#1CB0F6]"
                  />
                </div>
              ) : (
                <ul className="space-y-3">
                  {(question.options ?? []).map((opt, i) => {
                    const selected =
                      question.type === "MSQ"
                        ? Array.isArray(response) && response.includes(i)
                        : response === i
                    return (
                      <li key={i}>
                        <button
                          type="button"
                          onClick={() => (question.type === "MSQ" ? toggleMsq(i) : setResponse(i))}
                          aria-pressed={selected}
                          className={cn(
                            "flex w-full items-start gap-3 rounded-xl border-[3px] px-4 py-3 text-left shadow-neo-sm transition-all hover:-translate-y-0.5",
                            selected ? "border-[#1CB0F6] bg-[#DDF4FF]" : "border-[#1F2937] bg-white"
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 flex size-6 shrink-0 items-center justify-center border-2 font-mono text-[12px] font-bold",
                              question.type === "MSQ" ? "rounded-md" : "rounded-full",
                              selected ? "border-[#1CB0F6] bg-[#1CB0F6] text-white" : "border-[#1F2937] text-[#1F2937]"
                            )}
                            aria-hidden="true"
                          >
                            {selected && question.type === "MSQ" ? (
                              <Check className="size-4" />
                            ) : (
                              String.fromCharCode(65 + i)
                            )}
                          </span>
                          <span
                            className={cn(
                              "flex-1 overflow-x-auto text-[14px] font-medium leading-relaxed md:text-[15px]",
                              selected ? "text-[#1899D6]" : "text-[#1F2937]"
                            )}
                          >
                            <Latex>{opt}</Latex>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}

              {question.type === "MSQ" && (
                <p className="mt-4 font-mono text-[11px] font-bold text-secondary-text">
                  One or more options may be correct. No partial credit, no negative marking.
                </p>
              )}
            </div>
          </div>

          {/* footer actions */}
          <div className="flex flex-wrap items-center gap-3 border-t-[3px] border-[#1F2937] bg-[#FAFBFF] px-5 py-4">
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={!isAttempted(response) || submitting}
              className="neo-btn bg-[#58CC02] px-6 py-3 font-bold text-sm tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Checking…" : "Submit Answer"}
            </button>
            <button
              type="button"
              onClick={() => void reroll()}
              title="Show another challenge"
              aria-label="Show another challenge"
              className="inline-flex items-center gap-1.5 rounded-xl border-[3px] border-[#1F2937] bg-white px-4 py-3 text-sm font-bold tracking-wide shadow-neo-sm transition-all hover:-translate-y-0.5"
            >
              <RefreshCw className="size-4" strokeWidth={3} /> Another
            </button>
            <Link href="/" className="ml-auto text-sm font-bold text-secondary-text hover:text-foreground">
              Back
            </Link>
          </div>
        </Card>
      )}
    </main>
  )
}

function FeedbackCard({ outcome, explanation }: { outcome: { correct: boolean; streak: number }; explanation?: string }) {
  return (
    <Card className="overflow-hidden rounded-2xl border-[3px] border-[#1F2937] bg-white p-0 shadow-neo">
      <div
        className={cn(
          "flex flex-wrap items-center gap-3 border-b-[3px] border-[#1F2937] px-5 py-4",
          outcome.correct ? "bg-[#E5F9D6]" : "bg-[#FFE5E5]"
        )}
      >
        {outcome.correct ? (
          <>
            <span className="flex items-center gap-2 rounded-full border-2 border-[#58CC02] bg-white px-3 py-1 font-mono text-sm font-bold text-[#58CC02]">
              <Check className="size-4" strokeWidth={3} /> Correct
            </span>
            <p className="font-heading text-[18px] font-black text-[#1F2937]">Streak {outcome.streak} 🔥</p>
          </>
        ) : (
          <>
            <span className="flex items-center gap-2 rounded-full border-2 border-[#FF4B4B] bg-white px-3 py-1 font-mono text-sm font-bold text-[#FF4B4B]">
              <X className="size-4" strokeWidth={3} /> Incorrect
            </span>
            <p className="font-heading text-[18px] font-black text-[#1F2937]">Streak reset</p>
          </>
        )}
      </div>

      <div className="px-5 py-6">
        <p className="mb-4 text-[14px] font-bold text-[#1F2937]">
          {outcome.correct
            ? "Nice work — keep the streak alive. Come back tomorrow for the next challenge."
            : "Don't worry — review the solution below and try again tomorrow."}
        </p>

        <h4 className="mb-3 font-mono text-[12px] font-bold uppercase tracking-wider text-primary">Explanation</h4>
        <div className="space-y-4 overflow-x-auto text-[14px] font-medium leading-relaxed text-foreground md:text-[15px]">
          <Latex>{explanation || "No explanation provided for this question."}</Latex>
        </div>

        <Link
          href="/"
          className="neo-btn mt-8 inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-bold tracking-wide text-primary-foreground"
        >
          Back to Dashboard <ArrowRight className="size-4" />
        </Link>
      </div>
    </Card>
  )
}
