"use client"

/**
 * components/gate-calculator.tsx
 *
 * Floating GATE Scientific Calculator component matching TCS iON GATE exam specifications.
 */

import { useState, useCallback } from "react"
import { X, Minimize2, Calculator as CalcIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function GateCalculator({ onClose }: { onClose: () => void }) {
  const [display, setDisplay] = useState("0")
  const [memory, setMemory] = useState<number>(0)
  const [isRad, setIsRad] = useState(false)
  const [newNumber, setNewNumber] = useState(true)

  const handleNum = (digit: string) => {
    if (newNumber || display === "0") {
      setDisplay(digit)
      setNewNumber(false)
    } else {
      setDisplay(display + digit)
    }
  }

  const handleOp = (op: string) => {
    setDisplay(display + " " + op + " ")
    setNewNumber(false)
  }

  const handleClear = () => {
    setDisplay("0")
    setNewNumber(true)
  }

  const handleBackspace = () => {
    if (display.length <= 1) {
      setDisplay("0")
      setNewNumber(true)
    } else {
      setDisplay(display.slice(0, -1))
    }
  }

  const handleEval = () => {
    try {
      // Evaluate expression safely
      const cleanExpr = display
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/π/g, "Math.PI")
        .replace(/e/g, "Math.E")

      // Simple evaluation logic for basic math
      const res = Function(`"use strict"; return (${cleanExpr})`)()
      if (typeof res === "number" && !isNaN(res)) {
        setDisplay(String(Number(res.toFixed(8))))
        setNewNumber(true)
      } else {
        setDisplay("Error")
        setNewNumber(true)
      }
    } catch {
      setDisplay("Error")
      setNewNumber(true)
    }
  }

  const handleScientificFunc = (func: string) => {
    try {
      const val = parseFloat(display)
      if (isNaN(val)) return

      let result = val
      const factor = isRad ? 1 : Math.PI / 180

      switch (func) {
        case "sin":
          result = Math.sin(val * factor)
          break
        case "cos":
          result = Math.cos(val * factor)
          break
        case "tan":
          result = Math.tan(val * factor)
          break
        case "asin":
          result = isRad ? Math.asin(val) : (Math.asin(val) * 180) / Math.PI
          break
        case "acos":
          result = isRad ? Math.acos(val) : (Math.acos(val) * 180) / Math.PI
          break
        case "atan":
          result = isRad ? Math.atan(val) : (Math.atan(val) * 180) / Math.PI
          break
        case "log":
          result = Math.log10(val)
          break
        case "ln":
          result = Math.log(val)
          break
        case "sqrt":
          result = Math.sqrt(val)
          break
        case "sqr":
          result = val * val
          break
        case "cube":
          result = val * val * val
          break
        case "inv":
          result = 1 / val
          break
        case "fact":
          let f = 1
          for (let i = 2; i <= Math.floor(val); i++) f *= i
          result = f
          break
      }

      setDisplay(String(Number(result.toFixed(8))))
      setNewNumber(true)
    } catch {
      setDisplay("Error")
      setNewNumber(true)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 border-2 border-primary bg-card shadow-2xl font-mono select-none">
      {/* Draggable Header */}
      <div className="bg-primary px-3 py-2 text-primary-foreground flex items-center justify-between font-bold text-xs uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <CalcIcon className="size-3.5" />
          GATE Scientific Calculator
        </span>
        <button
          type="button"
          onClick={onClose}
          className="hover:opacity-75 transition-opacity"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Screen */}
      <div className="p-3 bg-muted/20 border-b border-border">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
          <button
            type="button"
            onClick={() => setIsRad(!isRad)}
            className="border border-border px-1.5 py-0.5 text-[9px] uppercase bg-background font-semibold text-primary"
          >
            {isRad ? "Rad" : "Deg"}
          </button>
          <span>M: {memory}</span>
        </div>
        <div className="text-right text-xl font-mono font-bold tracking-wider text-foreground overflow-x-auto py-1">
          {display}
        </div>
      </div>

      {/* Calculator Buttons Grid */}
      <div className="p-3 grid grid-cols-5 gap-1 text-[11px]">
        {/* Row 1: Memory */}
        <button onClick={() => setMemory(0)} className="border border-border bg-background p-1.5 hover:bg-muted text-[10px]">MC</button>
        <button onClick={() => setDisplay(String(memory))} className="border border-border bg-background p-1.5 hover:bg-muted text-[10px]">MR</button>
        <button onClick={() => setMemory(parseFloat(display) || 0)} className="border border-border bg-background p-1.5 hover:bg-muted text-[10px]">MS</button>
        <button onClick={() => setMemory(memory + (parseFloat(display) || 0))} className="border border-border bg-background p-1.5 hover:bg-muted text-[10px]">M+</button>
        <button onClick={() => setMemory(memory - (parseFloat(display) || 0))} className="border border-border bg-background p-1.5 hover:bg-muted text-[10px]">M-</button>

        {/* Row 2: Trig */}
        <button onClick={() => handleScientificFunc("sin")} className="border border-border bg-background p-1.5 hover:bg-muted">sin</button>
        <button onClick={() => handleScientificFunc("cos")} className="border border-border bg-background p-1.5 hover:bg-muted">cos</button>
        <button onClick={() => handleScientificFunc("tan")} className="border border-border bg-background p-1.5 hover:bg-muted">tan</button>
        <button onClick={handleClear} className="border border-red-500/40 bg-red-500/10 text-red-400 p-1.5 hover:bg-red-500/20 font-bold">C</button>
        <button onClick={handleBackspace} className="border border-amber-500/40 bg-amber-500/10 text-amber-400 p-1.5 hover:bg-amber-500/20">←</button>

        {/* Row 3: Advanced Math */}
        <button onClick={() => handleScientificFunc("asin")} className="border border-border bg-background p-1.5 hover:bg-muted text-[10px]">asin</button>
        <button onClick={() => handleScientificFunc("acos")} className="border border-border bg-background p-1.5 hover:bg-muted text-[10px]">acos</button>
        <button onClick={() => handleScientificFunc("atan")} className="border border-border bg-background p-1.5 hover:bg-muted text-[10px]">atan</button>
        <button onClick={() => handleScientificFunc("log")} className="border border-border bg-background p-1.5 hover:bg-muted">log</button>
        <button onClick={() => handleScientificFunc("ln")} className="border border-border bg-background p-1.5 hover:bg-muted">ln</button>

        {/* Row 4: Power & Roots + Digits */}
        <button onClick={() => handleScientificFunc("sqrt")} className="border border-border bg-background p-1.5 hover:bg-muted">√</button>
        <button onClick={() => handleNum("7")} className="border border-border bg-card p-1.5 hover:bg-muted font-bold text-sm">7</button>
        <button onClick={() => handleNum("8")} className="border border-border bg-card p-1.5 hover:bg-muted font-bold text-sm">8</button>
        <button onClick={() => handleNum("9")} className="border border-border bg-card p-1.5 hover:bg-muted font-bold text-sm">9</button>
        <button onClick={() => handleOp("/")} className="border border-border bg-background p-1.5 hover:bg-muted text-primary font-bold">÷</button>

        {/* Row 5 */}
        <button onClick={() => handleScientificFunc("sqr")} className="border border-border bg-background p-1.5 hover:bg-muted">x²</button>
        <button onClick={() => handleNum("4")} className="border border-border bg-card p-1.5 hover:bg-muted font-bold text-sm">4</button>
        <button onClick={() => handleNum("5")} className="border border-border bg-card p-1.5 hover:bg-muted font-bold text-sm">5</button>
        <button onClick={() => handleNum("6")} className="border border-border bg-card p-1.5 hover:bg-muted font-bold text-sm">6</button>
        <button onClick={() => handleOp("*")} className="border border-border bg-background p-1.5 hover:bg-muted text-primary font-bold">×</button>

        {/* Row 6 */}
        <button onClick={() => handleScientificFunc("inv")} className="border border-border bg-background p-1.5 hover:bg-muted">1/x</button>
        <button onClick={() => handleNum("1")} className="border border-border bg-card p-1.5 hover:bg-muted font-bold text-sm">1</button>
        <button onClick={() => handleNum("2")} className="border border-border bg-card p-1.5 hover:bg-muted font-bold text-sm">2</button>
        <button onClick={() => handleNum("3")} className="border border-border bg-card p-1.5 hover:bg-muted font-bold text-sm">3</button>
        <button onClick={() => handleOp("-")} className="border border-border bg-background p-1.5 hover:bg-muted text-primary font-bold">-</button>

        {/* Row 7 */}
        <button onClick={() => handleScientificFunc("fact")} className="border border-border bg-background p-1.5 hover:bg-muted">n!</button>
        <button onClick={() => handleNum("0")} className="border border-border bg-card p-1.5 hover:bg-muted font-bold text-sm">0</button>
        <button onClick={() => handleNum(".")} className="border border-border bg-card p-1.5 hover:bg-muted font-bold">.</button>
        <button onClick={handleEval} className="border border-primary bg-primary text-primary-foreground p-1.5 hover:opacity-90 font-bold">=</button>
        <button onClick={() => handleOp("+")} className="border border-border bg-background p-1.5 hover:bg-muted text-primary font-bold">+</button>
      </div>
    </div>
  )
}
