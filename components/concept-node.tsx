"use client"

/**
 * components/concept-node.tsx
 *
 * Custom @xyflow/react Node matching technical theme:
 *  - Sharp 90-degree corners.
 *  - Monospace font.
 *  - Border encoding examRelevance (1-5).
 *  - Fill color encoding derived masteryState.
 */

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import type { Concept, MasteryState } from "@/lib/domain/types"
import { cn } from "@/lib/utils"

export interface ConceptNodeData extends Record<string, unknown> {
  concept: Concept
  masteryState: MasteryState
  isHighlighted?: boolean
  isDimmed?: boolean
  isRecallMode?: boolean
}

export const ConceptNode = memo(({ data }: NodeProps) => {
  const { concept, masteryState, isHighlighted, isDimmed, isRecallMode } = data as ConceptNodeData

  // Mastery state fill styles
  const masteryStyles: Record<MasteryState, string> = {
    untouched: "bg-white text-[#1F2937]",
    learning: "bg-[#1CB0F6] text-white",
    shaky: "bg-[#FFC800] text-[#1F2937]",
    solid: "bg-[#58CC02] text-white",
    mastered: "bg-[#CE82FF] text-white",
  }

  return (
    <div
      className={cn(
        "px-4 py-3 font-heading text-[13px] font-black transition-all relative select-none cursor-pointer min-w-[160px] max-w-[240px] rounded-[12px] border-[3px] border-[#1F2937] shadow-neo-sm hover:-translate-y-1 hover:shadow-neo",
        masteryStyles[masteryState] || masteryStyles.untouched,
        isHighlighted && "ring-4 ring-[#FF9600] scale-105 z-20",
        isDimmed && "opacity-30 filter grayscale"
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-[#1F2937] !w-3 !h-3 !border-none !rounded-full" />

      <div className="flex items-center justify-between gap-2 border-b-[2px] border-current/20 pb-1 mb-2 font-heading text-[10px] uppercase tracking-wider font-bold">
        <span>{concept.subjectId}</span>
        <span>★ {concept.examRelevance}</span>
      </div>

      <div className="font-medium text-[11px] leading-tight">
        {concept.label}
      </div>

      {!isRecallMode && concept.complexity && (
        <div className="mt-1 font-mono text-[9px] opacity-60 truncate">
          {concept.complexity}
        </div>
      )}

      {isRecallMode && (
        <div className="mt-1 font-mono text-[9px] text-amber-400 animate-pulse">
          [Click to recall]
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-primary !w-2 !h-2 !rounded-none" />
    </div>
  )
})

ConceptNode.displayName = "ConceptNode"
