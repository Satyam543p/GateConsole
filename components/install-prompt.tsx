"use client"

import { useEffect, useState } from "react"
import { Download } from "lucide-react"
import { cn } from "@/lib/utils"

interface InstallPromptProps {
  isExpanded?: boolean
  isMobile?: boolean
}

export function InstallPrompt({ isExpanded = true, isMobile = false }: InstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    window.addEventListener("appinstalled", () => {
      setIsInstallable(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") {
      setIsInstallable(false)
    }
    setDeferredPrompt(null)
  }

  if (!isInstallable) return null

  if (isMobile) {
    return (
      <button
        onClick={handleInstallClick}
        title="Install App"
        className="flex items-center justify-center p-1.5 rounded-full bg-[#58CC02] border-[2px] border-[#1F2937] hover:bg-[#46A302] text-white shadow-neo-xs active:translate-y-0.5 transition-all shrink-0"
      >
        <Download className="size-4" strokeWidth={2.5} />
      </button>
    )
  }

  return (
    <button
      onClick={handleInstallClick}
      title="Install App"
      className={cn(
        "flex items-center gap-4 px-3 py-3 rounded-[12px] bg-[#58CC02] border-[2px] border-[#1F2937] hover:bg-[#46A302] text-white shadow-neo-sm active:translate-y-0.5 transition-all w-full",
        isExpanded ? "justify-start" : "justify-center"
      )}
    >
      <Download className="size-5 shrink-0" strokeWidth={2.5} />
      <span className={cn(
        "text-[13px] font-heading font-black tracking-wider uppercase whitespace-nowrap transition-opacity duration-150",
        isExpanded ? "opacity-100" : "opacity-0 w-0 hidden"
      )}>
        Install App
      </span>
    </button>
  )
}
