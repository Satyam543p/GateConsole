/**
 * ============================================================
 *  QUESTION BANK — this is the only file you need to edit.
 * ============================================================
 *
 * HOW TO ADD YOUR RESEARCHED QUESTIONS
 *
 * 1. Append objects to the QUESTIONS array below. Each must match the
 *    `Question` interface in lib/test-types.ts.
 * 2. Add or edit a TestDefinition in TESTS to group them into a paper.
 *    Reference questions by id in `questionIds`.
 * 3. That's it. The hub, runner, scoring and review screens pick it up
 *    automatically — no other file changes.
 *
 * ANSWER FORMAT CHEAT SHEET
 *   MCQ  answer: 2                  // zero-based index of the correct option
 *   MSQ  answer: [0, 3]             // all correct indices; all-or-nothing scoring
 *   NAT  answer: 12                 // exact number (0.011 tolerance applied)
 *   NAT  answer: { min: 3.1, max: 3.2 }   // explicit accepted range
 *
 * `subject` MUST match a subject string from lib/gate-data.ts exactly, so
 * results can be mapped back onto the priority matrix. Valid values:
 *   Algorithms · Data Structures · Operating Systems · DBMS
 *   Computer Networks · Theory of Computation · Compiler Design
 *   Digital Logic · Computer Organization & Architecture
 *   Discrete Mathematics · Engineering Mathematics · Aptitude
 *
 * The questions below are real GATE PYQs, included as working samples so
 * every screen is testable end to end. Replace or extend them freely.
 */

import type { Question, TestDefinition } from "../../test-types"

