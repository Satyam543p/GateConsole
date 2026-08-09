/**
 * GATE ECE (Electronics & Communication Engineering) Subject Weightage & Syllabus Data
 */

export interface ChapterInfo {
  id: string
  name: string
}

export interface SubjectWeightageItem {
  subject: string
  marks: number
  note: string
  chapters: ChapterInfo[]
}

export const SUBJECT_WEIGHTAGE: SubjectWeightageItem[] = [
  {
    subject: "General Aptitude",
    marks: 15,
    note: "Mandatory section: 10 questions testing quantitative, verbal, logical, and spatial aptitude.",
    chapters: [],
  },
  {
    subject: "Engineering Mathematics",
    marks: 13,
    note: "Linear algebra, calculus, differential equations, complex variables, and probability.",
    chapters: [],
  },
  {
    subject: "Signals and Systems",
    marks: 11,
    note: "Continuous & discrete-time signals, LTI systems, Fourier analysis, Laplace & Z-transforms.",
    chapters: [],
  },
  {
    subject: "Electromagnetics",
    marks: 10,
    note: "Maxwell's equations, plane waves, transmission lines, waveguides, antennas.",
    chapters: [],
  },
  {
    subject: "Communication Systems",
    marks: 10,
    note: "Analog & digital modulation, SNR analysis, information theory, error control coding.",
    chapters: [],
  },
  {
    subject: "Analog Circuits",
    marks: 8,
    note: "Diode circuits, BJT/FET biasing & small-signal models, Op-Amps, frequency response.",
    chapters: [],
  },
  {
    subject: "Digital Circuits",
    marks: 8,
    note: "Combinational & sequential logic, state machines, logic families, semiconductor memories.",
    chapters: [],
  },
  {
    subject: "Network Theory",
    marks: 8,
    note: "Network solution methods, continuous & discrete-time transient response, two-port networks.",
    chapters: [],
  },
  {
    subject: "Electronic Devices",
    marks: 7,
    note: "Energy bands, carrier transport, P-N junctions, Zener diode, BJT, MOS capacitor, MOSFET.",
    chapters: [],
  },
  {
    subject: "Control Systems",
    marks: 10,
    note: "Transfer functions, block diagrams, time & frequency response, stability (Routh-Hurwitz, Bode, Nyquist).",
    chapters: [],
  }
]
