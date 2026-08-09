import type { Question, TestDefinition } from "@/lib/test-types"

export const QUESTIONS: Question[] = [
  // PHYSICS - Mechanics
  {
    id: "jee-phy-q1",
    year: 2023,
    type: "MCQ",
    subject: "Physics",
    topic: "Mechanics",
    text: "A block of mass 2 kg is placed on a smooth horizontal surface. A force of 10 N is applied at an angle of 30° to the horizontal. What is the acceleration of the block?",
    options: ["$4.33 \\text{ m/s}^2$", "$5.0 \\text{ m/s}^2$", "$8.66 \\text{ m/s}^2$", "$10.0 \\text{ m/s}^2$"],
    answer: 0,
    explanation: "$a = \\frac{F \\cos\\theta}{m} = \\frac{10 \\times \\frac{\\sqrt{3}}{2}}{2} = 2.5 \\times 1.732 \\approx 4.33 \\text{ m/s}^2$",
    marks: 4,
  },
  {
    id: "jee-phy-q2",
    year: 2022,
    type: "MCQ",
    subject: "Physics",
    topic: "Mechanics",
    text: "A particle of mass m is projected with velocity v at an angle $\\theta$ to the horizontal. What is its kinetic energy at the highest point of its trajectory?",
    options: ["$\\frac{1}{2}mv^2$", "$0$", "$\\frac{1}{2}mv^2\\cos^2\\theta$", "$\\frac{1}{2}mv^2\\sin^2\\theta$"],
    answer: 2,
    explanation: "At the highest point, vertical velocity is zero, and horizontal velocity is $v \\cos\\theta$. So, $K = \\frac{1}{2}m(v\\cos\\theta)^2$.",
    marks: 4,
  },
  // PHYSICS - Electromagnetism
  {
    id: "jee-phy-q3",
    year: 2021,
    type: "NAT",
    subject: "Physics",
    topic: "Electromagnetism",
    text: "Two point charges $2\\mu\\text{C}$ and $8\\mu\\text{C}$ are placed 12 cm apart. Find the distance (in cm) from the $2\\mu\\text{C}$ charge where the electric field is zero.",
    answer: 4,
    explanation: "$\\frac{k(2)}{x^2} = \\frac{k(8)}{(12-x)^2} \\implies \\frac{1}{x} = \\frac{2}{12-x} \\implies 12-x = 2x \\implies x = 4$.",
    marks: 4,
  },

  // CHEMISTRY - Physical
  {
    id: "jee-chem-q1",
    year: 2023,
    type: "MCQ",
    subject: "Chemistry",
    topic: "Physical Chemistry",
    text: "For an ideal gas, which of the following is true in an isothermal reversible expansion?",
    options: ["$\\Delta U = 0, q = -w$", "$\\Delta U \\neq 0, q = w$", "$\\Delta U = 0, q = 0$", "$\\Delta H \\neq 0, q = -w$"],
    answer: 0,
    explanation: "For an ideal gas undergoing isothermal process, temperature is constant so $\\Delta U = 0$. By first law, $\\Delta U = q + w = 0 \\implies q = -w$.",
    marks: 4,
  },
  {
    id: "jee-chem-q2",
    year: 2022,
    type: "NAT",
    subject: "Chemistry",
    topic: "Physical Chemistry",
    text: "Calculate the pH of a 0.01M HCl solution.",
    answer: 2,
    explanation: "HCl is a strong acid, so $[H^+] = 0.01\\text{M}$. pH = $-\\log_{10}(0.01) = 2$.",
    marks: 4,
  },

  // MATHEMATICS - Calculus
  {
    id: "jee-math-q1",
    year: 2023,
    type: "MCQ",
    subject: "Mathematics",
    topic: "Calculus",
    text: "Evaluate: $\\lim_{x \\to 0} \\frac{\\sin 3x}{x}$",
    options: ["0", "1", "3", "$\\infty$"],
    answer: 2,
    explanation: "Using L'Hôpital's rule or standard limits, $\\lim_{x\\to 0} \\frac{\\sin 3x}{3x} \\times 3 = 1 \\times 3 = 3$.",
    marks: 4,
  },
  {
    id: "jee-math-q2",
    year: 2021,
    type: "NAT",
    subject: "Mathematics",
    topic: "Calculus",
    text: "Find the value of $\\int_0^{\\pi/2} \\sin^2 x \\, dx$. (Multiply your answer by $4/\\pi$)",
    answer: 1,
    explanation: "$\\int_0^{\\pi/2} \\sin^2 x \\, dx = \\frac{\\pi}{4}$. Multiplying by $4/\\pi$ gives 1.",
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
    id: "jee-mock-2023",
    title: "JEE Main 2023 Mock Test",
    kind: "mock",
    subject: "All",
    durationMinutes: 180,
    description: "A complete mock test covering Physics, Chemistry, and Mathematics.",
    questionIds: QUESTIONS.map(q => q.id),
  },

  // Subject Drills
  {
    id: "jee-subj-physics",
    title: "Physics Subject Drill",
    kind: "subject",
    subject: "Physics",
    durationMinutes: 60,
    description: "Comprehensive drill covering all chapters of Physics.",
    questionIds: bySubject("Physics"),
  },
  {
    id: "jee-subj-chemistry",
    title: "Chemistry Subject Drill",
    kind: "subject",
    subject: "Chemistry",
    durationMinutes: 60,
    description: "Comprehensive drill covering all chapters of Chemistry.",
    questionIds: bySubject("Chemistry"),
  },
  {
    id: "jee-subj-maths",
    title: "Mathematics Subject Drill",
    kind: "subject",
    subject: "Mathematics",
    durationMinutes: 60,
    description: "Comprehensive drill covering all chapters of Mathematics.",
    questionIds: bySubject("Mathematics"),
  },

  // Chapter Drills - NOTE: IDs must match the chapter IDs exactly so the dashboard buttons work!
  {
    id: "phy-mechanics",
    title: "Mechanics Chapter Drill",
    kind: "drill",
    subject: "Physics",
    durationMinutes: 30,
    description: "Targeted practice on Mechanics.",
    questionIds: byTopic("Mechanics"),
  },
  {
    id: "phy-electro",
    title: "Electromagnetism Chapter Drill",
    kind: "drill",
    subject: "Physics",
    durationMinutes: 30,
    description: "Targeted practice on Electromagnetism.",
    questionIds: byTopic("Electromagnetism"),
  },
  {
    id: "chem-physical",
    title: "Physical Chemistry Drill",
    kind: "drill",
    subject: "Chemistry",
    durationMinutes: 30,
    description: "Targeted practice on Physical Chemistry.",
    questionIds: byTopic("Physical Chemistry"),
  },
  {
    id: "math-calculus",
    title: "Calculus Drill",
    kind: "drill",
    subject: "Mathematics",
    durationMinutes: 30,
    description: "Targeted practice on Calculus.",
    questionIds: byTopic("Calculus"),
  },
]

export const QUESTION_MAP = new Map(QUESTIONS.map((q) => [q.id, q]))

export function getTest(id: string): TestDefinition | undefined {
  return TESTS.find((t) => t.id === id)
}

export function getQuestions(test: TestDefinition): Question[] {
  return test.questionIds.map((id) => QUESTION_MAP.get(id)).filter((q): q is Question => Boolean(q))
}
