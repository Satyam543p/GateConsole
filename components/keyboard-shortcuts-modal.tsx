"use client"

/**
 * components/keyboard-shortcuts-modal.tsx
 *
 * Global keyboard shortcuts listener & cheatsheet overlay.
 * Features:
 *  - Pressing `?` anywhere (outside input fields) toggles hotkey cheatsheet modal.
 *  - Vim-style chorded navigation (`g h`, `g p`, `g t`, `g m`, `g r`, `g f`, `g a`, `g c`).
 */

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { X, Command, Keyboard } from "lucide-react"

export function KeyboardShortcutsModal({
  openExternal,
  onCloseExternal,
}: {
  openExternal?: boolean
  onCloseExternal?: () => void
}) {
  const router = useRouter()
  const [internalOpen, setInternalOpen] = useState(false)
  const gPressedRef = useRef(false)
  const gTimerRef = useRef<number | null>(null)

  const isOpen = openExternal !== undefined ? openExternal : internalOpen
  const closeModal = () => {
    if (onCloseExternal) onCloseExternal()
    else setInternalOpen(false)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      const isEditable = (e.target as HTMLElement)?.isContentEditable
      if (tag === "INPUT" || tag === "TEXTAREA" || isEditable) return

      // Toggle modal on `?`
      if (e.key === "?") {
        e.preventDefault()
        setInternalOpen((prev) => !prev)
        return
      }

      // Close modal on Escape
      if (e.key === "Escape" && isOpen) {
        closeModal()
        return
      }

      // Vim-style `g + key` navigation
      if (e.key === "g" && !gPressedRef.current) {
        gPressedRef.current = true
        if (gTimerRef.current) window.clearTimeout(gTimerRef.current)
        gTimerRef.current = window.setTimeout(() => {
          gPressedRef.current = false
        }, 1000)
        return
      }

      if (gPressedRef.current) {
        gPressedRef.current = false
        if (gTimerRef.current) window.clearTimeout(gTimerRef.current)

        const routes: Record<string, string> = {
          h: "/",
          d: "/todo",
          a: "/analysis",
          c: "/map",
          r: "/revise",
          f: "/formulas",
          t: "/tests",
          s: "/settings",
          i: "/import",
        }

        if (routes[e.key]) {
          e.preventDefault()
          router.push(routes[e.key])
          closeModal()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, router])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl border-2 border-primary bg-card p-6 font-mono space-y-6 shadow-neo rounded-[16px]">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <Keyboard className="size-5 text-primary" />
            <h2 className="text-lg">Keyboard Shortcuts Cheatsheet</h2>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 -m-2"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 text-xs">
          {/* Section 1: Vim Navigation */}
          <div className="space-y-3">
            <h3 className="text-primary font-bold tracking-wider uppercase text-[10px]">
              Vim Navigation (g + key)
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center justify-between">
                <span>Command Center</span>
                <kbd className="border border-border bg-background px-2 py-0.5 text-[10px] text-foreground">g h</kbd>
              </li>
              <li className="flex items-center justify-between">
                <span>To-Do List</span>
                <kbd className="border border-border bg-background px-2 py-0.5 text-[10px] text-foreground">g d</kbd>
              </li>
              <li className="flex items-center justify-between">
                <span>Priority Matrix</span>
                <kbd className="border border-border bg-background px-2 py-0.5 text-[10px] text-foreground">g a</kbd>
              </li>
              <li className="flex items-center justify-between">
                <span>Concept Map</span>
                <kbd className="border border-border bg-background px-2 py-0.5 text-[10px] text-foreground">g c</kbd>
              </li>
              <li className="flex items-center justify-between">
                <span>SRS Revision</span>
                <kbd className="border border-border bg-background px-2 py-0.5 text-[10px] text-foreground">g r</kbd>
              </li>
              <li className="flex items-center justify-between">
                <span>Formulas</span>
                <kbd className="border border-border bg-background px-2 py-0.5 text-[10px] text-foreground">g f</kbd>
              </li>
              <li className="flex items-center justify-between">
                <span>Tests</span>
                <kbd className="border border-border bg-background px-2 py-0.5 text-[10px] text-foreground">g e</kbd>
              </li>

            </ul>
          </div>

          {/* Section 2: Exam & Flashcard Controls */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-primary font-bold tracking-wider uppercase text-[10px]">
                Exam Runner &amp; Tools
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center justify-between">
                  <span>Next / Previous Question</span>
                  <kbd className="border border-border bg-background px-2 py-0.5 text-[10px] text-foreground">← / →</kbd>
                </li>
                <li className="flex items-center justify-between">
                  <span>Select Options A–D</span>
                  <kbd className="border border-border bg-background px-2 py-0.5 text-[10px] text-foreground">1 – 4</kbd>
                </li>
                <li className="flex items-center justify-between">
                  <span>Flag / Mark for Review</span>
                  <kbd className="border border-border bg-background px-2 py-0.5 text-[10px] text-foreground">f</kbd>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-primary font-bold tracking-wider uppercase text-[10px]">
                SRS Active Recall (/revise)
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center justify-between">
                  <span>Flip Flashcard</span>
                  <kbd className="border border-border bg-background px-2 py-0.5 text-[10px] text-foreground">Space</kbd>
                </li>
                <li className="flex items-center justify-between">
                  <span>Rate (Again/Hard/Good/Easy)</span>
                  <kbd className="border border-border bg-background px-2 py-0.5 text-[10px] text-foreground">1 – 4</kbd>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-3 text-center text-[10px] text-muted-foreground">
          Press <kbd className="border border-border bg-background px-1.5 py-0.5 text-foreground">?</kbd> anytime to open or close this window.
        </div>
      </div>
    </div>
  )
}
