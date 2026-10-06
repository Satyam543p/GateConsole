"use client"

/**
 * components/scratchpad.tsx
 *
 * On-screen digital scratchpad for calculation notes during test attempts.
 */

import { useState } from "react"
import { X, FileEdit, Trash2, Copy, Check } from "lucide-react"

export function Scratchpad({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("")
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 w-[min(24rem,calc(100vw-2rem))] border-[3px] border-[#1F2937] bg-white shadow-neo rounded-2xl overflow-hidden font-mono">
      {/* Header */}
      <div className="bg-[#CE82FF] border-b-[3px] border-[#1F2937] px-3 py-2.5 text-white flex items-center justify-between font-black text-[11px] uppercase tracking-wider">
        <span className="flex items-center gap-2">
          <FileEdit className="size-4" strokeWidth={2.5} />
          Digital Scratchpad
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setText("")}
            className="hover:bg-white/20 p-1.5 rounded-md transition-colors"
            title="Clear Scratchpad"
          >
            <Trash2 className="size-3.5" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="hover:bg-white/20 p-1.5 rounded-md transition-colors"
            title="Copy Text"
          >
            {copied ? <Check className="size-3.5" strokeWidth={2.5} /> : <Copy className="size-3.5" strokeWidth={2.5} />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="hover:bg-white/20 p-1.5 rounded-md transition-colors"
          >
            <X className="size-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Text Area */}
      <div className="p-3 bg-[#FAFBFF]">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Use this scratchpad for rough calculations, variable tracking, or binary/hex steps..."
          className="w-full h-48 border-[3px] border-[#1F2937] bg-white p-3 font-mono text-xs text-[#1F2937] placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-[#CE82FF]/30 resize-none rounded-xl shadow-neo-sm transition-all"
        />
        <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-[#CE82FF] text-right px-1">
          {text.length} characters
        </p>
      </div>
    </div>
  )
}
