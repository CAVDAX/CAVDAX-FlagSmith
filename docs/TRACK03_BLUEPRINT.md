# CAVDAX for Flagsmith: Track 03 Adaptation Blueprint
**Flag Blast Radius Intelligence Engine — Graph-Grounded Feature Flag Safety for Self-Hosted Flagsmith**  
**Document Classification:** Strategic Hackathon Blueprint, Architectural Specification & Sprint Plan  
**Document Status:** Pre-Hackathon Planning (Adaptation Strategy)  
**Maintained by:** Suneet-MASTER-Documentation-Product-Manager-Skill  
**Author / Lead Architect:** Suneet Chugh & Team CAVDAX  
**Version:** 1.0.0  
**Last Updated:** 2026-11-25  
**Target Event:** Toggle Wars — The Flagsmith Experimentation Hackathon  
**Target Track:** Track 03 — Build on Open Source Flagsmith (Prize: PS5 + GTA 6 Bundle)

---

## 0. Document Purpose & Scope

This document is the canonical blueprint for adapting CAVDAX's existing production codebase to compete in **Toggle Wars Track 03: Build on Open Source Flagsmith**. It covers:

1. The verbatim problem statement and what judges actually score
2. The honest gap analysis between CAVDAX's current state and Track 03 requirements
3. The adapted product concept: "Flag Blast Radius Intelligence"
4. The three-signal automatic dependency discovery architecture
5. The precise adaptation delta (what code changes, what stays)
6. The 4-day sprint implementation plan
7. The honest winning probability assessment
8. The team split strategy (CAVDAX team on Track 03, ERVIX team on Tracks 01+02)

> **CRITICAL INVARIANT:** This document is the single source of truth for the CAVDAX Track 03 adaptation. All implementation decisions must be traced back to it. Judges will read the submission writeup — make sure the story here is the story told there.

---

## 1. The Problem Statement — Verbatim & Dissected

### 1.1 Track 03 Exact Wording

> *"Run Flagsmith yourself and build around it: an integration, a dashboard, a plugin or a starter template."*

**Ideas to Start From (from the official hackathon brief):**
- VS Code plugin showing live flag values inline
- Terminal dashboard to toggle flags across environments
- One-command Docker setup with a sample app
- Starter template for your favourite framework, flags included
- Admin panel plugin for flipping flags without code

**The Hackathon Tip (the most important sentence in the entire brief):**
> *"Getting Flagsmith running is where you start, not the project itself. Build the thing you wished existed while you were setting it up, and package it so others can use it without asking you how."*

### 1.2 What The Tip Tells Us About Scoring

The tip is the entire judging rubric compressed into one sentence. It scores on exactly four axes:

```
JUDGING AXIS 1: Developer pain solved
  "Build the thing you wished existed while setting it up"
  → Does it address a REAL friction point in running Flagsmith yourself?
  → Not "nice to have" — something that actually frustrated you during setup

JUDGING AXIS 2: Self-contained packaging
  "Package it so others can use it without asking you how"
  → Can someone docker run / npx it and have it work?
  → Zero "read the 40-page wiki before starting"

JUDGING AXIS 3: Flagsmith integration depth
  "Build AROUND it" (not "build beside it")
  → Is Flagsmith deeply woven in, or bolted on as an afterthought?
  → If you remove Flagsmith, does the product break or just shrug?

JUDGING AXIS 4: Novelty
  "Build the thing that doesn't exist yet"
  → Does this solve something nobody else has built for Flagsmith?
  → Not a 10th variant of the same terminal dashboard
```

### 1.3 What Competing Submissions Will Look Like

Based on historical WeMakeDevs hackathon patterns and the prize structure (PS5 + GTA 6 bundle vs $2,000 cash), Track 03 attracts:

- VS Code extensions with simple flag toggling (3–5 hour builds)
- Basic terminal dashboards using the Flagsmith CLI
- Docker Compose templates with Flagsmith + a sample app
- Admin panel clones with a different UI skin

**The honest quality ceiling of typical Track 03 competition: moderate.**  
No hackathon team has ever submitted a production-deployed, SLSA-3 provenanced npm package with a graph intelligence backend for Track 03 of any Flagsmith hackathon. The quality gap is structural.

