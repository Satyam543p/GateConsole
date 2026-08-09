"use client"

import { useState } from "react"
import { Plus, Trash2, CalendarDays, Zap } from "lucide-react"
import { useSettings } from "@/lib/storage/hooks"
import { cn } from "@/lib/utils"

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const ACTIVE_HOURS = 4 // Default hours when day is active

export function AvailabilityPanel() {
  const { settings, updateSettings, loading } = useSettings()
  const [saving, setSaving] = useState(false)
  const [newBlackout, setNewBlackout] = useState("")

  const avail = settings.weeklyAvailability
  const hours = avail.hoursPerDay
  const blackouts = avail.blackoutDates

  async function toggleDay(index: number) {
    if (loading) return
    const next: typeof hours = [...hours]
    next[index] = next[index] > 0 ? 0 : ACTIVE_HOURS
    setSaving(true)
    await updateSettings({
      weeklyAvailability: { ...avail, hoursPerDay: next },
    })
    setSaving(false)
  }

  async function addBlackout() {
    const d = newBlackout.trim()
    if (!d || blackouts.includes(d)) return
    const next = [...blackouts, d].sort()
    setSaving(true)
    await updateSettings({
      weeklyAvailability: { ...avail, blackoutDates: next },
    })
    setNewBlackout("")
    setSaving(false)
  }

  async function removeBlackout(date: string) {
    const next = blackouts.filter((d) => d !== date)
    setSaving(true)
    await updateSettings({
      weeklyAvailability: { ...avail, blackoutDates: next },
    })
    setSaving(false)
  }

  const activeDaysCount = hours.filter(h => h > 0).length

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start gap-4">
        <div className="p-2.5 bg-[#F0F4FF] rounded-[10px]">
          <CalendarDays className="size-5 text-[#6C8EF2]" />
        </div>
        <div>
          <h2 className="text-[16px] font-heading font-bold text-primary-text">
            Study Schedule
          </h2>
          <p className="text-[13px] text-secondary-text mt-1">
            Select the days you plan to study. Active days default to {ACTIVE_HOURS} hours.
          </p>
        </div>
      </div>

      {/* 7-Day Circles */}
      <div className="flex justify-between items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] p-4 mb-6">
        {DAY_LABELS.map((label, i) => {
          const isActive = hours[i] > 0
          return (
            <button
              key={label}
              onClick={() => toggleDay(i)}
              disabled={loading}
              className={cn(
                "flex flex-col items-center gap-2 transition-all outline-none group",
                isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
              )}
            >
              <div className={cn(
                "size-10 rounded-full flex items-center justify-center font-heading font-bold text-[14px] transition-all group-hover:scale-105",
                isActive
                  ? "bg-[#6C8EF2] text-white shadow-[0_2px_8px_rgba(108,142,242,0.3)]"
                  : "bg-white text-muted-text border border-[#E2E8F0]"
              )}>
                {label[0]}
              </div>
              <span className={cn(
                "text-[10px] uppercase tracking-wider font-semibold",
                isActive ? "text-[#6C8EF2]" : "text-muted-text"
              )}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
      
      <div className="flex items-center gap-2 mb-8 bg-[#F0FDF4]/50 border border-[#D1FAE5] text-[#059669] px-3 py-2 rounded-[8px] text-[12px] font-medium">
        <Zap className="size-3.5 fill-current" />
        Planning for {activeDaysCount} days ({activeDaysCount * ACTIVE_HOURS} hours/week)
      </div>

      {/* Blackout dates */}
      <div className="border-t border-[#E2E8F0] pt-6 space-y-4">
        <div>
          <h3 className="text-[14px] font-heading font-semibold text-primary-text">
            Blackout Dates
          </h3>
          <p className="text-[12px] text-secondary-text mt-1">
            Exam days or travel. The planner will skip these dates entirely.
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="date"
            value={newBlackout}
            onChange={(e) => setNewBlackout(e.target.value)}
            className="flex-1 h-10 border border-[#E2E8F0] bg-white px-3 rounded-[8px] text-[13px] text-primary-text focus:border-[#6C8EF2] focus:ring-1 focus:ring-[#6C8EF2] outline-none transition-all"
          />
          <button
            type="button"
            onClick={addBlackout}
            disabled={!newBlackout || saving}
            className="inline-flex items-center justify-center h-10 px-4 gap-2 bg-[#F0F4FF] text-[#6C8EF2] border-[1.5px] border-[#D0DAFE] rounded-[8px] font-heading font-semibold text-[13px] hover:bg-[#EEF1FE] transition-colors disabled:opacity-50"
          >
            <Plus className="size-3.5 stroke-[3px]" /> Add
          </button>
        </div>

        {blackouts.length > 0 && (
          <ul className="space-y-2 mt-4">
            {blackouts.map((date) => (
              <li
                key={date}
                className="flex items-center justify-between border border-[#E2E8F0] bg-white rounded-[8px] px-3 py-2.5"
              >
                <span className="font-sans font-medium text-[13px] text-primary-text">{new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <button
                  type="button"
                  onClick={() => removeBlackout(date)}
                  className="text-[#94A3B8] hover:text-[#F87171] hover:bg-[#FFF0F5] p-1.5 rounded-md transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
