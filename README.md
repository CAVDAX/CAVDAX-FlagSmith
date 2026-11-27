<!-- TOGGLE WARS HACKATHON SUBMISSION -->
> **Toggle Wars Hackathon — Track 03: Build on Open Source Flagsmith**  
> **Track:** Track 03 — Build on Open Source Flagsmith (Prize: PS5 + GTA 6 Bundle)  
> **Event:** Toggle Wars: The Flagsmith Experimentation Hackathon (WeMakeDevs × Flagsmith)  
> **Hackathon Window:** November 26–29, 2026
>
> This repository is CAVDAX adapted for Toggle Wars Track 03. CAVDAX is an open-source
> graph intelligence engine maintained by this team (see [CAVDAX/CAVDAX](https://github.com/CAVDAX/CAVDAX)).
> All Flagsmith-specific integration — flag ingestion, the three-signal blast radius engine,
> and the Flagsmith-wired HUD — was built during the Toggle Wars hackathon window (November 26–29, 2026).
>
> The core graph engine (FalkorDB + GraphBLAS) is pre-existing open-source infrastructure
> we maintain. The Flagsmith product layer built on top of it is new work created for this hackathon.

---

<div align="center">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="assets/cavdax-logo-dark.svg" />
<source media="(prefers-color-scheme: light)" srcset="assets/cavdax-logo-light.svg" />
<img src="assets/cavdax-logo-dark.svg" width="100" height="100" alt="CAVDAX Logo" />
</picture>

<h1>CAVDAX: Contextual Action &amp; Verified Decision Autonomous eXecution</h1>
<p><strong>Graph-Grounded Feature Flag Causal Dependency Firewall for Autonomous Coding Agents &bull; Flagsmith Edition</strong></p>
<p>
<strong>Deterministic 3-Signal Causal Verification Firewall for Autonomous Coding Agents</strong><br />
<strong>Execution Gate:</strong> Model Context Protocol (MCP) Inline Verification &bull; 
<strong>Graph Engine:</strong> FalkorDB GraphBLAS Matrix Multiplication &bull;
<strong>Feature Platform:</strong> Self-Hosted Open-Source Flagsmith
</p>
<p>
<a href="https://youtu.be/Nhdd7spj1RA"><img src="https://img.shields.io/badge/YouTube-10--Minute%20Demo%20Walkthrough-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="YouTube Demo Walkthrough" /></a>
<a href="https://cavdax-flagsmith.sahnirmaan.live/"><img src="https://img.shields.io/badge/Live%20Flagsmith%20Demo-cavdax--flagsmith.sahnirmaan.live-10B981?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" /></a>
<a href="https://www.npmjs.com/package/@cavdax/flagsmith-mcp"><img src="https://img.shields.io/npm/v/@cavdax/flagsmith-mcp?style=for-the-badge&logo=npm&logoColor=white&color=CB3837&label=flagsmith-mcp" alt="npm flagsmith-mcp" /></a>
</p>
</div>

<div align="center">

[![CI](https://img.shields.io/github/actions/workflow/status/CAVDAX/CAVDAX-FlagSmith/ci.yml?style=for-the-badge&logo=github&label=CI)](https://github.com/CAVDAX/CAVDAX-FlagSmith/actions)
[![GitHub Release](https://img.shields.io/github/v/release/CAVDAX/CAVDAX-FlagSmith?style=for-the-badge&logo=github&color=blue)](https://github.com/CAVDAX/CAVDAX-FlagSmith/releases/latest)
[![npm version](https://img.shields.io/npm/v/@cavdax/flagsmith-mcp?style=for-the-badge&logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/@cavdax/flagsmith-mcp)
[![npm provenance](https://img.shields.io/badge/provenance-sigstore-informational?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/@cavdax/flagsmith-mcp)
[![FalkorDB](https://img.shields.io/badge/FalkorDB-GraphBLAS-FF2D55?style=for-the-badge&logo=redis&logoColor=white)](https://falkordb.com/)
[![MCP](https://img.shields.io/badge/Protocol-Model%20Context%20Protocol%20%28MCP%29-06B6D4?style=for-the-badge)](https://modelcontextprotocol.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose%20Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](./docker-compose.yml)
[![License: Apache 2.0 / BSL 1.1](https://img.shields.io/badge/License-Apache_2.0_%2F_BSL_1.1-blue.svg?style=for-the-badge)](./LICENSE)
[![Latency](https://img.shields.io/badge/Gate%20Latency-%3C%2035ms-8B5CF6?style=for-the-badge)](#empirical-benchmarks)

</div>

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/screenshots/live_purged_flags_radar_dark.png" />
  <source media="(prefers-color-scheme: light)" srcset="./assets/screenshots/live_purged_flags_radar_light.png" />
  <img src="./assets/screenshots/live_purged_flags_radar_dark.png" alt="Flagsmith Blast Radius Radar Interface" width="100%" />
</picture>

<p><em>Figure 1: Full-width live production showcase of the Flagsmith Blast Radius Radar at <code>https://cavdax-flagsmith.sahnirmaan.live/flags</code> featuring 3-signal dependency telemetry, multi-hop transitive ripple detection, upstream prerequisite guards, and 409 Conflict safety barrier.</em></p>

<table width="100%">
  <tr>
    <td width="50%" align="center">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="./assets/screenshots/live_flagsmith_console_dark.png" />
        <source media="(prefers-color-scheme: light)" srcset="./assets/screenshots/live_flagsmith_console_light.png" />
        <img src="./assets/screenshots/live_flagsmith_console_dark.png" alt="Causal Verification Console" width="100%" />
      </picture>
      <br />
      <em>Figure 2a: Flagsmith Causal Verification Console (/console) — Windowed Mode</em>
    </td>
    <td width="50%" align="center">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="./assets/screenshots/dev_console_dark.png" />
        <source media="(prefers-color-scheme: light)" srcset="./assets/screenshots/dev_console_light.png" />
        <img src="./assets/screenshots/dev_console_dark.png" alt="Developer Diagnostics Console" width="100%" />
      </picture>
      <br />
      <em>Figure 2b: Developer Diagnostics &amp; Hackathon Mode Console (/dev) — Windowed Mode</em>
    </td>
  </tr>
</table>

</div>

---

## Toggle Wars Track 03: Flagsmith Blast Radius & Safe-Toggle Engine

> **Live Production Gateway:** [`https://cavdax-flagsmith.sahnirmaan.live`](https://cavdax-flagsmith.sahnirmaan.live)  
> **Self-Hosted Flagsmith API:** [`https://cavdax-flagsmith.sahnirmaan.live/flagsmith/api/v1/`](https://cavdax-flagsmith.sahnirmaan.live/flagsmith/api/v1/)  
> **Official npm Package:** [`@cavdax/flagsmith-mcp`](https://www.npmjs.com/package/@cavdax/flagsmith-mcp) (`v1.0.3`)  
> **Interactive Blast Radius Radar:** [`https://cavdax-flagsmith.sahnirmaan.live/flags`](https://cavdax-flagsmith.sahnirmaan.live/flags)  
> **Developer Diagnostics Console:** [`https://cavdax-flagsmith.sahnirmaan.live/dev`](https://cavdax-flagsmith.sahnirmaan.live/dev)

> [!NOTE]
> **Hackathon Mode (Active for Judges & Evaluators):**  
> We have enabled **Hackathon Mode** by default on our live deployment. This grants evaluators and judges unrestricted access to all Enterprise-tier capabilities (unlimited flag blast-radius queries, deep AST syntactic code inspection, high-frequency synchronization, and zero-key local MCP testing) without requiring license keys or subscription paywalls. Can be toggled live via the Developer Console at [`/dev`](https://cavdax-flagsmith.sahnirmaan.live/dev).

Autonomous coding agents (Cursor, Claude Code, Windsurf) edit code and toggle feature flags blindly—without understanding the hidden multi-hop ripple effects across downstream services and users. Toggling or deleting a flag like `dark_mode` can silently crash downstream systems (`premium_analytics`, `analytics_dashboard`) or violate mandatory upstream prerequisites (`theme_system`, `auth_v2`).

CAVDAX for Flagsmith builds a **3-Signal Topological Dependency Graph** powered by FalkorDB GraphBLAS matrix multiplication, exposing deterministic pre-flight safety gates directly into AI coding agents via the Model Context Protocol (MCP).

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                      THREE-SIGNAL INFERENCE ENGINE                     │
 ├───────────────────┬───────────────────────────┬────────────────────────┤
 │     SIGNAL 1      │         SIGNAL 2          │        SIGNAL 3        │
 │ Flagsmith REST    │  Static AST Code Scanner  │ Git Temporal Coupling  │
 │ (Tags/Prereqs/    │  (Babel/Tree-Sitter AST   │ (Jaccard Co-Change     │
 │  Multivariate)    │   Guards & Conjunctions)  │  Across Git Commits)   │
 └─────────┬─────────┴─────────────┬─────────────┴───────────┬────────────┘
           │                       │                         │
           ▼                       ▼                         ▼
   Confidence: 0.95        Confidence: 0.75–0.85     Confidence: J(A,B)
           │                       │                         │
           └───────────────────────┼─────────────────────────┘
                                   ▼
                   Multi-Signal Bayesian Aggregator
                      P = 1 - Π(1 - c_i)
                                   ▼
                   FalkorDB GraphBLAS Engine (Cypher)
                     [:DEPENDS_ON|GUARDS*1..3]
                                   ▼
          ┌────────────────────────┴────────────────────────┐
          ▼                                                 ▼
  Model Context Protocol (MCP)                     Interactive Web HUD
  npx @cavdax/flagsmith-mcp                        https://cavdax-flagsmith.sahnirmaan.live
  • get_flag_blast_radius                          • Real-time Blast Radius Radar
  • safe_toggle_flag                               • AST Live Code Inspector (Signal 2)
  • list_flagsmith_features                        • Safe Toggle Switch with 409 Conflict
  • scan_code_for_flags                            • Transitive Dependency Visualizer
  • sync_flagsmith_graph                           • 3-Signal Mesh Ingestion
  • list_stale_flags                               • Stale Flag Pruning & Cleanup
```

### Quick Evaluation for Judges (Zero Installation Required)

Judges can evaluate the live engine immediately from their terminal with zero prior setup:

```bash
# 1. Inspect the topological blast radius of 'dark_mode'
npx @cavdax/flagsmith-mcp blast dark_mode

# 2. List all registered Flagsmith feature flags & dependency metrics
npx @cavdax/flagsmith-mcp features

# 3. Test the safety gate: Attempt to disable 'dark_mode' (Blocked by 409 Conflict)
npx @cavdax/flagsmith-mcp toggle dark_mode off

# 4. Scan a local code file for Flagsmith SDK calls & structural AST dependencies
npx @cavdax/flagsmith-mcp scan apps/client/src/App.jsx

# 5. Synchronize Flagsmith instance with FalkorDB GraphBLAS matrix
npx @cavdax/flagsmith-mcp sync

# 6. Bypass safety gate with --force
npx @cavdax/flagsmith-mcp toggle dark_mode off --force

# 7. List stale feature flags with 0 dependents for dead-code pruning (>90 days)
npx @cavdax/flagsmith-mcp stale --days 90
```

### Cursor & Claude Code Zero-Config Setup

Add the Flagsmith safety gate to your AI coding agents in 10 seconds:

**Cursor IDE (`.cursor/mcp.json`):**
```json
{
  "mcpServers": {
    "flagsmith-blast-radius": {
      "command": "npx",
      "args": ["-y", "@cavdax/flagsmith-mcp"]
    }
  }
}
```

**Claude Desktop (`claude_desktop_config.json`):**
```json
{
  "mcpServers": {
    "flagsmith-blast-radius": {
      "command": "npx",
      "args": ["-y", "@cavdax/flagsmith-mcp"]
    }
  }
}
```

### Live REST API Endpoints

| Endpoint | Method | Latency | Description |
|---|---|---|---|
| `/api/flagsmith/features` | `GET` | ~12ms | Returns all features, enabled states, and degree metrics |
| `/api/flagsmith/blast-radius/:flag` | `GET` | ~34ms | Traverses FalkorDB multi-hop blast radius & governance verdicts |
| `/api/flagsmith/safe-toggle` | `POST` | ~28ms | Validates dependencies; returns `409 Conflict` if unsafe |
| `/api/flagsmith/scan-code` | `POST` | ~19ms | Analyzes code AST for SDK invocations, inferred dependencies & live status |
| `/api/flagsmith/sync` | `POST` | ~31ms | Ingests Flagsmith features, AST signals, and Git history into FalkorDB |
| `/api/flagsmith/stale` | `GET` | ~15ms | Detects stale flags (>90 days, 0 dependents) for dead code cleanup |

---

### Core Architecture: The Two-Plane Protection Model

CAVDAX synthesizes real-time pre-flight gating with multi-agent architectural memory:

- **Execution Plane — Real-Time Causal Gating (MCP Core):**
  - **Multi-Hop Reasoning**: Evaluates complex, variable-length architectural dependency paths (`[:DEPENDS_ON*1..8]`) across decisions, facts, and source documents.
  - **Graph Queries as Agent Tools**: Exposes real-time Cypher verification directly to agents through the Model Context Protocol (MCP) (`verifyActionGate`, `get_architectural_blast_radius`).
  - **Actions Based on Graph Topology**: Coding agents cannot execute file writes without graph clearance; actions are approved or blocked based on live topological invariant clearance.
  - **Explainable Results & Provenance**: Returns complete mathematical proof paths (`violation_paths`) with line-level ADR citations, eliminating opaque agent hallucinations.

- **State Plane — Multi-Agent Coordination & Memory Layer:**
  - **Procedural & Episodic Memory**: Stores persistent architectural rules, invariant constraints, and historical decision supersessions across sessions.
  - **Multi-Agent Coordination & Shared State**: Disparate agent runtimes (Cursor, Claude Code, Cline, Windsurf, and GitHub Actions CI) share the exact same FalkorDB graph state in real time.
  - **Multi-Tenant Graph Isolation**: Leverages FalkorDB's native multigraph topology to create completely isolated graphs per repository and branch (`cavdax_{repo}_{branch}`).

---

## The Fundamental Flaw of Modern Coding Agents

Modern autonomous coding agents (Claude Code, Cursor Composer, Windsurf, GitHub Copilot) rely on **Vector RAG (retrieval-augmented generation)** or lexical search to fetch repository context before modifying code.

### Why Vector RAG Fails in Production Repositories:
1. **Cosine Similarity Ignores Causal Directionality:** A superseded architecture decision (`ADR-001: Adopt TokenAuth v1`) and its superseding decision (`ADR-002: TokenAuth Deprecated; Enforce OAuth2`) share identical semantic vectors (`"payment", "auth", "checkout"`). Vector RAG often retrieves the older, higher-frequency document.
2. **Zero Invalidation Guarantees:** When an engineer commits a change to a config file (`CODEOWNERS`, `package.json`, or an ADR), vector embeddings remain static unless costly re-indexing is triggered.
3. **Unprotected Execution Paths:** Coding agents execute code modifications directly through standard file-system APIs without validating whether the decision justifying the change is still causally valid.

### How CAVDAX Outclasses Static Docs & Vector RAG

A side-by-side technical evaluation across runtime interception, causal blast radius computation, and deterministic multi-agent concurrency:

| Architectural Metric | Static ADRs (`adr-tools` / `Log4brains`) | Vector RAG (`Cursor @codebase` / `LangChain`) | Static Linters (`ArchUnit` / `Semgrep`) | **CAVDAX Causal Gate** (FalkorDB GraphBLAS + MCP) |
| :--- | :--- | :--- | :--- | :--- |
| **Underlying Data Model** | Flat Markdown Files | 1536d Float Vectors | Compiled AST / Bytecode | **Directed Causal DAG (FalkorDB)** |
| **Invalidation Latency** | Manual / None | $O(N \log N)$ (Re-index Lag) | Compile-Time Scan | **< 2.8ms GraphBLAS Traversal** |
| **Causal Blast Radius** | None (Isolated Files) | Top-K Cosine Similarity (Blind) | File-Scoped AST Rules | **Multi-Hop Reachability Matrix** |
| **Agent Write Interception** | Passive (Ignored) | Advisory Prompt Context | Post-Facto CI Bot Check | **Enclosed MCP Gate (Hard 403 Halt)** |
| **Multi-Agent Concurrency** | None (Git Conflicts) | None (Silent Overwrites) | None | **Distributed Mutex Leases** |
| **Three-Tier Hermetic Gate** | None (Passive Docs) | None (Advisory Prompt) | CI Only (Post-Facto) | **Three-Tier (MCP + Hook + CI Gate)** |
| **Verification Invariant** | Manual Peer Review | Probabilistic Guessing | Syntactic AST Match | **Deterministic Graph Provenance** |
| **Open Source & Provenance** | MIT / GPL (Varies) | Closed Proprietary SaaS | Apache-2.0 / LGPL | **Apache-2.0 / BSL-1.1 + Sigstore SLSA-3** |

*Evaluated deterministically via Boolean Semiring adjacency reachability in FalkorDB.*

---

## The CAVDAX Solution: Dual-Plane Enclosed Execution Architecture

Most agent governance tools are purely advisory (*"please respect this system prompt"*), which LLMs routinely ignore when context windows grow. CAVDAX converts repository engineering artifacts into an active, temporal causal Directed Acyclic Graph (DAG) stored inside **FalkorDB** and enforces **enclosed execution across two defensive planes**:

```
+---------------------------------------------------------------------------------------------------------+
| CAVDAX DUAL-PLANE ENCLOSED EXECUTION ARCHITECTURE (FLAGSMITH CAUSAL GATEWAY)                           |
+----------------------------------------------------+----------------------------------------------------+
| PLANE 1: LOCAL IN-IDE PRE-MUTATION FIREWALL        | PLANE 2: CLOUD CI/CD PULL REQUEST GATE            |
| (Cursor, Claude Code, Cline, Windsurf)             | (GitHub Actions, Headless CI, Merge Checks)        |
+----------------------------------------------------+----------------------------------------------------+
| • Intercepts safe_toggle_flag over local stdio     | • Executes npx @cavdax/flagsmith-mcp gate --sha... |
| • Traverses FalkorDB DAG in < 4.5ms before toggle  | • Scans PR diffs against feature flag dependencies |
| • ZERO breaking flag mutations reach production    | • HARD-BLOCKS PRs causing unmigrated flag breaks   |
| • Pre-flight blast radius (get_flag_blast_radius)  | • Emits rich Markdown blast report to STEP_SUMMARY |
+----------------------------------------------------+----------------------------------------------------+
```

When an agent or developer attempts a feature flag toggle:
1. **Multi-Signal Ingestion:** Flagsmith REST metadata (Signal 1), AST code references (Signal 2), and git temporal co-change matrices (Signal 3) are synthesized into FalkorDB.
2. **Topological GraphBLAS Traversal:** FalkorDB executes Boolean semiring matrix multiplication in **< 4.5ms** to determine multi-hop upstream prerequisites and downstream dependents.
3. **Plane 1 (In-IDE stdio Enclosure):** The agent's feature flag mutation tool (`safe_toggle_flag`) is enclosed inside a Cypher verification gate. If downstream dependents remain unmigrated without fallbacks, the gate **hard-blocks** execution (`BLOCKED_CRITICAL_BLAST_RADIUS`). Zero breaking mutations reach Flagsmith.
4. **Plane 2 (Cloud CI Pull Request Gate):** In automated workflows where autonomous agents open PRs, `cavdax-flagsmith-gate.yml` verifies flag grounding against the remote graph before code can ever merge.
5. **Dynamic Topological Recovery:** The agent is guided to synthesize fallback branches or migrate dependents, achieving verified zero-regression cutover.

---

## Graph Data Model & Causal Ontology

CAVDAX models engineering knowledge and agent actions using a formal 4-tier Causal Directed Acyclic Graph (DAG) optimized for sub-millisecond GraphBLAS traversal in FalkorDB:

```mermaid
graph TD
    subgraph Active_Path["Active Flagsmith Dependency Invariant Chain (Grounding & Downstream Dependency)"]
        direction TB
        F1["(:FlagsmithFeature {name: 'auth_v2', enabled: true})"]
        F2["(:FlagsmithFeature {name: 'dark_mode', enabled: true})"]
        F3["(:FlagsmithFeature {name: 'premium_analytics', enabled: true})"]
        F4["(:FlagsmithFeature {name: 'analytics_dashboard', enabled: true})"]
        CR["(:CodeReference {file: 'Header.jsx', line: 42, usage: 'useFlags'})"]
        A1["(:AgentAction {tool: 'safe_toggle_flag', verdict: 'APPROVED'})"]

        F2 -- "[:REQUIRES_PREREQUISITE]" --> F1
        F3 -- "[:DEPENDS_ON]" --> F2
        F4 -- "[:DEPENDS_ON]" --> F3
        CR -- "[:INVOKES_FLAG]" --> F2
        A1 -- "[:TARGETS_FLAG]" --> F2
    end

    subgraph Blocked_Path["Unsafe Mutation Path (Blocked by Enclosed MCP Gate)"]
        direction TB
        Agent["Autonomous Coding Agent"]
        Mutate["safe_toggle_flag(flag: 'dark_mode', state: false)"]
        Gate{"Enclosed MCP Gate<br/>FalkorDB GraphBLAS"}
        BlockedAction["(:AgentAction {verdict: 'BLOCKED_CRITICAL_BLAST_RADIUS'})"]
        ViolationReport["409 Conflict: 2 Active Dependents<br/>['premium_analytics', 'analytics_dashboard']"]

        Agent --> Mutate
        Mutate --> Gate
        Gate -. "[:HARD_BLOCK]" .-> BlockedAction
        BlockedAction --> ViolationReport
    end
```

### 1. Node Schemas & Labels
* **`(:FlagsmithFeature)` — Core Feature Toggle Entities:**
  * `id` *(String, Primary Key)*: Feature identifier (e.g., `'dark_mode'`, `'premium_analytics'`).
  * `name` *(String)*: Normalized feature name.
  * `enabled` *(Boolean)*: Current production state (`true` / `false`).
  * `description` *(String)*: Human-readable functional specification.
  * `type` *(String)*: Flag type (`'STANDARD'`, `'MULTIVARIATE'`).
  * `created_date` *(Integer)*: Epoch timestamp when registered in Flagsmith.
* **`(:CodeReference)` — Static AST Code References (Signal 2):**
  * `id` *(String, Primary Key)*: Unique code reference hash (e.g., `'ref-header-jsx-42'`).
  * `file_path` *(String)*: Source file path (e.g., `'apps/client/src/components/Header.jsx'`).
  * `line_number` *(Integer)*: Line number of flag access.
  * `ast_identifier` *(String)*: Invoked SDK method (`'hasFeature'`, `'useFlags'`).
  * `usage_type` *(String)*: Syntactic pattern (`'HOOK'`, `'CONDITIONAL_GUARD'`, `'PROP'`).
* **`(:GitCommit)` — Historical Co-Change Commits (Signal 3):**
  * `commit_hash` *(String, Primary Key)*: 40-character SHA commit hash.
  * `timestamp` *(Integer)*: Unix commit author epoch timestamp.
  * `author` *(String)*: Author identity and email.
  * `jaccard_coupling` *(Float)*: Temporal coupling strength $J(A, B)$.
* **`(:DownstreamDependent)` — Computed Transitive Ripple Entities:**
  * `target_flag` *(String)*: Dependent feature identifier.
  * `hop_depth` *(Integer)*: Topological graph distance (`1..6`).
  * `signals` *(List of Strings)*: Validating signals (`['TAG', 'AST', 'GIT']`).
  * `probability` *(Float)*: Bayesian unified link probability ($P = 1 - \prod(1 - c_i)$).
* **`(:AgentAction)` — Verified Tool Execution Audit Log:**
  * `id` *(String, Primary Key)*: Unique audit event hash.
  * `tool` *(String)*: Invoked MCP tool name (`'safe_toggle_flag'`).
  * `target_flag` *(String)*: Protected feature flag name (`'dark_mode'`).
  * `verdict` *(String)*: Gate verdict (`'APPROVED'` or `'BLOCKED_CRITICAL_BLAST_RADIUS'`).
  * `latency_ms` *(Float)*: GraphBLAS query execution time in milliseconds.
  * `timestamp` *(Integer)*: Execution epoch timestamp.

### 2. Relationship Types & Causal Semantics
* **`(:FlagsmithFeature)-[:DEPENDS_ON]->(:FlagsmithFeature)`**: Directed multi-hop dependency indicating that a downstream feature requires an upstream feature to be enabled.
* **`(:FlagsmithFeature)-[:REQUIRES_PREREQUISITE]->(:FlagsmithFeature)`**: Strict prerequisite edge; enabling target flag without this prerequisite active trips a validation block.
* **`(:CodeReference)-[:INVOKES_FLAG]->(:FlagsmithFeature)`**: Static AST provenance binding source code lines directly to feature flag graph nodes.
* **`(:GitCommit)-[:MODIFIES_FLAG]->(:FlagsmithFeature)`**: Historical co-change relationship contributing to Signal 3 temporal coupling matrices.
* **`(:FlagsmithFeature)-[:GUARDS]->(:DownstreamDependent)`**: Transitive guard indicating downstream code paths executionally protected by the flag.
* **`(:AgentAction)-[:TARGETS_FLAG]->(:FlagsmithFeature)`**: Mandatory audit link recorded in FalkorDB upon every MCP gate execution.

---

## 5 Architectural Pillars: Beyond Vector RAG & Naive Linters

CAVDAX provides production engineering organizations with an architectural defense against autonomous agent hallucinations:

| # | Competitive Moat | Problem in Traditional Agent Stacks | CAVDAX GraphBLAS Solution |
|---|---|---|---|
| **1** | **Proactive Intent Clearance** | Agents burn hundreds of tokens writing obsolete code before discovering a policy violation. | Agents query `check_intent_clearance` in **< 2ms pre-flight**. FalkorDB validates intent before a single byte of code is generated. |
| **2** | **Zero-Config Heuristic Parser** | Rigid tools fail unless engineering teams hand-craft strict YAML frontmatter on every document. | Intelligent regex heuristics extract titles, status, and supersessions from **plain unstructured Markdown, RFCs, and Notion exports**. |
| **3** | **Distributed Decision Locks** | Multiple autonomous agents (e.g., dual Devin or Claude Code instances) edit conflicting decisions concurrently. | `DecisionLockManager` provides **leased concurrency locks** (`acquire_decision_lock`, `release_decision_lock`) to eliminate multi-agent race conditions. |
| **4** | **Automated CI/CD PR Gate** | Manual CLI tools require local developer execution and are ignored during pull requests. | Automated **GitHub Action (`cavdax-gate.yml`)** scans changed files on PRs, blocks stale code, and outputs rich Markdown summaries to `$GITHUB_STEP_SUMMARY`. |
| **5** | **Out-of-Band Divergence Radar** | Developers remain unaware when a teammate commits a breaking ADR until an agent fails in production. | **Instant Out-of-Band Alerts** dispatch via **Resend HTML email** and **Service Worker Web Push** bound to decision blast radius. |

---

## System Architecture & Execution Flow

### 1. Full System Architecture Flowchart

![CAVDAX System Architecture Flowchart](./assets/System-Architecture.svg)

*CAVDAX provides two architectural perspectives:*
* **Variant A (Horizontal `flowchart LR`)**: Recommended for 16:9 widescreen video presentations and fast left-to-right dataflow comprehension.
* **Variant B (Vertical `graph TB`)**: Deep-dive structural hierarchy detailing node schemas, state persistence, and protocol boundaries.

#### Variant A: Horizontal 16:9 Widescreen Architecture Flowchart (Presentation View)
*Flows left-to-right from AI Agents & Web HUD, through the 3-Signal Ingestion & MCP Gate, directly into FalkorDB's GraphBLAS Causal Core, and out to Flagsmith API & the Out-of-Band Notification Plane:*

```mermaid
flowchart LR
    subgraph Client_Plane["1. Developer & Presentation Plane"]
        direction TB
        AIAgents["Autonomous AI Coding Agents<br/><i>Cursor / Claude Code / Windsurf</i>"]
        WebHUD["Flagsmith Web HUD & Operational Console<br/><i>/overview, /flags, /console, /mcp, /audit, /dev</i>"]
        RadarCanvas["Blast Radius Topology Radar<br/><i>GraphBLAS Adjacency Visualizer</i>"]
        HUDAlerts["Audio Invalidation Radar<br/><i>Web Audio Chime (880Hz)</i>"]
        WebHUD --> RadarCanvas
        WebHUD --> HUDAlerts
    end

    subgraph Gateway_Plane["2. 3-Signal Ingestion & MCP Gateway Plane"]
        direction TB
        MCPGate["Enclosed Flagsmith MCP Gate<br/><i>@cavdax/flagsmith-mcp</i>"]
        ServerAPI["Express API Server & SSE Stream<br/><i>apps/server/index.js</i>"]
        Sig1REST["Signal 1: Flagsmith REST Client<br/><i>core/ingestion/flagsmithClient.js</i>"]
        Sig2AST["Signal 2: Static AST Code Scanner<br/><i>core/ingestion/astScanner.js</i>"]
        Sig3Git["Signal 3: Git Temporal Coupling Miner<br/><i>core/ingestion/gitMiner.js</i>"]
        ServerAPI --> MCPGate
        ServerAPI --> Sig1REST
        ServerAPI --> Sig2AST
        ServerAPI --> Sig3Git
    end

    subgraph Causal_Engine["3. FalkorDB GraphBLAS Causal Core (Mathematical Heart)"]
        direction TB
        FalkorDB[("FalkorDB 0.4+<br/>Sparse Matrix Engine")]
        Features["(:FlagsmithFeature {name, enabled, type})"]
        CodeRefs["(:CodeReference {file_path, line, usage})"]
        GitCoupling["(:GitCommit {hash, jaccard_coupling})"]
        Dependents["(:DownstreamDependent {hop_depth, probability})"]
        Actions["(:AgentAction {tool: 'safe_toggle_flag', verdict})"]

        FalkorDB --- Features
        FalkorDB --- CodeRefs
        FalkorDB --- GitCoupling
        FalkorDB --- Dependents
        FalkorDB --- Actions

        Features -. "[:REQUIRES_PREREQUISITE]" .-> Features
        Dependents -. "[:DEPENDS_ON]" .-> Features
        CodeRefs -. "[:INVOKES_FLAG]" .-> Features
        GitCoupling -. "[:MODIFIES_FLAG]" .-> Features
        Actions -. "[:TARGETS_FLAG]" .-> Features
    end

    subgraph Target_Ecosystem["4. Target Ecosystem & Notification Plane"]
        direction TB
        FlagsmithAPI["Self-Hosted Flagsmith API<br/><i>/flagsmith/api/v1/</i>"]
        TargetRepo["Target Codebase & AST<br/><i>Safe Zero-Regression Mutation</i>"]
        EmailRadar["Resend Transactional Divergence Alert<br/><i>sahnirmaan.live</i>"]
        WebPushBroker["VAPID Web Push Broker<br/><i>RFC 8292 (/sw.js)</i>"]
        DevInbox["Developer Alerts Inbox<br/><i>Blast-Radius Bound Notification</i>"]

        EmailRadar --> DevInbox
        WebPushBroker --> DevInbox
    end

    %% Left-to-Right Execution & Invalidation Flows
    AIAgents ==>|"1. stdio / SSE (safe_toggle_flag, get_flag_blast_radius)"| MCPGate
    WebHUD <==>|"REST & SSE Live Topology"| ServerAPI
    MCPGate <==>|"2. Sub-millisecond Cypher (< 4.5ms GraphBLAS Traversal)"| FalkorDB
    MCPGate -->|"3a. 200 OK (Safe Cutover Approved)"| FlagsmithAPI
    MCPGate -.->|"3b. 409 Conflict (Blocked Critical Blast Radius)"| AIAgents

    Sig1REST <==>|"Poll & Webhook Flag State"| FlagsmithAPI
    Sig2AST <==>|"AST Syntactic Extraction"| TargetRepo
    Sig3Git <==>|"Jaccard Co-Change Mining"| TargetRepo
    ServerAPI -->|"Dispatch Transactional Email"| EmailRadar
    ServerAPI -->|"Dispatch Browser Push Notification"| WebPushBroker
    ServerAPI -->|"SSE Invalidation Event"| HUDAlerts
```

#### Variant B: Vertical Structural Architecture Flowchart (Hierarchy View)

```mermaid
graph TB
    subgraph Client_Plane["1. Developer & Presentation Plane"]
        WebHUD["Web HUD & Visual Console (/overview, /flags, /console, /mcp, /audit, /dev)"]
        Radar["Interactive Blast Radius Topology Radar"]
        NodeInspector["Draggable Node Inspector & Live Dependency Chips"]
        ASTViewer["AST Syntactic Call Site Inspector"]
        AIAgents["AI Coding Agents (Claude Code, Cursor, Windsurf, Devin)"]
        Notifications["Developer Inbox & Web Push Service Worker (/sw.js)"]
        WebHUD --> Radar
        Radar --> NodeInspector
        Radar --> ASTViewer
    end

    subgraph Gateway_Plane["2. Gateway & 3-Signal Ingestion Plane"]
        Server["Express API Server (apps/server/index.js)"]
        MCPGateway["Enclosed Flagsmith MCP Gateway (apps/flagsmith-mcp)"]
        Signal1["Signal 1: Flagsmith REST Client (core/ingestion/flagsmithClient.js)"]
        Signal2["Signal 2: Static AST Code Scanner (core/ingestion/astScanner.js)"]
        Signal3["Signal 3: Git Temporal Coupling Miner (core/ingestion/gitMiner.js)"]
        BayesianAggregator["Bayesian Link Aggregator: P = 1 - ∏(1 - c_i)"]
        EmailDispatcher["Transactional Alert Engine (Resend API / sahnirmaan.live)"]
        WebPushBroker["VAPID Web Push Broker (RFC 8292)"]
        WebhookReceiver["Flagsmith Webhook Ingestion (/api/flagsmith/webhook)"]

        Server --> MCPGateway
        Server --> Signal1
        Server --> Signal2
        Server --> Signal3
        Signal1 --> BayesianAggregator
        Signal2 --> BayesianAggregator
        Signal3 --> BayesianAggregator
        BayesianAggregator --> Server
        Server --> EmailDispatcher
        Server --> WebPushBroker
        WebhookReceiver --> Server
    end

    subgraph Causal_Engine["3. FalkorDB GraphBLAS Causal Core"]
        FalkorDB[("FalkorDB 0.4+ (GraphBLAS Matrix Engine)")]
        Features["(:FlagsmithFeature {name, enabled, type})"]
        CodeRefs["(:CodeReference {file_path, line, usage})"]
        GitCommits["(:GitCommit {commit_hash, jaccard_coupling})"]
        Dependents["(:DownstreamDependent {hop_depth, probability})"]
        AgentActions["(:AgentAction {id, tool, target_flag, verdict})"]

        FalkorDB --> Features
        FalkorDB --> CodeRefs
        FalkorDB --> GitCommits
        FalkorDB --> Dependents
        FalkorDB --> AgentActions

        Features -. "[:REQUIRES_PREREQUISITE]" .-> Features
        Dependents -. "[:DEPENDS_ON]" .-> Features
        CodeRefs -. "[:INVOKES_FLAG]" .-> Features
        GitCommits -. "[:MODIFIES_FLAG]" .-> Features
        AgentActions -. "[:TARGETS_FLAG]" .-> Features
    end

    subgraph Target_Ecosystem["4. Target Flagsmith Platform & Repositories"]
        FlagsmithEngine["Self-Hosted Flagsmith API (/flagsmith/api/v1/)"]
        TargetCodebases["Target Client & Backend Codebases"]
        AuditLogStore["PostgreSQL Flagsmith Audit Store"]
        FlagsmithEngine --> AuditLogStore
    end

    AIAgents <==>|"MCP Stdio / HTTP SSE (safe_toggle_flag, get_flag_blast_radius)"| MCPGateway
    WebHUD <==>|"REST & SSE Events (/api/flags, /api/graph)"| Server
    MCPGateway <==>|"Parameterized Cypher (< 4.5ms Matrix Traversal)"| FalkorDB
    Signal1 <==>|"Flagsmith REST API Polling & Contract Sync"| FlagsmithEngine
    Signal2 <==>|"AST Code Invocations (hasFeature, useFlags)"| TargetCodebases
    Signal3 <==>|"Git Log Mining (Jaccard Co-Change)"| TargetCodebases
    MCPGateway -->|"Verified Atomic Toggle on Gate Approval"| FlagsmithEngine
    FlagsmithEngine -->|"Live Flag Change Webhooks"| WebhookReceiver
    EmailDispatcher -->|"Actionable Causal HTML Divergence Email"| Notifications
    WebPushBroker -->|"Instant Desktop/Mobile Push"| Notifications
```

#### Notification Plane (Out-of-Band Divergence Radar)
CAVDAX treats notifications as an essential, enterprise-grade feedback loop that prevents AI agents from executing against stale context even when developers are offline:
1. **Resend Transactional Email (`apps/server/email.js`)**: Divergence events dispatch clean HTML emails via `sahnirmaan.live` with Feature Flag ID, ASCII causal dependency tree, and blast-radius deep links.
2. **RFC 8292 VAPID Web Push (`apps/server/webPush.js` & `public/sw.js`)**: Hardware OS and browser-level notification badges delivering instant disruption alerts.
3. **Procedural In-HUD Audio Chimes (`apps/client/src/App.jsx`)**: Synthesizes 880Hz / 440Hz dual-tone Web Audio chimes on invalidation events.
4. **Live Invalidation Pitch Trigger (`Simulate Alert`)**: Accessible via top HUD toolbar and Preferences Modal for live demonstrations.

### 2. Multi-Layer Architecture & FalkorDB GraphBLAS Engine Flowchart
![CAVDAX Layer Architecture Flowchart](./assets/System-Architecture2.svg)

```mermaid
graph LR
    subgraph Ingestion_Layer["Layer 1: 3-Signal Ingestion & Bayesian Aggregator"]
        Sig1["Signal 1: Flagsmith REST (Tags & Contracts)"] --> Bayes["Bayesian Aggregator<br/>P = 1 - ∏(1 - c_i)"]
        Sig2["Signal 2: Static AST Code Scanner"] --> Bayes
        Sig3["Signal 3: Git Temporal Co-Change Miner"] --> Bayes
    end

    subgraph Causal_Matrix["Layer 2: GraphBLAS Causal DAG (FalkorDB)"]
        direction TB
        F1["(:FlagsmithFeature {name: 'auth_v2', enabled: true})"]
        F2["(:FlagsmithFeature {name: 'dark_mode', enabled: true})"]
        F3["(:FlagsmithFeature {name: 'premium_analytics', enabled: true})"]
        F4["(:FlagsmithFeature {name: 'analytics_dashboard', enabled: true})"]

        F2 -- "[:REQUIRES_PREREQUISITE]" --> F1
        F3 -- "[:DEPENDS_ON]" --> F2
        F4 -- "[:DEPENDS_ON]" --> F3
    end

    subgraph Gating_Layer["Layer 3: Enclosed MCP Execution Gate"]
        MCPTool["safe_toggle_flag (flag_name, target_state)"]
        GateLogic{"computeFlagBlastRadius (FalkorDB Cypher)"}
        Approved["Verdict: APPROVED (< 4.5ms)"]
        Blocked["Verdict: BLOCKED_CRITICAL_BLAST_RADIUS (409 Conflict)"]
        FlagsmithPatch["Atomic REST Patch to Flagsmith API"]
        AuditLedger[("(:AgentAction Audit Node)")]

        MCPTool --> GateLogic
        GateLogic -- "Zero Active Dependents / Fallback Verified" --> Approved --> FlagsmithPatch --> AuditLedger
        GateLogic -- "Unmigrated Active Dependents Found" --> Blocked --> AuditLedger
    end

    Ingestion_Layer --> Causal_Matrix
    Causal_Matrix --> Gating_Layer
```

### 3. Enclosed MCP Protocol Execution Gate Flowchart
![CAVDAX Enclosed MCP Gate Flowchart](./assets/MCP-FLOWCHART.svg)

```mermaid
graph TD
    Start["Agent invokes 'safe_toggle_flag' or 'get_flag_blast_radius'"] --> Extract["Extract Flag Name (e.g. 'dark_mode') & Target State"]
    Extract --> Query["Execute Parameterized Cypher against FalkorDB GraphBLAS"]
    Query --> Traversal{"Trace Causal Path:
Target Flag -> Downstream Dependents (Hop 1..6)
Evaluate Active State of Dependents"}

    Traversal -- "Clean Path: Zero Active Dependents / Fallbacks Present" --> Approved["Gate Verdict: APPROVED (< 4.5ms)"]
    Approved --> FlagsmithCall["Atomic REST PATCH /api/v1/flags/ to Self-Hosted Flagsmith"]
    FlagsmithCall --> LogApproved["Create (:AgentAction {status: 'APPROVED'}) in FalkorDB"]
    LogApproved --> ReturnApproved["Return JSON 200 OK + Execution Latency to Agent"]

    Traversal -- "Critical Blast Radius: Unmigrated Active Dependents" --> Blocked["Gate Verdict: BLOCKED_CRITICAL_BLAST_RADIUS"]
    Blocked --> LogBlocked["Create (:AgentAction {status: 'BLOCKED'}) in FalkorDB"]
    LogBlocked --> ZeroMutations["ZERO MUTATIONS DISPATCHED TO FLAGSMITH"]
    ZeroMutations --> ReturnBlocked["Return JSON 409 Conflict with exact violation path
& Guidance: migrate dependents or implement fallbacks"]
```

### 4. Autonomous Causal Invalidation & Verification Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer / Flagsmith Admin
    actor Agent as Autonomous AI Agent
    participant Web as Visual Console HUD
    participant Gate as Enclosed Flagsmith MCP Gate
    participant Graph as FalkorDB (GraphBLAS)
    participant Flagsmith as Flagsmith REST API

    Note over Dev, Flagsmith: ACT I: Baseline Flagsmith Ingestion and Grounding
    Dev->>Flagsmith: Configure Flags dark_mode (ENABLED) and auth_v2 (ENABLED)
    Gate->>Graph: Ingest Flag Inventory and Establish Prerequisite REQUIRES_PREREQUISITE
    Web->>Graph: Fetch Causal DAG and Display Grounded Feature Chain

    Note over Dev, Flagsmith: ACT II: 3-Signal Dependency Mining
    Gate->>Flagsmith: Signal 1 - Mine contract tags (confidence = 1.0)
    Gate->>Flagsmith: Signal 2 - Scan codebase AST for useFlags / hasFeature (conf = 0.75-0.85)
    Gate->>Graph: Signal 3 - Mine Git commit co-changes (Jaccard index)
    Graph->>Graph: Formulate Bayesian Edge: premium_analytics and analytics_dashboard depend on dark_mode (3.1ms)
    Graph-->>Web: SSE Event - Multi-Hop Blast Radius Mapped (2 Dependents, Hop 1 and 2)

    Note over Agent, Flagsmith: ACT III: Blind Agent Toggle Intercepted
    Agent->>Gate: safe_toggle_flag(flag 'dark_mode', enabled false)
    Gate->>Graph: computeFlagBlastRadius(flagName 'dark_mode')
    Graph-->>Gate: Verdict: BLOCKED_CRITICAL_BLAST_RADIUS (2 active dependents unmigrated)
    Gate-->>Agent: 409 Conflict - Zero mutations sent to Flagsmith. Downstream crash prevented!
    Gate->>Web: Log BLOCKED attempt on Compliance Audit Ledger

    Note over Agent, Flagsmith: ACT IV: Autonomous Fallback Resolution and Safe Cutover
    Agent->>Agent: Implement graceful fallback branch in analytics_dashboard.jsx
    Agent->>Gate: safe_toggle_flag(flag 'dark_mode', enabled false, fallback_verified true)
    Gate->>Graph: computeFlagBlastRadius(flagName 'dark_mode')
    Graph-->>Gate: Verdict: APPROVED (1.8ms - fallbacks grounded)
    Gate->>Flagsmith: PATCH /api/v1/flags/dark_mode/ with enabled false
    Flagsmith-->>Gate: 200 OK - Flag safely disabled
    Gate->>Web: Log APPROVED execution on Compliance Audit Ledger (ACT-004-SAFE-TOGGLE)
    Gate-->>Agent: 200 OK - Flag toggled safely with zero downstream regressions
```

---

## Production Interface Showcase

Captured directly from our live production deployment at [`https://cavdax-flagsmith.sahnirmaan.live/`](https://cavdax-flagsmith.sahnirmaan.live/):

### 1. Flagsmith Blast Radius Radar & Safe Toggle Surface (`/flags`)
> Real-time 3-Signal blast radius telemetry featuring multi-hop transitive ripple detection, upstream prerequisite guards, AST live code scanner, and Safe Toggle Switch with 409 Conflict barrier.

<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/screenshots/live_purged_flags_radar_dark.png" />
  <source media="(prefers-color-scheme: light)" srcset="./assets/screenshots/live_purged_flags_radar_light.png" />
  <img src="./assets/screenshots/live_purged_flags_radar_dark.png" alt="Flagsmith Blast Radius Radar" width="100%" />
</picture>

<p><em>Figure 1: Real-time 3-Signal Flagsmith Blast Radius Radar featuring multi-hop transitive ripple detection, upstream prerequisite guards, and 409 Conflict safety barrier.</em></p>
</div>

### 2. Developer Diagnostics Console & Hackathon Mode Enclave (`/dev`)
> Monochromatic hardware bench instrument displaying real-time FalkorDB/Redis connectivity, Hackathon Mode zero-paywall switch, live system state telemetry, and diagnostic triggers.

<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/screenshots/dev_console_dark.png" />
  <source media="(prefers-color-scheme: light)" srcset="./assets/screenshots/dev_console_light.png" />
  <img src="./assets/screenshots/dev_console_dark.png" alt="Developer Diagnostics Console" width="100%" />
</picture>

<p><em>Figure 2: Monochromatic hardware bench instrument displaying real-time FalkorDB/Redis connectivity, Hackathon Mode zero-paywall switch, and diagnostic telemetry.</em></p>
</div>

### 3. Static AST Code Inspector & SDK Call Trace (Signal 2)
> Deep AST syntactic inspection capturing conditional guards, boolean conjunctions, and SDK call sites across client and server source trees.

<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/screenshots/ast_inspector.png" />
  <source media="(prefers-color-scheme: light)" srcset="./assets/screenshots/ast_inspector.png" />
  <img src="./assets/screenshots/ast_inspector.png" alt="Flagsmith AST Code Inspector" width="950" />
</picture>

<p><em>Figure 3: Deep AST syntactic inspection capturing conditional guards, boolean conjunctions, and SDK call sites across client and server source trees.</em></p>
</div>

### 4. Connected Repository Developer Workspace (`/console`)
> Real-time developer workspace and **Interactive Causal Verification Console** featuring dynamic hierarchical DAG layouts, Flagsmith code scanning, and live terminal provenance stream.

<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/screenshots/live_flagsmith_console_dark.png" />
  <source media="(prefers-color-scheme: light)" srcset="./assets/screenshots/live_flagsmith_console_light.png" />
  <img src="./assets/screenshots/live_flagsmith_console_dark.png" alt="CAVDAX Flagsmith Developer Console" width="100%" />
</picture>

<p><em>Figure 4: Real-time developer workspace and interactive causal verification console featuring dynamic hierarchical DAG layouts, Flagsmith code scanning, and live terminal provenance stream.</em></p>
</div>

### 5. Compliance Audit Ledger (`/audit`)
> Tamper-evident operational ledger recording every tool execution, verdict, target feature flag, and grounding dependency state in FalkorDB.

<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/screenshots/live_flagsmith_audit_dark.png" />
  <source media="(prefers-color-scheme: light)" srcset="./assets/screenshots/live_flagsmith_audit_light.png" />
  <img src="./assets/screenshots/live_flagsmith_audit_dark.png" alt="CAVDAX Compliance Audit Ledger" width="100%" />
</picture>

<p><em>Figure 5: Tamper-evident operational ledger recording every tool execution, verdict, target feature flag, and grounding dependency state in FalkorDB.</em></p>
</div>

### 6. Architectural Executive Overview (`/overview`)
> Operational command HUD providing instant system telemetry, 3-signal mesh ingestion status, and rapid navigation across all platform capabilities.

<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/screenshots/live_purged_overview_dark.png" />
  <source media="(prefers-color-scheme: light)" srcset="./assets/screenshots/live_purged_overview_light.png" />
  <img src="./assets/screenshots/live_purged_overview_dark.png" alt="CAVDAX Executive Overview" width="100%" />
</picture>

<p><em>Figure 6: Monochromatic porcelain / obsidian operational HUD overview displaying live system state, active feature counts, and 3-signal mesh telemetry.</em></p>
</div>

---

## Out-of-Band Divergence Radar & Real-Time Alerts

While CAVDAX's enclosed MCP gate (`safe_toggle_flag`) prevents active coding agents from flipping breaking feature flags blindly in real-time, production engineering is fundamentally asynchronous. If a teammate toggles or deprecates an upstream prerequisite flag like `dark_mode` or `auth_v2` directly in the Flagsmith dashboard, downstream systems and agent workflows depend on immediate notifications.

CAVDAX provides **Dual-Plane Protection**:
1. **In-Flight Enclosed Gate (MCP)**: Intercepts active coding agents in real-time prior to any flag mutation.
2. **Out-of-Band Divergence Radar (Email + Web Push + Webhooks)**: Automatically notifies the flag owner or engineering team asynchronously the millisecond an incompatible flag mutation is detected.

```
[Flagsmith Webhook: Flag Mutated] ──► [POST /api/flagsmith/webhook]
                                            │
                                            ▼
                      [FalkorDB GraphBLAS Causal Traversal]
                                            │
                     ┌──────────────────────┴──────────────────────┐
                     ▼                                             ▼
       [Resend Transactional Email]                 [VAPID Service Worker Push]
       - Monochromatic Console HTML                - Background OS Notification
       - Actionable Causal Provenance              - Works with tab closed
       - 1-Click HUD Blast Radius Link             - Offline Developer Alert
```

### 1. Blast-Radius Bound Causal Notifications
Unlike noisy CI bots that broadcast spam to an entire team, CAVDAX traverses the FalkorDB causal DAG:
`(:FlagsmithFeature {name: $flagName})<-[:DEPENDS_ON*1..6]-(downstream:FlagsmithFeature)`  
Alerts are dispatched **strictly to the registered owner or CODEOWNER of the affected downstream services**, completely eliminating alert fatigue.

### 2. Dual Out-of-Band Delivery Channels
* **Developer-Console Transactional Email (Resend API)**:
  * Dispatched from `no-reply@sahnirmaan.live` with verified DKIM/SPF domain authentication.
  * Formatted in an industrial monochromatic developer aesthetic containing the exact mutated feature flag, affected downstream services, multi-hop transitive path depth, direct 1-click link to the visual Blast Radius Radar in the CAVDAX HUD, and copy-paste remediation CLI directive.
  * Includes an automated sliding-window alert debouncer (5-minute window) to prevent spam during rapid flag reconfigurations.
* **Background Web Push (Service Worker + VAPID)**:
  * Native browser `PushManager` subscription registered via `/sw.js` and managed by `apps/client/src/services/webPush.js`.
  * Elliptic-curve cryptography (ECDSA NIST P-256) VAPID key pairs generated and persisted server-side.
  * Delivers operating system-level desktop notifications even when browser tabs are closed.

### 3. Interactive Pitch & Demo Trigger (`/api/alerts/simulate-invalidation`)
For live team demonstrations and interactive architectural evaluation:
* The HUD provides a **"Simulate Incompatible Flag Mutation"** action in the Developer Console and Preferences.
* Instantly triggers FalkorDB causal invalidation, broadcasts SSE to the live DAG canvas, and dispatches an authentic divergence alert to the evaluator's inbox with measured sub-second latency.

---

## Core Cypher Queries (FalkorDB GraphBLAS)

CAVDAX leverages FalkorDB's linear-algebraic matrix engine to run deep multi-hop traversals in sub-millisecond timeframes.

### Query 1: Topological Multi-Hop Blast Radius (`computeFlagBlastRadius`)
Traverses both upstream prerequisites and downstream dependents via GraphBLAS sparse matrix operations:

```cypher
MATCH (target:FlagsmithFeature {name: $flagName})
OPTIONAL MATCH upstreamPath = (target)-[:DEPENDS_ON|GUARDS*1..3]->(up:FlagsmithFeature)
OPTIONAL MATCH downstreamPath = (down:FlagsmithFeature)-[:DEPENDS_ON|GUARDS*1..3]->(target)
OPTIONAL MATCH blocked = (target)-[:BLOCKS]->(b:FlagsmithFeature)
RETURN target.name AS target_flag,
       target.enabled AS target_enabled,
       target.description AS target_description,
       collect(DISTINCT {
         name: up.name,
         enabled: up.enabled,
         depth: length(upstreamPath)
       }) AS upstream_prerequisites,
       collect(DISTINCT {
         name: down.name,
         enabled: down.enabled,
         depth: length(downstreamPath)
       }) AS downstream_dependents,
       collect(DISTINCT {
         name: b.name,
         enabled: b.enabled
       }) AS blocked_features
```

### Query 2: Feature Inventory & Centrality Degrees (`listFlagsmithFeatures`)
Computes in-degree dependents and out-degree prerequisites across all synchronized feature flags:

```cypher
MATCH (f:FlagsmithFeature)
OPTIONAL MATCH (f)-[out:DEPENDS_ON]->(:FlagsmithFeature)
OPTIONAL MATCH (:FlagsmithFeature)-[inc:DEPENDS_ON]->(f)
RETURN f.name AS name,
       f.enabled AS enabled,
       f.description AS description,
       f.type AS type,
       count(DISTINCT out) AS out_degree_dependencies,
       count(DISTINCT inc) AS in_degree_dependents,
       CASE 
         WHEN count(DISTINCT inc) >= 5 THEN 'CRITICAL'
         WHEN count(DISTINCT inc) >= 2 THEN 'HIGH'
         WHEN count(DISTINCT inc) = 1 THEN 'MODERATE'
         ELSE 'LOW'
       END AS risk_tier
ORDER BY in_degree_dependents DESC, f.name ASC
```

### Query 3: Stale Flag Pruning & Sunset Detection (`listStaleFlags`)
Discovers enabled feature flags that have zero downstream callers relying on them:

```cypher
MATCH (f:FlagsmithFeature)
WHERE f.enabled = true
OPTIONAL MATCH (:FlagsmithFeature)-[inc:DEPENDS_ON|GUARDS]->(f)
WITH f, count(inc) AS dependent_count
WHERE dependent_count = 0
RETURN f.name AS name,
       f.description AS description,
       f.type AS type,
       0 AS active_dependents,
       'Safe candidate to sunset and prune without downstream impact' AS recommendation
ORDER BY f.name ASC
```

### FalkorDB GraphBLAS vs. Whole-Graph Batch Algorithms (Engineering Rationale)

A fundamental design question for graph-grounded agent architectures is: *Why use targeted variable-length path traversals (`*1..4`) rather than global graph algorithms like PageRank or Louvain Community Detection?*

1. **The Synchronous Agent Latency Budget (< 2.5ms):**
   When an autonomous coding agent invokes an MCP tool call prior to a code edit, the tool execution time directly blocks the LLM token generation stream. Running whole-graph iterative eigenvector algorithms (e.g. PageRank across thousands of nodes) introduces 200ms–1500ms of latency, causing disruptive UI stutter in the developer's IDE. In contrast, FalkorDB's **GraphBLAS linear-algebraic sparse-matrix core** executes targeted BFS/DFS path traversals in **1.2ms to 2.4ms**, delivering instant verification without stalling agent velocity.
2. **Deterministic Causal Invariants vs. Probabilistic Centrality:**
   An architectural invariant is a binary, enforceable rule—not a statistical popularity contest. If `ADR-002` supersedes `ADR-001`, any downstream decision depending on `ADR-001` is invalid regardless of how "popular" or central `ADR-001` was in the graph. Targeted multi-hop causal walks guarantee **zero-false-positive invalidation**.
3. **Shortest Justification Path & Minimal Proof:**
   When an agent action is blocked, both the human engineer and the AI agent require the **minimal mathematical proof path** explaining the rejection. Variable-length path extraction (`nodes(path)`) returns the exact causal chain `(Decision)-[:DEPENDS_ON]->(Fact)-[:EXTRACTED_FROM]->(Source)`, allowing the agent to self-correct autonomously.
4. **Sub-Millisecond Dynamic Blast Radius:**
   When an ADR is edited or superseded, CAVDAX computes the downstream transitive impact radius (`(d:Decision)-[:DEPENDS_ON*1..4]->(staleFact)`) dynamically, identifying every affected microservice and component in < 3ms.

---

## Empirical Benchmarks & Dual-Mode Execution Architecture

To provide complete architectural transparency and technical rigor, CAVDAX separates its evaluation infrastructure into two distinct operational modes:

1. **Interactive Pedagogical Simulator (Mode 1 — Client/Harness)**:
   - Implemented in `benchmark/evaluate.js` and the in-browser 4-act console (`apps/client/src/App.jsx`).
   - Evaluates pure in-memory topological DAG invalidation complexity in high-resolution nanoseconds/microseconds without requiring external daemon infrastructure, ensuring judges and visitors can immediately observe causal cascades on zero-dependency static deployments.
2. **Live FalkorDB GraphBLAS Execution Engine (Mode 2 — Production MCP)**:
   - Implemented in `core/graph/queries.js` and `@cavdax/mcp-server`.
   - Executes real bounded variable-length Cypher traversals (`OPTIONAL MATCH path=(d)-[:DEPENDS_ON*1..4]->...`) over live Redis/FalkorDB socket connections with matrix-multiplication GraphBLAS speed, writing audit trail nodes (`:AgentAction {id, status, grounded_in}`) to disk before any filesystem write.

### 1. Algorithmic Invalidation Complexity: Vector RAG vs. CAVDAX (10 Scenarios)
Evaluated via `node benchmark/evaluate.js` comparing un-grounded lexical/vector retrieval against causal DAG gate resolution:

| Scenario ID | Category | Vector RAG Baseline | CAVDAX Causal DAG Gate | Traversal Latency |
|---|---|---|---|---|
| **SCEN-01** | Authentication Migration | [STALE] Stale TokenAuth v1 written | [BLOCKED] `BLOCKED_SUPERSEDED_SOURCE` | `< 0.20ms` |
| **SCEN-02** | API Routing Breaking Change | [STALE] Deprecated /v1 route built | [BLOCKED] `BLOCKED_SUPERSEDED_SOURCE` | `< 0.05ms` |
| **SCEN-03** | Crypto CVE Deprecation | [STALE] Vulnerable crypto-js imported | [BLOCKED] `BLOCKED_STALE_FACT` | `< 0.05ms` |
| **SCEN-04** | CODEOWNERS Governance Shift | [STALE] Stale reviewer assigned | [BLOCKED] `BLOCKED_SUPERSEDED_SOURCE` | `< 0.05ms` |
| **SCEN-05** | Docker Base Image Bump | [STALE] Outdated node:18 base written | [BLOCKED] `BLOCKED_STALE_FACT` | `< 0.05ms` |
| **SCEN-06** | NoSQL to SQL Migration | [STALE] Mongoose schema created | [BLOCKED] `BLOCKED_SUPERSEDED_SOURCE` | `< 0.05ms` |
| **SCEN-07** | Secret Vault Transition | [STALE] Plaintext env var leaked | [BLOCKED] `BLOCKED_DECISION_INVALIDATED` | `< 0.05ms` |
| **SCEN-08** | Feature Flag Deprecation | [STALE] Dead flag conditional reintroduced | [BLOCKED] `BLOCKED_SUPERSEDED_SOURCE` | `< 0.05ms` |
| **SCEN-09** | Rate-Limit Threshold Lowering | [STALE] Flood test tripped alarms | [BLOCKED] `BLOCKED_STALE_FACT` | `< 0.05ms` |
| **SCEN-10** | OSS License Compliance | [STALE] Incompatible license header added | [BLOCKED] `BLOCKED_SUPERSEDED_SOURCE` | `< 0.05ms` |

* **Vector RAG Failure Rate:** **90-100% (stale document hallucinations due to lexical/semantic keyword overlap)**
* **CAVDAX Gate Protection Rate:** **100% (deterministic topological block on stale facts or superseded sources)**
* **Average Gate Resolution:** **~0.03ms (In-Memory DAG Traversal) / ~1.65ms (Live FalkorDB Network Round-Trip)**

### 2. Large-Scale Enterprise DAG Performance (FalkorDB GraphBLAS Engine)
Evaluated via `node benchmark/scale_generator.js` (Live FalkorDB measurement with local container online via `docker-compose up -d falkordb`; offline mode reports algorithmic GraphBLAS $O(nnz)$ projections):

| Total Nodes | Total Edges | Graph Depth | Mode | Gate Query 1 Latency | Cascade Query 2 Latency | GraphBLAS Memory |
|---|---|---|---|---|---|---|
| **Active DB** | Live Edges | 4-8 hops | **LIVE-DB** | **~1.85 ms** | **~2.40 ms** | Live Process |
| **3,300** | 3,270 | 4 hops | PROJECTION | ~1.90 ms | ~2.84 ms | ~6.9 MB |
| **9,900** | 9,810 | 4 hops | PROJECTION | ~2.04 ms | ~3.08 ms | ~12.3 MB |
| **25,150** | 24,940 | 4 hops | PROJECTION | ~2.16 ms | ~3.28 ms | ~24.8 MB |
| **50,550** | 50,100 | 4 hops | PROJECTION | ~2.25 ms | ~3.43 ms | ~45.7 MB |

### 3. Section 37 Truth-in-Data Governance
* **Transparent Execution Delineation**: In-memory DAG evaluations and live Redis/FalkorDB Cypher queries are explicitly distinguished. Projections are labeled `PROJECTION` and live database traversals are labeled `LIVE-DB`.
* **Zero Synthetic Hardcoding**: Invalidation gate latencies are measured dynamically at runtime using high-resolution hardware timers (`performance.now()` / `process.hrtime.bigint()`). Hardcoded synthetic success states are strictly prohibited across both production code and benchmark suites.


---

## Live Demo: The 4-Act Storyline

The Web HUD features an interactive 4-Act stepper designed for video demonstration and evaluation:

* **Act I: Baseline Grounding (`dark_mode` Active):** The baseline feature flag inventory is ingested from the self-hosted Flagsmith instance into FalkorDB. Upstream prerequisite `auth_v2` is satisfied, and `dark_mode` is enabled across the application.
* **Act II: 3-Signal Dependency Mining:** Flagsmith contract tags (Signal 1), AST static code references (Signal 2), and Git temporal coupling matrices (Signal 3) are synthesized into FalkorDB in 3.1ms. Transitive dependents `premium_analytics` and `analytics_dashboard` are mapped downstream of `dark_mode`.
* **Act III: Blind Agent Toggle Intercepted:** An autonomous coding agent attempts to invoke `safe_toggle_flag('dark_mode', false)` without verifying downstream callers. The enclosed MCP gate traverses the GraphBLAS adjacency matrix, detects 2 active unmigrated dependents with zero fallbacks, and emits `[ 409 CONFLICT: BLOCKED_CRITICAL_BLAST_RADIUS ]`. Zero mutations reach Flagsmith; production downtime is prevented.
* **Act IV: Autonomous Fallback Resolution & Safe Cutover:** The agent synthesizes a defensive fallback branch in `analytics_dashboard.jsx`, satisfying topological invariants. The gate re-evaluates in 1.8ms, validates the fallback, and emits `[ 200 OK: APPROVED ]`. The atomic PATCH is dispatched to Flagsmith, and the execution is logged to the Compliance Audit Ledger.

---

## Live Production Deployment

CAVDAX is deployed and running live in production:
**Live Console**: [https://cavdax-flagsmith.sahnirmaan.live/](https://cavdax-flagsmith.sahnirmaan.live/)

### Production Architecture & Cloud Infrastructure:
* **Edge Reverse Proxy & Automated SSL:** Caddy 2 reverse proxy with dynamic TLS/SSL certificates terminates production traffic over port 443 with HSTS and security headers.
* **Low-Latency Streaming:** Dedicated `/api/events` Server-Sent Events (SSE) pipeline with reverse-proxy buffering disabled (`proxy_buffering off`) for instant UI graph invalidation pulses.
* **Remote Model Context Protocol (MCP) Endpoint:** Accessible at `https://cavdax-flagsmith.sahnirmaan.live/api/mcp/sse` for remote coding agents, IDEs, and CI/CD pipelines.
* **GraphBLAS Backend Mesh:** Low-overhead Docker Compose mesh linking the Node.js Express gateway and FalkorDB GraphBLAS on an isolated internal network.

---

## Web HUD Multi-Route Topology (Core Navigation & Operational Views)

The CAVDAX for Flagsmith Web HUD provides a streamlined monochromatic porcelain / obsidian operational interface organized into **4 Primary Focus Tabs** plus dedicated developer and administration enclaves:

### Primary Navigation Tabs:
1. **Overview (`/overview` or `/`)**: Executive command dashboard, 3-signal mesh ingestion status, platform architecture breakdown, interactive team attribution, and video walkthrough showcase.
2. **Flag Radar (`/flags`) [PRIMARY TRACK 03 HUD]**: Real-time 3-Signal blast radius radar, multi-hop transitive ripple detection, upstream prerequisite guards, AST live code scanner, and Safe Toggle Switch with 409 Conflict barrier.
3. **Repo & MCP (`/mcp` / `/console`)**: Repository code scanner for Flagsmith feature toggles, connected repository workspace, MCP drop-in configuration guides (Cursor, Claude Code, Windsurf), and interactive tool execution playground.
4. **Audit Ledger (`/audit`)**: Tamper-evident operational ledger recording every tool execution, verdict, target feature flag, and grounding dependency state in FalkorDB.

### Specialized Developer Enclaves:
5. **Developer Diagnostics Console & Hackathon Mode Enclave (`/dev`)**: Monochromatic hardware bench instrument displaying real-time FalkorDB/Redis connectivity, Hackathon Mode zero-paywall switch, live system state telemetry, and diagnostic triggers.
6. **Flagsmith Self-Hosted Management Portal (`/flagsmith/api/v1/`)**: Fully functional Django REST Framework management portal with authenticated project overrides, flag administration, and reverse-proxy static asset delivery.
7. **Developer Profile & Quota Metering (`/profile`)**: Live plan quota consumption monitoring, capability tiers, and secure MCP key generation.
8. **Community Stewardship & Backing Galaxy (`/support` / `/sponsors`)**: 3D revolving supporter sphere and operational infrastructure disclosures.

---

## Enterprise Security Hardening & Cloudflare Zero-Trust Standard

CAVDAX enforces a mandatory **7-Phase Cloudflare Security & Pen-Test Audit Standard (Rule 25)** across all runtime, API, and MCP layers:

* **Boundary & Parameter Sanitization**: All endpoint inputs (`decision_id <= 128`, `target_file <= 256`, `proposed_action <= 500`) are strictly clamped to eliminate ReDoS and memory amplification vectors.
* **Zero Split-Brain Session Desynchronization (Rule 0j)**: Enforces `credentials: 'include'` and instantaneous 401 unauthenticated session purges across all client endpoints to keep client cookies synchronized with server sessions across deployment restarts.
* **Context-Preserving GitHub OAuth Routing**: Preserves the user's active page and workflow context (`returnTo`) upon authenticating, automatically reopening repository connection dialogs without disorienting navigation jumps.
* **Dual-Layer Persistent Session Resilience**: Eliminates post-deployment logout churn through a file-backed `PersistentFileStore` (mounted via Docker volume `server-sessions`) paired with a tamper-proof HMAC-SHA256 signed HTTP-only auth cookie (`cavdax_auth`) with constant-time verification (`timingSafeEqual`) for instant zero-downtime session re-hydration across server restarts.

CAVDAX implements comprehensive defense-in-depth security across both API and runtime layers:

* **Strict Administrative Authorization (`requireDevAuth`)**: Critical administrative endpoints (`POST /api/system/dev-ips`, `/api/system/dev-roster`, `/api/system/hackathon-mode`) enforce cryptographically hashed developer credentials and remote IP whitelisting.
* **Deepest-Ancestor Symlink Confinement (`realpathOfDeepestAncestor`)**: In `apply_code_change`, target file paths resolve deepest existing ancestors via `fs.realpathSync` to guarantee that symlinks inside the sandbox cannot escape to parent host filesystems (`BLOCKED_PATH_TRAVERSAL`).
* **Protected File Writing Invariant (`isProtectedWritePath`)**: Regardless of decision approval status, autonomous agents are strictly barred from writing to git internals (`.git/`), environment secrets (`.env*`), or CI/CD workflow definitions (`.github/`) (`BLOCKED_PROTECTED_PATH`).
* **Decision Target-File Confinement**: When a graph decision declares a `target_file`, agent writes to any other file are rejected (`BLOCKED_TARGET_FILE_MISMATCH`).
* **Fail-Closed Unknown Decisions**: Gate verification treats ungrounded or unknown decisions as security violations (`BLOCKED_UNKNOWN_DECISION`), never failing open.
* **Diff-Aware Patch Gate Scanning**: Pull request and commit gating (`cavdax check --pr`, `--staged`, `--sha`) inspects added lines in the patch diff rather than whole historical files, eliminating false-positive cascades on legacy files while maintaining strict enforcement for newly introduced code.
* **Open Email Relay & Cascade Mutation Gating**: The alert simulation endpoint (`POST /api/alerts/simulate-invalidation`) enforces session authentication, restricts test recipients to verified registered addresses, and restricts live graph mutation to authorized maintainers.
* **Client IP Spoofing Mitigation**: The gateway inspects proxy socket addresses rather than untrusted `X-Forwarded-For` headers to prevent spoofed IP bypasses.
* **Zero-Fallback Identity Sanitization & Multi-Layer Recipient Validation**: Outbound alert simulation endpoints strictly reject empty or unconfigured targets with explicit HTTP 400 (`MISSING_RECIPIENT_EMAIL`, `INVALID_EMAIL_FORMAT`), eliminating prototype developer fallback stubs and preventing inadvertent notifications or identity leaks.
* **Production Security Headers**: All responses include strict HTTP security directives:
  * `X-Content-Type-Options: nosniff` (MIME sniffing prevention)
  * `X-Frame-Options: DENY` (Clickjacking defense)
  * `Strict-Transport-Security: max-age=31536000; includeSubDomains` (Enforced HTTPS)
* **Cryptographic Billing Plan Validation**: Razorpay order IDs are cryptographically linked to target subscription tiers in server memory (`pendingBillingOrders`), preventing client-side parameter tampering.
* **Exact Integer Bitmasking & Cloudflare IPv6 Proxy Trust**: Reverse proxy verification parses all 15 official Cloudflare IPv4 CIDR blocks with exact bitwise matching and recognizes official IPv6 prefixes (`2606:4700::/32`, `2400:cb00::/32`), defeating neighbor spoofing attacks on shared cloud networks.
* **Monetization Invariant & Session Regeneration Entitlement Persistence**: Verified Razorpay tier entitlements are atomically preserved in disk-backed system state (`paidUsers`), eliminating post-login Pro tier loss during OWASP A07 session regeneration.
* **Sponsor Pass Forgery Shield**: Ephemeral evaluation passes reject arbitrary client-supplied `user_override` payloads, automatically binding directly to verified GitHub identities or watermarking unauthenticated judge passes to preserve the cryptographic integrity of the live public Sponsor Wall.
* **Organization CI Access Delegation**: The Invariant Gate runner forwards `GITHUB_TOKEN` in `X-GitHub-Token` headers, enabling direct status check clearance on private organization and collaborator repositories without requiring centralized god-tokens.
* **Client HUD Ergonomics & Stacking Context Isolation**:
  * Global `Ctrl+K` / `⌘K` Command Palette providing instant, keyboard-driven fuzzy search across all DAG nodes, ADRs, decisions, and files.
  * Container-relative sliding indicator tracking (`usePillTracker`), eliminating cross-route `layoutId` animation artifacts.
  * Portal-hoisted modals (`createPortal`) with `data-lenis-prevent` to deconflict global smooth-scroll momentum from dialog viewports.
  * Collapsible code diff payload inspection with accessible disclosure states (`aria-expanded`).
  * Decoupled left-rail architectural scroll cues for zero-collision master-detail workspace resizing.
  * Bi-directional master-detail selection: clicking an ADR card highlights its corresponding decision diamond node on the DAG with toggle de-selection and isolated child propagation.
  * Two-line scan-friendly quota warnings and tactile micro-motion upgrade CTAs, banning AI header bracket tags and reserving wavefill shaders for hero authentication.
  * Dual-dimension `pro-27` responsive calibration (`min-width: 1400px and min-height: 820px`) with downstream section isolation padding buffers eliminating fold-peeking.

---

## Production SEO & Structured Metadata Suite

The client application includes an enterprise-grade SEO and search discovery infrastructure:

* **Schema.org JSON-LD Structured Data**: Embedded semantic graph declarations for `SoftwareApplication`, `Organization`, `WebSite`, and dynamic `BreadcrumbList` across all views.
* **Route-Aware Dynamic Metadata (`SEOHead.jsx`)**: Automatically synchronizes document title, description, canonical link, OpenGraph (`og:*`), and Twitter Card (`twitter:*`) tags upon client-side navigation.
* **Branded OpenGraph Preview Cards**: High-definition 1200×630px social cards (`og-image.jpg`, `og-image.png`, `og-image.svg`) featuring the official CAVDAX emblem and geometric Space Grotesk wordmark.
* **Search Engine Crawl Directives**: Validated `robots.txt` disallowing internal debug routes, paired with an XML index (`sitemap.xml`) featuring explicit priority and change frequency ratings.

---

## Quickstart Guide

### Option 1: Docker Compose (Recommended)
Launch the entire mesh (FalkorDB + Server + Web HUD + Self-Hosted Flagsmith + Postgres) with one command:

```bash
docker-compose up --build
```

#### Mesh Service Ports & Endpoints:

| Service | Host Port | Internal Port | Protocol | Purpose |
|---|---|---|---|---|
| **Web HUD** | `5173` | `5173` | HTTP | Monochromatic Porcelain / Obsidian Operational HUD |
| **CAVDAX Gateway & MCP** | `3001` | `3000` | HTTP/SSE | Causal Invariant Gate, REST API & Remote SSE |
| **Flagsmith API Engine** | `8000` | `8000` | HTTP | Self-Hosted Open-Source Flagsmith Django Engine |
| **FalkorDB Graph Engine** | `6379` | `6379` | Redis/Bolt | GraphBLAS Sparse Matrix Causal Core |
| **Flagsmith Database** | `5432` | `5432` | PostgreSQL | Flagsmith Environments, Identities & Audit Store |

- **Web HUD Portal:** `http://localhost:5173`
- **CAVDAX Backend Gateway & MCP:** `http://localhost:3001`
- **Self-Hosted Flagsmith Django UI:** `http://localhost:8000` (or `https://cavdax-flagsmith.sahnirmaan.live/flagsmith/api/v1/` on production)
- **FalkorDB Redis Endpoint:** `localhost:6379`

### Option 2: Local Development
```bash
# 1. Install dependencies
cd apps/server && npm install
cd ../client && npm install
cd ../..

# 2. Run benchmark tests
npm run benchmark
npm run benchmark:scale

# 3. Start server and client
npm run server
npm run client
```

---

## Model Context Protocol (MCP) Integration & Client Setup

CAVDAX implements the Anthropic Model Context Protocol (MCP) specification `2024-11-05` to enclose autonomous coding agents (Claude Code, Cursor IDE, Claude Desktop, Windsurf/Roo Code) behind a FalkorDB GraphBLAS causal barrier.

**Technical Reference Specification**: [docs/MCP_SPECIFICATION.md](docs/MCP_SPECIFICATION.md)

### Supported Transports & Connectors
- **Local Stdio (`stdio`):** `npx -y @cavdax/mcp-server` (zero-latency, runs the MCP gate locally against your own FalkorDB instance).
- **Remote Cloud SSE (`SSE`):** Connect to `https://cavdax-flagsmith.sahnirmaan.live/api/mcp/sse` (for centralized team graphs and remote CI/CD pipelines).

### Transport Authentication Matrix & Security Boundaries

CAVDAX enforces a tailored security model based on the execution boundary:

| Transport | Surface | Execution Boundary | Auth Model | Rationale |
|---|---|---|---|---|
| **Local Stdio (`stdio`)** | Cursor, Claude, Cline, Windsurf | Local Developer Host | **Zero-Key** | Enclosed local subprocess running on developer's machine; zero friction, talks directly to local FalkorDB or sandbox. |
| **Remote Cloud SSE (`SSE`)** | Remote Agent Teams | Public Internet (`/api/mcp/sse`) | **Bearer API Key** | Enforces rate limits and isolates multi-tenant graphs in hosted deployments. |
| **CI/CD Invariant Gate (`gate`)** | GitHub Actions Workflow | Cloud CI Runner | **GitHub Secret (`CAVDAX_API_KEY`)** | Authenticates status checks against central repository graphs on pull requests. |

### Client Configuration Snippets

You can connect your coding agents via **Mode A: Local Stdio (Zero configuration, no API key required)** or **Mode B: Remote Cloud SSE (Centralized team graph & remote CI/CD)**.

> **API Key for Remote Cloud SSE**: If using Remote Cloud SSE, generate your API key in one click at [cavdax-flagsmith.sahnirmaan.live/mcp](https://cavdax-flagsmith.sahnirmaan.live/mcp).

---

#### Mode A: Local Stdio (`npx -y @cavdax/mcp-server`) — Recommended

##### 1. Cursor IDE (`.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "cavdax": {
      "command": "npx",
      "args": ["-y", "@cavdax/mcp-server"]
    }
  }
}
```

##### 2. Claude Desktop (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "cavdax": {
      "command": "npx",
      "args": ["-y", "@cavdax/mcp-server"]
    }
  }
}
```

##### 3. Claude Code CLI
```bash
claude mcp add cavdax -- npx -y @cavdax/mcp-server
```

##### 4. Windsurf / Roo Code (`mcp_config.json`)
```json
{
  "mcpServers": {
    "cavdax": {
      "command": "npx",
      "args": ["-y", "@cavdax/mcp-server"]
    }
  }
}
```

---

#### Mode B: Remote Cloud SSE (`https://cavdax-flagsmith.sahnirmaan.live/api/mcp/sse`)

##### 1. Cursor IDE (`.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "cavdax": {
      "url": "https://cavdax-flagsmith.sahnirmaan.live/api/mcp/sse",
      "headers": {
        "Authorization": "Bearer YOUR_CAVDAX_API_KEY"
      }
    }
  }
}
```

##### 2. Claude Desktop (via `mcp-proxy`)
*Claude Desktop requires local stdio to bridge remote SSE streams:*
```json
{
  "mcpServers": {
    "cavdax": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-proxy",
        "https://cavdax-flagsmith.sahnirmaan.live/api/mcp/sse",
        "--headers",
        "Authorization=Bearer YOUR_CAVDAX_API_KEY"
      ]
    }
  }
}
```

##### 3. Claude Code CLI
```bash
claude mcp add cavdax https://cavdax-flagsmith.sahnirmaan.live/api/mcp/sse --header "Authorization: Bearer YOUR_CAVDAX_API_KEY"
```

### Registered Model Context Protocol (MCP) Tools (`@cavdax/flagsmith-mcp` v1.0.3)
1. `get_flag_blast_radius`: **Topological Blast Radius Calculator.** Computes multi-hop upstream prerequisites and downstream dependents across all 3 signals (Flagsmith tags, AST code references, Git temporal coupling) via GraphBLAS in `< 5ms`.
2. `safe_toggle_flag`: **Enclosed Feature Flag Execution Gate.** Intercepts in-flight flag toggles and validates topological dependency safety against FalkorDB. Hard-blocks execution if downstream dependents are unmigrated (`CRITICAL_DOWNSTREAM_BREACH`).
3. `list_flagsmith_features`: **Real-Time Flag Inventory.** Returns current feature flags, production enablement states, incoming dependent counts, and risk tiers directly from the self-hosted Flagsmith instance.
4. `scan_code_for_flags`: **AST Syntactic Code Scanner.** Parses repository source files (`.js`, `.jsx`, `.ts`, `.tsx`, `.py`) to extract Flagsmith SDK invocations (`hasFeature`, `isFeatureEnabled`, `useFlags`, `getValue`) and infer structural code dependencies.
5. `sync_flagsmith_graph`: **Multi-Signal Mesh Synchronizer.** Reconciles self-hosted Flagsmith REST API entities with the live repository AST and FalkorDB GraphBLAS matrix engine.
6. `list_stale_flags`: **Technical Debt & Stale Flag Auditor.** Discovers abandoned, 100% rolled-out, or unreferenced feature flags for safe cleanup without breaking dormant code branches.

### Universal CLI Daemon (`@cavdax/flagsmith-mcp` v1.0.3)

> **Zero-Dependency Supply Chain Hardening**: `@cavdax/flagsmith-mcp` uses Node.js native `node:util.parseArgs` with zero external CLI runtime dependencies (no `commander`, no `child_process` shell hooks). Scored **100/100 Vulnerability**, **100/100 Quality**, **100/100 License**, and verified with **Sigstore SLSA-3 Build Provenance**.

```bash
# Start local Model Context Protocol stdio daemon for Flagsmith
npx -y @cavdax/flagsmith-mcp

# Connect Claude Code CLI to live CAVDAX Flagsmith SSE Gate
claude mcp add cavdax https://cavdax-flagsmith.sahnirmaan.live/api/mcp/sse --header "Authorization: Bearer YOUR_API_KEY"

# Compute topological blast radius for a feature flag
npx @cavdax/flagsmith-mcp blast-radius --flag dark_mode

# Execute safe toggle with pre-flight downstream dependency verification
npx @cavdax/flagsmith-mcp safe-toggle --flag dark_mode --state false

# Scan repository source code for Flagsmith SDK invocations
npx @cavdax/flagsmith-mcp scan --repo .

# Synchronize Flagsmith REST API features with FalkorDB GraphBLAS
npx @cavdax/flagsmith-mcp sync --api https://cavdax-flagsmith.sahnirmaan.live/flagsmith/api/v1/
```

---

## Repository Structure

```
CAVDAX/
├── apps/
│   ├── client/                  # React 18 + Vite + Tailwind Porcelain Dark Web HUD
│   │   ├── public/sw.js         # Service Worker (Web Push & background divergence alerts)
│   │   ├── src/components/      # FlagBlastRadiusCard, AstInspector, CommandPalette, AuditPage, etc.
│   │   ├── src/services/        # webPush.js (VAPID PushManager subscription manager)
│   │   └── Dockerfile           # Client containerization
│   ├── server/                  # Node.js + Express Backend Gateway
│   │   ├── index.js             # REST API, SSE broadcaster, Flagsmith bi-directional sync, MCP gateway
│   │   ├── flagsmithSync.js     # Flagsmith REST API bi-directional graph synchronization
│   │   ├── email.js             # Resend API transactional divergence alert dispatcher & debouncer
│   │   ├── webPush.js           # VAPID key manager & Web Push background notification broker
│   │   ├── systemState.js       # Atomic persistent state & user notification preferences
│   │   ├── test/                # Unit & security test suite (114 automated tests: 112 server + 2 MCP locks)
│   │   └── Dockerfile           # Server containerization
│   ├── flagsmith-mcp/           # Published Flagsmith MCP package (@cavdax/flagsmith-mcp v1.0.3)
│   │   ├── bin/cli.js           # Universal standalone CLI: npx @cavdax/flagsmith-mcp blast|toggle|scan
│   │   └── src/mcpServer.js     # Stdio/SSE Model Context Protocol server exposing 6 Flagsmith tools
│   └── mcp-server/              # Standalone NPM package (@cavdax/mcp-server — legacy baseline)
│       ├── bin/cavdax.js        # Universal CLI: npx cavdax mcp|ingest|check|doctor
│       └── src/                 # stdioServer, ingestCommand, checkCommand, doctorCommand
├── assets/                      # Monochromatic Mermaid-style architecture flowcharts (.svg) & UI mockups
├── benchmark/                   # Evaluation harness & empirical scale tests
│   ├── evaluate.js              # 10-Scenario Vector RAG vs CAVDAX benchmark
│   ├── scale_generator.js       # 50,000-node GraphBLAS stress test
│   ├── results.json             # Benchmark metrics data
│   └── EVALUATION_REPORT.md     # Detailed evaluation markdown report
├── core/                        # Core Engine Modules
│   ├── graph/                   # FalkorDB client manager & GraphBLAS blast radius traversal
│   ├── ingestion/               # flagsmithClient.js (REST), astScanner.js (AST), gitMiner.js (Temporal)
│   └── mcp/                     # Enclosed MCP server & pre-flight safe_toggle_flag gate
├── demo-repo/                   # Target repository subject to agent mutations
├── docs/                        # Complete technical specifications & canonical context files
│   ├── PRD.md                   # Product Requirements Document (Track 03 Flagsmith Blast Radius)
│   ├── ARCHITECTURE.md          # System Architecture & GraphBLAS Multi-Signal Topology
│   ├── PHASES.md                # 7-Phase Milestone Roadmap & Verification Criteria
│   └── DEPLOYMENT_AND_INFRA_RUNBOOK.md # Production EC2, Caddy, & Docker Rolling Conflict Invariant
├── infra/                       # Production Deployment Infrastructure
│   ├── docker-compose.prod.yml  # 6-container production stack (FalkorDB, Flagsmith API, DB, Server, Client, Caddy)
│   └── Caddyfile                # Automatic HTTPS reverse proxy with static route precedence
├── .env.example                 # Environment variable reference (copy to .env — never commit .env)
├── action.yml                   # Reusable composite GitHub Action (CAVDAX causal invalidation gate)
├── .github/workflows/           # CI/CD pipelines (deploy.yml, publish-flagsmith-mcp.yml, cavdax-gate.yml)
├── docker-compose.yml           # Local multi-container development orchestration
├── LICENSE                      # Apache 2.0 (Client/MCP) / BSL 1.1 (Platform)
└── package.json                 # Monorepo root scripts
```

---

## Community Backers & 3D Supporter Galaxy

CAVDAX provides a dedicated **Supporters & Backers Showcase Portal** (`/sponsors`) driven by an interactive **3D Revolving Fibonacci Supporter Galaxy**:

* **Zero-WebGL Crash-Proof 3D Kinematics**: Projects a dynamic revolving Fibonacci image sphere using pure CSS 3D transforms (`preserve-3d`, `translate3d`, `scale`) with zero Three.js canvas overhead, eliminating browser context-loss crashes across mobile and desktop.
* **1:1 Human Backer Invariant**: Strictly bans avatar cloning. When total active backers $N < 14$, discrete 0.4x scale celestial constellation waypoint nodes preserve spherical geometry without fabricating human identities.
* **Tier-Proportional Node Sizing**:
  * **Core Patron ($10)**: $1.6\times$ diameter ($64\text{px}$) with specular metallic underglow.
  * **2 Cups ($4)**: $1.15\times$ diameter ($46\text{px}$).
  * **Cookie ($2)**: $0.85\times$ diameter ($34\text{px}$).
* **Tactile Search Architecture**: Monochromatic magnifying glass vector with optical reflection arc, $+12^\circ$ focus rotation, global `/` keyboard hotkey, and instant one-click `X` query reset.
* **Portal-Mounted Spotlight Modal**: Clicking any backer node mounts a single-line inspect dialog via React Portal (`createPortal(..., document.body)`), featuring verified GitHub handles, quotes, and direct profile links.
* **Privacy by Design**: Live directory automatically filters `private` contributors and sanitizes `anonymous` backers with masked identicons (`/api/sponsors`), ensuring mathematical symmetry without identity leakage.

---

## Team & Attribution — Team AWDAX

Architected and developed with passion by **Team AWDAX** for **Toggle Wars: The Flagsmith Experimentation Hackathon** (Track 03):

| Member | Role & Focus | Handles & Socials |
|---|---|---|
| **Suneet Chugh** | **Team Leader** &bull; Lead Architect & Systems Engineer<br>*FalkorDB GraphBLAS, Blast Radius Engine, Flagsmith Integration, Cloudflare & AWS* | WeMakeDevs: [`@suneetchugh_dev`](https://wemakedevs.org)<br>GitHub: [`@suneetchugh-dev`](https://github.com/suneetchugh-dev)<br>LinkedIn: [`suneetchugh-dev`](https://www.linkedin.com/in/suneetchugh-dev/) |
| **Geetika Chugh** | **Co-Creator** &bull; Systems Engineer & Presenter<br>*MCP Distribution (SLSA-3 Sigstore), Demo Walkthrough, Ingestion Engine & CI/CD* | WeMakeDevs: [`@geetika_chugh`](https://wemakedevs.org)<br>GitHub: [`@GeetikaChughIBM`](https://github.com/GeetikaChughIBM)<br>LinkedIn: [`geetika-chugh`](https://www.linkedin.com/in/geetika-chugh-085251252/) |
| **Jatin Jha** | **Systems & Full-Stack Engineer**<br>*Tree-Sitter AST Static Analysis, Flagsmith REST Telemetry & React Web HUD* | WeMakeDevs: [`@imded`](https://wemakedevs.org)<br>GitHub: [`@jatin0jha`](https://github.com/jatin0jha)<br>LinkedIn: [`jhajatin`](https://www.linkedin.com/in/jhajatin/) |
| **Harshit Chauhan** | **Backend & Infrastructure Engineer**<br>*Git Temporal Coupling Miner, Jaccard Co-Change, Docker Mesh & FalkorDB Cypher* | WeMakeDevs: [`@harrsh4u`](https://wemakedevs.org)<br>GitHub: [`@harsh4k`](https://github.com/harsh4k)<br>LinkedIn: [`harshitchauhan-dev`](https://www.linkedin.com/in/harshitchauhan-dev/) |

* **Official Community & Maintainer Inquiries**: Follow [@cavdax_dev](https://x.com/cavdax_dev) on X • Official Contact: [`cavdax.dev@gmail.com`](mailto:cavdax.dev@gmail.com)

---
*License: Dual-Licensed (Apache 2.0 Client / BSL 1.1 Cloud Platform) &bull; Powered by FalkorDB GraphBLAS & Model Context Protocol (MCP)*
