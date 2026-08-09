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
      className="border-b border-border bg-muted/60 px-4 py-2.5 text-sm"
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 md:px-8">
        <p className="font-mono text-[11px] text-muted-foreground">
          <span className="text-primary">Backup reminder</span>
          {" — "}
          your last export is more than {STALE_DAYS} days old.{" "}
          <Link
            href="/settings"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Export now
          </Link>
        </p>
        <button
          type="button"
          aria-label="Dismiss backup reminder"
          onClick={dismiss}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
