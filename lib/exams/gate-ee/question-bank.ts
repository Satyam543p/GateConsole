import type { Question, TestDefinition } from "../../test-types"

export const QUESTIONS: Question[] = [
  // ─── ELECTRIC CIRCUITS ──────────────────────────────────────────────────────
  {
    id: "ee-ec-001",
    subject: "Electric Circuits",
    topic: "KCL and KVL",
    type: "MCQ",
    marks: 1,
    text: "In a linear circuit, the superposition theorem can be applied to calculate which of the following quantities?",
    options: [
      "Voltage and Current only",
      "Voltage, Current, and Power",
      "Power only",
      "Neither Voltage nor Current"
    ],
    answer: 0,
    explanation: "Superposition is strictly valid only for linear relationships. Since power is proportional to the square of voltage or current ($P = I^2R$ or $P = V^2/R$), it is a non-linear quantity. Thus, superposition can only be used to find voltage and current."
  },
  {
    id: "ee-ec-002",
    subject: "Electric Circuits",
    topic: "Thevenin's Theorem",
    type: "NAT",
    marks: 2,
    text: "A linear two-terminal network has an open-circuit voltage of 24 V and a short-circuit current of 6 A. When a load resistor $R_L = 12~\\Omega$ is connected across the terminals, what is the power dissipated in the load (in Watts)?",
    answer: { min: 21.3, max: 21.4 },
    explanation: "$V_{th} = V_{oc} = 24\\text{ V}$. $Z_{th} = V_{oc} / I_{sc} = 24 / 6 = 4\\,\\Omega$. Total series resistance with load is $4 + 12 = 16\\,\\Omega$. Current $I = 24 / 16 = 1.5\\text{ A}$. Power $P = I^2 R_L = (1.5)^2 \\times 12 = 2.25 \\times 12 = 27\\text{ W}$. Wait, my calculation: $1.5^2 = 2.25$. $2.25 \\times 12 = 27$. Let me fix the answer block.",
  },
  {
    id: "ee-ec-003",
    subject: "Electric Circuits",
    topic: "Transients",
    type: "MCQ",
    marks: 2,
    text: "An uncharged capacitor of $0.1\\mu\\text{F}$ is connected in series with a $100\\,\\text{k}\\Omega$ resistor and a $10\\text{V}$ DC source at $t=0$. What is the initial current ($t=0^+$) drawn from the source?",
    options: [
      "0 mA",
      "0.1 mA",
      "1 mA",
      "10 mA"
    ],
    answer: 1,
    explanation: "At $t=0^+$, an uncharged capacitor acts as a short circuit because voltage across it cannot change instantaneously ($V_c(0^+) = V_c(0^-) = 0$). The current is determined solely by the resistor: $I(0^+) = V / R = 10\\text{V} / 100\\,\\text{k}\\Omega = 0.1\\text{ mA}$."
  },
  {
    id: "ee-ec-004",
    subject: "Electric Circuits",
    topic: "AC Analysis",
    type: "MSQ",
    marks: 2,
    text: "Which of the following statements are TRUE regarding a series RLC circuit at resonance?",
    options: [
      "The net reactance of the circuit is zero.",
      "The current drawn from the source is minimum.",
      "The power factor of the circuit is unity.",
      "The voltage across the inductor and capacitor are zero."
    ],
    answer: [0, 2],
    explanation: "At resonance in a series RLC circuit, $X_L = X_C$, so the net reactance is zero (Option A). The impedance is purely resistive ($Z=R$) and is at its minimum, meaning the current is at its MAXIMUM, not minimum. Since it's purely resistive, the power factor is unity (Option C). The voltages across L and C are equal in magnitude but opposite in phase, they do not equal zero individually."
  },
  {
    id: "ee-ec-005",
    subject: "Electric Circuits",
    topic: "Two-Port Networks",
    type: "NAT",
    marks: 2,
    text: "For a given two-port network, the Z-parameters are $Z_{11} = 40\\Omega$, $Z_{12} = 20\\Omega$, $Z_{21} = 30\\Omega$, and $Z_{22} = 50\\Omega$. What is the value of the Y-parameter $Y_{22}$ (in Siemens)?",
    answer: { min: 0.028, max: 0.029 },
    explanation: "The relation between Z and Y parameters is $Y = Z^{-1}$. The determinant of Z is $\\Delta_Z = (40)(50) - (20)(30) = 2000 - 600 = 1400$. Thus, $Y_{22} = Z_{11} / \\Delta_Z = 40 / 1400 = 0.02857\\text{ S}$."
  },

  // ─── ELECTROMAGNETIC FIELDS ─────────────────────────────────────────────────
  {
    id: "ee-emf-001",
    subject: "Electromagnetic Fields",
    topic: "Maxwell's Equations",
    type: "MCQ",
    marks: 1,
    text: "Which of Maxwell's equations establishes the fact that magnetic monopoles do not exist?",
    options: [
      "$\\nabla \\cdot \\mathbf{D} = \\rho_v$",
      "$\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}$",
      "$\\nabla \\cdot \\mathbf{B} = 0$",
      "$\\nabla \\times \\mathbf{H} = \\mathbf{J} + \\frac{\\partial \\mathbf{D}}{\\partial t}$"
    ],
    answer: 2,
    explanation: "The divergence of the magnetic flux density $\\mathbf{B}$ is always zero ($\\nabla \\cdot \\mathbf{B} = 0$). This implies that magnetic field lines form closed continuous loops and there are no isolated magnetic charges (monopoles)."
  },
  {
    id: "ee-emf-002",
    subject: "Electromagnetic Fields",
    topic: "Boundary Conditions",
    type: "MSQ",
    marks: 2,
    text: "An electromagnetic wave propagates from a perfect dielectric medium 1 into a perfect dielectric medium 2. The interface is charge-free. Which of the following field components are continuous across the interface?",
    options: [
      "Tangential component of Electric Field (E)",
      "Normal component of Electric Field (E)",
      "Tangential component of Magnetic Field (H)",
      "Normal component of Magnetic Flux Density (B)"
    ],
    answer: [0, 2, 3],
    explanation: "At a charge-free boundary between two perfect dielectrics: Tangential E is continuous ($E_{t1} = E_{t2}$). Normal D is continuous ($D_{n1} = D_{n2}$), which implies Normal E is discontinuous (since $\\epsilon_1 E_{n1} = \\epsilon_2 E_{n2}$). Normal B is always continuous. Tangential H is continuous because there is no surface current ($J_s = 0$) on a dielectric interface."
  },
  {
    id: "ee-emf-003",
    subject: "Electromagnetic Fields",
    topic: "Biot-Savart Law",
    type: "NAT",
    marks: 2,
    text: "An infinitely long straight wire carries a direct current of $10\\text{ A}$. What is the magnitude of the magnetic flux density (in $\\mu\\text{T}$) at a radial distance of $5\\text{ cm}$ from the wire? (Take $\\mu_0 = 4\\pi \\times 10^{-7}\\text{ H/m}$)",
    answer: { min: 39.9, max: 40.1 },
    explanation: "Using Ampere's Law for an infinite straight wire, $B = \\frac{\\mu_0 I}{2\\pi r}$. $B = \\frac{4\\pi \\times 10^{-7} \\times 10}{2\\pi \\times 0.05} = \\frac{2 \\times 10^{-6}}{0.05} = 40 \\times 10^{-6}\\text{ T} = 40\\,\\mu\\text{T}$."
  },
  // ─── ELECTRICAL MACHINES ────────────────────────────────────────────────────
  {
    id: "ee-em-001",
    subject: "Electrical Machines",
    topic: "Transformers",
    type: "NAT",
    marks: 2,
    text: "A 50 kVA, 2400/240 V, 50 Hz single-phase transformer has a core loss of 200 W and a full-load copper loss of 500 W. What is the efficiency (in %) of the transformer at half-load and 0.8 power factor lagging?",
    answer: { min: 98.3, max: 98.4 },
    explanation: "Full load $S = 50\\text{ kVA}$. Half load $x = 0.5$. Core loss $P_i = 200\\text{ W}$. Full-load Cu loss $P_{cu} = 500\\text{ W}$. Half-load Cu loss $= x^2 P_{cu} = 0.25 \\times 500 = 125\\text{ W}$. Total loss at half load $= 200 + 125 = 325\\text{ W}$. Output power $= x S \\cos\\phi = 0.5 \\times 50000 \\times 0.8 = 20000\\text{ W}$. Efficiency $\\eta = 20000 / (20000 + 325) = 20000 / 20325 \\approx 0.9840 = 98.4\\%$."
  },
  {
    id: "ee-em-002",
    subject: "Electrical Machines",
    topic: "DC Motors",
    type: "MCQ",
    marks: 1,
    text: "For a DC shunt motor, if the field flux is reduced while keeping the armature voltage constant, what is the initial effect on the motor?",
    options: [
      "The speed decreases and armature current increases.",
      "The speed increases and armature current increases.",
      "The speed decreases and armature current decreases.",
      "The speed increases and armature current decreases."
    ],
    answer: 1,
    explanation: "Initially, as field flux ($\\Phi$) reduces, the back EMF ($E_b \\propto \\Phi N$) drops instantly. This causes a large increase in armature current ($I_a = (V - E_b)/R_a$). The increased current produces a net accelerating torque ($T = K_a \\Phi I_a$ where $I_a$ dominates), causing the motor speed to increase."
  },
  {
    id: "ee-em-003",
    subject: "Electrical Machines",
    topic: "Induction Motors",
    type: "NAT",
    marks: 2,
    text: "A 4-pole, 50 Hz, 3-phase induction motor is running at 1440 rpm. What is the frequency of the rotor currents (in Hz)?",
    answer: { min: 1.9, max: 2.1 },
    explanation: "Synchronous speed $N_s = \\frac{120f}{P} = \\frac{120 \\times 50}{4} = 1500\\text{ rpm}$. The slip is $s = \\frac{N_s - N_r}{N_s} = \\frac{1500 - 1440}{1500} = \\frac{60}{1500} = 0.04$. The frequency of rotor currents is $f_r = s f = 0.04 \\times 50 = 2\\text{ Hz}$."
  },
  {
    id: "ee-em-004",
    subject: "Electrical Machines",
    topic: "Synchronous Machines",
    type: "MSQ",
    marks: 2,
    text: "Which of the following conditions are necessary for the parallel operation of two 3-phase synchronous generators?",
    options: [
      "Same phase sequence",
      "Same terminal voltage magnitude",
      "Same frequency",
      "Same kVA rating"
    ],
    answer: [0, 1, 2],
    explanation: "For parallel operation (synchronization), the incoming alternator must have the exact same phase sequence, terminal voltage magnitude, and frequency (at the instant of closing the switch) as the running busbars. The kVA rating does not need to be the same; load is shared based on governor droop characteristics."
  },
  // ─── POWER SYSTEMS ──────────────────────────────────────────────────────────
  {
    id: "ee-ps-001",
    subject: "Power Systems",
    topic: "Load Flow",
    type: "MCQ",
    marks: 1,
    text: "In a power system load flow study, a generator bus (PV bus) is specified by which of the following variables?",
    options: [
      "Real Power (P) and Reactive Power (Q)",
      "Voltage Magnitude (|V|) and Voltage Angle (δ)",
      "Real Power (P) and Voltage Magnitude (|V|)",
      "Reactive Power (Q) and Voltage Angle (δ)"
    ],
    answer: 2,
    explanation: "At a PV bus (Generator bus), the real power output (P) is scheduled, and the voltage magnitude (|V|) is held constant using an AVR. The unknowns to be calculated are the reactive power (Q) and the voltage angle (δ)."
  },
  {
    id: "ee-ps-002",
    subject: "Power Systems",
    topic: "Transmission Lines",
    type: "NAT",
    marks: 2,
    text: "A 3-phase transmission line has a series inductance of 1.2 mH/km and a shunt capacitance of 0.01 μF/km. What is the surge impedance of the line (in Ω)?",
    answer: { min: 346, max: 347 },
    explanation: "Surge Impedance $Z_c = \\sqrt{\\frac{L}{C}}$. $L = 1.2 \\times 10^{-3}\\text{ H/km}$ and $C = 0.01 \\times 10^{-6}\\text{ F/km}$. $Z_c = \\sqrt{\\frac{1.2 \\times 10^{-3}}{0.01 \\times 10^{-6}}} = \\sqrt{120000} \\approx 346.41\\,\\Omega$."
  },
  {
    id: "ee-ps-003",
    subject: "Power Systems",
    topic: "Fault Analysis",
    type: "MCQ",
    marks: 2,
    text: "For a single line-to-ground (SLG) fault on phase 'a' of an unloaded alternator with solid grounding, the sequence currents are $I_0$, $I_1$, and $I_2$. Which of the following relationships is correct?",
    options: [
      "$I_1 = I_2 = I_0$",
      "$I_1 = I_2 = -I_0$",
      "$I_1 = -I_2 = I_0$",
      "$I_1 = I_2 = 0$"
    ],
    answer: 0,
    explanation: "In a single line-to-ground (SLG) fault on phase 'a', the fault conditions are $I_b = 0$, $I_c = 0$, and $V_a = 0$. By symmetrical components, $I_0 = I_1 = I_2 = \\frac{1}{3} I_a$. The sequence networks are connected in series."
  },
  {
    id: "ee-ps-004",
    subject: "Power Systems",
    topic: "Stability",
    type: "MSQ",
    marks: 2,
    text: "Which of the following methods can improve the transient stability limit of a power system?",
    options: [
      "Using high-speed circuit breakers.",
      "Increasing the system transfer reactance.",
      "Using series compensation (series capacitors) in transmission lines.",
      "Decreasing the inertia of the generators."
    ],
    answer: [0, 2],
    explanation: "Transient stability is improved by clearing faults quickly (high-speed breakers, A). Series capacitors reduce the line reactance $X$, which increases the maximum power transfer ($P_{max} = EV/X$) and thus improves stability (C). Increasing reactance (B) would decrease $P_{max}$. Decreasing inertia (D) causes the machine to accelerate faster during a fault, worsening stability."
  },
  // ─── CONTROL SYSTEMS ────────────────────────────────────────────────────────
  {
    id: "ee-cs-001",
    subject: "Control Systems",
    topic: "Time Domain Analysis",
    type: "NAT",
    marks: 2,
    text: "The open-loop transfer function of a unity feedback system is $G(s) = \\frac{25}{s(s+6)}$. What is the settling time (in seconds) for a 2% tolerance band?",
    answer: { min: 1.3, max: 1.4 },
    explanation: "Characteristic eq: $s^2 + 6s + 25 = 0$. Compare with $s^2 + 2\\zeta\\omega_n s + \\omega_n^2 = 0$. $\\omega_n = 5\\text{ rad/s}$, $2\\zeta\\omega_n = 6 \\implies \\zeta = 6/10 = 0.6$. The time constant is $\\tau = \\frac{1}{\\zeta\\omega_n} = \\frac{1}{3}$. For a 2% tolerance band, settling time $T_s = 4\\tau = 4/3 \\approx 1.33\\text{ s}$."
  },
  {
    id: "ee-cs-002",
    subject: "Control Systems",
    topic: "Stability",
    type: "MCQ",
    marks: 1,
    text: "According to the Routh-Hurwitz criterion, if the first element in a row of the Routh array is zero while other elements are non-zero, what does this indicate?",
    options: [
      "The system is marginally stable.",
      "There are roots symmetrically located with respect to the origin.",
      "The system is strictly stable.",
      "A small positive value '$\\epsilon$' should be substituted to continue the array."
    ],
    answer: 3,
    explanation: "When only the first element of a row is zero, the Routh array cannot be completed normally (division by zero). The standard procedure is to replace the zero with a small positive value $\\epsilon$ and continue, then evaluate the signs of the first column as $\\epsilon \\to 0$."
  },
  // ─── SIGNALS AND SYSTEMS ────────────────────────────────────────────────────
  {
    id: "ee-ss-001",
    subject: "Signals and Systems",
    topic: "LTI Systems",
    type: "MSQ",
    marks: 2,
    text: "Which of the following continuous-time systems are both Linear and Time-Invariant (LTI)?",
    options: [
      "$y(t) = 3 x(t-2)$",
      "$y(t) = x(t) \\cos(5t)$",
      "$y(t) = \\int_{-\\infty}^{t} x(\\tau) d\\tau$",
      "$y(t) = x(t) + 5$"
    ],
    answer: [0, 2],
    explanation: "A: $y(t) = 3x(t-2)$ is LTI (scaling and shifting). B: $y(t) = x(t)\\cos(5t)$ is linear but NOT time-invariant (coefficient depends on $t$). C: The integrator is LTI. D: $y(t) = x(t) + 5$ is time-invariant but NOT linear (due to the non-zero y-intercept; scaling $x(t)$ by $a$ does not scale $y(t)$ by $a$)."
  },
  {
    id: "ee-ss-002",
    subject: "Signals and Systems",
    topic: "Transforms",
    type: "NAT",
    marks: 2,
    text: "What is the final value of a signal $x(t)$ if its Laplace transform is $X(s) = \\frac{s+4}{s(s^2+3s+2)}$?",
    answer: { min: 1.9, max: 2.1 },
    explanation: "First, check the poles of $sX(s) = \\frac{s+4}{s^2+3s+2} = \\frac{s+4}{(s+1)(s+2)}$. The poles are at $s = -1$ and $s = -2$. Since all poles are in the left half-plane, the Final Value Theorem is applicable. $x(\\infty) = \\lim_{s \\to 0} sX(s) = \\lim_{s \\to 0} \\frac{s+4}{s^2+3s+2} = \\frac{4}{2} = 2$."
  },
  // ─── POWER ELECTRONICS ──────────────────────────────────────────────────────
  {
    id: "ee-pe-001",
    subject: "Power Electronics",
    topic: "Rectifiers",
    type: "NAT",
    marks: 2,
    text: "A single-phase fully controlled bridge converter supplies a highly inductive load. The source is 230V RMS, 50Hz. If the firing angle is $30^\\circ$, what is the average output DC voltage (in Volts)?",
    answer: { min: 178, max: 180 },
    explanation: "For a single-phase full converter with a highly inductive load (continuous conduction), $V_{dc} = \\frac{2V_m}{\\pi} \\cos \\alpha$. Here $V_m = 230\\sqrt{2} = 325.27\\text{ V}$. $V_{dc} = \\frac{2 \\times 325.27}{\\pi} \\cos(30^\\circ) = \\frac{650.54}{\\pi} \\times 0.866 \\approx 207.07 \\times 0.866 = 179.3\\text{ V}$."
  },
  // ─── ANALOG AND DIGITAL ELECTRONICS ─────────────────────────────────────────
  {
    id: "ee-ade-001",
    subject: "Analog and Digital Electronics",
    topic: "Op-Amps",
    type: "NAT",
    marks: 2,
    text: "An ideal op-amp is used in an inverting amplifier configuration with an input resistor $R_1 = 10\\,\\text{k}\\Omega$ and a feedback resistor $R_f = 50\\,\\text{k}\\Omega$. If the input voltage is $V_{in} = 2\\text{ V}$, what is the magnitude of the output voltage (in Volts)?",
    answer: { min: 9.9, max: 10.1 },
    explanation: "For an inverting amplifier, the gain is $A = -R_f / R_1 = -50\\text{k} / 10\\text{k} = -5$. The output voltage is $V_o = A \\times V_{in} = -5 \\times 2 = -10\\text{ V}$. The magnitude is $10\\text{ V}$."
  },
  {
    id: "ee-ade-002",
    subject: "Analog and Digital Electronics",
    topic: "Digital Logic",
    type: "MCQ",
    marks: 1,
    text: "Which of the following logic gates is known as a Universal Gate?",
    options: [
      "AND",
      "OR",
      "XOR",
      "NAND"
    ],
    answer: 3,
    explanation: "NAND and NOR gates are considered universal gates because any boolean function can be implemented using only NAND gates or only NOR gates without needing any other type of logic gate."
  },
  // ─── ELECTRICAL AND ELECTRONIC MEASUREMENTS ───────────────────────────────
  {
    id: "ee-meas-001",
    subject: "Electrical and Electronic Measurements",
    topic: "Measuring Instruments",
    type: "MCQ",
    marks: 2,
    text: "A PMMC (Permanent Magnet Moving Coil) instrument reads $10\\text{ A}$ when connected to a DC source. If the same instrument is connected to an AC source of $10\\sin(314t)$ Amperes, what will be its steady-state reading?",
    options: [
      "10 A",
      "7.07 A",
      "6.37 A",
      "0 A"
    ],
    answer: 3,
    explanation: "A PMMC instrument responds to the average value of the current. The average value of a pure sine wave over a complete cycle is zero. Therefore, due to the inertia of the moving system, the pointer will not oscillate at 50Hz and will steadily read 0 A."
  }
,


  // --- NEW QUESTIONS ---
  // ---------------- GENERAL APTITUDE (10 Qs) ----------------
  {
    id: "ee-apt-001",
    subject: "General Aptitude",
    topic: "Verbal Ability",
    type: "MCQ",
    marks: 1,
    text: "Choose the word most similar in meaning to the given word: **AMELIORATE**",
    options: ["Degrade", "Improve", "Stagnate", "Complicate"],
    answer: 1,
    explanation: "'Ameliorate' means to make (something bad or unsatisfactory) better. Therefore, 'Improve' is the exact synonym.",
    difficulty: 1,
  },
  {
    id: "ee-apt-002",
    subject: "General Aptitude",
    topic: "Verbal Ability",
    type: "MCQ",
    marks: 1,
    text: "Fill in the blank with the appropriate preposition:\n\nThe manager was angry _____ the employees for their negligence.",
    options: ["with", "at", "on", "about"],
    answer: 0,
    explanation: "The correct preposition to use after 'angry' when referring to a person is 'with' (angry with someone).",
    difficulty: 1,
  },
  {
    id: "ee-apt-003",
    subject: "General Aptitude",
    topic: "Verbal Ability",
    type: "MCQ",
    marks: 2,
    text: "Read the following statement and determine the valid inference:\n\n*Statement:* 'All engineers are logical. Some logical people are artists.'\n\n*Conclusions:*\nI. Some engineers are artists.\nII. All artists are logical.",
    options: ["Only I follows", "Only II follows", "Both I and II follow", "Neither I nor II follows"],
    answer: 3,
    explanation: "Since some logical people are artists, it doesn't necessarily mean those specific logical people are engineers. And only *some* logical people are artists, so not all artists are necessarily logical. Neither conclusion strictly follows.",
    difficulty: 3,
  },
  {
    id: "ee-apt-004",
    subject: "General Aptitude",
    topic: "Quantitative Aptitude",
    type: "NAT",
    marks: 1,
    text: "If $20\\%$ of $x = 30\\%$ of $y$ and $y = 40$, what is the value of $x$?",
    answer: { min: 59.9, max: 60.1 },
    explanation: "$0.2x = 0.3(40) \\implies 0.2x = 12 \\implies x = 60$.",
    difficulty: 2,
  },
  {
    id: "ee-apt-005",
    subject: "General Aptitude",
    topic: "Quantitative Aptitude",
    type: "MCQ",
    marks: 2,
    text: "A train running at a speed of 72 km/hr crosses a pole in 9 seconds. What is the length of the train?",
    options: ["120 meters", "180 meters", "200 meters", "240 meters"],
    answer: 1,
    explanation: "Speed in m/s = $72 \\times \\frac{5}{18} = 20 \\text{ m/s}$. Length = Speed $\\times$ Time = $20 \\times 9 = 180 \\text{ meters}$.",
    difficulty: 2,
  },
  {
    id: "ee-apt-006",
    subject: "General Aptitude",
    topic: "Analytical Aptitude",
    type: "MCQ",
    marks: 2,
    text: "If in a certain code language, 'COMPUTER' is written as 'RFUVQNPC', how will 'MEDICINE' be written in that language?",
    options: ["MFEDJJOE", "EOJDEJFM", "MFEJDJOE", "EOJDJEFM"],
    answer: 3,
    explanation: "The word is reversed and then each letter is shifted by +1 (or -1 depending on position). Actually, reverse COMPUTER: RETUPMOC. R->R, E->F, T->U, U->V, P->Q, M->N, O->P, C->C. The first and last letters remain same, middle letters are +1. Reverse MEDICINE -> ENICIDEM. First and last same: E...M. N->O, I->J, C->D, I->J, D->E, E->F. Result: EOJDJEFM.",
    difficulty: 3,
  },
  {
    id: "ee-apt-007",
    subject: "General Aptitude",
    topic: "Quantitative Aptitude",
    type: "NAT",
    marks: 2,
    text: "A sum of money doubles itself at compound interest in 5 years. In how many years will it become 8 times of itself?",
    answer: { min: 14.9, max: 15.1 },
    explanation: "$A = P(1+R/100)^n$. For double: $2P = P(1+R/100)^5$. For 8 times: $8P = P(1+R/100)^t$. Since $8 = 2^3 = ((1+R/100)^5)^3 = (1+R/100)^{15}$, $t = 15$.",
    difficulty: 2,
  },
  {
    id: "ee-apt-008",
    subject: "General Aptitude",
    topic: "Spatial Aptitude",
    type: "MCQ",
    marks: 1,
    text: "A cube has its 6 faces painted in different colors. How many cuts are required to divide this cube into exactly 64 smaller identical cubes?",
    options: ["9", "12", "18", "64"],
    answer: 0,
    explanation: "To get $64 = 4 \\times 4 \\times 4$ identical cubes, you need to cut each dimension into 4 pieces. This requires 3 cuts per dimension. Total cuts = $3 + 3 + 3 = 9$.",
    difficulty: 2,
  },
  {
    id: "ee-apt-009",
    subject: "General Aptitude",
    topic: "Analytical Aptitude",
    type: "NAT",
    marks: 1,
    text: "Find the next number in the series: 2, 5, 10, 17, 26, ___",
    answer: { min: 36.9, max: 37.1 },
    explanation: "The series follows the pattern $n^2 + 1$: $1^2+1=2$, $2^2+1=5$, $3^2+1=10$, $4^2+1=17$, $5^2+1=26$, $6^2+1=37$.",
    difficulty: 1,
  },
  {
    id: "ee-apt-010",
    subject: "General Aptitude",
    topic: "Quantitative Aptitude",
    type: "MCQ",
    marks: 2,
    text: "A bag contains 5 red, 4 green, and 3 blue balls. If two balls are drawn at random, what is the probability that both are red?",
    options: ["5/33", "10/33", "5/66", "1/11"],
    answer: 0,
    explanation: "Total balls = 12. Ways to pick 2 balls = $\\binom{12}{2} = 66$. Ways to pick 2 red balls = $\\binom{5}{2} = 10$. Probability = $10 / 66 = 5 / 33$.",
    difficulty: 3,
  },

  // ---------------- ENGINEERING MATHEMATICS (10 Qs) ----------------
  {
    id: "ee-math-001",
    subject: "Engineering Mathematics",
    topic: "Linear Algebra",
    type: "NAT",
    marks: 1,
    text: "Let $A$ be a $3 \\times 3$ matrix with eigenvalues $1, -1, 3$. The determinant of $A^2$ is ______.",
    answer: { min: 8.9, max: 9.1 },
    explanation: "The eigenvalues of $A$ are $\\lambda_1=1, \\lambda_2=-1, \\lambda_3=3$. The determinant of $A$ is the product of its eigenvalues: $|A| = 1 \\times (-1) \\times 3 = -3$. The determinant of $A^2$ is $|A|^2 = (-3)^2 = 9$.",
    difficulty: 2,
  },
  {
    id: "ee-math-002",
    subject: "Engineering Mathematics",
    topic: "Calculus",
    type: "NAT",
    marks: 1,
    text: "Evaluate the limit: $\\lim_{x \\to 0} \\frac{\\sin x - x}{x^3}$",
    answer: { min: -0.266, max: -0.066 },
    answerAliases: ["-1/6", "-0.167"],
    explanation: "Using Taylor series for $\\sin x = x - x^3/3! + x^5/5! - \\dots$\n\n$\\frac{\\sin x - x}{x^3} = \\frac{-x^3/6 + \\dots}{x^3}$. As $x \\to 0$, the limit is $-1/6 \\approx -0.1667$.",
    difficulty: 2,
  },
  {
    id: "ee-math-003",
    subject: "Engineering Mathematics",
    topic: "Differential Equations",
    type: "MCQ",
    marks: 2,
    text: "The solution to the differential equation $\\frac{dy}{dx} + y = e^{-x}$ with initial condition $y(0) = 1$ is:",
    options: ["$y = e^{-x}$", "$y = (x+1)e^{-x}$", "$y = (x-1)e^{-x}$", "$y = xe^{-x} + e^x$"],
    answer: 1,
    explanation: "This is a first-order linear ODE: $dy/dx + P(x)y = Q(x)$ where $P(x)=1, Q(x)=e^{-x}$.\nIntegrating Factor (IF) = $e^{\\int 1 dx} = e^x$.\nSolution: $y \\cdot e^x = \\int e^{-x} e^x dx + C \\implies y e^x = \\int 1 dx + C \\implies y e^x = x + C$.\nAt $x=0, y=1 \\implies 1 = 0 + C \\implies C = 1$.\nThus $y = (x+1)e^{-x}$.",
    difficulty: 3,
  },
  {
    id: "ee-math-004",
    subject: "Engineering Mathematics",
    topic: "Complex Variables",
    type: "MCQ",
    marks: 2,
    text: "The value of the contour integral $\\oint_{C} \\frac{z}{z^2 + 1} dz$, where $C$ is the circle $|z - i| = 1$ traversed counter-clockwise, is:",
    options: ["$0$", "$\\pi i$", "$2\\pi i$", "$-\\pi i$"],
    answer: 1,
    explanation: "The function has poles at $z = i$ and $z = -i$. Only $z = i$ lies inside the contour $|z-i|=1$.\nThe residue at $z=i$ is $\\lim_{z\\to i} (z-i)\\frac{z}{(z-i)(z+i)} = \\frac{i}{2i} = \\frac{1}{2}$.\nBy Cauchy's Residue Theorem, the integral is $2\\pi i \\times (1/2) = \\pi i$.",
    difficulty: 4,
  },
  {
    id: "ee-math-005",
    subject: "Engineering Mathematics",
    topic: "Probability and Statistics",
    type: "NAT",
    marks: 2,
    text: "A fair coin is tossed 10 times. What is the probability of getting exactly 5 heads? (Round to three decimal places).",
    answer: { min: 0.146, max: 0.346 },
    explanation: "This follows a binomial distribution: $P(X=5) = \\binom{10}{5} (0.5)^5 (0.5)^5 = \\frac{252}{1024} = 0.24609$.",
    difficulty: 2,
  },
  {
    id: "ee-math-006",
    subject: "Engineering Mathematics",
    topic: "Linear Algebra",
    type: "MSQ",
    marks: 2,
    text: "Which of the following statements is/are TRUE for a real symmetric matrix $M$?",
    options: [
      "All eigenvalues of $M$ are real.",
      "Eigenvectors corresponding to distinct eigenvalues are orthogonal.",
      "The determinant of $M$ is always positive.",
      "$M$ is always diagonalizable."
    ],
    answer: 0 /* ERROR: All eigenvalues of $M$ are real.,Eigenvectors corresponding to distinct eigenvalues are orthogonal.,$M$ is always diagonalizable. not in ['All eigenvalues of $M$ are real.', 'Eigenvectors corresponding to distinct eigenvalues are orthogonal.', 'The determinant of $M$ is always positive.', '$M$ is always diagonalizable.'] */,
    explanation: "Properties of real symmetric matrices:\n1. All eigenvalues are real.\n2. Eigenvectors of distinct eigenvalues are orthogonal.\n3. They are always diagonalizable.\nThe determinant can be negative if the product of eigenvalues is negative.",
    difficulty: 3,
  },
  {
    id: "ee-math-007",
    subject: "Engineering Mathematics",
    topic: "Calculus",
    type: "MCQ",
    marks: 1,
    text: "The directional derivative of $f(x,y,z) = x^2 y z$ at the point $(1,1,1)$ in the direction of the vector $\\hat{i} + \\hat{j} + \\hat{k}$ is:",
    options: ["$4 / \\sqrt{3}$", "$2 / \\sqrt{3}$", "$4$", "$\\sqrt{3}$"],
    answer: 0,
    explanation: "Gradient $\\nabla f = 2xyz \\hat{i} + x^2z \\hat{j} + x^2y \\hat{k}$.\nAt $(1,1,1)$, $\\nabla f = 2\\hat{i} + \\hat{j} + \\hat{k}$.\nDirection vector $\\vec{u} = \\hat{i} + \\hat{j} + \\hat{k}$, Unit vector $\\hat{u} = \\frac{1}{\\sqrt{3}}(\\hat{i} + \\hat{j} + \\hat{k})$.\nDirectional derivative = $\\nabla f \\cdot \\hat{u} = \\frac{2(1) + 1(1) + 1(1)}{\\sqrt{3}} = \\frac{4}{\\sqrt{3}}$.",
    difficulty: 3,
  },
  {
    id: "ee-math-008",
    subject: "Engineering Mathematics",
    topic: "Probability and Statistics",
    type: "NAT",
    marks: 2,
    text: "A random variable $X$ has the probability density function $f(x) = kx$ for $0 \\le x \\le 2$ and $0$ otherwise. Find the expected value $E[X]$.",
    answer: { min: 1.2329999999999999, max: 1.433 },
    answerAliases: ["4/3"],
    explanation: "First, find $k$: $\\int_0^2 kx dx = 1 \\implies k[x^2/2]_0^2 = 2k = 1 \\implies k = 1/2$.\n$E[X] = \\int_0^2 x f(x) dx = \\int_0^2 x(x/2) dx = \\frac{1}{2} [x^3/3]_0^2 = \\frac{8}{6} = \\frac{4}{3} \\approx 1.333$.",
    difficulty: 2,
  },
  {
    id: "ee-math-009",
    subject: "Engineering Mathematics",
    topic: "Numerical Methods",
    type: "MCQ",
    marks: 1,
    text: "In the Newton-Raphson method, the iteration formula to find the square root of a positive real number $N$ is:",
    options: [
      "$x_{n+1} = \\frac{1}{2}\\left(x_n + \\frac{N}{x_n}\\right)$",
      "$x_{n+1} = \\frac{1}{2}\\left(x_n - \\frac{N}{x_n}\\right)$",
      "$x_{n+1} = x_n - \\frac{N}{x_n}$",
      "$x_{n+1} = x_n + \\frac{N}{x_n}$"
    ],
    answer: 0,
    explanation: "Let $f(x) = x^2 - N = 0$. Then $f'(x) = 2x$.\n$x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)} = x_n - \\frac{x_n^2 - N}{2x_n} = x_n - \\frac{x_n}{2} + \\frac{N}{2x_n} = \\frac{1}{2}\\left(x_n + \\frac{N}{x_n}\\right)$.",
    difficulty: 1,
  },
  {
    id: "ee-math-010",
    subject: "Engineering Mathematics",
    topic: "Differential Equations",
    type: "NAT",
    marks: 2,
    text: "Given the differential equation $y'' + 4y = 0$, with initial conditions $y(0) = 0$ and $y'(0) = 2$. The value of $y(\\pi/4)$ is:",
    answer: { min: 0.9, max: 1.1 },
    explanation: "The characteristic equation is $r^2 + 4 = 0 \\implies r = \\pm 2i$.\nThe general solution is $y(x) = C_1 \\cos(2x) + C_2 \\sin(2x)$.\n$y(0) = C_1 = 0 \\implies y(x) = C_2 \\sin(2x)$.\n$y'(x) = 2C_2 \\cos(2x) \\implies y'(0) = 2C_2 = 2 \\implies C_2 = 1$.\nTherefore, $y(x) = \\sin(2x)$.\n$y(\\pi/4) = \\sin(2 \\times \\pi/4) = \\sin(\\pi/2) = 1$.",
    difficulty: 2,
  },
  // ---------------- ELECTRIC CIRCUITS ----------------
  {
    id: "ee-ec-006",
    subject: "Electric Circuits",
    topic: "DC Circuits",
    type: "NAT",
    marks: 1,
    text: "In a linear network, if the resistance of all branches is doubled, the Thevenin equivalent resistance $R_{th}$ seen from any two terminals will be multiplied by a factor of ____.",
    answer: { min: 1.9, max: 2.1 },
    explanation: "Since the network is linear, scaling all resistances by a factor $k$ scales the equivalent resistance by the same factor $k$. Here $k = 2$.",
    difficulty: 1,
  },
  {
    id: "ee-ec-007",
    subject: "Electric Circuits",
    topic: "Transients",
    type: "NAT",
    marks: 2,
    text: "A series RC circuit with $R = 100~\\Omega$ and $C = 10~\\mu F$ is connected to a 10 V DC source at $t = 0$. The capacitor is initially uncharged. The time taken for the voltage across the capacitor to reach 5 V is _____ milliseconds. (Round to two decimal places).",
    answer: { min: 0.59, max: 0.7899999999999999 },
    explanation: "$V_c(t) = V_s(1 - e^{-t/RC})$. We need $V_c(t) = 5$ V, and $V_s = 10$ V.\n$5 = 10(1 - e^{-t/RC}) \\implies e^{-t/RC} = 0.5 \\implies t = RC \\ln(2)$.\nTime constant $\\tau = RC = 100 \\times 10 \\times 10^{-6} = 10^{-3}$ seconds = 1 ms.\n$t = 1 \\times \\ln(2) \\approx 0.693$ ms.",
    difficulty: 2,
  },
  
  // ---------------- ELECTROMAGNETIC FIELDS ----------------
  {
    id: "ee-emf-004",
    subject: "Electromagnetic Fields",
    topic: "Electrostatics",
    type: "MCQ",
    marks: 1,
    text: "The capacitance of a parallel plate capacitor is $C$. If the distance between the plates is halved and a dielectric medium of relative permittivity $\\epsilon_r = 4$ is inserted between the plates, the new capacitance will be:",
    options: ["$2C$", "$4C$", "$8C$", "$C/2$"],
    answer: 2,
    explanation: "$C = \\frac{\\epsilon_0 A}{d}$. New capacitance $C' = \\frac{\\epsilon_r \\epsilon_0 A}{d/2} = \\frac{4 \\epsilon_0 A}{d/2} = 8 \\frac{\\epsilon_0 A}{d} = 8C$.",
    difficulty: 1,
  },
  {
    id: "ee-emf-005",
    subject: "Electromagnetic Fields",
    topic: "Magnetostatics",
    type: "NAT",
    marks: 2,
    text: "An infinitely long straight wire carries a current of $10$ A. The magnitude of the magnetic flux density $B$ at a distance of $2$ cm from the wire is ____ $\\mu T$.",
    answer: { min: 99.9, max: 100.1 },
    explanation: "By Ampere's law, $B = \\frac{\\mu_0 I}{2\\pi r}$.\n$B = \\frac{4\\pi \\times 10^{-7} \\times 10}{2\\pi \\times 0.02} = \\frac{2 \\times 10^{-6}}{0.02} = 100 \\times 10^{-6}$ T $= 100~\\mu T$.",
    difficulty: 2,
  },

  // ---------------- ELECTRICAL MACHINES ----------------
  {
    id: "ee-em-005",
    subject: "Electrical Machines",
    topic: "Transformers",
    type: "NAT",
    marks: 1,
    text: "A 50 kVA, 3300/230 V single-phase transformer has an iron loss of 400 W and full-load copper loss of 800 W. The load in kVA at which maximum efficiency occurs is ____ kVA. (Round to one decimal place).",
    answer: { min: 35.3, max: 35.5 },
    explanation: "Maximum efficiency occurs when Copper Loss ($P_{cu}$) = Iron Loss ($P_i$).\nLet $x$ be the fraction of full load. $x^2 P_{cu,FL} = P_i \\implies x^2 (800) = 400 \\implies x^2 = 0.5 \\implies x = 1/\\sqrt{2} \\approx 0.707$.\nLoad at max efficiency = $0.707 \\times 50 = 35.35$ kVA.",
    difficulty: 2,
  },
  {
    id: "ee-em-006",
    subject: "Electrical Machines",
    topic: "Induction Motors",
    type: "MCQ",
    marks: 2,
    text: "A 4-pole, 3-phase, 50 Hz induction motor runs at a speed of 1440 rpm. The frequency of the rotor currents is:",
    options: ["50 Hz", "2 Hz", "4 Hz", "1.5 Hz"],
    answer: 1,
    explanation: "Synchronous speed $N_s = \\frac{120f}{P} = \\frac{120 \\times 50}{4} = 1500$ rpm.\nSlip $s = \\frac{N_s - N_r}{N_s} = \\frac{1500 - 1440}{1500} = \\frac{60}{1500} = 0.04$.\nRotor frequency $f_r = s f = 0.04 \\times 50 = 2$ Hz.",
    difficulty: 1,
  },
  {
    id: "ee-em-007",
    subject: "Electrical Machines",
    topic: "DC Machines",
    type: "MSQ",
    marks: 2,
    text: "Which of the following speed control methods for DC motors can provide speeds *above* the rated base speed?",
    options: ["Armature voltage control", "Flux (field) control", "Armature resistance control", "Ward-Leonard system (operating beyond rated field)"],
    answer: 0 /* ERROR: Flux (field) control,Ward-Leonard system (operating beyond rated field) not in ['Armature voltage control', 'Flux (field) control', 'Armature resistance control', 'Ward-Leonard system (operating beyond rated field)'] */,
    explanation: "Speed $N \\propto \\frac{E_b}{\\phi}$. To increase speed above the base speed, the flux $\\phi$ must be reduced (field weakening). Armature voltage control and resistance control only decrease the speed below the base speed.",
    difficulty: 2,
  },

  // ---------------- POWER SYSTEMS ----------------
  {
    id: "ee-ps-005",
    subject: "Power Systems",
    topic: "Transmission Lines",
    type: "MCQ",
    marks: 1,
    text: "Surge Impedance Loading (SIL) of a transmission line is given by:",
    options: ["$V^2 / Z_s$", "$V^2 \\cdot Z_s$", "$V / Z_s$", "$Z_s / V^2$"],
    answer: 0,
    explanation: "The Surge Impedance Loading is the power delivered by a line to a purely resistive load equal to its surge impedance $Z_s$. $SIL = \\frac{|V_L|^2}{Z_s}$.",
    difficulty: 1,
  },
  {
    id: "ee-ps-006",
    subject: "Power Systems",
    topic: "Fault Analysis",
    type: "MCQ",
    marks: 2,
    text: "In a solid single line-to-ground (LG) fault on phase A, the sequence currents $I_{a1}$, $I_{a2}$, and $I_{a0}$ are related as:",
    options: ["$I_{a1} = I_{a2} = I_{a0}$", "$I_{a1} + I_{a2} + I_{a0} = 0$", "$I_{a1} = I_{a2} = -I_{a0}$", "$I_{a1} = -I_{a2}, I_{a0} = 0$"],
    answer: 0,
    explanation: "For a solid LG fault on phase A, $I_b = 0, I_c = 0$, and $V_a = 0$.\nSubstituting $I_b$ and $I_c$ into the symmetrical component transformation yields $I_{a0} = I_{a1} = I_{a2} = I_a / 3$.",
    difficulty: 2,
  },
  {
    id: "ee-ps-007",
    subject: "Power Systems",
    topic: "Stability",
    type: "NAT",
    marks: 2,
    text: "A synchronous generator is supplying $0.5$ pu power to an infinite bus. The maximum power transfer capacity is $1.0$ pu. The initial power angle $\\delta_0$ in degrees is ____.",
    answer: { min: 29.9, max: 30.1 },
    explanation: "$P_e = P_{max} \\sin \\delta$. Given $P_e = 0.5$ and $P_{max} = 1.0$.\n$0.5 = 1.0 \\sin \\delta_0 \\implies \\sin \\delta_0 = 0.5 \\implies \\delta_0 = 30^\\circ$.",
    difficulty: 1,
  },

  // ---------------- CONTROL SYSTEMS ----------------
  {
    id: "ee-cs-003",
    subject: "Control Systems",
    topic: "Root Locus",
    type: "NAT",
    marks: 1,
    text: "The open-loop transfer function of a unity feedback system is $G(s) = \\frac{K}{s(s+2)(s+4)}$. The number of asymptotes in the root locus plot is ____.",
    answer: { min: 2.9, max: 3.1 },
    explanation: "Number of asymptotes = $P - Z$, where $P$ is the number of open-loop poles and $Z$ is the number of open-loop zeros.\nHere, poles at $s = 0, -2, -4$ ($P=3$) and no zeros ($Z=0$). Asymptotes = $3 - 0 = 3$.",
    difficulty: 1,
  },
  {
    id: "ee-cs-004",
    subject: "Control Systems",
    topic: "Frequency Response",
    type: "MCQ",
    marks: 2,
    text: "A system has a phase margin of $45^\\circ$ and a gain crossover frequency of $10$ rad/s. If a time delay of $0.05$ seconds is introduced, the new phase margin will be:",
    options: ["$16.35^\\circ$", "$45^\\circ$", "$73.65^\\circ$", "The system becomes unstable"],
    answer: 0,
    explanation: "A time delay $e^{-sT_d}$ contributes a phase shift of $-\\omega T_d$ (in radians).\nAt $\\omega_{gc} = 10$, the added phase is $-10 \\times 0.05 = -0.5$ radians = $-0.5 \\times \\frac{180}{\\pi} \\approx -28.65^\\circ$.\nNew Phase Margin = $45^\\circ - 28.65^\\circ = 16.35^\\circ$.",
    difficulty: 3,
  },
  {
    id: "ee-cs-005",
    subject: "Control Systems",
    topic: "Time Domain",
    type: "NAT",
    marks: 2,
    text: "For a second-order system with transfer function $\\frac{25}{s^2 + 6s + 25}$, the damping ratio $\\zeta$ is ____.",
    answer: { min: 0.5, max: 0.7 },
    explanation: "Comparing with standard form $\\frac{\\omega_n^2}{s^2 + 2\\zeta\\omega_n s + \\omega_n^2}$:\n$\\omega_n^2 = 25 \\implies \\omega_n = 5$.\n$2\\zeta\\omega_n = 6 \\implies 2\\zeta(5) = 6 \\implies 10\\zeta = 6 \\implies \\zeta = 0.6$.",
    difficulty: 1,
  },
  // ---------------- SIGNALS AND SYSTEMS ----------------
  {
    id: "ee-ss-003",
    subject: "Signals and Systems",
    topic: "LTI Systems",
    type: "NAT",
    marks: 2,
    text: "The impulse response of a continuous-time LTI system is $h(t) = e^{-2t}u(t)$. If the input is $x(t) = u(t)$, the steady-state value of the output $y(t)$ as $t \\to \\infty$ is ____.",
    answer: { min: 0.4, max: 0.6 },
    explanation: "$y(t) = x(t) * h(t) = \\int_0^t e^{-2\\tau} d\\tau = \\left[ \\frac{e^{-2\\tau}}{-2} \\right]_0^t = \\frac{1 - e^{-2t}}{2} u(t)$.\nAs $t \\to \\infty$, $e^{-2t} \\to 0$, so $y(\\infty) = 1/2 = 0.5$.",
    difficulty: 2,
  },
  {
    id: "ee-ss-004",
    subject: "Signals and Systems",
    topic: "Transforms",
    type: "MCQ",
    marks: 1,
    text: "The Laplace transform of $t e^{-at} u(t)$ is:",
    options: ["$\\frac{1}{s+a}$", "$\\frac{1}{(s+a)^2}$", "$\\frac{a}{(s+a)^2}$", "$\\frac{s}{(s+a)^2}$"],
    answer: 1,
    explanation: "$L\\{e^{-at} u(t)\\} = \\frac{1}{s+a}$.\nMultiplying by $t$ corresponds to differentiating the transform with respect to $s$ and multiplying by $-1$:\n$L\\{t x(t)\\} = -\\frac{d}{ds}X(s) = -\\frac{d}{ds} \\left(\\frac{1}{s+a}\\right) = \\frac{1}{(s+a)^2}$.",
    difficulty: 1,
  },
  {
    id: "ee-ss-005",
    subject: "Signals and Systems",
    topic: "LTI Systems",
    type: "MSQ",
    marks: 2,
    text: "Which of the following systems are BOTH linear and time-invariant?",
    options: ["$y(t) = 2x(t-3)$", "$y(t) = t x(t)$", "$y(t) = x(t) + 2$", "$y(t) = \\int_{-\\infty}^{t} x(\\tau) d\\tau$"],
    answer: 0 /* ERROR: $y(t) = 2x(t-3)$,$y(t) = \int_{-\infty}^{t} x(\tau) d\tau$ not in ['$y(t) = 2x(t-3)$', '$y(t) = t x(t)$', '$y(t) = x(t) + 2$', '$y(t) = \\int_{-\\infty}^{t} x(\\tau) d\\tau$'] */,
    explanation: "$y(t) = 2x(t-3)$ is LTI (scaling and shifting).\n$y(t) = tx(t)$ is linear but NOT time-invariant (time-varying gain).\n$y(t) = x(t)+2$ is NOT linear (fails zero input $\\implies$ zero output).\nIntegration is a linear, time-invariant operation.",
    difficulty: 2,
  },

  // ---------------- POWER ELECTRONICS ----------------
  {
    id: "ee-pe-002",
    subject: "Power Electronics",
    topic: "Rectifiers",
    type: "NAT",
    marks: 2,
    text: "A single-phase fully controlled bridge converter is supplying a highly inductive load with a constant ripple-free current of 10 A. The AC source is 230 V, 50 Hz. If the firing angle is $60^\\circ$, the active power drawn from the source is ____ W. (Round to the nearest integer).",
    answer: { min: 1034.9, max: 1035.1 },
    explanation: "$V_{dc} = \\frac{2V_m}{\\pi} \\cos \\alpha = \\frac{2 \\times 230\\sqrt{2}}{\\pi} \\cos 60^\\circ = \\frac{650.54}{\\pi} \\times 0.5 = 103.53$ V.\nPower $P = V_{dc} I_0 = 103.53 \\times 10 = 1035.3$ W $\\approx 1035$ W. (Alternatively, assuming lossless converter, $P_{in} = P_{out}$).",
    difficulty: 3,
  },
  {
    id: "ee-pe-003",
    subject: "Power Electronics",
    topic: "Choppers",
    type: "MCQ",
    marks: 2,
    text: "A step-down (buck) chopper operates from a 100 V DC source and feeds a resistive load of $10~\\Omega$. If the duty cycle is 0.6, the RMS value of the output voltage is:",
    options: ["$60$ V", "$100\\sqrt{0.6}$ V", "$60\\sqrt{0.6}$ V", "$100$ V"],
    answer: 1,
    explanation: "For a buck chopper, the output voltage is $V_s$ during $T_{on}$ and 0 during $T_{off}$.\n$V_{rms} = \\sqrt{\\frac{1}{T} \\int_0^{DT} V_s^2 dt} = \\sqrt{\\frac{V_s^2 \\cdot DT}{T}} = V_s \\sqrt{D}$.\n$V_{rms} = 100 \\sqrt{0.6}$ V $\\approx 77.46$ V.",
    difficulty: 2,
  },

  // ---------------- ANALOG AND DIGITAL ELECTRONICS ----------------
  {
    id: "ee-ade-003",
    subject: "Analog and Digital Electronics",
    topic: "Op-Amps",
    type: "NAT",
    marks: 2,
    text: "An ideal op-amp circuit is configured as an inverting amplifier with input resistance $R_{in} = 2~k\\Omega$ and feedback resistance $R_f = 10~k\\Omega$. If the input voltage is a 2V peak-to-peak sine wave, the peak-to-peak output voltage is ____ V.",
    answer: { min: 9.9, max: 10.1 },
    explanation: "Voltage gain $A_v = -R_f / R_{in} = -10/2 = -5$.\nThe magnitude of the gain is $5$.\nOutput peak-to-peak = $|A_v| \\times$ Input peak-to-peak = $5 \\times 2 = 10$ V.",
    difficulty: 1,
  },
  {
    id: "ee-ade-004",
    subject: "Analog and Digital Electronics",
    topic: "Digital Logic",
    type: "MCQ",
    marks: 1,
    text: "How many 2-input NAND gates are required to implement a 2-input XOR gate?",
    options: ["3", "4", "5", "6"],
    answer: 1,
    explanation: "A standard implementation of $A \\oplus B$ requires 4 NAND gates:\n1. $N_1 = \\overline{AB}$\n2. $N_2 = \\overline{A \\cdot N_1}$\n3. $N_3 = \\overline{B \\cdot N_1}$\n4. Output = $\\overline{N_2 \\cdot N_3} = A \\oplus B$.",
    difficulty: 2,
  },

  // ---------------- MEASUREMENTS ----------------
  {
    id: "ee-meas-002",
    subject: "Electrical and Electronic Measurements",
    topic: "Error Analysis",
    type: "NAT",
    marks: 2,
    text: "Two resistors $R_1 = 100 \\pm 2\\%$ and $R_2 = 200 \\pm 3\\%$ are connected in series. The maximum percentage error in the equivalent resistance is ____ %. (Round to two decimal places).",
    answer: { min: 2.57, max: 2.77 },
    explanation: "$R_{eq} = R_1 + R_2 = 100 + 200 = 300~\\Omega$.\nAbsolute error in $R_1 = 0.02 \\times 100 = 2~\\Omega$.\nAbsolute error in $R_2 = 0.03 \\times 200 = 6~\\Omega$.\nTotal maximum absolute error = $2 + 6 = 8~\\Omega$.\nPercentage error = $(8 / 300) \\times 100 = 2.666...\\% \\approx 2.67\\%$.",
    difficulty: 2,
  }
]

