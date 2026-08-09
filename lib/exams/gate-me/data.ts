/**
 * GATE ME (Mechanical Engineering) Subject Weightage & Syllabus Data
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
    note: "Fixed 15 marks across 10 questions testing quantitative, verbal, and analytical skills.",
    chapters: [],
  },
  {
    subject: "Engineering Mathematics",
    marks: 13,
    note: "Linear algebra, calculus, differential equations, complex variables, numerical methods, probability.",
    chapters: [],
  },
  {
    subject: "Manufacturing Engineering",
    marks: 16,
    note: "Metal casting, forming, joining, machining, metrology & inspection, CIM.",
    chapters: [],
  },
  {
    subject: "Thermodynamics & Applications",
    marks: 11,
    note: "Laws of thermodynamics, availability, thermodynamic cycles, power plants, IC engines.",
    chapters: [],
  },
  {
    subject: "Theory of Machines",
    marks: 9,
    note: "Mechanisms, velocity/acceleration analysis, cams, gears, gear trains, flywheels, vibrations.",
    chapters: [],
  },
  {
    subject: "Fluid Mechanics",
    marks: 8,
    note: "Fluid statics, kinematics, dynamics, Bernoulli's equation, boundary layer theory, turbomachinery.",
    chapters: [],
  },
  {
    subject: "Strength of Materials",
    marks: 8,
    note: "Stress & strain, Mohr's circle, shear force & bending moment, torsion, deflection, columns.",
    chapters: [],
  },
  {
    subject: "Heat Transfer",
    marks: 7,
    note: "Modes of heat transfer, 1D heat conduction, fins, convection correlations, heat exchangers.",
    chapters: [],
  },
  {
    subject: "Industrial Engineering",
    marks: 5,
    note: "Forecasting, inventory control, operations research (LPP, transportation), CPM/PERT.",
    chapters: [],
  },
  {
    subject: "Machine Design",
    marks: 4,
    note: "Design for static and dynamic loading, failure theories, fatigue, shafts, gears, bearings.",
    chapters: [],
  },
  {
    subject: "Engineering Mechanics",
    marks: 4,
    note: "Free-body diagrams, equilibrium, trusses and frames, kinematics and dynamics of rigid bodies.",
    chapters: [],
  }
]

