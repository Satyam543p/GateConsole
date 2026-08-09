"use client"

/**
 * app/import/review/page.tsx
 *
 * Verification queue for unverified (verified: false) questions.
 * Supports inline editing, approving/rejecting, and high-productivity keyboard shortcuts.
 */

import { useState, useMemo, useEffect, useRef } from "react"
import Link from "next/link"
import { Check, X, Edit, ChevronLeft, ChevronRight, ExternalLink, Keyboard, HelpCircle, Trash2 } from "lucide-react"
import { useQuestionBank } from "@/lib/storage/hooks"
import { getStore, COLLECTIONS } from "@/lib/storage/store"
import type { Question } from "@/lib/domain/types"
import { cn } from "@/lib/utils"

export default function ReviewPage() {
  const { questions, refresh: refreshBank, loading } = useQuestionBank()
  const [index, setIndex] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Question>>({})

  // Keyboard shortcut dialog toggle
  const [showCheatsheet, setShowCheatsheet] = useState(false)

  // Unverified questions
  const unverified = useMemo(() => {
    return questions.filter((q) => !q.verified)
  }, [questions])

  const current = unverified[index]

  // Synchronise form when current question changes
  useEffect(() => {
    if (current) {
      setEditForm(current)
    } else {
      setEditForm({})
    }
    setIsEditing(false)
  }, [current])

  // Keyboard shortcuts handling
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger hotkeys if user is editing inputs
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.tagName === "SELECT"
      ) {
        // Allow Esc to blur inputs
        if (e.key === "Escape") {
          ;(document.activeElement as HTMLElement).blur()
          setIsEditing(false)
        }
        return
      }

      if (!current) return

      switch (e.key.toLowerCase()) {
        case "a":
          e.preventDefault()
          handleApprove()
          break
        case "r":
          e.preventDefault()
          handleReject()
          break
        case "e":
          e.preventDefault()
          setIsEditing(true)
          break
        case "arrowleft":
          e.preventDefault()
          navigate(-1)
          break
        case "arrowright":
          e.preventDefault()
          navigate(1)
          break
        case "?":
          e.preventDefault()
          setShowCheatsheet((prev) => !prev)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  })

  function navigate(delta: number) {
    if (unverified.length === 0) return
    const nextIdx = (index + delta + unverified.length) % unverified.length
    setIndex(nextIdx)
  }

  // ─── Actions ────────────────────────────────────────────────────────────────

  async function handleApprove() {
    if (!current) return
    const store = getStore()
    // Save with verified: true
    const updated: Question = {
      ...current,
      ...editForm,
      verified: true,
    }
    await store.put(COLLECTIONS.questions, updated)
    await refreshBank()
    // Stay on same position or wrap around
    if (index >= unverified.length - 1) {
      setIndex(Math.max(0, unverified.length - 2))
    }
  }

  async function handleReject() {
    if (!current) return
    const store = getStore()
    // Delete from user store
    await store.remove(COLLECTIONS.questions, current.id)
    await refreshBank()
    if (index >= unverified.length - 1) {
      setIndex(Math.max(0, unverified.length - 2))
    }
  }

  async function handleSaveEdit() {
    if (!current) return
    const store = getStore()
    const updated: Question = {
      ...current,
      ...editForm,
    } as Question
    await store.put(COLLECTIONS.questions, updated)
    await refreshBank()
    setIsEditing(false)
  }

  // Helper to handle option text change
  function handleOptionChange(optIdx: number, val: string) {
    const opts = [...(editForm.options ?? [])]
    opts[optIdx] = val
    setEditForm((prev) => ({ ...prev, options: opts }))
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 md:px-8">
        <p className="font-mono text-[11px] text-muted-foreground animate-pulse">
          Loading verification queue…
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[1600px] px-4 py-12 md:px-8">
        {/* Header */}
        <div className="border-b border-border pb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
              verification queue
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Review Queue
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Inspect imported questions. Verify accuracy, fix options, format worked
              explanations, then approve them to merge into the priority Matrix.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowCheatsheet(true)}
              className="border border-border hover:border-primary px-3 py-1.5 font-mono text-[11px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <Keyboard className="size-4" aria-hidden="true" />
              Keyboard Shortcuts (?)
            </button>
            <Link
              href="/import"
              className="border border-border hover:border-primary bg-primary/5 px-3 py-1.5 font-mono text-[11px] text-primary transition-colors"
            >
              Go to Importer
            </Link>
          </div>
        </div>

        {/* Verification Area */}
        {unverified.length > 0 ? (
          <div className="mt-10 grid gap-8 lg:grid-cols-12">
            {/* Question viewer/editor */}
            <div className="lg:col-span-8 space-y-6">
              <div className="border border-border bg-card p-6 space-y-6">
                {/* Meta details */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 font-mono text-[11px] text-muted-foreground">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="border border-border px-2 py-0.5 uppercase bg-muted/20">
                      {current.subject}
                    </span>
                    {current.topic && (
                      <span className="border border-border px-2 py-0.5 bg-muted/20">
                        {current.topic}
                      </span>
                    )}
                    <span className="border border-border px-2 py-0.5 text-primary">
                      {current.type}
                    </span>
                    <span className="border border-border px-2 py-0.5">
                      {current.marks} Marks
                    </span>
                  </div>
                  <span className="tabular-nums">
                    Question {index + 1} of {unverified.length}
                  </span>
                </div>

                {isEditing ? (
                  /* Edit form */
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSaveEdit()
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block font-mono text-[10px] text-muted-foreground uppercase">
                        Question Stem
                      </label>
                      <textarea
                        value={editForm.text ?? ""}
                        onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                        rows={6}
                        className="mt-1.5 w-full border border-border bg-muted/20 p-3 font-mono text-[11px] focus:border-primary focus:outline-none"
                        required
                        aria-label="Edit question stem"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] text-muted-foreground uppercase">
                        Code Monospace Block (Optional)
                      </label>
                      <textarea
                        value={editForm.code ?? ""}
                        onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                        rows={4}
                        className="mt-1.5 w-full border border-border bg-muted/20 p-3 font-mono text-[11px] focus:border-primary focus:outline-none"
                        aria-label="Edit code monospace block"
                      />
                    </div>

                    {/* Options (for MCQ / MSQ) */}
                    {(current.type === "MCQ" || current.type === "MSQ") && (
                      <div className="space-y-2">
                        <label className="block font-mono text-[10px] text-muted-foreground uppercase">
                          Options
                        </label>
                        {(editForm.options ?? ["", "", "", ""]).map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2">
                            <span className="font-mono text-sm font-semibold w-5 shrink-0">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => handleOptionChange(oIdx, e.target.value)}
                              className="w-full border border-border bg-muted/20 px-3 py-1.5 font-mono text-[11px] focus:border-primary focus:outline-none"
                              aria-label={`Option ${String.fromCharCode(65 + oIdx)}`}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block font-mono text-[10px] text-muted-foreground uppercase">
                          Correct Answer
                        </label>
                        {current.type === "MCQ" && (
                          <select
                            value={String(editForm.answer)}
                            onChange={(e) => setEditForm({ ...editForm, answer: Number(e.target.value) })}
                            className="mt-1.5 w-full border border-border bg-card p-2 font-mono text-[11px]"
                            aria-label="MCQ Correct option select"
                          >
                            {(editForm.options ?? ["", "", "", ""]).map((_, oIdx) => (
                              <option key={oIdx} value={oIdx}>
                                Option {String.fromCharCode(65 + oIdx)}
                              </option>
                            ))}
                          </select>
                        )}
                        {current.type === "MSQ" && (
                          <input
                            type="text"
                            value={Array.isArray(editForm.answer) ? editForm.answer.join(", ") : String(editForm.answer)}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                answer: e.target.value.split(/[,\s]+/).map(Number).filter((x) => !isNaN(x)),
                              })
                            }
                            className="mt-1.5 w-full border border-border bg-muted/20 px-3 py-1.5 font-mono text-[11px] focus:border-primary focus:outline-none"
                            placeholder="e.g. 0, 3 (for Options A & D)"
                            aria-label="MSQ Correct options input"
                          />
                        )}
                        {current.type === "NAT" && (
                          <input
                            type="text"
                            value={
                              typeof editForm.answer === "object"
                                ? JSON.stringify(editForm.answer)
                                : String(editForm.answer)
                            }
                            onChange={(e) => {
                              try {
                                const parsed = JSON.parse(e.target.value)
                                setEditForm({ ...editForm, answer: parsed })
                              } catch {
                                setEditForm({ ...editForm, answer: (parseFloat(e.target.value) || e.target.value) as any })
                              }
                            }}
                            className="mt-1.5 w-full border border-border bg-muted/20 px-3 py-1.5 font-mono text-[11px] focus:border-primary focus:outline-none"
                            placeholder="e.g. 10.5 or {'min': 10.4, 'max': 10.6}"
                            aria-label="NAT correct value input"
                          />
                        )}
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] text-muted-foreground uppercase">
                          Verification Source Link
                        </label>
                        <input
                          type="url"
                          value={editForm.verificationSource ?? ""}
                          onChange={(e) => setEditForm({ ...editForm, verificationSource: e.target.value })}
                          className="mt-1.5 w-full border border-border bg-muted/20 px-3 py-1.5 font-mono text-[11px] focus:border-primary focus:outline-none"
                          placeholder="e.g. http://gateoverflow.in/..."
                          aria-label="Verification source link"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] text-muted-foreground uppercase">
                        Worked Explanation
                      </label>
                      <textarea
                        value={editForm.explanation ?? ""}
                        onChange={(e) => setEditForm({ ...editForm, explanation: e.target.value })}
                        rows={4}
                        className="mt-1.5 w-full border border-border bg-muted/20 p-3 font-mono text-[11px] focus:border-primary focus:outline-none"
                        aria-label="Worked explanation"
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-3">
                      <button
                        type="submit"
                        className="border border-primary bg-primary px-4 py-2 font-mono text-[11px] text-primary-foreground tracking-wide"
                      >
                        Save Edits
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="border border-border px-4 py-2 font-mono text-[11px] text-muted-foreground hover:bg-muted"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Question rendering */
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <p className="text-[15px] font-medium leading-relaxed whitespace-pre-wrap">
                        {current.text}
                      </p>
                      {current.code && (
                        <pre className="border border-border bg-muted/20 p-4 font-mono text-[12px] leading-relaxed overflow-x-auto">
                          {current.code}
                        </pre>
                      )}
                    </div>

                    {/* Options */}
                    {(current.type === "MCQ" || current.type === "MSQ") && current.options && (
                      <ol className="grid gap-3 select-none" aria-label="Question options">
                        {current.options.map((opt, oIdx) => {
                          const isCorrectOpt =
                            current.type === "MCQ"
                              ? Number(current.answer) === oIdx
                              : Array.isArray(current.answer) && current.answer.includes(oIdx)
                          return (
                            <li
                              key={oIdx}
                              className={cn(
                                "flex items-start gap-3 border p-4",
                                isCorrectOpt
                                  ? "border-primary bg-primary/5"
                                  : "border-border bg-card"
                              )}
                            >
                              <span
                                className={cn(
                                  "flex size-5 shrink-0 items-center justify-center font-mono text-[11px] border",
                                  isCorrectOpt
                                    ? "border-primary text-primary bg-primary/10"
                                    : "border-border text-muted-foreground bg-secondary"
                                )}
                              >
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span className="text-sm">{opt}</span>
                            </li>
                          )
                        })}
                      </ol>
                    )}

                    {/* Answer for NAT */}
                    {current.type === "NAT" && (
                      <div className="border border-border bg-muted/10 p-4">
                        <p className="font-mono text-[10px] text-muted-foreground uppercase">
                          Correct Answer range/value
                        </p>
                        <p className="mt-1 font-mono text-base font-semibold text-primary">
                          {typeof current.answer === "object" && current.answer !== null
                            ? `${(current.answer as any).min} to ${(current.answer as any).max}`
                            : String(current.answer)}
                        </p>
                      </div>
                    )}

                    {/* Explanation */}
                    {current.explanation && (
                      <div className="border-t border-border pt-5 space-y-2">
                        <h4 className="font-mono text-[10px] text-muted-foreground uppercase">
                          Worked Explanation
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {current.explanation}
                        </p>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                      <button
                        type="button"
                        onClick={handleApprove}
                        className="inline-flex items-center gap-1.5 border border-primary bg-primary px-4 py-2 font-mono text-[11px] text-primary-foreground tracking-wide"
                        title="Press 'A' key"
                      >
                        <Check className="size-3.5" aria-hidden="true" />
                        Approve Question (A)
                      </button>
                      <button
                        type="button"
                        onClick={handleReject}
                        className="inline-flex items-center gap-1.5 border border-destructive bg-destructive/10 text-destructive px-4 py-2 font-mono text-[11px] tracking-wide hover:bg-destructive/20 transition-colors"
                        title="Press 'R' key"
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                        Reject &amp; Delete (R)
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-1.5 border border-border px-3 py-2 font-mono text-[11px] text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
                        title="Press 'E' key"
                      >
                        <Edit className="size-3.5" aria-hidden="true" />
                        Edit details (E)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Side pane (Nav & Details) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="border border-border p-5 space-y-4">
                <h3 className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
                  Queue Navigation
                </h3>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex-1 inline-flex items-center justify-center gap-1 border border-border py-2 font-mono text-[11px] text-muted-foreground hover:border-foreground hover:text-foreground"
                    title="Press Left Arrow"
                  >
                    <ChevronLeft className="size-4" aria-hidden="true" />
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(1)}
                    className="flex-1 inline-flex items-center justify-center gap-1 border border-border py-2 font-mono text-[11px] text-muted-foreground hover:border-foreground hover:text-foreground"
                    title="Press Right Arrow"
                  >
                    Next
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="border border-border max-h-60 overflow-y-auto">
                  {unverified.map((q, i) => (
                    <button
                      key={q.id}
                      onClick={() => setIndex(i)}
                      className={cn(
                        "w-full text-left px-3 py-2 border-b border-border last:border-0 font-mono text-[11px] flex items-center justify-between transition-colors",
                        i === index
                          ? "bg-primary/10 text-primary border-l-2 border-l-primary"
                          : "hover:bg-muted/10 text-muted-foreground"
                      )}
                    >
                      <span className="truncate max-w-[180px]">{q.text}</span>
                      <span className="shrink-0">{q.type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Source verification link */}
              {current.verificationSource && (
                <div className="border border-border p-5 space-y-3">
                  <h3 className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
                    Verification Source
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    This question specifies an external citation link. Open it to compare formulas or worked diagrams.
                  </p>
                  <a
                    href={current.verificationSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 font-mono text-[11px] text-primary hover:border-primary transition-colors w-full justify-center"
                  >
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                    Open Reference Link
                  </a>
                </div>
              )}

              {/* Tips pane */}
              <div className="border border-border p-5 space-y-2">
                <h3 className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                  Keyboard Shortcuts
                </h3>
                <ul className="space-y-1.5 font-mono text-[10px] text-muted-foreground">
                  <li>
                    <kbd className="border border-border px-1 py-0.5 bg-muted">A</kbd> Approve Question
                  </li>
                  <li>
                    <kbd className="border border-border px-1 py-0.5 bg-muted">R</kbd> Reject &amp; Delete
                  </li>
                  <li>
                    <kbd className="border border-border px-1 py-0.5 bg-muted">E</kbd> Edit Details
                  </li>
                  <li>
                    <kbd className="border border-border px-1 py-0.5 bg-muted">←</kbd> /{" "}
                    <kbd className="border border-border px-1 py-0.5 bg-muted">→</kbd> Navigate Queue
                  </li>
                  <li>
                    <kbd className="border border-border px-1 py-0.5 bg-muted">Esc</kbd> Blur inputs / Cancel edit
                  </li>
                  <li>
                    <kbd className="border border-border px-1 py-0.5 bg-muted">?</kbd> Toggle Cheat Sheet
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-12 border border-dashed border-border p-16 text-center max-w-xl mx-auto bg-card/25">
            <Check className="size-8 text-primary mx-auto" aria-hidden="true" />
            <h3 className="mt-4 font-semibold text-lg">Verification Queue Clear</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              All imported questions have been approved or rejected. Head back to the{" "}
              <Link href="/import" className="text-primary underline">
                Importer
              </Link>{" "}
              to load more.
            </p>
          </div>
        )}
      </div>

      {/* Cheatsheet overlay modal */}
      {showCheatsheet && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <div className="border border-border bg-card p-6 max-w-md w-full space-y-4">
            <h3 className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">
              Verification Queue Cheatsheet
            </h3>
            <table className="w-full font-mono text-[11px] text-left">
              <thead>
                <tr className="border-b border-border text-muted-foreground select-none">
                  <th className="py-2">Key</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-2"><kbd className="border border-border px-1 bg-muted">A</kbd></td>
                  <td className="py-2">Approve question (set verified = true, save)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2"><kbd className="border border-border px-1 bg-muted">R</kbd></td>
                  <td className="py-2">Reject question (deletes from browser database)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2"><kbd className="border border-border px-1 bg-muted">E</kbd></td>
                  <td className="py-2">Toggle inline details editor</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2"><kbd className="border border-border px-1 bg-muted">←</kbd></td>
                  <td className="py-2">Go to previous unverified question</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2"><kbd className="border border-border px-1 bg-muted">→</kbd></td>
                  <td className="py-2">Go to next unverified question</td>
                </tr>
                <tr>
                  <td className="py-2"><kbd className="border border-border px-1 bg-muted">Esc</kbd></td>
                  <td className="py-2">Blur inputs or close editor</td>
                </tr>
              </tbody>
            </table>
            <button
              type="button"
              onClick={() => setShowCheatsheet(false)}
              className="w-full border border-border py-2 font-mono text-[11px] hover:border-primary transition-colors uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