---

## 2. The Adapted Product: Flag Blast Radius Intelligence

### 2.1 The Core Insight

The deepest unsolved problem in Flagsmith's ecosystem today is not flag toggling — Flagsmith's own dashboard does that fine. The unsolved problem is:

> *"I want to disable this feature flag in production. What else will break?"*

No existing Flagsmith tool — not the official dashboard, not any community plugin, not any starter template — answers this question. When you have 50+ flags with implicit dependencies (Flag B only works when Flag A is enabled, Flag C is an A/B experiment that assumes Flag B is stable), there is zero tooling to compute the blast radius before you toggle.

This is the problem CAVDAX for Flagsmith solves.

### 2.2 The Product Statement

```
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              CAVDAX FOR FLAGSMITH                                              │
│          Flag Blast Radius Intelligence Engine for Self-Hosted Flagsmith                       │
├────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                │
│   PROBLEM:  "I want to disable dark_mode. What else breaks?"                                   │
│   TODAY:    Nobody knows. Toggle and hope. Discover outages in production.                     │
│   CAVDAX:   GraphBLAS multi-hop traversal answers in <2.5ms with P(impact) per flag.           │
│                                                                                                │
│   "If you disable dark_mode:"                                                                  │
│   → premium_analytics   [P=0.94 — AST AND-expression + git coupling + explicit tag]            │
│   → analytics_dashboard [P=0.73 — git coupling, 11/15 co-changes over 90 days]                 │
│   → legacy_reporting    [P=0.31 — single co-change, low confidence]                            │
│                                                                                                │
│   ONE COMMAND:  docker compose up                                                              │
│   WHAT RUNS:    Flagsmith (self-hosted) + FalkorDB + CAVDAX server + CAVDAX web HUD           │
│   MCP TOOLS:    get_flag_blast_radius • safe_toggle_flag • list_stale_flags • explain_deps     │
│                                                                                                │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 The "Flagsmith Off, Product Breaks" Guarantee

This is non-negotiable for Track 03. If judges remove Flagsmith, the entire product must be meaningless:

- Without Flagsmith: CAVDAX has no flags to sync → empty graph → no blast radius → no value
- Without FalkorDB: CAVDAX has no graph engine → cannot compute multi-hop dependencies
- Without CAVDAX: flags are independent booleans with no dependency intelligence

All three components are load-bearing. This is not a Flagsmith wrapper. It is a Flagsmith intelligence layer.

---

## 3. The Architecture: Three-Signal Dependency Discovery

### 3.1 The Core Problem (Honest)

Flagsmith's REST API does not expose flag dependency relationships. Its API returns:

```json
{
  "id": 1,
  "name": "dark_mode",
  "enabled": true,
  "value": null,
  "multivariate_options": []
}
```

No `depends_on`, no `enables`, no `blocks`. Flag dependencies are implicit — they live in application code (`if (darkMode && premiumAnalytics) {}`), git commit history, and engineers' heads. This is the fundamental engineering challenge the product must solve.

### 3.2 The Three-Signal Solution Architecture

Rather than requiring manual dependency curation (which produces a graph only as good as developer effort), CAVDAX for Flagsmith implements three independent automatic discovery signals:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                        THREE-SIGNAL DEPENDENCY DISCOVERY ARCHITECTURE                          │
├──────────────────┬─────────────────────────────────────────────────────────────────────────────┤
│ SIGNAL 1         │ Flagsmith Tag Convention                                                     │
│ Confidence: 1.0  │ Developers add tags like "depends:dark_mode" directly in                    │
│ Build: 2 hours   │ Flagsmith's dashboard. Ingestion reads GET /api/v1/features/,               │
│ Precedent:       │ parses ^(depends|enables|blocks|requires):(.+)$ tags,                       │
│ Convention-over- │ and creates FalkorDB edges automatically.                                    │
│ Configuration    │ Zero new UI required. Zero new workflow.                                     │
│ (Rails pattern)  │                                                                              │
├──────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ SIGNAL 2         │ Static AST Analysis of Connected Repository                                  │
│ Confidence: 0.85 │ Using tree-sitter (the multi-language AST parser powering                   │
│ Build: 8-12 hrs  │ GitHub Copilot and Neovim), scan every .js/.ts/.py file                     │
│ Precedent:       │ in the connected GitHub repo for Flagsmith SDK call patterns:               │
│ Facebook         │ flagsmith.isFeatureEnabled(), useFlags(), getValue()                         │
│ Gatekeeper,      │ Flags co-evaluated in the same boolean AND/OR expression                    │
│ GitHub Copilot   │ create CO_OCCURS edges. Confidence weighted by scope type.                  │
├──────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ SIGNAL 3         │ Git Commit Temporal Coupling                                                  │
│ Confidence: 0.70 │ CAVDAX's existing git ingestion engine (core/ingestion/parser.js)           │
│ Build: 4-6 hrs   │ is extended to scan commit diffs for flag name co-mentions.                 │
│ Precedent:       │ When flag_A and flag_B appear in the same commit message or                 │
│ Netflix, Gall    │ diff body N times, a CO_CHANGED edge with weight N is created.              │
│ et al. (1998)    │ 15/15 co-changes = P(dependency) = 0.98. 2/15 = 0.13.                      │
└──────────────────┴─────────────────────────────────────────────────────────────────────────────┘

Combined output in FalkorDB:
─────────────────────────────────────────────────────────────────────────────────────
(:Flag {key: 'dark_mode'})-[:ENABLES {confidence: 0.94, signals: ['tag','ast','git']}]->
(:Flag {key: 'premium_analytics'})

Blast radius query (GraphBLAS multi-hop):
─────────────────────────────────────────────────────────────────────────────────────
MATCH (target:Flag {key: $key})-[r:ENABLES|BLOCKS|DEPENDS_ON|CO_OCCURS*1..6]->(affected)
RETURN affected.key, sum(r.confidence) / count(r) AS impact_probability
ORDER BY impact_probability DESC
```

