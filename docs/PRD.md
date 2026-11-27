# Product Requirements Document (PRD) — CAVDAX for Flagsmith

**Project**: CAVDAX (**C**ontextual **A**ction & **V**erified **D**ecision **A**utonomous e**X**ecution) for Flagsmith  
**Hackathon Track**: Toggle Wars (WeMakeDevs × Flagsmith) — Track 03: Build on Open Source Flagsmith *(Primary)*  
**Foundation Architecture**: Graph Hacks (WeMakeDevs × FalkorDB) — GraphBLAS Sparse Matrix Engine  
**Target Deliverables**: Flagsmith Blast Radius MCP Gate, FalkorDB GraphBLAS Matrix Invalidation, Standalone `@cavdax/flagsmith-mcp`  
**Version**: 1.3.0-PRODUCTION (Synchronized with Live Production Gateway `https://cavdax-flagsmith.sahnirmaan.live`)  

---

## 1. Executive Summary & Mission Statement

### 1.1 The Core Thesis & Societal/Developer Impact
Autonomous coding agents (e.g. Claude Code, Cursor, Codex, OpenCode) represent an exponential leap in developer velocity. However, when deployed into enterprise repositories that use feature flagging platforms like **Flagsmith**, autonomous agents operate with complete blindness toward feature flag dependency topologies:
1. **Blind Feature Toggles**: Agents toggle or delete flags (e.g., flipping `dark_mode` or pruning `theme_system`) without realizing that downstream modules (`premium_analytics`, `analytics_dashboard`) have hidden AST or runtime dependencies on them.
2. **Missing Prerequisite Outages**: Agents scaffold code gated by experimental flags (e.g., `beta_streaming`) without verifying whether mandatory parent prerequisites (e.g., `auth_v2`) are satisfied in the active environment.
3. **Dead Code Accumulation**: Unused, obsolete flags linger in codebases indefinitely because agents and developers cannot prove with mathematical certainty whether removing a flag will break downstream consumers.

Traditional feature flag management treats flags as flat key-value pairs or isolated UI switches. When an agent or developer touches a flag, there is zero automated, causal verification of the **Blast Radius**.

### 1.2 The CAVDAX for Flagsmith Solution
**CAVDAX for Flagsmith** provides autonomous coding agents and software teams with a **Causal Conscience for Feature Flags**. Instead of treating flags as isolated toggles, CAVDAX constructs a multi-signal **Causal Directed Acyclic Graph (DAG)** stored in **FalkorDB** and computed via **GraphBLAS sparse matrix linear algebra**.

CAVDAX couples this causal topology with an **Enclosed Model Context Protocol (MCP) Execution Gate**. When an AI agent attempts to modify code or toggle a feature flag, CAVDAX intercepts the tool call before execution:
- It performs a sub-2ms multi-hop Cypher traversal (`[:DEPENDS_ON|GUARDS*1..3]`).
- If disabling the flag breaks downstream dependents or if required prerequisites are missing, the gate halts execution with an atomic **Hard Block (HTTP 409 / 403)**, preventing regressions with zero files modified and zero toggles flipped.
- The agent receives structured causal diagnostics, enabling it to revalidate dependencies and complete safe execution.

```
  Traditional Feature Flagging:
  [Agent / Dev Flips Flag] ──► [Flat API Request] ──► ❌ Silent Downstream Cascade & Production Outage

  CAVDAX Causal Governance:
  [Flagsmith API] + [Code AST] + [Git History] ──► [FalkorDB GraphBLAS Causal Mesh]
                                                           │
  [Autonomous AI Agent] ──► [Enclosed MCP Gate] ───────────┤
                                                           ▼
                             [Multi-Hop Traversal] ──► ⛔ HARD BLOCK: High Blast Radius (2 Dependents Break)
                                                           │
                                                           ▼
                             [Act IV Revalidation] ──► Prerequisite Verified ──► ✅ Safe Toggle Approved
```

---

## 2. Target User Personas & User Journey Maps

### 2.1 Persona Matrix

