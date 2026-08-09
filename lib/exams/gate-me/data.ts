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
    chapters: [
      { id: "me-ga-1", name: "Numerical Ability & Quantitative Aptitude" },
      { id: "me-ga-2", name: "Verbal Ability & Logical Deduction" },
      { id: "me-ga-3", name: "Spatial Reasoning" },
    ],
  },
  {
    subject: "Engineering Mathematics",
    marks: 13,
    note: "Linear algebra, calculus, differential equations, complex variables, numerical methods, probability.",
    chapters: [
      { id: "me-em-1", name: "Linear Algebra & Calculus" },
      { id: "me-em-2", name: "Differential Equations & Numerical Methods" },
      { id: "me-em-3", name: "Probability & Statistics" },
    ],
  },
  {
    subject: "Thermodynamics & Thermal Sciences",
    marks: 15,
    note: "Laws of thermodynamics, availability, thermodynamic cycles (Otto, Diesel, Rankine, Brayton), heat transfer.",
    chapters: [
      { id: "me-th-1", name: "Basic Thermodynamics & Cycles" },
      { id: "me-th-2", name: "Conduction, Convection & Radiation Heat Transfer" },
      { id: "me-th-3", name: "Refrigeration, Air Conditioning & Power Plants" },
    ],
  },
  {
    subject: "Fluid Mechanics & Hydraulic Machines",
    marks: 13,
    note: "Fluid statics, kinematics, Bernoulli's equation, boundary layer theory, pipe flow, turbines & pumps.",
    chapters: [
      { id: "me-fm-1", name: "Fluid Statics & Kinematics" },
      { id: "me-fm-2", name: "Fluid Dynamics & Boundary Layer Theory" },
      { id: "me-fm-3", name: "Hydraulic Turbines & Centrifugal Pumps" },
    ],
  },
  {
    subject: "Strength of Materials & Mechanics",
    marks: 14,
    note: "Stress & strain, Mohr's circle, shear force & bending moment, torsion of shafts, thin cylinders, deflection of beams.",
    chapters: [
      { id: "me-som-1", name: "Stress-Strain Relations & Axial Loading" },
      { id: "me-som-2", name: "Shear Force, Bending Moment & Deflection" },
      { id: "me-som-3", name: "Torsion, Columns & Thin Cylinders" },
    ],
  },
  {
    subject: "Theory of Machines & Vibrations",
    marks: 15,
    note: "Displacement, velocity & acceleration analysis of mechanisms, cams, gears, flywheels, governors, free & forced vibrations.",
    chapters: [
      { id: "me-tom-1", name: "Kinematic Chains & Mechanisms" },
      { id: "me-tom-2", name: "Gears, Gear Trains & Flywheels" },
      { id: "me-tom-3", name: "Mechanical Vibrations (SDOF & Damping)" },
    ],
  },
  {
    subject: "Manufacturing & Industrial Engineering",
    marks: 15,
    note: "Metal casting, forming, joining, machining & machine tools, metrology, forecasting, inventory, PPC, linear programming.",
    chapters: [
      { id: "me-mfg-1", name: "Casting, Forming & Welding Processes" },
      { id: "me-mfg-2", name: "Metal Cutting & Machine Tool Operations" },
      { id: "me-mfg-3", name: "Production Planning, Inventory & Operations Research" },
    ],
  },
]
