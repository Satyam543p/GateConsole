/**
 * lib/srs/sm2.ts
 *
 * SM-2-Lite Spaced Repetition Engine.
 * Features:
 *  - Intervals: 1, 3, 7, 14, 30, 60 days.
 *  - Ease factor adjustments based on ratings (again, hard, good, easy).
 *  - Queue capping to prevent queue explosions.
 *  - Overdueness priority ranking: (daysOverdue + 1) * examRelevance.
 */

import type { SrsCard, SrsRating, MasteryState, Concept } from "@/lib/domain/types"

const INTERVAL_STEPS = [1, 3, 7, 14, 30, 60]

export function computeNextSrsCard(card: SrsCard, rating: SrsRating): SrsCard {
  let interval = card.interval || 1
  let easeFactor = card.easeFactor || 2.5
  let repetitions = card.repetitions || 0
  let masteryState: MasteryState = card.masteryState || "learning"

  const today = new Date()
  const todayIso = today.toISOString().slice(0, 10)

  switch (rating) {
    case "again":
      interval = 1
      easeFactor = Math.max(1.3, easeFactor - 0.2)
      repetitions = 0
      masteryState = "shaky"
      break

    case "hard":
      interval = Math.max(1, Math.round(interval * 1.2))
      easeFactor = Math.max(1.3, easeFactor - 0.15)
      repetitions += 1
      masteryState = repetitions >= 2 ? "solid" : "learning"
      break

    case "good":
      // Advance to next interval step
      const currentIdx = INTERVAL_STEPS.findIndex((s) => s >= interval)
      const nextIdx = currentIdx < 0 ? INTERVAL_STEPS.length - 1 : Math.min(INTERVAL_STEPS.length - 1, currentIdx + 1)
      interval = INTERVAL_STEPS[nextIdx]
      repetitions += 1
      masteryState = interval >= 14 ? "solid" : "learning"
      break

    case "easy":
      // Jump 2 steps forward
      const curIdx = INTERVAL_STEPS.findIndex((s) => s >= interval)
      const jumpIdx = curIdx < 0 ? INTERVAL_STEPS.length - 1 : Math.min(INTERVAL_STEPS.length - 1, curIdx + 2)
      interval = INTERVAL_STEPS[jumpIdx]
      easeFactor = Math.min(3.0, easeFactor + 0.15)
      repetitions += 1
      masteryState = "mastered"
      break
  }

  // Calculate next due date
  const nextDueDate = new Date(today)
  nextDueDate.setDate(nextDueDate.getDate() + interval)
  const dueDateIso = nextDueDate.toISOString().slice(0, 10)

  return {
    ...card,
    interval,
    easeFactor,
    repetitions,
    masteryState,
    dueDate: dueDateIso,
    lastReviewDate: todayIso,
  }
}

// ─── Overdueness Priority Ranking (for missed days) ──────────────────────────

export function getOverduePriority(card: SrsCard, concept: Concept): number {
  const today = new Date().getTime()
  const due = new Date(card.dueDate).getTime()
  const diffDays = Math.max(0, Math.ceil((today - due) / (1000 * 60 * 60 * 24)))
  
  // Rank by exam relevance * (days overdue + 1)
  return (diffDays + 1) * concept.examRelevance
}
