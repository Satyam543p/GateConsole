"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Match the logic in SiteNav: hide navigation padding for active tests
  const isTestRoute = /^\/tests\/[^/]+$/.test(pathname)

  return (
    <div 
      className={cn(
        "w-full flex-1 flex flex-col relative bg-transparent z-10 min-h-screen",
        !isTestRoute && "md:ml-16 pt-[60px] md:pt-0 pb-[88px] md:pb-12"
      )}
    >
      {children}
    </div>
  )
}
