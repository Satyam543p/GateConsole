"use client"

import React, { useMemo } from "react"
import Latex from "react-latex-next"
import { cn } from "@/lib/utils"

interface FormattedContentProps {
  content?: string
  className?: string
}

const KATEX_MACROS = {
  "\\leftouterjoin": "\\mathbin{\\ltimes}",
  "\\rightouterjoin": "\\mathbin{\\rtimes}",
  "\\fullouterjoin": "\\mathbin{\\bowtie}",
  "\\textdollar": "\\$",
}

export function InlineFormatted({ text }: { text: string }) {
  if (!text) return null

  // Tokenize Math ($...$), Inline Code (`...`), Bold (**...**), and Italic (*...*)
  const tokenRegex = /(\$\$[\s\S]*?\$\$|\$[^$\r\n]+?\$|`[^`]+?`|\*\*[^*]+?\*\*|\*[^*]+?\*)/g
  const parts = text.split(tokenRegex)

  return (
    <>
      {parts.map((p, idx) => {
        if (!p) return null

        if (p.startsWith("$$") || p.startsWith("$")) {
          return (
            <Latex key={idx} macros={KATEX_MACROS} strict={false}>
              {p}
            </Latex>
          )
        }
        if (p.startsWith("`") && p.endsWith("`") && p.length >= 2) {
          return (
            <code
              key={idx}
              className="mx-0.5 inline-block rounded-md border border-border/50 bg-[#F1F5F9] dark:bg-[#1E293B] px-1.5 py-0.5 font-mono text-[12px] sm:text-[13px] font-bold text-[#0284C7] dark:text-[#38BDF8]"
            >
              {p.slice(1, -1)}
            </code>
          )
        }
        if (p.startsWith("**") && p.endsWith("**") && p.length >= 4) {
          return (
            <strong key={idx} className="font-heading font-black text-foreground">
              <InlineFormatted text={p.slice(2, -2)} />
            </strong>
          )
        }
        if (p.startsWith("*") && p.endsWith("*") && p.length >= 2) {
          return (
            <em key={idx} className="italic text-foreground">
              <InlineFormatted text={p.slice(1, -1)} />
            </em>
          )
        }

        return <span key={idx}>{p}</span>
      })}
    </>
  )
}

function parseMarkdownTablesAndParagraphs(text: string) {
  const lines = text.split("\n")
  const blocks: Array<
    | { type: "text"; value: string }
    | { type: "table"; headers: string[]; rows: string[][] }
  > = []

  let currentTextLines: string[] = []
  let currentTableLines: string[] = []

  const flushText = () => {
    if (currentTextLines.length > 0) {
      const val = currentTextLines.join("\n").trim()
      if (val) {
        blocks.push({ type: "text", value: val })
      }
      currentTextLines = []
    }
  }

  const flushTable = () => {
    if (currentTableLines.length >= 2) {
      const headerLine = currentTableLines[0]
      const rowLines = currentTableLines.slice(2) // skip separator line |---|---|

      const headers = headerLine
        .split("|")
        .map((c) => c.trim())
        .filter((c, idx, arr) => idx > 0 && idx < arr.length - 1)

      const rows = rowLines.map((r) =>
        r
          .split("|")
          .map((c) => c.trim())
          .filter((c, idx, arr) => idx > 0 && idx < arr.length - 1)
      )

      blocks.push({ type: "table", headers, rows })
    } else if (currentTableLines.length > 0) {
      currentTextLines.push(...currentTableLines)
    }
    currentTableLines = []
  }

  for (const rawLine of lines) {
    const trimmed = rawLine.trim()
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushText()
      currentTableLines.push(trimmed)
    } else {
      if (currentTableLines.length > 0) {
        flushTable()
      }
      currentTextLines.push(rawLine)
    }
  }

  flushText()
  if (currentTableLines.length > 0) {
    flushTable()
  }

  return blocks
}

export function FormattedContent({ content, className }: FormattedContentProps) {
  if (!content) return null

  // Normalize double-escaped newlines and extract code blocks
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const parts = useMemo(() => {
    const clean = content.replace(/\\n/g, "\n")
    return clean.split(/(```[\s\S]*?```)/g)
  }, [content])

  return (
    <div className={cn("space-y-3.5 text-foreground leading-relaxed min-w-0 break-words", className)}>
      {parts.map((part, i) => {
        if (part.startsWith("```")) {
          const firstLineEnd = part.indexOf("\n")
          const lang = firstLineEnd !== -1 ? part.slice(3, firstLineEnd).trim() : ""
          const code =
            firstLineEnd !== -1
              ? part.slice(firstLineEnd + 1, -3).trim()
              : part.slice(3, -3).trim()

          return (
            <div key={i} className="my-3 overflow-hidden rounded-xl border-3 border-border bg-[#1F2937] shadow-neo-sm">
              {lang && (
                <div className="border-b border-border/40 bg-[#111827] px-4 py-1.5 font-mono text-[11px] font-bold text-[#38BDF8] uppercase tracking-wider">
                  {lang}
                </div>
              )}
              <pre className="overflow-x-auto p-4 font-mono text-[12px] md:text-[13px] leading-relaxed text-[#F8FAFC] custom-scrollbar">
                {code}
              </pre>
            </div>
          )
        }

        if (!part.trim()) return null

        const subBlocks = parseMarkdownTablesAndParagraphs(part)

        return (
          <React.Fragment key={i}>
            {subBlocks.map((block, bIdx) => {
              if (block.type === "table") {
                return (
                  <div key={bIdx} className="my-4 overflow-x-auto rounded-xl border-3 border-border bg-white shadow-neo-sm">
                    <table className="w-full text-left text-[13px] sm:text-[14px]">
                      <thead className="border-b-3 border-border bg-[#F3F4F6]">
                        <tr>
                          {block.headers.map((h, hIdx) => (
                            <th
                              key={hIdx}
                              className="border-r border-border/40 px-4 py-2.5 font-heading font-black text-foreground last:border-r-0 text-center"
                            >
                              <InlineFormatted text={h} />
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {block.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-[#F8FAFC] transition-colors">
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className="border-r border-border/30 px-4 py-2.5 font-mono font-medium text-foreground last:border-r-0 text-center"
                              >
                                <InlineFormatted text={cell} />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              }

              // Text paragraphs
              const paragraphs = block.value.split(/\n\s*\n/)
              return (
                <div key={bIdx} className="space-y-2.5">
                  {paragraphs.map((para, pIdx) => {
                    const trimmed = para.trim()
                    if (!trimmed) return null

                    // Heading formatting if starts with ### or ##
                    if (trimmed.startsWith("### ")) {
                      return (
                        <h4 key={pIdx} className="font-heading font-black text-[15px] sm:text-[16px] text-foreground mt-4 mb-2 flex items-center gap-2">
                          <InlineFormatted text={trimmed.slice(4)} />
                        </h4>
                      )
                    }
                    if (trimmed.startsWith("## ")) {
                      return (
                        <h3 key={pIdx} className="font-heading font-black text-[16px] sm:text-[18px] text-foreground mt-5 mb-2">
                          <InlineFormatted text={trimmed.slice(3)} />
                        </h3>
                      )
                    }

                    return (
                      <p key={pIdx} className="leading-relaxed text-pretty">
                        <InlineFormatted text={trimmed} />
                      </p>
                    )
                  })}
                </div>
              )
            })}
          </React.Fragment>
        )
      })}
    </div>
  )
}
