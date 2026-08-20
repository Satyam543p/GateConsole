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
  UserCircle2,
  Calendar,
} from "lucide-react"
import { useSettings, useDailyChallenge } from "@/lib/storage/hooks"
import { EXAMS, GATE_DOMAINS } from "@/lib/exams/registry"
import { Logo } from "@/components/logo"

const NAV_ITEMS = [
  { href: "/", label: "Today", icon: Home },
  { href: "/todo", label: "To-Do", icon: ClipboardList },
  { href: "/tests", label: "Tests", icon: Target },
  { href: "/map", label: "Concept Map", icon: Network },
  { href: "/progress", label: "Progress", icon: BookOpen },
]

export function SiteNav() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { settings } = useSettings()
  const { streak: dailyStreak, loading: dailyLoading } = useDailyChallenge()

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
          "hidden md:flex flex-col fixed inset-y-0 left-0 z-50 bg-white border-r-[3px] border-[#1F2937] transition-all duration-150 ease-in-out group overflow-hidden print:hidden",
          isExpanded ? "w-[180px]" : "w-[64px]"
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex flex-col h-full py-6">
          <div className="mb-6 flex justify-center w-full">
             <Logo isExpanded={isExpanded} />
          </div>
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
                 {dailyLoading ? "…" : `${dailyStreak} Day${dailyStreak === 1 ? "" : "s"}`}
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
          
          <div className="px-3 mt-auto flex flex-col gap-2 relative">
            {currentProfile && (
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={cn(
                    "flex items-center gap-4 px-3 py-2 rounded-[12px] border-[2px] border-[#1F2937] bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-all duration-150 overflow-hidden mb-1 w-full text-left outline-none cursor-pointer",
                    isExpanded ? "justify-start" : "justify-center"
                  )}
                >
                  <UserCircle2 className="size-5 shrink-0 text-[#1F2937]" />
                  <div className={cn(
                    "flex flex-col whitespace-nowrap transition-opacity duration-150",
                    isExpanded ? "opacity-100" : "opacity-0 w-0 hidden"
                  )}>
                    <span className="text-[12px] font-black text-[#1F2937] leading-none">{currentProfile.name}</span>
                    <span className="text-[10px] font-bold text-secondary-text mt-0.5 max-w-[100px] truncate" title={displayExam}>{displayExam}</span>
                  </div>
                </button>

                {/* Profile Popup Menu */}
                {showProfileMenu && (
                  <div 
                    className={cn(
                      "absolute bottom-[110%] z-50 flex flex-col bg-white border-[2px] border-[#1F2937] rounded-xl shadow-neo p-1.5 min-w-[140px] origin-bottom-left transition-all",
                      isExpanded ? "left-0 w-full" : "left-12"
                    )}
                  >
                    <Link
                      href="/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary text-[#1F2937] transition-colors"
                    >
                      <Settings className="size-4 shrink-0" />
                      <span className="text-[13px] font-bold whitespace-nowrap">Edit Profile</span>
                    </Link>
                  </div>
                )}
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

      {/* MOBILE TOP HEADER (Hidden on Desktop) */}
      <header className="md:hidden fixed top-0 inset-x-0 h-[60px] bg-white/95 backdrop-blur-md border-b-[3px] border-[#1F2937] z-50 flex items-center justify-between px-3 shadow-neo-sm print:hidden">
        <Logo isExpanded={true} />
        
        <div className="flex items-center gap-2">
          {/* STREAK BADGE */}
          <div className="flex items-center gap-1.5 bg-[#FF9600] border-[2px] border-[#1F2937] text-white px-3 py-1.5 rounded-full shadow-neo-xs">
            <Flame className="size-4 fill-white text-white animate-pulse" strokeWidth={2} />
            <span className="font-heading font-black text-xs leading-none tracking-wide">
              {dailyLoading ? "…" : `${dailyStreak} Day${dailyStreak === 1 ? "" : "s"}`}
            </span>
          </div>

          {/* PROFILE & SETTINGS BUTTON */}
          <Link
            href="/settings"
            title="Profile & Settings"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#E5F6FF] border-[2px] border-[#1F2937] hover:bg-[#1CB0F6] hover:text-white text-[#1899D6] shadow-neo-xs active:translate-y-0.5 transition-all shrink-0"
          >
            <UserCircle2 className="size-4" strokeWidth={2.5} />
            <span className="font-heading font-black text-[10px] uppercase tracking-wider truncate max-w-[60px]">
              {currentProfile?.name?.split(' ')[0] || "Guest"}
            </span>
          </Link>
        </div>
      </header>

      {/* MOBILE BOTTOM TAB BAR (5 Core Hubs - Hidden on Desktop) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-[64px] bg-white/95 backdrop-blur-md border-t-[2px] border-[#1F2937]/15 z-50 flex items-center justify-around px-1 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.06)] select-none print:hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-200 active:scale-95",
                isActive ? "text-primary font-black" : "text-[#94A3B8] hover:text-[#64748B]"
              )}
            >
              <div className={cn(
                "absolute top-0 inset-x-2 h-1 bg-primary rounded-b-full transition-transform duration-300 origin-top",
                isActive ? "scale-y-100" : "scale-y-0"
              )} />
              <Icon className={cn("size-[22px] transition-all duration-300", isActive ? "text-primary drop-shadow-sm scale-105" : "text-[#94A3B8]")} strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn(
                "text-[10px] font-heading font-bold tracking-tight whitespace-nowrap transition-all duration-300 mt-0.5",
                isActive ? "text-primary font-black" : "text-[#94A3B8]"
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
