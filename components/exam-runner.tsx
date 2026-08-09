"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Latex from "react-latex-next"
import { AlertTriangle, Check, ChevronLeft, ChevronRight, Flag, X, Calculator as CalcIcon, FileEdit, Target } from "lucide-react"

import { type Response, type StoredAttempt as LegacyStoredAttempt, type TestDefinition, formatClock, isAttempted, scoreAttempt, isCorrect } from "@/lib/test-types"
import { newAttemptId, useAttempts } from "@/lib/use-attempts"
import { useQuestionBank } from "@/lib/storage/hooks"
import { getStore, COLLECTIONS } from "@/lib/storage/store"
import { LOCAL_USER_ID, GATE_CSE_EXAM_ID } from "@/lib/domain/types"
import type { StoredAttempt, MistakeEntry, SrsCard } from "@/lib/domain/types"
import { computeNextSrsCard } from "@/lib/srs/sm2"
import { GateCalculator } from "@/components/gate-calculator"
import { Scratchpad } from "@/components/scratchpad"
import { cn } from "@/lib/utils"

type Status = "unseen" | "answered" | "marked" | "seen"

export function ExamRunner({ test }: { test: TestDefinition }) {
  const router = useRouter()
  const { save } = useAttempts()
  const { questionMap, loading } = useQuestionBank()

  const questions = useMemo(() => {
    let baseQs = test.questionIds.map((id) => questionMap.get(id)).filter((q): q is NonNullable<typeof q> => Boolean(q))
    console.log("[ExamRunner] Initial match count:", baseQs.length, "Test ID:", test.id, "Test kind:", test.kind, "Test subject:", test.subject)
    
    // Fallback: If no explicit question IDs matched (e.g. due to cross-exam test ID sharing like 'subj-general-aptitude')
    // and it's a subject drill, just pull all questions for this subject from the local active exam bank.
    // Note: We check test.id.includes("subj-") because test.kind gets overwritten by ?mode=practice in the URL!
    if (baseQs.length === 0 && test.id.includes("subj-") && test.subject) {
      baseQs = Array.from(questionMap.values()).filter(q => q.subject === test.subject)
      console.log("[ExamRunner] Fallback executed. Found questions matching subject:", baseQs.length)
      if (baseQs.length === 0) {
        console.log("[ExamRunner] Fallback failed to find any questions! First 5 local subjects available in questionMap:", 
          Array.from(new Set(Array.from(questionMap.values()).map(q => q.subject))).slice(0, 5))
      }
    }
    
    return baseQs
  }, [test, questionMap])

  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, Response>>({})
  const [marked, setMarked] = useState<Record<string, boolean>>({})
  const [visited, setVisited] = useState<Record<string, boolean>>({})
  const [timePerQuestion, setTimePerQuestion] = useState<Record<string, number>>({})
  const [remaining, setRemaining] = useState(test.durationMinutes * 60)
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const [natDraft, setNatDraft] = useState("")
  const [showCalc, setShowCalc] = useState(false)
  const [showScratchpad, setShowScratchpad] = useState(false)
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({})

  const startedAt = useRef<number>(0)
  const questionEnteredAt = useRef<number>(0)
  const submittedRef = useRef(false)

  const current = questions[index]
  const totalMarks = questions.reduce((s, q) => s + q.marks, 0)

  /* ---------------- per-question time accounting ---------------- */
  const commitTime = useCallback(() => {
    if (!current || questionEnteredAt.current === 0) return
    const spent = (Date.now() - questionEnteredAt.current) / 1000
    setTimePerQuestion((prev) => ({ ...prev, [current.id]: (prev[current.id] ?? 0) + spent }))
    questionEnteredAt.current = Date.now()
  }, [current])

  const goTo = useCallback(
    (next: number) => {
      if (next < 0 || next >= questions.length) return
      commitTime()
      setIndex(next)
      // Land at the top of the new question rather than keeping the old
      // scroll offset, which would drop you mid-stem behind the sticky header.
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    },
    [commitTime, questions.length],
  )

  /* ---------------- submit ---------------- */
  const submit = useCallback(() => {
    if (submittedRef.current) return
    submittedRef.current = true

    // Fold in the time spent on the question that's open at submit time.
    const finalTimes = { ...timePerQuestion }
    if (current && questionEnteredAt.current > 0) {
      const spent = (Date.now() - questionEnteredAt.current) / 1000
      finalTimes[current.id] = (finalTimes[current.id] ?? 0) + spent
    }

    const result = scoreAttempt(questions, responses, finalTimes)
    const attempt: StoredAttempt = {
      userId: LOCAL_USER_ID,
      examId: GATE_CSE_EXAM_ID,
      id: newAttemptId(),
      testId: test.id,
      testTitle: test.title,
      kind: test.kind,
      subject: test.subject,
      questionIds: questions.map((q) => q.id),
      submittedAt: new Date().toISOString(),
      durationSeconds: startedAt.current > 0 ? (Date.now() - startedAt.current) / 1000 : 0,
      responses,
      timePerQuestion: finalTimes,
      markedForReview: Object.keys(marked).filter((k) => marked[k]),
      scored: result.scored,
      totalMarks: result.totalMarks,
      correct: result.correct,
      wrong: result.wrong,
      skipped: result.skipped,
    }
    save(attempt)

    // Auto-capture mistakes into StudyStore mistakes collection
    const store = getStore()
    for (const outcome of result.outcomes) {
      const qid = outcome.question.id
      store.list(COLLECTIONS.mistakes, { where: { questionId: qid } }).then((existingList) => {
        const existing = existingList[0]
        if (!outcome.correct) {
          if (existing) {
            store.put(COLLECTIONS.mistakes, {
              ...existing,
              attemptId: attempt.id,
              resolved: false,
            })
          } else {
            store.put(COLLECTIONS.mistakes, {
              userId: LOCAL_USER_ID,
              examId: GATE_CSE_EXAM_ID,
              id: `mistake-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              questionId: qid,
              attemptId: attempt.id,
              resolved: false,
              createdAt: new Date().toISOString(),
              correctAfter: [],
            } as MistakeEntry)
          }

          // Auto-demote linked concept SRS cards on wrong answer
          if (outcome.question.conceptIds && outcome.question.conceptIds.length > 0) {
            for (const conceptId of outcome.question.conceptIds) {
              store.list(COLLECTIONS.srsCards, { where: { conceptId } }).then((cards) => {
                const card = cards[0]
                if (card) {
                  const demoted = computeNextSrsCard(card, "again")
                  store.put(COLLECTIONS.srsCards, demoted)
                }
              })
            }
          }
        } else if (existing && !existing.resolved) {
          const dates = existing.correctAfter || []
          const todayIso = new Date().toISOString().slice(0, 10)
          if (!dates.includes(todayIso)) {
            const nextDates = [...dates, todayIso]
            store.put(COLLECTIONS.mistakes, {
              ...existing,
              correctAfter: nextDates,
              resolved: nextDates.length >= 2,
            })
          }
        }
      })
    }

    router.push(`/results/${attempt.id}`)
  }, [current, marked, questions, responses, router, save, test, timePerQuestion])

  /* ---------------- countdown ---------------- */
  useEffect(() => {
    if (!started || test.kind === "practice") return
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(id)
          submit() // auto-submit on timeout
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [started, submit, test.kind])

  /* ---------------- mark visited + reset NAT draft on navigation ---------------- */
  useEffect(() => {
    if (!started || !current) return
    setVisited((v) => (v[current.id] ? v : { ...v, [current.id]: true }))
    const existing = responses[current.id]
    setNatDraft(typeof existing === "string" ? existing : "")
    if (questionEnteredAt.current === 0) questionEnteredAt.current = Date.now()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, started])

  /* ---------------- warn before leaving mid-exam ---------------- */
  useEffect(() => {
    if (!started) return
    const handler = (e: BeforeUnloadEvent) => {
      if (submittedRef.current) return
      e.preventDefault()
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [started])

  /* ---------------- keyboard shortcuts ---------------- */
  useEffect(() => {
    if (!started || confirmSubmit) return
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return
      if (e.key === "ArrowRight") goTo(index + 1)
      if (e.key === "ArrowLeft") goTo(index - 1)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [confirmSubmit, goTo, index, started])

  const setResponse = (value: Response) => {
    if (!current) return
    setResponses((r) => ({ ...r, [current.id]: value }))
  }

  const clearResponse = () => {
    if (!current) return
    setResponses((r) => {
      const next = { ...r }
      delete next[current.id]
      return next
    })
    setNatDraft("")
  }

  const toggleMsq = (optIndex: number) => {
    const existing = responses[current.id]
    const arr = Array.isArray(existing) ? existing : []
    setResponse(arr.includes(optIndex) ? arr.filter((i) => i !== optIndex) : [...arr, optIndex].sort((a, b) => a - b))
  }

  type GateStatus = "not-visited" | "not-answered" | "answered" | "marked" | "answered-marked"

  const gateStatusOf = (qid: string): GateStatus => {
    const isAns = isAttempted(responses[qid] ?? null)
    const isMrk = !!marked[qid]
    const isVis = !!visited[qid]

    if (isAns && isMrk) return "answered-marked"
    if (isMrk) return "marked"
    if (isAns) return "answered"
    if (isVis) return "not-answered"
    return "not-visited"
  }

  const statusCounts = useMemo(() => {
    let ans = 0, notAns = 0, mrk = 0, ansMrk = 0, notVis = 0
    for (const q of questions) {
      const gs = gateStatusOf(q.id)
      if (gs === "answered") ans++
      else if (gs === "not-answered") notAns++
      else if (gs === "marked") mrk++
      else if (gs === "answered-marked") ansMrk++
      else notVis++
    }
    return { ans, notAns, mrk, ansMrk, notVis }
  }, [gateStatusOf, questions])

  const groupedQuestions = useMemo(() => {
    const groups: { subject: string, startIndex: number, questions: typeof questions }[] = []
    let currentSubject = ""
    let currentGroup: typeof questions = []
    let startIndex = 0

    questions.forEach((q, i) => {
      if (q.subject !== currentSubject) {
        if (currentGroup.length > 0) {
          groups.push({ subject: currentSubject, startIndex, questions: currentGroup })
        }
        currentSubject = q.subject
        startIndex = i
        currentGroup = [q]
      } else {
        currentGroup.push(q)
      }
    })
    if (currentGroup.length > 0) {
      groups.push({ subject: currentSubject, startIndex, questions: currentGroup })
    }
    return groups
  }, [questions])

  const statusOf = (qid: string): Status => {
    if (marked[qid]) return "marked"
    if (isAttempted(responses[qid] ?? null)) return "answered"
    if (visited[qid]) return "seen"
    return "unseen"
  }

  const answeredCount = statusCounts.ans + statusCounts.ansMrk
  const markedCount = statusCounts.mrk + statusCounts.ansMrk
  const lowTime = remaining <= 300

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center font-mono text-[11px] text-muted-foreground">
        Loading question bank…
      </div>
    )
  }

  /* ================= instructions screen ================= */
  if (!started) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-20 relative z-10">
        <Link
          href="/tests"
          className="inline-flex items-center gap-1.5 font-bold text-sm text-foreground hover:text-primary transition-colors border-2 border-transparent hover:border-border rounded-xl px-2 py-1"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Back to test centre
        </Link>

        <div className="neo-card p-8 mt-8 bg-card relative overflow-hidden">
          {/* Playful accent */}
          <div className="absolute -top-4 -right-4 size-24 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
          
          <p className="font-mono text-xs tracking-widest text-primary font-bold uppercase">
            {test.kind === "mock" ? "Full mock paper" : `${test.subject} drill`}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance md:text-5xl">{test.title}</h1>
          <p className="mt-4 text-base leading-relaxed text-secondary-text text-pretty font-medium">{test.description}</p>

          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { value: String(questions.length), label: "questions", color: "bg-[#FF9600]" },
              { value: String(totalMarks), label: "total marks", color: "bg-[#CE82FF]" },
              { value: `${test.durationMinutes}m`, label: "duration", color: "bg-[#1CB0F6]" },
            ].map((s) => (
              <div key={s.label} className="border-3 border-border shadow-neo bg-card rounded-xl p-5 relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-12 h-12 ${s.color} rounded-bl-full opacity-20 group-hover:opacity-40 transition-opacity`} />
                <dd className="font-mono text-3xl font-bold leading-none tabular-nums text-foreground">{s.value}</dd>
                <dt className="mt-2 font-mono text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{s.label}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-8 border-3 border-border shadow-neo bg-[#FAFBFF] rounded-xl p-5">
            <h2 className="font-mono text-[11px] font-bold tracking-widest text-primary uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" /> Marking scheme
            </h2>
            <ul className="mt-4 space-y-3 text-[14px] font-medium leading-relaxed text-secondary-text">
              <li className="flex gap-2">
                <span className="text-foreground font-bold shrink-0">MCQ</span>
                <span>— one correct option. A wrong answer costs 1/3 mark on 1-mark questions and 2/3 mark on 2-mark questions.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-foreground font-bold shrink-0">MSQ</span>
                <span>— one or more correct options. No negative marking, but no partial credit either: you must select exactly the right set.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-foreground font-bold shrink-0">NAT</span>
                <span>— type a number. No options, no negative marking. Decimal answers are accepted within GATE's rounding tolerance.</span>
              </li>
              <li className="text-pretty">
                Unattempted questions always score zero. The paper auto-submits when the clock reaches 00:00.
              </li>
            </ul>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            startedAt.current = Date.now()
            questionEnteredAt.current = Date.now()
            setStarted(true)
          }}
          className="neo-btn mt-8 w-full bg-primary py-4 font-bold text-lg tracking-wide text-primary-foreground text-center"
        >
          Begin test — {test.durationMinutes} minutes
        </button>
      </main>
    )
  }

  /* ================= exam screen ================= */
  return (
    <div className="flex min-h-dvh flex-col relative z-10">
      {/* top bar */}
      <header className="sticky top-0 z-30 border-b-3 border-border bg-card shadow-sm">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-y-3 gap-x-4 px-4 py-3 md:px-8">
          <div className="min-w-0 flex-1 md:flex-none">
            <p className="truncate font-bold text-sm tracking-wide text-foreground" title={test.title}>{test.title}</p>
            <p className="font-mono text-[11px] font-semibold tabular-nums text-muted-foreground">
              {answeredCount}/{questions.length} answered
              {markedCount > 0 && <span className="text-[#CE82FF]"> · {markedCount} flagged</span>}
            </p>
          </div>

          {/* Tools: Calculator & Scratchpad */}
          <div className="ml-auto flex items-center gap-1.5 md:gap-3 font-mono text-[11px]">
            <button
              type="button"
              onClick={() => setShowCalc(!showCalc)}
              className={cn(
                "flex items-center justify-center size-11 md:size-auto md:px-3 md:py-1.5 md:gap-1.5 border-2 rounded-xl transition-colors font-bold",
                showCalc
                  ? "border-[#1CB0F6] bg-[#1CB0F6]/10 text-[#1CB0F6]"
                  : "border-border bg-background text-secondary-text hover:text-foreground"
              )}
            >
              <CalcIcon className="size-4 md:size-3.5" />
              <span className="hidden md:inline">Calculator</span>
            </button>
            <button
              type="button"
              onClick={() => setShowScratchpad(!showScratchpad)}
              className={cn(
                "flex items-center justify-center size-11 md:size-auto md:px-3 md:py-1.5 md:gap-1.5 border-2 rounded-xl transition-colors font-bold",
                showScratchpad
                  ? "border-[#FF9600] bg-[#FF9600]/10 text-[#FF9600]"
                  : "border-border bg-background text-secondary-text hover:text-foreground"
              )}
            >
              <FileEdit className="size-4 md:size-3.5" />
              <span className="hidden md:inline">Scratchpad</span>
            </button>
          </div>

          {test.kind === "practice" ? (
            <div className="border-2 md:border-3 border-[#1CB0F6] bg-[#DDF4FF] px-2 md:px-4 py-1 md:py-1.5 text-center rounded-xl ml-auto mr-2 md:mr-4 flex flex-col justify-center shadow-neo-sm">
              <p className="font-mono text-[10px] md:text-sm leading-none text-[#1899D6] font-bold">
                PRACTICE
              </p>
            </div>
          ) : (
            <div
              className={cn(
                "border-2 md:border-3 rounded-xl px-2 md:px-4 py-1 md:py-1.5 text-center ml-auto mr-2 md:mr-4 shadow-neo-sm",
                lowTime ? "border-destructive bg-[#FFE5E5]" : "border-border bg-background",
              )}
              role="timer"
              aria-live="off"
            >
              <p
                className={cn(
                  "font-mono text-[14px] md:text-xl font-bold leading-none tabular-nums",
                  lowTime ? "text-destructive" : "text-foreground",
                )}
              >
                {formatClock(remaining)}
              </p>
              <p className="hidden md:block mt-1 font-mono text-[9px] font-bold tracking-widest text-muted-foreground uppercase">remaining</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setConfirmSubmit(true)}
            className="hidden md:block shrink-0 neo-btn bg-primary px-5 py-2 font-bold text-sm tracking-wide text-primary-foreground ml-auto sm:ml-0"
          >
            {test.kind === "practice" ? "Finish Practice" : "Submit Test"}
          </button>
        </div>
        {/* progress */}
        <div className="h-1 w-full bg-border" aria-hidden="true">
          <div
            className="h-full bg-[#58CC02] transition-all"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 px-4 py-6 md:px-8 lg:flex-row lg:gap-8">
        {/* question pane */}
        <main className="min-w-0 flex-1">
          {current && (
            <article className="neo-card bg-card overflow-hidden">
              <div className="flex flex-wrap items-center gap-3 border-b-3 border-border bg-[#FAFBFF] px-6 py-4">
                <span className="font-mono text-[12px] font-bold tracking-widest text-[#1899D6] uppercase">
                  Q{index + 1} / {questions.length}
                </span>
                <span className="border-2 border-border bg-white rounded-md px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest uppercase text-foreground">
                  {current.type}
                </span>
                <span className="font-mono text-[12px] font-bold tabular-nums text-foreground">
                  {current.marks} mark{current.marks > 1 ? "s" : ""}
                  {current.type === "MCQ" && (
                    <span className="text-destructive">
                      {" "}
                      / −{current.marks === 1 ? "0.33" : "0.67"}
                    </span>
                  )}
                </span>
                <span
                  className="truncate font-mono text-[12px] font-bold text-muted-foreground ml-2"
                  title={`${current.subject}${current.topic ? ` · ${current.topic}` : ""}`}
                >
                  {current.subject}
                  {current.topic ? ` · ${current.topic}` : ""}
                </span>

                <button
                  type="button"
                  onClick={() => setMarked((m) => ({ ...m, [current.id]: !m[current.id] }))}
                  aria-pressed={!!marked[current.id]}
                  className={cn(
                    "ml-auto inline-flex shrink-0 items-center gap-1.5 border-2 rounded-xl px-3 py-1.5 font-bold text-xs tracking-wide transition-colors shadow-neo-sm min-h-11",
                    marked[current.id]
                      ? "border-[#CE82FF] bg-[#CE82FF] text-white"
                      : "border-border bg-white text-foreground hover:-translate-y-0.5",
                  )}
                >
                  <Flag className="size-4" aria-hidden="true" fill={marked[current.id] ? "currentColor" : "none"} />
                  {marked[current.id] ? "Flagged" : "Flag"}
                </button>
              </div>

              {/* Pace Coach Warning Alert */}
              {(() => {
                const timeOnQ = (timePerQuestion[current.id] ?? 0) + (questionEnteredAt.current > 0 ? (Date.now() - questionEnteredAt.current) / 1000 : 0)
                const threshold = current.marks === 1 ? 210 : 300
                if (timeOnQ > threshold) {
                  const mins = Math.floor(timeOnQ / 60)
                  const secs = Math.floor(timeOnQ % 60)
                  return (
                    <div className="flex items-center gap-3 border-b-3 border-[#FF9600] bg-[#FFF2DE] px-6 py-3 text-[#B36900] font-mono text-sm font-bold animate-pulse">
                      <AlertTriangle className="size-5 shrink-0" />
                      <span>
                        Pace Coach Alert: Spent {mins}m {secs}s on this {current.marks}-mark question. Consider marking for review and moving forward.
                      </span>
                    </div>
                  )
                }
                return null
              })()}

              <div className="px-4 py-6 md:px-6 md:py-8">
                <div className="text-[15px] md:text-[16px] font-medium leading-relaxed text-pretty space-y-4">
                  <Latex>{current.text}</Latex>
                </div>

                {current.code && (
                  <pre className="mt-6 overflow-x-auto border-3 border-border rounded-xl bg-[#1F2937] p-5 font-mono text-[11px] sm:text-[13px] leading-relaxed text-white shadow-neo-sm custom-scrollbar">
                    {current.code}
                  </pre>
                )}

                {/* answer input */}
                <div className="mt-8">
                  {current.type === "NAT" ? (
                    <div>
                      <label
                        htmlFor="nat-answer"
                        className="font-mono text-[12px] font-bold tracking-wide text-foreground"
                      >
                        Your answer (numeric)
                      </label>
                      <input
                        id="nat-answer"
                        type="text"
                        inputMode="decimal"
                        value={natDraft}
                        onChange={(e) => {
                          const v = e.target.value
                          // Allow digits, one decimal point and a leading minus.
                          if (v === "" || /^-?\d*\.?\d*$/.test(v)) {
                            setNatDraft(v)
                            setResponse(v === "" ? null : v)
                          }
                        }}
                        placeholder="e.g. 12.5"
                        className="mt-3 block w-full max-w-xs border-3 rounded-xl border-border shadow-neo-sm bg-background px-4 py-3 font-mono text-lg font-bold tabular-nums outline-none transition-colors focus:border-[#1CB0F6]"
                      />
                      <p className="mt-3 font-mono text-[11px] font-bold text-muted-foreground">
                        No negative marking on NAT questions.
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {(current.options ?? []).map((opt, i) => {
                        const resp = responses[current.id]
                        const selected =
                          current.type === "MSQ" ? Array.isArray(resp) && resp.includes(i) : resp === i
                        return (
                          <li key={i}>
                            <button
                              type="button"
                              onClick={() => (current.type === "MSQ" ? toggleMsq(i) : setResponse(i))}
                              aria-pressed={selected}
                              className={cn(
                                "flex w-full items-start gap-3 md:gap-4 border-[2px] md:border-[3px] rounded-xl px-4 py-3 md:px-5 md:py-4 text-left transition-all shadow-neo-sm hover:-translate-y-0.5",
                                selected
                                  ? "border-[#1CB0F6] bg-[#DDF4FF]"
                                  : "border-border bg-white",
                              )}
                            >
                              <span
                                className={cn(
                                  "mt-0.5 flex size-6 shrink-0 items-center justify-center border-2 font-mono text-[12px] font-bold",
                                  current.type === "MSQ" ? "rounded-md" : "rounded-full",
                                  selected
                                    ? "border-[#1CB0F6] bg-[#1CB0F6] text-white"
                                    : "border-border text-foreground",
                                )}
                                aria-hidden="true"
                              >
                                {selected && current.type === "MSQ" ? (
                                  <Check className="size-4" />
                                ) : (
                                  String.fromCharCode(65 + i)
                                )}
                              </span>
                              <div className={cn("flex-1 text-[14px] md:text-[15px] font-medium leading-relaxed text-pretty overflow-x-auto", selected ? "text-[#1899D6]" : "text-foreground")}>
                                <Latex>{opt}</Latex>
                              </div>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}

                  {current.type === "MSQ" && (
                    <p className="mt-4 font-mono text-[11px] font-bold text-muted-foreground">
                      One or more options may be correct. No partial credit, no negative marking.
                    </p>
                  )}
                  
                  {/* Practice Mode Feedback */}
                  {test.kind === "practice" && showExplanation[current.id] && (
                    <div className="mt-8 border-3 border-border p-6 rounded-2xl bg-[#FAFBFF] shadow-neo-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#DDF4FF] rounded-bl-[100px] opacity-50 pointer-events-none" />
                      <div className="flex items-center gap-2 mb-4 relative z-10">
                        {isCorrect(current, responses[current.id]) ? (
                          <span className="flex items-center gap-2 text-[#58CC02] font-bold font-mono text-sm border-2 border-[#58CC02] bg-[#E5F9D6] px-3 py-1 rounded-full">
                            <Check className="size-4" strokeWidth={3} /> Correct (+{current.marks})
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 text-[#FF4B4B] font-bold font-mono text-sm border-2 border-[#FF4B4B] bg-[#FFE5E5] px-3 py-1 rounded-full">
                            <X className="size-4" strokeWidth={3} /> Incorrect
                          </span>
                        )}
                      </div>
                      <h4 className="font-mono text-[12px] font-bold uppercase tracking-wider text-primary mb-3 relative z-10">Explanation</h4>
                      <div className="text-[14px] md:text-[15px] font-medium leading-relaxed text-foreground relative z-10 space-y-4 overflow-x-auto">
                        <Latex>{current.explanation || "No explanation provided for this question."}</Latex>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* nav footer */}
              <div className="flex flex-wrap items-center gap-3 border-t-3 border-border bg-[#FAFBFF] px-6 py-4">
                <button
                  type="button"
                  onClick={() => goTo(index - 1)}
                  disabled={index === 0}
                  className="inline-flex items-center gap-1.5 border-2 border-border rounded-xl bg-white px-4 py-2.5 font-bold text-sm tracking-wide transition-all shadow-neo-sm hover:-translate-y-0.5 disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={clearResponse}
                  disabled={!isAttempted(responses[current.id] ?? null)}
                  className="border-2 border-border rounded-xl bg-white px-4 py-2.5 font-bold text-sm tracking-wide transition-all shadow-neo-sm hover:-translate-y-0.5 disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
                >
                  Clear
                </button>
                
                {test.kind === "practice" && (
                  <button
                    type="button"
                    onClick={() => setShowExplanation(prev => ({ ...prev, [current.id]: true }))}
                    disabled={!isAttempted(responses[current.id] ?? null) || showExplanation[current.id]}
                    className="border-2 border-[#1CB0F6] rounded-xl bg-[#1CB0F6] text-white px-4 py-2.5 font-bold text-sm tracking-wide transition-all shadow-neo-sm hover:-translate-y-0.5 disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0 disabled:border-border disabled:text-muted-foreground disabled:bg-background ml-auto md:ml-3 md:mr-auto"
                  >
                    Check Answer
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => goTo(index + 1)}
                  disabled={index === questions.length - 1}
                  className="ml-auto inline-flex items-center gap-1.5 border-2 border-border rounded-xl bg-white px-4 py-2.5 font-bold text-sm tracking-wide transition-all shadow-neo-sm hover:-translate-y-0.5 disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
                >
                  Next
                  <ChevronRight className="size-4" aria-hidden="true" />
                </button>

                {/* Mobile Submit Button */}
                <button
                  type="button"
                  onClick={() => setConfirmSubmit(true)}
                  className="md:hidden shrink-0 neo-btn bg-primary px-4 py-2 min-h-11 font-bold text-sm tracking-wide text-primary-foreground ml-2"
                >
                  {test.kind === "practice" ? "Finish" : "Submit"}
                </button>
              </div>
            </article>
          )}
        </main>

        <aside className="w-full shrink-0 lg:w-80 order-first lg:order-last mb-2 lg:mb-0">
          {/* Desktop Version */}
          <div className="hidden lg:block neo-card bg-card p-5 sticky top-24 space-y-5">
            <h2 className="font-heading text-xl font-black tracking-tight text-foreground flex items-center gap-2">
              <Target className="size-5 text-[#1CB0F6]" />
              Question Palette
            </h2>

            {/* Desktop Grid */}
            <ol className="grid grid-cols-6 gap-2">
              {questions.map((q, i) => {
                const gs = gateStatusOf(q.id)
                return (
                  <li key={q.id}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={i === index ? "true" : undefined}
                      aria-label={`Question ${i + 1}, ${gs}`}
                      className={cn(
                        "flex aspect-square w-full items-center justify-center border-2 rounded-lg font-mono text-[13px] font-bold tabular-nums transition-all relative shadow-neo-sm hover:-translate-y-0.5",
                        gs === "not-visited" && "border-border bg-white text-muted-foreground",
                        gs === "not-answered" && "border-[#FF4B4B] bg-[#FFE5E5] text-[#FF4B4B]",
                        gs === "answered" && "border-[#58CC02] bg-[#58CC02] text-white",
                        gs === "marked" && "border-[#CE82FF] bg-[#CE82FF] text-white rounded-full",
                        gs === "answered-marked" && "border-[#CE82FF] bg-[#CE82FF] text-white rounded-full",
                        i === index && "ring-4 ring-[#1CB0F6]/50 ring-offset-2 ring-offset-card z-10 border-[#1CB0F6]"
                      )}
                    >
                      {i + 1}
                      {gs === "answered-marked" && (
                        <span className="absolute bottom-0 right-0 size-2.5 bg-[#58CC02] rounded-full border-2 border-background" />
                      )}
                    </button>
                  </li>
                )
              })}
            </ol>

            {/* TCS iON 5-Status Legend */}
            <dl className="space-y-2 border-t-3 border-border pt-4 font-mono text-[11px] font-bold text-foreground">
              <div className="flex items-center gap-3 bg-[#58CC02]/10 p-1.5 rounded-md border border-[#58CC02]/30">
                <span className="size-4 bg-[#58CC02] rounded-sm border-2 border-[#58CC02]" />
                <dt className="flex-1">Answered</dt>
                <dd className="tabular-nums text-[#58CC02] text-sm">{statusCounts.ans}</dd>
              </div>
              <div className="flex items-center gap-3 bg-[#FFE5E5] p-1.5 rounded-md border border-[#FF4B4B]/30">
                <span className="size-4 bg-[#FFE5E5] rounded-sm border-2 border-[#FF4B4B]" />
                <dt className="flex-1">Not Answered</dt>
                <dd className="tabular-nums text-[#FF4B4B] text-sm">{statusCounts.notAns}</dd>
              </div>
              <div className="flex items-center gap-3 bg-[#CE82FF]/10 p-1.5 rounded-md border border-[#CE82FF]/30">
                <span className="size-4 bg-[#CE82FF] rounded-full border-2 border-[#CE82FF]" />
                <dt className="flex-1">Marked</dt>
                <dd className="tabular-nums text-[#CE82FF] text-sm">{statusCounts.mrk}</dd>
              </div>
              <div className="flex items-center gap-3 bg-[#CE82FF]/10 p-1.5 rounded-md border border-[#CE82FF]/30">
                <span className="size-4 bg-[#CE82FF] rounded-full border-2 border-[#CE82FF] relative">
                  <span className="absolute -bottom-1 -right-1 size-2 bg-[#58CC02] rounded-full border border-white" />
                </span>
                <dt className="flex-1">Ans. &amp; Marked</dt>
                <dd className="tabular-nums text-[#CE82FF] text-sm">{statusCounts.ansMrk}</dd>
              </div>
              <div className="flex items-center gap-3 p-1.5">
                <span className="size-4 bg-white rounded-sm border-2 border-border shadow-sm" />
                <dt className="flex-1 text-muted-foreground">Not Visited</dt>
                <dd className="tabular-nums text-muted-foreground text-sm">{statusCounts.notVis}</dd>
              </div>
            </dl>
          </div>

          {/* Mobile Version */}
          <div className="lg:hidden flex flex-col">
            {/* Horizontal Strip */}
            <div className="flex overflow-x-auto gap-6 pb-2 custom-scrollbar px-1">
              {groupedQuestions.map((group) => (
                <div key={group.subject} className="flex flex-col gap-2 shrink-0">
                  <span className="font-mono text-[11px] font-bold tracking-widest uppercase text-[#1F2937]">
                    {group.subject}
                  </span>
                  <ol className="flex gap-2">
                    {group.questions.map((q, localIndex) => {
                      const i = group.startIndex + localIndex
                      const gs = gateStatusOf(q.id)
                      return (
                        <li key={q.id}>
                          <button
                            type="button"
                            onClick={() => goTo(i)}
                            aria-current={i === index ? "true" : undefined}
                            aria-label={`Question ${i + 1}, ${gs}`}
                            className={cn(
                              "flex size-11 shrink-0 items-center justify-center border-2 rounded-lg font-mono text-[13px] font-bold tabular-nums transition-all relative shadow-neo-sm hover:-translate-y-0.5",
                              gs === "not-visited" && "border-border bg-white text-muted-foreground",
                              gs === "not-answered" && "border-[#FF4B4B] bg-[#FFE5E5] text-[#FF4B4B]",
                              gs === "answered" && "border-[#58CC02] bg-[#58CC02] text-white",
                              gs === "marked" && "border-[#CE82FF] bg-[#CE82FF] text-white rounded-full",
                              gs === "answered-marked" && "border-[#CE82FF] bg-[#CE82FF] text-white rounded-full",
                              i === index && "ring-4 ring-[#1CB0F6]/50 ring-offset-2 ring-offset-card z-10 border-[#1CB0F6]"
                            )}
                          >
                            {i + 1}
                            {gs === "answered-marked" && (
                              <span className="absolute bottom-0 right-0 size-2 bg-[#58CC02] rounded-full border-[1.5px] border-background" />
                            )}
                          </button>
                        </li>
                      )
                    })}
                  </ol>
                </div>
              ))}
            </div>
            
            {/* Mobile Legend */}
            <div className="flex flex-col items-end font-mono text-[10px] font-bold text-[#4B5563] px-2 pr-4 leading-tight mt-1">
              <span>marked: {statusCounts.mrk + statusCounts.ansMrk}</span>
              <span>done: {statusCounts.ans + statusCounts.ansMrk}</span>
              <span>not attemp: {statusCounts.notAns + statusCounts.notVis}</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Floating Modals */}
      {showCalc && <GateCalculator onClose={() => setShowCalc(false)} />}
      {showScratchpad && <Scratchpad onClose={() => setShowScratchpad(false)} />}

      {/* Pre-Submission Confirmation Modal */}
      {confirmSubmit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg neo-card bg-card p-8 font-mono space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground font-heading">Submit Exam?</h2>
              <p className="mt-2 text-sm font-medium text-secondary-text">
                Verify your question status counts before final submission.
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-3 border-3 border-border rounded-xl p-5 bg-[#FAFBFF] text-xs font-bold">
              <div className="border-2 border-border bg-white rounded-lg p-3 shadow-sm">
                <dt className="text-muted-foreground mb-1">Answered</dt>
                <dd className="text-xl text-[#58CC02]">{statusCounts.ans}</dd>
              </div>
              <div className="border-2 border-border bg-white rounded-lg p-3 shadow-sm">
                <dt className="text-muted-foreground mb-1">Not Answered</dt>
                <dd className="text-xl text-[#FF4B4B]">{statusCounts.notAns}</dd>
              </div>
              <div className="border-2 border-border bg-white rounded-lg p-3 shadow-sm">
                <dt className="text-muted-foreground mb-1">Marked</dt>
                <dd className="text-xl text-[#CE82FF]">{statusCounts.mrk}</dd>
              </div>
              <div className="border-2 border-border bg-white rounded-lg p-3 shadow-sm">
                <dt className="text-muted-foreground mb-1">Ans &amp; Marked</dt>
                <dd className="text-xl text-[#CE82FF]">{statusCounts.ansMrk}</dd>
              </div>
              <div className="col-span-2 border-2 border-border bg-white rounded-lg p-3 shadow-sm text-center">
                <dt className="text-muted-foreground mb-1">Not Visited</dt>
                <dd className="text-xl text-foreground">{statusCounts.notVis}</dd>
              </div>
            </dl>

            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={() => setConfirmSubmit(false)}
                className="font-bold px-4 py-3 text-sm text-secondary-text hover:text-foreground transition-colors"
              >
                Return to Test
              </button>
              <button
                type="button"
                onClick={submit}
                className="neo-btn bg-primary px-6 py-3 text-sm tracking-wide text-primary-foreground"
              >
                Confirm &amp; Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