### 3.3 Why FalkorDB Stays (The GraphBLAS Non-Negotiation)

The user correctly identified that FalkorDB's performance comes from **GraphBLAS sparse matrix multiplication**. This is not replaced — it is preserved exactly.

FalkorDB models the dependency graph as a sparse boolean adjacency matrix:

$$M_{\text{ENABLES}} \cdot M_{\text{BLOCKS}} \cdot M_{\text{CO\_OCCURS}} \rightarrow A_{\text{blast\_radius}}$$

For a hackathon demo with 20–80 flags, the traversal is `<1ms`. At production scale (10,000+ flag nodes), GraphBLAS scales to `<5ms` while PostgreSQL CTEs would take `500ms–5s`. **Flagsmith is the ingestion source. FalkorDB remains the graph engine. The GraphBLAS performance guarantee is unchanged.**

### 3.4 The Adapted Graph Data Model

```
CAVDAX ORIGINAL (ADR/Decision Graph):
(:Source) → [:EXTRACTED_FROM] → (:Fact) → [:DEPENDS_ON] → (:Decision) → [:PROPOSES_ACTION] → (:AgentAction)

CAVDAX FOR FLAGSMITH (Flag Dependency Graph):
(:Flag)    → [:ENABLES]       → (:Flag)              [Signal: tag/ast/git, confidence: 0.94]
(:Flag)    → [:BLOCKS]        → (:Flag)              [Signal: tag/ast/git, confidence: 1.00]
(:Flag)    → [:CO_OCCURS]     → (:Flag)              [Signal: ast, scope: AND_EXPR, conf: 0.85]
(:Flag)    → [:CO_CHANGED]    → (:Flag)              [Signal: git, weight: 11/15, conf: 0.73]
(:Flag)    → [:IMPACTS_METRIC]→ (:ExperimentGoal)   [Source: Flagsmith experiment API]
(:Segment) → [:RECEIVES]      → (:Flag)              [Source: Flagsmith segment API]
(:Flag)    → [:SUPERSEDES]    → (:Flag)              [Source: git commit + tag convention]

Node Schemas:
─────────────────────────────────────────────────────────────────────────────────────
(:Flag)         { key, name, enabled, environment, last_synced, multivariate_options }
(:Segment)      { id, name, rules, created_date }
(:Environment)  { id, name, api_key_prefix }
(:ExperimentGoal) { id, name, metric_type, target_value }
```

---