| Persona | Role | Primary Goal | Critical Pain Point Solved |
| :--- | :--- | :--- | :--- |
| **Persona A: Autonomous Coding Agent** | Autonomous LLM Worker (Claude / Cursor) | Synthesize code, refactor features, and modify feature flag gates. | Blindly altering toggles, triggering regressions, and violating prerequisite chains. |
| **Persona B: Release & DevOps Engineer** | Platform Engineer / SRE | Roll out features safely, manage canary releases, and decommission stale flags. | Inability to calculate downstream blast radius before flipping toggles in production. |
| **Persona C: Security & Compliance Auditor** | Enterprise Security Lead | Guarantee provenance chain and cryptographic verification for all flag actions. | Unaudited agent mutations, unauthorized flag overrides, and lack of signed audit ledgers. |

### 2.2 End-to-End User Journey (The 4-Act Flagsmith Orchestration)

1. **Act I: Baseline Flagsmith Mesh**
   - FalkorDB initializes the baseline causal mesh synchronizing active flags from the Flagsmith Management API (`theme_system`, `auth_v2`, `dark_mode`, `premium_analytics`, `analytics_dashboard`).
   - Static AST code references link `src/theme/provider.tsx` and `src/components/AnalyticsPanel.tsx` to the graph.
   - All baseline flags and code references are verified and healthy.

2. **Act II: Multi-Signal Ingestion & Dependency Discovery**
   - Developer merges code or agent inspects `src/components/ThemeWrapper.jsx`.
   - CAVDAX 3-Signal Inference Engine fuses:
     - Signal 1: Flagsmith Management API Tags & Metadata (Confidence: 1.0).
     - Signal 2: AST Static Analysis detecting nested flag guards (`flagsmith.hasFeature('dark_mode')`, Confidence: 0.85).
     - Signal 3: Git Temporal Co-change Jaccard Index revealing historical flag co-modifications (Confidence: 0.70).
   - GraphBLAS establishes multi-hop dependency edges: `premium_analytics` $\rightarrow$ `dark_mode` $\rightarrow$ `theme_system`.

3. **Act III: Enclosed MCP Gate Interception (Hard Block)**
   - Autonomous agent invokes `safe_toggle_flag(flag: 'dark_mode', enabled: false)` or attempts to remove theme wrappers.
   - The Enclosed MCP Gate intercepts the call before execution.
   - FalkorDB GraphBLAS executes a multi-hop reachability query in **1.84ms**: detects that disabling `dark_mode` will break 2 active downstream dependents (`premium_analytics`, `analytics_dashboard`).
   - MCP Gate returns **`BLOCKED_HIGH_BLAST_RADIUS` (HTTP 409 Conflict)**. Zero files modified; zero toggles altered.

4. **Act IV: Revalidation & Grounded Safe Execution**
   - Agent receives deterministic causal error trace detailing the 2 downstream dependents.
   - Agent synthesizes verified migration: introduces dynamic theme fallback and satisfies prerequisite guards.
   - Agent re-submits action to MCP Gate.
   - MCP Gate verifies unblemished causal safety $\rightarrow$ returns **`APPROVED` (HTTP 200)** in **1.62ms**.
   - Safe toggle is synchronized with Flagsmith REST API and recorded in the signed FalkorDB audit ledger.

---

## 3. Core Functional Capabilities (Requirements Matrix)

### 3.1 Module 1: 3-Signal Causal Inference Engine
- **FR-1.1 Signal 1 — Flagsmith API Ingestion**: Bi-directional synchronization with Flagsmith REST API (`/api/v1/flags/`). Ingests flag keys, enabled states, tags, description, and environment configurations ($c = 1.0$).
- **FR-1.2 Signal 2 — Static AST Code Parser**: Traverses repository ASTs to locate all Flagsmith SDK invocations (`flagsmith.hasFeature`, `isFeatureEnabled`, `getValue`, `useFlags`). Detects nested conditional enclosures ($c = 0.85$).
- **FR-1.3 Signal 3 — Git Temporal Co-Change Miner**: Analyzes commit history to compute Jaccard co-change metric:
  $$J(A, B) = \frac{|A \cap B|}{|A \cup B|}$$
  Discovers implicit runtime coupling between flags that never appear in the same file ($c = 0.70$).
- **FR-1.4 Bayesian Confidence Aggregator**: Fuses multi-source evidence into unified edge weights:
  $$P(\text{coupling}) = 1 - \prod_{i=1}^{k} (1 - c_i)$$

