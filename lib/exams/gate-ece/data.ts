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
    chapters: [
      { id: "ece-ga-1", name: "Quantitative Aptitude & Data Interpretation" },
      { id: "ece-ga-2", name: "Verbal Ability & Logical Reasoning" },
      { id: "ece-ga-3", name: "Spatial Aptitude" },
    ],
  },
  {
    subject: "Engineering Mathematics",
    marks: 13,
    note: "Linear algebra, calculus, differential equations, complex variables, and probability.",
    chapters: [
      { id: "ece-em-1", name: "Linear Algebra & Vector Calculus" },
      { id: "ece-em-2", name: "Differential Equations & Complex Analysis" },
      { id: "ece-em-3", name: "Probability & Random Processes" },
    ],
  },
  {
    subject: "Signals & Systems",
    marks: 14,
    note: "LTI systems, Fourier analysis (CTFT/DTFT), Laplace & Z-transforms, sampling theorem.",
    chapters: [
      { id: "ece-ss-1", name: "Continuous-Time Signals & LTI Systems" },
      { id: "ece-ss-2", name: "Fourier Analysis & Z-Transform" },
      { id: "ece-ss-3", name: "Discrete-Time Processing & Sampling" },
    ],
  },
  {
    subject: "Analog Circuits",
    marks: 12,
    note: "Diode circuits, BJT/FET biasing & small-signal models, Op-Amps, amplifiers & frequency response.",
    chapters: [
      { id: "ece-ac-1", name: "Diode Circuits & Transistor Biasing" },
      { id: "ece-ac-2", name: "Operational Amplifiers & Applications" },
      { id: "ece-ac-3", name: "Small-Signal Amplifiers & Feedback" },
    ],
  },
  {
    subject: "Communications",
    marks: 14,
    note: "Analog & digital modulation techniques, SNR analysis, information theory, error control coding.",
    chapters: [
      { id: "ece-com-1", name: "Analog Communication (AM, FM, PM)" },
      { id: "ece-com-2", name: "Digital Communication (PCM, ASK, PSK, QAM)" },
      { id: "ece-com-3", name: "Information Theory & Random Signals" },
    ],
  },
  {
    subject: "Electromagnetics & Transmission Lines",
    marks: 11,
    note: "Maxwell's equations, plane waves, transmission line parameters, waveguides, antennas.",
    chapters: [
      { id: "ece-em-1-ch", name: "Maxwell's Equations & Plane Waves" },
      { id: "ece-em-2-ch", name: "Transmission Lines & Impedance Matching" },
      { id: "ece-em-3-ch", name: "Waveguides & Antennas" },
    ],
  },
  {
    subject: "Control Systems",
    marks: 11,
    note: "Transfer functions, block diagrams, time & frequency response analysis, stability (Routh-Hurwitz, Bode, Nyquist).",
    chapters: [
      { id: "ece-cs-1", name: "Time-Domain & Stability Analysis" },
      { id: "ece-cs-2", name: "Frequency Response (Bode & Nyquist Plots)" },
      { id: "ece-cs-3", name: "State Variable Analysis & Controllers" },
    ],
  },
  {
    subject: "Digital Circuits & VLSI",
    marks: 10,
    note: "Combinational & sequential logic, state machines, logic families, CMOS logic, semiconductor memories.",
    chapters: [
      { id: "ece-dc-1", name: "Combinational & Sequential Circuits" },
      { id: "ece-dc-2", name: "Finite State Machines & Logic Families" },
      { id: "ece-dc-3", name: "CMOS Inverters & Memory Technology" },
    ],
  },
]
