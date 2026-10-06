"use client"

import { useState, useEffect } from "react"
import { Check, Plus, Target, CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

type TodoItem = {
  id: string
  text: string
  completed: boolean
}

const RECOMMENDED_TASKS = [
  "Complete the Daily Challenge",
  "Review 5 unsolved Mistakes",
  "Take a 15-mark Subject Test",
]

export default function TodoPage() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [draft, setDraft] = useState("")

  useEffect(() => {
    try {
      const stored = localStorage.getItem("gateconsole_todos")
      if (stored) {
        setTodos(JSON.parse(stored))
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("gateconsole_todos", JSON.stringify(todos))
    } catch {}
  }, [todos])

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  const addTodo = (text: string) => {
    if (!text.trim()) return
    setTodos((prev) => [
      ...prev,
      { id: Date.now().toString(), text: text.trim(), completed: false },
    ])
    setDraft("")
  }

  const activeTodos = todos.filter(t => !t.completed)
  const completedTodos = todos.filter(t => t.completed)

  return (
    <main className="relative z-10 pt-4 sm:pt-6 md:pt-10 pb-44 md:pb-56 px-3 sm:px-4 md:px-6 max-w-5xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#F3E8FF] border-[3px] border-[#1F2937] rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-neo relative overflow-hidden mb-6 sm:mb-8">
        <div className="absolute -top-10 -right-10 size-40 bg-[#A855F7] opacity-20 rounded-full blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-2 bg-white border-2 border-[#1F2937] px-3 py-1 rounded-xl shadow-neo-xs">
              <Target className="size-4 text-[#A855F7]" strokeWidth={2.5} />
              <p className="font-mono text-[10px] sm:text-xs font-black tracking-widest text-foreground uppercase">
                Focus &amp; Execution
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-foreground uppercase tracking-tighter break-words">
              Action Plan
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-foreground/80 max-w-2xl font-bold">
              Keep it simple. Focus on what moves the needle today.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
      {/* Recommended Actions */}
      <section>
        <h2 className="font-mono text-xs font-bold tracking-widest text-[#FF9600] uppercase mb-4">
          Recommended
        </h2>
        <ul className="space-y-3">
          {RECOMMENDED_TASKS.map((task, i) => (
            <li
              key={i}
              className="flex items-center gap-3 p-4 bg-white border-[3px] border-[#1F2937] rounded-xl shadow-neo-sm"
            >
              <Target className="size-5 shrink-0 text-[#FF9600]" />
              <span className="text-sm font-bold text-[#1F2937] flex-1">
                {task}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* My Tasks */}
      <section>
        <h2 className="font-mono text-xs font-bold tracking-widest text-primary uppercase mb-4">
          My Tasks
        </h2>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            addTodo(draft)
          }}
          className="flex gap-2 mb-6"
        >
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a custom task..."
            className="flex-1 bg-white border-[3px] border-[#1F2937] rounded-xl px-4 py-3 font-bold text-base focus:outline-none focus:border-[#1CB0F6] shadow-neo-sm placeholder:text-[#9CA3AF]"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="neo-btn bg-[#58CC02] text-white px-5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:-translate-y-0 disabled:shadow-neo-sm"
          >
            <Plus className="size-6" strokeWidth={3} />
          </button>
        </form>

        {activeTodos.length === 0 && completedTodos.length === 0 && (
          <p className="text-sm font-bold text-muted-foreground text-center py-10 border-2 border-dashed border-[#1F2937]/20 rounded-xl">
            No custom tasks. You're all caught up!
          </p>
        )}

        <ul className="space-y-3">
          {activeTodos.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-3 p-4 bg-white border-[3px] border-[#1F2937] rounded-xl shadow-neo-sm group transition-all"
            >
              <button
                onClick={() => toggleTodo(t.id)}
                className="shrink-0 text-[#9CA3AF] hover:text-[#58CC02] transition-colors"
              >
                <Circle className="size-6" strokeWidth={2.5} />
              </button>
              <span className="text-base font-bold text-[#1F2937] flex-1 break-words">
                {t.text}
              </span>
              <button
                onClick={() => deleteTodo(t.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-[#FF4B4B] hover:bg-[#FFE5E5] rounded-md transition-all"
              >
                <Plus className="size-5 rotate-45" strokeWidth={3} />
              </button>
            </li>
          ))}

          {completedTodos.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-3 p-4 bg-[#F3F4F6] border-[3px] border-[#1F2937]/30 rounded-xl shadow-neo-xs opacity-75 group transition-all"
            >
              <button
                onClick={() => toggleTodo(t.id)}
                className="shrink-0 text-[#58CC02] hover:text-[#9CA3AF] transition-colors"
              >
                <CheckCircle2 className="size-6" strokeWidth={2.5} />
              </button>
              <span className="text-base font-bold text-[#1F2937]/50 line-through flex-1 break-words">
                {t.text}
              </span>
              <button
                onClick={() => deleteTodo(t.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-[#FF4B4B] hover:bg-[#FFE5E5] rounded-md transition-all"
              >
                <Plus className="size-5 rotate-45" strokeWidth={3} />
              </button>
            </li>
          ))}
        </ul>
      </section>
      </div>
    </main>
  )
}
