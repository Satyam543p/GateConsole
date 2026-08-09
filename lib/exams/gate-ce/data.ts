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
    chapters: [],
  },
  {
    subject: "Engineering Mathematics",
    marks: 13,
    note: "Linear algebra, calculus, ordinary & partial differential equations, probability, numerical methods.",
    chapters: [],
  },
  {
    subject: "Structural Engineering",
    marks: 21,
    note: "Solid mechanics, structural analysis (trusses, arches, matrix methods), concrete & steel structures.",
    chapters: [],
  },
  {
    subject: "Geotechnical Engineering",
    marks: 14,
    note: "Soil properties, classification, permeability, consolidation, shear strength, foundations.",
    chapters: [],
  },
  {
    subject: "Water Resources Engineering",
    marks: 12,
    note: "Fluid mechanics, open channel flow, precipitation, hydrographs, irrigation, dams.",
    chapters: [],
  },
  {
    subject: "Transportation Engineering",
    marks: 11,
    note: "Highway geometric design, pavement design, traffic engineering, highway materials.",
    chapters: [],
  },
  {
    subject: "Environmental Engineering",
    marks: 10,
    note: "Water quality, water treatment, wastewater treatment, air & noise pollution, solid waste.",
    chapters: [],
  },
  {
    subject: "Geomatics Engineering",
    marks: 4,
    note: "Principles of surveying, leveling, triangulation, photogrammetry, GIS and GPS.",
    chapters: [],
  }
]

