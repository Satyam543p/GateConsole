"use client"

import { Code2, Terminal, Bug, Database, Cpu, Braces, Coffee } from "lucide-react"
import { useEffect, useState } from "react"

export function BackgroundElements() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.25] md:opacity-100 transition-opacity print:hidden">
      {/* Floating shapes with coding icons */}
      
      {/* Top Right - Database */}
      <div className="absolute top-[10%] right-[5%] sm:right-[15%] rotate-12 animate-pulse">
        <div className="bg-[#CE82FF] border-[2px] sm:border-[3px] border-[#1F2937] shadow-neo-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 size-12 sm:size-16 flex items-center justify-center">
          <Database className="size-6 sm:size-8 text-white" strokeWidth={3} />
        </div>
      </div>

      {/* Top Left - Code */}
      <div className="absolute top-[15%] left-[2%] sm:left-[5%] -rotate-6 animate-bounce">
        <div className="bg-[#1CB0F6] border-[2px] sm:border-[3px] border-[#1F2937] shadow-neo-sm rounded-xl sm:rounded-[16px] p-2 sm:p-3 size-10 sm:size-14 flex items-center justify-center">
          <Code2 className="size-5 sm:size-6 text-white" strokeWidth={3} />
        </div>
      </div>

      {/* Middle Left - Bug */}
      <div className="absolute top-[45%] -left-[2%] sm:left-[2%] rotate-[15deg]">
        <div className="bg-[#FF4B4B] border-[2px] sm:border-[3px] border-[#1F2937] shadow-neo-sm rounded-full p-2.5 sm:p-3 size-10 sm:size-12 flex items-center justify-center">
          <Bug className="size-5 sm:size-6 text-white" strokeWidth={3} />
        </div>
      </div>

      {/* Middle Right - Braces */}
      <div className="absolute top-[55%] right-[2%] sm:right-[5%] -rotate-12 animate-bounce">
        <div className="bg-[#FF9600] border-[2px] sm:border-[3px] border-[#1F2937] shadow-neo-sm rounded-xl sm:rounded-[14px] p-2.5 sm:p-3 size-10 sm:size-14 flex items-center justify-center">
          <Braces className="size-5 sm:size-6 text-white" strokeWidth={3} />
        </div>
      </div>

      {/* Bottom Left - Terminal */}
      <div className="absolute bottom-[20%] left-[5%] sm:left-[10%] rotate-6">
        <div className="bg-[#58CC02] border-[2px] sm:border-[3px] border-[#1F2937] shadow-neo-sm rounded-xl sm:rounded-[16px] p-3 sm:p-4 size-14 sm:size-20 flex items-center justify-center">
          <Terminal className="size-8 sm:size-10 text-white" strokeWidth={3} />
        </div>
      </div>

      {/* Bottom Right - Coffee */}
      <div className="absolute bottom-[10%] right-[10%] sm:right-[20%] -rotate-[25deg]">
        <div className="bg-white border-[2px] sm:border-[3px] border-[#1F2937] shadow-neo-sm rounded-full p-3 sm:p-4 size-12 sm:size-16 flex items-center justify-center">
          <Coffee className="size-6 sm:size-8 text-[#1F2937]" strokeWidth={3} />
        </div>
      </div>

      {/* Center Leftish - CPU */}
      <div className="absolute top-[75%] left-[20%] sm:left-[30%] rotate-45 animate-pulse">
        <div className="bg-[#FFC800] border-[2px] sm:border-[3px] border-[#1F2937] shadow-neo-sm rounded-xl sm:rounded-[12px] p-2.5 sm:p-3 size-10 sm:size-12 flex items-center justify-center">
          <Cpu className="size-5 sm:size-6 text-[#1F2937]" strokeWidth={3} />
        </div>
      </div>
      
      {/* Some extra tiny decorative confetti elements */}
      <div className="absolute top-[30%] right-[30%] size-3 bg-[#FF4B4B] rounded-full border-2 border-[#1F2937]"></div>
      <div className="absolute top-[20%] left-[25%] size-4 bg-[#58CC02] rotate-45 border-2 border-[#1F2937]"></div>
      <div className="absolute bottom-[35%] right-[10%] size-3 bg-[#1CB0F6] rounded-full border-2 border-[#1F2937]"></div>
      <div className="absolute bottom-[25%] left-[40%] size-4 bg-[#CE82FF] rotate-12 border-2 border-[#1F2937]"></div>
    </div>
  )
}
