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
    <div className="fixed bottom-6 right-6 z-50 w-80 border-[3px] border-[#1F2937] bg-white shadow-neo rounded-2xl overflow-hidden font-mono select-none">
      {/* Draggable Header */}
      <div className="bg-[#1CB0F6] border-b-[3px] border-[#1F2937] px-3 py-2.5 text-white flex items-center justify-between font-black text-[11px] uppercase tracking-wider">
        <span className="flex items-center gap-2">
          <CalcIcon className="size-4" strokeWidth={2.5} />
          GATE Scientific
        </span>
        <button
          type="button"
          onClick={onClose}
          className="hover:bg-white/20 p-1 rounded-md transition-colors"
        >
          <X className="size-4" strokeWidth={2.5} />
        </button>
      </div>

      {/* Screen */}
      <div className="p-4 bg-[#FAFBFF] border-b-[3px] border-[#1F2937] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between text-[10px] text-[#1F2937] mb-2 font-bold">
          <button
            type="button"
            onClick={() => setIsRad(!isRad)}
            className="border-2 border-[#1F2937] px-2 py-0.5 rounded-md text-[10px] uppercase bg-[#FF9600] text-white shadow-neo-xs hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all"
          >
            {isRad ? "Rad" : "Deg"}
          </button>
          <span className="bg-white border-2 border-[#1F2937] px-2 py-0.5 rounded-md shadow-neo-xs">M: {memory}</span>
        </div>
        <div className="text-right text-3xl font-mono font-black tracking-tight text-[#1F2937] overflow-x-auto py-1">
          {display}
        </div>
      </div>

      {/* Calculator Buttons Grid */}
      <div className="p-3 grid grid-cols-5 gap-1.5 text-[11px] bg-[#E5F6FF]">
        {/* Row 1: Memory */}
        <button onClick={() => setMemory(0)} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-bold transition-all text-[#1F2937]">MC</button>
        <button onClick={() => setDisplay(String(memory))} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-bold transition-all text-[#1F2937]">MR</button>
        <button onClick={() => setMemory(parseFloat(display) || 0)} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-bold transition-all text-[#1F2937]">MS</button>
        <button onClick={() => setMemory(memory + (parseFloat(display) || 0))} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-bold transition-all text-[#1F2937]">M+</button>
        <button onClick={() => setMemory(memory - (parseFloat(display) || 0))} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-bold transition-all text-[#1F2937]">M-</button>

        {/* Row 2: Trig */}
        <button onClick={() => handleScientificFunc("sin")} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-bold transition-all text-[#1F2937]">sin</button>
        <button onClick={() => handleScientificFunc("cos")} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-bold transition-all text-[#1F2937]">cos</button>
        <button onClick={() => handleScientificFunc("tan")} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-bold transition-all text-[#1F2937]">tan</button>
        <button onClick={handleClear} className="border-2 border-[#1F2937] bg-[#FF4B4B] p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-black transition-all text-white">C</button>
        <button onClick={handleBackspace} className="border-2 border-[#1F2937] bg-[#CE82FF] p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-black transition-all text-white">←</button>

        {/* Row 3: Advanced Math */}
        <button onClick={() => handleScientificFunc("asin")} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-bold transition-all text-[#1F2937]">asin</button>
        <button onClick={() => handleScientificFunc("acos")} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-bold transition-all text-[#1F2937]">acos</button>
        <button onClick={() => handleScientificFunc("atan")} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-bold transition-all text-[#1F2937]">atan</button>
        <button onClick={() => handleScientificFunc("log")} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-bold transition-all text-[#1F2937]">log</button>
        <button onClick={() => handleScientificFunc("ln")} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-bold transition-all text-[#1F2937]">ln</button>

        {/* Row 4: Power & Roots + Digits */}
        <button onClick={() => handleScientificFunc("sqrt")} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-bold transition-all text-[#1F2937]">√</button>
        <button onClick={() => handleNum("7")} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-black text-sm transition-all text-[#1F2937]">7</button>
        <button onClick={() => handleNum("8")} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-black text-sm transition-all text-[#1F2937]">8</button>
        <button onClick={() => handleNum("9")} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-black text-sm transition-all text-[#1F2937]">9</button>
        <button onClick={() => handleOp("/")} className="border-2 border-[#1F2937] bg-[#FF9600] p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-black text-sm transition-all text-white">÷</button>

        {/* Row 5 */}
        <button onClick={() => handleScientificFunc("sqr")} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-bold transition-all text-[#1F2937]">x²</button>
        <button onClick={() => handleNum("4")} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-black text-sm transition-all text-[#1F2937]">4</button>
        <button onClick={() => handleNum("5")} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-black text-sm transition-all text-[#1F2937]">5</button>
        <button onClick={() => handleNum("6")} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-black text-sm transition-all text-[#1F2937]">6</button>
        <button onClick={() => handleOp("*")} className="border-2 border-[#1F2937] bg-[#FF9600] p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-black text-sm transition-all text-white">×</button>

        {/* Row 6 */}
        <button onClick={() => handleScientificFunc("inv")} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-bold transition-all text-[#1F2937]">1/x</button>
        <button onClick={() => handleNum("1")} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-black text-sm transition-all text-[#1F2937]">1</button>
        <button onClick={() => handleNum("2")} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-black text-sm transition-all text-[#1F2937]">2</button>
        <button onClick={() => handleNum("3")} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-black text-sm transition-all text-[#1F2937]">3</button>
        <button onClick={() => handleOp("-")} className="border-2 border-[#1F2937] bg-[#FF9600] p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-black text-lg transition-all text-white">-</button>

        {/* Row 7 */}
        <button onClick={() => handleScientificFunc("fact")} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-bold transition-all text-[#1F2937]">n!</button>
        <button onClick={() => handleNum("0")} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-black text-sm transition-all text-[#1F2937]">0</button>
        <button onClick={() => handleNum(".")} className="border-2 border-[#1F2937] bg-white p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-black text-sm transition-all text-[#1F2937]">.</button>
        <button onClick={handleEval} className="border-2 border-[#1F2937] bg-[#58CC02] p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-black text-sm transition-all text-white">=</button>
        <button onClick={() => handleOp("+")} className="border-2 border-[#1F2937] bg-[#FF9600] p-2 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-neo-xs font-black text-lg transition-all text-white">+</button>
      </div>
    </div>
  )
}
