import type { Concept } from "@/lib/domain/types"

export const CONCEPTS: Concept[] = [
  // ─── ELECTRIC CIRCUITS ──────────────────────────────────────────────────────
  {
    id: "ee-ec-kvl-kcl",
    subjectId: "Electric Circuits",
    chapterId: "ec-basics",
    label: "Kirchhoff's Laws (KVL/KCL)",
    kind: "definition",
    summary: "KCL states the algebraic sum of currents at a node is zero (conservation of charge). KVL states the algebraic sum of voltages around a closed loop is zero (conservation of energy).",
    formula: "\\sum_{k=1}^n I_k = 0 \\quad \\text{and} \\quad \\sum_{k=1}^m V_k = 0",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "Forgetting to maintain consistent sign conventions when writing loop equations.",
      "Applying KVL across a current source without assigning an unknown voltage variable to it."
    ],
  },
  {
    id: "ee-ec-thevenin",
    subjectId: "Electric Circuits",
    chapterId: "ec-theorems",
    label: "Thevenin's & Norton's Theorems",
    kind: "theorem",
    summary: "Any linear bilateral network can be replaced by a single voltage source (Vth) in series with an impedance (Zth), or a current source (In) in parallel with Zth.",
    formula: "V_{th} = V_{oc}, \\quad I_{n} = I_{sc}, \\quad Z_{th} = \\frac{V_{oc}}{I_{sc}}",
    prerequisites: ["ee-ec-kvl-kcl"],
    examRelevance: 5,
    commonTraps: [
      "Calculating Zth by directly turning off independent sources when dependent sources are present. (Must use V_test/I_test method).",
      "Finding Voc but evaluating the open circuit voltage at the wrong nodes."
    ],
  },
  {
    id: "ee-ec-transients",
    subjectId: "Electric Circuits",
    chapterId: "ec-transients",
    label: "Transient Response (RL, RC, RLC)",
    kind: "technique",
    summary: "Analysis of circuit behavior immediately after a switch change. Inductors act as open circuits at t=0+ (current cannot change instantaneously), capacitors act as short circuits (voltage cannot change instantaneously).",
    formula: "x(t) = x(\\infty) + [x(0^+) - x(\\infty)] e^{-t/\\tau}",
    prerequisites: ["ee-ec-kvl-kcl"],
    examRelevance: 5,
    commonTraps: [
      "Evaluating the time constant τ incorrectly because dependent sources are ignored when finding R_eq.",
      "Assuming v_c(0+) = 0 or i_L(0+) = 0 without checking the steady state at t=0-."
    ],
  },
  {
    id: "ee-ec-ac-resonance",
    subjectId: "Electric Circuits",
    chapterId: "ec-ac",
    label: "AC Analysis & Resonance",
    kind: "formula",
    summary: "At resonance, the imaginary part of impedance/admittance is zero (circuit acts purely resistive). Series resonance gives minimum impedance (current maximum); parallel gives maximum impedance.",
    formula: "\\omega_0 = \\frac{1}{\\sqrt{LC}}, \\quad Q = \\frac{\\omega_0 L}{R}",
    prerequisites: ["ee-ec-kvl-kcl"],
    examRelevance: 4,
    commonTraps: [
      "Confusing the Quality Factor (Q) formulas for series vs. parallel RLC circuits (they are inverses of each other with respect to R).",
      "Forgetting that practical parallel tank circuits have different resonant frequency formulas than ideal ones."
    ],
  },
  {
    id: "ee-ec-two-port",
    subjectId: "Electric Circuits",
    chapterId: "ec-twoport",
    label: "Two-Port Networks",
    kind: "theorem",
    summary: "Characterizing a 4-terminal network using Z, Y, ABCD, and h parameters. Useful for cascading, series, and parallel connections of subnetworks.",
    formula: "\\begin{bmatrix} V_1 \\\\ V_2 \\end{bmatrix} = \\begin{bmatrix} Z_{11} & Z_{12} \\\\ Z_{21} & Z_{22} \\end{bmatrix} \\begin{bmatrix} I_1 \\\\ I_2 \\end{bmatrix}",
    prerequisites: ["ee-ec-kvl-kcl"],
    examRelevance: 4,
    commonTraps: [
      "Mishandling the sign of I2. Standard convention assumes I2 flows INTO the port.",
      "Assuming a network is reciprocal (Z12 = Z21) when it contains dependent sources."
    ],
  },
  // ─── ELECTROMAGNETIC FIELDS ─────────────────────────────────────────────────
  {
    id: "ee-emf-maxwell",
    subjectId: "Electromagnetic Fields",
    chapterId: "emf-maxwell",
    label: "Maxwell's Equations",
    kind: "formula",
    summary: "The set of 4 fundamental equations governing electromagnetism: Gauss's laws for electricity and magnetism, Faraday's law of induction, and Ampere-Maxwell law.",
    formula: "\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}, \\quad \\nabla \\times \\mathbf{H} = \\mathbf{J} + \\frac{\\partial \\mathbf{D}}{\\partial t}",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "Forgetting the displacement current term (∂D/∂t) in Ampere's Law for time-varying fields.",
      "Confusing point (differential) forms with integral forms during application."
    ],
  },
  {
    id: "ee-emf-boundary",
    subjectId: "Electromagnetic Fields",
    chapterId: "emf-boundary",
    label: "Boundary Conditions",
    kind: "theorem",
    summary: "Rules dictating how E, D, B, and H fields behave across interfaces. Tangential E is continuous; Normal D is discontinuous by surface charge density.",
    formula: "E_{1t} = E_{2t}, \\quad D_{1n} - D_{2n} = \\rho_s",
    prerequisites: ["ee-emf-maxwell"],
    examRelevance: 4,
    commonTraps: [
      "Applying dielectric boundary conditions to perfect conductors. (Inside a perfect conductor, E=0 and D=0).",
      "Messing up vector dot/cross products when finding tangential and normal components."
    ],
  },
  {
    id: "ee-emf-biot-savart",
    subjectId: "Electromagnetic Fields",
    chapterId: "emf-magneto",
    label: "Biot-Savart & Ampere's Law",
    kind: "formula",
    summary: "Methods for calculating magnetic field intensity (H) from current distributions. Ampere's law is easier for highly symmetric setups.",
    formula: "\\oint \\mathbf{H} \\cdot d\\mathbf{l} = I_{enc}",
    prerequisites: ["ee-emf-maxwell"],
    examRelevance: 4,
    commonTraps: [
      "Using Ampere's law when there is no sufficient symmetry to pull H out of the integral.",
      "Miscalculating the enclosed current (I_enc) for thick wires or non-uniform current densities."
    ],
  },
  // ─── ELECTRICAL MACHINES ────────────────────────────────────────────────────
  {
    id: "ee-em-transformers",
    subjectId: "Electrical Machines",
    chapterId: "em-transformers",
    label: "Transformers (1-Phase & 3-Phase)",
    kind: "technique",
    summary: "Static devices transferring AC power without changing frequency. Key analyses include Equivalent Circuit, Open/Short Circuit tests for losses (Core vs. Copper), Voltage Regulation, and Efficiency.",
    formula: "\\text{Efficiency } \\eta = \\frac{x S \\cos\\phi}{x S \\cos\\phi + P_i + x^2 P_{cu}}",
    prerequisites: ["ee-ec-ac-resonance", "ee-emf-maxwell"],
    examRelevance: 5,
    commonTraps: [
      "Forgetting to refer parameters (impedances, voltages) to the correct side (primary vs. secondary) using the turns ratio squared.",
      "Confusing Core losses (constant, found via OC test) with Copper losses (load dependent, found via SC test)."
    ],
  },
  {
    id: "ee-em-dc-machines",
    subjectId: "Electrical Machines",
    chapterId: "em-dc",
    label: "DC Machines (Motors & Generators)",
    kind: "formula",
    summary: "Commutator machines where EMF is generated dynamically. In motors, back EMF opposes supply. Key characteristics vary by type: Series (high starting torque), Shunt (constant speed).",
    formula: "E_b = \\frac{P \\Phi Z N}{60 A}, \\quad T = K_a \\Phi I_a",
    prerequisites: ["ee-emf-maxwell"],
    examRelevance: 4,
    commonTraps: [
      "Using the wrong parallel paths 'A'. Remember: Lap winding A=P, Wave winding A=2.",
      "Assuming flux is constant in a Series motor; flux is proportional to armature current before saturation."
    ],
  },
  {
    id: "ee-em-induction",
    subjectId: "Electrical Machines",
    chapterId: "em-induction",
    label: "3-Phase Induction Motors",
    kind: "theorem",
    summary: "Asynchronous motors operating on the principle of a rotating magnetic field. The rotor always runs slightly slower than synchronous speed (slip).",
    formula: "s = \\frac{N_s - N_r}{N_s}, \\quad N_s = \\frac{120 f}{P}",
    prerequisites: ["ee-em-transformers"],
    examRelevance: 5,
    commonTraps: [
      "Rotor frequency is s*f. Forgetting to multiply by slip when finding rotor induced EMF or reactance.",
      "Maximum torque occurs when rotor resistance equals rotor slip reactance ($R_2 = s X_2$); it is independent of rotor resistance magnitude."
    ],
  },
  {
    id: "ee-em-synchronous",
    subjectId: "Electrical Machines",
    chapterId: "em-sync",
    label: "Synchronous Machines",
    kind: "technique",
    summary: "Alternators (generators) and synchronous motors operating at exactly synchronous speed. Analyzed via phasor diagrams, power angle equations, and V-curves.",
    formula: "P = \\frac{E V}{X_s} \\sin \\delta",
    prerequisites: ["ee-em-induction"],
    examRelevance: 5,
    commonTraps: [
      "Misinterpreting the effect of excitation: Over-excitation makes a motor lead (draws leading VARs, acts like a capacitor). Under-excitation makes it lag.",
      "Sign errors in the power angle equation depending on generator vs. motor mode."
    ],
  },
  // ─── POWER SYSTEMS ──────────────────────────────────────────────────────────
  {
    id: "ee-ps-transmission",
    subjectId: "Power Systems",
    chapterId: "ps-transmission",
    label: "Transmission Lines",
    kind: "formula",
    summary: "Modeling of power delivery via Short, Medium (Pi/T), and Long line models. Involves calculating R, L, C parameters and evaluating Surge Impedance Loading (SIL).",
    formula: "Z_c = \\sqrt{\\frac{L}{C}}, \\quad SIL = \\frac{V^2}{Z_c}",
    prerequisites: ["ee-ec-twoport"],
    examRelevance: 4,
    commonTraps: [
      "Using line-to-neutral voltage instead of line-to-line voltage when calculating 3-phase SIL.",
      "Ignoring the Ferranti effect in lightly loaded long lines where receiving end voltage exceeds sending end voltage."
    ],
  },
  {
    id: "ee-ps-loadflow",
    subjectId: "Power Systems",
    chapterId: "ps-loadflow",
    label: "Load Flow Analysis",
    kind: "algorithm",
    summary: "Numerical methods (Gauss-Seidel, Newton-Raphson, Fast Decoupled) to solve the non-linear power flow equations and find bus voltages and angles.",
    formula: "P_i - jQ_i = V_i^* \\sum_{k=1}^n Y_{ik} V_k",
    prerequisites: ["ee-ec-kvl-kcl"],
    examRelevance: 5,
    commonTraps: [
      "Misclassifying buses: PQ (Load), PV (Generator), and Slack (Reference) buses have different knowns and unknowns.",
      "Newton-Raphson Jacobian matrix size calculation errors."
    ],
  },
  {
    id: "ee-ps-faults",
    subjectId: "Power Systems",
    chapterId: "ps-faults",
    label: "Symmetrical & Unsymmetrical Faults",
    kind: "technique",
    summary: "Analyzing power system behavior under short-circuit conditions. Symmetrical components (Positive, Negative, Zero sequence) decouple unbalanced 3-phase systems.",
    formula: "\\begin{bmatrix} V_0 \\\\ V_1 \\\\ V_2 \\end{bmatrix} = \\frac{1}{3} \\begin{bmatrix} 1 & 1 & 1 \\\\ 1 & a & a^2 \\\\ 1 & a^2 & a \\end{bmatrix} \\begin{bmatrix} V_a \\\\ V_b \\\\ V_c \\end{bmatrix}",
    prerequisites: ["ee-ec-ac-resonance"],
    examRelevance: 5,
    commonTraps: [
      "Forgetting that Zero Sequence currents cannot flow in ungrounded star (Y) connections or delta (Δ) lines.",
      "Single Line to Ground (SLG) faults have all three sequence networks connected in series."
    ],
  },
  {
    id: "ee-ps-stability",
    subjectId: "Power Systems",
    chapterId: "ps-stability",
    label: "Power System Stability",
    kind: "theorem",
    summary: "Ensuring synchronous machines remain in step after a disturbance. Analyzed via the Swing Equation and the Equal Area Criterion.",
    formula: "M \\frac{d^2 \\delta}{dt^2} = P_m - P_e",
    prerequisites: ["ee-em-synchronous", "ee-ps-loadflow"],
    examRelevance: 4,
    commonTraps: [
      "Confusing Transient stability (large disturbance, non-linear) with Steady-State stability (small disturbance, linear).",
      "Misapplying the Equal Area Criterion (A1 = A2) to find the critical clearing angle."
    ],
  },
  // ─── CONTROL SYSTEMS ────────────────────────────────────────────────────────
  {
    id: "ee-cs-time-response",
    subjectId: "Control Systems",
    chapterId: "cs-time",
    label: "Time Domain Analysis",
    kind: "formula",
    summary: "Analysis of transient and steady-state responses of standard 1st and 2nd order systems. Key metrics include rise time, peak time, settling time, and steady-state error.",
    formula: "c(t) = 1 - \\frac{e^{-\\zeta \\omega_n t}}{\\sqrt{1-\\zeta^2}} \\sin(\\omega_d t + \\theta), \\quad e_{ss} = \\lim_{s \\to 0} s E(s)",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "Using the wrong static error constant ($K_p, K_v, K_a$) for the given system type (Type 0, 1, 2) and input (step, ramp, parabola).",
      "Confusing undamped natural frequency ($\\omega_n$) with damped natural frequency ($\\omega_d = \\omega_n \\sqrt{1-\\zeta^2}$)."
    ],
  },
  {
    id: "ee-cs-stability",
    subjectId: "Control Systems",
    chapterId: "cs-stability",
    label: "Stability Criteria (Routh-Hurwitz & Nyquist)",
    kind: "theorem",
    summary: "Methods to determine closed-loop stability from the open-loop transfer function without explicitly finding the roots of the characteristic equation.",
    formula: "N = Z - P \\quad \\text{(Nyquist)}",
    prerequisites: ["ee-cs-time-response"],
    examRelevance: 5,
    commonTraps: [
      "In Routh-Hurwitz, misinterpreting a row of zeros. It indicates roots symmetric about the origin (use auxiliary equation).",
      "In Nyquist, confusing open-loop poles in the RHP (P) with closed-loop poles in the RHP (Z)."
    ],
  },
  {
    id: "ee-cs-bode",
    subjectId: "Control Systems",
    chapterId: "cs-freq",
    label: "Frequency Domain Analysis (Bode Plots)",
    kind: "technique",
    summary: "Plotting magnitude and phase vs. frequency on a logarithmic scale. Used to find Gain Margin (GM) and Phase Margin (PM) to assess relative stability.",
    formula: "PM = 180^\\circ + \\angle G(j\\omega_{gc}), \\quad GM = \\frac{1}{|G(j\\omega_{pc})|}",
    prerequisites: ["ee-cs-stability"],
    examRelevance: 4,
    commonTraps: [
      "Calculating Gain Margin in dB incorrectly: $GM_{dB} = -20\\log_{10}|G(j\\omega_{pc})|$.",
      "Confusing gain crossover frequency (where magnitude is 1 or 0 dB) with phase crossover frequency (where phase is -180 degrees)."
    ],
  },
  // ─── SIGNALS AND SYSTEMS ────────────────────────────────────────────────────
  {
    id: "ee-ss-lti",
    subjectId: "Signals and Systems",
    chapterId: "ss-lti",
    label: "LTI Systems & Convolution",
    kind: "definition",
    summary: "Linear Time-Invariant systems are completely characterized by their impulse response $h(t)$. The output is the convolution of the input and the impulse response.",
    formula: "y(t) = x(t) * h(t) = \\int_{-\\infty}^{\\infty} x(\\tau)h(t-\\tau) d\\tau",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "Flipping and shifting the wrong signal during graphical convolution, causing limit errors.",
      "Assuming a system is LTI when checking for linearity or time-invariance fails (e.g., $y(t) = x(t^2)$ is NOT time-invariant)."
    ],
  },
  {
    id: "ee-ss-transforms",
    subjectId: "Signals and Systems",
    chapterId: "ss-transforms",
    label: "Laplace & Z-Transforms",
    kind: "technique",
    summary: "Mapping time-domain signals to the complex frequency domain (s-domain for continuous, z-domain for discrete) to convert differential/difference equations into algebraic ones.",
    formula: "X(s) = \\int_{-\\infty}^{\\infty} x(t) e^{-st} dt, \\quad X(z) = \\sum_{n=-\\infty}^{\\infty} x[n] z^{-n}",
    prerequisites: ["ee-ss-lti"],
    examRelevance: 5,
    commonTraps: [
      "Ignoring the Region of Convergence (ROC). The inverse transform depends entirely on whether the sequence is causal, anti-causal, or two-sided.",
      "Applying the Final Value Theorem when poles of $sX(s)$ lie in the right half-plane or on the $j\\omega$ axis."
    ],
  },
  // ─── POWER ELECTRONICS ──────────────────────────────────────────────────────
  {
    id: "ee-pe-rectifiers",
    subjectId: "Power Electronics",
    chapterId: "pe-rectifiers",
    label: "Phase-Controlled Rectifiers",
    kind: "formula",
    summary: "Converting AC to variable DC using thyristors (SCRs). Analysis involves finding average and RMS output voltages as a function of the firing angle $\\alpha$.",
    formula: "V_{dc} = \\frac{2V_m}{\\pi} \\cos \\alpha \\quad \\text{(Full Converter, Highly Inductive Load)}",
    prerequisites: ["ee-ec-ac-resonance"],
    examRelevance: 5,
    commonTraps: [
      "Forgetting the effect of load type (R, RL, or highly inductive/constant current) on the conduction angle and output voltage waveform.",
      "Not accounting for source inductance which causes overlap/commutation angle ($\\mu$) and reduces $V_{dc}$."
    ],
  },
  {
    id: "ee-pe-choppers",
    subjectId: "Power Electronics",
    chapterId: "pe-choppers",
    label: "DC-DC Converters (Choppers)",
    kind: "technique",
    summary: "Converting fixed DC to variable DC. Step-down (Buck), Step-up (Boost), and Buck-Boost converters are analyzed using volt-second balance on the inductor.",
    formula: "V_o = D V_s \\text{ (Buck)}, \\quad V_o = \\frac{V_s}{1-D} \\text{ (Boost)}",
    prerequisites: ["ee-ec-transients"],
    examRelevance: 4,
    commonTraps: [
      "Assuming continuous conduction mode (CCM) when the load current is small enough to cause discontinuous conduction mode (DCM).",
      "Applying volt-second balance incorrectly by messing up the switch-on vs switch-off time intervals."
    ],
  },
  // ─── ANALOG AND DIGITAL ELECTRONICS ─────────────────────────────────────────
  {
    id: "ee-ade-opamp",
    subjectId: "Analog and Digital Electronics",
    chapterId: "ade-analog",
    label: "Operational Amplifiers (Op-Amps)",
    kind: "formula",
    summary: "Ideal Op-Amps have infinite input impedance, zero output impedance, and infinite open-loop gain (Virtual Ground applies). Used in inverting, non-inverting, integrating, and active filter circuits.",
    formula: "V_o = -\\frac{R_f}{R_{in}} V_{in} \\quad \\text{(Inverting)}, \\quad V_o = \\left(1 + \\frac{R_f}{R_{in}}\\right) V_{in} \\quad \\text{(Non-Inverting)}",
    prerequisites: ["ee-ec-kvl-kcl"],
    examRelevance: 5,
    commonTraps: [
      "Assuming virtual ground applies even when the op-amp is operating in an open-loop or positive feedback configuration (like a Schmitt trigger).",
      "Ignoring saturation limits ($V_{sat}$) when the calculated output exceeds the power supply rails."
    ],
  },
  {
    id: "ee-ade-digital",
    subjectId: "Analog and Digital Electronics",
    chapterId: "ade-digital",
    label: "Combinational & Sequential Circuits",
    kind: "theorem",
    summary: "Combinational circuits (Multiplexers, Decoders, Adders) depend only on present inputs. Sequential circuits (Flip-flops, Counters, Registers) have memory and depend on past states.",
    formula: "Q_{n+1} = J \\overline{Q}_n + \\overline{K} Q_n \\quad \\text{(JK Flip-Flop)}",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "Confusing level-triggered latches with edge-triggered flip-flops when tracing timing diagrams.",
      "In asynchronous (ripple) counters, miscalculating the total propagation delay."
    ],
  },
  // ─── ELECTRICAL AND ELECTRONIC MEASUREMENTS ───────────────────────────────
  {
    id: "ee-meas-bridges",
    subjectId: "Electrical and Electronic Measurements",
    chapterId: "meas-bridges",
    label: "AC and DC Bridges",
    kind: "technique",
    summary: "Bridges are used to measure unknown R, L, C, and frequency. Wheatstone for DC resistance, Maxwell/Anderson for inductance, Schering for capacitance.",
    formula: "Z_1 Z_4 = Z_2 Z_3 \\quad \\text{(AC Bridge Balance)}",
    prerequisites: ["ee-ec-ac-resonance"],
    examRelevance: 4,
    commonTraps: [
      "Forgetting that AC bridge balance requires equating BOTH the real parts (resistance) and imaginary parts (reactance).",
      "Using Maxwell's bridge for high-Q coils (it's suited for medium Q; Hay's bridge is for high Q)."
    ],
  },
  {
    id: "ee-meas-instruments",
    subjectId: "Electrical and Electronic Measurements",
    chapterId: "meas-instruments",
    label: "Measuring Instruments (PMMC, MI)",
    kind: "definition",
    summary: "PMMC instruments measure average DC values and have linear scales. Moving Iron (MI) instruments measure true RMS values and have non-linear (square law) scales.",
    formula: "T_d = N B A I \\quad \\text{(PMMC)}, \\quad T_d = \\frac{1}{2} I^2 \\frac{dL}{d\\theta} \\quad \\text{(Moving Iron)}",
    prerequisites: ["ee-emf-maxwell"],
    examRelevance: 5,
    commonTraps: [
      "Connecting a PMMC meter directly to an AC source (it will read zero due to averaging over a full cycle).",
      "Failing to account for the internal resistance of voltmeters/ammeters which causes loading effects on the circuit."
    ],
  },
  // 📐 ENGINEERING MATHEMATICS 📐
  {
    id: "ee-math-linalg",
    subjectId: "Engineering Mathematics",
    chapterId: "math-linalg",
    label: "Linear Algebra",
    kind: "theorem",
    summary: "Matrix algebra, systems of linear equations, eigenvalues, and eigenvectors.",
    formula: "AX = \\lambda X \\quad \\text{(Eigenvalue Equation)}",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "Assuming a matrix is diagonalizable without checking if it has $n$ linearly independent eigenvectors.",
      "Miscalculating the rank of a matrix by prematurely stopping row reduction."
    ],
  },
  {
    id: "ee-math-calc",
    subjectId: "Engineering Mathematics",
    chapterId: "math-calc",
    label: "Calculus & Differential Equations",
    kind: "formula",
    summary: "Limits, continuity, differentiability, maxima/minima, and solving first/higher order linear ODEs.",
    formula: "\\frac{dy}{dx} + P(x)y = Q(x) \\implies \\text{IF} = e^{\\int P(x) dx}",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "Forgetting to add the Particular Integral (PI) to the Complementary Function (CF) in non-homogeneous ODEs.",
      "Applying L'Hopital's rule when the limit is not in an indeterminate form like $0/0$ or $\\infty/\\infty$."
    ],
  },
  // 🧠 GENERAL APTITUDE 🧠
  {
    id: "ee-apt-quant",
    subjectId: "General Aptitude",
    chapterId: "apt-quant",
    label: "Quantitative Aptitude",
    kind: "technique",
    summary: "Data interpretation, numerical computation, permutations, combinations, and probability.",
    formula: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "Misinterpreting 'at least one' as 'exactly one' in probability and combinatorics.",
      "Calculating percentages relative to the wrong base value in data interpretation."
    ],
  }
]


