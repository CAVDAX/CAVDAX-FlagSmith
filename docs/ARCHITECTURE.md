# System Architecture Specification — CAVDAX for Flagsmith

**Project**: CAVDAX (**C**ontextual **A**ction & **V**erified **D**ecision **A**utonomous e**X**ecution) for Flagsmith  
**System Class**: Multi-Signal Causal Feature Flag Blast Radius & Enclosed MCP Gate  
**Version**: 1.3.0-PRODUCTION (Synchronized with Live Production Gateway `https://cavdax-flagsmith.sahnirmaan.live`)  

---

## 1. System Topology & Multi-Signal Architecture

CAVDAX for Flagsmith is architected as a high-performance, low-latency polyglot system engineered to provide autonomous AI coding agents and engineering teams with verifiable causal topology before any feature toggle or code mutation reaches production.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION & HUD TIER                                │
│   React 18 + Vite + Tailwind CSS + Lucide + Framer Motion Kinetic Physics       │
│   - Interactive Flag Radar & Topology Canvas (FalkorDB GraphBLAS Matrix Engine) │
│   - Split-Pane AST Live Code Inspector & Preset Evaluator                      │
│   - 4-Act Flagsmith Causal Verification Console (Interactive Stepper)           │
│   - Live Audit Trail Quick-Filters, Sound Engine, and Monochromatic Obsidian UI │
└──────────────────────────────────────┬──────────────────────────────────────────┘
                                       │ HTTP REST & SSE (/api/flagsmith/*, /api/graph)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        MCP INTERCEPTOR & GATEWAY TIER                           │
│   Node.js (v20+) + Express Gateway + MCP Protocol Standard Server               │
│   - 3-Signal Inference Engine (Flagsmith REST + AST Static + Git Jaccard)       │
│   - Enclosed Flagsmith MCP Server (6 Tools: blast_radius, safe_toggle, etc.)    │
│   - Bi-Directional Flagsmith API Sync Controller (apps/server/flagsmithSync.js) │
│   - Standalone npm distribution: @cavdax/flagsmith-mcp@1.0.3                   │
│   - Out-of-Band Divergence Radar: Resend API Dispatcher + VAPID Web Push Broker │
└──────────────────────────────────────┬──────────────────────────────────────────┘
                                       │ FalkorDB Client (Redis Protocol / Parameterized Cypher)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      CAUSAL GRAPHBLAS STORAGE & KERNEL                          │
│   FalkorDB 0.4+ Container (GraphBLAS Sparse Matrix Linear Algebra Engine)       │
│   Causal Directed Acyclic Graph: :FlagsmithFeature ──► :CodeReference           │
│   Sub-2ms matrix blast radius reachability via R = ⊕ A^k (k=1..3)              │
│   Tamper-Evident Agent Action Audit Ledger (:AgentAction)                       │
└──────────────────────────────────────┬──────────────────────────────────────────┘
                                       │ Multi-Signal Ingestion & Safe State Writes
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    FLAGS MESH & TARGET REPOSITORIES                             │
│   - Self-Hosted Flagsmith API & PostgreSQL DB (:8000 / :5432)                   │
│   - External Flagsmith Cloud REST API (v1 /flags/)                              │
│   - Target Codebases: Source ASTs (flagsmith.hasFeature, isFeatureEnabled, etc.)│
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 1.1 Stack Selection Rationale
- **FalkorDB + GraphBLAS**: Traditional relational databases cannot perform multi-hop recursive dependency traversals under 10ms. Vector databases cannot perform topological causal graph invalidations. FalkorDB leverages GraphBLAS sparse matrix linear algebra to execute multi-hop Cypher queries in **<2ms**, making pre-execution gating imperceptible to developer workflows.
- **MCP Gateway (Node.js Express + MCP Protocol)**: Native compatibility with Claude Code, Cursor, Windsurf, and standard LLM tool-calling conventions. Exposes 6 first-class tools for feature flag governance. Complete protocol specification is detailed in [MCP_SPECIFICATION.md](MCP_SPECIFICATION.md).
- **Client (React 18 + Vite)**: Instant HMR, minimal bundle footprint (<200kB), hardware-accelerated pure CSS animations with zero external heavy canvas dependencies.
- **Out-of-Band Divergence Radar (Resend API + RFC 8292 VAPID Web Push)**: Real-time enclosed gating protects in-flight tool calls, while out-of-band notifications alert human engineers when upstream flag states mutate.

---

## 2. End-to-End Multi-Tier Data Flow

### 2.1 The 4-Act Causal Feature Flag Invalidation & Execution Loop

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer / Flagsmith Admin
    actor Agent as Autonomous AI Agent
    participant MCP as Enclosed MCP Gate
    participant Falkor as FalkorDB (GraphBLAS)
    participant Flagsmith as Flagsmith API Engine

    Note over Dev, Flagsmith: ACT I: Baseline Flagsmith Mesh
    Dev->>Falkor: Seed Baseline Flags (theme_system, auth_v2, dark_mode, premium_analytics)
    Falkor-->>MCP: Causal Feature Topology Active (12 nodes, 10 edges)

    Note over Dev, Falkor: ACT II: Multi-Signal Ingestion & Dependency Discovery
    Dev->>MCP: Sync Code AST & Git Temporal Miner
    MCP->>Falkor: Cypher: Ingest AST call sites and Jaccard co-changes
    Falkor->>Falkor: GraphBLAS builds multi-hop DAG (premium_analytics -> dark_mode -> theme_system)
    Falkor-->>MCP: Topology Mesh Ready in 1.84ms

    Note over Agent, Flagsmith: ACT III: Agent Attempts High Blast Radius Toggle
    Agent->>MCP: safe_toggle_flag(flag: 'dark_mode', enabled: false)
    MCP->>Falkor: Cypher: Calculate multi-hop blast radius for dark_mode
    Falkor-->>MCP: Return: 2 downstream dependents (premium_analytics, analytics_dashboard); HIGH RISK
    MCP-->>Agent: 409 CONFLICT: BLOCKED_HIGH_BLAST_RADIUS (Zero toggles executed)

    Note over Agent, Flagsmith: ACT IV: Revalidation & Grounded Safe Execution
    Agent->>MCP: get_flag_blast_radius(flag: 'dark_mode')
    Agent->>Falkor: Verify dynamic theme fallback & satisfy prerequisite guards
    Agent->>MCP: safe_toggle_flag(flag: 'dark_mode', enabled: false, fallback: 'system_theme')
    MCP->>Falkor: Re-verify causal path safety
    Falkor-->>MCP: Return: Fallback Verified, Causal Proof Approved
    MCP->>Flagsmith: PATCH /api/v1/flags/dark_mode (enabled: false)
    MCP->>Falkor: CREATE (:AgentAction {status: 'APPROVED', latency: 1.62})
    MCP-->>Agent: 200 OK: GATE APPROVED in 1.62ms
```

---

## 3. Causal Graph Schema & Data Contracts

### 3.1 Node Entity Declarations
```cypher
// 1. Flagsmith Feature Node
(:FlagsmithFeature {
  id: STRING,                  // e.g. "dark_mode", "premium_analytics", "auth_v2"
  name: STRING,                // Feature identifier
  enabled: BOOLEAN,            // Active boolean toggle state
  description: STRING,         // Human-readable feature intent
  in_degree: INTEGER,          // Number of upstream prerequisites
  out_degree: INTEGER,         // Number of downstream dependents
  risk_tier: STRING            // "LOW" | "MEDIUM" | "HIGH"
})

// 2. Code Reference Node (Static AST Call Sites)
(:CodeReference {
  id: STRING,                  // e.g. "ref_theme_provider", "ref_analytics_panel"
  file_path: STRING,           // Source path e.g. "src/theme/provider.tsx"
  call_type: STRING,           // "hasFeature" | "isFeatureEnabled" | "useFlags" | "getValue"
  line_number: INTEGER         // Exact AST line number
})

// 3. Agent Action Audit Node (Signed Ledger Entries)
(:AgentAction {
  id: STRING,                  // e.g. "act-hist-001"
  timestamp: INTEGER,          // Unix epoch timestamp (ms)
  target_flag: STRING,         // Target feature flag mutated
  verdict: STRING,             // "APPROVED" | "BLOCKED_HIGH_BLAST_RADIUS" | "BLOCKED_CRITICAL_PREREQUISITE"
  latency_ms: FLOAT,           // Sub-millisecond gate execution latency
  signature: STRING            // HMAC-SHA256 tamper-evident hash
})
```

### 3.2 Relational Edge Contracts
- `(:FlagsmithFeature)-[:DEPENDS_ON {signal: STRING, weight: FLOAT}]->(:FlagsmithFeature)`: Direct prerequisite relationship established via Flagsmith tags, AST nesting, or Git co-change.
- `(:FlagsmithFeature)-[:GUARDS]->(:CodeReference)`: AST static linkage where a feature flag guards an execution branch in code.
- `(:FlagsmithFeature)-[:CO_CHANGED_WITH {jaccard: FLOAT}]->(:FlagsmithFeature)`: Historical temporal coupling mined from Git commits.

---

## 4. Model Context Protocol (MCP) Interface Declarations

CAVDAX implements the official Model Context Protocol (MCP) specification with 6 dedicated tools for Flagsmith feature governance:

### 4.1 Tool: `get_flag_blast_radius`
```json
{
  "name": "get_flag_blast_radius",
  "description": "Calculates the multi-hop downstream blast radius, risk tier, and safe-to-disable verdict for a target Flagsmith feature flag.",
  "parameters": {
    "type": "object",
    "properties": {
      "flagName": { "type": "string", "description": "The unique flag key in Flagsmith (e.g. 'dark_mode')." },
      "maxDepth": { "type": "number", "description": "Maximum traversal depth (default: 3)." }
    },
    "required": ["flagName"]
  }
}
```

### 4.2 Tool: `safe_toggle_flag`
```json
{
  "name": "safe_toggle_flag",
  "description": "Safely toggles a Flagsmith feature flag with pre-flight blast radius verification. Rejects with HTTP 409 if active downstream dependents will break.",
  "parameters": {
    "type": "object",
    "properties": {
      "flagName": { "type": "string", "description": "The unique flag key to mutate." },
      "enabled": { "type": "boolean", "description": "Target boolean status." },
      "force": { "type": "boolean", "description": "Bypass safety block if explicitly authorized." }
    },
    "required": ["flagName", "enabled"]
  }
}
```

### 4.3 Tool: `list_flagsmith_features`
```json
{
  "name": "list_flagsmith_features",
  "description": "Returns all registered feature flags enriched with topological dependency metrics from FalkorDB GraphBLAS.",
  "parameters": { "type": "object", "properties": {} }
}
```

### 4.4 Tool: `scan_code_for_flags`
```json
{
  "name": "scan_code_for_flags",
  "description": "Traverses codebase AST to extract all Flagsmith SDK call sites (hasFeature, isFeatureEnabled, useFlags, getValue).",
  "parameters": {
    "type": "object",
    "properties": {
      "targetDirectory": { "type": "string", "description": "Directory path to scan (default: repository root)." }
    }
  }
}
```

### 4.5 Tool: `sync_flagsmith_graph`
```json
{
  "name": "sync_flagsmith_graph",
  "description": "Performs bidirectional synchronization between Flagsmith REST API and the FalkorDB GraphBLAS causal mesh.",
  "parameters": { "type": "object", "properties": {} }
}
```

### 4.6 Tool: `list_stale_flags`
```json
{
  "name": "list_stale_flags",
  "description": "Identifies safe dead-code pruning candidates (flags with 0 downstream dependents and deprecated status).",
  "parameters": { "type": "object", "properties": {} }
}
```

---

## 5. Security & Invalidation Gates (Cypher Traversal Queries)

### 5.1 Multi-Hop Blast Radius Traversal Query
```cypher
MATCH (target:FlagsmithFeature {name: $flag_name})
OPTIONAL MATCH path = (downstream:FlagsmithFeature)-[:DEPENDS_ON*1..3]->(target)
RETURN 
  target.name AS target_name,
  target.enabled AS target_enabled,
  collect(DISTINCT downstream.name) AS downstream_impact,
  length(path) AS hop_distance
```

### 5.2 Real-Time Gate Evaluation Logic
1. If `target` does not exist in graph $\rightarrow$ **REJECT** (`UNREGISTERED_FLAG`).
2. If `downstream_impact.length > 0` and `enabled == false` and `force != true` $\rightarrow$ **REJECT** (`BLOCKED_HIGH_BLAST_RADIUS`).
3. If upstream prerequisites are missing or disabled $\rightarrow$ **REJECT** (`BLOCKED_CRITICAL_PREREQUISITE`).
4. If `downstream_impact.length == 0` or prerequisite verified $\rightarrow$ **APPROVE** (`APPROVED`). Record event in `:AgentAction` audit ledger.

---

## 6. Infrastructure, Containerization & Fail-Open Resilience

### 6.1 Docker Compose Mesh (`docker-compose.yml`)
CAVDAX orchestrates its graph database, backend gateway, and client Web HUD through the root `docker-compose.yml` stack:

```yaml
services:
  # 1. FalkorDB Graph Engine (GraphBLAS Sparse Matrix Database)
  falkordb:
    image: falkordb/falkordb:latest
    container_name: cavdax-falkordb
    ports:
      - "6379:6379"
    volumes:
      - falkordb-data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  # 2. CAVDAX Backend Gateway & Enclosed MCP Gate
  server:
    build:
      context: .
      dockerfile: apps/server/Dockerfile
    container_name: cavdax-server
    environment:
      - PORT=3000
      - FALKORDB_HOST=falkordb
      - FALKORDB_PORT=6379
      - NODE_ENV=development
      - GITHUB_CALLBACK_URL=http://localhost:3001/api/auth/github/callback
      - CLIENT_URL=http://localhost:5173
    ports:
      - "3001:3000"
    volumes:
      - server-sessions:/app/apps/server/data/sessions
    depends_on:
      falkordb:
        condition: service_healthy
    restart: unless-stopped

  # 3. CAVDAX Porcelain Dark Web HUD
  client:
    build:
      context: .
      dockerfile: apps/client/Dockerfile
    container_name: cavdax-client
    environment:
      - VITE_API_URL=http://server:3000
    ports:
      - "5173:5173"
    depends_on:
      - server
    restart: unless-stopped

volumes:
  falkordb-data:
    driver: local
  server-sessions:
    driver: local
```

> **Container Lifecycle Hook Invariant**: To guarantee deterministic container compilation, `apps/client/Dockerfile` copies `apps/client/scripts/` prior to `RUN npm install`, ensuring custom postinstall patches (`node scripts/patch-hairline.js`) resolve without layer-caching misses.

### 6.2 Zero-Blocker Simulation Fallback
If the FalkorDB Docker container is offline during a local developer evaluation or live demo:
- `apps/server/falkor_driver.js` automatically catches connection timeouts.
- Switches instantaneously to the internal `InMemGraphBLAS` engine.
- Emulates the exact GraphBLAS matrix invalidation and gate returns with identical Cypher responses, guaranteeing **zero runtime crashes or demo blockers**.


---

## 7. Enterprise Security Perimeter & Web HUD Multi-Route Topology

### 7.1 Multi-Layer Defense-in-Depth Security
CAVDAX implements layered security across client, gateway, and kernel boundaries:
1. **Administrative IP Whitelisting & Dev Authentication (`requireDevAuth`)**:
   - Administrative endpoints (`POST /api/system/dev-ips`, `/api/system/dev-roster`, `/api/system/hackathon-mode`) are guarded by SHA-256 token verification and IP allowlists.
2. **Path Traversal Confinement**:
   - Gated file operations (`apply_code_change`, `/api/ingest`) resolve target paths with `path.resolve` and verify that the target starts with `PROJECT_ROOT`, preventing arbitrary directory access.
3. **Client IP Spoofing Mitigation**:
   - Uses remote socket address inspection to prevent proxy header tampering.
4. **Transport Security Headers**:
   - Injects `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and `Strict-Transport-Security`.
5. **Cryptographic Order Tier Binding**:
   - Razorpay order creation binds subscription tier attributes in server memory (`pendingBillingOrders`), rejecting mismatched confirmation payloads with canonical server-side pricing (`CANONICAL_TIER_PRICES_PAISE`).
6. **Tool Sandbox Confinement (`demo-repo/`)**:
   - Tool execution (`apply_code_change`) is confined to `demo-repo/` root; path traversal attempts outside the sandbox trigger immediate 403 blocks with zero byte writes.
7. **Multi-Tenant Scoped Graph Query Isolation**:
   - Graph queries (`/api/graph`, `/api/audit`) enforce parameterized tenant scoping (`WHERE coalesce(d.repo, 'demo') = $repoScope`); unauthenticated callers strictly see canonical demo data.
8. **Section 37 Truth-in-Data Standard (Zero Hardcoded Benchmark Strings or Fake Latency Fallbacks)**:
   - Absolute ban on synthetic numerical constants or logical OR fallbacks for elapsed times (e.g. `parseFloat(...) || 0.42` eliminated); pure execution time is measured dynamically with nanosecond precision (`process.hrtime.bigint()`). Benchmark evaluation suites run real dynamic vector similarity and DAG traversals rather than hardcoded mock strings.



### 7.2 Web HUD Route Topology (9 Operational Surfaces)
The client application provides 9 dedicated routes:
- `/` or `/overview`: Architectural Overview, Causal Invalidation Radar, Cytoscape DAG.
- `/console`: Connected Repository Workspace, git branch mutations, baseline initialization.
- `/mcp`: Live Model Context Protocol Action Playground and sub-millisecond Cypher query simulator.
- `/walkthrough`: 4-Act Storyline Stepper guiding evaluators through baseline, commit mutation, enclosed MCP rejection, and revalidation.
- `/audit`: Immutable compliance ledger displaying all tool execution events.
- `/team`: Engineering credits and research attribution.
- `/profile`: Developer quota tracking, plan capability matrix, and active MCP key provisioning.
- `/support`: Community sponsorship tiers and transparent operational backing breakdown.
- Zero-Trust Administrative Enclave: Diagnostic console, dev IP roster, and node state inspection.

---

## 8. The Causal Interception Enclave Subsystem Architecture

### 8.1 System Topology & Interception Pipeline
The **Causal Interception Enclave** (`#enclave-hub-section`) is CAVDAX's core architectural theater, positioned directly between the problem presentation bento grid and the downstream causal execution loop. It acts as the interactive control plane and hardware-grade visualization of the autonomous agent write-interception pipeline.

```
┌────────────────────────────────────────────────────────────────────────┐
│  CLIENT PWA (React 18 + Lenis + TailWind)                             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  CausalEnclaveHub.jsx                                           │  │
│  │  - 3D Isometric Viewport Deck (Perspective: 1400px)             │  │
│  │  - Solitary Node Elevation Vector Math (-42px Y Lift)            │  │
│  │  - 4.2s Sequential Concentric Squircle Wavefront Generator       │  │
│  │  - Precision Fullscreen Centering Guard (|diffCenter| < 80px)   │  │
│  │  - Proactive Keyboard Docking & Traversal Engine                 │  │
│  └─────────────────────────────────┬────────────────────────────────┘  │
└────────────────────────────────────┼───────────────────────────────────┘
                                     │ SSE / Fetch (POST /api/mcp/call)
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│  CORE API GATEWAY (Node.js Express + MCP Protocol Engine)             │
│  ┌──────────────────────────────┐  ┌────────────────────────────────┐  │
│  │ Tool Gate: apply_code_change │  │ Tool Gate: check_intent_clearance ││
│  └──────────────┬───────────────┘  └────────────────┬───────────────┘  │
│                 │                                   │                  │
│                 ▼                                   ▼                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ FalkorDB GraphBLAS Matrix Semiring (< 2.0ms Sweeps)              │  │
│  │ - Adjacency Matrix: Extracted_From & Depends_On DAG               │  │
│  │ - Causal Invalidation: Sparse Matrix Multiply BFS                │  │
│  │ - Multi-Agent Leases: acquire_decision_lock Concurrency Engine   │  │
│  │ - Lock Inspection Endpoint: GET /api/mcp/locks                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### 8.2 The 9-Stage Architectural Pipeline
1. **Stage 00 · Causal Semiring Kernel (`CORE`)**: Central algebraic semiring computing transitive reachability and causal invalidation over the dependency DAG in sub-2ms matrix sweeps.
2. **Stage 01 · Claude Code MCP Gate (`01`)**: Intercepts tool calls and filesystem write operations in-flight, blocking obsolete code mutations before bytes hit the disk.
3. **Stage 02 · Cursor IDE Transceiver (`02`)**: Low-latency stdio bridge delivering real-time topological invalidation feedback directly into editor buffers.
4. **Stage 03 · Git AST Diff Extractor (`03`)**: Optical AST parser extracting structural code deltas from commit graphs and detecting implementation drift from active ADRs.
5. **Stage 04 · ADR Invariant Store (`04`)**: Immutable single source of truth preserving superseded and active architectural decision lineages.
6. **Stage 05 · GraphBLAS Matrix Mesh (`05`)**: Sparse matrix algebraic engine executing reachability semirings across arbitrary dependency graphs.
7. **Stage 06 · CI/CD Gate Harness (`06`)**: Automated pipeline verification harness failing pull requests if code commits rely on deprecated architectural claims.
8. **Stage 07 · Cryptographic Audit Trail (`07`)**: Tamper-evident execution ledger capturing every agent interception, rule evaluation, and deterministic verdict.
9. **Stage 08 · Closed-Loop Auto-Repair (`08`)**: Guided remediation pipeline feeding verified ADR invariant constraints back to coding agents for clean self-healing.

### 8.3 Solitary Elevation & 3D Spatial Camera Math
- **Solitary Elevation Invariant**: To preserve visual clarity and eliminate card displacement, only the actively hovered or selected tile elevates (`elevatedCoord: [X, Y - 42]`). All other 8 slabs remain locked to their resting coordinates (`restCoord`).
- **Spring Camera Dynamics**: Stage transitions dynamically shift `transform: perspective(1400px) rotateX(...) rotateY(...) scale(...) translate3d(...)` with a smooth `cubic-bezier(0.16, 1, 0.3, 1)` spring curve, moving the viewport from the wide architectural top view (`CORE`) directly into targeted orbital zoom views for each individual subsystem.

### 8.4 Fullscreen Docking & Lenis Virtualizer Handshake
- **Deterministic Centering**: Viewport locking threshold is calculated as $|\text{sectionCenter} - \text{viewportCenter}| < \min(80, \text{viewportHeight} \times 0.08)$, guaranteeing identical docking precision on $1080\text{p}$ F11 fullscreen and responsive laptop displays.
- **Internal Docking Exemption**: Internal scroll calls pass `options.isInternalDock = true`, preventing Lenis's global programmatic scroll flag (`window.__isProgrammaticScroll`) from triggering false-positive unlocks.

---

## 9. Flagsmith Feature Flag Dependency Mesh & Self-Hosted Topology

### 9.1 Three-Signal Ingestion Pipeline
CAVDAX for Flagsmith expands the causal kernel to govern dynamic feature flags through a 3-signal inference mesh:

```
 ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
 │       SIGNAL 1       │  │       SIGNAL 2       │  │       SIGNAL 3       │
 │   Flagsmith REST     │  │ Static AST Scanner   │  │ Git Temporal Miner   │
 │   Tags & Prereqs     │  │ isFeatureEnabled()   │  │ Jaccard Co-Change    │
 └──────────┬───────────┘  └──────────┬───────────┘  └──────────┬───────────┘
            │ c1 = 0.95               │ c2 = 0.75..0.85         │ c3 = J(A,B)
            └────────────────► ┌──────┴──────┐ ◄────────────────┘
                               │  Bayesian   │
                               │  Aggregator │ P = 1 - Π(1 - c_i)
                               └──────┬──────┘
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │   FalkorDB GraphBLAS      │
                        │ [:DEPENDS_ON|GUARDS*1..3] │
                        └─────────────┬─────────────┘
                                      │
                         ┌────────────┴────────────┐
                         ▼                         ▼
                  MCP Safety Gate           React PWA HUD
                  HTTP 409 Conflict         /api/flagsmith/*
```

### 9.2 GraphBLAS Reachability Matrix Formulation
To avoid cyclic infinite loops from bidirectional co-occurrence relations, the Cypher traversal is formulated as a directed reachability problem:
$$\mathbf{R} = \bigoplus_{k=1}^3 \mathbf{A}^k$$
Where $\mathbf{A}$ represents the directed adjacency matrix over `[:DEPENDS_ON|GUARDS]` relationships. Matrix multiplication sweeps complete in $\le 35\text{ms}$.

### 9.3 Self-Hosted Flagsmith AWS EC2 Infrastructure
- **Container Mesh**: Runs Flagsmith v2.295.2 (`cavdax-flagsmith-api`) with PostgreSQL 15 (`cavdax-flagsmith-db`), FalkorDB, Express, and Caddy on AWS EC2 (`15.135.78.65`, ap-southeast-2).
- **Host Governance**: `DJANGO_ALLOWED_HOSTS: "*"` enables Cloudflare reverse proxy routing to `https://cavdax-flagsmith.sahnirmaan.live/flagsmith/api/v1/`.
- **Packaging**: `@cavdax/flagsmith-mcp@1.0.3` published with Sigstore provenance via GitHub Actions OIDC Trusted Publisher, exposing 6 dedicated tools and standalone CLI.
