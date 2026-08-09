"use client"

import { useState } from "react"
import { Terminal, Code, Cpu, Database, Network } from "lucide-react"
import { useSettings } from "@/lib/storage/hooks"
import { WelcomeScreen } from "@/components/onboarding/welcome-screen"
import { SetupForm } from "@/components/onboarding/setup-form"
import { ConsoleDashboard } from "@/components/console-dashboard"

type AppState = "loading" | "welcome" | "setup" | "console"

export default function HomePage() {
  const { settings, updateSettings, loading } = useSettings()
  const [localState, setLocalState] = useState<"welcome" | "setup" | null>(null)

  // Determine current state based on local UI overrides or saved profile
  let currentState: AppState = "loading"
  if (!loading) {
    if (localState === "welcome") currentState = "welcome"
    else if (localState === "setup") currentState = "setup"
    else if (!settings.profile?.onboardingComplete) currentState = "welcome"
    else currentState = "console"
  }

  const handleStartSetup = () => setLocalState("setup")
  
  const handleGuest = async () => {
    await updateSettings({
      profile: {
        name: "Guest",
        exam: "gate",
        domain: "cse",
        onboardingComplete: true
      }
    })
    setLocalState(null)
  }

  const handleSetupComplete = async (profileData: { name: string; exam: string; domain?: string }) => {
    await updateSettings({
      profile: {
        ...profileData,
        onboardingComplete: true
      }
    })
    setLocalState(null)
  }

  return (
    <main className="min-h-dvh relative overflow-x-hidden bg-transparent">

      {currentState === "loading" && (
        <div className="min-h-dvh flex items-center justify-center">
          <p className="font-bold text-secondary-text">Loading...</p>
        </div>
      )}

      {currentState === "welcome" && (
        <div className="relative z-10">
          <WelcomeScreen onStart={handleStartSetup} onGuest={handleGuest} />
        </div>
      )}

      {currentState === "setup" && (
        <div className="relative z-10">
          <SetupForm onComplete={handleSetupComplete} />
        </div>
      )}

      {currentState === "console" && (
        <ConsoleDashboard />
      )}

    </main>
  )
}

