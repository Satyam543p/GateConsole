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
    <main className="min-h-screen relative overflow-x-hidden bg-[#FAFBFF]">
      
      {/* Playful Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-5">
        <Terminal className="absolute top-20 left-10 size-32 text-[#6C8EF2] -rotate-12 animate-pulse" strokeWidth={2} />
        <Code className="absolute bottom-40 right-20 size-40 text-[#FFB020] rotate-12 animate-bounce" strokeWidth={2} />
        <Cpu className="absolute top-40 right-1/4 size-24 text-[#1CB0F6] rotate-45 animate-pulse" strokeWidth={2} />
        <Database className="absolute bottom-10 left-1/4 size-28 text-[#FF4B4B] -rotate-6 animate-bounce" style={{ animationDelay: '1s' }} strokeWidth={2} />
        <Network className="absolute top-1/2 -left-10 size-48 text-[#58CC02] animate-[spin_15s_linear_infinite]" strokeWidth={2} />
      </div>

      {currentState === "loading" && (
        <div className="min-h-screen flex items-center justify-center">
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

