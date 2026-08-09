"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EXAMS, GATE_DOMAINS } from "@/lib/exams/registry"
import { Check, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SetupFormProps {
  onComplete: (profile: { name: string; exam: string; domain?: string }) => void
}

export function SetupForm({ onComplete }: SetupFormProps) {
  const [name, setName] = useState("")
  const [exam, setExam] = useState<string | null>(null)
  const [domain, setDomain] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!exam) return
    if (exam === "gate" && !domain) return
    onComplete({ name: name.trim() || "Guest", exam, domain: domain || undefined })
  }

  const isValid = exam && (exam !== "gate" || domain)

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 animate-in slide-in-from-right duration-500">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white border-[3px] border-[#1F2937] rounded-3xl p-6 md:p-8 shadow-neo space-y-8">
        <div>
          <h2 className="text-[24px] font-heading font-black text-primary-text uppercase tracking-tight">
            Set up your profile
          </h2>
          <p className="text-[14px] font-bold text-secondary-text mt-1">
            We'll customize your console for your target exam.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="name" className="text-[14px] font-black text-[#1F2937] uppercase tracking-wide">
              Display Name (Optional)
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Satyam"
              className="w-full h-12 px-4 rounded-xl border-[3px] border-[#1F2937] bg-[#FAFBFF] text-[16px] font-bold focus:outline-none focus:ring-2 focus:ring-[#1CB0F6] focus:border-[#1CB0F6] transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[14px] font-black text-[#1F2937] uppercase tracking-wide">
              Target Exam
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {EXAMS.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => {
                    setExam(e.id)
                    if (e.id !== "gate") setDomain(null)
                  }}
                  className={cn(
                    "relative h-12 rounded-xl border-[3px] border-[#1F2937] font-black text-[14px] uppercase tracking-wide transition-all overflow-hidden flex items-center justify-center",
                    exam === e.id
                      ? "bg-[#1CB0F6] text-white shadow-neo-sm translate-y-[-2px]"
                      : "bg-white text-[#1F2937] hover:bg-gray-50"
                  )}
                >
                  {e.id.toUpperCase()}
                  {exam === e.id && (
                    <div className="absolute top-1 right-1 size-3 bg-white rounded-full flex items-center justify-center">
                      <Check className="size-2 text-[#1CB0F6]" strokeWidth={4} />
                    </div>
                  )}
                </button>
              ))}
            </div>
            {exam && exam !== "gate" && (
              <p className="text-[12px] font-bold text-[#FF9600] animate-in fade-in">
                Note: This is a demo dataset. Full content coming soon!
              </p>
            )}
          </div>

          {exam === "gate" && (
            <div className="space-y-3 animate-in slide-in-from-top-2 fade-in">
              <label className="text-[14px] font-black text-[#1F2937] uppercase tracking-wide">
                GATE Branch
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GATE_DOMAINS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDomain(d.id)}
                    className={cn(
                      "relative h-auto py-3 px-2 rounded-xl border-[3px] border-[#1F2937] font-black text-[13px] transition-all flex flex-col items-center justify-center text-center",
                      domain === d.id
                        ? "bg-[#CE82FF] text-white shadow-neo-sm translate-y-[-2px]"
                        : "bg-white text-[#1F2937] hover:bg-gray-50"
                    )}
                  >
                    {d.name}
                    {d.id !== "cse" && (
                      <span className="text-[10px] font-bold opacity-80 uppercase mt-1">Demo Dataset</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button 
          type="submit"
          disabled={!isValid}
          className="w-full bg-[#58CC02] hover:bg-[#58CC02]/90 text-white border-[3px] border-[#1F2937] shadow-neo-sm hover:-translate-y-1 active:translate-y-1 active:translate-x-1 active:shadow-none h-14 rounded-2xl text-[16px] font-black uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-neo-sm"
        >
          Enter Console
          <ArrowRight className="size-5" />
        </Button>
      </form>
    </div>
  )
}
