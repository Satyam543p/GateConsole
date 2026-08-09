"use client"

import { Button } from "@/components/ui/button"
import { Flame, Play, Target } from "lucide-react"

interface WelcomeScreenProps {
  onStart: () => void
  onGuest: () => void
}

export function WelcomeScreen({ onStart, onGuest }: WelcomeScreenProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="space-y-4">
        <div className="mx-auto size-20 rounded-3xl bg-[#1F2937] flex items-center justify-center shadow-neo-sm rotate-3 border-[4px] border-[#FFC800]">
          <Target className="size-10 text-[#FFC800]" strokeWidth={3} />
        </div>
        <h1 className="text-[32px] md:text-[48px] font-heading font-black text-primary-text uppercase tracking-tight mt-6">
          Gate<span className="text-[#58CC02]">Console</span>
        </h1>
        <p className="text-[16px] md:text-[20px] font-bold text-secondary-text max-w-md mx-auto">
          Your data-driven strategy engine for competitive exams. Learn, practice, and track your readiness.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-8">
        <Button 
          onClick={onStart}
          className="bg-[#58CC02] hover:bg-[#58CC02]/90 text-white border-[3px] border-[#1F2937] shadow-neo-sm hover:-translate-y-1 active:translate-y-1 active:translate-x-1 active:shadow-none h-14 px-8 rounded-2xl text-[16px] font-black uppercase tracking-wide flex items-center gap-2"
        >
          <Play className="size-5 fill-current" />
          Get Started
        </Button>
        
        <Button 
          onClick={onGuest}
          variant="outline"
          className="bg-white hover:bg-gray-50 text-[#1F2937] border-[3px] border-[#1F2937] shadow-neo-sm hover:-translate-y-1 active:translate-y-1 active:translate-x-1 active:shadow-none h-14 px-8 rounded-2xl text-[16px] font-black uppercase tracking-wide flex items-center gap-2"
        >
          <Flame className="size-5 text-[#FF9600]" strokeWidth={3} />
          Continue as Guest
        </Button>
      </div>
    </div>
  )
}
