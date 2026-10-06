import { useMemo } from "react"
import { cn } from "@/lib/utils"

export function DiagramRenderer({ url, className }: { url?: string; className?: string }) {
  const svgContent = useMemo(() => {
    if (!url) return null
    if (url.trim().startsWith("<svg")) {
      return url
    }
    if (url.startsWith("data:image/svg+xml;base64,")) {
      try {
        const base64 = url.replace("data:image/svg+xml;base64,", "")
        return typeof window !== 'undefined' 
          ? decodeURIComponent(escape(window.atob(base64)))
          : Buffer.from(base64, "base64").toString("utf-8")
      } catch (e) {
        console.error("Failed to decode SVG", e)
        return null
      }
    }
    return null
  }, [url])

  if (!url) return null

  if (svgContent) {
    return (
      <div 
        className={cn(
          "w-full overflow-x-auto flex justify-center my-4 [&>svg]:max-w-full [&>svg]:sm:max-w-[420px] [&>svg]:max-h-[240px] [&>svg]:w-auto [&>svg]:h-auto [&>svg]:mx-auto [&>svg]:block [&>svg]:rounded-xl [&>svg]:border [&>svg]:border-border/40 [&>svg]:shadow-sm", 
          className
        )}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    )
  }

  return (
    <div className={cn("w-full overflow-x-auto flex justify-center my-4", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="Diagram" className="max-w-full sm:max-w-[420px] max-h-[240px] h-auto rounded-xl border border-border/40 shadow-sm" />
    </div>
  )
}
