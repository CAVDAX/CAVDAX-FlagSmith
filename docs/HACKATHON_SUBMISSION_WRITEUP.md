# Toggle Wars Hackathon Submission Writeup (Track 03)

> **Event**: Toggle Wars: The Flagsmith Experimentation Hackathon (WeMakeDevs × Flagsmith)  
> **Track**: **Track 03 — Build on Open Source Flagsmith** (Prize: PS5 + GTA 6 Bundle)  
> **Team Name**: **AWDAX**  
> **Team Members**: Suneet Chugh, Geetika Chugh, Jatin Jha, Harshit Chauhan  
> **Submission Date**: November 27, 2026

---

## 🔗 Submission Links

- **Live Production Platform**: [`https://cavdax-flagsmith.sahnirmaan.live`](https://cavdax-flagsmith.sahnirmaan.live)
- **Interactive Flag Radar**: [`https://cavdax-flagsmith.sahnirmaan.live`](https://cavdax-flagsmith.sahnirmaan.live) $\to$ *Flag Radar* tab
- **Self-Hosted Flagsmith API**: [`https://cavdax-flagsmith.sahnirmaan.live/flagsmith/api/v1/`](https://cavdax-flagsmith.sahnirmaan.live/flagsmith/api/v1/)
- **GitHub Repository**: [`https://github.com/CAVDAX/CAVDAX-FlagSmith`](https://github.com/CAVDAX/CAVDAX-FlagSmith)
- **Official npm Package**: [`@cavdax/flagsmith-mcp@1.0.1`](https://www.npmjs.com/package/@cavdax/flagsmith-mcp) *(Published with Sigstore SLSA Provenance via GitHub OIDC)*
- **Demo Video Walkthrough**: *[Insert YouTube Link Here]*

---

## 📌 Elevator Pitch & Tagline

**CAVDAX for Flagsmith: Graph-Grounded Feature Flag Blast Radius & Safe-Toggle Engine for Autonomous Coding Agents**

*Prevent AI coding agents (Cursor, Claude Code, Windsurf) and developers from silently crashing production by computing multi-hop topological blast radius across Flagsmith feature flags before toggles execute.*

---

## 💡 The Problem: "Feature Flag Blindness"

Autonomous coding agents (Cursor Composer, Claude Code, Windsurf) are rapidly mutating codebases and toggling feature flags. However, modern AI agents have **zero awareness of flag dependency topology**:

1. **Implicit Cascading Failures**: When an agent disables `dark_mode`, it doesn't know that `premium_analytics` and `analytics_dashboard` depend on it. Disabling the parent flag silently bricks downstream components.
2. **Missing Upstream Prerequisites**: Enabling a beta feature flag (`beta_streaming`) without its prerequisite flags (`auth_v2`, `video_player_v2`) causes runtime crashes for users.
3. **The Static Docs Failure**: Flagsmith tags or README documentation rot over time. Neither vector search nor static linters can infer dynamic multi-hop ripple effects across git commits.

As the hackathon brief states:  
> *"Getting Flagsmith running is where you start, not the project itself. Build the thing you wished existed while you were setting it up, and package it so others can use it without asking you how."*

We built the exact tool we desperately needed: **a deterministic, graph-grounded blast radius engine and MCP safety gate.**

---

## ⚙️ What We Built: The Three-Signal Inference Mesh

CAVDAX for Flagsmith constructs a real-time directed dependency graph in **FalkorDB GraphBLAS** by fusing three independent intelligence signals:

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
  • safe_toggle_flag                               • Safe Toggle Switch with 409 Conflict
  • list_flagsmith_features                        • Transitive Dependency Visualizer
```

1. **Signal 1: Flagsmith REST API Ingestion (`core/ingestion/flagsmithClient.js`)**:
   - Ingests flag definitions, tags, segment overrides, and prerequisite rules directly from Flagsmith. Confidence: **0.95**.
2. **Signal 2: Static AST Code Analysis Scanner (`core/ingestion/astScanner.js`)**:
   - Traverses source code AST to detect `isFeatureEnabled`, `useFlags`, `getValue`, and nested boolean guard blocks (`GUARDS`, confidence: **0.85**; `CO_OCCURS_AND`, confidence: **0.75**).
3. **Signal 3: Git Temporal Coupling Miner (`core/ingestion/gitMiner.js`)**:
   - Mines git commit history to compute Jaccard co-change metric $J(A, B) = \frac{|A \cap B|}{|A \cup B|}$, discovering unwritten architectural couplings.
4. **Bayesian Confidence Fusion & FalkorDB GraphBLAS (`core/graph/blastRadiusCalculator.js`)**:
   - Merges evidence into unified probability $P = 1 - \prod(1 - c_i)$ and evaluates directed reachability matrices in **34 milliseconds**.
5. **Pre-Flight Safety Gate (`safe_toggle_flag`)**:
   - Intercepts mutating toggle requests. If disabling a flag would break active downstream dependents, the gate returns **HTTP 409 Conflict (`BLAST_RADIUS_VIOLATION`)** with a line-level proof path, halting the AI agent unless `--force` is specified.

---

## ⚡ Zero-Config Judge Evaluation

Judges can test the live system directly from any terminal with **zero setup or installation**:

```bash
# 1. Inspect the topological blast radius of 'dark_mode'
npx @cavdax/flagsmith-mcp blast dark_mode

# 2. List all registered Flagsmith feature flags & dependency metrics
npx @cavdax/flagsmith-mcp features

# 3. Test the safety gate: Attempt to disable 'dark_mode' (Blocked by 409 Conflict)
npx @cavdax/flagsmith-mcp toggle dark_mode off

# 4. Bypass safety gate with --force
npx @cavdax/flagsmith-mcp toggle dark_mode off --force
```

### Cursor & Claude Code Integration (`.cursor/mcp.json`):

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

---

## 🏗️ Technical Architecture & Self-Hosted Stack

- **Flagsmith Self-Hosted Backend**: Flagsmith `v2.295.2` running in Docker on AWS EC2 (`15.135.78.65`, ap-southeast-2) with PostgreSQL 15.
- **Graph Engine**: FalkorDB (Redis-native GraphBLAS sparse matrix linear algebra).
- **Core Intelligence API**: Node.js 24 + Express + Babel/Tree-Sitter AST Scanner + SimpleGit temporal miner.
- **Client Web HUD**: React 18, Vite, Tailwind CSS, Monochromatic Obsidian theme with strict zero-emoji discipline.
- **Package Distribution**: `@cavdax/flagsmith-mcp` published via GitHub Actions OIDC Trusted Publisher with Sigstore SLSA-1 provenance.
- **Edge Security & Routing**: Caddy reverse proxy with Cloudflare TLS and DNS proxying.

---

## 🧗 Challenges We Overcame

1. **FalkorDB Cyclic Path Permutation Timeout**:
   - *Problem*: In initial tests, variable-length Cypher queries (`[:DEPENDS_ON|CO_OCCURS_AND*1..6]`) timed out in GraphBLAS because bidirectional `CO_OCCURS_AND` edges created infinite 2-cycles ($A \leftrightarrow B$).
   - *Solution*: Constrained reachability queries strictly to directed acyclic hierarchy relationships `[:DEPENDS_ON|GUARDS*1..3]`. Traversal latency dropped from timeout to **34.15 ms**.
2. **Self-Hosted Flagsmith Django Host Restrictions**:
   - *Problem*: Flagsmith API returned `400 Bad Request` when accessed through Cloudflare proxy.
   - *Solution*: Injected `DJANGO_ALLOWED_HOSTS: "*"` into Docker Compose and rebuilt the gateway container.
3. **Zero-Token npm OIDC Publishing**:
   - *Problem*: Traditional npm tokens are prone to leaks.
   - *Solution*: Engineered a dedicated `.github/workflows/publish-flagsmith-mcp.yml` using npm's modern OpenID Connect (OIDC) Trusted Publisher, publishing directly to npm with verifiable Sigstore cryptographic signatures.

---

## 🏆 Accomplishments We're Proud Of

- **< 35ms Graph Traversal**: Complex multi-hop blast radius calculations run in sub-35ms, fast enough to run synchronously inside AI agent tool-calls.
- **100% Automated Test Pass Rate**: 13/13 passing tests across AST scanners, Git miners, Bayesian aggregators, and MCP gates.
- **True Packaging**: Published directly on npm as `@cavdax/flagsmith-mcp@1.0.1` with Sigstore provenance. Zero installation required.
- **Full Self-Hosted Deployment**: Live and running on AWS EC2 with real Flagsmith containers, FalkorDB, and interactive HUD.

---

## 🎬 2-Minute Video Recording Script for Team

### [0:00 – 0:35] The Problem (Feature Flag Blindness)
- **Visual**: Screen shows Cursor or terminal.
- **Voiceover**:  
  *"Modern AI coding agents and developers toggle feature flags blindly. When an agent creates or disables a feature flag in Flagsmith, it has zero visibility into what downstream features or users it will silently break. In complex software, disabling a flag like `dark_mode` or `auth_v2` triggers cascading outages across dependent services."*

### [0:35 – 1:15] The Three-Signal Solution
- **Visual**: Open `https://cavdax-flagsmith.sahnirmaan.live` $\to$ **Flag Radar** tab.
- **Voiceover**:  
  *"We built CAVDAX for Flagsmith. It runs on top of self-hosted Flagsmith and computes the multi-hop topological blast radius using three independent signals: Signal 1 from the Flagsmith REST API, Signal 2 from static AST code parsing of `isFeatureEnabled` calls, and Signal 3 from Git commit history temporal coupling. All three signals fuse into FalkorDB GraphBLAS in under 35 milliseconds."*

### [1:15 – 1:55] Live Terminal & Safety Gate Demo
- **Visual**: Switch to Terminal.
- **Commands**:
  ```bash
  npx @cavdax/flagsmith-mcp blast dark_mode
  npx @cavdax/flagsmith-mcp toggle dark_mode off
  ```
- **Voiceover**:  
  *"Judges can test this right now without installing anything using `npx @cavdax/flagsmith-mcp blast dark_mode`. Notice how in 34 milliseconds, it identified that `premium_analytics` and `analytics_dashboard` depend on `dark_mode`. When we attempt to toggle it off, our safety gate halts the command with an HTTP 409 Conflict, preventing an accidental production outage."*

### [1:55 – 2:30] Cursor Integration & Conclusion
- **Visual**: Show `.cursor/mcp.json` and the npm package page.
- **Voiceover**:  
  *"With standard Model Context Protocol, coding agents in Cursor and Claude Code automatically query this gate before making changes. The package is published on npm with verifiable Sigstore provenance, and self-hosted Flagsmith is running live on AWS. CAVDAX brings deterministic graph safety to Flagsmith. Thank you!"*
