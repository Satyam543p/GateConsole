/**
 * lib/exams/gate-cse/concepts.ts
 *
 * Real, curated concept graph for all 12 GATE CSE subjects with genuine
 * prerequisite edges, LaTeX formulas, time/space complexities, common traps,
 * and PYQ mappings.
 */

import type { Concept } from "@/lib/domain/types"

export const CONCEPTS: Concept[] = [
  // ─── ALGORITHMS ─────────────────────────────────────────────────────────────
  {
    id: "c-daa-asymptotic-notations",
    subjectId: "Algorithms",
    chapterId: "daa-asymptotic-analysis",
    label: "Asymptotic Notations (O, Ω, Θ, o, ω)",
    kind: "definition",
    summary: "O = upper bound (worst case ceiling), Ω = lower bound (best case floor), Θ = tight bound (both hold with different constants), o/ω are strict (non-tight) versions. Θ(g(n)) means f(n) is sandwiched: c1·g(n) ≤ f(n) ≤ c2·g(n) for n ≥ n0.",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "O(n) is an upper bound on GROWTH RATE, not literally 'worst case' — a Θ(n) algorithm is also O(n) and O(n²); GATE tests whether you know O is not tight.",
      "f(n) = Θ(g(n)) requires the SAME n0 and DIFFERENT positive constants c1, c2 for both bounds to hold simultaneously.",
      "log(n!) = Θ(n log n) — a classic trap in complexity comparison MCQs, derived via Stirling's approximation."
    ],
    pyqIds: ["gate-cse:daa:asymptotic:001", "gate-cse:daa:asymptotic:002"]
  },
  {
    id: "c-daa-recurrence-master",
    subjectId: "Algorithms",
    chapterId: "daa-recurrence-relations",
    label: "Master Theorem",
    kind: "theorem",
    summary: "For T(n) = aT(n/b) + f(n), a≥1, b>1: compare f(n) to n^(log_b a). Case 1: f(n) = O(n^(log_b a - ε)) → T(n) = Θ(n^(log_b a)). Case 2: f(n) = Θ(n^(log_b a)) → T(n) = Θ(n^(log_b a) · log n). Case 3: f(n) = Ω(n^(log_b a + ε)) AND regularity condition a·f(n/b) ≤ c·f(n) holds → T(n) = Θ(f(n)).",
    formula: "T(n) = aT\\left(\\frac{n}{b}\\right) + f(n)",
    prerequisites: ["c-daa-asymptotic-notations"],
    examRelevance: 5,
    commonTraps: [
      "Master theorem does NOT apply when a < 1, b ≤ 1, or f(n) is not polynomial-comparable (e.g. T(n) = 2T(n/2) + n/log n has a gap between cases and needs the Akra-Bazzi method or substitution instead).",
      "Case 2 has a generalized form: if f(n) = Θ(n^(log_b a) · log^k n) for k ≥ 0, then T(n) = Θ(n^(log_b a) · log^(k+1) n) — students often only memorize k=0.",
      "Case 3 REQUIRES the regularity condition, not just the polynomial gap — GATE has asked trick questions where this condition silently fails."
    ],
    pyqIds: ["gate-cse:daa:recurrence:001", "gate-cse:daa:recurrence:003"]
  },
  {
    id: "c-daa-recurrence-substitution",
    subjectId: "Algorithms",
    chapterId: "daa-recurrence-relations",
    label: "Substitution Method",
    kind: "technique",
    summary: "Guess the closed-form solution, then prove it by mathematical induction (verify base case, assume for n/b or n-1, prove for n). Used when Master theorem doesn't apply cleanly.",
    prerequisites: ["c-daa-recurrence-master"],
    examRelevance: 3,
    commonTraps: [
      "A common mistake: proving T(n) ≤ c·n by induction but forgetting the '-d' slack term needed to absorb lower-order additive constants — the induction breaks without it."
    ],
    pyqIds: []
  },
  {
    id: "c-daa-recurrence-recursion-tree",
    subjectId: "Algorithms",
    chapterId: "daa-recurrence-relations",
    label: "Recursion Tree Method",
    kind: "technique",
    summary: "Expand the recurrence into a tree; sum the work done at each level. Total cost = sum over all levels of (number of nodes at level × cost per node). Useful for guessing the answer before formally proving via substitution.",
    prerequisites: ["c-daa-recurrence-master"],
    examRelevance: 3,
    commonTraps: [
      "For unbalanced recursion trees (e.g., T(n) = T(n/3) + T(2n/3) + n), the tree depth differs along different root-to-leaf paths — the longest path (log_{3/2} n) determines when leaves stop, not the shortest."
    ],
    pyqIds: []
  },
  {
    id: "c-daa-quicksort",
    subjectId: "Algorithms",
    chapterId: "daa-sorting",
    label: "Quicksort",
    kind: "algorithm",
    summary: "Divide-and-conquer, in-place, NOT stable. Pick a pivot, partition array around it (elements < pivot left, > pivot right), recurse on both halves. Randomized/median-of-3 pivot selection avoids worst case on sorted input.",
    complexity: "O(n log n) average, O(n²) worst",
    formula: "T(n) = T(k) + T(n-k-1) + \\Theta(n)",
    prerequisites: ["c-daa-recurrence-master"],
    examRelevance: 5,
    commonTraps: [
      "Worst case O(n²) happens when partition is maximally unbalanced (already-sorted array with first/last element as pivot) — each partition step only removes ONE element.",
      "Quicksort is NOT stable by default (Mergesort is) — GATE frequently tests stability comparisons across sorting algorithms in a single MCQ.",
      "Space complexity is O(log n) average (recursion stack for balanced partitions) but O(n) worst case — not O(1), a very common misconception since it sorts 'in-place'."
    ],
    pyqIds: ["gate-cse:daa:sorting:001", "gate-cse:daa:sorting:004"]
  },
  {
    id: "c-daa-mergesort",
    subjectId: "Algorithms",
    chapterId: "daa-sorting",
    label: "Merge Sort",
    kind: "algorithm",
    summary: "Divide-and-conquer, STABLE, not in-place. Split array in half, recursively sort both halves, merge two sorted halves in linear time using an auxiliary array.",
    complexity: "O(n log n) worst, average, and best case",
    formula: "T(n) = 2T\\left(\\frac{n}{2}\\right) + \\Theta(n)",
    prerequisites: ["c-daa-recurrence-master"],
    examRelevance: 5,
    commonTraps: [
      "Space complexity is O(n), NOT O(log n) — only the recursion stack is O(log n); the auxiliary merge array dominates at O(n). GATE options often plant O(log n) as a trap.",
      "Merge sort's O(n log n) holds in ALL cases (best/avg/worst) — unlike quicksort, there's no degenerate input that worsens it."
    ],
    pyqIds: ["gate-cse:daa:sorting:002"]
  },
  {
    id: "c-daa-heapsort",
    subjectId: "Algorithms",
    chapterId: "daa-sorting",
    label: "Heap Sort",
    kind: "algorithm",
    summary: "Build a max-heap from the array (O(n), not O(n log n)), then repeatedly extract the max (swap root with last element, reduce heap size, heapify down) n times. In-place, NOT stable.",
    complexity: "O(n log n) worst, average, best; O(1) auxiliary space",
    prerequisites: ["c-daa-quicksort"],
    examRelevance: 4,
    commonTraps: [
      "Build-heap is O(n), NOT O(n log n) — a very classic GATE trap. The naive per-node bound of O(log n) × n nodes is loose; the tight analysis via summing heights gives Θ(n).",
      "Heap sort is in-place with O(1) auxiliary space, unlike merge sort — but it is NOT stable, unlike merge sort. Students frequently swap these two facts."
    ],
    pyqIds: ["gate-cse:daa:sorting:005"]
  },
  {
    id: "c-daa-counting-sort",
    subjectId: "Algorithms",
    chapterId: "daa-sorting",
    label: "Counting Sort / Radix Sort",
    kind: "algorithm",
    summary: "Counting sort: non-comparison sort, counts occurrences of each key value (range k), computes prefix sums for positions, is stable. Radix sort applies counting sort digit-by-digit (LSD to MSD) for d-digit numbers.",
    complexity: "Counting sort: O(n+k); Radix sort: O(d(n+k))",
    prerequisites: [],
    examRelevance: 4,
    commonTraps: [
      "Counting sort is only efficient when k = O(n); if the key range k is large (e.g., k = n²), it degrades badly — GATE tests this range dependency.",
      "Counting sort MUST be implemented with a stable inner pass (iterating output construction in reverse) for radix sort to work correctly — an unstable counting sort breaks radix sort's correctness entirely."
    ],
    pyqIds: ["gate-cse:daa:sorting:006"]
  },
  {
    id: "c-daa-lower-bound-sorting",
    subjectId: "Algorithms",
    chapterId: "daa-sorting",
    label: "Lower Bound for Comparison Sorting",
    kind: "theorem",
    summary: "Any comparison-based sorting algorithm requires Ω(n log n) comparisons in the worst case. Proof: decision tree has n! leaves (one per permutation), a binary tree with n! leaves needs height ≥ log₂(n!) = Θ(n log n).",
    formula: "\\log_2(n!) = \\Theta(n \\log n)",
    prerequisites: ["c-daa-asymptotic-notations"],
    examRelevance: 4,
    commonTraps: [
      "This lower bound applies ONLY to comparison-based sorts. Counting/Radix/Bucket sort beat O(n log n) because they use key values directly (non-comparison), not because the theorem is wrong."
    ],
    pyqIds: ["gate-cse:daa:sorting:007"]
  },
  {
    id: "c-daa-binary-search",
    subjectId: "Algorithms",
    chapterId: "daa-searching",
    label: "Binary Search",
    kind: "algorithm",
    summary: "On a sorted array, repeatedly compare target to the middle element and discard the half that can't contain it. Requires random access (arrays, not linked lists).",
    complexity: "O(log n)",
    formula: "T(n) = T\\left(\\frac{n}{2}\\right) + \\Theta(1)",
    prerequisites: ["c-daa-recurrence-master"],
    examRelevance: 5,
    commonTraps: [
      "Boundary logic is the #1 source of bugs: using `low <= high` vs `low < high`, and `mid = low + (high-low)/2` to avoid overflow, changes whether the loop terminates correctly and whether the last element is checked — verify inclusive vs exclusive bounds explicitly for every variant (search, first/last occurrence, insertion point)."
    ],
    pyqIds: ["gate-cse:daa:searching:001"]
  },
  {
    id: "c-daa-selection-median",
    subjectId: "Algorithms",
    chapterId: "daa-searching",
    label: "Median of Medians (Selection in Linear Time)",
    kind: "algorithm",
    summary: "Finds the k-th smallest element in worst-case linear time. Divide into groups of 5, find median of each group, recursively find median of medians as pivot, partition, recurse into only the relevant side.",
    complexity: "O(n) worst case (vs O(n) average for randomized quickselect, but O(n²) quickselect worst case)",
    formula: "T(n) = T\\left(\\frac{n}{5}\\right) + T\\left(\\frac{7n}{10}\\right) + \\Theta(n)",
    prerequisites: ["c-daa-recurrence-recursion-tree", "c-daa-quicksort"],
    examRelevance: 2,
    commonTraps: [
      "Group size of 5 is the minimum that makes 7n/10 < n strictly enough for the recurrence to solve to O(n) — groups of 3 give a recurrence that does NOT resolve to linear time."
    ],
    pyqIds: []
  },
  {
    id: "c-daa-dc-general",
    subjectId: "Algorithms",
    chapterId: "daa-divide-and-conquer",
    label: "Divide and Conquer — General Paradigm",
    kind: "technique",
    summary: "Break problem into smaller subproblems of the SAME type, solve recursively, combine solutions. Requires: subproblems independent (no overlap, unlike DP), a base case, and an efficient combine step.",
    prerequisites: ["c-daa-recurrence-master"],
    examRelevance: 3,
    commonTraps: [
      "The key distinguishing feature vs DP is INDEPENDENT subproblems — if subproblems overlap, naive D&C recomputes shared work exponentially (classic example: naive recursive Fibonacci is D&C-structured but exponential; memoizing it converts it to DP)."
    ],
    pyqIds: []
  },
  {
    id: "c-daa-strassen",
    subjectId: "Algorithms",
    chapterId: "daa-divide-and-conquer",
    label: "Strassen's Matrix Multiplication",
    kind: "algorithm",
    summary: "Multiplies two n×n matrices using 7 multiplications instead of 8 (naive divide-and-conquer) per recursive step, trading multiplications for extra additions.",
    complexity: "O(n^2.81) via T(n) = 7T(n/2) + Θ(n²)",
    formula: "n^{\\log_2 7} \\approx n^{2.81}",
    prerequisites: ["c-daa-recurrence-master"],
    examRelevance: 3,
    commonTraps: [
      "Naive divide-and-conquer matrix multiplication (8 recursive calls) gives T(n)=8T(n/2)+Θ(n²)=Θ(n³) — SAME as the iterative triple loop, no asymptotic improvement. Strassen's saving comes specifically from reducing 8→7 multiplications via the Master theorem's log_b(a) term."
    ],
    pyqIds: ["gate-cse:daa:dc:001"]
  },
  {
    id: "c-daa-greedy-general",
    subjectId: "Algorithms",
    chapterId: "daa-greedy",
    label: "Greedy Algorithms — General Paradigm",
    kind: "technique",
    summary: "Make the locally optimal choice at each step, never reconsider. Correctness requires proving the Greedy Choice Property (a locally optimal choice is part of some globally optimal solution) AND Optimal Substructure, typically via an exchange argument.",
    prerequisites: [],
    examRelevance: 4,
    commonTraps: [
      "Greedy does NOT work for all optimization problems — 0/1 Knapsack has no greedy solution (fractional Knapsack does), which is a favorite GATE conceptual trap: same-sounding problem, different paradigm needed."
    ],
    pyqIds: ["gate-cse:daa:greedy:001"]
  },
  {
    id: "c-daa-kruskal",
    subjectId: "Algorithms",
    chapterId: "daa-greedy",
    label: "Kruskal's Algorithm (MST)",
    kind: "algorithm",
    summary: "Sort all edges by weight ascending. Greedily add each edge to the MST if it doesn't form a cycle with already-chosen edges (checked via Union-Find/DSU). Works well on sparse graphs.",
    complexity: "O(E log E) = O(E log V), dominated by sorting; Union-Find ops are near O(1) amortized with path compression + union by rank",
    prerequisites: ["c-daa-greedy-general"],
    examRelevance: 5,
    commonTraps: [
      "Kruskal's builds a forest that merges into a tree — it does NOT require the graph to stay connected during intermediate steps, unlike Prim's which grows one connected tree.",
      "If edge weights are not distinct, MULTIPLE valid MSTs can exist with the same total weight — GATE questions sometimes ask 'is the MST unique' which depends on distinct edge weights, not on the algorithm used."
    ],
    pyqIds: ["gate-cse:daa:greedy:002", "gate-cse:daa:greedy:005"]
  },
  {
    id: "c-daa-prim",
    subjectId: "Algorithms",
    chapterId: "daa-greedy",
    label: "Prim's Algorithm (MST)",
    kind: "algorithm",
    summary: "Start from any vertex, greedily grow a single connected tree by always adding the minimum-weight edge that connects a tree vertex to a non-tree vertex. Implemented with a priority queue (min-heap).",
    complexity: "O(E log V) with binary heap, O(V²) with adjacency matrix + array (better for dense graphs), O(E + V log V) with Fibonacci heap",
    prerequisites: ["c-daa-greedy-general"],
    examRelevance: 5,
    commonTraps: [
      "For DENSE graphs (E close to V²), the O(V²) array-based implementation is actually FASTER than the O(E log V) heap-based one — GATE tests whether you pick the right implementation based on graph density, not just memorize one complexity.",
      "Prim's, like Kruskal's, fails to find correct results with NEGATIVE edge weights in the sense of producing a wrong-looking answer — actually both still work correctly with negative weights (MST is about total minimum weight, not shortest paths); this is a commonly confused non-trap that GATE has tested by contrast with Dijkstra which genuinely fails."
    ],
    pyqIds: ["gate-cse:daa:greedy:003"]
  },
  {
    id: "c-daa-huffman",
    subjectId: "Algorithms",
    chapterId: "daa-greedy",
    label: "Huffman Coding",
    kind: "algorithm",
    summary: "Builds an optimal prefix-free binary code minimizing expected encoded length. Repeatedly extract the two lowest-frequency nodes, merge into a new node with combined frequency, insert back, until one tree remains.",
    complexity: "O(n log n) using a min-heap",
    prerequisites: ["c-daa-greedy-general"],
    examRelevance: 4,
    commonTraps: [
      "Huffman codes are prefix-free (no code is a prefix of another) which guarantees unique decodability — but they are NOT necessarily unique themselves when frequency ties occur (different tie-breaking gives different but equally optimal trees), so 'the' Huffman code for a given input can vary in exact bit-pattern while total encoded length stays optimal."
    ],
    pyqIds: ["gate-cse:daa:greedy:004"]
  },
  {
    id: "c-daa-dijkstra",
    subjectId: "Algorithms",
    chapterId: "daa-greedy",
    label: "Dijkstra's Shortest Path",
    kind: "algorithm",
    summary: "Single-source shortest path for non-negative edge weights. Greedily picks the unvisited vertex with minimum tentative distance, relaxes its outgoing edges. Requires all edge weights ≥ 0 to guarantee correctness.",
    complexity: "O((V+E) log V) with a binary min-heap, O(V²) with array-based implementation",
    prerequisites: ["c-daa-greedy-general", "c-daa-prim"],
    examRelevance: 5,
    commonTraps: [
      "Dijkstra's FAILS with negative edge weights — once a vertex is finalized (popped from the queue), it's never revisited, but a later negative edge could still offer a shorter path. This is the single most-repeated GATE trap regarding Dijkstra.",
      "Dijkstra's does NOT detect negative cycles at all — for that, Bellman-Ford is required; conflating 'fails with negative weights' with 'detects negative cycles' is a common student error since Dijkstra does neither correctly."
    ],
    pyqIds: ["gate-cse:daa:greedy:006", "gate-cse:daa:greedy:007"]
  },
  {
    id: "c-daa-activity-selection",
    subjectId: "Algorithms",
    chapterId: "daa-greedy",
    label: "Activity Selection / Interval Scheduling",
    kind: "algorithm",
    summary: "Given activities with start/finish times, select the maximum number of non-overlapping activities. Greedy rule: always pick the activity with the EARLIEST FINISH TIME among remaining compatible ones. Sort by finish time, O(n log n).",
    complexity: "O(n log n)",
    prerequisites: ["c-daa-greedy-general"],
    examRelevance: 3,
    commonTraps: [
      "Sorting by earliest START time (instead of finish time) does NOT yield the optimal greedy solution — this is a classic wrong-heuristic trap GATE uses to distinguish rote memorization from actual understanding of the exchange argument."
    ],
    pyqIds: []
  },
  {
    id: "c-daa-dp-general",
    subjectId: "Algorithms",
    chapterId: "daa-dynamic-programming",
    label: "Dynamic Programming — General Paradigm",
    kind: "technique",
    summary: "Applicable when a problem has (1) Optimal Substructure — optimal solution built from optimal solutions to subproblems, and (2) Overlapping Subproblems — the same subproblems recur. Solve via top-down memoization or bottom-up tabulation.",
    prerequisites: ["c-daa-dc-general"],
    examRelevance: 5,
    commonTraps: [
      "Optimal substructure alone is NOT sufficient to justify DP over plain D&C — without overlapping subproblems (e.g., standard merge sort), memoization gives zero benefit, only extra memory overhead."
    ],
    pyqIds: []
  },
  {
    id: "c-daa-01knapsack",
    subjectId: "Algorithms",
    chapterId: "daa-dynamic-programming",
    label: "0/1 Knapsack",
    kind: "algorithm",
    summary: "Given items with weight/value, and capacity W, choose a subset (each item taken whole or not at all) maximizing value without exceeding W. dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt[i]] + val[i]) if wt[i] ≤ w.",
    complexity: "O(nW) time and space — PSEUDO-polynomial, since it depends on the numeric value of W, not just input size n",
    formula: "dp[i][w] = \\max(dp[i-1][w],\\ dp[i-1][w-w_i]+v_i)",
    prerequisites: ["c-daa-dp-general", "c-daa-greedy-general"],
    examRelevance: 5,
    commonTraps: [
      "0/1 Knapsack has NO correct greedy solution (unlike Fractional Knapsack) — greedy-by-value-density can fail because items can't be split, a favorite GATE trap pairing these two problems.",
      "O(nW) is pseudo-polynomial, not truly polynomial in input SIZE — if W is exponential in the number of bits used to represent it, this blows up; this distinction underlies why 0/1 Knapsack is NP-hard in general but solvable in pseudo-poly time."
    ],
    pyqIds: ["gate-cse:daa:dp:001"]
  },
  {
    id: "c-daa-lcs",
    subjectId: "Algorithms",
    chapterId: "daa-dynamic-programming",
    label: "Longest Common Subsequence (LCS)",
    kind: "algorithm",
    summary: "Given two sequences, find the length of the longest subsequence common to both (not necessarily contiguous). dp[i][j] = dp[i-1][j-1]+1 if chars match, else max(dp[i-1][j], dp[i][j-1]).",
    complexity: "O(mn) time and space (space reducible to O(min(m,n)) if only length is needed, not the actual subsequence)",
    formula: "dp[i][j] = \\begin{cases} dp[i-1][j-1]+1 & x_i = y_j \\\\ \\max(dp[i-1][j], dp[i][j-1]) & x_i \\ne y_j \\end{cases}",
    prerequisites: ["c-daa-dp-general"],
    examRelevance: 5,
    commonTraps: [
      "LCS is a SUBSEQUENCE problem (elements need not be contiguous), distinct from Longest Common SUBSTRING (must be contiguous) which has a different DP recurrence and resets to 0 on mismatch — GATE frequently swaps these terms to test careful reading."
    ],
    pyqIds: ["gate-cse:daa:dp:002"]
  },
  {
    id: "c-daa-matrix-chain",
    subjectId: "Algorithms",
    chapterId: "daa-dynamic-programming",
    label: "Matrix Chain Multiplication",
    kind: "algorithm",
    summary: "Given a chain of matrices, find the parenthesization (multiplication order) minimizing total scalar multiplications. dp[i][j] = min over split point k of dp[i][k] + dp[k+1][j] + p[i-1]·p[k]·p[j].",
    complexity: "O(n³) time, O(n²) space",
    formula: "dp[i][j] = \\min_{i \\le k < j} \\big(dp[i][k] + dp[k+1][j] + p_{i-1} p_k p_j\\big)",
    prerequisites: ["c-daa-dp-general"],
    examRelevance: 4,
    commonTraps: [
      "This DP does NOT actually perform the multiplications — it only finds the OPTIMAL ORDER (parenthesization); the actual multiplication cost of the chain regardless of order stays the same total element count, only scalar mult. count changes based on grouping."
    ],
    pyqIds: []
  },
  {
    id: "c-daa-floyd-warshall",
    subjectId: "Algorithms",
    chapterId: "daa-dynamic-programming",
    label: "Floyd-Warshall (All-Pairs Shortest Path)",
    kind: "algorithm",
    summary: "Computes shortest paths between ALL pairs of vertices. dp[k][i][j] = shortest path from i to j using only vertices {1..k} as intermediates = min(dp[k-1][i][j], dp[k-1][i][k] + dp[k-1][k][j]). Space-optimized to a single 2D matrix updated in place.",
    complexity: "O(V³) time, O(V²) space",
    formula: "d_{ij}^{(k)} = \\min\\big(d_{ij}^{(k-1)},\\ d_{ik}^{(k-1)} + d_{kj}^{(k-1)}\\big)",
    prerequisites: ["c-daa-dp-general", "c-daa-dijkstra"],
    examRelevance: 5,
    commonTraps: [
      "Handles NEGATIVE edge weights correctly (unlike Dijkstra), but NOT negative CYCLES — if a negative cycle exists, diagonal entries dp[i][i] go negative, which is used as the detection signal, but the shortest-path values themselves become meaningless/undefined for affected pairs.",
      "The order of the three nested loops MATTERS critically: k must be the OUTERMOST loop, not i or j — this is a very frequently tested implementation-correctness trap since the DP recurrence depends on k-1 layer values being fully settled before use."
    ],
    pyqIds: ["gate-cse:daa:dp:003"]
  },
  {
    id: "c-daa-bellman-ford",
    subjectId: "Algorithms",
    chapterId: "daa-dynamic-programming",
    label: "Bellman-Ford Algorithm",
    kind: "algorithm",
    summary: "Single-source shortest path, handles negative edge weights. Relax all E edges, V-1 times (guarantees shortest paths use at most V-1 edges in a graph with no negative cycle). A final V-th pass detects negative cycles if any distance still improves.",
    complexity: "O(VE)",
    prerequisites: ["c-daa-dp-general", "c-daa-dijkstra"],
    examRelevance: 5,
    commonTraps: [
      "The V-1 relaxation rounds bound comes from the fact that a SIMPLE shortest path in a graph with V vertices has at most V-1 edges — running fewer rounds than this can miss the true shortest path on graphs where it requires the maximum path length.",
      "Bellman-Ford detects the EXISTENCE of a negative cycle reachable from the source, but does NOT itself compute meaningful shortest paths for vertices affected by that cycle (those distances are technically -∞)."
    ],
    pyqIds: ["gate-cse:daa:dp:004"]
  },
  {
    id: "c-daa-bfs",
    subjectId: "Algorithms",
    chapterId: "daa-graph-algorithms",
    label: "Breadth-First Search (BFS)",
    kind: "algorithm",
    summary: "Explores graph level by level using a queue. Gives shortest path (in terms of number of EDGES, not weight) from source in an UNWEIGHTED graph. Also used for bipartiteness checking and level-order structure.",
    complexity: "O(V+E)",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "BFS gives shortest paths ONLY for unweighted graphs (or graphs with equal edge weights) — applying BFS-derived 'shortest path' logic to a weighted graph without adaptation gives the wrong answer; that needs Dijkstra/Bellman-Ford instead."
    ],
    pyqIds: ["gate-cse:daa:graph:001"]
  },
  {
    id: "c-daa-dfs",
    subjectId: "Algorithms",
    chapterId: "daa-graph-algorithms",
    label: "Depth-First Search (DFS)",
    kind: "algorithm",
    summary: "Explores as deep as possible before backtracking, using a stack (explicit or via recursion). Classifies edges into tree, back, forward, and cross edges. Used for cycle detection, topological sort, and SCC algorithms.",
    complexity: "O(V+E)",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "A BACK edge in DFS indicates a cycle in a DIRECTED graph — but in an UNDIRECTED graph, the edge back to the immediate parent is NOT a back edge (it's just traversing the same edge in reverse); only an edge to a non-parent ancestor counts as a real back edge indicating a cycle.",
      "Forward and cross edges can ONLY occur in DFS of a DIRECTED graph — undirected graph DFS produces only tree edges and back edges, a fact GATE tests via edge-classification MCQs."
    ],
    pyqIds: ["gate-cse:daa:graph:002"]
  },
  {
    id: "c-daa-topological-sort",
    subjectId: "Algorithms",
    chapterId: "daa-graph-algorithms",
    label: "Topological Sort",
    kind: "technique",
    summary: "Linear ordering of vertices in a DAG such that for every directed edge u→v, u comes before v. Two methods: DFS-based (push to stack on finish time, reverse), or Kahn's algorithm (repeatedly remove in-degree-0 vertices using a queue).",
    complexity: "O(V+E)",
    prerequisites: ["c-daa-dfs", "c-daa-bfs"],
    examRelevance: 4,
    commonTraps: [
      "Topological sort is only defined for DAGs — if a cycle exists, no valid topological order exists; Kahn's algorithm detects this implicitly (if fewer than V vertices get processed, a cycle exists).",
      "A topological order is generally NOT unique — multiple valid orderings can exist whenever the DAG has vertices with no ordering constraint between them (GATE sometimes asks to count or enumerate valid orders)."
    ],
    pyqIds: ["gate-cse:daa:graph:003"]
  },
  {
    id: "c-daa-scc",
    subjectId: "Algorithms",
    chapterId: "daa-graph-algorithms",
    label: "Strongly Connected Components (Kosaraju's / Tarjan's)",
    kind: "algorithm",
    summary: "Kosaraju's: DFS on original graph recording finish order, DFS on TRANSPOSE graph in decreasing finish-time order — each DFS tree in the second pass is one SCC. Tarjan's: single-pass DFS using discovery time and low-link values.",
    complexity: "O(V+E) for both",
    prerequisites: ["c-daa-dfs"],
    examRelevance: 3,
    commonTraps: [
      "Kosaraju's algorithm needs the graph TRANSPOSE (all edges reversed) for the second DFS pass — forgetting to reverse edges is the most common implementation bug and silently gives wrong SCC groupings on asymmetric graphs."
    ],
    pyqIds: []
  },
  {
    id: "c-daa-p-np-npc-nph",
    subjectId: "Algorithms",
    chapterId: "daa-np-completeness",
    label: "P, NP, NP-Complete, NP-Hard",
    kind: "definition",
    summary: "P: solvable in polynomial time. NP: solution VERIFIABLE in polynomial time (not necessarily solvable). NP-Complete: in NP AND every NP problem polynomial-time reduces to it (the 'hardest' problems in NP). NP-Hard: at least as hard as NP-Complete, but need not be in NP itself (may not even be a decision problem, e.g. Halting Problem).",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "P ⊆ NP is proven (any polynomial-time solvable problem is trivially polynomial-time verifiable) — but whether P = NP is an OPEN problem, not proven either way; GATE options sometimes assert 'P = NP is proven false/true' as bait.",
      "NP-Hard does NOT require the problem to be in NP — a common mix-up is assuming NP-Hard ⊆ NP-Complete when actually NP-Complete = NP-Hard ∩ NP, a strict subset relationship."
    ],
    pyqIds: ["gate-cse:daa:npc:001"]
  },
  {
    id: "c-daa-reduction",
    subjectId: "Algorithms",
    chapterId: "daa-np-completeness",
    label: "Polynomial-Time Reduction",
    kind: "technique",
    summary: "A ≤p B means A can be solved using a polynomial-time algorithm for B plus polynomial-time transformation of input/output. Used to prove NP-hardness: if a KNOWN NP-hard problem reduces to X in poly time, X is at least as hard (NP-hard too).",
    prerequisites: ["c-daa-p-np-npc-nph"],
    examRelevance: 4,
    commonTraps: [
      "Reduction direction matters critically: to prove X is NP-hard, you reduce a KNOWN NP-hard problem TO X (not X to the known problem) — reducing in the wrong direction only shows X is 'no harder than' the known problem, proving nothing about X's hardness."
    ],
    pyqIds: []
  },
  {
    id: "c-daa-cook-levin",
    subjectId: "Algorithms",
    chapterId: "daa-np-completeness",
    label: "Cook-Levin Theorem (SAT is NP-Complete)",
    kind: "theorem",
    summary: "The Boolean Satisfiability Problem (SAT) was the FIRST problem proven NP-Complete, by direct reduction from any NP problem's verification process (encoding a nondeterministic Turing machine's computation as a Boolean formula). All subsequent NP-completeness proofs build on this via reduction chains.",
    prerequisites: ["c-daa-reduction", "c-daa-p-np-npc-nph"],
    examRelevance: 3,
    commonTraps: [
      "3-SAT (each clause has exactly 3 literals) is also NP-Complete and is the more commonly used starting point for reductions in practice — but 2-SAT is actually in P (polynomial-time solvable), a sharp and frequently tested contrast."
    ],
    pyqIds: ["gate-cse:daa:npc:002"]
  },
  {
    id: "c-daa-npc-problems",
    subjectId: "Algorithms",
    chapterId: "daa-np-completeness",
    label: "Common NP-Complete Problems",
    kind: "definition",
    summary: "Well-known NP-Complete problems GATE draws from: SAT, 3-SAT, Vertex Cover, Independent Set, Clique, Hamiltonian Cycle/Path, Traveling Salesman (decision version), Graph Coloring (k≥3), Subset Sum, Partition Problem.",
    prerequisites: ["c-daa-cook-levin"],
    examRelevance: 5,
    commonTraps: [
      "Related-sounding problems have DIFFERENT complexity classes: Hamiltonian Cycle is NP-Complete, but Eulerian Circuit is in P (solvable in O(V+E), exists iff all vertices have even degree and graph is connected) — this pairing is a favorite GATE trap.",
      "2-Coloring (bipartiteness check) is in P, but k-Coloring for k ≥ 3 is NP-Complete — the jump from 2 to 3 colors crosses from P to NP-Complete, frequently tested."
    ],
    pyqIds: ["gate-cse:daa:npc:003", "gate-cse:daa:npc:004"]
  },

  // ─── DATA STRUCTURES ────────────────────────────────────────────────────────
  {
    id: "c-ds-arrays",
    subjectId: "Data Structures",
    chapterId: "ds-arrays",
    label: "Arrays & Row/Column Major Mapping",
    kind: "definition",
    summary: "Contiguous memory layout. Element address calculation for 1D and 2D arrays in Row-Major or Column-Major order.",
    formula: "Loc(A[i][j]) = B + W \\cdot [(i - L_1) \\cdot N_2 + (j - L_2)]",
    complexity: "Access O(1), Insertion/Deletion O(n)",
    prerequisites: [],
    examRelevance: 4,
    commonTraps: [
      "Forgetting 0-based vs 1-based indexing lower bounds.",
      "Mixing up number of columns $N_2$ in Row-Major vs number of rows $N_1$ in Column-Major.",
    ],
  },
  {
    id: "c-ds-trees",
    subjectId: "Data Structures",
    chapterId: "ds-trees",
    label: "Binary Search Trees (BST) & Traversals",
    kind: "definition",
    summary: "Binary tree where left subtree < node < right subtree. Inorder traversal produces strictly sorted order.",
    complexity: "Search/Insert: $O(h)$ where $h$ is height",
    prerequisites: ["c-ds-arrays"],
    examRelevance: 5,
    commonTraps: [
      "Worst-case BST height is $O(n)$ for skewed tree, NOT $O(\\log n)$.",
      "Constructing tree uniquely requires Inorder + (Preorder OR Postorder). Preorder + Postorder is NOT unique.",
    ],
  },
  {
    id: "c-ds-heaps",
    subjectId: "Data Structures",
    chapterId: "ds-heaps",
    label: "Binary Heaps & Priority Queues",
    kind: "algorithm",
    summary: "Complete binary tree satisfying heap property (Max-Heap: parent $\\ge$ children). Build-Heap runs in $O(n)$ time.",
    formula: "\\sum_{h=0}^{\\log n} \\frac{n}{2^{h+1}} O(h) = O(n)",
    complexity: "Build-Heap: $O(n)$, Extract-Min: $O(\\log n)$",
    prerequisites: ["c-ds-trees"],
    examRelevance: 5,
    commonTraps: [
      "Assuming Build-Heap takes $O(n \\log n)$ time. Repeated insertions take $O(n \\log n)$, but bottom-up Heapify is $O(n)$.",
    ],
  },
  {
    id: "c-ds-graphs",
    subjectId: "Data Structures",
    chapterId: "ds-graphs",
    label: "Graph Representations (Adjacency Matrix & List)",
    kind: "definition",
    summary: "Representing graphs via $V \\times V$ matrix or array of linked lists. Space vs query time tradeoffs.",
    complexity: "Matrix Space $O(V^2)$, List Space $O(V + E)$",
    prerequisites: ["c-ds-arrays"],
    examRelevance: 4,
  },

  // ─── COMPUTER ORGANIZATION & ARCHITECTURE ───────────────────────────────────
  {
    id: "c-coa-pipeline",
    subjectId: "Computer Organization",
    chapterId: "coa-pipelining",
    label: "Instruction Pipelining & Hazards",
    kind: "definition",
    summary: "Overlapping instruction execution stages. Hazards: Structural, Data (RAW, WAR, WAW), Control (branches).",
    formula: "\\text{Speedup } S = \\frac{k \\cdot n}{k + n - 1} \\approx k \\text{ for large } n",
    complexity: "Ideal CPI = 1",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "RAW (Read After Write) is the ONLY true data dependency.",
      "Branch penalty stalls occur on taken branches in MIPS 5-stage pipeline unless branch target is computed early.",
    ],
  },
  {
    id: "c-coa-cache",
    subjectId: "Computer Organization",
    chapterId: "coa-cache",
    label: "Cache Memory Organization & Mapping",
    kind: "definition",
    summary: "Direct Mapped, Set-Associative, and Fully Associative cache mapping. Tag, Set Index, and Word Offset splitting.",
    formula: "\\text{Set Index Bits} = \\log_2(\\text{Number of Sets})",
    complexity: "Access time: $T_{avg} = h T_c + (1-h) T_m$",
    prerequisites: ["c-ds-arrays"],
    examRelevance: 5,
    commonTraps: [
      "Confusing block size in bytes with number of words.",
      "Forgetting Tag bits calculation: $\\text{Tag} = \\text{Address Bits} - (\\text{Index} + \\text{Offset})$.",
    ],
  },

  // ─── OPERATING SYSTEMS ───────────────────────────────────────────────────────
  {
    id: "c-os-process-vs-thread",
    subjectId: "Operating Systems",
    chapterId: "os-process-management",
    label: "Process vs Thread",
    kind: "definition",
    summary: "Process: independent execution unit with its own address space (code, data, heap, stack, PCB). Thread: lightweight unit within a process, shares code/data/heap with sibling threads but has its own stack, registers, and program counter.",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "Threads within a process share the HEAP and global/data segment, but each thread has its OWN STACK — a very frequent GATE MCQ trap is claiming threads share the stack.",
      "Context switch between threads of the SAME process is cheaper than between different processes (no address space / page table switch needed) — but GATE sometimes tests whether you know user-level threads switch even faster (no kernel involvement) vs kernel-level threads."
    ],
    pyqIds: ["gate-cse:os:process:001"]
  },
  {
    id: "c-os-process-states",
    subjectId: "Operating Systems",
    chapterId: "os-process-management",
    label: "Process State Diagram",
    kind: "definition",
    summary: "New → Ready → Running → (Waiting/Blocked ↔ Ready) → Terminated. Ready→Running via scheduler dispatch; Running→Ready via timeout/preemption; Running→Waiting on I/O or event; Waiting→Ready when event completes.",
    prerequisites: ["c-os-process-vs-thread"],
    examRelevance: 4,
    commonTraps: [
      "A process CANNOT go directly from Waiting to Running — it must always pass through Ready first so the scheduler can decide dispatch order; direct Waiting→Running is a commonly planted wrong option."
    ],
    pyqIds: []
  },
  {
    id: "c-os-context-switch",
    subjectId: "Operating Systems",
    chapterId: "os-process-management",
    label: "Context Switching",
    kind: "definition",
    summary: "Saving the CPU state (registers, PC, PCB) of the currently running process and loading the saved state of the next process to run. Pure overhead — no useful work is done during a context switch.",
    prerequisites: ["c-os-process-states"],
    examRelevance: 3,
    commonTraps: [
      "Context switch time is considered OVERHEAD in scheduling numericals — it must be added to waiting/turnaround time calculations if the question specifies a non-zero context switch cost, which students frequently forget."
    ],
    pyqIds: []
  },
  {
    id: "c-os-scheduling-criteria",
    subjectId: "Operating Systems",
    chapterId: "os-cpu-scheduling",
    label: "Scheduling Criteria & Metrics",
    kind: "definition",
    summary: "CPU utilization, throughput, turnaround time (completion - arrival), waiting time (turnaround - burst), response time (first response - arrival). Goals: maximize utilization/throughput, minimize waiting/turnaround/response time.",
    formula: "\\text{Turnaround Time} = \\text{Completion Time} - \\text{Arrival Time}",
    prerequisites: ["c-os-process-states"],
    examRelevance: 5,
    commonTraps: [
      "Waiting time = Turnaround time − Burst time, NOT Turnaround time − Arrival time — mixing these up silently gives wrong numerical answers in every GATE scheduling problem.",
      "Response time (time to FIRST scheduling, not completion) matters distinctly from turnaround time only in preemptive scheduling — for non-preemptive FCFS, response time = waiting time, a fact GATE uses to test conceptual understanding."
    ],
    pyqIds: ["gate-cse:os:sched:001"]
  },
  {
    id: "c-os-fcfs",
    subjectId: "Operating Systems",
    chapterId: "os-cpu-scheduling",
    label: "FCFS Scheduling",
    kind: "algorithm",
    summary: "First-Come-First-Served: non-preemptive, processes run strictly in arrival order. Simple but suffers from the convoy effect — a long process blocks all shorter ones behind it.",
    complexity: "O(1) dispatch decision, but poor average waiting time",
    prerequisites: ["c-os-scheduling-criteria"],
    examRelevance: 4,
    commonTraps: [
      "Convoy effect: one CPU-bound process ahead of many I/O-bound processes causes all of them to wait unnecessarily long, drastically lowering CPU/device utilization — this is the standard justification for why FCFS alone is rarely used."
    ],
    pyqIds: []
  },
  {
    id: "c-os-sjf-srtf",
    subjectId: "Operating Systems",
    chapterId: "os-cpu-scheduling",
    label: "SJF / SRTF (Shortest Job/Remaining Time First)",
    kind: "algorithm",
    summary: "SJF (non-preemptive): picks the process with shortest burst time among those arrived. SRTF (preemptive version): re-evaluates on every new arrival, switching to a newly-arrived process if its burst is shorter than the remaining time of the current one. SJF is PROVABLY OPTIMAL for minimizing average waiting time (non-preemptive case).",
    prerequisites: ["c-os-scheduling-criteria"],
    examRelevance: 5,
    commonTraps: [
      "SJF requires KNOWING burst times in advance, which is generally impossible in practice — real systems only ESTIMATE it, typically via exponential averaging of past bursts; GATE sometimes tests this predicted-burst-time formula directly.",
      "SRTF can cause STARVATION of long processes if short processes keep arriving — a very common conceptual pairing question (which scheduling algorithms can starve processes: SJF/SRTF and priority scheduling, not FCFS or Round Robin)."
    ],
    pyqIds: ["gate-cse:os:sched:002", "gate-cse:os:sched:004"]
  },
  {
    id: "c-os-round-robin",
    subjectId: "Operating Systems",
    chapterId: "os-cpu-scheduling",
    label: "Round Robin Scheduling",
    kind: "algorithm",
    summary: "Preemptive, each process gets a fixed time quantum in circular order; if not finished, it's requeued at the back of the ready queue. Fair, no starvation, but performance highly sensitive to quantum size.",
    prerequisites: ["c-os-scheduling-criteria"],
    examRelevance: 5,
    commonTraps: [
      "Quantum too LARGE → Round Robin degenerates toward FCFS behavior (high waiting time for later processes). Quantum too SMALL → excessive context-switch overhead dominates useful work — GATE numericals test both extremes.",
      "When computing RR numericals, the exact ORDER of re-insertion into the ready queue matters: a process that arrives at the SAME instant another is requeued is typically placed AFTER the requeued one unless stated otherwise — ambiguity here is a frequent source of numerical errors, always state your tie-breaking assumption."
    ],
    pyqIds: ["gate-cse:os:sched:003"]
  },
  {
    id: "c-os-priority-scheduling",
    subjectId: "Operating Systems",
    chapterId: "os-cpu-scheduling",
    label: "Priority Scheduling & Aging",
    kind: "algorithm",
    summary: "Each process assigned a priority; CPU allocated to highest priority ready process (preemptive or non-preemptive variant). Suffers indefinite blocking/starvation of low-priority processes. Aging: gradually increase priority of waiting processes over time to guarantee eventual execution.",
    prerequisites: ["c-os-scheduling-criteria"],
    examRelevance: 4,
    commonTraps: [
      "Aging is the standard SOLUTION to starvation in priority scheduling — GATE frequently asks 'which technique prevents starvation in priority scheduling', and aging is the expected answer, not a smaller time quantum (that's an RR concept)."
    ],
    pyqIds: []
  },
  {
    id: "c-os-mlfq",
    subjectId: "Operating Systems",
    chapterId: "os-cpu-scheduling",
    label: "Multilevel Feedback Queue",
    kind: "technique",
    summary: "Multiple ready queues with different priorities/quanta; processes move BETWEEN queues based on observed behavior (CPU-bound processes demoted to lower-priority longer-quantum queues, I/O-bound processes stay in higher-priority queues). Most general/flexible scheduling scheme.",
    prerequisites: ["c-os-round-robin", "c-os-priority-scheduling"],
    examRelevance: 3,
    commonTraps: [
      "MLFQ is distinguished from plain Multilevel Queue scheduling by allowing processes to MOVE between queues — plain multilevel queue scheduling fixes a process to one queue for its lifetime, a distinction GATE tests directly."
    ],
    pyqIds: []
  },
  {
    id: "c-os-critical-section",
    subjectId: "Operating Systems",
    chapterId: "os-process-synchronization",
    label: "Critical Section Problem",
    kind: "definition",
    summary: "A code segment where a process accesses shared resources; any valid solution must guarantee Mutual Exclusion (only one process in CS at a time), Progress (no indefinite postponement of entry decision when CS is free), and Bounded Waiting (a limit on how many times other processes enter before a waiting process gets its turn).",
    prerequisites: ["c-os-process-vs-thread"],
    examRelevance: 5,
    commonTraps: [
      "All THREE conditions (mutual exclusion, progress, bounded waiting) must hold simultaneously — a solution satisfying only mutual exclusion (e.g., naive turn-based alternation) can still fail progress if it forces strict turn-taking even when the other process doesn't want to enter."
    ],
    pyqIds: ["gate-cse:os:sync:001"]
  },
  {
    id: "c-os-peterson",
    subjectId: "Operating Systems",
    chapterId: "os-process-synchronization",
    label: "Peterson's Algorithm",
    kind: "algorithm",
    summary: "Software-only mutual exclusion solution for TWO processes using a 'turn' variable and a 'flag[]' array (interested[i] = true). Satisfies mutual exclusion, progress, and bounded waiting — but relies on atomic reads/writes at the instruction level and does NOT work correctly on modern architectures without memory barriers (due to instruction reordering).",
    prerequisites: ["c-os-critical-section"],
    examRelevance: 4,
    commonTraps: [
      "Peterson's algorithm is a classic GATE trace-through numerical: setting flag[i]=true BEFORE setting turn is essential — swapping the order of these two statements breaks correctness (both processes could enter CS simultaneously)."
    ],
    pyqIds: ["gate-cse:os:sync:002"]
  },
  {
    id: "c-os-semaphores",
    subjectId: "Operating Systems",
    chapterId: "os-process-synchronization",
    label: "Semaphores (Counting & Binary)",
    kind: "definition",
    summary: "Integer synchronization variable accessed only via atomic wait(P)/signal(V). Binary semaphore (0/1) behaves like a mutex lock. Counting semaphore allows a bounded number of concurrent accesses (resource pool of size N). wait() decrements and blocks if value < 0; signal() increments and wakes a waiting process.",
    formula: "\\text{wait}(S): S = S-1;\\ \\text{if } S<0 \\text{ block} \\quad \\text{signal}(S): S = S+1;\\ \\text{if } S \\le 0 \\text{ wake one}",
    prerequisites: ["c-os-critical-section"],
    examRelevance: 5,
    commonTraps: [
      "A binary semaphore and a mutex look similar but differ in ownership semantics: a mutex must be released by the SAME thread/process that acquired it, while a semaphore has no ownership — any process/thread can call signal() on it, which is exploitable but also error-prone; GATE tests this conceptual distinction.",
      "Semaphore wait/signal operations MUST be atomic (implemented via hardware instructions like test-and-set, or disabling interrupts) — if wait/signal themselves aren't atomic, race conditions reappear at a lower level, defeating the purpose."
    ],
    pyqIds: ["gate-cse:os:sync:003", "gate-cse:os:sync:005"]
  },
  {
    id: "c-os-producer-consumer",
    subjectId: "Operating Systems",
    chapterId: "os-process-synchronization",
    label: "Producer-Consumer (Bounded Buffer)",
    kind: "technique",
    summary: "Classic synchronization problem: producers add items to a bounded buffer, consumers remove them. Solved using 3 semaphores: 'empty' (counts free slots, init N), 'full' (counts filled slots, init 0), and 'mutex' (binary, init 1) protecting the buffer index itself.",
    prerequisites: ["c-os-semaphores"],
    examRelevance: 4,
    commonTraps: [
      "The ORDER of wait() calls matters for deadlock avoidance: always wait on empty/full BEFORE wait(mutex), never the reverse — waiting on mutex first and then blocking on empty/full while holding mutex causes deadlock since the counterpart process can't acquire mutex to make progress."
    ],
    pyqIds: ["gate-cse:os:sync:004"]
  },
  {
    id: "c-os-deadlock-conditions",
    subjectId: "Operating Systems",
    chapterId: "os-deadlocks",
    label: "Necessary Conditions for Deadlock",
    kind: "definition",
    summary: "All FOUR must hold simultaneously: Mutual Exclusion (resource non-shareable), Hold and Wait (process holds a resource while waiting for another), No Preemption (resources can't be forcibly taken), Circular Wait (a cycle of processes each waiting on the next).",
    prerequisites: ["c-os-critical-section"],
    examRelevance: 5,
    commonTraps: [
      "Deadlock prevention works by ensuring AT LEAST ONE of the four conditions NEVER holds — GATE often asks which condition a given prevention technique (e.g., resource ordering) violates; resource ordering specifically breaks circular wait, not hold-and-wait."
    ],
    pyqIds: ["gate-cse:os:deadlock:001"]
  },
  {
    id: "c-os-bankers-algorithm",
    subjectId: "Operating Systems",
    chapterId: "os-deadlocks",
    label: "Banker's Algorithm",
    kind: "algorithm",
    summary: "Deadlock AVOIDANCE algorithm. Given Allocation, Max, and Available matrices, checks if the system is in a SAFE STATE by simulating whether all processes can finish in SOME order using currently available + released resources. A request is granted only if the resulting state remains safe.",
    complexity: "O(m·n²) for the safety algorithm (m resources, n processes)",
    prerequisites: ["c-os-deadlock-conditions"],
    examRelevance: 5,
    commonTraps: [
      "A SAFE state does NOT mean the system is deadlock-free forever with certainty of avoiding all bad requests — it means there EXISTS at least one safe execution order; conversely an UNSAFE state doesn't necessarily mean deadlock has occurred, just that deadlock becomes POSSIBLE.",
      "Need matrix = Max − Allocation, NOT Max − Available — this subtraction mix-up is the single most common numerical error in Banker's Algorithm GATE problems."
    ],
    pyqIds: ["gate-cse:os:deadlock:002", "gate-cse:os:deadlock:003"]
  },
  {
    id: "c-os-deadlock-detection",
    subjectId: "Operating Systems",
    chapterId: "os-deadlocks",
    label: "Deadlock Detection (Resource Allocation Graph / Wait-For Graph)",
    kind: "algorithm",
    summary: "For single-instance resource types: a cycle in the Wait-For Graph implies deadlock. For multi-instance resource types: cycle in the Resource Allocation Graph is NECESSARY but NOT SUFFICIENT for deadlock — must run a detection algorithm similar to Banker's safety check.",
    prerequisites: ["c-os-deadlock-conditions", "c-os-bankers-algorithm"],
    examRelevance: 4,
    commonTraps: [
      "'Cycle exists ⟹ deadlock' is TRUE only for single-instance-per-resource-type graphs — with multiple instances of a resource type, a cycle can exist without deadlock if enough instances remain available to eventually satisfy requests, a frequently tested nuance."
    ],
    pyqIds: ["gate-cse:os:deadlock:004"]
  },
  {
    id: "c-os-memory-partitioning",
    subjectId: "Operating Systems",
    chapterId: "os-memory-management",
    label: "Contiguous Memory Allocation (Fixed & Variable Partitioning)",
    kind: "definition",
    summary: "Fixed partitioning: memory divided into fixed-size chunks, causes internal fragmentation. Variable partitioning: partitions sized exactly to process needs, causes external fragmentation. Allocation strategies: First Fit, Best Fit, Worst Fit — trade-offs between speed and fragmentation.",
    prerequisites: [],
    examRelevance: 4,
    commonTraps: [
      "Best Fit is NOT actually best for minimizing fragmentation overall — it tends to leave many tiny, unusable leftover holes (accumulating external fragmentation), whereas Worst Fit leaves larger, more reusable leftover chunks; this counter-intuitive result is a favorite GATE conceptual trap.",
      "Internal fragmentation occurs in FIXED partitioning (wasted space WITHIN an allocated block); external fragmentation occurs in VARIABLE partitioning (wasted space BETWEEN allocated blocks) — swapping these two terms is extremely common."
    ],
    pyqIds: ["gate-cse:os:memory:001"]
  },
  {
    id: "c-os-paging",
    subjectId: "Operating Systems",
    chapterId: "os-memory-management",
    label: "Paging",
    kind: "definition",
    summary: "Logical address space divided into fixed-size PAGES; physical memory divided into equal-size FRAMES. A page table maps page number → frame number, eliminating external fragmentation (but internal fragmentation still possible in the last page of a process).",
    formula: "\\text{Logical Address} = (\\text{Page Number}, \\text{Offset}),\\quad \\text{Number of pages} = \\left\\lceil \\frac{\\text{Process Size}}{\\text{Page Size}} \\right\\rceil",
    prerequisites: ["c-os-memory-partitioning"],
    examRelevance: 5,
    commonTraps: [
      "Number of bits for offset = log2(page size); number of bits for page number = log2(logical address space / page size) — mixing up which part of the address is the offset vs the page number is the most common numerical slip.",
      "Paging eliminates EXTERNAL fragmentation but does NOT eliminate INTERNAL fragmentation (average half a page wasted per process, in the last allocated page) — GATE tests this distinction against segmentation, which has the opposite fragmentation profile."
    ],
    pyqIds: ["gate-cse:os:memory:002", "gate-cse:os:memory:005"]
  },
  {
    id: "c-os-tlb",
    subjectId: "Operating Systems",
    chapterId: "os-memory-management",
    label: "TLB (Translation Lookaside Buffer) & Effective Access Time",
    kind: "formula",
    summary: "TLB is a hardware cache of recent page table entries, avoiding a full memory access for page table lookup on every reference. Effective Access Time (EAT) combines TLB hit and miss cases weighted by hit ratio.",
    formula: "EAT = h \\cdot (t_{TLB} + t_{mem}) + (1-h) \\cdot (t_{TLB} + 2t_{mem})",
    prerequisites: ["c-os-paging"],
    examRelevance: 5,
    commonTraps: [
      "On a TLB MISS, you still pay the TLB lookup time BEFORE going to the page table in memory (not just 2 memory accesses) — many students drop the t_TLB term on the miss case and only add it on the hit case, which is backwards; both cases include the TLB check, the miss case just ALSO adds page table + actual memory access.",
      "If a page fault is also possible (page not in memory at all, requiring a disk access), the EAT formula needs a THIRD term for page-fault-service-time weighted by the page fault rate — GATE often layers page faults on top of the base TLB formula in harder numericals."
    ],
    pyqIds: ["gate-cse:os:memory:003"]
  },
  {
    id: "c-os-page-replacement",
    subjectId: "Operating Systems",
    chapterId: "os-virtual-memory",
    label: "Page Replacement Algorithms (FIFO, LRU, Optimal)",
    kind: "algorithm",
    summary: "When a page fault occurs and no free frame exists, choose a victim page to evict. FIFO: evict oldest-loaded page (simple, suffers Belady's Anomaly). LRU: evict least-recently-used page (approximates optimal, no Belady's Anomaly, but costly to implement exactly). Optimal (MIN): evict the page not needed for the longest future time (theoretical benchmark, needs future knowledge).",
    prerequisites: ["c-os-paging"],
    examRelevance: 5,
    commonTraps: [
      "Belady's Anomaly (MORE frames causing MORE page faults) can occur in FIFO but PROVABLY CANNOT occur in LRU or Optimal — these are 'stack algorithms' where the set of pages held with k frames is always a subset of pages held with k+1 frames. This is one of the most frequently tested facts in this chapter.",
      "In LRU trace numericals, when a page ALREADY in memory is referenced again (a hit, not a fault), its recency must still be UPDATED — forgetting to update recency on hits (only updating on faults/loads) is the most common tracing error."
    ],
    pyqIds: ["gate-cse:os:vm:001", "gate-cse:os:vm:002"]
  },
  {
    id: "c-os-thrashing",
    subjectId: "Operating Systems",
    chapterId: "os-virtual-memory",
    label: "Thrashing & Working Set Model",
    kind: "definition",
    summary: "Thrashing: system spends more time paging (swapping pages in/out) than executing actual process instructions, typically from over-committing processes (too high a degree of multiprogramming for available frames). Working Set Model: track the set of pages a process actively references in the last Δ time units; allocate frames to match working set size to avoid thrashing.",
    prerequisites: ["c-os-page-replacement"],
    examRelevance: 3,
    commonTraps: [
      "The intuitive fix for thrashing (add MORE processes to increase CPU utilization) actually makes it WORSE — as multiprogramming degree increases past a critical point, CPU utilization drops sharply because most time goes into paging, not computation; the correct fix is to REDUCE degree of multiprogramming or add more physical memory."
    ],
    pyqIds: []
  },
  {
    id: "c-os-segmentation",
    subjectId: "Operating Systems",
    chapterId: "os-memory-management",
    label: "Segmentation",
    kind: "definition",
    summary: "Logical address space divided into variable-size SEGMENTS based on logical program units (code, stack, heap, etc.), each with a base and limit. Unlike paging, segmentation is visible to the programmer and matches logical structure, but reintroduces external fragmentation.",
    prerequisites: ["c-os-paging"],
    examRelevance: 3,
    commonTraps: [
      "Segmentation suffers EXTERNAL fragmentation (like variable partitioning) since segments are variable-sized — this is the mirror-image trap of paging's internal-fragmentation-only property; GATE loves contrasting these two in the same question."
    ],
    pyqIds: []
  },
  {
    id: "c-os-disk-scheduling",
    subjectId: "Operating Systems",
    chapterId: "os-file-systems",
    label: "Disk Scheduling (FCFS, SSTF, SCAN, C-SCAN)",
    kind: "algorithm",
    summary: "Minimizes total head movement (seek time) across a sequence of disk I/O requests. FCFS: serve in request order (simple, poor performance). SSTF: always serve nearest request (can starve far requests). SCAN (elevator): sweep in one direction serving requests, reverse at the end. C-SCAN: sweep one direction only, jump back to start without serving on the return.",
    prerequisites: [],
    examRelevance: 4,
    commonTraps: [
      "SCAN reverses direction at the disk's PHYSICAL END (or last request in that direction, depending on the exact variant specified in the question) — GATE numericals are extremely sensitive to which exact convention is stated (does the head go all the way to the boundary, or turn back at the last request), always read the problem statement's exact wording.",
      "C-SCAN provides more UNIFORM wait time across all requests compared to SCAN (which gives requests near the middle preferential treatment since they get served on both sweeps) — this fairness distinction is a common conceptual MCQ."
    ],
    pyqIds: ["gate-cse:os:disk:001"]
  },

  // ─── THEORY OF COMPUTATION ──────────────────────────────────────────────────
  {
    id: "c-toc-dfa",
    subjectId: "Theory of Computation",
    chapterId: "toc-dfa",
    label: "Deterministic Finite Automata (DFA) & Regular Languages",
    kind: "definition",
    summary: "5-tuple $(Q, \\Sigma, \\delta, q_0, F)$ accepting regular languages. $\\delta: Q \\times \\Sigma \\to Q$ is total.",
    formula: "|Q_{min}| \\le |Q_{NFA}|",
    complexity: "Evaluation O(n) time for string length n",
    prerequisites: ["c-discrete-sets"],
    examRelevance: 5,
    commonTraps: [
      "DFA state transition MUST be defined for EVERY character in the alphabet $\\Sigma$.",
    ],
  },
  {
    id: "c-toc-pumping",
    subjectId: "Theory of Computation",
    chapterId: "toc-regular-languages",
    label: "Pumping Lemma for Regular Languages",
    kind: "theorem",
    summary: "Used strictly to prove a language is NOT regular. Any string $w$ with $|w| \\ge p$ can be split into $xyz$ such that $xy^i z \\in L$.",
    formula: "|xy| \\le p, \\; |y| > 0, \\; \\forall i \\ge 0 : xy^i z \\in L",
    prerequisites: ["c-toc-dfa"],
    examRelevance: 4,
    commonTraps: [
      "Pumping Lemma CANNOT be used to prove a language IS regular (it is a necessary, not sufficient condition).",
    ],
  },

  // ─── COMPILER DESIGN ────────────────────────────────────────────────────────
  {
    id: "c-cd-parsing",
    subjectId: "Compiler Design",
    chapterId: "cd-parsing",
    label: "LL(1) & LR Parsing Tables",
    kind: "definition",
    summary: "Top-down (LL) and Bottom-up (LR) syntax analysis. FIRST and FOLLOW set computation for grammar symbols.",
    prerequisites: ["c-toc-dfa"],
    examRelevance: 5,
    commonTraps: [
      "An LL(1) grammar CANNOT contain left recursion or ambiguity.",
      "EVERY LL(1) grammar is LR(1), but NOT vice versa.",
    ],
  },

  // ─── COMPUTER NETWORKS ──────────────────────────────────────────────────────
  {
    id: "c-cn-ip",
    subjectId: "Computer Networks",
    chapterId: "cn-network-layer",
    label: "IP Addressing, CIDR & Subnetting",
    kind: "definition",
    summary: "IPv4 32-bit addressing, Classless Inter-Domain Routing (CIDR) notation /N, and subnet masking.",
    formula: "\\text{Usable Hosts} = 2^{32-N} - 2",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "Subtracting 2 for Network ID and Broadcast Address when calculating usable host addresses.",
    ],
  },
  {
    id: "c-cn-tcp",
    subjectId: "Computer Networks",
    chapterId: "cn-transport-layer",
    label: "TCP Congestion Control & Sliding Window",
    kind: "definition",
    summary: "Slow Start, Congestion Avoidance, Fast Retransmit, Fast Recovery. Max window size = $\\min(\\text{Cwnd}, \\text{Rwnd})$.",
    formula: "\\text{Efficiency } \\eta = \\frac{1}{1 + 2a} \\text{ where } a = \\frac{T_{prop}}{T_{trans}}",
    prerequisites: ["c-cn-ip"],
    examRelevance: 5,
    commonTraps: [
      "On timeout (3 duplicate ACKs vs Timer expiration), Cwnd resets to 1 MSS on timer expiration, but to SSThresh on fast recovery.",
    ],
  },

  // ─── DATABASE MANAGEMENT SYSTEMS ────────────────────────────────────────────
  
  
  {
    "id": "c-dbms-keys",
    "subjectId": "DBMS",
    "chapterId": "dbms-er-relational-model",
    "label": "Keys (Candidate, Primary, Super, Foreign)",
    "kind": "definition",
    "summary": "Super Key: any attribute set that uniquely identifies a tuple. Candidate Key: MINIMAL super key (no proper subset is also a super key). Primary Key: the chosen candidate key. Foreign Key: attribute set referencing a candidate key (usually primary key) of another (or the same) relation.",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "Every candidate key is a super key, but NOT every super key is a candidate key — the minimality condition is what GATE tests via 'how many candidate keys exist' vs 'how many super keys exist' counting problems, where super key count is always ≥ candidate key count and typically much larger (2^(n-k) extra combinations from non-key attributes).",
      "A foreign key CAN reference the same relation (self-referencing FK, e.g., 'manager_id' referencing 'emp_id' in the Employee table) — students often assume FKs only point to other tables."
    ],
    "pyqIds": ["gate-cse:dbms:keys:001"]
  },
  {
    "id": "c-dbms-fd-closure",
    "subjectId": "DBMS",
    "chapterId": "dbms-normalization",
    "label": "Functional Dependency & Attribute Closure",
    "kind": "algorithm",
    "summary": "FD X→Y means values of X uniquely determine values of Y. Attribute closure X+ = set of all attributes functionally determined by X, computed by repeatedly applying FDs until no new attribute can be added (Armstrong's Axioms: reflexivity, augmentation, transitivity underlie this).",
    "complexity": "O(n·|F|) per closure computation using the standard iterative algorithm (n = number of attributes, F = set of FDs)",
    "prerequisites": ["c-dbms-keys"],
    "examRelevance": 5,
    "pseudocode": "function CLOSURE(X, F):\n    result = X\n    repeat:\n        changed = false\n        for each FD (A -> B) in F:\n            if A is subset of result and B is not subset of result:\n                result = result union B\n                changed = true\n        until changed == false\n    return result",
    "commonTraps": [
      "X is a candidate key of R iff X+ = all attributes of R AND no proper subset of X has this property — GATE closure numericals require checking BOTH conditions (closure covers everything, AND minimality), skipping minimality check gives wrong candidate key counts.",
      "When computing closure, you must repeatedly re-scan ALL functional dependencies each pass until a FIXED POINT is reached (no new attributes added) — stopping after one pass through the FD list, even if new attributes were just added, is the most common closure-computation error."
    ],
    "pyqIds": ["gate-cse:dbms:norm:001", "gate-cse:dbms:norm:004"]
  },
  {
    "id": "c-dbms-normalization-1nf-2nf-3nf",
    "subjectId": "DBMS",
    "chapterId": "dbms-normalization",
    "label": "1NF, 2NF, 3NF",
    "kind": "definition",
    "summary": "1NF: atomic attribute values (no multi-valued/composite attributes). 2NF: 1NF + no PARTIAL dependency of any non-prime attribute on a proper subset of any candidate key (relevant only for composite keys). 3NF: 2NF + no TRANSITIVE dependency of a non-prime attribute on the candidate key (i.e., no non-prime attribute depends on another non-prime attribute).",
    "prerequisites": ["c-dbms-fd-closure"],
    "examRelevance": 5,
    "commonTraps": [
      "2NF violations (partial dependency) can ONLY occur when the candidate key is COMPOSITE (more than one attribute) — a relation with a single-attribute candidate key is automatically in 2NF if it's in 1NF, a fact GATE uses to quickly eliminate 2NF as the answer in single-key-attribute schemas.",
      "'Non-prime attribute' means an attribute NOT part of ANY candidate key — a prime attribute (part of some candidate key) can be transitively or partially dependent without violating 2NF/3NF, since those definitions specifically restrict to non-prime attributes only. This exception is heavily tested."
    ],
    "pyqIds": ["gate-cse:dbms:norm:002"]
  },
  {
    "id": "c-dbms-bcnf",
    "subjectId": "DBMS",
    "chapterId": "dbms-normalization",
    "label": "BCNF (Boyce-Codd Normal Form)",
    "kind": "definition",
    "summary": "Stricter than 3NF: for every non-trivial FD X→Y, X must be a SUPER KEY (not just satisfy the prime-attribute exception 3NF allows). Every BCNF relation is in 3NF, but not vice versa. BCNF guarantees no redundancy from FDs but may NOT always be dependency-preserving.",
    "prerequisites": ["c-dbms-normalization-1nf-2nf-3nf"],
    "examRelevance": 5,
    "commonTraps": [
      "3NF allows an FD X→Y to violate the 'X must be super key' rule IF Y is a PRIME attribute — this is exactly the loophole BCNF closes; a relation can be in 3NF but NOT in BCNF specifically because of this prime-attribute exception, the single most-tested BCNF-vs-3NF distinction.",
      "Decomposition into BCNF ALWAYS achieves lossless join, but is NOT guaranteed to preserve all functional dependencies — decomposition into 3NF (via the synthesis algorithm) guarantees BOTH lossless join AND dependency preservation; this trade-off is a frequent conceptual MCQ."
    ],
    "pyqIds": ["gate-cse:dbms:norm:003", "gate-cse:dbms:norm:006"]
  },
  {
    "id": "c-dbms-multivalued-4nf",
    "subjectId": "DBMS",
    "chapterId": "dbms-normalization",
    "label": "Multivalued Dependency & 4NF",
    "kind": "definition",
    "summary": "MVD X↠Y holds when, for a fixed value of X, the set of Y values is independent of the set of Z values (remaining attributes) — this happens when combining two otherwise-independent multivalued facts about an entity into one relation, causing redundancy. 4NF requires that for every non-trivial MVD X↠Y, X must be a super key.",
    "prerequisites": ["c-dbms-bcnf"],
    "examRelevance": 3,
    "commonTraps": [
      "Every FD is also an MVD (trivially, X→Y implies X↠Y), but NOT every MVD is an FD — a relation can be in BCNF (satisfying all FD constraints) yet still NOT be in 4NF because of a genuine multivalued dependency that isn't a functional dependency at all."
    ],
    "pyqIds": []
  },
  {
    "id": "c-dbms-lossless-decomposition",
    "subjectId": "DBMS",
    "chapterId": "dbms-normalization",
    "label": "Lossless-Join & Dependency-Preserving Decomposition",
    "kind": "theorem",
    "summary": "A decomposition of R into R1, R2 is LOSSLESS iff (R1 ∩ R2) is a super key of R1 OR of R2 — i.e., the common attributes must functionally determine all attributes of at least one of the two pieces. Dependency-preserving means the union of FDs on the decomposed relations, closed, equals the original FD closure — no FD is 'lost' requiring a join to verify.",
    "formula": "\\text{Lossless iff } (R_1 \\cap R_2) \\to R_1 \\text{ or } (R_1 \\cap R_2) \\to R_2",
    "prerequisites": ["c-dbms-fd-closure", "c-dbms-bcnf"],
    "examRelevance": 4,
    "commonTraps": [
      "Checking losslessness requires the common attribute set to functionally determine ALL of R1 or ALL of R2 (not just some attributes) — a common shortcut error is checking whether the intersection determines SOME shared subset rather than the entire relation on one side."
    ],
    "pyqIds": ["gate-cse:dbms:norm:005"]
  },
  {
    "id": "c-dbms-relational-algebra",
    "subjectId": "DBMS",
    "chapterId": "dbms-relational-algebra",
    "label": "Relational Algebra Operators",
    "kind": "definition",
    "summary": "Core operators: σ (select, filters rows), π (project, filters columns, implicitly removes duplicates), ⋈ (join), ∪/∩/− (set operators, require union-compatible schemas), × (Cartesian product), ρ (rename), ÷ (division, finds tuples related to ALL tuples in another relation).",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "Projection (π) implicitly ELIMINATES DUPLICATE rows in pure relational algebra (set semantics) — but SQL's SELECT does NOT eliminate duplicates by default (bag semantics, needs explicit DISTINCT); this SQL-vs-algebra mismatch is a frequently tested trap.",
      "Division (÷) is used for 'find X related to ALL Y' queries (e.g., 'students who have taken ALL courses') and is NOT a primitive operator — it must be derived from projection, set difference, and Cartesian product in implementation, though GATE treats it as a black box operator conceptually."
    ],
    "pyqIds": ["gate-cse:dbms:ra:001"]
  },
  {
    "id": "c-dbms-joins",
    "subjectId": "DBMS",
    "chapterId": "dbms-relational-algebra",
    "label": "Join Types (Inner, Outer, Natural, Theta)",
    "kind": "definition",
    "summary": "Theta join: combines tuples satisfying an arbitrary condition θ. Natural join: theta join on ALL commonly-named attributes with equality, automatically removes duplicate columns. Outer joins (left/right/full) preserve unmatched tuples from one or both sides, padding with NULLs.",
    "prerequisites": ["c-dbms-relational-algebra"],
    "examRelevance": 4,
    "commonTraps": [
      "Natural join automatically equates and removes duplicate columns based on ATTRIBUTE NAME matching — if two relations share a column name that ISN'T meant to be joined on, natural join silently produces wrong (over-restrictive) results, a common query-design pitfall GATE tests conceptually.",
      "A LEFT outer join followed by a filter (WHERE clause) on the right table's column can accidentally behave like an INNER join if the filter condition excludes NULL rows — this SQL semantics trap (filtering after outer join) is a frequently tested query-behavior question."
    ],
    "pyqIds": ["gate-cse:dbms:ra:002"]
  },
  {
    "id": "c-dbms-sql-null-semantics",
    "subjectId": "DBMS",
    "chapterId": "dbms-sql",
    "label": "SQL NULL & Three-Valued Logic",
    "kind": "pitfall",
    "summary": "SQL uses three-valued logic: TRUE, FALSE, UNKNOWN. Any comparison with NULL (=, <, >, etc.) yields UNKNOWN, not TRUE or FALSE. WHERE clauses only keep rows where the condition evaluates to TRUE (UNKNOWN rows are excluded, just like FALSE).",
    "prerequisites": ["c-dbms-relational-algebra"],
    "examRelevance": 4,
    "commonTraps": [
      "`column = NULL` ALWAYS evaluates to UNKNOWN (never TRUE), even if the column actually contains NULL — you MUST use `IS NULL` instead; this is one of the most common real-world and GATE SQL bugs.",
      "COUNT(*) counts ALL rows including NULLs, but COUNT(column_name) skips rows where that column is NULL — mixing these up gives wrong counts in aggregate queries involving nullable columns.",
      "NOT UNKNOWN is still UNKNOWN (not TRUE) — so `NOT (x = NULL)` doesn't magically become true; three-valued logic negation traps appear in nested/negated WHERE clause GATE questions."
    ],
    "pyqIds": ["gate-cse:dbms:sql:001", "gate-cse:dbms:sql:003"]
  },
  {
    "id": "c-dbms-acid",
    "subjectId": "DBMS",
    "chapterId": "dbms-transactions",
    "label": "ACID Properties",
    "kind": "definition",
    "summary": "Atomicity: transaction executes fully or not at all. Consistency: transaction moves DB from one valid state to another (integrity constraints preserved). Isolation: concurrent transactions appear to execute serially from each one's perspective. Durability: committed changes survive system failure.",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "Atomicity and Durability are typically ensured by the RECOVERY manager (via logs — undo/redo), while Isolation is ensured by the CONCURRENCY CONTROL manager (via locking/timestamping/validation) — GATE sometimes asks which subsystem is responsible for which ACID property.",
      "Consistency is partly the DBMS's responsibility (enforcing declared constraints) but ALSO partly the application/transaction programmer's responsibility (writing logically correct transactions) — unlike the other three properties which are purely system-guaranteed."
    ],
    "pyqIds": ["gate-cse:dbms:transaction:001"]
  },
  {
    "id": "c-dbms-schedules-serializability",
    "subjectId": "DBMS",
    "chapterId": "dbms-transactions",
    "label": "Schedules & Serializability (Conflict & View)",
    "kind": "theorem",
    "summary": "A schedule is CONFLICT SERIALIZABLE if it can be transformed into a serial schedule by swapping non-conflicting operations (conflicting ops: same data item, at least one is a WRITE, from different transactions). Checked via a PRECEDENCE GRAPH — if the graph is acyclic, the schedule is conflict serializable. VIEW serializability is a strictly weaker/broader condition (every conflict-serializable schedule is view-serializable, not conversely).",
    "prerequisites": ["c-dbms-acid"],
    "examRelevance": 5,
    "pseudocode": "function IS_CONFLICT_SERIALIZABLE(schedule):\n    graph = empty directed graph\n    for each pair of operations (opI from Ti, opJ from Tj) in schedule order:\n        if Ti != Tj and opI, opJ access same data item and (opI is WRITE or opJ is WRITE):\n            add edge Ti -> Tj  // Ti's conflicting op happened first\n    return NOT HAS_CYCLE(graph)",
    "commonTraps": [
      "Precedence graph edges are drawn Ti → Tj when Ti's operation precedes and CONFLICTS with Tj's operation on the SAME data item — read-read pairs are NEVER conflicting (no edge), a very common error is adding edges for read-read overlaps.",
      "A cycle in the precedence graph means the schedule is NOT conflict serializable — but it might STILL be view serializable in rare cases (e.g., involving blind writes) — GATE occasionally distinguishes conflict-serializable-count vs view-serializable-count in the same schedule to test this exact gap."
    ],
    "pyqIds": ["gate-cse:dbms:transaction:002", "gate-cse:dbms:transaction:005"]
  },
  {
    "id": "c-dbms-two-phase-locking",
    "subjectId": "DBMS",
    "chapterId": "dbms-concurrency-control",
    "label": "Two-Phase Locking (2PL, Strict 2PL, Rigorous 2PL)",
    "kind": "algorithm",
    "summary": "2PL: each transaction has a GROWING phase (only acquires locks, never releases) followed by a SHRINKING phase (only releases, never acquires). 2PL guarantees conflict serializability but NOT freedom from deadlock. Strict 2PL: hold ALL exclusive locks until commit/abort (prevents cascading rollback). Rigorous 2PL: hold ALL locks (shared and exclusive) until commit/abort.",
    "prerequisites": ["c-dbms-schedules-serializability"],
    "examRelevance": 5,
    "pseudocode": "// Strict 2PL, per transaction Ti\nphase = GROWING\non access(item):\n    if phase == SHRINKING: error  // no new locks after first release\n    acquire_lock(item)            // block if held conflictingly by another Ti\non release request:\n    phase = SHRINKING             // only reached at commit/abort in Strict 2PL\non commit or abort:\n    release_all_locks(Ti)         // held until here, avoids cascading rollback",
    "commonTraps": [
      "Basic 2PL guarantees conflict serializability but can still suffer CASCADING ROLLBACK (if a transaction reads data written by another that later aborts) — only STRICT 2PL (holding write locks until commit) prevents cascading rollback; plain 2PL does not.",
      "2PL does NOT prevent deadlock — it's entirely possible for transactions following 2PL to deadlock while each is in its growing phase waiting for a lock the other holds; deadlock prevention/detection is a SEPARATE mechanism layered on top."
    ],
    "pyqIds": ["gate-cse:dbms:concurrency:001", "gate-cse:dbms:concurrency:003"]
  },
  {
    "id": "c-dbms-timestamp-ordering",
    "subjectId": "DBMS",
    "chapterId": "dbms-concurrency-control",
    "label": "Timestamp Ordering Protocol",
    "kind": "algorithm",
    "summary": "Each transaction assigned a unique timestamp at start; each data item tracks W-timestamp (last write) and R-timestamp (last read). A read/write is rejected (transaction rolled back and restarted with a NEW timestamp) if it would violate timestamp order — e.g., writing to an item already read/written by a LATER transaction.",
    "prerequisites": ["c-dbms-schedules-serializability"],
    "examRelevance": 3,
    "pseudocode": "on Ti reads item X:\n    if TS(Ti) < W-timestamp(X): reject, rollback Ti, restart with new TS\n    else: allow read, R-timestamp(X) = max(R-timestamp(X), TS(Ti))\n\non Ti writes item X:\n    if TS(Ti) < R-timestamp(X) or TS(Ti) < W-timestamp(X): reject, rollback Ti, restart with new TS\n    else: allow write, W-timestamp(X) = TS(Ti)",
    "commonTraps": [
      "Timestamp ordering guarantees conflict serializability WITHOUT using locks (so it's deadlock-free by construction) — but it CAN cause more transaction restarts (starvation risk for a transaction repeatedly rolled back) compared to lock-based approaches, a common trade-off question."
    ],
    "pyqIds": []
  },
  {
    "id": "c-dbms-indexing-btree",
    "subjectId": "DBMS",
    "chapterId": "dbms-indexing",
    "label": "B-Tree / B+ Tree Indexing",
    "kind": "definition",
    "summary": "B+ tree: all actual data/record pointers stored ONLY at leaf nodes, which are also linked in a sequence for efficient range queries; internal nodes store only routing keys (allowing more fan-out per node than B-tree). B-tree stores data pointers at internal nodes too (no leaf-linking), making range queries less efficient. Most real DBMSs use B+ trees for indexes.",
    "complexity": "O(log_f n) search/insert/delete, where f is the fan-out (order) of the tree",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "A B+ tree of order (fan-out) p can have between ⌈p/2⌉ and p children per internal node (except the root) — GATE numericals computing minimum/maximum number of keys or the tree height are extremely sensitive to whether the CEILING or FLOOR convention applies to a given bound, and whether the ROOT is exempted from the minimum-fill rule (it usually is).",
      "B+ tree height/order numericals must account for whether the question specifies BLOCK SIZE and POINTER/KEY SIZE separately — order p is computed from block_size = p·(pointer_size) + (p-1)·(key_size) for internal nodes, and a DIFFERENT formula for leaf nodes (which also need a next-leaf pointer) — using the internal-node formula for leaf capacity is a common numerical mistake."
    ],
    "pyqIds": ["gate-cse:dbms:index:001", "gate-cse:dbms:index:002"]
  },
  {
    "id": "c-dbms-indexing-types",
    "subjectId": "DBMS",
    "chapterId": "dbms-indexing",
    "label": "Primary, Secondary, Clustering, Dense/Sparse Index",
    "kind": "definition",
    "summary": "Primary index: on the ORDERING key of a sequentially-ordered file (implies at most one per relation). Clustering index: on a non-key attribute by which the file happens to be physically ordered. Secondary index: on any non-ordering attribute, always DENSE. Dense index: one entry per search-key value/record. Sparse index: one entry per BLOCK, only possible when data is physically sorted on that key.",
    "prerequisites": ["c-dbms-indexing-btree"],
    "examRelevance": 4,
    "commonTraps": [
      "Sparse indexing is ONLY possible when the underlying file is physically SORTED on the index key (so you can binary-search to the right block and scan linearly) — secondary indexes on unsorted attributes MUST be dense, since there's no physical ordering to exploit for skipping records.",
      "'Primary index' in GATE terminology refers to indexing on the ORDERING key, NOT necessarily the primary key attribute declared in the schema — a table's primary key could be different from the attribute it's physically sorted/indexed on, a subtle terminology trap."
    ],
    "pyqIds": ["gate-cse:dbms:index:003"]
  },
  // ─── DISCRETE MATHEMATICS ────────────────────────────────────────────────────
  {
    id: "c-discrete-sets",
    subjectId: "Discrete Mathematics",
    chapterId: "discrete-set-theory",
    label: "Set Theory, Relations & Equivalence Classes",
    kind: "definition",
    summary: "Reflexive, Symmetric, Transitive relations. Equivalence relations partition a set into disjoint equivalence classes.",
    prerequisites: [],
    examRelevance: 4,
  },
  {
    id: "c-discrete-functions",
    subjectId: "Discrete Mathematics",
    chapterId: "discrete-set-theory",
    label: "Functions (Injective, Surjective, Bijective)",
    kind: "definition",
    summary: "Mapping elements between domain and codomain. Pigeonhole Principle application for injections.",
    prerequisites: ["c-discrete-sets"],
    examRelevance: 4,
  },

  // ─── DIGITAL LOGIC ──────────────────────────────────────────────────────────
  {
    id: "c-dl-kmap",
    subjectId: "Digital Logic",
    chapterId: "dl-combinational",
    label: "Karnaugh Maps (K-Map) & Minimization",
    kind: "technique",
    summary: "Visual method for simplifying Boolean expressions using Gray code ordering. Prime Implicants and Essential Prime Implicants.",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "Essential Prime Implicants MUST cover at least one '1' that is not covered by any other prime implicant.",
    ],
  },

  // ─── ENGINEERING MATHEMATICS ────────────────────────────────────────────────
  {
    id: "c-em-eigen",
    subjectId: "Engineering Mathematics",
    chapterId: "em-linear-algebra",
    label: "Eigenvalues, Eigenvectors & Cayley-Hamilton Theorem",
    kind: "theorem",
    summary: "Solving $|A - \\lambda I| = 0$. Matrix satisfies its own characteristic polynomial $P(A) = 0$.",
    formula: "\\det(A) = \\prod \\lambda_i, \\quad \\text{Trace}(A) = \\sum \\lambda_i",
    prerequisites: [],
    examRelevance: 5,
    commonTraps: [
      "Product of eigenvalues equals determinant, sum of eigenvalues equals trace of matrix.",
    ],
  },

  // ─── GENERAL APTITUDE ───────────────────────────────────────────────────────
  {
    id: "c-apt-combinatorics",
    subjectId: "General Aptitude",
    chapterId: "apt-quant",
    label: "Permutations, Combinations & Probability",
    kind: "technique",
    summary: "Counting rules, conditional probability $P(A|B) = \\frac{P(A \\cap B)}{P(B)}$, Bayes Theorem.",
    formula: "P(A|B) = \\frac{P(B|A) P(A)}{P(B)}",
    prerequisites: [],
    examRelevance: 4,
  },
  {
    "id": "c-ga-percentages-ratio",
    "subjectId": "General Aptitude",
    "chapterId": "ga-quantitative",
    "label": "Percentages, Ratio & Proportion",
    "kind": "formula",
    "summary": "Percentage = (part/whole) × 100. Ratio a:b means a/(a+b) and b/(a+b) are the fractional shares. Successive percentage changes: if x% then y%, net factor = (1+x/100)(1+y/100). Income/expenditure problems: if income increases by x% and expenditure by y%, savings change depends on base values.",
    "formula": "\\text{Net } \\% = \\left(1+\\frac{x}{100}\\right)\\left(1+\\frac{y}{100}\\right)-1",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "A salary cut of 20% followed by a 20% increase does NOT return to original — net loss of 4%. GATE plants this as 'is the salary same as before?' with 'Yes' as a tempting wrong option.",
      "If ratio of A:B changes from 2:3 to 3:4, the actual quantities may have increased, decreased, or one increased while the other decreased — GATE asks 'can we determine who increased?' and the answer is NO without additional data."
    ],
    "pyqIds": ["gate-cse:ga:quant:001"]
  },
  {
    "id": "c-ga-profit-loss",
    "subjectId": "General Aptitude",
    "chapterId": "ga-quantitative",
    "label": "Profit, Loss & Discounts",
    "kind": "formula",
    "summary": "Profit% = (Profit/CP) × 100, Loss% = (Loss/CP) × 100. SP = CP × (1+P/100) or CP × (1-L/100). Discount is on MARKED PRICE, not CP: SP = MP × (1-d/100). Successive discounts: net factor = (1-d1/100)(1-d2/100).",
    "formula": "\\text{SP} = \\text{MP} \\times \\left(1-\\frac{d}{100}\\right), \\quad \\text{Profit\\%} = \\frac{\\text{SP}-\\text{CP}}{\\text{CP}} \\times 100",
    "prerequisites": ["c-ga-percentages-ratio"],
    "examRelevance": 4,
    "commonTraps": [
      "Discount is always calculated on Marked Price, NEVER on Cost Price — a question saying '20% discount on cost price' is deliberately misleading; if it says '20% discount' without qualification, it means on MP.",
      "When two items are sold at the same SP, one at x% profit and one at x% loss, the NET result is ALWAYS a loss, specifically loss% = (x²/100)% — this is a classic GATE shortcut formula."
    ],
    "pyqIds": ["gate-cse:ga:quant:002"]
  },
  {
    "id": "c-ga-time-work",
    "subjectId": "General Aptitude",
    "chapterId": "ga-quantitative",
    "label": "Time & Work",
    "kind": "formula",
    "summary": "If A can do work in 'a' days, A's 1-day work = 1/a. Combined work rate = 1/a + 1/b + ... Work = Rate × Time. Man-days concept: if 10 workers build a wall in 5 days, total work = 50 man-days, so 25 workers take 2 days. Pipes/cisterns: inlet = positive rate, outlet = negative rate.",
    "formula": "\\frac{1}{T_{\\text{combined}}} = \\sum \\frac{1}{t_i}, \\quad \\text{Work} = \\text{Rate} \\times \\text{Time}",
    "prerequisites": [],
    "examRelevance": 4,
    "commonTraps": [
      "'A is twice as efficient as B' means A's rate is 2× B's rate, so A takes HALF the time of B — GATE swaps 'twice as fast' and 'takes twice as long' as trap options.",
      "If A works for 3 days then B joins and they finish together, the work done by A alone (3/a) must be subtracted from total work BEFORE applying combined rate — forgetting this partial work is the most common numerical error."
    ],
    "pyqIds": []
  },
  {
    "id": "c-ga-time-speed-distance",
    "subjectId": "General Aptitude",
    "chapterId": "ga-quantitative",
    "label": "Time, Speed & Distance",
    "kind": "formula",
    "summary": "Speed = Distance/Time. Average speed when distances are equal: 2ab/(a+b). When times are equal: (a+b)/2. Relative speed: same direction = |a-b|, opposite = a+b. Trains: add lengths for crossing, only train length for crossing a pole/stationary point.",
    "formula": "v_{\\text{avg}} = \\frac{2ab}{a+b} \\text{ (equal distances)}, \\quad v_{\\text{avg}} = \\frac{a+b}{2} \\text{ (equal times)}",
    "prerequisites": [],
    "examRelevance": 4,
    "commonTraps": [
      "Average speed is NOT (speed1 + speed2)/2 unless time intervals are equal — for equal DISTANCES it's the harmonic mean 2ab/(a+b). GATE always tests which average to use.",
      "In circular track problems, if two runners start together and meet for the first time, the faster has gained exactly one lap: relative speed × time = track length. For 'meeting at starting point,' LCM of individual times matters, not relative speed."
    ],
    "pyqIds": ["gate-cse:ga:quant:003"]
  },
  {
    "id": "c-ga-permutations",
    "subjectId": "General Aptitude",
    "chapterId": "ga-quantitative",
    "label": "Permutations & Combinations (Basics)",
    "kind": "formula",
    "summary": "nPr = n!/(n-r)!: arrangements where order matters. nCr = n!/(r!(n-r)!): selections where order doesn't matter. nCr = nC(n-r). Fundamental principle: multiplication for sequential choices, addition for parallel choices.",
    "formula": "^nP_r = \\frac{n!}{(n-r)!}, \\quad ^nC_r = \\frac{n!}{r!(n-r)!}",
    "prerequisites": [],
    "examRelevance": 4,
    "commonTraps": [
      "'Arrange n people in a row' = n! but 'arrange n people in a circle' = (n-1)! because circular arrangements have rotational symmetry — GATE frequently mixes linear and circular to test this distinction.",
      "When some items are identical: n!/(p!q!...) — e.g., MISSISSIPPI has 11!/(4!4!2!) arrangements. Forgetting to divide by identical-item factorials is the standard error."
    ],
    "pyqIds": []
  },
  {
    "id": "c-ga-probability-basics",
    "subjectId": "General Aptitude",
    "chapterId": "ga-quantitative",
    "label": "Probability (Basic)",
    "kind": "formula",
    "summary": "P(E) = favorable/total (classical). P(A∪B) = P(A)+P(B)-P(A∩B). P(Ā) = 1-P(A). Conditional: P(A|B) = P(A∩B)/P(B). Independent: P(A∩B) = P(A)·P(B). Odds in favor = p:(1-p), odds against = (1-p):p.",
    "formula": "P(A|B) = \\frac{P(A \\cap B)}{P(B)}, \\quad P(\\bar{A}) = 1 - P(A)",
    "prerequisites": ["c-ga-permutations"],
    "examRelevance": 5,
    "commonTraps": [
      "Independent events are NOT the same as mutually exclusive events — in fact, if A and B are mutually exclusive AND both have non-zero probability, they CANNOT be independent (since P(A∩B)=0 ≠ P(A)·P(B)). GATE plants 'independent' as wrong option for mutually exclusive events.",
      "'At least one' problems: P(at least one) = 1 - P(none). Students often try to compute directly via inclusion-exclusion instead of using this simple complement, leading to errors with 3+ events."
    ],
    "pyqIds": ["gate-cse:ga:quant:004"]
  },
  {
    "id": "c-ga-blood-relations",
    "subjectId": "General Aptitude",
    "chapterId": "ga-logical",
    "label": "Blood Relations",
    "kind": "technique",
    "summary": "Determine family relationships from given statements. Draw a tree: males on one side, females on other, horizontal lines for siblings, vertical for parent-child. 'X is the son of Y's only sister' requires tracing Y → sister → son. Key mappings: maternal uncle = mother's brother, paternal uncle = father's brother.",
    "prerequisites": [],
    "examRelevance": 3,
    "commonTraps": [
      "'Only son' means NO other sons (but may have daughters) — 'only child' means no siblings at all. GATE exploits this distinction: 'A is B's only son' doesn't mean A is B's only child.",
      "Gender ambiguity: 'Ravi's child' could be male or female unless specified. In 'pointing to a photo' type questions, the speaker's own gender is unknown unless stated — GATE includes options that assume wrong gender."
    ],
    "pyqIds": []
  },
  {
    "id": "c-ga-syllogism",
    "subjectId": "General Aptitude",
    "chapterId": "ga-logical",
    "label": "Syllogism (Logical Deduction)",
    "kind": "technique",
    "summary": "All A are B, Some A are B, No A is B, Some A are not B — four basic proposition types. Use Venn diagrams: 'All A are B' means A's circle is inside B's. 'Some' means at least one element in the intersection. Combine two premises to derive conclusion by checking overlap regions.",
    "prerequisites": [],
    "examRelevance": 4,
    "commonTraps": [
      "'All A are B' does NOT imply 'All B are A' — this is the most basic trap but GATE still tests it. Also, 'All A are B' + 'All B are C' → 'All A are C' is valid, but 'All A are B' + 'Some B are C' → NO valid conclusion about A and C.",
      "'Some A are not B' and 'Some B are not A' are NOT equivalent: the first says there exists an A outside B, the second says there exists a B outside A. With overlapping Venn diagrams these are different statements."
    ],
    "pyqIds": []
  },
  {
    "id": "c-ga-series-completion",
    "subjectId": "General Aptitude",
    "chapterId": "ga-logical",
    "label": "Number & Letter Series",
    "kind": "technique",
    "summary": "Identify the pattern generating the sequence: arithmetic progression (constant difference), geometric (constant ratio), factorial-based, prime-based, square/cube-based, alternating patterns, differences-of-differences. Letter series: map A=1, B=2... Z=26 and apply number patterns, or look at letter positions in the alphabet.",
    "prerequisites": [],
    "examRelevance": 3,
    "commonTraps": [
      "A sequence like 2, 3, 5, 7, 11, 13 looks like primes but could also follow a polynomial pattern that diverges later — GATE sometimes gives options where the 'obvious' pattern gives one answer but a more complex pattern gives another, and the question expects the simpler one unless indicators suggest otherwise.",
      "In letter series, 'AB, CD, EF...' skips one letter each time, while 'AC, EG, IK...' skips two — miscounting the skip is the standard error."
    ],
    "pyqIds": []
  },
  {
    "id": "c-ga-grammar",
    "subjectId": "General Aptitude",
    "chapterId": "ga-verbal",
    "label": "English Grammar (Tenses, Agreement, Articles)",
    "kind": "definition",
    "summary": "Subject-verb agreement: singular subject takes singular verb. Article usage: 'a' before consonant sounds, 'an' before vowel sounds (not just letters — 'an honest man' not 'a honest man'). Tense consistency in complex sentences. Common errors: dangling modifiers, misplaced 'only', pronoun reference ambiguity.",
    "prerequisites": [],
    "examRelevance": 4,
    "commonTraps": [
      "'Each of the students has' (singular) vs 'All of the students have' (plural) — collective pronouns like 'each,' 'every,' 'either,' 'neither' always take singular verbs regardless of the noun they point to. GATE tests this with plural-sounding nouns.",
      "'The number of students IS' vs 'A number of students ARE' — 'the number of' is singular (refers to the count itself), 'a number of' means 'several' and takes plural verb. This specific pair is a perennial GATE trap."
    ],
    "pyqIds": ["gate-cse:ga:verbal:001"]
  },
  {
    "id": "c-dm-propositional-logic",
    "subjectId": "Discrete Mathematics",
    "chapterId": "dm-logic",
    "label": "Propositional Logic (Connectives & Truth Tables)",
    "kind": "definition",
    "summary": "Propositions: statements that are definitively true or false. Connectives: ¬ (NOT), ∧ (AND), ∨ (OR), → (IMPLIES: p→q is false only when p=true, q=false), ↔ (IFF: true when both same). Operator precedence: ¬ > ∧ > ∨ > → > ↔. Tautology: always true. Contradiction: always false. Contingency: neither.",
    "formula": "p \\to q \\equiv \\neg p \\lor q, \\quad \\neg(p \\to q) \\equiv p \\land \\neg q",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "Implication p→q is ONLY false when p is true AND q is false — when p is false, p→q is true REGARDLESS of q. Students instinctively treat → like ∧ or ↔, which is the single most common error in propositional logic GATE questions.",
      "p→q is NOT equivalent to q→p, but p→q IS equivalent to ¬q→¬p (contrapositive). GATE gives a statement and asks which of these is equivalent — 'converse' (q→p) and 'inverse' (¬p→¬q) are wrong answers that look tempting."
    ],
    "pyqIds": ["gate-cse:dm:logic:001", "gate-cse:dm:logic:002"]
  },
  {
    "id": "c-dm-logical-equivalence",
    "subjectId": "Discrete Mathematics",
    "chapterId": "dm-logic",
    "label": "Logical Equivalence & Normal Forms",
    "kind": "formula",
    "summary": "Two formulas are equivalent if they have identical truth tables. Key equivalences: De Morgan's (¬(p∧q)≡¬p∨¬q), distributive (p∧(q∨r)≡(p∧q)∨(p∧r)), absorption (p∨(p∧q)≡p). CNF: conjunction of disjunctive clauses. DNF: disjunction of conjunctive clauses. Every proposition has a unique CNF and DNF up to reordering.",
    "formula": "\\neg(p \\land q) \\equiv \\neg p \\lor \\neg q, \\quad \\neg(p \\lor q) \\equiv \\neg p \\land \\neg q",
    "prerequisites": ["c-dm-propositional-logic"],
    "examRelevance": 4,
    "commonTraps": [
      "CNF requires EVERY clause to be a disjunction (OR of literals), and the overall formula to be a conjunction (AND) of such clauses. A single clause like (p∨¬q) is BOTH valid CNF and valid DNF — GATE asks 'which of the following is NOT in CNF' and a single conjunction term like (p∧q) is a common wrong-answer trap.",
      "To convert to CNF: eliminate → and ↔ using equivalences, push ¬ inward using De Morgan's, distribute ∧ over ∨. Forgetting to fully distribute (leaving nested structures) produces something that looks like CNF but isn't."
    ],
    "pyqIds": ["gate-cse:dm:logic:003"]
  },
  {
    "id": "c-dm-first-order-logic",
    "subjectId": "Discrete Mathematics",
    "chapterId": "dm-logic",
    "label": "First-Order Logic (Predicates & Quantifiers)",
    "kind": "definition",
    "summary": "Predicates: P(x) is true/false depending on x. Universal quantifier ∀: P(x) is true for ALL x in domain. Existential quantifier ∃: P(x) is true for AT LEAST ONE x. Negation: ¬∀xP(x)≡∃x¬P(x), ¬∃xP(x)≡∀x¬P(x). Nested quantifiers: ∀x∃yP(x,y) and ∃y∀xP(x,y) are NOT equivalent — order matters.",
    "formula": "\\neg \\forall x \\, P(x) \\equiv \\exists x \\, \\neg P(x), \\quad \\neg \\exists x \\, P(x) \\equiv \\forall x \\, \\neg P(x)",
    "prerequisites": ["c-dm-propositional-logic"],
    "examRelevance": 5,
    "commonTraps": [
      "∀x∃yP(x,y) means 'for every x there exists SOME y (possibly different for each x).' ∃y∀xP(x,y) means 'there exists ONE y that works for ALL x.' These are NOT equivalent — GATE's most common FOL question is testing whether you understand this order-swap difference.",
      "'There is exactly one' is expressed as ∃x(P(x) ∧ ∀y(P(y)→y=x)), NOT as ∃xP(x) alone (which means 'at least one'). GATE gives 'exactly one student failed' and the option ∃xP(x) is always the trap."
    ],
    "pyqIds": ["gate-cse:dm:logic:004", "gate-cse:dm:logic:005"]
  },
  {
    "id": "c-dm-sets-relations",
    "subjectId": "Discrete Mathematics",
    "chapterId": "dm-sets-relations-functions",
    "label": "Sets, Relations & Their Properties",
    "kind": "definition",
    "summary": "Set operations: union, intersection, difference, complement, symmetric difference. Power set of {1,...,n} has 2ⁿ elements. Relation R ⊆ A×B. Properties: Reflexive (every (a,a)∈R), Symmetric ((a,b)∈R→(b,a)∈R), Antisymmetric ((a,b)∈R ∧ (b,a)∈R → a=b), Transitive ((a,b)∈R ∧ (b,c)∈R → (a,c)∈R). Equivalence relation = reflexive + symmetric + transitive. Partial order = reflexive + antisymmetric + transitive.",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "Antisymmetric is NOT the negation of symmetric — a relation can be NEITHER symmetric NOR antisymmetric (e.g., {(1,2),(2,1),(1,3)} on {1,2,3}). It can also be BOTH (only if no distinct pair has both directions). GATE tests 'which combinations are possible' as multi-correct questions.",
      "Number of equivalence relations on a set of n elements = number of set partitions = Bell number B(n). For n=3, B(3)=5. GATE sometimes asks this as a direct count question."
    ],
    "pyqIds": ["gate-cse:dm:srf:001", "gate-cse:dm:srf:002"]
  },
  {
    "id": "c-dm-functions",
    "subjectId": "Discrete Mathematics",
    "chapterId": "dm-sets-relations-functions",
    "label": "Functions (Injective, Surjective, Bijective)",
    "kind": "definition",
    "summary": "Function f: A→B assigns exactly one element of B to each element of A. Injective (one-to-one): f(a)=f(b)→a=b. Surjective (onto): range(f)=B. Bijective: both injective and surjective. |Inj(A→B)| = P(n,k) if |A|=n,|B|=k. |Bij(A→B)| = n! if |A|=|B|=n. Number of functions A→B = kⁿ.",
    "formula": "|\\text{Functions } A \\to B| = |B|^{|A|}, \\quad |\\text{Bijections}| = n! \\text{ if } |A|=|B|=n",
    "prerequisites": ["c-dm-sets-relations"],
    "examRelevance": 4,
    "commonTraps": [
      "If |A| > |B|, NO function A→B can be injective (pigeonhole principle). GATE combines this with counting: 'how many injective functions from set of size 5 to set of size 3?' — answer is ZERO, not a permutation count.",
      "Composition: if f and g are both bijective, g∘f is bijective. But if f is injective and g is surjective, g∘f may be neither — injectivity/surjectivity of compositions has specific rules that GATE tests with counterexamples."
    ],
    "pyqIds": ["gate-cse:dm:srf:003"]
  },
  {
    "id": "c-dm-partial-orders-lattices",
    "subjectId": "Discrete Mathematics",
    "chapterId": "dm-sets-relations-functions",
    "label": "Partial Orders & Lattices",
    "kind": "definition",
    "summary": "Hasse diagram: directed graph of a partial order with transitive edges removed and self-loops removed, drawn with smaller elements below. Least upper bound (join/supremum): smallest element ≥ both. Greatest lower bound (meet/infimum): largest element ≤ both. Lattice: every pair has BOTH a join and a meet. Bounded lattice: has a top (1) and bottom (0) element.",
    "prerequisites": ["c-dm-sets-relations"],
    "examRelevance": 4,
    "commonTraps": [
      "A Hasse diagram does NOT show transitive edges — if a≤b≤c, only edges a-b and b-c are drawn, NOT a-c. GATE asks 'how many edges in the Hasse diagram' and students who count ALL relation pairs instead of only cover relations get it wrong.",
      "Not every partial order is a lattice — if even ONE pair lacks a join or meet, it's not a lattice. GATE gives a poset where most pairs have joins/meets but one critical pair doesn't, and 'is this a lattice?' with 'Yes' as the trap."
    ],
    "pyqIds": ["gate-cse:dm:srf:004"]
  },
  {
    "id": "c-dm-groups",
    "subjectId": "Discrete Mathematics",
    "chapterId": "dm-algebra",
    "label": "Groups, Subgroups & Cyclic Groups",
    "kind": "definition",
    "summary": "Group (G,*): closure, associativity, identity e (a*e=e*a=a), inverse a⁻¹ (a*a⁻¹=e). Abelian: commutative. Subgroup H≤G: non-empty, closed under * and inverses. Cyclic group: generated by one element g: G={g⁰,g¹,...,gⁿ⁻¹}. Every subgroup of a cyclic group is cyclic. Zn has φ(n) generators (Euler's totient).",
    "formula": "\\text{Number of generators of } \\mathbb{Z}_n = \\varphi(n), \\quad |\\langle g \\rangle| = \\frac{n}{\\gcd(k,n)} \\text{ where } g = a^k",
    "prerequisites": ["c-dm-sets-relations"],
    "examRelevance": 4,
    "commonTraps": [
      "A finite semigroup with cancellation property IS a group — but an infinite semigroup with cancellation need NOT be (e.g., positive integers under addition have cancellation but no inverses). GATE tests the finite vs infinite distinction.",
      "The order of element a^k in a cyclic group of order n is n/gcd(n,k), NOT k. GATE asks 'what is the order of a¹² in Z₃₀?' — answer is 30/gcd(30,12) = 30/6 = 5, NOT 12."
    ],
    "pyqIds": ["gate-cse:dm:algebra:001"]
  },
  {
    "id": "c-dm-graph-basics",
    "subjectId": "Discrete Mathematics",
    "chapterId": "dm-graph-theory",
    "label": "Graph Basics (Degrees, Paths, Connectivity)",
    "kind": "definition",
    "summary": "Graph G=(V,E). Degree of vertex: number of incident edges. Handshaking lemma: sum of degrees = 2|E|. Path: sequence of distinct vertices connected by edges. Cycle: path that returns to start. Connected: path exists between every pair. Connected components: maximal connected subgraphs. Bipartite: V can be partitioned into two sets with all edges crossing between them.",
    "formula": "\\sum_{v \\in V} \\deg(v) = 2|E|",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "A graph with all vertices of even degree is NOT necessarily connected — it could have multiple components each with Eulerian circuits. 'All even degree' guarantees each component is Eulerian, not that the whole graph is connected.",
      "A simple graph (no loops, no multiple edges) on n vertices has at most n(n-1)/2 edges. If a GATE question says 'graph with 5 vertices and 12 edges' without specifying 'simple,' it COULD have parallel edges — but if it says 'simple graph,' 10 is the max."
    ],
    "pyqIds": ["gate-cse:dm:graph:001"]
  },
  {
    "id": "c-dm-trees",
    "subjectId": "Discrete Mathematics",
    "chapterId": "dm-graph-theory",
    "label": "Trees & Spanning Trees",
    "kind": "definition",
    "summary": "Tree: connected acyclic graph. Properties: |E|=|V|-1, exactly one path between any two vertices, removing any edge disconnects it. Spanning tree of G: subgraph that is a tree covering all vertices. Number of spanning trees can be found using Kirchhoff's Matrix-Tree Theorem (determinant of Laplacian minor). Binary tree: each node has ≤2 children.",
    "formula": "|E| = |V| - 1 \\text{ for any tree}, \\quad \\text{Leaf nodes in full binary tree with } i \\text{ internal nodes} = i + 1",
    "prerequisites": ["c-dm-graph-basics"],
    "examRelevance": 5,
    "commonTraps": [
      "A spanning tree of a WEIGHTED graph need not be the MINIMUM spanning tree — 'any spanning tree' and 'minimum spanning tree' are different. GATE asks 'which edge is in EVERY spanning tree?' and the answer is every BRIDGE (cut edge), not every edge in some particular MST.",
      "'A graph with n vertices and n-1 edges is a tree' is ONLY true if the graph is CONNECTED — a disconnected graph with n vertices and n-1 edges is a FOREST (collection of trees), not a single tree."
    ],
    "pyqIds": ["gate-cse:dm:graph:002"]
  },
  {
    "id": "c-dm-planar-graphs",
    "subjectId": "Discrete Mathematics",
    "chapterId": "dm-graph-theory",
    "label": "Planar Graphs & Euler's Formula",
    "kind": "formula",
    "summary": "Planar: can be drawn on a plane with no edge crossings. Euler's formula for connected planar graphs: V - E + F = 2. For simple planar graphs: E ≤ 3V - 6 (V≥3), and if no triangles: E ≤ 2V - 4. K5 and K3,3 are NON-planar (Kuratowski's theorem). Dual graph: vertices correspond to faces, edges cross original edges.",
    "formula": "V - E + F = 2, \\quad E \\leq 3V - 6 \\text{ (simple, connected, planar, } V \\geq 3)",
    "prerequisites": ["c-dm-graph-basics"],
    "examRelevance": 4,
    "commonTraps": [
      "E ≤ 3V-6 is a NECESSARY condition, not sufficient — a graph satisfying this inequality can still be non-planar. It's used to PROVE non-planarity (if violated), never to prove planarity. GATE gives a graph that satisfies 3V-6 and asks 'is it planar?' — the answer is 'not necessarily.'",
      "K3,3 has V=6, E=9, and 9 ≤ 3(6)-6 = 12, so the inequality doesn't catch it — you need the triangle-free version E ≤ 2V-4 to detect K3,3. GATE specifically tests K3,3 detection because the basic inequality fails."
    ],
    "pyqIds": ["gate-cse:dm:graph:003"]
  },
  {
    "id": "c-dm-graph-coloring",
    "subjectId": "Discrete Mathematics",
    "chapterId": "dm-graph-theory",
    "label": "Graph Coloring & Chromatic Number",
    "kind": "definition",
    "summary": "Proper coloring: no two adjacent vertices share a color. Chromatic number χ(G): minimum colors needed for proper coloring. χ(Kn)=n, χ(bipartite)=2, χ(tree)=2, χ(cycle with even vertices)=2, χ(cycle with odd vertices)=3. Chromatic polynomial: number of proper colorings using exactly k colors. Four Color Theorem: every planar graph has χ≤4.",
    "prerequisites": ["c-dm-graph-basics"],
    "examRelevance": 3,
    "commonTraps": [
      "χ(G) ≤ Δ(G)+1 where Δ is max degree (Brooks' theorem), with equality ONLY for complete graphs and odd cycles — for all other connected graphs, χ(G) ≤ Δ(G). GATE gives a graph with Δ=4 and asks if χ can be 5 — only if it's K5 or an odd cycle structure.",
      "A graph is bipartite IF AND ONLY IF it contains no odd-length cycle — this equivalence is tested frequently. A graph with an even number of vertices and even cycle length is NOT automatically bipartite (it could have an odd cycle as a subgraph too)."
    ],
    "pyqIds": []
  },
  {
    "id": "c-dm-combinatorics-counting",
    "subjectId": "Discrete Mathematics",
    "chapterId": "dm-combinatorics",
    "label": "Counting Principles (PIE, Stars & Bars)",
    "kind": "formula",
    "summary": "PIE (Inclusion-Exclusion): |A∪B∪C| = |A|+|B|+|C|-|A∩B|-|A∩C|-|B∩C|+|A∩B∩C|. Stars and Bars: number of non-negative integer solutions to x1+x2+...+xk=n is C(n+k-1,k-1). Positive solutions: C(n-1,k-1). Derangements: !n = n!(1-1/1!+1/2!-...+(-1)ⁿ/n!).",
    "formula": "D_n = n! \\sum_{i=0}^{n} \\frac{(-1)^i}{i!}, \\quad \\text{Non-neg solutions to } \\sum x_i = n \\text{ with } k \\text{ vars} = \\binom{n+k-1}{k-1}",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "Stars and Bars for NON-NEGATIVE solutions gives C(n+k-1,k-1), but for POSITIVE solutions (each xi≥1) it gives C(n-1,k-1) — GATE mixes these up by saying 'at least one' (positive) vs 'can be zero' (non-negative) in the same question across different variables.",
      "Derangement formula !n counts arrangements where NO element is in its original position — 'at least one element in correct position' is NOT n! - !n (that counts arrangements where ALL are displaced). 'Exactly k in correct position' = C(n,k) · !(n-k)."
    ],
    "pyqIds": ["gate-cse:dm:combo:001", "gate-cse:dm:combo:002"]
  },
  {
    "id": "c-dm-recurrence-relations",
    "subjectId": "Discrete Mathematics",
    "chapterId": "dm-combinatorics",
    "label": "Recurrence Relations & Generating Functions",
    "kind": "formula",
    "summary": "Linear homogeneous recurrence: an = c1·an-1 + c2·an-2 + ... + ck·an-k. Solve via characteristic equation: r^k - c1·r^(k-1) - ... - ck = 0. Distinct roots: an = ΣAi·ri^n. Repeated root r of multiplicity m: (A1+A2n+...+Am·n^(m-1))·r^n. Generating function: G(x) = Σan·xⁿ. Ordinary for sequences, exponential for labeled structures.",
    "formula": "r^k - c_1 r^{k-1} - \\cdots - c_k = 0 \\text{ (characteristic equation)}",
    "prerequisites": ["c-dm-combinatorics-counting"],
    "examRelevance": 4,
    "commonTraps": [
      "For repeated roots, the solution includes POLYNOMIAL factors in n (n, n², etc.), not just the root raised to n. For a double root r: (A + Bn)·rⁿ, NOT A·rⁿ + B·rⁿ. Forgetting the 'n' coefficient is the standard error.",
      "Generating function for Fibonacci (a₀=0, a₁=1, an=an-1+an-2) is G(x)=x/(1-x-x²), NOT x/(1-x²-x). The ORDER of terms in the denominator must match the order of the recurrence — getting the denominator wrong propagates to every coefficient."
    ],
    "pyqIds": ["gate-cse:dm:combo:003"]
  },
  {
    "id": "c-pds-c-pointers",
    "subjectId": "Programming & Data Structures",
    "chapterId": "pds-c-programming",
    "label": "Pointers (Declaration, Arithmetic, Multi-level)",
    "kind": "definition",
    "summary": "Pointer variable stores the ADDRESS of another variable. Declaration: int *p; Dereference: *p gives the value at that address. Pointer arithmetic: p+1 advances by sizeof(*p) bytes, not 1 byte. Multi-level: int **pp stores address of an int*. Array name decays to pointer to first element in most expressions (not in sizeof).",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "Array name 'a' decays to &a[0] in expressions but NOT in sizeof(a) or &a — sizeof(a) gives total array size, &a gives a pointer-to-array type. GATE exploits this: sizeof(a)/sizeof(a[0]) gives number of elements, but sizeof(p)/sizeof(p[0]) where p is a pointer does NOT.",
      "Pointer arithmetic on void* is undefined in C (GCC allows it as an extension with size 1). GATE questions with void* pointer arithmetic expect you to know this is technically undefined behavior, not a valid operation."
    ],
    "pyqIds": ["gate-cse:pds:c:001", "gate-cse:pds:c:002"]
  },
  {
    "id": "c-pds-c-arrays-strings",
    "subjectId": "Programming & Data Structures",
    "chapterId": "pds-c-programming",
    "label": "Arrays & Strings in C",
    "kind": "definition",
    "summary": "Array: contiguous block of same-type elements. Index from 0 to n-1. 2D array: stored in row-major order (C default) — a[i][j] at base + (i*COLS + j)*sizeof(elem). String: char array terminated by '\\0'. strlen doesn't count '\\0', sizeof includes it. String literals are read-only (modifying causes undefined behavior).",
    "prerequisites": ["c-pds-c-pointers"],
    "examRelevance": 5,
    "commonTraps": [
      "sizeof(\"hello\") = 6 (includes '\\0'), but strlen(\"hello\") = 5. GATE mixes these in expressions like sizeof(s) - strlen(s) and asks the result — answer is 1 for any non-empty string, not 0.",
      "a[3] is equivalent to *(a+3) which is equivalent to 3[a] — all three are valid C. GATE asks 'which of these is invalid?' and 3[a] is the surprising correct answer that looks wrong but is valid."
    ],
    "pyqIds": ["gate-cse:pds:c:003"]
  },
  {
    "id": "c-pds-c-structs-unions",
    "subjectId": "Programming & Data Structures",
    "chapterId": "pds-c-programming",
    "label": "Structs, Unions & Bit Fields",
    "kind": "definition",
    "summary": "Struct: members laid out sequentially with possible padding for alignment. sizeof(struct) ≥ sum of member sizes due to padding. Union: all members share the SAME memory location; sizeof(union) = size of largest member. Bit fields: int x : 3; uses exactly 3 bits (implementation-defined whether signed or unsigned for plain int).",
    "prerequisites": ["c-pds-c-arrays-strings"],
    "examRelevance": 4,
    "commonTraps": [
      "Struct padding: a struct with {char c; int i; char d;} on a 32-bit system has sizeof = 12 (not 6) due to alignment: 1+3(pad)+4+1+3(pad). Changing member ORDER to {char c; char d; int i;} gives sizeof = 8. GATE tests whether you know padding depends on ORDER.",
      "In a union, writing to one member and reading from another is implementation-defined (except for char array overlay, which is guaranteed). GATE asks 'what value does u.i have after writing to u.f?' — the answer depends on endianness, which is implementation-defined."
    ],
    "pyqIds": ["gate-cse:pds:c:004"]
  },
  {
    "id": "c-pds-c-recursion",
    "subjectId": "Programming & Data Structures",
    "chapterId": "pds-c-programming",
    "label": "Recursion (Tracing & Types)",
    "kind": "definition",
    "summary": "Function calling itself with smaller/modified arguments. Must have base case to terminate. Types: linear (one call per level), binary/tail (last operation is the recursive call — tail recursion can be optimized to iteration), tree (multiple calls per level like Fibonacci). Stack depth = maximum recursion depth at any point.",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "In recursive functions with static variables, the static variable is shared across ALL recursive calls (not duplicated per call). GATE gives a function with static int count=0; count++ in each call and asks the final value — it's the total number of calls, not per-level.",
      "Tail-recursive Fibonacci (return fib(n-1) + fib(n-2)) is NOT tail-recursive — tail recursion means the LAST operation is a single recursive call, not addition of two recursive calls. Tree recursion like this has exponential time without memoization."
    ],
    "pyqIds": ["gate-cse:pds:c:005"]
  },
  {
    "id": "c-pds-c-storage-scope",
    "subjectId": "Programming & Data Structures",
    "chapterId": "pds-c-programming",
    "label": "Storage Classes, Scope & Linkage",
    "kind": "definition",
    "summary": "auto: local, stack, garbage value. register: hint to compiler (may be ignored). static (local): persists across calls, initialized to 0, retains value. static (global): internal linkage (file-scope only). extern: declaration, not definition — references a variable defined elsewhere. extern inside a function: can access global variables from other files.",
    "prerequisites": ["c-pds-c-recursion"],
    "examRelevance": 4,
    "commonTraps": [
      "A static local variable is initialized ONLY ONCE (at program start), not each time the function is called. GATE gives a function with static int x = 5; and asks its value after multiple calls where x is modified — the re-initialization to 5 does NOT happen again.",
      "'register int x; &x;' is invalid — you cannot take the address of a register variable. GATE includes &registerVar as an option and tests if you know this is a compilation error."
    ],
    "pyqIds": ["gate-cse:pds:c:006"]
  },
  {
    "id": "c-pds-linked-list-basics",
    "subjectId": "Programming & Data Structures",
    "chapterId": "pds-linked-lists",
    "label": "Linked List (Singly, Doubly, Circular)",
    "kind": "definition",
    "summary": "Node: data + pointer to next (singly), data + prev + next (doubly). Head pointer to first node. Insertion/deletion at head: O(1). At tail: O(n) for singly, O(1) for doubly with tail pointer. Circular: last node points to head. No random access — must traverse from head.",
    "prerequisites": ["c-pds-c-pointers"],
    "examRelevance": 5,
    "commonTraps": [
      "Deleting a node given only a POINTER TO THAT NODE (not its predecessor): copy next node's data into current node, then delete next node. This does NOT work for the LAST node (no next node to copy from). GATE specifically tests the last-node edge case.",
      "In a circular singly linked list, checking for end of traversal requires comparing with HEAD (not checking for NULL), since no node has next=NULL. Forgetting this causes infinite loops — GATE asks for the loop termination condition."
    ],
    "pyqIds": ["gate-cse:pds:ll:001"]
  },
  {
    "id": "c-pds-stack",
    "subjectId": "Programming & Data Structures",
    "chapterId": "pds-stacks-queues",
    "label": "Stack (Array & Linked Implementation)",
    "kind": "definition",
    "summary": "LIFO: Last In, First Out. Operations: push(x) — O(1), pop() — O(1), peek/top() — O(1), isEmpty() — O(1). Array implementation: fixed size, top index starts at -1, push increments top. Linked implementation: dynamic size, push at head. Applications: expression evaluation, postfix conversion, balanced parentheses, function call stack, DFS.",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "Infix to postfix: when popping operators from stack, pop while top operator has GREATER OR EQUAL precedence (for left-associative operators). For RIGHT-associative operators like '^', pop only while GREATER (not equal). GATE tests '^' specifically.",
      "Stack overflow: pushing onto a full stack. Stack underflow: popping from empty stack. GATE gives code that doesn't check underflow and asks what happens — technically undefined behavior in C, but the question usually expects 'stack underflow' as the conceptual answer."
    ],
    "pyqIds": ["gate-cse:pds:sq:001", "gate-cse:pds:sq:002"]
  },
  {
    "id": "c-pds-queue",
    "subjectId": "Programming & Data Structures",
    "chapterId": "pds-stacks-queues",
    "label": "Queue (Linear, Circular, Deque, Priority)",
    "kind": "definition",
    "summary": "FIFO: First In, First Out. Enqueue at rear, dequeue from front. Circular queue: front and rear wrap around using modulo; full condition: (rear+1)%size == front (sacrifice one slot) or use a count variable. Deque: insert/delete from both ends. Priority queue: dequeue by priority (min-heap or max-heap based).",
    "prerequisites": ["c-pds-stack"],
    "examRelevance": 4,
    "commonTraps": [
      "Circular queue full condition with the 'sacrifice one slot' method: (rear+1)%CAPACITY == front means FULL, but this wastes one slot. If you use a separate 'count' variable instead, you can use all CAPACITY slots. GATE asks 'maximum elements in circular queue of size N' — answer depends on which method is used (N-1 or N).",
      "In a deque, 'addFront' in array implementation requires decrementing front with wrapping: front = (front-1+CAPACITY)%CAPACITY. Getting the wrapping wrong (e.g., just front-- without modulo) causes out-of-bounds access."
    ],
    "pyqIds": ["gate-cse:pds:sq:003"]
  },
  {
    "id": "c-pds-binary-tree",
    "subjectId": "Programming & Data Structures",
    "chapterId": "pds-trees",
    "label": "Binary Tree (Properties & Traversals)",
    "kind": "definition",
    "summary": "Each node has at most 2 children. Properties: max nodes at level l = 2^l, max nodes in tree of height h = 2^(h+1)-1, min height for n nodes = ⌊log₂n⌋. Traversals: Inorder (LNR), Preorder (NLR), Postorder (LRN), Level-order (BFS). Given inorder + preorder/postorder, tree can be uniquely reconstructed. Inorder + level-order also works.",
    "formula": "n_0 = n_2 + 1 \\text{ (leaf nodes = internal nodes with 2 children + 1)}",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "n₀ = n₂ + 1 is for STRICTLY binary trees (each node has 0 or 2 children), NOT for general binary trees (where nodes can have 1 child). For general binary trees with n nodes: n₀ + n₁ + n₂ = n and n₁ + 2n₂ = n-1, which gives n₀ = n₂ + n₁ + 1.",
      "From inorder + preorder: the FIRST element of preorder is always the ROOT. Split inorder at this root to get left and right subtrees. But from inorder + POSTORDER: the LAST element of postorder is the root. GATE sometimes gives inorder + postorder and expects you to identify the root from the END, not the beginning."
    ],
    "pyqIds": ["gate-cse:pds:tree:001", "gate-cse:pds:tree:002"]
  },
  {
    "id": "c-pds-bst",
    "subjectId": "Programming & Data Structures",
    "chapterId": "pds-trees",
    "label": "Binary Search Tree (BST)",
    "kind": "definition",
    "summary": "BST property: left subtree < node < right subtree (all keys in left are less, all in right are greater). Search/insert/delete: O(h) where h is height. Inorder traversal of BST gives SORTED output. Min value: leftmost node. Max value: rightmost node. Successor: leftmost in right subtree (or nearest ancestor where you took a left turn).",
    "prerequisites": ["c-pds-binary-tree"],
    "examRelevance": 5,
    "commonTraps": [
      "Deleting a node with TWO children: replace with inorder successor (or predecessor), then delete the successor from the right subtree. GATE asks for the post-deletion tree structure — the key is that the successor is ALWAYS a node with at most one child (right child), so its deletion is simple.",
      "BST with n distinct keys: the number of BSTs possible = Catalan number Cn = (2n)!/((n+1)!n!). For n=3, C₃=5. GATE asks 'how many different BSTs can be formed from keys 1,2,3?' — answer is 5, not 6 or 3!."
    ],
    "pyqIds": ["gate-cse:pds:tree:003"]
  },
  {
    "id": "c-pds-avl",
    "subjectId": "Programming & Data Structures",
    "chapterId": "pds-trees",
    "label": "AVL Tree",
    "kind": "algorithm",
    "summary": "Self-balancing BST where |height(left) - height(right)| ≤ 1 for every node. Balance factor = height(left) - height(right) ∈ {-1, 0, 1}. After insert/delete, walk up from the modified node and rebalance at the first unbalanced node using rotations: LL (right rotate), RR (left rotate), LR (left-right), RL (right-left). Height is O(log n), so all operations are O(log n).",
    "complexity": "O(log n) for insert, delete, search",
    "prerequisites": ["c-pds-bst"],
    "examRelevance": 5,
    "commonTraps": [
      "After a rotation, the balance factors of the rotated nodes change — a right rotation at A (with left child B) makes A's balance factor become 0 or -1 and B's become 0 or 1, depending on the original balance factors. GATE asks for the EXACT balance factors after rotation, not just the structure.",
      "Deletion in AVL may require multiple rotations on the path back to root (unlike insertion which requires at most ONE single or double rotation). GATE asks 'maximum rotations after a single deletion' — answer is O(log n), not 1."
    ],
    "pyqIds": ["gate-cse:pds:tree:004"]
  },
  {
    "id": "c-pds-heap",
    "subjectId": "Programming & Data Structures",
    "chapterId": "pds-heaps",
    "label": "Binary Heap (Min-Heap & Max-Heap)",
    "kind": "definition",
    "summary": "Complete binary tree with heap property: min-heap (parent ≤ children), max-heap (parent ≥ children). Stored in array: for index i, parent = ⌊(i-1)/2⌋, left = 2i+1, right = 2i+2. Insert: add at end, bubble up (O(log n)). Extract-min/max: swap root with last, remove last, bubble down (O(log n)). Build heap from array: O(n) using bottom-up heapify, NOT O(n log n).",
    "formula": "\\text{Build-Heap: } O(n) \\text{ using } \\sum_{h=0}^{\\lfloor \\log n \\rfloor} \\lceil n/2^{h+1} \\rceil \\cdot O(h) = O(n)",
    "prerequisites": ["c-pds-binary-tree"],
    "examRelevance": 5,
    "commonTraps": [
      "Build-Heap is O(n), NOT O(n log n). The intuition is wrong because most nodes are at the bottom levels and require little or no sifting. GATE directly asks 'time to build a heap from n elements' and O(n log n) is the trap option.",
      "In a min-heap, the MINIMUM element is at the root (index 0), but the MAXIMUM element is NOT necessarily at index 1 or 2 — it could be ANY leaf node. To find the max in a min-heap requires O(n) time by scanning all leaves."
    ],
    "pyqIds": ["gate-cse:pds:heap:001"]
  },
  {
    "id": "c-pds-hashing",
    "subjectId": "Programming & Data Structures",
    "chapterId": "pds-hashing",
    "label": "Hashing (Chaining & Open Addressing)",
    "kind": "definition",
    "summary": "Hash function h(key) maps key to array index. Chaining: each slot holds a linked list of colliding elements — O(1+α) average where α = n/m (load factor). Open addressing: all elements in the table itself. Linear probing: h(k), h(k)+1, h(k)+2... Quadratic: h(k)+1², h(k)+2²... Double hashing: h(k)+i·h2(k). Open addressing deletion requires TOMBSTONES.",
    "formula": "\\alpha = n/m, \\quad \\text{Chaining: } O(1+\\alpha) \\text{ avg}, \\quad \\text{Linear probing: } \\frac{1}{2}\\left(1+\\frac{1}{1-\\alpha}\\right) \\text{ (successful)}",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "In linear probing, deleting an element by simply removing it BREAKS the probe chain — a subsequent search for another element that was placed after the deleted one will fail at the empty slot. This is why TOMBSTONES are needed. GATE asks 'what happens if you delete without tombstone in linear probing?' — searches for later elements fail.",
      "Double hashing requires h2(k) to be COPRIME with the table size m. If m is prime, any h2(k) < m works. If m is a power of 2, h2(k) must be odd. GATE gives a specific h2 function and table size and asks if probing covers all slots — if gcd(h2,m) ≠ 1, it doesn't."
    ],
    "pyqIds": ["gate-cse:pds:hash:001", "gate-cse:pds:hash:002"]
  },
  {
    "id": "c-pds-graph-representations",
    "subjectId": "Programming & Data Structures",
    "chapterId": "pds-graphs",
    "label": "Graph Representations (Adjacency Matrix & List)",
    "kind": "definition",
    "summary": "Adjacency matrix: V×V matrix, mat[i][j]=weight (or 1/0 for unweighted). Space: O(V²). Check edge: O(1). List all neighbors: O(V). Adjacency list: array of V linked lists, each list has neighbors of that vertex. Space: O(V+E). Check edge: O(degree). List all neighbors: O(degree). For sparse graphs (E << V²), adjacency list is more efficient.",
    "prerequisites": ["c-pds-linked-list-basics"],
    "examRelevance": 4,
    "commonTraps": [
      "Adjacency matrix of an UNDIRECTED graph is always SYMMETRIC — mat[i][j] = mat[j][i]. GATE gives a matrix and asks 'which of the following must be true for this to represent an undirected graph?' — symmetry is the answer.",
      "For a SIMPLE graph (no self-loops), the diagonal of the adjacency matrix is all zeros. If any diagonal entry is non-zero, either the graph has self-loops or it's a multigraph. GATE tests this distinction."
    ],
    "pyqIds": ["gate-cse:pds:graph:001"]
  },
  {
    "id": "c-pds-bfs-dfs",
    "subjectId": "Programming & Data Structures",
    "chapterId": "pds-graphs",
    "label": "BFS & DFS Traversals",
    "kind": "algorithm",
    "summary": "BFS: level-by-level using queue. Finds shortest path in unweighted graphs. O(V+E). DFS: goes deep first using stack (or recursion). O(V+E). BFS tree: shortest-path tree from source. DFS produces: discovery edges, back edges (to ancestor = cycle detection), forward edges, cross edges. Only back edges exist in undirected graph DFS.",
    "complexity": "O(V + E) for both BFS and DFS",
    "prerequisites": ["c-pds-graph-representations", "c-pds-queue"],
    "examRelevance": 5,
    "commonTraps": [
      "In an UNDIRECTED graph, DFS tree edges are only 'tree edges' and 'back edges' — there are NO forward or cross edges (every non-tree edge connects to an ancestor, making it a back edge). GATE asks 'which edge types can appear in DFS of an undirected graph?' and 'forward edge' is the trap option.",
      "BFS from source s gives the SHORTEST PATH (fewest edges) from s to every reachable vertex ONLY in UNWEIGHTED graphs. For weighted graphs, BFS does NOT give shortest paths — Dijkstra is needed. GATE explicitly tests this scope limitation."
    ],
    "pyqIds": ["gate-cse:pds:graph:002", "gate-cse:pds:graph:003"]
  },
  {
    "id": "c-cn-osi-tcpip",
    "subjectId": "Computer Networks",
    "chapterId": "cn-osi-model",
    "label": "OSI & TCP/IP Layered Architecture",
    "kind": "definition",
    "summary": "OSI: 7 layers (Physical, Data Link, Network, Transport, Session, Presentation, Application). TCP/IP: 4 layers (Link/Network Interface, Internet, Transport, Application). Each layer provides services to the layer above and uses services of the layer below. Encapsulation: each layer adds its own header. PDU names: bits→frames→packets→segments→data.",
    "prerequisites": [],
    "examRelevance": 4,
    "commonTraps": [
      "OSI Session and Presentation layers are NOT separate in TCP/IP — their functions are merged into the Application layer. GATE asks 'which OSI layers are not present as separate layers in TCP/IP?' and the answer is Session + Presentation.",
      "Encapsulation order: Application adds data, Transport adds segment header, Network adds packet header, Data Link adds frame header+trailer, Physical converts to bits. GATE asks 'at which layer is the trailer added?' — Data Link, NOT Network or Transport."
    ],
    "pyqIds": ["gate-cse:cn:osi:001"]
  },
  {
    "id": "c-cn-error-detection",
    "subjectId": "Computer Networks",
    "chapterId": "cn-data-link",
    "label": "Error Detection (CRC, Checksum, Hamming)",
    "kind": "formula",
    "summary": "CRC: divide data (with appended zeros = degree of generator) by generator polynomial using XOR division. Remainder is the CRC bits. At receiver: divide received frame by same generator; remainder=0 means no error. Hamming distance: minimum number of bit flips to change one valid codeword to another. Hamming code: 2^r ≥ m + r + 1 where m = data bits, r = parity bits.",
    "formula": "2^r \\geq m + r + 1 \\text{ (Hamming code parity bits)}, \\quad \\text{CRC: remainder of } \\frac{\\text{Data} \\cdot 2^r}{\\text{Generator}}",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "CRC can DETECT more errors than it can CORRECT — a CRC with r check bits guarantees detection of all burst errors of length ≤ r and all single/double errors, but correction requires additional mechanism. GATE asks 'can CRC correct all single-bit errors?' and the answer depends on whether the code is designed for correction (like Hamming) or just detection.",
      "In CRC computation, the divisor polynomial MUST have the highest and lowest degree terms present (e.g., x³+x+1, not x³+x²). If the lowest degree term is missing, the last bit of CRC is always 0 and provides no information. GATE tests whether a given generator polynomial is valid."
    ],
    "pyqIds": ["gate-cse:cn:dl:001", "gate-cse:cn:dl:002"]
  },
  {
    "id": "c-cn-mac-protocols",
    "subjectId": "Computer Networks",
    "chapterId": "cn-data-link",
    "label": "MAC Protocols (ALOHA, CSMA, Ethernet)",
    "kind": "definition",
    "summary": "ALOHA: transmit anytime, collision → wait random time. Pure ALOHA efficiency = 1/(2e) ≈ 18.4%. Slotted ALOHA: transmit only at slot start, efficiency = 1/e ≈ 36.8%. CSMA: sense before transmit. 1-persistent: sense idle → transmit immediately (high collision). Non-persistent: sense busy → wait random time (low collision, high delay). p-persistent: sense idle → transmit with probability p. CSMA/CD: detect collision while transmitting, abort and jam. Ethernet uses CSMA/CD with binary exponential backoff.",
    "formula": "S_{\\text{Pure ALOHA}} = \\frac{1}{2e} \\approx 0.184, \\quad S_{\\text{Slotted}} = \\frac{1}{e} \\approx 0.368",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "CSMA/CD minimum frame size = 2 × propagation delay × bandwidth. If a frame is too short, the sender finishes transmitting before the collision signal returns, and it won't detect the collision. GATE gives bandwidth and distance and asks minimum frame size — you must calculate round-trip propagation time first.",
      "In 1-persistent CSMA, if two stations are waiting and the channel becomes idle, BOTH transmit simultaneously → guaranteed collision. This is why 1-persistent has LOWER efficiency than p-persistent or non-persistent under high load, despite seeming 'aggressive.'"
    ],
    "pyqIds": ["gate-cse:cn:dl:003", "gate-cse:cn:dl:004"]
  },
  {
    "id": "c-cn-ip-addressing",
    "subjectId": "Computer Networks",
    "chapterId": "cn-network-layer",
    "label": "IP Addressing & Subnetting",
    "kind": "formula",
    "summary": "IPv4: 32 bits, dotted decimal. Classes: A(1-126), B(128-191), C(192-223), D(224-239 multicast), E(240-255). Subnet mask: identifies network vs host portion. Subnet ID = IP AND mask. Broadcast = Subnet ID OR NOT(mask). CIDR: a.b.c.d/n, n = network bits. Hosts per subnet = 2^(32-n) - 2 (subtract network and broadcast addresses).",
    "formula": "\\text{Hosts} = 2^{32-n} - 2, \\quad \\text{Subnet ID} = \\text{IP} \\land \\text{Mask}",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "Subnet ID 0 and all-1s subnet were traditionally not allowed (RFC 950), but modern practice (RFC 1878) allows them. GATE sometimes tests the old rule and sometimes the new — read the question's context. For 'maximum usable subnets' with the old rule, subtract 2 from total subnets.",
      "/31 subnet (2 addresses, no host bits) is valid for point-to-point links per RFC 3021 — the '-2' rule doesn't apply. GATE has tested this edge case: a /31 has 2 usable addresses (no network/broadcast subtraction needed)."
    ],
    "pyqIds": ["gate-cse:cn:nl:001", "gate-cse:cn:nl:002"]
  },
  {
    "id": "c-cn-routing",
    "subjectId": "Computer Networks",
    "chapterId": "cn-network-layer",
    "label": "Routing Protocols (RIP, OSPF, BGP)",
    "kind": "definition",
    "summary": "Distance Vector (RIP): each router shares its ENTIRE routing table with neighbors. Uses hop count (max 15, 16 = unreachable). Count-to-infinity problem; solved by split horizon, poison reverse. Link State (OSPF): each router floods its LOCAL link state info to ALL routers; each builds the complete topology using Dijkstra. Converges faster than DV. BGP: path vector protocol for inter-AS routing, uses TCP port 179.",
    "prerequisites": ["c-cn-ip-addressing"],
    "examRelevance": 4,
    "commonTraps": [
      "RIP uses BELLMAN-FORD equation: D(x,y) = min{c(x,v) + D(v,y)} over all neighbors v. The 'count-to-infinity' problem occurs because a router learns a bad route from a neighbor that learned it from it — split horizon prevents advertising a route back on the interface it was learned from, but does NOT solve all count-to-infinity scenarios.",
      "OSPF uses Dijkstra on the complete link-state database (every router has the SAME picture of the network), while RIP uses distributed Bellman-Ford (each router only knows its neighbors' distances). GATE asks 'which protocol uses Dijkstra?' and OSPF is the answer, NOT RIP."
    ],
    "pyqIds": ["gate-cse:cn:nl:003"]
  },
  {
    "id": "c-cn-tcp",
    "subjectId": "Computer Networks",
    "chapterId": "cn-transport-layer",
    "label": "TCP (Header, Connection Management, Reliability)",
    "kind": "definition",
    "summary": "Connection-oriented, reliable, byte-stream, full-duplex. 3-way handshake: SYN→SYN-ACK→ACK. 4-way termination: FIN→ACK→FIN→ACK. Header: 20 bytes min (src/dst port, seq#, ack#, flags, window, checksum, urgent ptr). Reliability: sequence numbers, ACKs, checksum, retransmission timeout (RTO). Flow control: sliding window (receiver advertises window size in header).",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "In the 3-way handshake, the ACK in the third segment ACKs the SYN-ACK (ack# = ISN+1), NOT data. The initial sequence number (ISN) of the server is NOT 0 or 1 — it's randomly generated. GATE asks 'what is the acknowledgment number in the third handshake segment?' — it's server's ISN + 1.",
      "TCP's FIN segment consumes ONE sequence number, just like a SYN. After sending FIN with seq=x, the next expected ACK is x+1. GATE gives a sequence of segments and asks for the ACK number after FIN — students forget to add 1 for the FIN itself."
    ],
    "pyqIds": ["gate-cse:cn:tl:001", "gate-cse:cn:tl:002"]
  },
  {
    "id": "c-cn-congestion-control",
    "subjectId": "Computer Networks",
    "chapterId": "cn-transport-layer",
    "label": "TCP Congestion Control (Slow Start, AIMD)",
    "kind": "algorithm",
    "summary": "Maintains congestion window (cwnd). Slow Start: cwnd starts at 1 MSS, doubles each RTT (exponential growth) until ssthresh. Congestion Avoidance: cwnd increases by 1 MSS per RTT (linear, additive increase). On timeout: ssthresh = cwnd/2, cwnd = 1 MSS, restart slow start. On 3 duplicate ACKs (Tahoe): ssthresh = cwnd/2, cwnd = ssthresh, enter congestion avoidance. On 3 dup ACKs (Reno): ssthresh = cwnd/2, cwnd = ssthresh, fast recovery (inflate cwnd by 3 for the 3 ACKs received).",
    "prerequisites": ["c-cn-tcp"],
    "examRelevance": 5,
    "commonTraps": [
      "TCP Reno vs Tahoe: on triple duplicate ACKs, Tahoe resets cwnd to 1 (slow start), Reno sets cwnd to ssthresh (fast recovery). GATE specifically tests this difference — if the question says 'Reno' and triple dup ACKs occur, cwnd goes to ssthresh, NOT to 1.",
      "In slow start, cwnd doubles EVERY RTT, not every segment. If cwnd=4 and an ACK arrives, cwnd becomes 5 (increment by 1 MSS per ACK), not 8. The doubling happens over a full RTT of ACKs. Misunderstanding per-ACK vs per-RTT growth is the most common numerical error."
    ],
    "pyqIds": ["gate-cse:cn:tl:003", "gate-cse:cn:tl:004"]
  },
  {
    "id": "c-cn-dns",
    "subjectId": "Computer Networks",
    "chapterId": "cn-application-layer",
    "label": "DNS (Domain Name System)",
    "kind": "definition",
    "summary": "Hierarchical, distributed database mapping domain names to IP addresses. Uses UDP port 53 for queries, TCP port 53 for zone transfers. Record types: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail server), NS (name server). Resolution: recursive (client asks resolver to do all work) vs iterative (resolver returns next server to ask). Caching reduces load with TTL.",
    "prerequisites": [],
    "examRelevance": 4,
    "commonTraps": [
      "DNS uses UDP (not TCP) for standard queries because UDP is faster and DNS handles its own reliability via retransmission. TCP is used ONLY for zone transfers between name servers. GATE asks 'which transport protocol does DNS use for queries?' — UDP is the answer.",
      "A CNAME record cannot coexist with any other record type for the same name. If you have CNAME for example.com, you cannot also have an MX record for example.com — the MX must be on the CNAME target. GATE tests this incompatibility."
    ],
    "pyqIds": ["gate-cse:cn:al:001"]
  },
  {
    "id": "c-toc-dfa-nfa",
    "subjectId": "Theory of Computation",
    "chapterId": "toc-regular-languages",
    "label": "DFA & NFA (Deterministic vs Non-deterministic)",
    "kind": "definition",
    "summary": "DFA: for each state and input symbol, exactly ONE transition. NFA: zero or more transitions per state-symbol pair. NFA with ε-transitions (ε-NFA): can change state without consuming input. Equivalence: for every NFA/ε-NFA, there exists an equivalent DFA. Subset construction: each DFA state = subset of NFA states. NFA can have up to 2ⁿ DFA states.",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "Every DFA IS an NFA (deterministic is a special case of non-deterministic), but the converse is not true. GATE asks 'which of the following is true?' and 'every NFA can be converted to an equivalent DFA' is correct, while 'every DFA can be converted to an equivalent NFA' is misleadingly trivial but technically true.",
      "In ε-NFA to DFA conversion, the ε-closure of a state includes the state itself PLUS all states reachable via ε-transitions (transitively). Forgetting to include the starting state itself in its own ε-closure is a common error."
    ],
    "pyqIds": ["gate-cse:toc:fa:001", "gate-cse:toc:fa:002"]
  },
  {
    "id": "c-toc-regex",
    "subjectId": "Theory of Computation",
    "chapterId": "toc-regular-languages",
    "label": "Regular Expressions & Arden's Theorem",
    "kind": "definition",
    "summary": "Base: ε, ∅, a (for each symbol a). Operations: union (R1+R2), concatenation (R1·R2), Kleene star (R*). R+ = RR*. Arden's theorem: if P = Q + PR, then P = Q R*. Used to solve linear equations for converting DFA to regex. Every regex has an equivalent NFA/DFA and vice versa.",
    "formula": "P = Q + PR \\implies P = QR^* \\text{ (Arden's Theorem)}",
    "prerequisites": ["c-toc-dfa-nfa"],
    "examRelevance": 4,
    "commonTraps": [
      "Arden's theorem requires that R does NOT contain ε (or more precisely, that Q and R do not share a common prefix that causes ambiguity). If R generates ε, then P = QR* may not be the unique solution. GATE tests cases where Arden's is directly applicable vs where it isn't.",
      "The regex (a+b)* and (a*b*)* both generate ALL strings over {a,b}, but the regex a*b* does NOT (it generates only strings with all a's before all b's). GATE asks 'which of these regex pairs are equivalent?' and tests subtle differences like this."
    ],
    "pyqIds": ["gate-cse:toc:fa:003"]
  },
  {
    "id": "c-toc-regular-closure",
    "subjectId": "Theory of Computation",
    "chapterId": "toc-regular-languages",
    "label": "Closure Properties of Regular Languages",
    "kind": "definition",
    "summary": "CLOSED under: union, intersection, complement, difference, concatenation, Kleene star, reversal, homomorphism, inverse homomorphism. NOT closed under: subset, superset, infinite union, infinite intersection. Decision properties: emptiness, finiteness, membership, equivalence — all decidable for regular languages. Pumping lemma: necessary condition for regularity (used to prove NOT regular).",
    "prerequisites": ["c-toc-dfa-nfa", "c-toc-regex"],
    "examRelevance": 5,
    "commonTraps": [
      "Regular languages ARE closed under intersection (via De Morgan: L1∩L2 = complement(complement(L1) ∪ complement(L2)), and regular languages are closed under complement and union). GATE asks 'which of these is regular languages NOT closed under?' and 'subset' is the answer, NOT 'intersection.'",
      "Pumping lemma can prove a language is NOT regular, but CANNOT prove it IS regular. A language satisfying the pumping lemma condition may still be non-regular. GATE gives a language that passes the pumping lemma test and asks 'is it regular?' — the answer is 'not necessarily.'"
    ],
    "pyqIds": ["gate-cse:toc:fa:004", "gate-cse:toc:fa:005"]
  },
  {
    "id": "c-toc-dfa-minimization",
    "subjectId": "Theory of Computation",
    "chapterId": "toc-regular-languages",
    "label": "DFA Minimization (Myhill-Nerode & Table-Filling)",
    "kind": "algorithm",
    "summary": "Two states are distinguishable if there exists a string that takes one to a final state and the other to a non-final state. Table-filling algorithm: mark all (final, non-final) pairs as distinguishable, then iteratively mark pairs whose transitions go to already-marked pairs. Unmarked pairs are equivalent and can be merged. Result is the UNIQUE minimal DFA for the language.",
    "complexity": "O(n²k) where n = states, k = alphabet size",
    "prerequisites": ["c-toc-dfa-nfa"],
    "examRelevance": 4,
    "commonTraps": [
      "The minimal DFA is UNIQUE up to isomorphism (renaming of states). GATE asks 'how many states in the minimal DFA for language L?' and there's exactly one correct number. If two students get different answers, at most one is right.",
      "Dead/unreachable states must be removed BEFORE minimization, not after. The table-filling algorithm doesn't automatically remove unreachable states — if a dead state is reachable, it participates in minimization. GATE gives a DFA with unreachable states and asks for the minimal DFA size."
    ],
    "pyqIds": ["gate-cse:toc:fa:006"]
  },
  {
    "id": "c-toc-cfg-pda",
    "subjectId": "Theory of Computation",
    "chapterId": "toc-context-free-languages",
    "label": "CFG & Push-Down Automata (PDA)",
    "kind": "definition",
    "summary": "CFG: variables → strings of variables and terminals. Derivation: leftmost (always replace leftmost variable) or rightmost. Parse tree: tree representation of derivation. Ambiguity: a string with two or more different parse trees (or leftmost derivations). PDA: NFA + stack. Acceptance: by final state OR by empty stack (equivalent in power). Every CFG has an equivalent PDA and vice versa.",
    "prerequisites": ["c-toc-dfa-nfa"],
    "examRelevance": 5,
    "commonTraps": [
      "Acceptance by empty stack and acceptance by final state are EQUIVALENT for PDAs (unlike finite automata where the acceptance criterion doesn't matter). But the constructions to convert between them add new states. GATE asks 'are empty-stack and final-state PDAs equivalent?' — yes, unlike DFAs where this is trivial, for PDAs it's a non-trivial theorem.",
      "A language is context-free if and only if some PDA accepts it. But a SPECIFIC PDA may accept by empty stack or by final state — the two criteria define the same CLASS of languages even though individual PDAs differ."
    ],
    "pyqIds": ["gate-cse:toc:cfl:001", "gate-cse:toc:cfl:002"]
  },
  {
    "id": "c-toc-cfl-closure",
    "subjectId": "Theory of Computation",
    "chapterId": "toc-context-free-languages",
    "label": "Closure Properties of CFLs",
    "kind": "definition",
    "summary": "CLOSED under: union, concatenation, Kleene star, reversal, homomorphism, inverse homomorphism, intersection with regular language. NOT closed under: complement, intersection, difference. Decision properties: membership (CYK algorithm, O(n³)), emptiness (decidable), finiteness (decidable). Equivalence and ambiguity are UNDECIDABLE for CFLs.",
    "prerequisites": ["c-toc-cfg-pda"],
    "examRelevance": 5,
    "commonTraps": [
      "CFLs are NOT closed under complement or intersection — this is the most frequently tested fact. But L1 ∩ L2 CAN be context-free for SPECIFIC L1, L2 (e.g., if one is regular). GATE asks 'is L1 ∩ L2 always context-free if L1 and L2 are?' — NO. 'Can it SOMETIMES be?' — YES.",
      "CFLs are closed under intersection with a REGULAR language (L_CFL ∩ L_REG = CFL). GATE gives L = {aⁿbⁿcⁱ} ∩ {a*b*c*} and asks if it's context-free — yes, because the second language is regular, and the intersection yields {aⁿbⁿcⁱ} which happens to be CF."
    ],
    "pyqIds": ["gate-cse:toc:cfl:003"]
  },
  {
    "id": "c-toc-ll1-parsing",
    "subjectId": "Theory of Computation",
    "chapterId": "toc-context-free-languages",
    "label": "LL(1) Parsing (FIRST, FOLLOW, Parsing Table)",
    "kind": "algorithm",
    "summary": "LL(1): scans left to right, leftmost derivation, 1 symbol lookahead. FIRST(α): set of terminals that can begin strings derived from α. FOLLOW(A): set of terminals that can appear immediately after A in some derivation. LL(1) condition: for each non-terminal A with productions A→α | β, FIRST(α) ∩ FIRST(β) = ∅, and if ε ∈ FIRST(α), then FIRST(β) ∩ FOLLOW(A) = ∅.",
    "formula": "\\text{LL(1) condition: } \\forall A \\to \\alpha | \\beta, \\quad \\text{FIRST}(\\alpha) \\cap \\text{FIRST}(\\beta) = \\emptyset",
    "prerequisites": ["c-toc-cfg-pda"],
    "examRelevance": 5,
    "commonTraps": [
      "ε is in FIRST(α) if and only if α ⇒* ε. For FIRST(A → aB | ε), FIRST includes {a, ε}. When building the parsing table, if ε ∈ FIRST(α), the production A→α goes in FOLLOW(A) columns too. Forgetting to add ε-productions to FOLLOW columns is the most common table construction error.",
      "Left recursion must be eliminated BEFORE computing FIRST/FOLLOW for LL(1). A → Aα | β becomes A → βA' and A' → αA' | ε. If you don't eliminate left recursion, the parsing table will have multiple entries in the same cell (conflict), and the grammar won't be LL(1) even if the underlying language could be."
    ],
    "pyqIds": ["gate-cse:toc:cfl:004", "gate-cse:toc:cfl:005"]
  },
  {
    "id": "c-toc-lr-parsing",
    "subjectId": "Theory of Computation",
    "chapterId": "toc-context-free-languages",
    "label": "LR Parsing (LR(0), SLR(1), LALR(1), CLR(1))",
    "kind": "algorithm",
    "summary": "LR(k): scans left to right, rightmost derivation in reverse, k symbols lookahead. Items: A → α·β (dot shows progress). LR(0): reduce if item is A → α· (complete item) regardless of lookahead. SLR(1): reduce only if lookahead ∈ FOLLOW(A). CLR(1): each item includes lookahead set [A → α·β, a]. LALR(1): merge CLR(1) states with same core (different lookaheads combined) — may introduce reduce-reduce conflicts not in CLR(1). Power: LR(0) ⊂ SLR(1) ⊂ LALR(1) ⊂ CLR(1).",
    "complexity": "CLR(1) can have exponential states in worst case; LALR(1) has same number as LR(0)",
    "prerequisites": ["c-toc-ll1-parsing"],
    "examRelevance": 5,
    "commonTraps": [
      "LALR(1) is NOT more powerful than SLR(1) in terms of the GRAMMARS it can handle — there exist grammars that are SLR(1) but not LALR(1), and vice versa. Their power is INCOMPARABLE. GATE asks 'which is strictly more powerful?' and the answer is NONE of the pairwise comparisons between SLR and LALR — only CLR(1) is strictly more powerful than both.",
      "A shift-reduce conflict in LR(0) means the grammar is NOT LR(0), but it MIGHT still be SLR(1) or LALR(1) if the conflict is resolved by lookahead. GATE gives an LR(0) item set with a conflict and asks 'is this grammar SLR(1)?' — you must check FOLLOW sets to decide."
    ],
    "pyqIds": ["gate-cse:toc:cfl:006", "gate-cse:toc:cfl:007"]
  },
  {
    "id": "c-toc-turing-machine",
    "subjectId": "Theory of Computation",
    "chapterId": "toc-turing-machines",
    "label": "Turing Machine (Definition & Variants)",
    "kind": "definition",
    "summary": "Infinite tape (read-write), finite control, head moves left/right. Transition: δ(state, symbol) → (new_state, write_symbol, direction). Accepts by final state. Variants: multi-tape TM (equivalent to single-tape), non-deterministic TM (equivalent to deterministic TM — unlike automata), 2-stack PDA (equivalent to TM, unlike 1-stack PDA). Church-Turing thesis: anything computable by any algorithm is computable by a TM.",
    "prerequisites": [],
    "examRelevance": 4,
    "commonTraps": [
      "Unlike DFA/NFA, a non-deterministic TM IS equivalent in power to a deterministic TM — there exists a deterministic TM that simulates the NDTM (via breadth-first search of computation tree). This is a KEY difference from finite automata where NFA and DFA are equivalent but the proof is different.",
      "A 2-stack PDA is equivalent to a TM (one stack simulates the left half of the tape, the other the right half), but a 1-stack PDA is strictly weaker (only context-free languages). GATE asks 'which of these is equivalent to a TM?' and '2-stack PDA' is the answer that surprises people who think all PDAs are equivalent."
    ],
    "pyqIds": ["gate-cse:toc:tm:001"]
  },
  {
    "id": "c-toc-decidability",
    "subjectId": "Theory of Computation",
    "chapterId": "toc-decidability",
    "label": "Decidability & Undecidable Problems",
    "kind": "definition",
    "summary": "A problem is decidable if a TM always halts with correct answer. Recursive (decidable) ⊂ RE (recognizable, TM halts on YES instances). RE but not recursive: TM halts on YES, may loop on NO. Not RE: no TM even recognizes it. Key undecidable problems: halting problem, equivalence of two TMs, whether a CFG is ambiguous, whether a CFL is regular, Post Correspondence Problem (PCP). Rice's theorem: any NON-TRIVIAL property of the language recognized by a TM is undecidable.",
    "prerequisites": ["c-toc-turing-machine"],
    "examRelevance": 5,
    "commonTraps": [
      "Rice's theorem applies to properties of the LANGUAGE accepted by a TM, NOT to properties of the TM itself (like number of states). 'Does TM M have exactly 5 states?' is DECIDABLE (just count states). 'Does TM M accept a finite language?' is UNDECIDABLE (Rice's theorem — non-trivial language property).",
      "Complement of a recursive language is recursive. Complement of an RE-but-not-recursive language is NOT RE (not even recognizable). GATE gives 'L is RE but not recursive, is L̄ RE?' — NO. This is tested very frequently."
    ],
    "pyqIds": ["gate-cse:toc:dec:001", "gate-cse:toc:dec:002"]
  },
  {
    "id": "c-coa-number-systems",
    "subjectId": "Computer Organization & Architecture",
    "chapterId": "coa-number-systems",
    "label": "Number Systems & Conversions",
    "kind": "formula",
    "summary": "Binary (base 2), Octal (base 8), Hexadecimal (base 16). Conversion: binary↔octal (group 3 bits), binary↔hex (group 4 bits). 1's complement: flip all bits. 2's complement: 1's complement + 1. Range of n-bit 2's complement: -2^(n-1) to 2^(n-1)-1. Sign extension: replicate MSB to fill additional bits.",
    "formula": "[-x]_{2's} = 2^n - x, \\quad \\text{Range: } [-2^{n-1}, 2^{n-1}-1]",
    "prerequisites": [],
    "examRelevance": 4,
    "commonTraps": [
      "2's complement of the MOST NEGATIVE number (-2^(n-1)) is ITSELF (e.g., in 8-bit, -128's 2's complement is -128, because 256-128=128, and 128 in 8-bit 2's complement IS -128). GATE tests this edge case: 'what is the 2's complement of -128 in 8 bits?' — it's -128.",
      "Sign extension preserves VALUE in 2's complement: extending 1011 (4-bit, = -5) to 11111011 (8-bit) still = -5. But sign extension does NOT preserve value in 1's complement for negative numbers. GATE tests which representation preserves value under sign extension."
    ],
    "pyqIds": ["gate-cse:coa:num:001"]
  },
  {
    "id": "c-coa-ieee754",
    "subjectId": "Computer Organization & Architecture",
    "chapterId": "coa-number-systems",
    "label": "IEEE 754 Floating Point Representation",
    "kind": "formula",
    "summary": "Single precision (32-bit): 1 sign + 8 exponent (bias 127) + 23 mantissa (implicit leading 1). Value: (-1)^s × 1.mantissa × 2^(exponent-127). Special: exponent=0, mantissa=0 → ±0; exponent=255, mantissa=0 → ±∞; exponent=255, mantissa≠0 → NaN; exponent=0, mantissa≠0 → denormalized (no implicit 1). Double precision: 1+11+52 bits, bias 1023.",
    "formula": "V = (-1)^s \\times 1.M \\times 2^{E-127} \\text{ (normalized)}, \\quad V = (-1)^s \\times 0.M \\times 2^{1-127} \\text{ (denormalized)}",
    "prerequisites": ["c-coa-number-systems"],
    "examRelevance": 5,
    "commonTraps": [
      "Denormalized numbers (exponent=0, mantissa≠0) do NOT have the implicit leading 1 — the leading bit IS 0. This means denormalized numbers have LESS precision and SMALLER magnitude than the smallest normalized number. GATE asks 'what is the largest denormalized number?' and you must use 0.M × 2^(-126), not 1.M × 2^(-127).",
      "The gap between consecutive floating-point numbers INCREASES with magnitude (because the exponent is larger but mantissa has fixed precision). Near zero, numbers are dense; near the max, they're sparse. GATE asks 'where are floating-point numbers most dense?' — near zero."
    ],
    "pyqIds": ["gate-cse:coa:num:002", "gate-cse:coa:num:003"]
  },
  {
    "id": "c-coa-addressing-modes",
    "subjectId": "Computer Organization & Architecture",
    "chapterId": "coa-instruction-set",
    "label": "Addressing Modes",
    "kind": "definition",
    "summary": "Immediate: operand is in the instruction itself. Register: operand is in a register. Direct (Absolute): address is in the instruction. Indirect: address points to a location containing the effective address. Register Indirect: register contains the effective address. Displacement (Indexed/Base): EA = register + offset. PC-relative: EA = PC + offset (used for branches). Stack: operand is on top of stack.",
    "prerequisites": [],
    "examRelevance": 4,
    "commonTraps": [
      "In PC-relative addressing, the PC value used is typically PC + 2 (or PC + 4 in RISC) — the address of the NEXT instruction, not the current one. GATE gives an instruction at address 1000 with displacement -50 and asks the effective address — if PC is already incremented to 1002, EA = 1002 + (-50) = 952, NOT 1000 + (-50) = 950.",
      "Auto-increment and auto-decrement addressing modes modify the register AFTER or BEFORE accessing memory. Pre-decrement: first decrement, then use. Post-increment: first use, then increment. GATE gives a sequence of operations and asks the final register value — getting the order wrong (pre vs post) is the standard error."
    ],
    "pyqIds": ["gate-cse:coa:is:001"]
  },
  {
    "id": "c-coa-pipelining-basics",
    "subjectId": "Computer Organization & Architecture",
    "chapterId": "coa-pipelining",
    "label": "Instruction Pipelining (Stages & Throughput)",
    "kind": "definition",
    "summary": "Divide instruction execution into stages (IF, ID, EX, MEM, WB). Each stage takes 1 clock cycle (ideally). Pipeline throughput: 1 instruction per cycle (after filling). Speedup: k-stage pipeline ≈ k (for large n instructions). Pipeline register/latch between stages. Cycle time = max(stage delays) + register delay. Hazards reduce actual speedup.",
    "formula": "\\text{Speedup} = \\frac{n \\times k}{k + (n-1)} \\xrightarrow{n \\to \\infty} k",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "Pipeline speedup is k only asymptotically (n→∞). For small n, speedup is LESS than k due to fill/drain overhead. GATE asks 'speedup for 5 instructions in a 5-stage pipeline' — answer is 25/9 ≈ 2.78, NOT 5.",
      "The pipeline cycle time is determined by the SLOWEST stage + register overhead, NOT the average stage time. If stages take 5, 3, 4, 3, 2 ns and register delay is 1 ns, cycle time = 5+1 = 6 ns. GATE tests that you use the MAX, not the average."
    ],
    "pyqIds": ["gate-cse:coa:pipe:001"]
  },
  {
    "id": "c-coa-pipeline-hazards",
    "subjectId": "Computer Organization & Architecture",
    "chapterId": "coa-pipelining",
    "label": "Pipeline Hazards & Forwarding",
    "kind": "definition",
    "summary": "Data hazard: instruction depends on result of a previous instruction not yet available. Structural hazard: two instructions need the same hardware resource simultaneously. Control hazard: branch/jump changes PC, but next instruction is already fetched. Forwarding (bypassing): route result directly from EX/MEM stage to a later stage's ALU input, avoiding stalls. Stall (bubble): insert NOP to wait for result. Branch prediction: guess branch outcome to reduce control hazard stalls.",
    "prerequisites": ["c-coa-pipelining-basics"],
    "examRelevance": 5,
    "commonTraps": [
      "Load-use hazard: an instruction immediately after a LOAD needs the loaded data, but it's not available until after MEM stage — forwarding alone CANNOT solve this (data isn't ready at EX time). A 1-cycle stall is REQUIRED even with forwarding. GATE specifically tests 'with full forwarding, how many stalls for LOAD followed by USE?' — 1 stall, not 0.",
      "Control hazard without branch prediction: always flush 1 instruction (the one fetched after the branch). With prediction: if prediction correct, 0 stalls; if wrong, flush the wrongly fetched instructions (typically 1-3 cycles penalty). GATE gives a branch prediction accuracy and asks effective CPI."
    ],
    "pyqIds": ["gate-cse:coa:pipe:002", "gate-cse:coa:pipe:003"]
  },
  {
    "id": "c-coa-cache-mapping",
    "subjectId": "Computer Organization & Architecture",
    "chapterId": "coa-memory-hierarchy",
    "label": "Cache Mapping (Direct, Set-Associative, Fully Associative)",
    "kind": "formula",
    "summary": "Direct mapped: block i of memory maps to cache line (i mod number_of_lines). Set-associative: cache divided into sets, each set has k lines (k-way). Block maps to set (i mod number_of_sets), can go in ANY line within that set. Fully associative: block can go in ANY line. Address breakdown: tag | set/index | block offset | byte offset.",
    "formula": "\\text{Direct: line} = \\text{block} \\bmod L, \\quad \\text{Set-assoc: set} = \\text{block} \\bmod S, \\quad S = L/k",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "In set-associative cache, the REPLACEMENT POLICY within a set matters (LRU, FIFO, random) — but in DIRECT-MAPPED cache there is NO replacement decision (each block has exactly one possible location). GATE asks 'which replacement policy is used in direct-mapped cache?' — NONE, it's not applicable.",
      "Cache size = number_of_lines × line_size, NOT number_of_sets × line_size × associativity (that double-counts). For a 4-way set-associative cache with 64 sets and 64-byte lines: size = 64 × 4 × 64 = 16384 bytes, NOT 64 × 64 × 4 × 64."
    ],
    "pyqIds": ["gate-cse:coa:cache:001", "gate-cse:coa:cache:002"]
  },
  {
    "id": "c-coa-cache-performance",
    "subjectId": "Computer Organization & Architecture",
    "chapterId": "coa-memory-hierarchy",
    "label": "Cache Performance (Hit Rate, AMAT)",
    "kind": "formula",
    "summary": "Hit rate: fraction of accesses that hit in cache. Miss rate = 1 - hit rate. Average Memory Access Time (AMAT) = hit_time + miss_rate × miss_penalty. Multi-level cache: AMAT = hit_time_L1 + miss_rate_L1 × (hit_time_L2 + miss_rate_L2 × miss_penalty_L2). Miss types: compulsory (first access), capacity (cache full, victim evicted), conflict (set full in set-associative, wouldn't miss in fully-associative of same size).",
    "formula": "\\text{AMAT} = t_{\\text{hit}} + (1-h) \\times t_{\\text{miss}}",
    "prerequisites": ["c-coa-cache-mapping"],
    "examRelevance": 5,
    "commonTraps": [
      "In multi-level cache AMAT, the L2 hit time is ONLY incurred on L1 misses (it's part of the miss penalty of L1). Students sometimes add L2 hit time unconditionally. GATE: AMAT = t_L1 + (1-h_L1) × [t_L2 + (1-h_L2) × t_mem], NOT t_L1 + t_L2 + ...",
      "A conflict miss occurs in set-associative cache but would NOT occur in a fully-associative cache of the SAME total size. If increasing associativity eliminates a miss, it was a conflict miss. GATE gives a trace and asks 'how many misses are conflict misses?' — compare against fully-associative behavior."
    ],
    "pyqIds": ["gate-cse:coa:cache:003", "gate-cse:coa:cache:004"]
  },
  {
    "id": "c-coa-virtual-memory",
    "subjectId": "Computer Organization & Architecture",
    "chapterId": "coa-virtual-memory",
    "label": "Virtual Memory (Page Table, TLB)",
    "kind": "formula",
    "summary": "Virtual address space divided into pages, physical memory into frames. Page table: maps virtual page number → physical frame number. Multi-level page tables: only allocate table pages for address ranges actually used. TLB: caches recent page table entries in hardware. Effective access time depends on TLB hit ratio, page fault rate, and memory/disk access times.",
    "formula": "\\text{EAT} = h(t_{\\text{TLB}}+t_{\\text{mem}}) + (1-h)(t_{\\text{TLB}}+t_{\\text{mem}}+t_{\\text{mem}}) + p \\cdot t_{\\text{disk}}",
    "prerequisites": ["c-coa-cache-mapping"],
    "examRelevance": 5,
    "commonTraps": [
      "On a TLB miss, the TLB lookup time is STILL PAID (you check TLB first, it misses, then you go to page table). The miss path cost = TLB time + page table access + memory access. Students often write miss cost as just '2 × memory access' without the TLB time — the TLB check happens in BOTH hit and miss paths.",
      "In a two-level page table, the FIRST level table is ALWAYS in memory (one page per process for the top level). The SECOND level tables are only allocated for address ranges that are actually used. GATE asks 'minimum number of page table pages required' — you must count only the levels that are actually needed for the given address ranges."
    ],
    "pyqIds": ["gate-cse:coa:vm:001", "gate-cse:coa:vm:002"]
  },
  {
    "id": "c-coa-io-mechanisms",
    "subjectId": "Computer Organization & Architecture",
    "chapterId": "coa-io-systems",
    "label": "I/O Mechanisms (Programmed, Interrupt, DMA)",
    "kind": "definition",
    "summary": "Programmed I/O: CPU polls device status register in a loop — wastes CPU cycles. Interrupt-driven I/O: device raises interrupt when ready — CPU can do other work. DMA (Direct Memory Access): special DMA controller transfers data between I/O device and memory directly, CPU only involved at start and end. DMA steals cycles from CPU (cycle stealing) or uses burst mode.",
    "prerequisites": [],
    "examRelevance": 3,
    "commonTraps": [
      "DMA transfers are between DEVICE and MEMORY, not between CPU registers and memory. The CPU is NOT involved in the actual data transfer — only in setting up the DMA controller (start address, count, direction) and handling completion interrupt. GATE asks 'during DMA transfer, the CPU is:' — idle or doing other work, NOT transferring data.",
      "In cycle-stealing DMA, the DMA controller uses bus cycles that would otherwise be used by the CPU, one cycle at a time. In burst DMA, it takes the bus for a contiguous block of cycles. Cycle stealing SLOWS the CPU but doesn't stop it; burst mode STOPS the CPU for the transfer duration."
    ],
    "pyqIds": []
  },
  {
    "id": "c-coa-performance",
    "subjectId": "Computer Organization & Architecture",
    "chapterId": "coa-performance",
    "label": "Processor Performance (CPI, MIPS, Amdahl's Law)",
    "kind": "formula",
    "summary": "CPU time = Instruction count × CPI × Clock cycle time = IC × CPI / Clock rate. CPI = Σ(instruction_type_i × CPI_i) / total_instructions. MIPS = IC / (CPU_time × 10⁶). Amdahl's Law: speedup = 1 / ((1-f) + f/s) where f = fraction enhanced, s = speedup of enhanced part. MFLOPS = floating-point operations / (execution time × 10⁶).",
    "formula": "\\text{CPU Time} = \\frac{IC \\times CPI}{f}, \\quad S = \\frac{1}{(1-f) + f/s} \\text{ (Amdahl's Law)}",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "Amdahl's Law sets an UPPER BOUND on speedup regardless of how much you improve the enhanced portion. As s→∞, speedup → 1/(1-f). If 60% of a program is parallelizable, maximum speedup = 1/0.4 = 2.5× even with infinite processors. GATE asks 'what is the maximum possible speedup?' and students answer 'infinity' instead of 1/(1-f).",
      "MIPS is a MISLEADING metric: it depends on the instruction mix (simpler instructions → higher MIPS but not necessarily faster execution). A program with many simple instructions can have high MIPS but longer execution time than one with fewer complex instructions. GATE tests 'can MIPS decrease while performance increases?' — YES."
    ],
    "pyqIds": ["gate-cse:coa:perf:001", "gate-cse:coa:perf:002"]
  },
  {
    "id": "c-em-matrices-determinants",
    "subjectId": "Engineering Mathematics",
    "chapterId": "em-linear-algebra",
    "label": "Matrices, Determinants & Systems of Linear Equations",
    "kind": "formula",
    "summary": "Matrix operations: addition, multiplication (rows × columns), transpose. Determinant: scalar value, det(AB)=det(A)det(B), det(A^T)=det(A). Inverse exists iff det(A)≠0: A⁻¹ = adj(A)/det(A). System Ax=b: unique solution if det(A)≠0, infinitely many or no solution if det(A)=0 (use rank analysis). Rank = maximum number of linearly independent rows/columns.",
    "formula": "A^{-1} = \\frac{\\text{adj}(A)}{\\det(A)}, \\quad \\text{Cramer's Rule: } x_i = \\frac{\\det(A_i)}{\\det(A)}",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "det(A+B) ≠ det(A) + det(B) in general — this is the most common matrix algebra error. GATE directly tests this: 'which of the following is always true?' and det(A+B) = det(A)+det(B) is always a WRONG option.",
      "Rank of a matrix is the SAME whether computed from rows or columns. If rank(A) = rank(A|b), the system is CONSISTENT (has at least one solution). If rank(A) = rank(A|b) = number of unknowns, solution is UNIQUE. GATE gives a matrix and augmented matrix and asks about the nature of solutions."
    ],
    "pyqIds": ["gate-cse:em:la:001"]
  },
  {
    "id": "c-em-eigenvalues",
    "subjectId": "Engineering Mathematics",
    "chapterId": "em-linear-algebra",
    "label": "Eigenvalues & Eigenvectors",
    "kind": "formula",
    "summary": "Av = λv where v≠0. Characteristic equation: det(A - λI) = 0. Sum of eigenvalues = trace(A), product = det(A). Eigenvectors for distinct eigenvalues are linearly independent. Symmetric matrix: real eigenvalues, orthogonal eigenvectors for distinct eigenvalues. Diagonalization: A = PDP⁻¹ where D has eigenvalues on diagonal, if A has n linearly independent eigenvectors.",
    "formula": "\\det(A - \\lambda I) = 0, \\quad \\sum \\lambda_i = \\text{tr}(A), \\quad \\prod \\lambda_i = \\det(A)",
    "prerequisites": ["c-em-matrices-determinants"],
    "examRelevance": 4,
    "commonTraps": [
      "A matrix is diagonalizable if and only if the algebraic multiplicity of EACH eigenvalue equals its geometric multiplicity (dimension of eigenspace). Having n distinct eigenvalues is SUFFICIENT but not NECESSARY for diagonalizability. GATE gives a matrix with repeated eigenvalues and asks if it's diagonalizable — you must check geometric multiplicities.",
      "Eigenvalues of A² are λ² for each eigenvalue λ of A. But eigenvalues of A+B are NOT λ_A + λ_B in general (only if A and B share eigenvectors). GATE asks 'what are the eigenvalues of A² given eigenvalues of A?' — square them. But 'eigenvalues of A+B?' — cannot determine from individual eigenvalues alone."
    ],
    "pyqIds": ["gate-cse:em:la:002"]
  },
  {
    "id": "c-em-lu-decomposition",
    "subjectId": "Engineering Mathematics",
    "chapterId": "em-linear-algebra",
    "label": "LU Decomposition",
    "kind": "formula",
    "summary": "Factor A = LU where L is lower triangular (1s on diagonal) and U is upper triangular. Solving Ax=b: first solve Ly=b (forward substitution), then Ux=y (backward substitution). Exists without pivoting if all leading principal minors are non-zero. Doolittle's method: L has 1s on diagonal. Crout's method: U has 1s on diagonal.",
    "formula": "A = LU, \\quad Ly = b \\text{ (forward sub)}, \\quad Ux = y \\text{ (backward sub)}",
    "prerequisites": ["c-em-matrices-determinants"],
    "examRelevance": 3,
    "commonTraps": [
      "LU decomposition without pivoting may fail even for invertible matrices (e.g., A = [[0,1],[1,0]] has det=-1 but the first pivot is 0). PA = LU (with partial pivoting, P is a permutation matrix) always works for non-singular A. GATE asks 'does LU decomposition always exist for non-singular A?' — NO, not without pivoting.",
      "The determinant of A equals the product of diagonal elements of U (in LU decomposition) times (-1)^k where k is the number of row swaps in pivoting. GATE gives an LU factorization and asks for det(A) — just multiply U's diagonal and account for permutations."
    ],
    "pyqIds": []
  },
  {
    "id": "c-em-calculus-limits-continuity",
    "subjectId": "Engineering Mathematics",
    "chapterId": "em-calculus",
    "label": "Limits, Continuity & Differentiability",
    "kind": "formula",
    "summary": "Limit: lim(x→a) f(x) = L if f(x) approaches L from both sides. L'Hôpital's rule: if lim f/g is 0/0 or ∞/∞, then lim f/g = lim f'/g'. Continuity at a: lim(x→a) f(x) = f(a). Differentiability implies continuity, but continuity does NOT imply differentiability (e.g., |x| at x=0). Mean Value Theorems: Rolle's (f(a)=f(b) → f'(c)=0), Lagrange's (f'(c) = (f(b)-f(a))/(b-a)).",
    "formula": "\\text{L'Hôpital: } \\lim \\frac{f}{g} = \\lim \\frac{f'}{g'}, \\quad \\text{MVT: } f'(c) = \\frac{f(b)-f(a)}{b-a}",
    "prerequisites": [],
    "examRelevance": 4,
    "commonTraps": [
      "L'Hôpital's rule applies ONLY to 0/0 or ∞/∞ forms. Applying it to other forms (like 1/0 → ∞) is INVALID. GATE gives lim(x→0) sin(x)/x and variants — direct substitution gives 0/0 so L'Hôpital applies. But lim(x→∞) x/sin(x) is NOT 0/0 or ∞/∞, so L'Hôpital doesn't apply.",
      "A function can be continuous everywhere but differentiable nowhere (Weierstrass function — though this is too advanced for GATE). The GATE-relevant trap is: f(x)=|x| is continuous at 0 but NOT differentiable at 0 (left derivative = -1, right derivative = +1). If left and right derivatives differ, the function is not differentiable at that point."
    ],
    "pyqIds": ["gate-cse:em:calc:001"]
  },
  {
    "id": "c-em-integration",
    "subjectId": "Engineering Mathematics",
    "chapterId": "em-calculus",
    "label": "Integration (Definite, Indefinite, Properties)",
    "kind": "formula",
    "summary": "Indefinite: ∫f(x)dx = F(x) + C. Definite: ∫(a to b) f(x)dx = F(b) - F(a). Properties: ∫(a to b) = -∫(b to a), ∫(a to c) + ∫(c to b) = ∫(a to b). Methods: substitution, integration by parts (∫u dv = uv - ∫v du), partial fractions. Applications: area under curve, volume of revolution.",
    "formula": "\\int u \\, dv = uv - \\int v \\, du \\text{ (Integration by parts)}",
    "prerequisites": ["c-em-calculus-limits-continuity"],
    "examRelevance": 3,
    "commonTraps": [
      "In integration by parts, choosing u and dv matters for efficiency: LIATE rule (Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential) — choose u as the earlier in this list. Choosing wrong doesn't give a wrong answer but may lead to an infinite loop. GATE rarely tests this directly but it affects speed.",
      "The definite integral ∫(a to b) f(x)dx gives SIGNED area (below x-axis is negative). For TOTAL area, you must split at x-intercepts and take absolute values. GATE asks 'area bounded by the curve and x-axis' — this means total area (absolute), not the definite integral value."
    ],
    "pyqIds": []
  },
  {
    "id": "c-em-maxima-minima",
    "subjectId": "Engineering Mathematics",
    "chapterId": "em-calculus",
    "label": "Maxima, Minima & Optimization",
    "kind": "formula",
    "summary": "Critical points: f'(x) = 0 or f'(x) undefined. Second derivative test: f''(x₀) > 0 → local minimum, f''(x₀) < 0 → local maximum, f''(x₀) = 0 → inconclusive (use first derivative test or higher derivatives). Global extrema: compare critical point values with endpoint values on a closed interval. For multivariable: gradient = 0, Hessian matrix determinant test.",
    "formula": "f''(x_0) > 0 \\Rightarrow \\text{min}, \\quad f''(x_0) < 0 \\Rightarrow \\text{max}, \\quad D = f_{xx}f_{yy} - f_{xy}^2 \\text{ (2D)}",
    "prerequisites": ["c-em-calculus-limits-continuity"],
    "examRelevance": 3,
    "commonTraps": [
      "A critical point where f''(x₀) = 0 could be a max, min, or NEITHER (saddle/inflection point). GATE gives f(x) = x⁴ at x=0: f'(0)=0, f''(0)=0, but it's a minimum (fourth derivative test or direct analysis needed). The second derivative test is INCONCLUSIVE here, not 'neither.'",
      "For constrained optimization (maximize f subject to g=0), use Lagrange multipliers: ∇f = λ∇g. The Lagrange multiplier λ itself has meaning (rate of change of optimal value with respect to constraint), but GATE typically just asks for the optimal point coordinates."
    ],
    "pyqIds": []
  },
  {
    "id": "c-em-probability-basics",
    "subjectId": "Engineering Mathematics",
    "chapterId": "em-probability-statistics",
    "label": "Probability (Axioms, Conditional, Bayes)",
    "kind": "formula",
    "summary": "Axioms: P(E) ∈ [0,1], P(S)=1, P(A∪B)=P(A)+P(B) for disjoint A,B. Conditional: P(A|B)=P(A∩B)/P(B), P(B)>0. Bayes: P(Ai|B) = P(B|Ai)P(Ai) / ΣP(B|Aj)P(Aj). Independence: P(A∩B)=P(A)P(B). Pairwise independence does NOT imply mutual independence.",
    "formula": "P(A_i|B) = \\frac{P(B|A_i) \\cdot P(A_i)}{\\sum_j P(B|A_j) \\cdot P(A_j)} \\text{ (Bayes' Theorem)}",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "Bayes' theorem requires NORMALIZATION (dividing by the total probability of evidence). Forgetting the denominator is the most common computational error. GATE gives P(B|A₁), P(B|A₂), P(A₁), P(A₂) and asks P(A₁|B) — you must compute the full denominator P(B) = P(B|A₁)P(A₁) + P(B|A₂)P(A₂).",
      "Three events can be pairwise independent but NOT mutually independent: if P(A∩B∩C) ≠ P(A)P(B)P(C). GATE constructs counterexamples where all pairs are independent but the triple isn't — 'are A, B, C independent?' requires checking ALL combinations including the triple intersection."
    ],
    "pyqIds": ["gate-cse:em:prob:001", "gate-cse:em:prob:002"]
  },
  {
    "id": "c-em-random-variables",
    "subjectId": "Engineering Mathematics",
    "chapterId": "em-probability-statistics",
    "label": "Random Variables & Distributions",
    "kind": "formula",
    "summary": "Discrete RV: PMF p(x) = P(X=x), Σp(x)=1. Continuous RV: PDF f(x), ∫f(x)dx=1, P(a≤X≤b)=∫(a to b)f(x)dx. CDF: F(x)=P(X≤x). Expected value: E[X]=Σx·p(x) or ∫x·f(x)dx. Variance: Var(X)=E[X²]-(E[X])². Key distributions: Uniform, Binomial(n,p), Poisson(λ), Normal(μ,σ²), Exponential(λ).",
    "formula": "E[X] = \\mu, \\quad \\text{Var}(X) = E[X^2] - \\mu^2 = \\sigma^2, \\quad f_{\\text{Normal}} = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}",
    "prerequisites": ["c-em-probability-basics"],
    "examRelevance": 5,
    "commonTraps": [
      "For a CONTINUOUS RV, P(X=x)=0 for any specific x — probability is only defined over INTERVALS. GATE asks 'P(X=3) for a continuous uniform RV on [0,10]' — the answer is 0, not 0.1.",
      "Memoryless property: P(X > s+t | X > s) = P(X > t) holds ONLY for Exponential distribution among continuous distributions, and ONLY for Geometric among discrete. GATE asks 'which distribution is memoryless?' and both Exponential and Geometric are valid answers depending on whether the question specifies discrete or continuous."
    ],
    "pyqIds": ["gate-cse:em:prob:003"]
  },
  {
    "id": "c-dl-boolean-algebra",
    "subjectId": "Digital Logic",
    "chapterId": "dl-boolean-algebra",
    "label": "Boolean Algebra (Laws & Theorems)",
    "kind": "definition",
    "summary": "Values: 0, 1. Operations: AND (·), OR (+), NOT ('). Identity: x+0=x, x·1=x. Null: x+1=1, x·0=0. Idempotent: x+x=x, x·x=x. Complement: x+x'=1, x·x'=0. De Morgan: (x+y)'=x'·y', (x·y)'=x'+y'. Absorption: x+xy=x, x(x+y)=x. Consensus: xy+x'z+yz = xy+x'z.",
    "formula": "(x+y)' = x' \\cdot y', \\quad (xy)' = x' + y', \\quad xy + x'z + yz = xy + x'z",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "Consensus theorem: xy + x'z + yz = xy + x'z (the term yz is redundant). GATE asks 'which term is redundant in this expression?' — the consensus term. But note: the consensus theorem is an EQUALITY, meaning you can both ADD and REMOVE the consensus term. GATE sometimes asks 'which term can be ADDED without changing the function?' — same answer.",
      "XOR is NOT a basic Boolean operation (it's derived: x⊕y = xy'+x'y). De Morgan's laws apply to AND and OR, NOT to XOR: (x⊕y)' ≠ x'⊕y'. The correct complement: (x⊕y)' = x⊕y' = x'⊕y = x⊙y (XNOR). GATE tests XOR complement properties."
    ],
    "pyqIds": ["gate-cse:dl:bool:001"]
  },
  {
    "id": "c-dl-kmap",
    "subjectId": "Digital Logic",
    "chapterId": "dl-boolean-algebra",
    "label": "K-Map & Quine-McCluskey Minimization",
    "kind": "algorithm",
    "summary": "K-Map: visual grouping of adjacent 1s (or 0s for POS) in powers of 2 (1, 2, 4, 8...). 3-variable: 8 cells, 4-variable: 16 cells. Adjacency wraps around edges. Don't cares (X): can be 0 or 1 to maximize group size. Quine-McCluskey: tabular method for more than 4 variables. Compare minterms differing in 1 bit, combine, repeat until no more combinations. Prime implicants → essential prime implicants → minimal cover.",
    "prerequisites": ["c-dl-boolean-algebra"],
    "examRelevance": 5,
    "commonTraps": [
      "In a 4-variable K-map, cells at OPPOSITE edges are adjacent (top-bottom wrap, left-right wrap), and ALL FOUR CORNERS form a single group of 4. GATE asks 'which of these is a valid group of 4?' and the four corners is the surprising valid answer that students miss.",
      "Don't cares should be included in groups ONLY if they help make the group LARGER. A don't care that doesn't contribute to any essential prime implicant can be left as 0. GATE gives a K-map with don't cares and asks for the minimal SOP — the don't cares may or may not be included depending on whether they enlarge a group."
    ],
    "pyqIds": ["gate-cse:dl:bool:002", "gate-cse:dl:bool:003"]
  },
  {
    "id": "c-dl-combinational",
    "subjectId": "Digital Logic",
    "chapterId": "dl-combinational-circuits",
    "label": "Combinational Circuits (Multiplexers, Decoders, Adders)",
    "kind": "definition",
    "summary": "Multiplexer (MUX): 2^n inputs, n select lines, 1 output. Can implement ANY Boolean function by tying inputs to 0/1/variables. Decoder: n inputs, 2^n outputs (one active at a time). Adders: half adder (sum, carry), full adder (sum = A⊕B⊕Cin, carry = AB+BCin+ACin). Ripple Carry Adder: chain full adders, delay = O(n). Carry Lookahead Adder: computes carry in parallel using generate/propagate.",
    "formula": "P_i = A_i \\oplus B_i, \\quad G_i = A_i \\cdot B_i, \\quad C_{i+1} = G_i + P_i C_i",
    "prerequisites": ["c-dl-boolean-algebra"],
    "examRelevance": 5,
    "commonTraps": [
      "A 2^n:1 MUX can implement ANY n-variable function (with n select lines and 2^n data inputs tied to 0/1/variables). But it can also implement functions of MORE than n variables if some variables are connected to the DATA inputs. GATE asks 'minimum MUX size for f(a,b,c) = ab+c' — a 4:1 MUX (2 select lines) suffices with c on a data input.",
      "In a Ripple Carry Adder, the carry propagates through ALL stages sequentially — the worst-case delay is n × (carry delay). In CLA, the carry is computed in O(1) for each stage using generate/propagate, but the FAN-IN of the logic gates increases, which is the practical limitation. GATE asks 'why don't we use CLA for arbitrarily large adders?' — gate fan-in limitations."
    ],
    "pyqIds": ["gate-cse:dl:comb:001", "gate-cse:dl:comb:002"]
  },
  {
    "id": "c-dl-sequential-basics",
    "subjectId": "Digital Logic",
    "chapterId": "dl-sequential-circuits",
    "label": "Flip-Flops (SR, JK, D, T)",
    "kind": "definition",
    "summary": "SR: S=R=1 is INVALID (for basic NOR latch). JK: J=K=1 TOGGLES (resolves SR invalid state). D: Q(next) = D (data latch). T: Q(next) = Q⊕T (toggles when T=1). Master-slave: eliminates race condition by activating master on clock=HIGH and slave on clock=LOW. Edge-triggered: responds only on clock edge (rising or falling), not level.",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "In a level-triggered SR latch, if S=R=1 and both go to 0 simultaneously, the output is UNPREDICTABLE (metastable). This is why JK flip-flop was invented (J=K=1 toggles instead). GATE asks 'what happens when S=R=1 in a NOR SR latch?' — invalid/forbidden state, NOT toggle.",
      "A D flip-flop with T input connected (D = Q ⊕ T) BEHAVES exactly like a T flip-flop. GATE gives a circuit diagram with a D-FF and XOR gate and asks 'this circuit implements which flip-flop?' — T flip-flop. Similarly, D-FF with D = JQ' + K'Q implements JK."
    ],
    "pyqIds": ["gate-cse:dl:seq:001"]
  },
  {
    "id": "c-dl-counters",
    "subjectId": "Digital Logic",
    "chapterId": "dl-sequential-circuits",
    "label": "Counters (Ripple, Synchronous, Ring, Johnson)",
    "kind": "definition",
    "summary": "Ripple counter: each FF toggles on the falling edge of the previous FF's output — asynchronous, delay accumulates. Mod-N: counts 0 to N-1, resets at N. Synchronous counter: all FFs share the same clock, designed using state table and flip-flop excitation tables. Ring counter: n FFs, one 1 circulates, mod-n. Johnson counter: n FFs, mod-2n, self-decoding outputs.",
    "prerequisites": ["c-dl-sequential-basics"],
    "examRelevance": 4,
    "commonTraps": [
      "A 4-bit ripple counter counts 0-15 (mod-16). To make it mod-10, you detect binary 1010 (10) and reset. But the detection and reset are ASYNCHRONOUS — the counter momentarily reaches 1010 before resetting, causing a glitch on the output. GATE asks 'does a mod-10 ripple counter have glitches?' — yes, due to asynchronous reset.",
      "In a synchronous counter, the MAXIMUM clock frequency is limited by the SINGLE FF propagation delay plus the combinational logic delay for the slowest stage (NOT the sum of all stages like ripple counter). GATE gives propagation delays and asks max clock frequency — use the single worst-case path, not the cumulative."
    ],
    "pyqIds": ["gate-cse:dl:seq:002"]
  },
  {
    "id": "c-dl-state-machines",
    "subjectId": "Digital Logic",
    "chapterId": "dl-sequential-circuits",
    "label": "Finite State Machines (Mealy vs Moore)",
    "kind": "definition",
    "summary": "Moore: output depends ONLY on current state. Mealy: output depends on current state AND current input. Moore has one output per state, Mealy has one output per transition. State diagram: circles = states, labeled arcs = transitions (input/output for Mealy, input for Moore), output in/near state circle for Moore. State minimization: equivalent states can be merged (same next state and output for all inputs).",
    "prerequisites": ["c-dl-sequential-basics"],
    "examRelevance": 4,
    "commonTraps": [
      "A Moore machine typically needs ONE MORE state than an equivalent Mealy machine (because Moore output is associated with the state, not the transition). GATE asks 'minimum states in Moore vs Mealy for the same functionality' — Moore may need one extra state.",
      "State equivalence: two states are equivalent if for EVERY input sequence, they produce the SAME output sequence. The practical test: same output, and for every input, their next states are equivalent (recursive definition). GATE gives a state table and asks which states are equivalent — you must check iteratively, not just one-step next states."
    ],
    "pyqIds": ["gate-cse:dl:seq:003"]
  },
  {
    "id": "c-dl-ieee-arithmetic",
    "subjectId": "Digital Logic",
    "chapterId": "dl-computer-arithmetic",
    "label": "Floating Point Arithmetic (IEEE 754 Operations)",
    "kind": "formula",
    "summary": "Addition: align exponents (shift smaller mantissa right), add mantissas, normalize result, round. Multiplication: add exponents, multiply mantissas, normalize, round. Guard bits: 3 extra bits (guard, round, sticky) kept during computation to ensure correct rounding. Rounding modes: round to nearest (ties to even), round up, round down, round toward zero.",
    "prerequisites": ["c-dl-boolean-algebra"],
    "examRelevance": 3,
    "commonTraps": [
      "When aligning exponents in addition, the smaller number's mantissa is shifted RIGHT (losing precision), NOT the larger number's mantissa shifted left. Shifting right loses LSBs, which is why guard bits are needed. GATE asks 'during floating-point addition, which operand's mantissa is shifted?' — the one with the smaller exponent.",
      "In multiplication, the product of two n-bit normalized mantissas can be up to 2n bits and may need normalization (left shift by 1 if the leading bit is 0 after multiplication of 1.xxx × 1.yyy, which gives 1z.zzz or 0z.zzz). GATE asks 'how many bits for the product mantissa before normalization?' — 2n bits."
    ],
    "pyqIds": []
  },
  {
    "id": "c-cd-lexical-analysis",
    "subjectId": "Compiler Design",
    "chapterId": "cd-lexical-analysis",
    "label": "Lexical Analysis (Tokens, Regex to NFA)",
    "kind": "definition",
    "summary": "Converts source code stream into TOKENS (keyword, identifier, number, operator, delimiter). Strips whitespace/comments. Uses regular expressions for each token type. Regex → NFA (Thompson's construction: one NFA per regex piece, concatenate with ε-transitions) → DFA (subset construction) → minimized DFA for efficient scanning. Longest match rule: if multiple regexes match, choose the longest. Rule priority: if same length, choose the regex listed first.",
    "prerequisites": [],
    "examRelevance": 4,
    "commonTraps": [
      "Longest match rule: for input 'if8', both 'if' (keyword) and 'if8' (identifier) are valid prefixes, but the lexer chooses 'if8' because it's LONGER. GATE gives a specific input and asks which token is produced — you must apply longest match, not first-match.",
      "Thompson's construction produces an NFA with ONE start state, ONE accepting state, and at most 2 transitions per state. It NEVER produces ε-cycles, which means the resulting NFA is always well-behaved for subset construction. GATE asks about properties of Thompson's construction output."
    ],
    "pyqIds": ["gate-cse:cd:lex:001"]
  },
  {
    "id": "c-cd-first-follow",
    "subjectId": "Compiler Design",
    "chapterId": "cd-parsing",
    "label": "FIRST & FOLLOW Computation",
    "kind": "algorithm",
    "summary": "FIRST(X): if X is terminal, {X}. If X→ε, {ε}. If X→Y₁Y₂..., add FIRST(Y₁) minus ε, then if ε∈FIRST(Y₁), add FIRST(Y₂) minus ε, continue. FOLLOW(A): start with $ (if A is start symbol). For each production B→αAβ: add FIRST(β) minus ε to FOLLOW(A). If ε∈FIRST(β) or β doesn't exist, add FOLLOW(B) to FOLLOW(A). $ is never in any FIRST set.",
    "prerequisites": ["c-cd-lexical-analysis"],
    "examRelevance": 5,
    "commonTraps": [
      "ε is in FIRST(α) if and only if α can derive the empty string. But ε is NEVER in FOLLOW(A) — FOLLOW contains only TERMINALS (and $). GATE asks 'which of these can contain ε?' — only FIRST sets can contain ε, FOLLOW sets cannot.",
      "When computing FOLLOW, if A appears at the END of a production (B→αA), then you add FOLLOW(B) to FOLLOW(A) (because whatever can follow B can also follow A). If there's nothing after A (β is empty or doesn't exist), it's the same case. Forgetting to add FOLLOW(B) when A is at the end is the most common error."
    ],
    "pyqIds": ["gate-cse:cd:parse:001", "gate-cse:cd:parse:002"]
  },
  {
    "id": "c-cd-lr0-items",
    "subjectId": "Compiler Design",
    "chapterId": "cd-parsing",
    "label": "LR(0) Items & Closure-Goto",
    "kind": "algorithm",
    "summary": "LR(0) item: A → α·β (dot shows how much of RHS has been seen). Closure of item set: for each item A → α·Bγ, add B → ·δ for all B-productions. Goto(I, X): for each item in I with dot before X, move dot past X, take closure of the result. Canonical collection: start with closure of [S'→·S], repeatedly apply goto for all grammar symbols, collecting all distinct item sets.",
    "prerequisites": ["c-cd-first-follow"],
    "examRelevance": 5,
    "commonTraps": [
      "The CLOSURE operation adds items for NON-TERMINALS that appear IMMEDIATELY AFTER the dot. It does NOT add items for terminals. GATE gives an item A → α·aBγ and asks 'what items are added in closure?' — only items for B (non-terminal after the dot in α·Bγ are added when you first process A → α·Bγ, NOT for 'a').",
      "Two item sets in the canonical collection are considered the SAME state only if they have IDENTICAL sets of items (same items, same dot positions). GATE asks 'how many states in the canonical LR(0) collection?' — you must compute closure-goto completely and count DISTINCT sets."
    ],
    "pyqIds": ["gate-cse:cd:parse:003"]
  },
  {
    "id": "c-cd-syntax-directed-translation",
    "subjectId": "Compiler Design",
    "chapterId": "cd-syntax-directed-translation",
    "label": "Syntax-Directed Translation (SDT & SDD)",
    "kind": "definition",
    "summary": "SDD (Syntax-Defined Definition): associates semantic rules with productions. S-attributed: only synthesized attributes (value computed from children's attributes, evaluated bottom-up). L-attributed: synthesized + inherited (inherited from parent or left siblings, evaluated in one left-to-right pass). SDT: embeds semantic actions (code fragments) in productions. If actions are at the RIGHT end (after all symbols), they execute in bottom-up order during LR parsing.",
    "prerequisites": ["c-cd-first-follow"],
    "examRelevance": 4,
    "commonTraps": [
      "An SDD is L-attributed if every inherited attribute of a symbol on the RHS depends ONLY on inherited attributes of the symbol to its LEFT or on synthesized attributes of symbols to its LEFT. If an inherited attribute depends on a synthesized attribute of a symbol to its RIGHT, it's NOT L-attributed. GATE gives an SDD and asks if it's L-attributed.",
      "In an SDT embedded in an LR parser, actions at the END of a production (after all RHS symbols) are executed when the production is REDUCED (bottom-up order). Actions in the MIDDLE of a production require modifying the grammar to ensure they're at the end of some production — GATE tests whether a given SDT can be implemented during LR parsing without modification."
    ],
    "pyqIds": ["gate-cse:cd:sdt:001"]
  },
  {
    "id": "c-cd-intermediate-code",
    "subjectId": "Compiler Design",
    "chapterId": "cd-intermediate-code",
    "label": "Three-Address Code (TAC)",
    "kind": "definition",
    "summary": "Instruction form: x = y op z, x = op y, x = y, if x relop y goto L, goto L, param x, call p, n, return x. Representations: quadruples (op, arg1, arg2, result), triples (op, arg1, arg2 — result is implicit as position), indirect triples (pointer to triple). TAC has at most one operator on the RHS (hence 'three-address': at most two operands + one result).",
    "prerequisites": ["c-cd-syntax-directed-translation"],
    "examRelevance": 4,
    "commonTraps": [
      "In QUADRUPLES, the result is explicitly stored (can be optimized by changing the result field). In TRIPLES, the result is implicit (the triple's own position), so optimizing requires updating ALL references to that position. GATE asks 'which representation makes code optimization harder?' — triples, because changing a result requires finding all references.",
      "Array access a[i] in TAC requires computing the address: t1 = i * width, t2 = base(a) + t1, t3 = *t2. For 2D arrays in row-major: t1 = i * COLS + j, t2 = t1 * width, t3 = base + t2. GATE gives a 2D array access and asks for the TAC sequence — the row-major address calculation with COLS multiplication is the key."
    ],
    "pyqIds": ["gate-cse:cd:ir:001"]
  },
  {
    "id": "c-cd-code-optimization",
    "subjectId": "Compiler Design",
    "chapterId": "cd-code-optimization",
    "label": "Code Optimization (Local & Global)",
    "kind": "definition",
    "summary": "Local (within a basic block): constant folding (5+3→8), constant propagation, dead code elimination, algebraic simplification (x*0=0, x+0=x, x*1=x), strength reduction (x²→x*x→x*x when no hardware multiply, or x*2→x+x). Global (across blocks): common subexpression elimination (CSE), loop invariant code motion, induction variable optimization, register allocation via graph coloring. DAG construction identifies CSEs within a block.",
    "prerequisites": ["c-cd-intermediate-code"],
    "examRelevance": 4,
    "commonTraps": [
      "Common subexpression elimination: t1 = a + b, t2 = a + b can be replaced with t1 = a + b, t2 = t1 ONLY if neither a nor b is modified between the two statements. GATE gives a code sequence where a is modified between the two additions and asks if CSE applies — NO, because the values may differ.",
      "Loop invariant code motion: a computation is loop-invariant if it computes the SAME value on every iteration. But moving it OUT of the loop is only valid if it's guaranteed to execute (i.e., the loop executes at least once). For a while-loop that may not execute, moving code out can change program behavior (e.g., division by zero that wouldn't have occurred)."
    ],
    "pyqIds": ["gate-cse:cd:opt:001"]
  },
  {
    "id": "c-cd-runtime-environment",
    "subjectId": "Compiler Design",
    "chapterId": "cd-runtime-environment",
    "label": "Runtime Environment (Activation Records, Stack & Heap)",
    "kind": "definition",
    "summary": "Activation record (stack frame): returned value, actual parameters, saved machine status, local data, temporaries. Stack allocation: LIFO for procedure calls/returns, supports recursion. Heap allocation: for data that outlives the procedure that created it (e.g., malloc/new in C/C++, objects in Java). Access links (static chain): to access non-local variables in lexically scoped languages. Display: array of pointers for O(1) non-local access.",
    "prerequisites": [],
    "examRelevance": 3,
    "commonTraps": [
      "In C, local variables are stack-allocated and cease to exist when the function returns — returning a pointer to a local variable is undefined behavior (dangling pointer). In languages with garbage collection (Java), objects are heap-allocated and survive function return. GATE asks 'which of these causes a dangling pointer?' — returning address of stack-allocated local in C.",
      "Access links form a CHAIN from the current activation record to the activation record of the lexically enclosing scope (for static scoping). The NUMBER of access links traversed equals the NESTING DEPTH difference, NOT the call-chain depth. GATE gives a deeply nested function and asks how many access links to traverse — use nesting depth, not call depth."
    ],
    "pyqIds": ["gate-cse:cd:rt:001"]
  },
  {
    "id": "c-dbms-keys",
    "subjectId": "Databases",
    "chapterId": "dbms-er-relational-model",
    "label": "Keys (Candidate, Primary, Super, Foreign)",
    "kind": "definition",
    "summary": "Super Key: any attribute set that uniquely identifies a tuple. Candidate Key: MINIMAL super key (no proper subset is also a super key). Primary Key: the chosen candidate key. Foreign Key: attribute set referencing a candidate key (usually primary key) of another (or the same) relation.",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "Every candidate key is a super key, but NOT every super key is a candidate key — the minimality condition is what GATE tests via 'how many candidate keys exist' vs 'how many super keys exist' counting problems, where super key count is always ≥ candidate key count and typically much larger (2^(n-k) extra combinations from non-key attributes).",
      "A foreign key CAN reference the same relation (self-referencing FK, e.g., 'manager_id' referencing 'emp_id' in the Employee table) — students often assume FKs only point to other tables."
    ],
    "pyqIds": ["gate-cse:dbms:keys:001"]
  },
  {
    "id": "c-dbms-fd-closure",
    "subjectId": "Databases",
    "chapterId": "dbms-normalization",
    "label": "Functional Dependency & Attribute Closure",
    "kind": "algorithm",
    "summary": "FD X→Y means values of X uniquely determine values of Y. Attribute closure X+ = set of all attributes functionally determined by X, computed by repeatedly applying FDs until no new attribute can be added (Armstrong's Axioms: reflexivity, augmentation, transitivity underlie this).",
    "complexity": "O(n·|F|) per closure computation using the standard iterative algorithm (n = number of attributes, F = set of FDs)",
    "prerequisites": ["c-dbms-keys"],
    "examRelevance": 5,
    "pseudocode": "function CLOSURE(X, F):\n    result = X\n    repeat:\n        changed = false\n        for each FD (A -> B) in F:\n            if A is subset of result and B is not subset of result:\n                result = result union B\n                changed = true\n        until changed == false\n    return result",
    "commonTraps": [
      "X is a candidate key of R iff X+ = all attributes of R AND no proper subset of X has this property — GATE closure numericals require checking BOTH conditions (closure covers everything, AND minimality), skipping minimality check gives wrong candidate key counts.",
      "When computing closure, you must repeatedly re-scan ALL functional dependencies each pass until a FIXED POINT is reached (no new attributes added) — stopping after one pass through the FD list, even if new attributes were just added, is the most common closure-computation error."
    ],
    "pyqIds": ["gate-cse:dbms:norm:001", "gate-cse:dbms:norm:004"]
  },
  {
    "id": "c-dbms-normalization-1nf-2nf-3nf",
    "subjectId": "Databases",
    "chapterId": "dbms-normalization",
    "label": "1NF, 2NF, 3NF",
    "kind": "definition",
    "summary": "1NF: atomic attribute values (no multi-valued/composite attributes). 2NF: 1NF + no PARTIAL dependency of any non-prime attribute on a proper subset of any candidate key (relevant only for composite keys). 3NF: 2NF + no TRANSITIVE dependency of a non-prime attribute on the candidate key (i.e., no non-prime attribute depends on another non-prime attribute).",
    "prerequisites": ["c-dbms-fd-closure"],
    "examRelevance": 5,
    "commonTraps": [
      "2NF violations (partial dependency) can ONLY occur when the candidate key is COMPOSITE (more than one attribute) — a relation with a single-attribute candidate key is automatically in 2NF if it's in 1NF, a fact GATE uses to quickly eliminate 2NF as the answer in single-key-attribute schemas.",
      "'Non-prime attribute' means an attribute NOT part of ANY candidate key — a prime attribute (part of some candidate key) can be transitively or partially dependent without violating 2NF/3NF, since those definitions specifically restrict to non-prime attributes only. This exception is heavily tested."
    ],
    "pyqIds": ["gate-cse:dbms:norm:002"]
  },
  {
    "id": "c-dbms-bcnf",
    "subjectId": "Databases",
    "chapterId": "dbms-normalization",
    "label": "BCNF (Boyce-Codd Normal Form)",
    "kind": "definition",
    "summary": "Stricter than 3NF: for every non-trivial FD X→Y, X must be a SUPER KEY (not just satisfy the prime-attribute exception 3NF allows). Every BCNF relation is in 3NF, but not vice versa. BCNF guarantees no redundancy from FDs but may NOT always be dependency-preserving.",
    "prerequisites": ["c-dbms-normalization-1nf-2nf-3nf"],
    "examRelevance": 5,
    "commonTraps": [
      "3NF allows an FD X→Y to violate the 'X must be super key' rule IF Y is a PRIME attribute — this is exactly the loophole BCNF closes; a relation can be in 3NF but NOT in BCNF specifically because of this prime-attribute exception, the single most-tested BCNF-vs-3NF distinction.",
      "Decomposition into BCNF ALWAYS achieves lossless join, but is NOT guaranteed to preserve all functional dependencies — decomposition into 3NF (via the synthesis algorithm) guarantees BOTH lossless join AND dependency preservation; this trade-off is a frequent conceptual MCQ."
    ],
    "pyqIds": ["gate-cse:dbms:norm:003", "gate-cse:dbms:norm:006"]
  },
  {
    "id": "c-dbms-multivalued-4nf",
    "subjectId": "Databases",
    "chapterId": "dbms-normalization",
    "label": "Multivalued Dependency & 4NF",
    "kind": "definition",
    "summary": "MVD X↠Y holds when, for a fixed value of X, the set of Y values is independent of the set of Z values (remaining attributes) — this happens when combining two otherwise-independent multivalued facts about an entity into one relation, causing redundancy. 4NF requires that for every non-trivial MVD X↠Y, X must be a super key.",
    "prerequisites": ["c-dbms-bcnf"],
    "examRelevance": 3,
    "commonTraps": [
      "Every FD is also an MVD (trivially, X→Y implies X↠Y), but NOT every MVD is an FD — a relation can be in BCNF (satisfying all FD constraints) yet still NOT be in 4NF because of a genuine multivalued dependency that isn't a functional dependency at all."
    ],
    "pyqIds": []
  },
  {
    "id": "c-dbms-lossless-decomposition",
    "subjectId": "Databases",
    "chapterId": "dbms-normalization",
    "label": "Lossless-Join & Dependency-Preserving Decomposition",
    "kind": "theorem",
    "summary": "A decomposition of R into R1, R2 is LOSSLESS iff (R1 ∩ R2) is a super key of R1 OR of R2 — i.e., the common attributes must functionally determine all attributes of at least one of the two pieces. Dependency-preserving means the union of FDs on the decomposed relations, closed, equals the original FD closure — no FD is 'lost' requiring a join to verify.",
    "formula": "\\text{Lossless iff } (R_1 \\cap R_2) \\to R_1 \\text{ or } (R_1 \\cap R_2) \\to R_2",
    "prerequisites": ["c-dbms-fd-closure", "c-dbms-bcnf"],
    "examRelevance": 4,
    "commonTraps": [
      "Checking losslessness requires the common attribute set to functionally determine ALL of R1 or ALL of R2 (not just some attributes) — a common shortcut error is checking whether the intersection determines SOME shared subset rather than the entire relation on one side."
    ],
    "pyqIds": ["gate-cse:dbms:norm:005"]
  },
  {
    "id": "c-dbms-relational-algebra",
    "subjectId": "Databases",
    "chapterId": "dbms-relational-algebra",
    "label": "Relational Algebra Operators",
    "kind": "definition",
    "summary": "Core operators: σ (select, filters rows), π (project, filters columns, implicitly removes duplicates), ⋈ (join), ∪/∩/− (set operators, require union-compatible schemas), × (Cartesian product), ρ (rename), ÷ (division, finds tuples related to ALL tuples in another relation).",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "Projection (π) implicitly ELIMINATES DUPLICATE rows in pure relational algebra (set semantics) — but SQL's SELECT does NOT eliminate duplicates by default (bag semantics, needs explicit DISTINCT); this SQL-vs-algebra mismatch is a frequently tested trap.",
      "Division (÷) is used for 'find X related to ALL Y' queries (e.g., 'students who have taken ALL courses') and is NOT a primitive operator — it must be derived from projection, set difference, and Cartesian product in implementation, though GATE treats it as a black box operator conceptually."
    ],
    "pyqIds": ["gate-cse:dbms:ra:001"]
  },
  {
    "id": "c-dbms-joins",
    "subjectId": "Databases",
    "chapterId": "dbms-relational-algebra",
    "label": "Join Types (Inner, Outer, Natural, Theta)",
    "kind": "definition",
    "summary": "Theta join: combines tuples satisfying an arbitrary condition θ. Natural join: theta join on ALL commonly-named attributes with equality, automatically removes duplicate columns. Outer joins (left/right/full) preserve unmatched tuples from one or both sides, padding with NULLs.",
    "prerequisites": ["c-dbms-relational-algebra"],
    "examRelevance": 4,
    "commonTraps": [
      "Natural join automatically equates and removes duplicate columns based on ATTRIBUTE NAME matching — if two relations share a column name that ISN'T meant to be joined on, natural join silently produces wrong (over-restrictive) results, a common query-design pitfall GATE tests conceptually.",
      "A LEFT outer join followed by a filter (WHERE clause) on the right table's column can accidentally behave like an INNER join if the filter condition excludes NULL rows — this SQL semantics trap (filtering after outer join) is a frequently tested query-behavior question."
    ],
    "pyqIds": ["gate-cse:dbms:ra:002"]
  },
  {
    "id": "c-dbms-sql-null-semantics",
    "subjectId": "Databases",
    "chapterId": "dbms-sql",
    "label": "SQL NULL & Three-Valued Logic",
    "kind": "pitfall",
    "summary": "SQL uses three-valued logic: TRUE, FALSE, UNKNOWN. Any comparison with NULL (=, <, >, etc.) yields UNKNOWN, not TRUE or FALSE. WHERE clauses only keep rows where the condition evaluates to TRUE (UNKNOWN rows are excluded, just like FALSE).",
    "prerequisites": ["c-dbms-relational-algebra"],
    "examRelevance": 4,
    "commonTraps": [
      "`column = NULL` ALWAYS evaluates to UNKNOWN (never TRUE), even if the column actually contains NULL — you MUST use `IS NULL` instead; this is one of the most common real-world and GATE SQL bugs.",
      "COUNT(*) counts ALL rows including NULLs, but COUNT(column_name) skips rows where that column is NULL — mixing these up gives wrong counts in aggregate queries involving nullable columns.",
      "NOT UNKNOWN is still UNKNOWN (not TRUE) — so `NOT (x = NULL)` doesn't magically become true; three-valued logic negation traps appear in nested/negated WHERE clause GATE questions."
    ],
    "pyqIds": ["gate-cse:dbms:sql:001", "gate-cse:dbms:sql:003"]
  },
  {
    "id": "c-dbms-acid",
    "subjectId": "Databases",
    "chapterId": "dbms-transactions",
    "label": "ACID Properties",
    "kind": "definition",
    "summary": "Atomicity: transaction executes fully or not at all. Consistency: transaction moves DB from one valid state to another (integrity constraints preserved). Isolation: concurrent transactions appear to execute serially from each one's perspective. Durability: committed changes survive system failure.",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "Atomicity and Durability are typically ensured by the RECOVERY manager (via logs — undo/redo), while Isolation is ensured by the CONCURRENCY CONTROL manager (via locking/timestamping/validation) — GATE sometimes asks which subsystem is responsible for which ACID property.",
      "Consistency is partly the DBMS's responsibility (enforcing declared constraints) but ALSO partly the application/transaction programmer's responsibility (writing logically correct transactions) — unlike the other three properties which are purely system-guaranteed."
    ],
    "pyqIds": ["gate-cse:dbms:transaction:001"]
  },
  {
    "id": "c-dbms-schedules-serializability",
    "subjectId": "Databases",
    "chapterId": "dbms-transactions",
    "label": "Schedules & Serializability (Conflict & View)",
    "kind": "theorem",
    "summary": "A schedule is CONFLICT SERIALIZABLE if it can be transformed into a serial schedule by swapping non-conflicting operations (conflicting ops: same data item, at least one is a WRITE, from different transactions). Checked via a PRECEDENCE GRAPH — if the graph is acyclic, the schedule is conflict serializable. VIEW serializability is a strictly weaker/broader condition (every conflict-serializable schedule is view-serializable, not conversely).",
    "prerequisites": ["c-dbms-acid"],
    "examRelevance": 5,
    "pseudocode": "function IS_CONFLICT_SERIALIZABLE(schedule):\n    graph = empty directed graph\n    for each pair of operations (opI from Ti, opJ from Tj) in schedule order:\n        if Ti != Tj and opI, opJ access same data item and (opI is WRITE or opJ is WRITE):\n            add edge Ti -> Tj  // Ti's conflicting op happened first\n    return NOT HAS_CYCLE(graph)",
    "commonTraps": [
      "Precedence graph edges are drawn Ti → Tj when Ti's operation precedes and CONFLICTS with Tj's operation on the SAME data item — read-read pairs are NEVER conflicting (no edge), a very common error is adding edges for read-read overlaps.",
      "A cycle in the precedence graph means the schedule is NOT conflict serializable — but it might STILL be view serializable in rare cases (e.g., involving blind writes) — GATE occasionally distinguishes conflict-serializable-count vs view-serializable-count in the same schedule to test this exact gap."
    ],
    "pyqIds": ["gate-cse:dbms:transaction:002", "gate-cse:dbms:transaction:005"]
  },
  {
    "id": "c-dbms-two-phase-locking",
    "subjectId": "Databases",
    "chapterId": "dbms-concurrency-control",
    "label": "Two-Phase Locking (2PL, Strict 2PL, Rigorous 2PL)",
    "kind": "algorithm",
    "summary": "2PL: each transaction has a GROWING phase (only acquires locks, never releases) followed by a SHRINKING phase (only releases, never acquires). 2PL guarantees conflict serializability but NOT freedom from deadlock. Strict 2PL: hold ALL exclusive locks until commit/abort (prevents cascading rollback). Rigorous 2PL: hold ALL locks (shared and exclusive) until commit/abort.",
    "prerequisites": ["c-dbms-schedules-serializability"],
    "examRelevance": 5,
    "pseudocode": "// Strict 2PL, per transaction Ti\nphase = GROWING\non access(item):\n    if phase == SHRINKING: error  // no new locks after first release\n    acquire_lock(item)            // block if held conflictingly by another Ti\non release request:\n    phase = SHRINKING             // only reached at commit/abort in Strict 2PL\non commit or abort:\n    release_all_locks(Ti)         // held until here, avoids cascading rollback",
    "commonTraps": [
      "Basic 2PL guarantees conflict serializability but can still suffer CASCADING ROLLBACK (if a transaction reads data written by another that later aborts) — only STRICT 2PL (holding write locks until commit) prevents cascading rollback; plain 2PL does not.",
      "2PL does NOT prevent deadlock — it's entirely possible for transactions following 2PL to deadlock while each is in its growing phase waiting for a lock the other holds; deadlock prevention/detection is a SEPARATE mechanism layered on top."
    ],
    "pyqIds": ["gate-cse:dbms:concurrency:001", "gate-cse:dbms:concurrency:003"]
  },
  {
    "id": "c-dbms-timestamp-ordering",
    "subjectId": "Databases",
    "chapterId": "dbms-concurrency-control",
    "label": "Timestamp Ordering Protocol",
    "kind": "algorithm",
    "summary": "Each transaction assigned a unique timestamp at start; each data item tracks W-timestamp (last write) and R-timestamp (last read). A read/write is rejected (transaction rolled back and restarted with a NEW timestamp) if it would violate timestamp order — e.g., writing to an item already read/written by a LATER transaction.",
    "prerequisites": ["c-dbms-schedules-serializability"],
    "examRelevance": 3,
    "pseudocode": "on Ti reads item X:\n    if TS(Ti) < W-timestamp(X): reject, rollback Ti, restart with new TS\n    else: allow read, R-timestamp(X) = max(R-timestamp(X), TS(Ti))\n\non Ti writes item X:\n    if TS(Ti) < R-timestamp(X) or TS(Ti) < W-timestamp(X): reject, rollback Ti, restart with new TS\n    else: allow write, W-timestamp(X) = TS(Ti)",
    "commonTraps": [
      "Timestamp ordering guarantees conflict serializability WITHOUT using locks (so it's deadlock-free by construction) — but it CAN cause more transaction restarts (starvation risk for a transaction repeatedly rolled back) compared to lock-based approaches, a common trade-off question."
    ],
    "pyqIds": []
  },
  {
    "id": "c-dbms-indexing-btree",
    "subjectId": "Databases",
    "chapterId": "dbms-indexing",
    "label": "B-Tree / B+ Tree Indexing",
    "kind": "definition",
    "summary": "B+ tree: all actual data/record pointers stored ONLY at leaf nodes, which are also linked in a sequence for efficient range queries; internal nodes store only routing keys (allowing more fan-out per node than B-tree). B-tree stores data pointers at internal nodes too (no leaf-linking), making range queries less efficient. Most real DBMSs use B+ trees for indexes.",
    "complexity": "O(log_f n) search/insert/delete, where f is the fan-out (order) of the tree",
    "prerequisites": [],
    "examRelevance": 5,
    "commonTraps": [
      "A B+ tree of order (fan-out) p can have between ⌈p/2⌉ and p children per internal node (except the root) — GATE numericals computing minimum/maximum number of keys or the tree height are extremely sensitive to whether the CEILING or FLOOR convention applies to a given bound, and whether the ROOT is exempted from the minimum-fill rule (it usually is).",
      "B+ tree height/order numericals must account for whether the question specifies BLOCK SIZE and POINTER/KEY SIZE separately — order p is computed from block_size = p·(pointer_size) + (p-1)·(key_size) for internal nodes, and a DIFFERENT formula for leaf nodes (which also need a next-leaf pointer) — using the internal-node formula for leaf capacity is a common numerical mistake."
    ],
    "pyqIds": ["gate-cse:dbms:index:001", "gate-cse:dbms:index:002"]
  },
  {
    "id": "c-dbms-indexing-types",
    "subjectId": "Databases",
    "chapterId": "dbms-indexing",
    "label": "Primary, Secondary, Clustering, Dense/Sparse Index",
    "kind": "definition",
    "summary": "Primary index: on the ORDERING key of a sequentially-ordered file (implies at most one per relation). Clustering index: on a non-key attribute by which the file happens to be physically ordered. Secondary index: on any non-ordering attribute, always DENSE. Dense index: one entry per search-key value/record. Sparse index: one entry per BLOCK, only possible when data is physically sorted on that key.",
    "prerequisites": ["c-dbms-indexing-btree"],
    "examRelevance": 4,
    "commonTraps": [
      "Sparse indexing is ONLY possible when the underlying file is physically SORTED on the index key (so you can binary-search to the right block and scan linearly) — secondary indexes on unsorted attributes MUST be dense, since there's no physical ordering to exploit for skipping records.",
      "'Primary index' in GATE terminology refers to indexing on the ORDERING key, NOT necessarily the primary key attribute declared in the schema — a table's primary key could be different from the attribute it's physically sorted/indexed on, a subtle terminology trap."
    ],
    "pyqIds": ["gate-cse:dbms:index:003"]
  }
]
