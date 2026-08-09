/**
 * GATE EE (Electrical Engineering) Subject Weightage & Syllabus Data
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
    note: "Fixed 15 marks covering numerical, verbal, analytical, and spatial reasoning.",
    chapters: [],
  },
  {
    subject: "Engineering Mathematics",
    marks: 13,
    note: "Linear algebra, calculus, differential equations, complex variables, probability, and transform theory.",
    chapters: [],
  },
  {
    subject: "Electrical Machines",
    marks: 11,
    note: "Transformers, DC machines, Induction machines, and Synchronous machines.",
    chapters: [],
  },
  {
    subject: "Power Systems",
    marks: 10,
    note: "Power generation concepts, transmission lines, load flow, faults, protection, and stability.",
    chapters: [],
  },
  {
    subject: "Power Electronics",
    marks: 8,
    note: "Semiconductor power devices, AC-DC converters, DC-DC converters, DC-AC inverters.",
    chapters: [],
  },
  {
    subject: "Electric Circuits",
    marks: 8,
    note: "Network elements, KVL, KCL, Network Theorems, resonance, transient response, AC circuits.",
    chapters: [],
  },
  {
    subject: "Signals and Systems",
    marks: 8,
    note: "Continuous & discrete-time signals, Fourier series/transforms, Laplace and Z-transforms.",
    chapters: [],
  },
  {
    subject: "Control Systems",
    marks: 8,
    note: "Mathematical modeling, feedback, transfer functions, stability analysis, compensators.",
    chapters: [],
  },
  {
    subject: "Analog and Digital Electronics",
    marks: 8,
    note: "Diodes, BJTs, MOSFETs, op-amps, Boolean algebra, combinational & sequential logic.",
    chapters: [],
  },
  {
    subject: "Electrical and Electronic Measurements",
    marks: 6,
    note: "Bridges, potentiometers, measurement of voltage/current/power/energy, instrument transformers.",
    chapters: [],
  },
  {
    subject: "Electromagnetic Fields",
    marks: 5,
    note: "Coulomb's Law, Gauss's Law, Ampere's Law, Faraday's Law, magnetic circuits.",
    chapters: [],
  }
]
