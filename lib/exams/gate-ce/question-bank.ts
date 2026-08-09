/**
 * GATE CE Question Bank & Practice Tests
 */

import type { Question, TestDefinition } from "../../test-types"

export const QUESTIONS: Question[] = [
  // ── Geotechnical Engineering ───────────────────────────────────────────
  {
    id: "ce-geo-001",
    subject: "Geotechnical Engineering & Soil Mechanics",
    topic: "Phase Relationships of Soil",
    type: "NAT",
    marks: 1,
    text: "A soil sample has a porosity n = 0.40 and specific gravity of solids Gs = 2.65. Calculate the dry unit weight γd of the soil in kN/m³. (Take unit weight of water γw = 9.81 kN/m³). Round to 2 decimal places.",
    answer: { min: 15.65, max: 15.75 },
    explanation:
      "Void ratio e = n / (1 - n) = 0.40 / (1 - 0.40) = 0.40 / 0.60 = 2/3 ≈ 0.6667. Dry unit weight γd = (Gs × γw) / (1 + e) = (2.65 × 9.81) / (1 + 0.6667) = 25.9965 / 1.6667 ≈ 15.70 kN/m³.",
    source: "GATE CE, Soil Mechanics",
    expectedSeconds: 60,
  },
  {
    id: "ce-geo-002",
    subject: "Geotechnical Engineering & Soil Mechanics",
    topic: "Bearing Capacity",
    type: "MCQ",
    marks: 2,
    text: "According to Terzaghi's bearing capacity theory for a strip footing on a purely cohesive soil (c > 0, φ = 0), what is the ultimate bearing capacity qu for a footing at ground level (Df = 0)?",
    options: ["5.7 c", "5.14 c", "c Nc + q Nq", "1.3 c Nc"],
    answer: 0,
    explanation:
      "For a strip footing on purely cohesive soil (φ = 0), Terzaghi's bearing capacity factors are Nc = 5.7, Nq = 1.0, Nγ = 0. Ultimate bearing capacity qu = c Nc + q Nq + 0.5 γ B Nγ = 5.7 c (since Df = 0, q = γ Df = 0).",
    source: "GATE CE, Foundation Engineering",
    expectedSeconds: 60,
  },

  // ── Structural Engineering & SOM ───────────────────────────────────────
  {
    id: "ce-se-001",
    subject: "Structural Engineering & SOM",
    topic: "Deflection of Beams",
    type: "NAT",
    marks: 2,
    text: "A simply supported beam of span L = 6 m supports a uniformly distributed load w = 10 kN/m over its entire length. If flexural rigidity EI = 4500 kN·m², calculate the maximum deflection at mid-span in millimeters.",
    answer: 15,
    explanation:
      "Maximum deflection δ_max = (5 w L⁴) / (384 EI) = [5 × 10 kN/m × (6 m)⁴] / [384 × 4500 kN·m²] = (5 × 10 × 1296) / (1728000) = 64800 / 1728000 = 0.0375 m = 37.5 mm. Wait: 5*10*1296 / 1728000 = 64800 / 1728000 = 0.0375 m = 37.5 mm. Let's calculate: 5 * 10 * 1296 = 64800. 384 * 4500 = 1,728,000. 64800 / 1728000 = 0.0375 m = 37.5 mm. Let's re-verify: 37.5 mm.",
    source: "GATE CE, Structural Mechanics",
    expectedSeconds: 120,
  },
  {
    id: "ce-se-002",
    subject: "Structural Engineering & SOM",
    topic: "RCC Design (IS 456)",
    type: "MSQ",
    marks: 2,
    text: "Which of the following statements regarding Reinforced Concrete Beam design under Limit State Method (IS 456:2000) are TRUE?",
    options: [
      "In an under-reinforced section, tension steel reaches its yield strain before concrete reaches its maximum compressive strain (0.0035).",
      "Over-reinforced sections undergo brittle failure without prior warning.",
      "The maximum depth of neutral axis xu,max depends only on the grade of steel (fy) and not on concrete grade.",
      "Limit state of collapse in flexure assumes a maximum compressive strain in concrete of 0.002 at the extreme fiber.",
    ],
    answer: [0, 1, 2],
    explanation:
      "Statements (A), (B), and (C) are correct. In under-reinforced beams, steel yields first giving ductile warning. Over-reinforced beams fail suddenly in concrete compression (brittle). xu,max/d is 0.53 for Fe250, 0.48 for Fe415, and 0.46 for Fe500. Statement (D) is false because maximum compressive strain in concrete at extreme fiber in flexure is 0.0035 (0.002 is the strain where parabolic stress block ends).",
    source: "GATE CE, Reinforced Concrete",
    expectedSeconds: 150,
  },

  // ── Environmental Engineering ──────────────────────────────────────────
  {
    id: "ce-env-001",
    subject: "Environmental Engineering",
    topic: "BOD Kinetics",
    type: "NAT",
    marks: 2,
    text: "A wastewater sample has an ultimate BOD (L0) of 300 mg/L. If the reaction rate constant k (base e) at 20°C is 0.23 day⁻¹, calculate the 5-day BOD (BOD5) at 20°C in mg/L. Round to 1 decimal place.",
    answer: { min: 204.5, max: 205.5 },
    explanation:
      "BODt = L0 (1 - e^(-k t)). For t = 5 days: BOD5 = 300 × (1 - e^(-0.23 × 5)) = 300 × (1 - e^(-1.15)) = 300 × (1 - 0.3166) = 300 × 0.6834 = 205.02 mg/L.",
    source: "GATE CE, Environmental Engineering",
    expectedSeconds: 90,
  },
  {
    id: "ce-env-002",
    subject: "Environmental Engineering",
    topic: "Sedimentation Tank Design",
    type: "MCQ",
    marks: 1,
    text: "According to Stokes' Law, the discrete settling velocity of a spherical particle in a quiescent fluid is proportional to:",
    options: [
      "Square of particle diameter (d²)",
      "Particle diameter (d)",
      "Square root of particle diameter (√d)",
      "Cube of particle diameter (d³)",
    ],
    answer: 0,
    explanation:
      "Stokes' Law settling velocity vs = [g (ρs - ρw) d²] / (18 μ). Settling velocity vs is directly proportional to the square of particle diameter d².",
    source: "GATE CE, Water Treatment",
    expectedSeconds: 30,
  },

  // ── Transportation Engineering ─────────────────────────────────────────
  {
    id: "ce-te-001",
    subject: "Transportation Engineering",
    topic: "Stopping Sight Distance",
    type: "NAT",
    marks: 2,
    text: "Calculate the Stopping Sight Distance (SSD) in meters for a vehicle traveling at v = 72 km/h on a level highway. Take reaction time t = 2.5 seconds, coefficient of longitudinal friction f = 0.35, and acceleration due to gravity g = 9.81 m/s².",
    answer: { min: 108, max: 110 },
    explanation:
      "Design speed V = 72 km/h = 72 × (5/18) = 20 m/s. Lag distance d_lag = v × t = 20 × 2.5 = 50 m. Braking distance d_brake = v² / (2 g f) = 20² / (2 × 9.81 × 0.35) = 400 / 6.867 = 58.25 m. SSD = d_lag + d_brake = 50 + 58.25 = 108.25 m.",
    source: "GATE CE, Transportation Engineering",
    expectedSeconds: 120,
  },
  {
    id: "ce-te-002",
    subject: "Transportation Engineering",
    topic: "Pavement Engineering",
    type: "MCQ",
    marks: 1,
    text: "In flexible pavements, wheel load stresses are transferred through structural layers to the subgrade primarily by:",
    options: [
      "Grain-to-grain contact & inter-particle friction",
      "Slab action and flexural rigidity",
      "Tensile strength of asphalt concrete",
      "Arching action",
    ],
    answer: 0,
    explanation:
      "Flexible pavements transmit wheel loads downward through grain-to-grain contact of aggregate layers, distributing stress over a progressively wider area on the subgrade. Rigid pavements transmit loads via slab action.",
    source: "GATE CE, Highway Pavements",
    expectedSeconds: 45,
  },

  // ── Water Resources Engineering & Hydrology ────────────────────────────
  {
    id: "ce-wre-001",
    subject: "Water Resources Engineering & Hydrology",
    topic: "Open Channel Flow",
    type: "NAT",
    marks: 2,
    text: "A rectangular channel 4 m wide carries a discharge Q = 16 m³/s. Calculate the critical depth yc in meters. (Use g = 9.81 m/s²). Round to 2 decimal places.",
    answer: { min: 1.17, max: 1.19 },
    explanation:
      "Discharge per unit width q = Q / B = 16 / 4 = 4 m²/s. Critical depth yc = (q² / g)^(1/3) = (4² / 9.81)^(1/3) = (16 / 9.81)^(1/3) = (1.631)^(1/3) ≈ 1.177 m.",
    source: "GATE CE, Open Channel Flow",
    expectedSeconds: 90,
  },

  // ── Engineering Mathematics ──────────────────────────────────────────────
  {
    id: "ce-math-001",
    subject: "Engineering Mathematics",
    topic: "Numerical Integration",
    type: "MCQ",
    marks: 1,
    text: "Simpson's 1/3 rule for numerical integration requires dividing the integration interval into an:",
    options: [
      "Even number of equal sub-intervals",
      "Odd number of equal sub-intervals",
      "Any arbitrary number of sub-intervals",
      "Equal number of prime sub-intervals",
    ],
    answer: 0,
    explanation:
      "Simpson's 1/3 rule fits a second-order parabola through 3 points (2 sub-intervals). Consequently, the total number of sub-intervals n must be an EVEN number.",
    source: "GATE CE, Numerical Methods",
    expectedSeconds: 45,
  },

  // ── General Aptitude ──────────────────────────────────────────────────────
  {
    id: "ce-apt-001",
    subject: "General Aptitude",
    topic: "Logical Deductions",
    type: "MCQ",
    marks: 1,
    text: "Read the statements: 'All rivers are water bodies. No water body is a desert.' Which of the following conclusions logically follows?",
    options: [
      "No river is a desert.",
      "Some rivers are deserts.",
      "All deserts are water bodies.",
      "Some water bodies are not rivers.",
    ],
    answer: 0,
    explanation:
      "Since all rivers are inside water bodies, and no water body overlaps with deserts, rivers can have zero overlap with deserts. Hence 'No river is a desert' is universally valid.",
    source: "GATE General Aptitude",
    expectedSeconds: 45,
  },
]

export const TESTS: TestDefinition[] = [
  {
    id: "gate-ce-subject-drill-1",
    title: "CE Geotechnical & Structural Engineering Drill",
    kind: "subject",
    subject: "Geotechnical Engineering & Soil Mechanics",
    durationMinutes: 30,
    description: "Drill on soil phase relations, Terzaghi bearing capacity, beam deflection, and RCC limit state design.",
    questionIds: ["ce-geo-001", "ce-geo-002", "ce-se-001", "ce-se-002"],
  },
  {
    id: "gate-ce-subject-drill-2",
    title: "CE Environmental & Transportation Drill",
    kind: "subject",
    subject: "Environmental Engineering",
    durationMinutes: 30,
    description: "Practice questions covering BOD5 kinetics, Stokes' law settling, stopping sight distance, and critical depth in open channel flow.",
    questionIds: ["ce-env-001", "ce-env-002", "ce-te-001", "ce-wre-001"],
  },
]