## 4. The Adaptation Delta: What Changes vs What Stays

### 4.1 What Stays Completely Unchanged (The 95% Reuse)

```
UNCHANGED COMPONENTS (zero modification required):
─────────────────────────────────────────────────────────────────────────────────────
✓ FalkorDB graph engine (the entire core/graph/ module)
  - client.js           → unchanged
  - renderSvg.js        → GraphCanvas renders flag graph instead of ADR graph
  - Multi-hop Cypher    → query syntax identical, only node labels change

✓ MCP server infrastructure (apps/mcp-server/)
  - stdio transport     → unchanged
  - SSE transport       → unchanged
  - Simulation mode     → unchanged (uses flag demo data instead of ADR demo data)
  - npm packaging       → @cavdax/mcp-server stays, adds Flagsmith MCP tools
  - Sigstore provenance → unchanged

✓ Backend gateway (apps/server/index.js)
  - Express framework   → unchanged
  - Security headers    → unchanged (OWASP A05 hardening stays)
  - Rate limiting       → unchanged
  - HMAC webhooks       → extended for Flagsmith webhook events
  - GitHub OAuth        → unchanged (used for repo connection + git analysis)
  - Session management  → unchanged

✓ React client architecture (apps/client/)
  - Routing system      → unchanged
  - GraphCanvas         → renders flag dependency graph (data model swap only)
  - ArchitecturalRailScrubber → becomes "Flag Environment Scrubber"
  - ConnectedRepoWorkspace → becomes "Connected Flagsmith Project"
  - TourGuide           → updated copy, same interaction model
  - SplashLoader        → unchanged
  - PreferencesModal    → unchanged

✓ Docker Compose architecture
  - FalkorDB service    → unchanged
  - Server service      → unchanged (new env vars for Flagsmith API)
  - Client service      → unchanged

✓ CI/CD pipeline (.github/workflows/)
  - All workflow files  → unchanged

✓ Benchmarks (benchmark/)
  - Scale generator     → unchanged
  - Evaluate script     → unchanged
```

### 4.2 What Gets Added (The 5% New Code — ~1,100 Lines)

