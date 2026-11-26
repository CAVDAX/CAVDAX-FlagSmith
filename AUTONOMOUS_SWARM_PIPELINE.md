# CAVDAX-FlagSmith: Autonomous Delivery Swarm Pipeline
> **Track 03**: *Build on Open Source Flagsmith* — Toggle Wars: The Flagsmith Experimentation Hackathon  
> **Team**: AWDAX (Suneet Chugh, Geetika Chugh, Jatin Jha, Harshit Chauhan)  
> **Target Subdomain**: `https://cavdax-flagsmith.sahnirmaan.live`  
> **FSM Execution State**: Verification & Deployment

---

## 1. FSM Swarm Pipeline State Matrix

| State ID | Phase Name | Status | Verified Receipt | Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **S0** | **Bootstrap & AWS Topology** | **PASSED** | Dedicated EC2 `t3.small` (`15.135.78.65`), 2GB swap, Docker 29, FalkorDB, Flagsmith API, Caddy, Postgres 15 | HTTP/2 200 OK on all live endpoints |
| **S1** | **Signal 1: Tags Parser & FalkorDB** | **PASSED** | `FlagsmithClient.extractDependencies()` parses `depends:`, `requires:`, `enables:`, `blocks:` tags with confidence `1.0` | FalkorDB cypher ingestion verified (`0.09 ms`) |
| **S2** | **Signal 2: Static AST Flag Scanner** | **PASSED** | `core/ingestion/astScanner.js` scanning AST calls (`isFeatureEnabled`, `hasFeature`, `useFlags`, `getValue`) | 4/4 Unit tests passing in 11ms (`astScanner.test.mjs`) |
| **S3** | **Signal 3: Git Temporal Coupling Miner**| **PASSED** | `core/ingestion/gitMiner.js` computing Jaccard co-change metric across commits | 2/2 Unit tests passing in 4ms (`gitMiner.test.mjs`) |
| **S4** | **Bayesian Risk & Blast Radius Aggregator** | **PASSED** | `core/graph/blastRadiusCalculator.js` merging Signals 1, 2, 3 into unified $P(A \to B) = 1 - \prod(1 - c_i)$ | 3/3 Unit tests passing in 10ms (`blastRadiusCalculator.test.mjs`) |
| **S5** | **Interactive Web HUD Blast Card & Route** | **PASSED** | `apps/client/src/components/FlagBlastRadiusCard.jsx`, `/flags` tab & route, monochromatic obsidian theme | Zero-emoji discipline, 2-line max copy, live toggle & mesh sync |
| **S6** | **MCP Tooling for Flagsmith** | **PASSED** | MCP tools: `get_flag_blast_radius`, `safe_toggle_flag`, `list_flagsmith_features` in `core/mcp/server.js` | 4/4 Unit tests passing in 7ms (`mcpFlagsmithTools.test.mjs`) |
| **S7** | **Continuous Deployment & AWS Rollout** | **IN_PROGRESS** | Push to `main` -> GitHub Actions deploy -> EC2 multi-container mesh live | Full 14-test verification passing |

---

## 2. Mathematical Invariants & Formulations

### 2.1 Multi-Signal Bayesian Probability
For any two feature flags $A$ and $B$, each observed signal provides independent conditional confidence $c_i \in (0, 1]$:
$$P(\text{Dependency } A \to B) = 1 - \prod_{i \in \{\text{TAG}, \text{AST}, \text{GIT}\}} (1 - c_i)$$

- **Signal 1 (TAG)**: Tag explicitly declared in Flagsmith dashboard: $c_1 = 1.0$ (deterministic contract).
- **Signal 2 (AST)**:
  - Nested block guard: $c_2 = 0.85$ (Flag $A$ executes Flag $B$ inside its active branch).
  - Conjunction / Disjunction: $c_2 = 0.70$ (Flag $A$ and Flag $B$ evaluated in single boolean clause).
- **Signal 3 (GIT Temporal Coupling)**:
  - Jaccard similarity index across historical commits:
  $$J(A, B) = \frac{|C_A \cap C_B|}{|C_A \cup C_B|}$$
  Where $C_A$ is the set of commits touching Flag $A$, and $C_B$ is the set of commits touching Flag $B$.

### 2.2 Path Risk & Blast Radius Propagation
For a directed traversal path $p = (v_0, v_1, \dots, v_k)$:
$$\text{Risk}(p) = \prod_{j=1}^{k} P(v_{j-1} \to v_j)$$
Downstream impact score $I(v_0) = \sum_{u \in \text{Downstream}(v_0)} \text{Risk}(\text{path}(v_0 \to u))$.
- **CRITICAL**: $I \ge 4.0$ or active downstream count $\ge 5$.
- **HIGH**: $2.0 \le I < 4.0$ or active downstream count $\ge 2$.
- **MODERATE**: $0.8 \le I < 2.0$ or active downstream count $\ge 1$.
- **LOW**: $I < 0.8$ (isolated canary/experiment flag).

---

## 3. Test Ledger & Execution Receipts
- **astScanner.test.mjs**: 4/4 tests passed (11ms)
- **gitMiner.test.mjs**: 2/2 tests passed (4ms)
- **blastRadiusCalculator.test.mjs**: 3/3 tests passed (10ms)
- **flagsmithRoutes.test.mjs**: 1/1 test passed (3ms)
- **mcpFlagsmithTools.test.mjs**: 4/4 tests passed (7ms)
- **Total Test Suites**: 5 suites, 14 passed tests, 0 failures.
