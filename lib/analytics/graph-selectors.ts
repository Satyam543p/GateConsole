/**
 * lib/analytics/graph-selectors.ts
 *
 * Derived functions for concept graph mastery calculations, prerequisite tree
 * traversals, and bridge concept discovery.
 */

import type { Concept, MasteryState, StoredAttempt, SrsCard, Question } from "@/lib/domain/types"

// ─── Derive Mastery State ───────────────────────────────────────────────────

let attemptCache = new WeakMap<StoredAttempt[], {
  byQid: Map<string, { total: number, correct: number }>,
  bySubject: Map<string, { total: number, correct: number }>
}>()

export function deriveMasteryState(
  concept: Concept,
  attempts: StoredAttempt[],
  srsCards: SrsCard[],
  questionMap: Map<string, Question>
): MasteryState {
  const card = srsCards.find((c) => c.conceptId === concept.id)
  
  if (!attemptCache.has(attempts)) {
    const byQid = new Map<string, { total: number, correct: number }>()
    const bySubject = new Map<string, { total: number, correct: number }>()
    
    for (const a of attempts) {
      if (!a.questionIds || !a.responses) continue
      for (const qid of a.questionIds) {
        const q = questionMap.get(qid)
        if (!q) continue
        
        const resp = a.responses[qid]
        let isCorr = false
        if (resp !== undefined && resp !== null) {
          if (q.type === "MCQ" && resp === q.answer) isCorr = true
          else if (q.type === "NAT" && typeof q.answer === "number" && Number(resp) === q.answer) isCorr = true
          else if (q.type === "MSQ" && Array.isArray(resp) && Array.isArray(q.answer)) {
            if (resp.length === q.answer.length && resp.every((v) => (q.answer as number[]).includes(v))) {
              isCorr = true
            }
          }
        }
        
        // by Qid
        let qStats = byQid.get(qid)
        if (!qStats) {
          qStats = { total: 0, correct: 0 }
          byQid.set(qid, qStats)
        }
        qStats.total++
        if (isCorr) qStats.correct++
        
        // by Subject
        if (q.subject) {
          let sStats = bySubject.get(q.subject)
          if (!sStats) {
            sStats = { total: 0, correct: 0 }
            bySubject.set(q.subject, sStats)
          }
          sStats.total++
          if (isCorr) sStats.correct++
        }
      }
    }
    attemptCache.set(attempts, { byQid, bySubject })
  }

  const { byQid, bySubject } = attemptCache.get(attempts)!
  
  let totalAttempts = 0
  let correctAttempts = 0
  let hasSpecificQids = false

  const linkedPyqIds = concept.pyqIds || []
  for (const qid of linkedPyqIds) {
    const stats = byQid.get(qid)
    if (stats) {
      hasSpecificQids = true
      totalAttempts += stats.total
      correctAttempts += stats.correct
    }
  }

  if (!hasSpecificQids && concept.subjectId) {
    const sStats = bySubject.get(concept.subjectId)
    if (sStats) {
      totalAttempts = sStats.total
      correctAttempts = sStats.correct
    }
  }

  if (totalAttempts === 0 && !card) {
    return "untouched"
  }

  const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 50

  if (card) {
    if (card.interval >= 14 && accuracy >= 80) return "mastered"
    if (card.interval >= 7 && accuracy >= 65) return "solid"
    if (accuracy < 50) return "shaky"
    return "learning"
  }

  if (accuracy >= 85 && totalAttempts >= 3) return "mastered"
  if (accuracy >= 70) return "solid"
  if (accuracy >= 40) return "shaky"
  return "learning"
}

// ─── Prerequisite Chain Traversal ───────────────────────────────────────────

export function getPrerequisiteChain(
  targetConceptId: string,
  allConcepts: Concept[]
): Set<string> {
  const chain = new Set<string>()
  const conceptMap = new Map(allConcepts.map((c) => [c.id, c]))

  function traverse(id: string) {
    const concept = conceptMap.get(id)
    if (!concept || !concept.prerequisites) return

    for (const preId of concept.prerequisites) {
      if (!chain.has(preId)) {
        chain.add(preId)
        traverse(preId)
      }
    }
  }

  traverse(targetConceptId)
  return chain
}

// ─── Bridge Concepts (Key bottleneck nodes ranked by out-degree × relevance) ─

export interface BridgeConceptStat {
  concept: Concept
  outDegree: number
  impactScore: number
}

export function getBridgeConcepts(allConcepts: Concept[]): BridgeConceptStat[] {
  const outDegreeMap = new Map<string, number>()

  // Calculate how many downstream concepts depend on each prerequisite
  for (const c of allConcepts) {
    for (const preId of c.prerequisites || []) {
      outDegreeMap.set(preId, (outDegreeMap.get(preId) || 0) + 1)
    }
  }

  const result: BridgeConceptStat[] = allConcepts.map((concept) => {
    const outDegree = outDegreeMap.get(concept.id) || 0
    const impactScore = outDegree * concept.examRelevance
    return {
      concept,
      outDegree,
      impactScore,
    }
  })

  // Sort by highest impact score first
  result.sort((a, b) => b.impactScore - a.impactScore)
  return result
}
