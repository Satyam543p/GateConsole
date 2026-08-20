import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ExamRunner } from "@/components/exam-runner"
import { getAllTests, getTest } from "@/lib/exams/registry"

export function generateStaticParams() {
  return getAllTests().map((t) => ({ testId: t.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ testId: string }> }): Promise<Metadata> {
  const { testId } = await params
  const test = getTest(testId)
  return {
    title: test ? `${test.title} — GATE CSE test centre` : "Test not found",
    description: test?.description,
  }
}

export default async function TestPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ testId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { testId } = await params
  const { mode } = await searchParams
  let test = getTest(testId)
  
  // Dynamic fallback for instant remedial and custom-generated practice drills
  if (!test && (testId.startsWith("remedial-") || testId.startsWith("custom-"))) {
    test = {
      id: testId,
      title: testId.startsWith("remedial-") ? "Instant Remedial Drill" : "Custom Practice Drill",
      kind: "practice",
      durationMinutes: 45,
      timerType: "stopwatch",
      description: "Targeted remedial practice session focusing on recently missed questions and weak concepts.",
      questionIds: [],
    }
  }

  if (!test) notFound()

  const finalTest = { ...test }
  if (mode === "practice" || mode === "drill") {
    finalTest.kind = mode as any
  }

  return <ExamRunner test={finalTest} />
}