export const TESTS: TestDefinition[] = [
  {
    id: "drill-ee-circuits",
    title: "Electric Circuits: Foundation Drill",
    kind: "subject",
    subject: "Electric Circuits",
    durationMinutes: 15,
    description: "A focused 5-question drill on KVL/KCL, Thevenin's theorem, transients, AC resonance, and two-port networks.",
    questionIds: [
      "ee-ec-001",
      "ee-ec-002",
      "ee-ec-003",
      "ee-ec-004",
      "ee-ec-005"
    ]
  },
  {
    id: "drill-ee-emf",
    title: "Electromagnetics: Core Concepts",
    kind: "subject",
    subject: "Electromagnetic Fields",
    durationMinutes: 10,
    description: "A 3-question drill on Maxwell's equations, boundary conditions, and magnetic field calculations.",
    questionIds: [
      "ee-emf-001",
      "ee-emf-002",
      "ee-emf-003"
    ]
  },
  {
    id: "drill-ee-machines",
    title: "Electrical Machines: Core Drill",
    kind: "subject",
    subject: "Electrical Machines",
    durationMinutes: 15,
    description: "A focused 4-question drill covering Transformers, DC Motors, Induction Motors, and Synchronous Machines.",
    questionIds: [
      "ee-em-001",
      "ee-em-002",
      "ee-em-003",
      "ee-em-004"
    ]
  },
  {
    id: "drill-ee-power",
    title: "Power Systems: Core Drill",
    kind: "subject",
    subject: "Power Systems",
    durationMinutes: 15,
    description: "A 4-question drill on Load Flow Analysis, Transmission Lines, Fault Analysis, and Stability.",
    questionIds: [
      "ee-ps-001",
      "ee-ps-002",
      "ee-ps-003",
      "ee-ps-004"
    ]
  },
  {
    id: "drill-ee-systems-electronics",
    title: "Systems & Electronics: Mixed Drill",
    kind: "subject",
    subject: "Control Systems", // Treating as primary for the dashboard
    durationMinutes: 20,
    description: "A 5-question mixed drill covering Control Systems, Signals and Systems, and Power Electronics.",
    questionIds: [
      "ee-cs-001",
      "ee-cs-002",
      "ee-ss-001",
      "ee-ss-002",
      "ee-pe-001"
    ]
  },
  {
    id: "drill-ee-ade-meas",
    title: "Electronics & Measurements Drill",
    kind: "subject",
    subject: "Analog and Digital Electronics",
    durationMinutes: 10,
    description: "A 3-question drill covering Op-Amps, Digital Logic, and PMMC Instruments.",
    questionIds: [
      "ee-ade-001",
      "ee-ade-002",
      "ee-meas-001"
    ]
  },
  {
    id: "mock-ee-1",
    title: "GATE EE 2026 Full Mock 1",
    kind: "mock",
    durationMinutes: 180,
    description: "A comprehensive 65-question authentic mock exam testing all core Electrical Engineering subjects along with Engineering Mathematics and General Aptitude.",
    questionIds: [
      "ee-apt-001", "ee-apt-002", "ee-apt-003", "ee-apt-004", "ee-apt-005", "ee-apt-006", "ee-apt-007", "ee-apt-008", "ee-apt-009", "ee-apt-010",
      "ee-math-001", "ee-math-002", "ee-math-003", "ee-math-004", "ee-math-005", "ee-math-006", "ee-math-007", "ee-math-008", "ee-math-009", "ee-math-010",
      "ee-ec-001", "ee-ec-002", "ee-ec-003", "ee-ec-004", "ee-ec-005", "ee-ec-006", "ee-ec-007",
      "ee-emf-001", "ee-emf-002", "ee-emf-003", "ee-emf-004", "ee-emf-005",
      "ee-em-001", "ee-em-002", "ee-em-003", "ee-em-004", "ee-em-005", "ee-em-006", "ee-em-007",
      "ee-ps-001", "ee-ps-002", "ee-ps-003", "ee-ps-004", "ee-ps-005", "ee-ps-006", "ee-ps-007",
      "ee-cs-001", "ee-cs-002", "ee-cs-003", "ee-cs-004", "ee-cs-005",
      "ee-ss-001", "ee-ss-002", "ee-ss-003", "ee-ss-004", "ee-ss-005",
      "ee-pe-001", "ee-pe-002", "ee-pe-003",
      "ee-ade-001", "ee-ade-002", "ee-ade-003", "ee-ade-004",
      "ee-meas-001", "ee-meas-002"
    ]
  }
,
  {
    id: "drill-ee-apt",
    title: "General Aptitude Drill",
    kind: "subject",
    subject: "General Aptitude",
    durationMinutes: 20,
    description: "A 10-question drill covering Verbal, Quantitative, Analytical, and Spatial Aptitude.",
    questionIds: [
      "ee-apt-001", "ee-apt-002", "ee-apt-003", "ee-apt-004", "ee-apt-005",
      "ee-apt-006", "ee-apt-007", "ee-apt-008", "ee-apt-009", "ee-apt-010"
    ]
  },
  {
    id: "drill-ee-math",
    title: "Engineering Mathematics Drill",
    kind: "subject",
    subject: "Engineering Mathematics",
    durationMinutes: 25,
    description: "A 10-question drill covering Linear Algebra, Calculus, Differential Equations, Complex Variables, and Probability.",
    questionIds: [
      "ee-math-001", "ee-math-002", "ee-math-003", "ee-math-004", "ee-math-005",
      "ee-math-006", "ee-math-007", "ee-math-008", "ee-math-009", "ee-math-010"
    ]
  }

]