export const QUESTIONS: Question[] = [
  /* ---------------------------- Algorithms ---------------------------- */
  {
    id: "algo-001",
    subject: "Algorithms",
    topic: "Asymptotic complexity",
    type: "MCQ",
    marks: 1,
    text: "Consider the following recurrence relation. What is the asymptotic tight bound for T(n)?",
    code: "T(n) = 2T(n/2) + n\nT(1) = 1",
    options: ["Θ(n)", "Θ(n log n)", "Θ(n²)", "Θ(log n)"],
    answer: 1,
    explanation:
      "This is Case 2 of the Master Theorem: a = 2, b = 2, so n^(log_b a) = n^1 = n. Since f(n) = n = Θ(n^(log_b a)), the result is Θ(n log n). This is exactly the merge sort recurrence.",
    source: "GATE CS, standard recurrence",
    expectedSeconds: 60,
  },
  {
    id: "algo-002",
    subject: "Algorithms",
    topic: "Greedy algorithms",
    type: "MSQ",
    marks: 2,
    text: "Which of the following statements about minimum spanning trees (MST) of a connected, weighted, undirected graph are TRUE?",
    options: [
      "If all edge weights are distinct, the MST is unique.",
      "The MST always contains the globally lightest edge of the graph.",
      "An MST always contains the shortest path between every pair of vertices.",
      "If every edge weight is increased by the same constant c, the MST remains an MST.",
    ],
    answer: [0, 1, 3],
    explanation:
      "Distinct weights force a unique MST, so (A) is true. The lightest edge is always safe by the cut property, so (B) is true. (C) is false — MSTs minimise total weight, not pairwise distances; a path in the MST can be longer than the true shortest path. (D) is true because adding c to every edge shifts all spanning trees by exactly (V-1)·c, preserving the ordering.",
    source: "GATE CS, MST properties",
    expectedSeconds: 150,
  },
  {
    id: "algo-003",
    subject: "Algorithms",
    topic: "Dynamic programming",
    type: "NAT",
    marks: 2,
    text: "Consider the 0/1 knapsack problem with capacity W = 10 and the four items listed below (value, weight). What is the maximum total value achievable?",
    code: "item 1: value 10, weight 5\nitem 2: value 40, weight 4\nitem 3: value 30, weight 6\nitem 4: value 50, weight 3",
    answer: 90,
    explanation:
      "Take items 2 and 4: weight 4 + 3 = 7 ≤ 10, value 40 + 50 = 90. Adding item 1 needs weight 5 (total 12 > 10) and adding item 3 needs 6 (total 13 > 10), so neither fits. 90 is optimal.",
    source: "GATE CS, DP standard",
    expectedSeconds: 150,
  },

  /* -------------------------- Data Structures -------------------------- */
  {
    id: "ds-001",
    subject: "Data Structures",
    topic: "Trees",
    type: "NAT",
    marks: 1,
    text: "What is the maximum number of nodes in a binary tree of height 5? (Take the height of a single-node tree to be 0.)",
    answer: 63,
    explanation: "A perfect binary tree of height h has 2^(h+1) − 1 nodes. For h = 5: 2^6 − 1 = 64 − 1 = 63.",
    source: "GATE CS, tree fundamentals",
    expectedSeconds: 45,
  },
  {
    id: "ds-002",
    subject: "Data Structures",
    topic: "Hashing",
    type: "MCQ",
    marks: 2,
    text: "A hash table of size 10 uses open addressing with linear probing and the hash function h(k) = k mod 10. The keys 12, 22, 32 are inserted in that order into an initially empty table. Which slot does key 32 occupy?",
    options: ["2", "3", "4", "It cannot be inserted"],
    answer: 2,
    explanation:
      "12 mod 10 = 2, so 12 goes to slot 2. 22 mod 10 = 2 which is occupied, so linear probing places it in slot 3. 32 mod 10 = 2 is occupied, slot 3 is occupied, so it lands in slot 4.",
    source: "GATE CS, hashing",
    expectedSeconds: 90,
  },

  /* ------------------------- Operating Systems ------------------------- */
  {
    id: "os-001",
    subject: "Operating Systems",
    topic: "CPU scheduling",
    type: "NAT",
    marks: 2,
    text: "Four processes arrive at time 0 in the order P1, P2, P3, P4 with CPU burst times 8, 4, 9, 5 milliseconds. Under Shortest Job First (non-preemptive) scheduling, what is the average waiting time in milliseconds?",
    answer: 7.75,
    explanation:
      "SJF order is P2 (4), P4 (5), P1 (8), P3 (9). Waiting times: P2 = 0, P4 = 4, P1 = 9, P3 = 17. Average = (0 + 4 + 9 + 17) / 4 = 30 / 4 = 7.75 ms.",
    source: "GATE CS, scheduling",
    expectedSeconds: 150,
  },
  {
    id: "os-002",
    subject: "Operating Systems",
    topic: "Deadlock",
    type: "MSQ",
    marks: 1,
    text: "Which of the following are necessary conditions for a deadlock to occur?",
    options: ["Mutual exclusion", "Hold and wait", "Preemption of resources", "Circular wait"],
    answer: [0, 1, 3],
    explanation:
      "Coffman's four necessary conditions are mutual exclusion, hold and wait, no preemption, and circular wait. Option (C) states preemption, which is the negation of the actual condition, so it is not required — in fact allowing preemption helps prevent deadlock.",
    source: "GATE CS, deadlock conditions",
    expectedSeconds: 60,
  },

  /* -------------------------------- DBMS -------------------------------- */
  {
    id: "dbms-001",
    subject: "DBMS",
    topic: "Normalization",
    type: "MCQ",
    marks: 2,
    text: "Consider relation R(A, B, C, D) with functional dependencies A → B, B → C and C → D. What is the highest normal form R satisfies, given A is the only candidate key?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    answer: 1,
    explanation:
      "A is the sole candidate key, so there are no partial dependencies on a composite key — R is in 2NF. But B → C and C → D are transitive dependencies where the determinants (B, C) are non-prime attributes, which violates 3NF. So the highest normal form is 2NF.",
    source: "GATE CS, normalization",
    expectedSeconds: 150,
  },
  {
    id: "dbms-002",
    subject: "DBMS",
    topic: "SQL",
    type: "NAT",
    marks: 1,
    text: "A relation Employee has 12 tuples and a relation Department has 5 tuples. How many tuples does the result of the Cartesian product Employee × Department contain?",
    answer: 60,
    explanation: "A Cartesian product pairs every tuple of the first relation with every tuple of the second: 12 × 5 = 60.",
    source: "GATE CS, relational algebra",
    expectedSeconds: 30,
  },

  /* --------------------------- Computer Networks --------------------------- */
  {
    id: "cn-001",
    subject: "Computer Networks",
    topic: "IP addressing",
    type: "NAT",
    marks: 2,
    text: "An organisation is granted the block 200.1.1.0/24 and needs to create subnets of 30 usable hosts each. How many such subnets can be created?",
    answer: 8,
    explanation:
      "30 usable hosts needs 32 addresses (30 + network + broadcast), which is 2^5, so 5 host bits and a /27 mask. Going from /24 to /27 borrows 3 bits, giving 2^3 = 8 subnets.",
    source: "GATE CS, subnetting",
    expectedSeconds: 150,
  },
  {
    id: "cn-002",
    subject: "Computer Networks",
    topic: "Transport layer",
    type: "MCQ",
    marks: 1,
    text: "Which of the following is NOT a feature provided by UDP?",
    options: ["Checksum for error detection", "Reliable in-order delivery", "Port-based multiplexing", "Connectionless datagram service"],
    answer: 1,
    explanation:
      "UDP is connectionless and unreliable — it provides no sequencing, acknowledgement or retransmission, so in-order reliable delivery is a TCP feature. UDP does carry an optional checksum and does multiplex via port numbers.",
    source: "GATE CS, transport layer",
    expectedSeconds: 45,
  },

  /* ------------------------ Theory of Computation ------------------------ */
  {
    id: "toc-001",
    subject: "Theory of Computation",
    topic: "Regular languages",
    type: "MCQ",
    marks: 2,
    text: "Which of the following languages over Σ = {a, b} is NOT regular?",
    options: [
      "Strings containing an even number of a's",
      "Strings of the form aⁿbⁿ where n ≥ 1",
      "Strings ending in 'ab'",
      "Strings whose length is divisible by 3",
    ],
    answer: 1,
    explanation:
      "aⁿbⁿ requires counting an unbounded number of a's to match against the b's, which a finite automaton cannot do — it is context-free but not regular, provable via the pumping lemma. The other three are all recognisable by finite automata with a bounded number of states.",
    source: "GATE CS, regular languages",
    expectedSeconds: 120,
  },
  {
    id: "toc-002",
    subject: "Theory of Computation",
    topic: "Undecidability",
    type: "MSQ",
    marks: 2,
    text: "Which of the following problems are undecidable?",
    options: [
      "Whether a given Turing machine halts on a given input",
      "Whether a given DFA accepts the empty language",
      "Whether two given context-free grammars generate the same language",
      "Whether a given CFG generates any string at all",
    ],
    answer: [0, 2],
    explanation:
      "The halting problem (A) is the canonical undecidable problem. CFG equivalence (C) is also undecidable. DFA emptiness (B) is decidable by reachability search, and CFG emptiness (D) is decidable by checking whether the start symbol is generating.",
    source: "GATE CS, decidability",
    expectedSeconds: 150,
  },

  /* --------------------------- Compiler Design --------------------------- */
  {
    id: "cd-001",
    subject: "Compiler Design",
    topic: "Parsing",
    type: "MCQ",
    marks: 1,
    text: "Which phase of a compiler is responsible for detecting a type mismatch such as assigning a string to an integer variable?",
    options: ["Lexical analysis", "Syntax analysis", "Semantic analysis", "Code generation"],
    answer: 2,
    explanation:
      "Type checking is a semantic property — it cannot be expressed by a context-free grammar, so the parser will not catch it. Semantic analysis walks the syntax tree with the symbol table and enforces type rules.",
    source: "GATE CS, compiler phases",
    expectedSeconds: 45,
  },

  /* ----------------------------- Digital Logic ----------------------------- */
  {
    id: "dl-001",
    subject: "Digital Logic",
    topic: "Number systems",
    type: "NAT",
    marks: 1,
    text: "What is the decimal equivalent of the 8-bit two's complement number 11110110?",
    answer: -10,
    explanation:
      "The leading bit is 1, so the value is negative. Invert: 00001001, add 1: 00001010 = 10. Therefore the original number is −10.",
    source: "GATE CS, number systems",
    expectedSeconds: 60,
  },
  {
    id: "dl-002",
    subject: "Digital Logic",
    topic: "Boolean algebra",
    type: "MCQ",
    marks: 1,
    text: "The Boolean expression F = A·B + A·B' simplifies to:",
    options: ["A", "B", "A + B", "A·B"],
    answer: 0,
    explanation: "Factor out A: F = A·(B + B') = A·1 = A. The value of B is irrelevant to the output.",
    source: "GATE CS, Boolean simplification",
    expectedSeconds: 30,
  },

  /* ---------------- Computer Organization & Architecture ---------------- */
  {
    id: "coa-001",
    subject: "Computer Organization & Architecture",
    topic: "Cache memory",
    type: "NAT",
    marks: 2,
    text: "A cache has a hit rate of 90%, a hit time of 2 ns and a miss penalty of 100 ns. What is the average memory access time in nanoseconds?",
    answer: 12,
    explanation: "AMAT = hit time + miss rate × miss penalty = 2 + 0.10 × 100 = 2 + 10 = 12 ns.",
    source: "GATE CS, memory hierarchy",
    expectedSeconds: 90,
  },
  {
    id: "coa-002",
    subject: "Computer Organization & Architecture",
    topic: "Pipelining",
    type: "NAT",
    marks: 2,
    text: "A 5-stage pipeline has stage delays of 150, 120, 160, 140 and 110 nanoseconds. Ignoring register overhead, what is the maximum clock frequency in MHz?",
    answer: 6.25,
    explanation:
      "The clock period is set by the slowest stage: 160 ns. Frequency = 1 / 160 ns = 6.25 × 10^6 Hz = 6.25 MHz.",
    source: "GATE CS, pipelining",
    expectedSeconds: 120,
  },

  /* ------------------------- Discrete Mathematics ------------------------- */
  {
    id: "dm-001",
    subject: "Discrete Mathematics",
    topic: "Combinatorics",
    type: "NAT",
    marks: 1,
    text: "How many distinct arrangements can be made from the letters of the word 'LEVEL'?",
    answer: 30,
    explanation:
      "LEVEL has 5 letters with L repeated twice and E repeated twice. Arrangements = 5! / (2! · 2!) = 120 / 4 = 30.",
    source: "GATE CS, permutations",
    expectedSeconds: 60,
  },
  {
    id: "dm-002",
    subject: "Discrete Mathematics",
    topic: "Graph theory",
    type: "MCQ",
    marks: 2,
    text: "A simple connected undirected graph has 10 vertices and every vertex has degree 3. How many edges does it have?",
    options: ["12", "15", "20", "30"],
    answer: 1,
    explanation:
      "By the handshaking lemma, the sum of degrees equals twice the number of edges: 10 × 3 = 30 = 2E, so E = 15.",
    source: "GATE CS, graph theory",
    expectedSeconds: 60,
  },

  /* ------------------------ Engineering Mathematics ------------------------ */
  {
    id: "em-001",
    subject: "Engineering Mathematics",
    topic: "Linear algebra",
    type: "NAT",
    marks: 2,
    text: "What is the determinant of the matrix below?",
    code: "| 2  1  0 |\n| 1  3  1 |\n| 0  1  2 |",
    answer: 8,
    explanation:
      "Expanding along the first row: 2·(3·2 − 1·1) − 1·(1·2 − 1·0) + 0 = 2·(6 − 1) − 1·(2) = 10 − 2 = 8.",
    source: "GATE CS, linear algebra",
    expectedSeconds: 120,
  },
  {
    id: "em-002",
    subject: "Engineering Mathematics",
    topic: "Probability",
    type: "NAT",
    marks: 1,
    text: "Two fair six-sided dice are rolled. What is the probability that the sum equals 7? Express your answer as a decimal rounded to 3 places.",
    answer: { min: 0.166, max: 0.167 },
    explanation:
      "There are 6 favourable outcomes for a sum of 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). Total outcomes = 36. Probability = 6/36 = 1/6 ≈ 0.167.",
    source: "GATE CS, probability",
    expectedSeconds: 60,
  },

  /* -------------------------------- Aptitude -------------------------------- */
  {
    id: "apt-001",
    subject: "Aptitude",
    topic: "Quantitative aptitude",
    type: "MCQ",
    marks: 1,
    text: "A train travels 60 km at 30 km/h and the next 60 km at 60 km/h. What is its average speed for the entire journey?",
    options: ["40 km/h", "45 km/h", "48 km/h", "50 km/h"],
    answer: 0,
    explanation:
      "Total distance = 120 km. Total time = 60/30 + 60/60 = 2 + 1 = 3 hours. Average speed = 120/3 = 40 km/h. Note this is the harmonic mean, not the arithmetic mean of 45.",
    source: "GATE, quantitative aptitude",
    expectedSeconds: 60,
  },
  {
    id: "apt-002",
    subject: "Aptitude",
    topic: "Logical reasoning",
    type: "MCQ",
    marks: 2,
    text: "In a certain code, 'MOUSE' is written as 'NPVTF'. How would 'TIGER' be written in the same code?",
    options: ["UJHFS", "UJGFS", "SHFDQ", "UKHFS"],
    answer: 0,
    explanation:
      "Each letter shifts forward by one position: M→N, O→P, U→V, S→T, E→F. Applying the same shift to TIGER: T→U, I→J, G→H, E→F, R→S, giving UJHFS.",
    source: "GATE, verbal reasoning",
    expectedSeconds: 90,
  },
]

