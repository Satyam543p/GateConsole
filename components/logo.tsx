import { cn } from "@/lib/utils"
import { TerminalSquare } from "lucide-react"

interface LogoProps {
  isExpanded?: boolean
}

export function Logo({ isExpanded = true }: LogoProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 transition-all duration-300",
      isExpanded ? "px-2" : "justify-center"
    )}>
      <div className="relative flex items-center justify-center bg-primary border-[3px] border-[#1F2937] rounded-[10px] shadow-neo-sm shrink-0 size-10">
        <TerminalSquare className="size-5 text-white" strokeWidth={3} />
        {/* Subtle highlight for that chunky plastic feel */}
        <div className="absolute top-1 left-1 right-1 h-1 bg-white/20 rounded-full" />
      </div>
      
      <div className={cn(
        "flex flex-col overflow-hidden transition-all duration-300",
        isExpanded ? "w-[100px] opacity-100" : "w-0 opacity-0 hidden"
      )}>
        <span className="font-heading font-black text-lg leading-none text-[#1F2937] tracking-tighter">
          GateConsole
        </span>
      </div>
    </div>
  )
}
