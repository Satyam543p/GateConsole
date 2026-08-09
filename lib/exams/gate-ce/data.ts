/**
 * GATE CE (Civil Engineering) Subject Weightage & Syllabus Data
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
    chapters: [
      { id: "ce-ga-1", name: "Quantitative Aptitude & Data Interpretation" },
      { id: "ce-ga-2", name: "Verbal & Analytical Ability" },
      { id: "ce-ga-3", name: "Spatial Reasoning" },
    ],
  },
  {
    subject: "Engineering Mathematics",
    marks: 13,
    note: "Linear algebra, calculus, ordinary & partial differential equations, probability, numerical methods.",
    chapters: [
      { id: "ce-em-1", name: "Linear Algebra & Differential Equations" },
      { id: "ce-em-2", name: "Calculus & Partial Differential Equations" },
      { id: "ce-em-3", name: "Probability & Numerical Methods" },
    ],
  },
  {
    subject: "Geotechnical Engineering & Soil Mechanics",
    marks: 15,
    note: "Soil properties, classification, permeability, effective stress, consolidation, shear strength, earth pressure, shallow & deep foundations.",
    chapters: [
      { id: "ce-geo-1", name: "Index Properties, Classification & Permeability" },
      { id: "ce-geo-2", name: "Consolidation, Shear Strength & Earth Pressure" },
      { id: "ce-geo-3", name: "Shallow & Deep Foundation Engineering" },
    ],
  },
  {
    subject: "Structural Engineering & SOM",
    marks: 15,
    note: "Engineering mechanics, strength of materials, structural analysis (trusses, arches, matrix methods), concrete & steel structures (RCC / Limit State).",
    chapters: [
      { id: "ce-se-1", name: "Solid Mechanics (Stress, Strain & Bending)" },
      { id: "ce-se-2", name: "Structural Analysis (Trusses, Beams & Arches)" },
      { id: "ce-se-3", name: "Design of Reinforced Concrete & Steel Structures" },
    ],
  },
  {
    subject: "Environmental Engineering",
    marks: 14,
    note: "Water supply & quality, water treatment, waste water & sewage treatment, air pollution, noise pollution, municipal solid waste management.",
    chapters: [
      { id: "ce-env-1", name: "Water Quality Parameters & Treatment Processes" },
      { id: "ce-env-2", name: "Wastewater Treatment & Sludge Management" },
      { id: "ce-env-3", name: "Air Pollution, Noise & Solid Waste Management" },
    ],
  },
  {
    subject: "Transportation Engineering",
    marks: 14,
    note: "Highway geometric design, pavement design (flexible & rigid), traffic engineering & signal design, highway materials, airport & railway basics.",
    chapters: [
      { id: "ce-te-1", name: "Highway Geometric Design & Sight Distances" },
      { id: "ce-te-2", name: "Pavement Analysis & Design" },
      { id: "ce-te-3", name: "Traffic Engineering & Intersections" },
    ],
  },
  {
    subject: "Water Resources Engineering & Hydrology",
    marks: 14,
    note: "Fluid mechanics & open channel flow (uniform/gradually varied flow), precipitation, hydrographs, irrigation requirements, dams & spillways.",
    chapters: [
      { id: "ce-wre-1", name: "Fluid Mechanics & Open Channel Flow" },
      { id: "ce-wre-2", name: "Engineering Hydrology & Runoff Hydrographs" },
      { id: "ce-wre-3", name: "Irrigation Engineering & Hydraulic Structures" },
    ],
  },
]
