"use client"

/**
 * components/session-logger.tsx
 *
 * Session logging timer for chapter study sessions.
 * Features:
 *  - Start / Pause / Stop timer per chapter.
 *  - Auto-pause on browser blur (window blur event) with visual indicator.
 *  - Writes to StudyStore `sessions` collection.
 */

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Pause, Square, Clock, AlertCircle, CheckCircle2, ChevronDown } from "lucide-react"
import { useCollection } from "@/lib/storage/hooks"
import { COLLECTIONS } from "@/lib/storage/store"
import { TOPICS } from "@/lib/exams/gate-cse/data"
import { formatClock } from "@/lib/test-types"
import type { StudySession } from "@/lib/domain/types"
import { LOCAL_USER_ID, GATE_CSE_EXAM_ID } from "@/lib/domain/types"
import { cn } from "@/lib/utils"

export function SessionLogger() {
  const { put } = useCollection(COLLECTIONS.sessions)
  const [selectedTopicId, setSelectedTopicId] = useState<string>(TOPICS[0].id)
  
  // Timer states
  const [isRunning, setIsRunning] = useState(false)
  const [isAutoPaused, setIsAutoPaused] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [loggedStatus, setLoggedStatus] = useState<string | null>(null)

  const startTimeRef = useRef<number | null>(null)
  const accumulatedRef = useRef<number>(0)

  const selectedTopic = TOPICS.find((t) => t.id === selectedTopicId) || TOPICS[0]

  // Timer interval ticker
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && !isAutoPaused) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, isAutoPaused])

  // Window blur / focus auto-pause listener
  useEffect(() => {
    function handleBlur() {
      if (isRunning && !isAutoPaused) {
        setIsAutoPaused(true)
      }
    }

    function handleFocus() {
      // Stay paused until explicit user click, but show notification
    }

    window.addEventListener("blur", handleBlur)
    window.addEventListener("focus", handleFocus)

    return () => {
      window.removeEventListener("blur", handleBlur)
      window.removeEventListener("focus", handleFocus)
    }
  }, [isRunning, isAutoPaused])

  // Controls
  const handleStart = () => {
    setIsRunning(true)
    setIsAutoPaused(false)
    setLoggedStatus(null)
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now()
    }
  }

  const handlePause = () => {
    setIsAutoPaused(false)
    setIsRunning(false)
  }

  const handleResume = () => {
    setIsAutoPaused(false)
    setIsRunning(true)
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsAutoPaused(false)
    setElapsedSeconds(0)
    startTimeRef.current = null
    accumulatedRef.current = 0
  }

  const handleSaveSession = async () => {
    if (elapsedSeconds < 10) {
      alert("Session too short to log (minimum 10 seconds).")
      return
    }

    const sessionRecord: StudySession = {
      userId: LOCAL_USER_ID,
      examId: GATE_CSE_EXAM_ID,
      id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      chapterId: selectedTopic.id,
      subject: selectedTopic.subject,
      topic: selectedTopic.topic,
      startedAt: new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
      activeSeconds: elapsedSeconds,
      durationSeconds: elapsedSeconds,
    }

    await put(sessionRecord)
    const mins = Math.round(elapsedSeconds / 60) || 1
    setLoggedStatus(`Logged ${mins}m for ${selectedTopic.subject}`)
    handleReset()

    setTimeout(() => setLoggedStatus(null), 4000)
  }

  return (
    <div className="border border-border bg-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-primary" aria-hidden="true" />
          <h3 className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
            Session Logger
          </h3>
        </div>
        {isAutoPaused && (
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 animate-pulse">
            <AlertCircle className="size-3" aria-hidden="true" />
            Auto-paused (Window blur)
          </span>
        )}
      </div>

      {/* Topic selection */}
      <div>
        <label htmlFor="session-topic-select" className="block font-mono text-[10px] text-muted-foreground uppercase">
          Select Study Topic
        </label>
        <select
          id="session-topic-select"
          disabled={isRunning}
          value={selectedTopicId}
          onChange={(e) => setSelectedTopicId(e.target.value)}
          className="mt-1.5 w-full border border-border bg-background px-3 py-2 font-mono text-[11px] outline-none focus:border-primary disabled:opacity-50"
        >
          {TOPICS.filter((t) => !t.removed).map((t) => (
            <option key={t.id} value={t.id}>
              {t.subject}: {t.topic} ({t.hours}h budget)
            </option>
          ))}
        </select>
      </div>

      {/* Timer Display */}
      <div className="border border-border bg-muted/20 py-6 text-center">
        <div className="font-mono text-4xl font-semibold tracking-wider tabular-nums text-foreground">
          {formatClock(elapsedSeconds)}
        </div>
        <p className="mt-1 font-mono text-[10px] text-muted-foreground uppercase">
          {isRunning
            ? isAutoPaused
              ? "Paused — click Resume to continue"
              : "Session in progress…"
            : elapsedSeconds > 0
            ? "Paused"
            : "Ready to study"}
        </p>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-2">
        {!isRunning && !isAutoPaused && elapsedSeconds === 0 && (
          <button
            type="button"
            onClick={handleStart}
            className="flex-1 inline-flex items-center justify-center gap-2 border border-primary bg-primary px-4 py-2 font-mono text-[11px] tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Play className="size-3.5" aria-hidden="true" />
            Start Session
          </button>
        )}

        {isRunning && !isAutoPaused && (
          <button
            type="button"
            onClick={handlePause}
            className="flex-1 inline-flex items-center justify-center gap-2 border border-amber-500 bg-amber-500/10 text-amber-500 px-4 py-2 font-mono text-[11px] tracking-wide hover:bg-amber-500/20 transition-colors"
          >
            <Pause className="size-3.5" aria-hidden="true" />
            Pause
          </button>
        )}

        {(isAutoPaused || (!isRunning && elapsedSeconds > 0)) && (
          <button
            type="button"
            onClick={handleResume}
            className="flex-1 inline-flex items-center justify-center gap-2 border border-primary bg-primary px-4 py-2 font-mono text-[11px] tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Play className="size-3.5" aria-hidden="true" />
            Resume
          </button>
        )}

        {elapsedSeconds > 0 && (
          <button
            type="button"
            onClick={handleSaveSession}
            className="inline-flex items-center justify-center gap-2 border border-border bg-card px-4 py-2 font-mono text-[11px] tracking-wide text-foreground hover:border-primary transition-colors"
          >
            <CheckCircle2 className="size-3.5 text-primary" aria-hidden="true" />
            Log Session
          </button>
        )}

        {elapsedSeconds > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="border border-border px-3 py-2 font-mono text-[11px] text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
            title="Reset timer"
          >
            <Square className="size-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {loggedStatus && (
        <p className="font-mono text-[11px] text-primary flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5" aria-hidden="true" />
          {loggedStatus}
        </p>
      )}
    </div>
  )
}