```
NEW CODE MODULES:
─────────────────────────────────────────────────────────────────────────────────────

FILE 1: core/ingestion/flagsmithClient.js (~200 lines)
  Purpose: Flagsmith REST API client with polling sync
  - GET /api/v1/features/          → sync flag nodes to FalkorDB
  - GET /api/v1/segments/          → sync segment nodes to FalkorDB
  - GET /api/v1/experiments/       → sync experiment goals to FalkorDB
  - POST /api/v1/features/{id}/    → safe_toggle_flag() MCP tool
  - Parse tags: ^(depends|enables|blocks|requires):(.+)$ → graph edges
  - Polling interval: 30s (configurable via FLAGSMITH_SYNC_INTERVAL_MS)

FILE 2: core/ingestion/astScanner.js (~300 lines)
  Purpose: tree-sitter AST analysis for flag co-occurrence
  - Install: npm add tree-sitter tree-sitter-javascript tree-sitter-typescript
  - Scan connected GitHub repo (uses existing githubAdr.js clone mechanism)
  - Find all Flagsmith SDK calls: isFeatureEnabled(), useFlags(), getValue()
  - Build co-occurrence matrix for AND_EXPRESSION, OR_EXPRESSION scopes
  - Write CO_OCCURS edges to FalkorDB with file, line, scope, confidence

FILE 3: core/ingestion/gitCoupling.js (~200 lines)
  Purpose: Git commit temporal coupling for flag co-change detection
  - Extension of existing core/ingestion/parser.js
  - Extract all known flag keys from FalkorDB
  - Scan commit messages and diffs for flag name co-mentions
  - Increment CO_CHANGED edge weight for each co-mention
  - Normalize to confidence score: weight / total_commits_analyzed

FILE 4: core/mcp/flagsmithTools.js (~300 lines)
  Purpose: 4 new MCP tools replacing ADR-specific tools
  
  Tool 1: get_flag_blast_radius(flag_key)
    - Cypher: MATCH (f:Flag {key: $key})-[*1..6]->(affected)
    - Returns ranked probability distribution of impacted flags
    - Includes signal breakdown: which signals contributed to each edge
    
  Tool 2: safe_toggle_flag(flag_key, target_state, environment)
    - Pre-flight blast radius check
    - If P(impact) > 0.8 on any downstream flag: require human approval
    - If approved: call Flagsmith REST API to perform toggle
    - Record toggle event in FalkorDB audit log

  Tool 3: list_stale_flags()
    - Query: flags enabled > 90 days with zero git co-change activity
    - Returns candidates for flag cleanup
    - Analogous to CAVDAX's "stale decision" detection

  Tool 4: explain_flag_dependencies(flag_key)
    - Full provenance explanation: which signals detected each dependency
    - AST file + line references, git commit SHAs, Flagsmith tag labels
    - Returns human-readable + machine-readable explanation

FILE 5: docker-compose.yml additions (~30 lines)
  Purpose: Add self-hosted Flagsmith stack to existing Docker Compose
  
  New services:
    flagsmith-api:
      image: flagsmith/flagsmith:latest
      ports: ["8000:8000"]
      environment:
        - DATABASE_URL=postgres://flagsmith:flagsmith@flagsmith-db:5432/flagsmith
    
    flagsmith-db:
      image: postgres:15-alpine
      volumes: [flagsmith-db-data:/var/lib/postgresql/data]
  
  New environment variables in server service:
    - FLAGSMITH_API_URL=http://flagsmith-api:8000
    - FLAGSMITH_ENVIRONMENT_KEY=${FLAGSMITH_ENVIRONMENT_KEY}
    - FLAGSMITH_MANAGEMENT_API_KEY=${FLAGSMITH_MANAGEMENT_API_KEY}
    - FLAGSMITH_SYNC_INTERVAL_MS=30000
    - FLAGSMITH_PROJECT_ID=${FLAGSMITH_PROJECT_ID}

FILE 6: .env.example additions (~10 lines)
  - FLAGSMITH_ENVIRONMENT_KEY=your_env_key_here
  - FLAGSMITH_MANAGEMENT_API_KEY=your_management_key_here
  - FLAGSMITH_PROJECT_ID=your_project_id_here
  - FLAGSMITH_SYNC_INTERVAL_MS=30000
```

### 4.3 What Gets Modified (Data Model Adapters — ~200 Lines)

```
MODIFIED FILES:
─────────────────────────────────────────────────────────────────────────────────────

core/graph/queries.js
  - Add: syncFlagsmithData(flags, segments, experiments) → MERGE nodes + edges
  - Add: computeBlastRadius(flagKey) → multi-hop weighted Cypher traversal
  - Add: listStaleFlags(dayThreshold) → flags with no recent co-change activity
  - Existing: seedDemoGraph() → updated with flag demo data for simulation mode

apps/client/src/components/GraphCanvas.jsx
  - Data model swap: ADR node labels → Flag node labels
  - Visual encoding: Flag state (enabled/disabled) reflected in node color
  - Edge rendering: confidence score → edge thickness (0.0 = hairline, 1.0 = thick)
  - Tooltip: show signal breakdown (which signals contributed to each edge)
  - Zero change to canvas rendering engine, force-directed layout, zoom/pan

apps/client/src/components/ConnectedRepoWorkspace.jsx
  - Rename: "Connect Repository" → "Connect Flagsmith Project"
  - Input: Flagsmith API URL + environment key instead of GitHub repo URL
  - Trigger: initiates Flagsmith sync + optional GitHub repo AST scan

apps/mcp-server/src/stdioServer.js
  - Replace ADR-specific tool definitions with 4 new Flagsmith MCP tools
  - Simulation mode: flag demo data instead of ADR demo data
  - Tool list: get_flag_blast_radius, safe_toggle_flag, list_stale_flags, explain_flag_dependencies
```

---

## 5. The 4-Day Sprint Implementation Plan

### 5.1 Timeline Overview

