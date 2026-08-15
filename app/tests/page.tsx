import type { Metadata } from "next"
import { Suspense } from "react"
import { TestHub } from "@/components/test-hub"

export const metadata: Metadata = {
  title: "Test centre — GATE CSE mocks & subject drills",
  description:
    "Timed GATE CSE practice tests with authentic negative marking, subject-wise drills, full-length mocks and per-question result review.",
}

export default function TestsPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#FAFBFF] p-6 font-heading font-bold text-secondary-text">Loading tests...</div>}>
      <TestHub />
    </Suspense>
  )
}
