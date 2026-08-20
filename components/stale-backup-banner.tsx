"use client"

/**
 * components/stale-backup-banner.tsx
 *
 * Dismissible banner (not a modal) shown when the last export is > 7 days ago.
 * Appears below the sticky nav. Stacks only once per session after dismissal.
 */

import { useEffect, useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { getLastExportTimestamp } from "@/lib/storage/store"

const DISMISS_SESSION_KEY = "gcc:banner-dismissed"
const STALE_DAYS = 7

function isStale(lastExportAt: string | null): boolean {
  if (!lastExportAt) return true // never exported
  const last = new Date(lastExportAt).getTime()
  const now = Date.now()
  const daysDiff = (now - last) / (1000 * 60 * 60 * 24)
  return daysDiff > STALE_DAYS
}

export function StaleBackupBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Only runs client-side
    const dismissed = sessionStorage.getItem(DISMISS_SESSION_KEY)
    if (dismissed) return

    const last = getLastExportTimestamp()
    if (isStale(last)) setShow(true)
  }, [])

  if (!show) return null

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_SESSION_KEY, "1")
    setShow(false)
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="hidden sm:block border-b-2 border-[#1F2937]/15 bg-[#FFF9E6] px-3 py-2 text-xs"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-1 sm:px-4">
        <p className="font-mono text-[11px] sm:text-xs font-bold text-[#B36900] truncate">
          <span className="font-black text-[#1F2937]">Backup Reminder:</span> Last export &gt; {STALE_DAYS} days ago.{" "}
          <Link
            href="/settings"
            className="underline underline-offset-2 font-black hover:text-[#1F2937] transition-colors ml-1"
          >
            Export Now →
          </Link>
        </p>
        <button
          type="button"
          aria-label="Dismiss backup reminder"
          onClick={dismiss}
          className="shrink-0 text-[#B36900] hover:text-[#1F2937] transition-colors p-1"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
