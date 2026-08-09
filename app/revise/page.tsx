"use client"

/**
 * app/revise/page.tsx — SRS REVISION SESSION
 *
 * Spaced Repetition flashcard revision console running SM-2-lite over concepts.
 * Features:
 *  - Mixed session queue (Concept Recall, Formula Cards, Linked PYQs).
 *  - Capped daily due queue (max 15 items/day).
 *  - Overdue ranking by (examRelevance * overdueness) for missed days.
 *  - Spacebar to reveal answer, 1-4 key shortcuts for ratings.
 */

import { useState, useMemo, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Eye,
  Zap,
  Sparkles,
  BookOpen,
  ArrowRight,
  HelpCircle,
} from "lucide-react"
import { useCollection, useQuestionBank, useConcepts } from "@/lib/storage/hooks"
import { COLLECTIONS } from "@/lib/storage/store"
import { computeNextSrsCard, getOverduePriority } from "@/lib/srs/sm2"
import type { SrsCard, SrsRating, Concept } from "@/lib/domain/types"
import { LOCAL_USER_ID, GATE_CSE_EXAM_ID } from "@/lib/domain/types"
import { cn } from "@/lib/utils"

export default function RevisePage() {
  const { data: srsCards, put: putSrsCard, loading: srsLoading } = useCollection(COLLECTIONS.srsCards)
  const { questionMap, loading: bankLoading } = useQuestionBank()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)

  const allConcepts = useConcepts()

  // Build due queue for today, capped at 15 cards max
  const queue = useMemo(() => {
    const todayIso = new Date().toISOString().slice(0, 10)
    const cardMap = new Map(srsCards.map((c) => [c.conceptId, c]))

    const queueItems: { card: SrsCard; concept: Concept }[] = []

    for (const concept of allConcepts) {
      let card = cardMap.get(concept.id)
      if (!card) {
        // Uninitialized SRS card fallback
        card = {
          userId: LOCAL_USER_ID,
          examId: GATE_CSE_EXAM_ID,
          id: `srs-${concept.id}`,
          conceptId: concept.id,
          interval: 1,
          easeFactor: 2.5,
          dueDate: todayIso,
          masteryState: "untouched",
          repetitions: 0,
        }
      }

      if (card.dueDate <= todayIso || card.masteryState === "untouched") {
        queueItems.push({ card, concept })
      }
    }

    // Sort by priority (overdueness * examRelevance)
    queueItems.sort((a, b) => getOverduePriority(b.card, b.concept) - getOverduePriority(a.card, a.concept))

    // Cap at 15 cards per session
    return queueItems.slice(0, 15)
  }, [allConcepts, srsCards])

  const currentItem = queue[currentIndex] || null

  // Rating action handler
  const handleRate = useCallback(
    async (rating: SrsRating) => {
      if (!currentItem) return

      const updatedCard = computeNextSrsCard(currentItem.card, rating)
      await putSrsCard(updatedCard)

      setIsRevealed(false)
      setCompletedCount((prev) => prev + 1)
      setCurrentIndex((prev) => prev + 1)
    },
    [currentItem, putSrsCard]
  )

  // Keyboard hotkey listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.code === "Space") {
        e.preventDefault()
        setIsRevealed((r) => !r)
      } else if (isRevealed) {
        if (e.key === "1") handleRate("again")
        else if (e.key === "2") handleRate("hard")
        else if (e.key === "3") handleRate("good")
        else if (e.key === "4") handleRate("easy")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isRevealed, handleRate])

  if (srsLoading || bankLoading) {
    return (
      <main className="mx-auto max-w-[1600px] px-4 py-20 md:px-8">
        <p className="font-mono text-[11px] text-muted-foreground animate-pulse">
          Loading SRS due queue…
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-dvh flex flex-col bg-background">
      <div className="mx-auto max-w-4xl w-full px-4 py-10 md:px-8 flex-1 flex flex-col justify-between space-y-8">
        {/* Header & Progress */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
                SRS Revision &middot; SM-2 Engine
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">Active Recall Session</h1>
            </div>

            <div className="font-mono text-xs text-muted-foreground">
              {queue.length > 0 ? (
                <span>
                  Card <strong className="text-primary">{currentIndex + 1}</strong> of {queue.length}
                </span>
              ) : (
                <span className="text-primary font-semibold">Queue Clear</span>
              )}
            </div>
          </div>

          {/* Session Progress Bar */}
          {queue.length > 0 && (
            <div className="mt-4 h-1.5 w-full bg-border overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(currentIndex / queue.length) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Card Content Area */}
        {currentItem ? (
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div
              onClick={() => setIsRevealed(!isRevealed)}
              className={cn(
                "border p-8 min-h-[320px] flex flex-col justify-between cursor-pointer transition-all bg-card shadow-lg relative group select-none",
                isRevealed ? "border-primary/80" : "border-border hover:border-primary/50"
              )}
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground uppercase border-b border-border/60 pb-3">
                  <span className="text-primary font-semibold">{currentItem.concept.subjectId}</span>
                  <span>Exam Relevance: ★{currentItem.concept.examRelevance}</span>
                </div>

                <h2 className="mt-6 text-2xl font-bold text-foreground leading-snug">
                  {currentItem.concept.label}
                </h2>
              </div>

              {/* Revealed Answer Side */}
              {isRevealed ? (
                <div className="mt-6 space-y-4 pt-4 border-t border-border animate-in fade-in duration-200">
                  <div>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase">Summary</p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground">
                      {currentItem.concept.summary}
                    </p>
                  </div>

                  {currentItem.concept.formula && (
                    <div>
                      <p className="font-mono text-[10px] text-primary uppercase">Formula</p>
                      <div className="mt-1 font-mono text-xs bg-primary/10 border border-primary/30 p-3 text-primary">
                        {currentItem.concept.formula}
                      </div>
                    </div>
                  )}

                  {currentItem.concept.complexity && (
                    <div>
                      <p className="font-mono text-[10px] text-muted-foreground uppercase">Complexity</p>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {currentItem.concept.complexity}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-12 text-center py-6 border border-dashed border-border bg-background/50">
                  <Eye className="size-6 text-primary mx-auto opacity-70 group-hover:scale-110 transition-transform" />
                  <p className="mt-2 font-mono text-xs text-muted-foreground">
                    Click card or press <kbd className="border border-border px-1.5 py-0.5 bg-card">Space</kbd> to reveal answer
                  </p>
                </div>
              )}
            </div>

            {/* Self-Rating Buttons (only active when revealed) */}
            {isRevealed && (
              <div className="grid gap-3 sm:grid-cols-4 animate-in slide-in-from-bottom-2 duration-200">
                <button
                  type="button"
                  onClick={() => handleRate("again")}
                  className="border border-red-500/50 bg-red-500/10 p-3 text-red-400 hover:bg-red-500/20 font-mono text-xs text-center transition-colors"
                >
                  <span className="block font-bold">1. Again</span>
                  <span className="text-[10px] opacity-75">1 day (Reset)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRate("hard")}
                  className="border border-amber-500/50 bg-amber-500/10 p-3 text-amber-400 hover:bg-amber-500/20 font-mono text-xs text-center transition-colors"
                >
                  <span className="block font-bold">2. Hard</span>
                  <span className="text-[10px] opacity-75">Maintain interval</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRate("good")}
                  className="border border-blue-500/50 bg-blue-500/10 p-3 text-blue-400 hover:bg-blue-500/20 font-mono text-xs text-center transition-colors"
                >
                  <span className="block font-bold">3. Good</span>
                  <span className="text-[10px] opacity-75">Next step</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRate("easy")}
                  className="border border-emerald-500/50 bg-emerald-500/10 p-3 text-emerald-400 hover:bg-emerald-500/20 font-mono text-xs text-center transition-colors"
                >
                  <span className="block font-bold">4. Easy</span>
                  <span className="text-[10px] opacity-75">Jump 2 steps</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Session Completed View */
          <div className="my-16 border border-primary bg-primary/5 p-12 text-center space-y-6 max-w-xl mx-auto">
            <CheckCircle2 className="size-12 text-primary mx-auto" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">Session Completed!</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                You reviewed {completedCount} SRS cards today. Your memory retention is on track.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <Link
                href="/map"
                className="inline-flex items-center gap-2 border border-primary bg-primary px-5 py-2.5 font-mono text-xs text-primary-foreground uppercase tracking-wide font-semibold hover:opacity-90 transition-opacity"
              >
                Explore Concept Map
              </Link>
              <Link
                href="/"
                className="border border-border bg-card px-5 py-2.5 font-mono text-xs text-foreground uppercase tracking-wide hover:border-primary transition-colors"
              >
                Return to Command Center
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
