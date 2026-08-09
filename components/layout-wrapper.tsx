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
        "flex-1 flex flex-col h-dvh overflow-y-auto overflow-x-hidden relative bg-transparent z-10",
        !isTestRoute && "md:ml-16 pt-[60px] md:pt-0 pb-[65px] md:pb-0"
      )}
    >
      {children}
    </div>
  )
}
