/**
 * GATE CE Key Concepts Mind Map
 */

import type { Concept } from "@/lib/domain/types"

export const CONCEPTS: Concept[] = [
  {
    id: "ce-c-terzaghi-bearing",
    subjectId: "Geotechnical Engineering & Soil Mechanics",
    chapterId: "ce-geo-2",
    label: "Terzaghi Bearing Capacity Equation",
    kind: "formula",
    summary:
      "Evaluates ultimate bearing capacity qu of shallow strip footings based on soil cohesion c, surcharge q = γ Df, unit weight γ, and bearing capacity factors Nc, Nq, Nγ.",
    formula: "q_u = c N_c + q N_q + 0.5 \\gamma B N_\\gamma",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "Shape factors apply for non-strip footings (square: 1.3 c Nc, circular: 1.3 c Nc).",
      "If water table rises to ground level, submerged unit weight γ' must be used for surcharge and soil wedge.",
    ],
    pyqIds: ["ce-geo-002"],
  },
  {
    id: "ce-c-bod-kinetics",
    subjectId: "Environmental Engineering",
    chapterId: "ce-env-1",
    label: "First-Order BOD Kinetics",
    kind: "formula",
    summary:
      "Describes the rate of biochemical oxygen demand exertion over time t. Organic matter decomposition follows a first-order exponential decay model.",
    formula: "\\text{BOD}_t = L_0 \\left(1 - e^{-k t}\\right)",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "Check whether rate constant k is given in base e or base 10 (K_10 = k_e / 2.303).",
      "Decomposition constant varies with temperature: K_T = K_20 · θ^(T - 20) with θ ≈ 1.047.",
    ],
    pyqIds: ["ce-env-001"],
  },
  {
    id: "ce-c-stopping-sight-distance",
    subjectId: "Transportation Engineering",
    chapterId: "ce-te-1",
    label: "Stopping Sight Distance (SSD)",
    kind: "formula",
    summary:
      "Minimum distance visible to a driver to bring a vehicle traveling at design speed to a complete stop before colliding with a stationary obstacle. Sum of lag distance and braking distance.",
    formula: "\\text{SSD} = v t + \\frac{v^2}{2 g f}",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "Speed v must be in m/s (convert km/h by multiplying by 5/18).",
      "On gradients (slope n%): braking distance becomes v² / [2 g (f ± n/100)] (plus for upgrade, minus for downgrade).",
    ],
    pyqIds: ["ce-te-001"],
  },
  {
    id: "ce-c-critical-depth-ocf",
    subjectId: "Water Resources Engineering & Hydrology",
    chapterId: "ce-wre-1",
    label: "Critical Depth in Open Channel Flow",
    kind: "definition",
    summary:
      "Depth of flow in an open channel at which specific energy is minimum for a given discharge, corresponding to Froude Number Fr = 1.",
    formula: "y_c = \\left(\\frac{q^2}{g}\\right)^{1/3}",
    prerequisites: [],
    examRelevance: 4,
    commonTraps: [
      "The simple formula yc = (q²/g)^(1/3) applies strictly to RECTANGULAR channels.",
      "For arbitrary cross-sections, the critical condition is Q² T / (g A³) = 1 where T is top width.",
    ],
    pyqIds: ["ce-wre-001"],
  },
]
