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
  const test = getTest(testId)
  if (!test) notFound()

  const finalTest = { ...test }
  if (mode === "practice" || mode === "drill") {
    finalTest.kind = mode as any
  }

  return <ExamRunner test={finalTest} />
}
