"use client"

import { useState } from "react"
import { useSettings } from "@/lib/storage/hooks"
import { EXAMS, GATE_DOMAINS } from "@/lib/exams/registry"
import { Button } from "@/components/ui/button"
import { User, Check } from "lucide-react"

export function ProfilePanel() {
  const { settings, updateSettings } = useSettings()
  const currentProfile = settings.profile

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(currentProfile?.name || "Guest")
  const [exam, setExam] = useState(currentProfile?.exam || "gate")
  const [domain, setDomain] = useState(currentProfile?.domain || "cse")

  const handleSave = async () => {
    await updateSettings({
      profile: {
        ...currentProfile,
        name: name.trim() || "Guest",
        exam,
        domain: exam === "gate" ? domain : undefined,
        onboardingComplete: true
      }
    })
    setIsEditing(false)
  }

  const examName = EXAMS.find(e => e.id === currentProfile?.exam)?.name || "GATE"
  const domainName = GATE_DOMAINS.find(d => d.id === currentProfile?.domain)?.name || ""

  if (!isEditing) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <User className="size-5 text-[#1CB0F6]" />
          <h2 className="text-[18px] font-heading font-bold text-primary-text">
            Profile & Target Exam
          </h2>
        </div>
        <div className="space-y-1">
          <p className="text-[14px] font-bold text-secondary-text">Name</p>
          <p className="text-[16px] font-bold text-primary-text">{currentProfile?.name || "Guest"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[14px] font-bold text-secondary-text">Exam Plan</p>
          <p className="text-[16px] font-bold text-primary-text">
            {examName} {currentProfile?.exam === "gate" && domainName ? `— ${domainName}` : ""}
          </p>
        </div>
        <Button onClick={() => setIsEditing(true)} variant="outline" className="mt-4 border-[2px] border-[#1F2937] text-[13px] font-bold uppercase tracking-wider h-10 px-4">
          Edit Profile
        </Button>
      </div>
    )
  }

  const isValid = exam && (exam !== "gate" || domain)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <User className="size-5 text-[#1CB0F6]" />
        <h2 className="text-[18px] font-heading font-bold text-primary-text">
          Edit Profile
        </h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[12px] font-bold text-secondary-text uppercase">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border-[2px] border-[#1F2937] bg-white text-[14px] font-bold"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[12px] font-bold text-secondary-text uppercase">Exam</label>
          <select 
            value={exam}
            onChange={e => {
              setExam(e.target.value)
              if (e.target.value !== "gate") setDomain("")
            }}
            className="w-full h-10 px-3 rounded-lg border-[2px] border-[#1F2937] bg-white text-[14px] font-bold appearance-none"
          >
            {EXAMS.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>

        {exam === "gate" && (
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-secondary-text uppercase">Domain</label>
            <select 
              value={domain}
              onChange={e => setDomain(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border-[2px] border-[#1F2937] bg-white text-[14px] font-bold appearance-none"
            >
              <option value="" disabled>Select domain...</option>
              {GATE_DOMAINS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={handleSave} disabled={!isValid} className="bg-[#1CB0F6] hover:bg-[#1CB0F6]/90 text-white border-[2px] border-[#1F2937] shadow-neo-sm h-10 px-6 font-bold">
          Save Changes
        </Button>
        <Button onClick={() => setIsEditing(false)} variant="ghost" className="h-10 px-4 font-bold text-secondary-text hover:text-primary-text">
          Cancel
        </Button>
      </div>
    </div>
  )
}
