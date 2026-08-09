import type { Metadata } from "next"
import { ProfilePanel } from "@/components/settings/profile-panel"
import { ExportPanel, ImportPanel } from "@/components/settings/backup-panel"
import { AvailabilityPanel } from "@/components/settings/availability-panel"
import { Card } from "@/components/ui/card"
import { Settings as SettingsIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Settings — GateConsole",
  description:
    "Export and import your study data backup. Configure weekly study availability and blackout dates.",
}

export default function SettingsPage() {
  return (
    <main className="min-h-dvh pt-8 md:pt-12 pb-24 px-4 md:px-6 max-w-3xl mx-auto space-y-6 bg-transparent">

      <header className="mb-6 md:mb-8">
        <h1 className="text-[26px] md:text-[28px] font-heading font-bold text-primary-text flex items-center gap-3">
          <SettingsIcon className="size-7 text-[#94A3B8]" />
          Settings
        </h1>
        <p className="text-[14px] text-secondary-text mt-1 max-w-xl">
          Manage your study schedule, backups, and app preferences. All data is stored locally on your device.
        </p>
      </header>

      <div className="space-y-6">
        
        <Card accentBorder="green" className="overflow-hidden">
          <ProfilePanel />
        </Card>

        <Card accentBorder="blue" className="overflow-hidden">
          <AvailabilityPanel />
        </Card>

        <div className="pt-4 pb-2">
          <h2 className="text-[18px] font-heading font-semibold text-primary-text">
            Data Management
          </h2>
          <p className="text-[13px] text-secondary-text mt-1">
            Export your backup before clearing browser storage to avoid data loss.
          </p>
        </div>

        <Card>
          <ExportPanel />
        </Card>

        <Card>
          <ImportPanel />
        </Card>

      </div>
    </main>
  )
}
