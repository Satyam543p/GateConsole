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
    <div className="fixed bottom-6 left-6 z-50 w-96 border-2 border-primary bg-card shadow-2xl font-mono">
      {/* Header */}
      <div className="bg-primary px-3 py-2 text-primary-foreground flex items-center justify-between font-bold text-xs uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <FileEdit className="size-3.5" />
          Digital Exam Scratchpad
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setText("")}
            className="hover:opacity-75 transition-opacity"
            title="Clear Scratchpad"
          >
            <Trash2 className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="hover:opacity-75 transition-opacity"
            title="Copy Text"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="hover:opacity-75 transition-opacity"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Text Area */}
      <div className="p-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Use this scratchpad for rough calculations, variable tracking, or binary/hex steps..."
          className="w-full h-48 border border-border bg-background p-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-primary outline-none resize-none"
        />
        <p className="mt-1.5 text-[10px] text-muted-foreground text-right">
          {text.length} characters
        </p>
      </div>
    </div>
  )
}
