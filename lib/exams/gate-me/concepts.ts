/**
 * GATE ME Key Concepts Mind Map
 */

import type { Concept } from "@/lib/domain/types"

export const CONCEPTS: Concept[] = [
  {
    id: "me-c-carnot-efficiency",
    subjectId: "Thermodynamics & Thermal Sciences",
    chapterId: "me-th-1",
    label: "Carnot Cycle Efficiency",
    kind: "formula",
    summary:
      "Maximum theoretical thermal efficiency of any heat engine operating between two thermal reservoirs at absolute temperatures T_high and T_low. Depends solely on reservoir temperatures in Kelvin.",
    formula: "\\eta_{\\text{Carnot}} = 1 - \\frac{T_{\\text{low}}}{T_{\\text{high}}}",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "Temperatures MUST be converted to Absolute scale (Kelvin: °C + 273.15).",
      "No actual engine can exceed Carnot efficiency operating between the same two temperatures.",
    ],
    pyqIds: ["me-th-001"],
  },
  {
    id: "me-c-bernoulli-equation",
    subjectId: "Fluid Mechanics & Hydraulic Machines",
    chapterId: "me-fm-2",
    label: "Bernoulli's Equation",
    kind: "theorem",
    summary:
      "Along a streamline for steady, incompressible, frictionless (inviscid) fluid flow, total mechanical energy (pressure head + velocity head + elevation head) remains constant.",
    formula: "\\frac{P}{\\rho g} + \\frac{v^2}{2g} + z = \\text{constant}",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "Assumptions: steady, incompressible, inviscid flow along a single streamline.",
      "Cannot be directly applied across a pump, turbine, or shock wave without adding head loss/energy input terms.",
    ],
    pyqIds: ["me-fm-001"],
  },
  {
    id: "me-c-torsion-formula",
    subjectId: "Strength of Materials & Mechanics",
    chapterId: "me-som-3",
    label: "Torsion Formula for Shafts",
    kind: "formula",
    summary:
      "Relates torque T, polar moment of inertia J, shear stress τ at radius r, shear modulus G, angle of twist θ, and length L for circular shafts.",
    formula: "\\frac{T}{J} = \\frac{\\tau}{r} = \\frac{G\\theta}{L}",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "Polar moment of inertia for solid circular shaft J = (π/32) d⁴. For hollow shaft J = (π/32) (D⁴ - d⁴).",
      "Shear stress is zero at the center and maximum at the outer surface (r = d/2).",
    ],
    pyqIds: ["me-som-001"],
  },
  {
    id: "me-c-sdof-vibration",
    subjectId: "Theory of Machines & Vibrations",
    chapterId: "me-tom-3",
    label: "Natural Frequency of SDOF System",
    kind: "formula",
    summary:
      "The undamped natural frequency fn of a single-degree-of-freedom spring-mass system depends on spring stiffness k and mass m.",
    formula: "\\omega_n = \\sqrt{\\frac{k}{m}}, \\quad f_n = \\frac{1}{2\\pi}\\sqrt{\\frac{k}{m}}",
    prerequisites: [],
    examRelevance: 4,
    commonTraps: [
      "Distinguish between circular frequency ωn (rad/s) and cyclic frequency fn (Hz).",
      "For equivalent spring stiffness in series: 1/keq = 1/k1 + 1/k2. In parallel: keq = k1 + k2.",
    ],
    pyqIds: ["me-tom-001"],
  },
]
