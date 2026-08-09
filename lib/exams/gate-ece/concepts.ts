/**
 * GATE ECE Key Concepts Mind Map
 */

import type { Concept } from "@/lib/domain/types"

export const CONCEPTS: Concept[] = [
  {
    id: "ece-c-nyquist-sampling",
    subjectId: "Signals & Systems",
    chapterId: "ece-ss-3",
    label: "Nyquist Sampling Theorem",
    kind: "theorem",
    summary:
      "A band-limited continuous-time signal with maximum frequency f_max can be uniquely reconstructed from its samples if the sampling rate fs ≥ 2 · f_max. Sampling below Nyquist rate causes spectral overlap (aliasing).",
    formula: "f_s \\ge 2 f_{\\text{max}}",
    complexity: "O(N log N) for FFT processing",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "Convolution in time corresponds to multiplication in frequency: the maximum frequency of x1(t)*x2(t) is MIN(B1, B2), not MAX or sum.",
      "Product in time x1(t)·x2(t) corresponds to convolution in frequency: max frequency is B1 + B2.",
    ],
    pyqIds: ["ece-ss-001"],
  },
  {
    id: "ece-c-opamp-inverting",
    subjectId: "Analog Circuits",
    chapterId: "ece-ac-2",
    label: "Op-Amp Virtual Ground & Inverting Gain",
    kind: "definition",
    summary:
      "Due to infinite open-loop gain and high input impedance of an ideal Op-Amp, negative feedback enforces virtual short (V+ = V-). The inverting configuration gain is Av = -Rf / R1.",
    formula: "A_v = -\\frac{R_f}{R_1}",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "Virtual ground assumption holds ONLY when negative feedback is present and Op-Amp is not saturated.",
      "Remember input current into ideal Op-Amp terminals is zero.",
    ],
    pyqIds: ["ece-ac-001"],
  },
  {
    id: "ece-c-bpsk-qpsk",
    subjectId: "Communications",
    chapterId: "ece-com-2",
    label: "BPSK vs QPSK Digital Modulation",
    kind: "technique",
    summary:
      "BPSK maps 1 bit/symbol using phase shift {0, π}. QPSK maps 2 bits/symbol over two quadrature carrier components. Both share identical BER vs Eb/N0 curves, but QPSK requires half the transmission bandwidth for the same bit rate.",
    formula: "P_e = Q\\left(\\sqrt{\\frac{2E_b}{N_0}}\\right)",
    prerequisites: ["ece-c-nyquist-sampling"],
    examRelevance: 4,
    commonTraps: [
      "QPSK symbol rate (baud rate) is half the bit rate (Rs = Rb / 2).",
      "Do not confuse bit error rate (BER) with symbol error rate (SER).",
    ],
    pyqIds: ["ece-com-002"],
  },
  {
    id: "ece-c-transmission-lines",
    subjectId: "Electromagnetics & Transmission Lines",
    chapterId: "ece-em-2-ch",
    label: "Lossless Transmission Line Characteristic Impedance",
    kind: "formula",
    summary:
      "For a lossless transmission line (R=0, G=0), the characteristic impedance Z0 is purely real and determined by inductance L and capacitance C per unit length.",
    formula: "Z_0 = \\sqrt{\\frac{L}{C}}",
    prerequisites: [],
    examRelevance: 4,
    commonTraps: [
      "Z0 is independent of line length.",
      "Propagation velocity v = 1 / √(LC).",
    ],
    pyqIds: ["ece-em-001"],
  },
]
