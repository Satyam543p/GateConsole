import type { Metadata } from "next"
import { DailyChallenge } from "@/components/daily-challenge"

export const metadata: Metadata = {
  title: "Daily Challenge — GATE test centre",
  description: "One question a day. Answer correctly to keep your streak alive.",
}

export default function DailyPage() {
  return <DailyChallenge />
}