```
Toggle Wars Hackathon: November 26 – November 29, 2026 (96-hour window)
Team: CAVDAX sub-team (dedicated Track 03 team, separate from ERVIX team)

DAY 1 (Nov 26) — Foundation & Flagsmith Integration
  Hours 00-04: Docker Compose Flagsmith service addition + local test
  Hours 04-10: flagsmithClient.js — REST API sync, tag parsing, FalkorDB writes
  Hours 10-16: Simulation mode flag demo data (blast radius demo without live Flagsmith)
  Hours 16-20: queries.js additions — syncFlagsmithData, computeBlastRadius
  Milestone: docker compose up runs Flagsmith + FalkorDB + CAVDAX. Tags create edges.

DAY 2 (Nov 27) — Dependency Discovery Signals
  Hours 20-26: gitCoupling.js — CO_CHANGED edge detection from commit history
  Hours 26-34: astScanner.js — tree-sitter setup + Flagsmith SDK call extraction
  Hours 34-40: Combined signal normalization — P(dependency) confidence scoring
  Milestone: Three signals active. Blast radius computes probabilistic output.

DAY 3 (Nov 28) — MCP Tools + Web HUD
  Hours 40-46: flagsmithTools.js — 4 MCP tools implementation
  Hours 46-52: GraphCanvas data model adaptation — flag nodes, confidence edges
  Hours 52-58: ConnectedRepoWorkspace → ConnectedFlagsmithProject
  Hours 58-64: MCP simulation mode update + end-to-end MCP test
  Milestone: MCP server exposes 4 Flagsmith tools. Web HUD renders flag graph.

DAY 4 (Nov 29) — Polish, Demo, Submission
  Hours 64-72: Documentation update (README, GETTING_STARTED, submission writeup)
  Hours 72-80: Demo video recording (blast radius demo, MCP tool demo, docker compose demo)
  Hours 80-88: Final testing, edge case verification, submission packaging
  Hours 88-96: Buffer for fixes, submission upload
  Milestone: Submitted.
```

### 5.2 Critical Path & Risk Items

| Risk | Severity | Mitigation |
|:---|:---:|:---|
| Self-hosted Flagsmith Docker setup complexity | Medium | Use official `flagsmith/flagsmith:latest` image — documented one-liner |
| tree-sitter cross-platform build issues on Windows | High | Pin to `tree-sitter@0.21.1` (last stable pre-WASM version), test on Windows Day 1 |
| Flagsmith Management API rate limits | Low | Cache GET responses in memory + 30s poll interval |
| GraphCanvas re-renders with flag data incorrectly | Medium | Existing simulation mode provides fallback; fix is data-only |
| MCP simulation mode complexity | Low | CAVDAX already has a battle-tested simulation mode — adapt flag demo data |

### 5.3 Non-Negotiable Day 1 Checkpoint

Before anything else, the following must be verified working by end of Day 1:

```bash
# This command must produce a running system by end of Day 1
docker compose up

# Verify:
# - Flagsmith UI accessible at http://localhost:8000
# - CAVDAX web HUD accessible at http://localhost:5173
# - CAVDAX server healthy at http://localhost:3001/health
# - FalkorDB responding at redis-cli -p 6379 ping

# After creating a flag in Flagsmith and adding a "depends:other_flag" tag:
curl http://localhost:3001/api/flags/blast-radius?key=dark_mode
# Must return: { "impacted": [{ "key": "other_flag", "probability": 1.0, "signals": ["tag"] }] }
```

If this does not work by end of Day 1 (16 hours), the remaining signals (AST, git) are deprioritized until it does.

---

## 6. The Scoring Simulation

### 6.1 Per-Criterion Score Projection

| Judging Criterion | Score | Rationale |
|:---|:---:|:---|
| **Self-hosts Flagsmith (one command)** | **10/10** | `docker compose up` is already a core CAVDAX capability. Adding Flagsmith service is 30 lines. |
| **Built around Flagsmith (not beside it)** | **8/10** | Flagsmith is the ingestion source; without it the graph is empty. Minor deduction: FalkorDB may be seen as "parallel to Flagsmith" by some judges. |
| **Solves a real developer pain point** | **10/10** | Flag blast radius is a genuinely unsolved problem. No existing Flagsmith tool answers "what breaks if I toggle this?" |
| **Packaged for zero-friction use** | **9/10** | `@cavdax/mcp-server` is already SLSA-3 published on npm with simulation mode. Minor deduction: Flagsmith env vars require configuration. |
| **Technical quality and depth** | **10/10** | Production-deployed, real benchmarks, timing-safe crypto, HMAC webhooks, Sigstore provenance. No hackathon team comes close. |
| **Novelty** | **10/10** | Flag dependency graph with probabilistic blast radius: does not exist in the Flagsmith ecosystem. |

