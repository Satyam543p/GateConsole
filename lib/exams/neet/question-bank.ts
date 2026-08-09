import type { Question, TestDefinition } from "@/lib/test-types"

export const QUESTIONS: Question[] = [
  // PHYSICS
  {
    id: "neet-phy-q1",
    year: 2023,
    type: "MCQ",
    subject: "Physics",
    topic: "Mechanics",
    text: "A particle starts from rest and moves with constant acceleration $a$. The distance covered by it in the $n$th second is:",
    options: ["$\\frac{a}{2}(2n-1)$", "$\\frac{a}{2}(n-1)$", "$a(2n-1)$", "$\\frac{a}{2}n^2$"],
    answer: 0,
    explanation: "$S_n = u + \\frac{a}{2}(2n-1)$. Since it starts from rest, $u=0$, so $S_n = \\frac{a}{2}(2n-1)$.",
    marks: 4,
  },
  {
    id: "neet-phy-q2",
    year: 2022,
    type: "MCQ",
    subject: "Physics",
    topic: "Optics & Modern Physics",
    text: "In a Young's double slit experiment, if the separation between the slits is halved and the distance to the screen is doubled, the fringe width will:",
    options: ["Remain same", "Be halved", "Be doubled", "Become four times"],
    answer: 3,
    explanation: "Fringe width $\\beta = \\frac{\\lambda D}{d}$. If $D \\to 2D$ and $d \\to d/2$, then $\\beta' = \\frac{\\lambda (2D)}{d/2} = 4 \\frac{\\lambda D}{d} = 4\\beta$.",
    marks: 4,
  },

  // CHEMISTRY
  {
    id: "neet-chem-q1",
    year: 2023,
    type: "MCQ",
    subject: "Chemistry",
    topic: "Physical Chemistry",
    text: "The oxidation state of Cr in $K_2Cr_2O_7$ is:",
    options: ["+4", "+5", "+6", "+7"],
    answer: 2,
    explanation: "Let oxidation state of Cr be $x$. $2(1) + 2(x) + 7(-2) = 0 \\implies 2 + 2x - 14 = 0 \\implies 2x = 12 \\implies x = +6$.",
    marks: 4,
  },
  {
    id: "neet-chem-q2",
    year: 2022,
    type: "MCQ",
    subject: "Chemistry",
    topic: "Organic Chemistry",
    text: "Which of the following is the most stable carbocation?",
    options: ["Methyl carbocation", "Primary carbocation", "Secondary carbocation", "Tertiary carbocation"],
    answer: 3,
    explanation: "Tertiary carbocations are the most stable due to the +I effect of three alkyl groups and hyperconjugation.",
    marks: 4,
  },

  // BOTANY
  {
    id: "neet-bot-q1",
    year: 2023,
    type: "MCQ",
    subject: "Botany",
    topic: "Plant Physiology",
    text: "In C4 plants, the primary CO2 acceptor is:",
    options: ["RuBP", "PEP", "OAA", "PGA"],
    answer: 1,
    explanation: "In C4 plants, the primary CO2 acceptor is Phosphoenolpyruvate (PEP), forming Oxaloacetic acid (OAA).",
    marks: 4,
  },
  {
    id: "neet-bot-q2",
    year: 2022,
    type: "MCQ",
    subject: "Botany",
    topic: "Genetics and Evolution",
    text: "Mendel's law of independent assortment holds true for genes located on:",
    options: ["Same chromosome", "Homologous chromosomes", "Non-homologous chromosomes", "Sex chromosomes"],
    answer: 2,
    explanation: "Genes on non-homologous chromosomes assort independently during meiosis. Linked genes on the same chromosome do not follow this law strictly.",
    marks: 4,
  },

  // ZOOLOGY
  {
    id: "neet-zoo-q1",
    year: 2023,
    type: "MCQ",
    subject: "Zoology",
    topic: "Human Physiology",
    text: "Which of the following is the structural and functional unit of kidney?",
    options: ["Neuron", "Nephron", "Alveolus", "Sarcomere"],
    answer: 1,
    explanation: "The nephron is the microscopic structural and functional unit of the kidney responsible for filtering blood.",
    marks: 4,
  },
  {
    id: "neet-zoo-q2",
    year: 2022,
    type: "MCQ",
    subject: "Zoology",
    topic: "Biotechnology",
    text: "The enzyme used to join DNA fragments is:",
    options: ["DNA polymerase", "Restriction endonuclease", "DNA ligase", "Helicase"],
    answer: 2,
    explanation: "DNA ligase is the enzyme that facilitates the joining of DNA strands together by catalyzing the formation of a phosphodiester bond.",
    marks: 4,
  },
]

function byTopic(topic: string) {
  return QUESTIONS.filter((q) => q.topic === topic).map((q) => q.id)
}

function bySubject(subject: string) {
  return QUESTIONS.filter((q) => q.subject === subject).map((q) => q.id)
}

export const TESTS: TestDefinition[] = [
  // Full Mock
  {
    id: "neet-mock-2023",
    title: "NEET 2023 Mock Test",
    kind: "mock",
    subject: "All",
    durationMinutes: 200,
    description: "A complete mock test covering Physics, Chemistry, Botany, and Zoology.",
    questionIds: QUESTIONS.map(q => q.id),
  },

  // Subject Drills
  {
    id: "neet-subj-physics",
    title: "Physics Subject Drill",
    kind: "subject",
    subject: "Physics",
    durationMinutes: 45,
    description: "Comprehensive drill covering Physics.",
    questionIds: bySubject("Physics"),
  },
  {
    id: "neet-subj-botany",
    title: "Botany Subject Drill",
    kind: "subject",
    subject: "Botany",
    durationMinutes: 45,
    description: "Comprehensive drill covering Botany.",
    questionIds: bySubject("Botany"),
  },

  // Chapter Drills - NOTE: IDs must match the chapter IDs exactly!
  {
    id: "neet-phy-mechanics",
    title: "Mechanics Chapter Drill",
    kind: "drill",
    subject: "Physics",
    durationMinutes: 30,
    description: "Targeted practice on Mechanics.",
    questionIds: byTopic("Mechanics"),
  },
  {
    id: "neet-chem-physical",
    title: "Physical Chemistry Drill",
    kind: "drill",
    subject: "Chemistry",
    durationMinutes: 30,
    description: "Targeted practice on Physical Chemistry.",
    questionIds: byTopic("Physical Chemistry"),
  },
  {
    id: "neet-bot-physio",
    title: "Plant Physiology Drill",
    kind: "drill",
    subject: "Botany",
    durationMinutes: 30,
    description: "Targeted practice on Plant Physiology.",
    questionIds: byTopic("Plant Physiology"),
  },
  {
    id: "neet-zoo-human",
    title: "Human Physiology Drill",
    kind: "drill",
    subject: "Zoology",
    durationMinutes: 30,
    description: "Targeted practice on Human Physiology.",
    questionIds: byTopic("Human Physiology"),
  },
]

export const QUESTION_MAP = new Map(QUESTIONS.map((q) => [q.id, q]))

export function getTest(id: string): TestDefinition | undefined {
  return TESTS.find((t) => t.id === id)
}

export function getQuestions(test: TestDefinition): Question[] {
  return test.questionIds.map((id) => QUESTION_MAP.get(id)).filter((q): q is Question => Boolean(q))
}