### 3.2 Module 2: FalkorDB GraphBLAS Matrix Invalidation & Blast Radius
- **FR-2.1 GraphBLAS Sparse Matrix Traversal**: Represents flag dependencies as adjacency matrices. Computes multi-hop reachable sets via matrix-vector multiplication in $< 2.5\text{ms}$:
  $$\text{DownstreamImpact} = A^T \cdot \text{TargetFlag}$$
- **FR-2.2 Real-Time Blast Radius Classification**:
  - `LOW`: 0 downstream dependents; safe to toggle or prune.
  - `MEDIUM`: 1 downstream dependent; warning with remediation plan.
  - `HIGH`: $\ge 2$ downstream dependents or missing critical prerequisites; mandatory hard block.

### 3.3 Module 3: Enclosed Flagsmith Model Context Protocol (MCP) Server
Exposes 6 specialized MCP tools over stdio and SSE for Claude Code, Cursor, and autonomous agents:
1. `get_flag_blast_radius`: Multi-hop downstream impact traversal, risk tier, and safe-to-disable verdict.
2. `safe_toggle_flag`: Pre-flight verification gate halting unsafe toggles unless `--force` is provided.
3. `list_flagsmith_features`: Enumeration of all flags with in-degree, out-degree, and causal health.
4. `scan_code_for_flags`: Static AST scanning of repository files for Flagsmith SDK calls.
5. `sync_flagsmith_graph`: Full bi-directional synchronization between Flagsmith API and FalkorDB graph.
6. `list_stale_flags`: Identification of dead-code candidate flags (0 dependents, deprecated, inactive).

### 3.4 Module 4: Real-Time Cybernetic Diagnostics HUD
- **FR-4.1 Topology Radar Canvas**: Interactive force-directed canvas displaying `:FlagsmithFeature` nodes, AST code references, and causal edges with real-time risk color-coding.
- **FR-4.2 Interactive AST Code Inspector**: Split-pane interface allowing developers to test code snippets, extract AST call sites, and inspect FalkorDB production state in real time.
- **FR-4.3 Causal Audit Ledger**: Searchable, tamper-evident log recording every gate interception, approval, and safe toggle with latency and cryptographic signature.

---

## 4. Explicit Non-Goals & Scope Boundaries

1. **NOT a Replacement for Flagsmith**: CAVDAX does not replace Flagsmith. It is a causal governance intelligence layer built ON TOP of Flagsmith.
2. **NOT a Generic AST Linter**: CAVDAX analyzes code specifically to extract feature flag dependencies and causal impact.
3. **NOT an LLM Training Pipeline**: CAVDAX operates entirely at runtime/inference with zero model weight fine-tuning.
4. **NO Real Financial / Escrow Custody**: CAVDAX governs software architecture and feature releases, not financial transactions.

---

## 5. Technical Constraints & Performance Budgets

- **Traversal Latency Budget**: FalkorDB Cypher blast-radius queries must execute in $\le 3.0\text{ms}$ (p95) and $\le 5.0\text{ms}$ (p99).
- **Client Bundle Budget**: Production JS bundle $\le 250\text{kB}$ gzipped; zero third-party canvas UI bloat.
- **Offline / Simulation Fallback**: If FalkorDB Docker container is disconnected, client gracefully degrades to in-memory GraphBLAS simulation without throwing uncaught exceptions.
- **Zero Secret Leakage**: Zero API keys or secrets hardcoded or committed; all credentials managed via environment variables.

---

## 6. Success Metrics & Verification Criteria

| Metric | Target | Measurement Method |
| :--- | :--- | :--- |
| **Unsafe Toggle Interception Rate** | **100.0%** | Automated test asserting 0 high-blast-radius toggles bypass MCP Gate without force flag. |
| **Gate Verification Latency** | **$< 2.5\text{ms}$** | High-resolution performance timer on `/api/flagsmith/blast-radius`. |
| **Multi-Signal Ingestion Accuracy** | **$\ge 98.0\%$** | Cross-verification between AST extracted flags and Flagsmith REST API entities. |
| **Act IV Revalidation Recovery** | **100.0%** | Agent successfully synthesizes safe fallback and passes gate on retry. |
