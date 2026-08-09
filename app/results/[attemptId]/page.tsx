import type { Metadata } from "next"
import { ResultReview } from "@/components/result-review"

export const metadata: Metadata = {
  title: "Result — GATE CSE test centre",
  description: "Per-question review, subject-wise breakdown and pacing analysis for your test attempt.",
}

export default async function ResultPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params
  return <ResultReview attemptId={attemptId} />
}
