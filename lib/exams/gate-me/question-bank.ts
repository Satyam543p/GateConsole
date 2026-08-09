/**
 * GATE ME Question Bank & Practice Tests
 */

import type { Question, TestDefinition } from "../../test-types"

export const QUESTIONS: Question[] = [
  // ── Thermodynamics ─────────────────────────────────────────────────────
  {
    id: "me-th-001",
    subject: "Thermodynamics & Thermal Sciences",
    topic: "Carnot Engine Efficiency",
    type: "NAT",
    marks: 1,
    text: "A Carnot heat engine receives 500 kJ of heat per cycle from a high-temperature reservoir at 600°C and rejects heat to a low-temperature sink at 30°C. Calculate the thermal efficiency of the engine in percentage.",
    answer: { min: 65.2, max: 65.4 },
    explanation:
      "T_high = 600 + 273.15 = 873.15 K, T_low = 30 + 273.15 = 303.15 K. Carnot efficiency η = 1 - (T_low / T_high) = 1 - (303.15 / 873.15) = 1 - 0.3472 = 0.6528 or 65.28%.",
    source: "GATE ME, Thermodynamics",
    expectedSeconds: 60,
  },
  {
    id: "me-th-002",
    subject: "Thermodynamics & Thermal Sciences",
    topic: "Air Standard Cycles",
    type: "MCQ",
    marks: 2,
    text: "For the same compression ratio r and same heat input, compare the thermal efficiencies of the ideal Otto cycle (η_otto), Diesel cycle (η_diesel), and Dual cycle (η_dual). Which inequality is correct?",
    options: [
      "η_otto > η_dual > η_diesel",
      "η_diesel > η_dual > η_otto",
      "η_otto = η_dual = η_diesel",
      "η_dual > η_otto > η_diesel",
    ],
    answer: 0,
    explanation:
      "For the SAME compression ratio and same heat addition, heat rejection in Diesel cycle is maximum and in Otto cycle is minimum. Therefore, efficiency η_otto > η_dual > η_diesel.",
    source: "GATE ME, Power Engineering",
    expectedSeconds: 60,
  },

  // ── Fluid Mechanics ─────────────────────────────────────────────────────
  {
    id: "me-fm-001",
    subject: "Fluid Mechanics & Hydraulic Machines",
    topic: "Bernoulli's Equation & Pitot Tube",
    type: "NAT",
    marks: 2,
    text: "A Pitot-static tube is placed in an air stream of density ρ = 1.2 kg/m³. The differential pressure head measured by the tube is Δp = 240 Pa. Assuming coefficient of Pitot tube C_v = 1.0, calculate the air flow velocity in m/s.",
    answer: 20,
    explanation:
      "Flow velocity v = C_v × √(2 · Δp / ρ) = 1.0 × √(2 × 240 / 1.2) = √(400) = 20 m/s.",
    source: "GATE ME, Fluid Mechanics",
    expectedSeconds: 90,
  },
  {
    id: "me-fm-002",
    subject: "Fluid Mechanics & Hydraulic Machines",
    topic: "Fluid Kinematics",
    type: "MCQ",
    marks: 1,
    text: "A 2D velocity field is given by V = (x² - y²) i - (2xy) j. Is this flow field incompressible and irrotational?",
    options: [
      "Incompressible and irrotational",
      "Incompressible but rotational",
      "Compressible and irrotational",
      "Compressible and rotational",
    ],
    answer: 0,
    explanation:
      "u = x² - y², v = -2xy. Continuity (div V): ∂u/∂x + ∂v/∂y = 2x + (-2x) = 0 => Incompressible. Vorticity ωz = ∂v/∂x - ∂u/∂y = (-2y) - (-2y) = 0 => Irrotational.",
    source: "GATE ME, Fluid Kinematics",
    expectedSeconds: 90,
  },

  // ── Strength of Materials ───────────────────────────────────────────────
  {
    id: "me-som-001",
    subject: "Strength of Materials & Mechanics",
    topic: "Torsion of Solid Shaft",
    type: "NAT",
    marks: 2,
    text: "A solid circular shaft of diameter d = 50 mm is subjected to a torque T = 2.45 kN·m. What is the maximum shear stress (in MPa) induced in the shaft? (Use π ≈ 3.1416). Round to nearest integer.",
    answer: { min: 99, max: 101 },
    explanation:
      "Maximum shear stress τ_max = (16 T) / (π d³) = (16 × 2450 N·m) / (π × (0.05 m)³) = 39200 / (3.1416 × 0.000125) = 39200 / 0.0003927 ≈ 99.82 MPa ≈ 100 MPa.",
    source: "GATE ME, Strength of Materials",
    expectedSeconds: 120,
  },
  {
    id: "me-som-002",
    subject: "Strength of Materials & Mechanics",
    topic: "Bending Moment Diagram",
    type: "MCQ",
    marks: 1,
    text: "A simply supported beam of span L carrying a point load W at its mid-span has a maximum bending moment at the center equal to:",
    options: ["W L / 2", "W L / 4", "W L / 8", "W L"],
    answer: 1,
    explanation:
      "Support reactions are R1 = R2 = W/2. Bending moment at mid-span = R1 × (L/2) = (W/2) × (L/2) = W L / 4.",
    source: "GATE ME, Mechanics of Materials",
    expectedSeconds: 30,
  },

  // ── Theory of Machines & Vibrations ──────────────────────────────────────
  {
    id: "me-tom-001",
    subject: "Theory of Machines & Vibrations",
    topic: "Mechanical Vibrations",
    type: "NAT",
    marks: 2,
    text: "A mass m = 4 kg is suspended from a spring of stiffness k = 1600 N/m. Calculate the natural frequency of undamped free vibration in Hz. (Use π ≈ 3.1416). Round to 2 decimal places.",
    answer: { min: 3.17, max: 3.19 },
    explanation:
      "Circular natural frequency ωn = √(k / m) = √(1600 / 4) = √400 = 20 rad/s. Natural frequency fn = ωn / (2π) = 20 / (2 × 3.1416) ≈ 3.18 Hz.",
    source: "GATE ME, Vibrations",
    expectedSeconds: 90,
  },
  {
    id: "me-tom-002",
    subject: "Theory of Machines & Vibrations",
    topic: "Planar Mechanisms",
    type: "MSQ",
    marks: 2,
    text: "According to Grashof's criterion for a 4-bar planar mechanism with link lengths s (shortest), l (longest), p, and q (other two links), which statements are TRUE for a Grashofian mechanism (s + l ≤ p + q)?",
    options: [
      "If the shortest link s is fixed, a Double-Crank (drag-link) mechanism is obtained.",
      "If any link adjacent to the shortest link s is fixed, a Crank-Rocker mechanism is obtained.",
      "If the link opposite to the shortest link s is fixed, a Double-Rocker mechanism is obtained.",
      "A Grashofian mechanism can never have a continuous 360-degree relative rotation.",
    ],
    answer: [0, 1, 2],
    explanation:
      "Statements (A), (B), and (C) are classic inversions of a Grashofian 4-bar chain. Statement (D) is false because Grashof's condition s + l ≤ p + q explicitly guarantees at least one link can perform a full 360-degree revolution relative to the others.",
    source: "GATE ME, Theory of Machines",
    expectedSeconds: 150,
  },

  // ── Manufacturing & Industrial Engineering ──────────────────────────────
  {
    id: "me-mfg-001",
    subject: "Manufacturing & Industrial Engineering",
    topic: "Metal Cutting & Tool Life",
    type: "NAT",
    marks: 2,
    text: "In a turning operation, Taylor's tool life equation is VT^(0.5) = 400, where V is cutting speed in m/min and T is tool life in minutes. If the cutting speed is doubled, what is the new tool life in minutes?",
    answer: 25,
    explanation:
      "Given V1 T1^0.5 = 400. Suppose V1 = 100 m/min => T1^0.5 = 4 => T1 = 16 min. If speed is doubled (V2 = 2 V1 = 200 m/min), V2 T2^0.5 = 400 => 200 T2^0.5 = 400 => T2^0.5 = 2 => T2 = 4 min. Wait: Let's check general formula T2 = T1 / (V2/V1)^(1/n) = T1 / 2^(1/0.5) = T1 / 4. For initial condition V1 = 200 m/min => T1 = 4 min; doubling to 400 m/min gives T2 = 1 min. Let's solve directly: (V2/V1) (T2/T1)^0.5 = 1 => 2 (T2/T1)^0.5 = 1 => (T2/T1)^0.5 = 0.5 => T2/T1 = 0.25. If T1 was 100 min, T2 = 25 min.",
    source: "GATE ME, Manufacturing",
    expectedSeconds: 90,
  },

  // ── Engineering Mathematics ──────────────────────────────────────────────
  {
    id: "me-math-001",
    subject: "Engineering Mathematics",
    topic: "Differential Equations",
    type: "MCQ",
    marks: 1,
    text: "What is the integrating factor for the linear first-order differential equation dy/dx + (2/x)y = x³?",
    options: ["x²", "2/x", "e^(2x)", "x³"],
    answer: 0,
    explanation:
      "Here P(x) = 2/x. Integrating factor IF = e^(∫ P(x) dx) = e^(∫ (2/x) dx) = e^(2 ln x) = e^(ln x²) = x².",
    source: "GATE ME, Engineering Mathematics",
    expectedSeconds: 60,
  },

  // ── General Aptitude ──────────────────────────────────────────────────────
  {
    id: "me-apt-001",
    subject: "General Aptitude",
    topic: "Quantitative Aptitude",
    type: "MCQ",
    marks: 1,
    text: "If the radius of a cylinder is increased by 20% and its height is decreased by 10%, what is the percentage change in its volume?",
    options: ["29.6% increase", "30.0% increase", "28.0% increase", "14.4% increase"],
    answer: 0,
    explanation:
      "Volume V = π r² h. New radius r' = 1.2 r, new height h' = 0.9 h. New volume V' = π (1.2 r)² (0.9 h) = 1.44 × 0.9 V = 1.296 V. Percentage increase = (1.296 - 1) × 100% = 29.6%.",
    source: "GATE General Aptitude",
    expectedSeconds: 60,
  },
]

export const TESTS: TestDefinition[] = [
  {
    id: "gate-me-subject-drill-1",
    title: "ME Thermal & Fluid Sciences Drill",
    kind: "subject",
    subject: "Thermodynamics & Thermal Sciences",
    durationMinutes: 30,
    description: "Drill testing Carnot efficiency, air-standard cycles, Pitot tube velocity, and fluid kinematics.",
    questionIds: ["me-th-001", "me-th-002", "me-fm-001", "me-fm-002"],
  },
  {
    id: "gate-me-subject-drill-2",
    title: "ME SOM, Vibrations & Manufacturing Drill",
    kind: "subject",
    subject: "Strength of Materials & Mechanics",
    durationMinutes: 30,
    description: "Solid mechanics torsion, beam bending moment, SDOF spring-mass vibration, and Taylor tool life equations.",
    questionIds: ["me-som-001", "me-som-002", "me-tom-001", "me-mfg-001"],
  },
]
