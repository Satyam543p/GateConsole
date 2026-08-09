export interface ChapterInfo {
  id: string
  name: string
}

export interface SubjectWeightage {
  subject: string
  marks: number
  note: string
  chapters: ChapterInfo[]
}

export const SUBJECT_WEIGHTAGE: SubjectWeightage[] = [
  {
    subject: "Physics",
    marks: 100,
    note: "30 questions (20 MCQ, 10 Numerical). Key areas: Mechanics, Electrodynamics, Modern Physics.",
    chapters: [
      { id: "phy-mechanics", name: "Mechanics" },
      { id: "phy-thermo", name: "Thermodynamics" },
      { id: "phy-electro", name: "Electromagnetism" },
      { id: "phy-optics", name: "Optics & Modern Physics" },
    ],
  },
  {
    subject: "Chemistry",
    marks: 100,
    note: "30 questions (20 MCQ, 10 Numerical). Balanced across Physical, Organic, Inorganic.",
    chapters: [
      { id: "chem-physical", name: "Physical Chemistry" },
      { id: "chem-inorganic", name: "Inorganic Chemistry" },
      { id: "chem-organic", name: "Organic Chemistry" },
    ],
  },
  {
    subject: "Mathematics",
    marks: 100,
    note: "30 questions (20 MCQ, 10 Numerical). Focus on Calculus, Algebra, Coordinate Geometry.",
    chapters: [
      { id: "math-algebra", name: "Algebra" },
      { id: "math-calculus", name: "Calculus" },
      { id: "math-coordinate", name: "Coordinate Geometry" },
      { id: "math-vectors", name: "Vectors & 3D Geometry" },
    ],
  },
]