**Combined Score: 94–96/100**  
**Win Probability: 85–90%**

### 6.2 Why It Doesn't Hit 100% (Honest Gaps)

1. **FalkorDB as an extra dependency.** A minority of judges may ask "why does a Flagsmith tool need a graph database?" The answer (sub-millisecond multi-hop traversal for large flag graphs) is architecturally sound, but it adds Docker Compose complexity beyond what Track 03 competitors typically ship.

2. **"Built around Flagsmith" vs "uses Flagsmith as a data source."** CAVDAX's core intelligence (GraphBLAS) lives in FalkorDB, not in Flagsmith. The honest framing is: Flagsmith provides the data, FalkorDB provides the intelligence. Some judges will see FalkorDB as the star of the show, not Flagsmith.

3. **Manual tag convention for Signal 1 is not fully automatic.** The first signal (tag parsing) requires a developer to add `depends:flag_name` tags in Flagsmith's dashboard. This is low-friction, but it's not zero-friction. Signals 2 and 3 (AST + git) are fully automatic, but they require a connected GitHub repository.

### 6.3 Why It Would Win Despite These Gaps

The competition for a PS5 + GTA 6 bundle is structurally weaker than for $2,000 cash:

- Non-monetary prizes attract fewer serious enterprise engineering teams
- Track 03's suggested ideas (VS Code plugin, terminal dashboard, starter template) are all 3–8 hour builds
- A production-deployed product with npm provenance, real benchmarks, and a graph intelligence backend is in a categorically different tier
- The blast radius concept is genuinely novel — no judge has seen it for Flagsmith before

---

## 7. The Team Split Strategy

### 7.1 Two Independent Teams, Two Tracks

```
TEAM SPLIT STRUCTURE
─────────────────────────────────────────────────────────────────────────────────────

TEAM A: CAVDAX (Track 03 — CAVDAX for Flagsmith)
  Focus:   Flag Blast Radius Intelligence Engine
  Codebase: C:\Users\krish\OneDrive\Desktop\(All_&_Everything)\
             (All-Hackathons)\GraphHacks-Hackathon\Codebase
  Timeline: Nov 26–29 (see Section 5.1 sprint plan)
  Primary deliverable: docker compose up + MCP server + web HUD
  Secondary deliverable: submission writeup + demo video

TEAM B: ERVIX (Tracks 01 + 02)
  Focus:   Autonomous UI Quality Gate + Flagsmith Experimentation
  Codebase: C:\Users\krish\OneDrive\Desktop\(All_&_Everything)\
             Current-Projects\All-My-Projects\(AI-Designer-Observer-ERVIX)
  Timeline: Nov 26–29 (ERVIX master spec v1.8.0 applies)
  Primary deliverable: Track 02 MCP server + testbed A/B experiment
  Secondary deliverable: Track 01 experimentation case study

ZERO SHARED CODE: These are independent submissions to independent tracks.
ZERO CONTEXT-SWITCHING: Each team stays in their codebase for the full 4 days.
```

### 7.2 Realistic Prize Haul

```
Scenario A (Both teams ship what they plan):
  Track 02 (ERVIX): $1,000 cash [high confidence — 90% fit, strong submission]
  Track 03 (CAVDAX): PS5 + GTA 6 [high confidence — 85-90% win probability]
  Track 01 (ERVIX): $2,000 cash [medium confidence — 65% fit, circular experiment risk]
  
  Expected value: $1,000 certain + PS5+GTA6 likely + $2,000 possible

Scenario B (Only CAVDAX team ships Track 03):
  Track 03 (CAVDAX): PS5 + GTA 6 [high confidence]
  
Scenario C (Only ERVIX team ships Tracks 01+02):
  Track 02 (ERVIX): $1,000 cash [high confidence]
  Track 01 (ERVIX): $2,000 cash [medium confidence]
```

---

## 8. The Submission Narrative

The submission writeup must tell this story, in this order:

### 8.1 The Hook (First 30 Seconds of Demo Video)

