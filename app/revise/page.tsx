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
import { FormattedContent } from "@/components/formatted-content"

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
    <main className="w-full overflow-x-hidden min-h-dvh flex flex-col bg-transparent pt-4 md:pt-10 pb-28 md:pb-56 px-4 md:px-6 max-w-5xl mx-auto space-y-4 md:space-y-8 animate-in fade-in duration-300">
      <div className="w-full flex-1 flex flex-col justify-between space-y-4 md:space-y-6 min-w-0">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary-text hover:text-foreground transition-colors"
        >
          <ArrowRight className="size-3.5 rotate-180" /> Back to Dashboard
        </Link>

        {/* Header & Progress */}
        <div className="border-b-2 border-[#1F2937]/15 pb-4 sm:pb-6 min-w-0">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] sm:text-xs font-bold tracking-widest text-[#CE82FF] uppercase">
                SRS Revision &middot; SM-2 Memory Engine
              </p>
              <h1 className="mt-1 text-2xl sm:text-3xl font-heading font-black text-primary-text uppercase tracking-tight truncate">
                Active Recall Session
              </h1>
            </div>

            <div className="font-mono text-xs font-bold shrink-0">
              {queue.length > 0 ? (
                <span className="bg-[#DDF4FF] border-2 border-[#1F2937] text-[#1899D6] px-2.5 sm:px-3 py-1 rounded-xl shadow-neo-xs whitespace-nowrap inline-block">
                  Card <strong className="text-foreground">{currentIndex + 1}</strong> of {queue.length}
                </span>
              ) : (
                <span className="bg-[#F0FFF4] border-2 border-[#58CC02] text-[#58CC02] px-2.5 sm:px-3 py-1 rounded-xl shadow-neo-xs font-black whitespace-nowrap inline-block">Queue Clear</span>
              )}
            </div>
          </div>

          {/* Session Progress Bar */}
          {queue.length > 0 && (
            <div className="mt-3 sm:mt-4 h-3 w-full bg-white border-2 border-[#1F2937] rounded-full overflow-hidden p-0.5 shadow-neo-xs">
              <div
                className="h-full bg-[#58CC02] rounded-full transition-all duration-300"
                style={{ width: `${(currentIndex / queue.length) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Card Content Area */}
        {currentItem ? (
          <div className="flex-1 flex flex-col justify-center space-y-4 sm:space-y-6 min-w-0">
            <div
              onClick={() => setIsRevealed(!isRevealed)}
              className={cn(
                "neo-card min-w-0 border-3 border-[#1F2937] rounded-3xl p-5 sm:p-8 min-h-[300px] sm:min-h-[340px] flex flex-col justify-between cursor-pointer transition-all bg-white shadow-neo relative group select-none hover:-translate-y-0.5",
                isRevealed ? "ring-2 ring-[#CE82FF]" : "hover:border-[#1CB0F6]"
              )}
            >
              <div>
                <div className="flex items-center justify-between font-mono text-xs text-secondary-text uppercase border-b-2 border-[#1F2937]/10 pb-3 sm:pb-4">
                  <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-[#E5F6FF] text-[#1899D6] font-black border border-[#1F2937]/20">
                    {currentItem.concept.subjectId}
                  </span>
                  <span className="bg-[#FFC800] text-[#1F2937] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg font-black border border-[#1F2937]/30 shadow-neo-xs">
                    ★ {currentItem.concept.examRelevance} / 5
                  </span>
                </div>

                <h2 className="mt-4 sm:mt-6 text-xl sm:text-2xl md:text-3xl font-heading font-black text-foreground leading-snug">
                  {currentItem.concept.label}
                </h2>
              </div>

              {/* Revealed Answer Side */}
              {isRevealed ? (
                <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t-2 border-[#1F2937]/10 animate-in fade-in duration-200 min-w-0">
                  <div>
                    <p className="font-mono text-[11px] sm:text-xs font-black text-secondary-text uppercase tracking-wider">Concept Summary</p>
                    <p className="mt-1 text-xs sm:text-sm font-medium leading-relaxed text-foreground">
                      {currentItem.concept.summary}
                    </p>
                  </div>

                  {currentItem.concept.formula && (
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] sm:text-xs font-black text-[#1CB0F6] uppercase tracking-wider">Formula / Equation</p>
                      <div className="mt-1 font-mono text-xs bg-[#FAFBFF] border-2 border-[#1CB0F6]/40 p-3 rounded-xl text-[#1899D6] overflow-x-auto shadow-neo-xs min-w-0">
                        <FormattedContent content={currentItem.concept.formula.includes("$") ? currentItem.concept.formula : `$${currentItem.concept.formula}$`} />
                      </div>
                    </div>
                  )}

                  {currentItem.concept.complexity && (
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] sm:text-xs font-black text-secondary-text uppercase tracking-wider mb-1">
                        Complexity
                      </p>
                      <div className="font-mono text-xs font-black text-[#FF9600] overflow-x-auto custom-scrollbar pb-1 min-w-0">
                        {currentItem.concept.complexity}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-6 sm:mt-10 text-center py-6 sm:py-8 border-2 border-dashed border-[#1F2937]/20 rounded-2xl bg-[#FAFBFF]">
                  <Eye className="size-6 sm:size-8 text-[#1CB0F6] mx-auto group-hover:scale-110 transition-transform" />
                  <p className="mt-2 sm:mt-3 font-heading font-bold text-xs sm:text-sm text-foreground">
                    <span className="hidden sm:inline">Click card or press <kbd className="border-2 border-[#1F2937] px-2 py-0.5 rounded-md bg-white font-mono text-xs font-black shadow-neo-xs">Space</kbd> to reveal answer</span>
                    <span className="sm:hidden">Tap card to reveal answer</span>
                  </p>
                </div>
              )}
            </div>

            {/* Self-Rating Buttons (only active when revealed) */}
            {isRevealed && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 animate-in slide-in-from-bottom-2 duration-200">
                <button
                  type="button"
                  onClick={() => handleRate("again")}
                  className="neo-btn bg-[#FF4B4B] text-white p-2.5 sm:p-3.5 rounded-2xl text-center shadow-neo-sm hover:-translate-y-0.5"
                >
                  <span className="block font-heading font-black text-xs sm:text-sm uppercase">1. Again</span>
                  <span className="text-[10px] sm:text-[11px] font-mono opacity-90 block mt-0.5">Reset (1 day)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRate("hard")}
                  className="neo-btn bg-[#FF9600] text-white p-2.5 sm:p-3.5 rounded-2xl text-center shadow-neo-sm hover:-translate-y-0.5"
                >
                  <span className="block font-heading font-black text-xs sm:text-sm uppercase">2. Hard</span>
                  <span className="text-[10px] sm:text-[11px] font-mono opacity-90 block mt-0.5">Keep interval</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRate("good")}
                  className="neo-btn bg-[#1CB0F6] text-white p-2.5 sm:p-3.5 rounded-2xl text-center shadow-neo-sm hover:-translate-y-0.5"
                >
                  <span className="block font-heading font-black text-xs sm:text-sm uppercase">3. Good</span>
                  <span className="text-[10px] sm:text-[11px] font-mono opacity-90 block mt-0.5">Next step</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRate("easy")}
                  className="neo-btn bg-[#58CC02] text-white p-2.5 sm:p-3.5 rounded-2xl text-center shadow-neo-sm hover:-translate-y-0.5"
                >
                  <span className="block font-heading font-black text-sm uppercase">4. Easy</span>
                  <span className="text-[11px] font-mono opacity-90 block mt-0.5">Jump 2 steps</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Session Completed View */
          <div className="my-12 neo-card bg-[#F0FFF4] border-3 border-[#58CC02] p-10 text-center space-y-6 max-w-xl mx-auto rounded-3xl shadow-neo">
            <CheckCircle2 className="size-16 text-[#58CC02] mx-auto" />
            <div>
              <h2 className="text-3xl font-heading font-black text-foreground uppercase tracking-tight">Session Completed!</h2>
              <p className="mt-2 text-sm font-bold text-secondary-text">
                You reviewed {completedCount} SRS cards today. Your memory retention is reinforced.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <Link
                href="/map"
                className="neo-btn bg-[#1CB0F6] text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider"
              >
                Explore Concept Map
              </Link>
              <Link
                href="/"
                className="neo-btn bg-white text-primary-text px-5 py-2.5 text-xs font-black uppercase tracking-wider"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
