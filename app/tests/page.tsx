import type { Metadata } from "next"
import { TestHub } from "@/components/test-hub"

export const metadata: Metadata = {
  title: "Test centre — GATE CSE mocks & subject drills",
  description:
    "Timed GATE CSE practice tests with authentic negative marking, subject-wise drills, full-length mocks and per-question result review.",
}

export default function TestsPage() {
  return <TestHub />
}
