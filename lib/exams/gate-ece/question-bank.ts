/**
 * GATE ECE Question Bank & Practice Tests
 */

import type { Question, TestDefinition } from "../../test-types"

export const QUESTIONS: Question[] = [
  // ── Signals & Systems ───────────────────────────────────────────────────
  {
    id: "ece-ss-001",
    subject: "Signals & Systems",
    topic: "Sampling theorem",
    type: "MCQ",
    marks: 1,
    text: "Consider the signal x(t) = sinc(100πt) * sinc(200πt), where * denotes convolution. What is the minimum Nyquist sampling rate (in Hz) required to sample x(t) without aliasing?",
    options: ["100 Hz", "200 Hz", "300 Hz", "400 Hz"],
    answer: 0,
    explanation:
      "In the frequency domain, convolution x1(t) * x2(t) corresponds to multiplication X1(f) · X2(f). sinc(100πt) has band-limit B1 = 50 Hz. sinc(200πt) has band-limit B2 = 100 Hz. The product in frequency domain is non-zero only up to min(B1, B2) = 50 Hz. Maximum frequency f_max = 50 Hz, so Nyquist sampling rate = 2 × f_max = 100 Hz.",
    source: "GATE ECE, Signals & Systems",
    expectedSeconds: 90,
  },
  {
    id: "ece-ss-002",
    subject: "Signals & Systems",
    topic: "Z-Transform ROC",
    type: "NAT",
    marks: 2,
    text: "A causal discrete-time LTI system has a transfer function H(z) = 1 / [(1 - 0.5z⁻¹)(1 - 2z⁻¹)]. For the system to be stable, what is the ROC range |z| > R? Enter the minimum value of R.",
    answer: 2,
    explanation:
      "Poles of H(z) are at z = 0.5 and z = 2. For a causal system, the ROC is outside the outermost pole, i.e., |z| > 2. (Note: Since the ROC |z| > 2 does not include the unit circle |z|=1, the causal system is unstable, but as a causal system its ROC radius R is 2).",
    source: "GATE ECE, Z-Transform",
    expectedSeconds: 120,
  },

  // ── Analog Circuits ─────────────────────────────────────────────────────
  {
    id: "ece-ac-001",
    subject: "Analog Circuits",
    topic: "Op-Amp Circuits",
    type: "MCQ",
    marks: 2,
    text: "An inverting amplifier using an ideal operational amplifier has input resistance R1 = 10 kΩ and feedback resistance Rf = 100 kΩ. What is the closed-loop voltage gain Av = Vo/Vi of the amplifier circuit?",
    options: ["-10", "+10", "-11", "+11"],
    answer: 0,
    explanation:
      "For an ideal inverting operational amplifier, the closed-loop voltage gain is Av = -Rf / R1 = -100 kΩ / 10 kΩ = -10.",
    source: "GATE ECE, Op-Amps",
    expectedSeconds: 45,
  },
  {
    id: "ece-ac-002",
    subject: "Analog Circuits",
    topic: "BJT Amplifiers",
    type: "NAT",
    marks: 2,
    text: "A Common-Emitter BJT amplifier operates at thermal voltage Vt = 25 mV. If the DC collector current IC = 2.5 mA and collector load resistance RC = 2 kΩ, calculate the magnitude of the small-signal voltage gain |Av| = gm · RC.",
    answer: 200,
    explanation:
      "Transconductance gm = IC / Vt = 2.5 mA / 25 mV = 0.1 A/V (or 100 mS). Small-signal voltage gain magnitude |Av| = gm · RC = 0.1 A/V × 2000 Ω = 200.",
    source: "GATE ECE, BJT Amplifiers",
    expectedSeconds: 90,
  },

  // ── Communications ──────────────────────────────────────────────────────
  {
    id: "ece-com-001",
    subject: "Communications",
    topic: "Analog Modulation",
    type: "MCQ",
    marks: 1,
    text: "An AM transmitter radiates 10 kW of unmodulated carrier power. When sinusoidal modulation is applied, the total radiated power increases to 11.25 kW. What is the modulation index μ?",
    options: ["0.3", "0.5", "0.7", "0.8"],
    answer: 1,
    explanation:
      "Total power Pt = Pc (1 + μ²/2). Given Pt = 11.25 kW and Pc = 10 kW: 11.25 = 10 (1 + μ²/2) => 1.125 = 1 + μ²/2 => μ²/2 = 0.125 => μ² = 0.25 => μ = 0.5.",
    source: "GATE ECE, AM Modulation",
    expectedSeconds: 60,
  },
  {
    id: "ece-com-002",
    subject: "Communications",
    topic: "Digital Communications",
    type: "MSQ",
    marks: 2,
    text: "Which of the following statements regarding Binary Phase Shift Keying (BPSK) and Quadrature Phase Shift Keying (QPSK) are TRUE?",
    options: [
      "QPSK achieves twice the spectral efficiency (bits/sec/Hz) compared to BPSK for the same symbol rate.",
      "The theoretical Bit Error Rate (BER) of QPSK as a function of Eb/N0 is identical to BPSK.",
      "BPSK requires two orthogonal carrier signals (sine and cosine).",
      "QPSK transmits 2 bits per symbol while BPSK transmits 1 bit per symbol.",
    ],
    answer: [0, 1, 3],
    explanation:
      "Statements (A), (B), and (D) are true. QPSK sends 2 bits/symbol over two orthogonal carriers (I and Q channels), yielding double spectral efficiency for the same bit rate while maintaining the exact same BER vs Eb/N0 curve as BPSK. Statement (C) is false because BPSK uses only one carrier phase.",
    source: "GATE ECE, Digital Communication",
    expectedSeconds: 150,
  },

  // ── Electromagnetics & Transmission Lines ────────────────────────────────
  {
    id: "ece-em-001",
    subject: "Electromagnetics & Transmission Lines",
    topic: "Transmission Lines",
    type: "NAT",
    marks: 1,
    text: "A lossless transmission line has an inductance L = 250 nH/m and capacitance C = 100 pF/m. What is the characteristic impedance Z0 of the line in Ohms?",
    answer: 50,
    explanation:
      "For a lossless transmission line, characteristic impedance Z0 = √(L / C) = √((250 × 10⁻⁹ H/m) / (100 × 10⁻¹² F/m)) = √(2500) = 50 Ω.",
    source: "GATE ECE, Electromagnetics",
    expectedSeconds: 45,
  },

  // ── Control Systems ──────────────────────────────────────────────────────
  {
    id: "ece-cs-001",
    subject: "Control Systems",
    topic: "Time-Domain Analysis",
    type: "NAT",
    marks: 2,
    text: "A second-order closed-loop control system has transfer function T(s) = 100 / (s² + 12s + 100). Calculate the peak overshoot Mp in percentage. (Use π ≈ 3.1416). Enter value rounded to 2 decimal places.",
    answer: { min: 9.4, max: 9.6 },
    explanation:
      "Comparing s² + 2ζωn s + ωn² with s² + 12s + 100: ωn = 10 rad/s, 2ζ(10) = 12 => damping ratio ζ = 0.6. Peak overshoot Mp = e^(-πζ / √(1-ζ²)) × 100% = e^(-0.6π / 0.8) × 100% = e^(-2.3562) × 100% ≈ 9.48%.",
    source: "GATE ECE, Control Systems",
    expectedSeconds: 150,
  },

  // ── Digital Circuits & VLSI ───────────────────────────────────────────────
  {
    id: "ece-dc-001",
    subject: "Digital Circuits & VLSI",
    topic: "Counters",
    type: "NAT",
    marks: 1,
    text: "What is the minimum number of flip-flops required to construct a Modulo-12 ripple counter?",
    answer: 4,
    explanation:
      "To count up to Modulo-N = 12, the required number of flip-flops n must satisfy 2^n ≥ N. For n = 3, 2³ = 8 < 12. For n = 4, 2⁴ = 16 ≥ 12. Hence, 4 flip-flops are needed.",
    source: "GATE ECE, Digital Logic",
    expectedSeconds: 45,
  },

  // ── Engineering Mathematics ──────────────────────────────────────────────
  {
    id: "ece-math-001",
    subject: "Engineering Mathematics",
    topic: "Linear Algebra",
    type: "MCQ",
    marks: 1,
    text: "What are the eigenvalues of the matrix A = [[4, 2], [1, 3]]?",
    options: ["2 and 5", "1 and 6", "3 and 4", "2 and 3"],
    answer: 0,
    explanation:
      "Trace of A = 4 + 3 = 7. Determinant of A = (4)(3) - (2)(1) = 10. The sum of eigenvalues λ1 + λ2 = 7 and product λ1 · λ2 = 10. Solving λ² - 7λ + 10 = 0 yields λ = 2 and λ = 5.",
    source: "GATE ECE, Engineering Mathematics",
    expectedSeconds: 60,
  },

  // ── General Aptitude ──────────────────────────────────────────────────────
  {
    id: "ece-apt-001",
    subject: "General Aptitude",
    topic: "Quantitative Aptitude",
    type: "MCQ",
    marks: 1,
    text: "A train running at a speed of 72 km/h crosses a 200 m long platform in 22 seconds. What is the length of the train in meters?",
    options: ["200 m", "240 m", "280 m", "300 m"],
    answer: 1,
    explanation:
      "Speed of train in m/s = 72 × (5/18) = 20 m/s. Total distance covered in 22 s = Speed × Time = 20 × 22 = 440 m. Total distance = Length of train + Length of platform. Length of train = 440 - 200 = 240 m.",
    source: "GATE General Aptitude",
    expectedSeconds: 60,
  },
]

export const TESTS: TestDefinition[] = [
  {
    id: "gate-ece-subject-drill-1",
    title: "ECE Signals, Systems & Analog Drill",
    kind: "subject",
    subject: "Signals & Systems",
    durationMinutes: 30,
    description: "Core drill covering sampling theorem, Z-transform, Op-Amp closed-loop gain, and BJT small-signal analysis.",
    questionIds: ["ece-ss-001", "ece-ss-002", "ece-ac-001", "ece-ac-002"],
  },
  {
    id: "gate-ece-subject-drill-2",
    title: "ECE Communications & Controls Drill",
    kind: "subject",
    subject: "Communications",
    durationMinutes: 30,
    description: "Practice questions covering AM modulation index, QPSK/BPSK digital signaling, and second-order control system overshoot.",
    questionIds: ["ece-com-001", "ece-com-002", "ece-cs-001", "ece-em-001"],
  },
]
