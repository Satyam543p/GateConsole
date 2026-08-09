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
    marks: 180,
    note: "45 questions. Emphasizes application of formulas in mechanics, optics, and electrodynamics.",
    chapters: [
      { id: "neet-phy-mechanics", name: "Mechanics" },
      { id: "neet-phy-thermo", name: "Thermodynamics" },
      { id: "neet-phy-electro", name: "Electromagnetism" },
      { id: "neet-phy-optics", name: "Optics & Modern Physics" },
    ],
  },
  {
    subject: "Chemistry",
    marks: 180,
    note: "45 questions. Balanced across Physical, Organic, and Inorganic.",
    chapters: [
      { id: "neet-chem-physical", name: "Physical Chemistry" },
      { id: "neet-chem-inorganic", name: "Inorganic Chemistry" },
      { id: "neet-chem-organic", name: "Organic Chemistry" },
    ],
  },
  {
    subject: "Botany",
    marks: 180,
    note: "45 questions. Focuses on plant physiology, genetics, and ecology.",
    chapters: [
      { id: "neet-bot-cell", name: "Cell Structure and Function" },
      { id: "neet-bot-physio", name: "Plant Physiology" },
      { id: "neet-bot-genetics", name: "Genetics and Evolution" },
    ],
  },
  {
    subject: "Zoology",
    marks: 180,
    note: "45 questions. Focuses on human physiology, reproduction, and animal diversity.",
    chapters: [
      { id: "neet-zoo-human", name: "Human Physiology" },
      { id: "neet-zoo-repro", name: "Reproduction" },
      { id: "neet-zoo-biotech", name: "Biotechnology" },
    ],
  },
]
