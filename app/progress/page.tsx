import type { Metadata } from "next"
import { AttemptHistory } from "@/components/attempt-history"

export const metadata: Metadata = {
  title: "Progress — GATE CSE attempt history & trends",
  description:
    "Score progression across attempts, aggregated subject strength and a full log of every GATE CSE test you have taken.",
}

export default function ProgressPage() {
  return <AttemptHistory />
}