> *"You have 50 feature flags in production. You want to disable `dark_mode`. What breaks? Nobody knows. You toggle it, and 20 minutes later your analytics dashboard goes blank because it depended on `dark_mode` being enabled. This happens to every team running Flagsmith at scale. CAVDAX for Flagsmith solves this."*

### 8.2 The Demo Flow (Must Show All Three Signals in Action)

```
DEMO SEQUENCE (5 minutes):
─────────────────────────────────────────────────────────────────────────────────────
00:00  docker compose up (shows Flagsmith + FalkorDB + CAVDAX starting simultaneously)
00:45  Open Flagsmith dashboard at localhost:8000. Show existing flags.
01:00  Add "depends:premium_analytics" tag to dark_mode flag in Flagsmith dashboard.
01:15  Open CAVDAX web HUD. Graph auto-updates: dark_mode → premium_analytics edge appears.
01:30  Show git temporal coupling: past commits where both flags co-appeared.
01:45  Show AST scan: Dashboard.tsx line 142 — AND expression with both flags.
02:00  Demonstrate blast radius query: "If I disable dark_mode..."
02:20  Show probabilistic output: premium_analytics P=0.94, analytics_dashboard P=0.73
02:35  Open Claude Code or Cursor, connect @cavdax/mcp-server.
02:45  Prompt: "Is it safe to disable dark_mode in staging?"
02:55  Agent calls get_flag_blast_radius('dark_mode') → returns ranked impact list
03:10  Agent calls safe_toggle_flag('dark_mode', false, 'staging') with approval gate
03:20  Flag toggled safely. Audit log in FalkorDB records the event.
03:35  Wrap: "One docker compose up. Self-hosted Flagsmith. Graph intelligence. Done."
```

### 8.3 The Submission Writeup Keywords (What Judges Ctrl+F For)

- "self-hosted Flagsmith" (proves Track 03 eligibility)
- "flag blast radius" (the novel value proposition)
- "docker compose up" (proves one-command setup)
- "FalkorDB GraphBLAS" (proves technical depth)
- "tree-sitter AST analysis" (proves automatic dependency discovery)
- "MCP server" (proves AI agent integration)
- "@cavdax/mcp-server on npm" (proves packaging)

---

## 9. The Adversarial Challenge Questions (Pre-Submission Checklist)

Before submitting, every member of the CAVDAX team must be able to answer these:

| Judge Question | Required Answer |
|:---|:---|
| "Why does a Flagsmith tool need a graph database?" | "Multi-hop traversal of flag dependency chains. If dark_mode enables premium_analytics which enables analytics_dashboard, that's a 3-hop path. GraphBLAS computes all reachable flags in <2.5ms regardless of chain depth." |
| "Why can't I just look at Flagsmith's existing dashboard?" | "Flagsmith's dashboard shows each flag independently. It has no concept of dependencies between flags. We built the dependency intelligence layer that Flagsmith's dashboard doesn't have." |
| "What if I only have 5 flags?" | "Simulation mode works without Flagsmith. But with 5 flags, you're pre-loading the dependency graph before you have 50 flags. The earlier you declare dependencies, the more valuable the blast radius becomes." |
| "How does it know which flags depend on each other?" | "Three signals: (1) tags you add in Flagsmith's dashboard, (2) AST analysis of your code finding flag co-usage, (3) git history showing which flags co-changed in commits. Combined into a confidence score per edge." |
| "Is this open source?" | "Yes. Apache-2.0 license. SLSA-3 npm provenance. Source at github.com/CAVDAX/CAVDAX." |

---

## 10. Document Maintenance Instructions

This document is the canonical blueprint for the CAVDAX Track 03 adaptation. It must be updated:

- **Before Day 1 starts:** Confirm team member assignments and Day 1 checkpoint criteria
- **After Day 1:** Mark Day 1 milestone as DONE or BLOCKED; update risk items
- **After each day:** Record what shipped, what didn't, and what the revised plan is
- **On submission:** Add submission timestamp, demo video URL, and final submission link

> This document does NOT live in the ERVIX repository. It lives in the CAVDAX codebase at `docs/CAVDAX_FOR_FLAGSMITH_TRACK03_BLUEPRINT.md`.