/* ------------------------------------------------------------------ *
 * TESTS — group questions into papers.
 * ------------------------------------------------------------------ */

const bySubject = (subject: string) => QUESTIONS.filter((q) => q.subject === subject).map((q) => q.id)

export const TESTS: TestDefinition[] = [
  {
    id: "mock-full-01",
    title: "Full Mock Test 01",
    kind: "mock",
    durationMinutes: 180,
    description:
      "Full-length paper spanning every subject in the GATE CSE syllabus, mirroring the real exam's mix of MCQ, MSQ and NAT questions with GATE negative marking.",
    questionIds: QUESTIONS.map((q) => q.id),
  },
  {
    id: "subj-algorithms",
    title: "Algorithms Drill",
    kind: "subject",
    subject: "Algorithms",
    durationMinutes: 20,
    description: "Recurrences, greedy correctness and dynamic programming — the highest priority-score chapters.",
    questionIds: bySubject("Algorithms"),
  },
  {
    id: "subj-programming-data-structures",
    title: "Data Structures Drill",
    kind: "subject",
    subject: "Data Structures",
    durationMinutes: 15,
    description: "Trees and hashing fundamentals that feed directly into the Algorithms section.",
    questionIds: bySubject("Data Structures"),
  },
  {
    id: "subj-operating-systems",
    title: "Operating Systems Drill",
    kind: "subject",
    subject: "Operating Systems",
    durationMinutes: 15,
    description: "Scheduling arithmetic and deadlock conditions — reliably 8 to 10 marks every year.",
    questionIds: bySubject("Operating Systems"),
  },
  {
    id: "subj-databases",
    title: "DBMS Drill",
    kind: "subject",
    subject: "DBMS",
    durationMinutes: 15,
    description: "Normal forms and relational algebra, the two areas that dominate DBMS scoring.",
    questionIds: bySubject("DBMS"),
  },
  {
    id: "subj-computer-networks",
    title: "Computer Networks Drill",
    kind: "subject",
    subject: "Computer Networks",
    durationMinutes: 15,
    description: "Subnetting calculations and transport-layer guarantees.",
    questionIds: bySubject("Computer Networks"),
  },
  {
    id: "subj-theory-of-computation",
    title: "Theory of Computation Drill",
    kind: "subject",
    subject: "Theory of Computation",
    durationMinutes: 15,
    description: "Regularity proofs and the decidability boundary — high conceptual depth, high payoff.",
    questionIds: bySubject("Theory of Computation"),
  },
  {
    id: "subj-digital-logic",
    title: "Digital Logic Drill",
    kind: "subject",
    subject: "Digital Logic",
    durationMinutes: 10,
    description: "Number systems and Boolean simplification — the cheapest marks in the paper.",
    questionIds: bySubject("Digital Logic"),
  },
  {
    id: "subj-computer-organization",
    title: "COA Drill",
    kind: "subject",
    subject: "Computer Organization & Architecture",
    durationMinutes: 15,
    description: "Cache AMAT and pipeline throughput, both pure formula application.",
    questionIds: bySubject("Computer Organization & Architecture"),
  },
  {
    id: "subj-discrete-mathematics",
    title: "Discrete Mathematics Drill",
    kind: "subject",
    subject: "Discrete Mathematics",
    durationMinutes: 15,
    description: "Counting and graph theory, the backbone of the maths section.",
    questionIds: bySubject("Discrete Mathematics"),
  },
  {
    id: "subj-engineering-mathematics",
    title: "Engineering Mathematics Drill",
    kind: "subject",
    subject: "Engineering Mathematics",
    durationMinutes: 15,
    description: "Determinants and basic probability.",
    questionIds: bySubject("Engineering Mathematics"),
  },
  {
    id: "subj-general-aptitude",
    title: "Aptitude Drill",
    kind: "subject",
    subject: "Aptitude",
    durationMinutes: 10,
    description: "15 marks of the paper for a fraction of the study time. Never skip this.",
    questionIds: bySubject("Aptitude"),
  },
  {
    id: "subj-compiler-design",
    title: "Compiler Design Drill",
    kind: "subject",
    subject: "Compiler Design",
    durationMinutes: 10,
    description: "Parsing, syntax-directed translation, and liveness analysis.",
    questionIds: bySubject("Compiler Design"),
  },
] satisfies TestDefinition[]

/* ------------------------------ lookups ------------------------------ */

export const QUESTION_MAP = new Map(QUESTIONS.map((q) => [q.id, q]))

export function getTest(id: string): TestDefinition | undefined {
  return TESTS.find((t) => t.id === id)
}

export function getQuestions(test: TestDefinition): Question[] {
  return test.questionIds.map((id) => QUESTION_MAP.get(id)).filter((q): q is Question => Boolean(q))
}

export function testMarks(test: TestDefinition): number {
  return getQuestions(test).reduce((s, q) => s + q.marks, 0)
}
