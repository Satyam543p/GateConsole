"use client"

import { useRef, useState, useTransition } from "react"
import { Download, Upload, CheckCircle, AlertCircle, FileJson } from "lucide-react"
import { getStore } from "@/lib/storage/store"
import type { StudyBackup, ImportReport } from "@/lib/storage/store"

// ─── Export ───────────────────────────────────────────────────────────────────

export function ExportPanel() {
  const [exporting, setExporting] = useState(false)
  const [done, setDone] = useState(false)

  async function handleExport() {
    setExporting(true)
    setDone(false)
    try {
      const store = getStore()
      const backup = await store.exportAll()
      const json = JSON.stringify(backup, null, 2)
      const blob = new Blob([json], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const ts = new Date().toISOString().slice(0, 10)
      a.download = `gate-cse-backup-${ts}.json`
      a.click()
      URL.revokeObjectURL(url)
      setDone(true)
      setTimeout(() => setDone(false), 4000)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-[16px] font-heading font-bold text-primary-text flex items-center gap-2">
        <Download className="size-5 text-[#6C8EF2]" />
        Export Backup
      </h2>
      <p className="mt-1 text-[13px] text-secondary-text leading-relaxed">
        Downloads a single JSON file containing all your attempts, mistakes, SRS
        cards, sessions, notes, and settings.
      </p>
      <button
        type="button"
        onClick={handleExport}
        disabled={exporting}
        className="mt-4 inline-flex items-center gap-2 bg-[#F0F4FF] border-[1.5px] border-[#D0DAFE] text-[#6C8EF2] px-4 py-2 rounded-[8px] font-heading font-semibold text-[13px] hover:bg-[#EEF1FE] transition-colors disabled:opacity-50"
      >
        {done ? (
          <>
            <CheckCircle className="size-4" />
            Backup downloaded
          </>
        ) : (
          <>
            <Download className="size-4" />
            {exporting ? "Preparing…" : "Export Backup"}
          </>
        )}
      </button>
    </div>
  )
}

// ─── Import ───────────────────────────────────────────────────────────────────

type ImportState =
  | { step: "idle" }
  | { step: "parsing"; raw: string }
  | { step: "preview"; backup: StudyBackup; mode: "merge" | "replace" }
  | { step: "importing" }
  | { step: "done"; report: ImportReport }
  | { step: "error"; message: string }

function countRecords(backup: StudyBackup): string {
  const totals = Object.values(backup.data ?? {}).map((arr) =>
    Array.isArray(arr) ? arr.length : 0
  )
  const total = totals.reduce((s, n) => s + n, 0)
  return `${total} records across ${Object.keys(backup.data ?? {}).length} collections`
}

export function ImportPanel() {
  const [state, setState] = useState<ImportState>({ step: "idle" })
  const [text, setText] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  function parseText(raw: string) {
    setState({ step: "parsing", raw })
    try {
      const parsed = JSON.parse(raw)
      const backup = parsed as StudyBackup
      if (!backup.data || typeof backup.data !== "object") {
        setState({ step: "error", message: "JSON is not a valid backup file (missing `data` key)." })
        return
      }
      setState({ step: "preview", backup, mode: "merge" })
    } catch (e) {
      setState({
        step: "error",
        message: e instanceof SyntaxError ? `JSON parse error: ${e.message}` : "Unknown parse error.",
      })
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const raw = ev.target?.result as string
      setText(raw)
      parseText(raw)
    }
    reader.readAsText(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const raw = ev.target?.result as string
      setText(raw)
      parseText(raw)
    }
    reader.readAsText(file)
  }

  async function handleCommit(backup: StudyBackup, mode: "merge" | "replace") {
    setState({ step: "importing" })
    try {
      const store = getStore()
      const report = await store.importAll(backup, mode)
      setState({ step: "done", report })
      setText("")
    } catch (e) {
      setState({
        step: "error",
        message: e instanceof Error ? e.message : "Import failed.",
      })
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-[16px] font-heading font-bold text-primary-text flex items-center gap-2">
        <Upload className="size-5 text-[#F2A0C0]" />
        Import Backup
      </h2>
      <p className="mt-1 text-[13px] text-secondary-text leading-relaxed">
        Paste your backup JSON or drop the file below. A diff is shown before
        any data is written.
      </p>

      {/* Drop zone / paste area */}
      {state.step === "idle" || state.step === "error" ? (
        <div className="mt-6 space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            role="button"
            tabIndex={0}
            className="flex flex-col items-center justify-center border-2 border-dashed border-[#D0DAFE] bg-[#F8FAFC] rounded-[12px] py-10 cursor-pointer transition-colors hover:border-[#6C8EF2] hover:bg-[#F0F4FF]"
          >
            <FileJson className="size-8 text-[#6C8EF2] mb-3" />
            <p className="text-[13px] font-medium text-primary-text">
              Drop .json file here or click to browse
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".json,application/json"
              className="sr-only"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-[#E2E8F0]"></div>
            <span className="text-[11px] font-medium text-muted-text uppercase tracking-wider">or paste JSON</span>
            <div className="flex-1 h-px bg-[#E2E8F0]"></div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='{"version":1,"data":{...}}'
            rows={5}
            className="w-full resize-y border border-[#E2E8F0] bg-[#F8FAFC] p-4 rounded-[12px] font-mono text-[11px] text-primary-text placeholder:text-muted-text focus:border-[#6C8EF2] focus:ring-1 focus:ring-[#6C8EF2] outline-none transition-all"
          />

          <button
            type="button"
            disabled={!text.trim()}
            onClick={() => parseText(text)}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#6C8EF2] text-white px-4 py-2.5 rounded-[8px] font-heading font-semibold text-[13px] transition-colors hover:bg-[#5A7AE0] disabled:opacity-50"
          >
            <Upload className="size-4" />
            Parse &amp; Preview
          </button>

          {state.step === "error" && (
            <div className="flex items-start gap-2 text-[13px] text-[#F87171] bg-[#FFF0F5] p-3 rounded-[8px]">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <p>{state.message}</p>
            </div>
          )}
        </div>
      ) : null}

      {/* Preview / diff */}
      {state.step === "preview" && (
        <div className="mt-6 space-y-6">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-[12px]">
            <p className="text-[11px] font-medium text-muted-text uppercase tracking-wider mb-1">Backup Summary</p>
            <p className="text-[14px] font-heading font-bold text-primary-text">{countRecords(state.backup)}</p>
            <p className="mt-1 text-[11px] text-secondary-text">
              Exported: {new Date(state.backup.exportedAt ?? "").toLocaleString()} ·
              Schema v{state.backup.version}
            </p>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-[11px] font-medium text-muted-text uppercase tracking-wider mb-2">Import Mode</legend>
            {(["merge", "replace"] as const).map((m) => (
              <label key={m} className="flex items-start gap-3 p-3 border border-[#E2E8F0] rounded-[10px] cursor-pointer hover:bg-[#F8FAFC] transition-colors has-[:checked]:border-[#6C8EF2] has-[:checked]:bg-[#F0F4FF]">
                <input
                  type="radio"
                  name="import-mode"
                  value={m}
                  checked={state.mode === m}
                  onChange={() => setState({ ...state, mode: m })}
                  className="mt-1 shrink-0 accent-[#6C8EF2]"
                />
                <div>
                  <span className="block font-heading font-semibold text-[14px] text-primary-text capitalize">{m}</span>
                  <span className="block text-[12px] text-secondary-text mt-0.5 leading-relaxed">
                    {m === "merge"
                      ? "Update matching records, add new ones, keep everything else."
                      : "Wipe each collection present in the backup, then insert. Irreversible."}
                  </span>
                </div>
              </label>
            ))}
          </fieldset>

          {state.mode === "replace" && (
            <div className="flex items-center gap-2 text-[13px] text-[#FBBF24] bg-[#FEF3C7]/50 p-3 rounded-[8px]">
              <AlertCircle className="size-4 shrink-0" />
              <p>Replace mode will permanently overwrite the affected collections.</p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleCommit(state.backup, state.mode)}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#6C8EF2] text-white px-4 py-2.5 rounded-[8px] font-heading font-semibold text-[13px] transition-colors hover:bg-[#5A7AE0]"
            >
              <Upload className="size-4" />
              Commit Import
            </button>
            <button
              type="button"
              onClick={() => { setState({ step: "idle" }); setText("") }}
              className="px-4 py-2.5 border-[1.5px] border-[#E2E8F0] rounded-[8px] font-heading font-semibold text-[13px] text-secondary-text hover:bg-[#F8FAFC] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Importing */}
      {state.step === "importing" && (
        <div className="mt-6 text-center text-[13px] text-secondary-text animate-pulse">
          Importing...
        </div>
      )}

      {/* Done */}
      {state.step === "done" && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2 text-[#34D399] bg-[#D1FAE5]/30 p-3 rounded-[8px] font-medium text-[13px]">
            <CheckCircle className="size-4 shrink-0" />
            <p>Import complete successfully.</p>
          </div>
          
          <button
            type="button"
            onClick={() => setState({ step: "idle" })}
            className="inline-flex px-4 py-2 border-[1.5px] border-[#E2E8F0] rounded-[8px] font-heading font-semibold text-[13px] text-secondary-text hover:bg-[#F8FAFC] transition-colors"
          >
            Import another
          </button>
        </div>
      )}
    </div>
  )
}
