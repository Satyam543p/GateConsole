"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Network,
  BookOpen,
  ClipboardList,
  Settings,
  Flame,
  Target,
  UserCircle2
} from "lucide-react"
import { useSettings } from "@/lib/storage/hooks"
import { EXAMS, GATE_DOMAINS } from "@/lib/exams/registry"

const NAV_ITEMS = [
  { href: "/", label: "Today", icon: Home },
  { href: "/map", label: "Concept Map", icon: Network },
  { href: "/tests", label: "Tests", icon: ClipboardList },
  { href: "/progress", label: "Progress", icon: Target },
]

export function SiteNav() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const { settings } = useSettings()

  // Hide nav during active test taking
  if (/^\/tests\/[^/]+$/.test(pathname)) return null

  const currentProfile = settings.profile
  const examName = EXAMS.find(e => e.id === currentProfile?.exam)?.name || "GATE"
  const domainName = GATE_DOMAINS.find(d => d.id === currentProfile?.domain)?.name || ""
  const displayExam = currentProfile?.exam === "gate" && domainName ? `${examName} — ${domainName}` : examName

  return (
    <>
      {/* DESKTOP SIDEBAR (Hidden on Mobile) */}
      <aside 
        className={cn(
          "hidden md:flex flex-col fixed inset-y-0 left-0 z-50 bg-white border-r-[3px] border-[#1F2937] transition-all duration-150 ease-in-out group overflow-hidden",
          isExpanded ? "w-[180px]" : "w-[64px]"
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex flex-col h-full py-6">
          <div className="px-3 mb-6 flex justify-center">
             {/* STREAK COUNTER */}
             <div className={cn(
               "flex items-center gap-2 bg-[#FF9600] border-[2px] border-[#1F2937] text-white px-2 py-1.5 rounded-xl shadow-neo-sm transition-all duration-300",
               isExpanded ? "w-full justify-center px-4" : "w-10 justify-center"
             )}>
               <Flame className="size-5 fill-white text-white animate-pulse" strokeWidth={2} />
               <span className={cn(
                 "font-black text-[14px] whitespace-nowrap transition-all overflow-hidden",
                 isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
               )}>
                 3 Days
               </span>
             </div>
          </div>
          <nav className="flex-1 flex flex-col gap-2 px-3">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={cn(
                    "flex items-center gap-4 px-3 py-3 rounded-[12px] transition-colors relative overflow-hidden",
                    isActive
                      ? "bg-secondary text-primary border-[2px] border-[#1F2937] shadow-neo-sm"
                      : "text-muted-foreground hover:bg-[#F3F4F6] hover:text-primary-text border-[2px] border-transparent"
                  )}
                >
                  <Icon className={cn("size-5 shrink-0", isActive ? "text-primary" : "text-[#9CA3AF]")} />
                  <span className={cn(
                    "text-[13px] font-bold whitespace-nowrap transition-opacity duration-150",
                    isExpanded ? "opacity-100" : "opacity-0 w-0"
                  )}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </nav>
          
          <div className="px-3 mt-auto flex flex-col gap-2">
            {currentProfile && (
              <div className={cn(
                "flex items-center gap-4 px-3 py-2 rounded-[12px] border-[2px] border-[#1F2937] bg-[#F3F4F6] transition-all duration-150 overflow-hidden mb-1",
                isExpanded ? "w-full justify-start" : "justify-center"
              )}>
                <UserCircle2 className="size-5 shrink-0 text-[#1F2937]" />
                <div className={cn(
                  "flex flex-col whitespace-nowrap transition-opacity duration-150",
                  isExpanded ? "opacity-100" : "opacity-0 w-0 hidden"
                )}>
                  <span className="text-[12px] font-black text-[#1F2937] leading-none">{currentProfile.name}</span>
                  <span className="text-[10px] font-bold text-secondary-text mt-0.5 max-w-[100px] truncate" title={displayExam}>{displayExam}</span>
                </div>
              </div>
            )}

            <Link
              href="/settings"
              title="Settings"
              className={cn(
                "flex items-center gap-4 px-3 py-3 rounded-[12px] transition-colors relative overflow-hidden",
                pathname.startsWith("/settings")
                  ? "bg-secondary text-primary border-[2px] border-[#1F2937] shadow-neo-sm"
                  : "text-muted-foreground hover:bg-[#F3F4F6] hover:text-primary-text border-[2px] border-transparent"
              )}
            >
              <Settings className={cn("size-5 shrink-0", pathname.startsWith("/settings") ? "text-primary" : "text-[#9CA3AF]")} />
              <span className={cn(
                "text-[13px] font-bold whitespace-nowrap transition-opacity duration-150",
                isExpanded ? "opacity-100" : "opacity-0 w-0"
              )}>
                Settings
              </span>
            </Link>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM TAB BAR (Hidden on Desktop) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-[65px] bg-white/90 backdrop-blur-md border-t-[2px] border-[#1F2937]/10 z-50 flex items-center justify-around px-2 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
        {[...NAV_ITEMS, { href: "/settings", label: "Settings", icon: Settings }].map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-all duration-200 active:scale-95",
                isActive ? "text-primary" : "text-[#94A3B8] hover:text-[#64748B]"
              )}
            >
              <div className={cn(
                "absolute top-0 inset-x-0 h-1 bg-primary rounded-b-full transition-transform duration-300 origin-top",
                isActive ? "scale-y-100" : "scale-y-0"
              )} />
              <Icon className={cn("size-[24px] mt-1 transition-all duration-300", isActive && "text-primary drop-shadow-sm")} strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn(
                "text-[10px] font-bold tracking-tight whitespace-nowrap transition-all duration-300",
                isActive ? "text-primary" : "text-[#94A3B8]"
              )}>
                {item.label === "Concept Map" ? "Map" : item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
