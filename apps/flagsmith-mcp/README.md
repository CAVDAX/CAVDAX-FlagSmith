# @cavdax/flagsmith-mcp

> **Flagsmith Feature Flag Blast Radius & Safe-Toggle MCP Server for AI Coding Agents**  
> *Track 03 Submission for Toggle Wars: The Flagsmith Experimentation Hackathon*  
> Built by **Team AWDAX** (Suneet Chugh, Geetika Chugh, Jatin Jha, Harshit Chauhan)

Prevent AI coding agents (Cursor, Claude Code, Windsurf) from silently breaking production when creating, modifying, or toggling feature flags.

---

## Quick Start: Zero-Config Setup in Cursor / Claude Code

### 1. Cursor IDE Setup
Add to your `.cursor/mcp.json` (or Cursor Settings -> Features -> MCP):

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

### 2. Claude Desktop Setup
Add to your `claude_desktop_config.json`:

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

## Exposed MCP Tools

| Tool Name | Type | Description |
| :--- | :--- | :--- |
| `get_flag_blast_radius` | Read-only | Computes multi-hop topological blast radius across Signal 1 (Tags), Signal 2 (Static AST calls), and Signal 3 (Git temporal coupling). |
| `safe_toggle_flag` | Mutating Gate | Enforces safety gates: hard-blocks toggles that break active downstream dependents or violate upstream prerequisites. |
| `list_flagsmith_features` | Read-only | Returns all registered feature flags, current enabled state, and graph degree metrics. |
| `scan_code_for_flags` | Read-only | Static AST inspection: analyzes code snippets or files for Flagsmith SDK calls, extracting inferred dependencies (GUARDS, CO_OCCURS_AND, CO_OCCURS_HOOK) and live status. |
| `sync_flagsmith_graph` | Mutating | Triggers bidirectional 3-signal synchronization between self-hosted Flagsmith REST API and the FalkorDB GraphBLAS matrix. |

---

## CLI Commands (Standalone Terminal Usage)

```bash
# List all feature flags and graph dependencies
npx @cavdax/flagsmith-mcp features

# Compute blast radius before changing a flag
npx @cavdax/flagsmith-mcp blast dark_mode

# Scan code snippet or file for Flagsmith SDK calls and AST dependencies
npx @cavdax/flagsmith-mcp scan src/App.jsx

# Synchronize Flagsmith instance with FalkorDB GraphBLAS matrix
npx @cavdax/flagsmith-mcp sync

# Safely toggle a feature flag (blocks if active dependents exist)
npx @cavdax/flagsmith-mcp toggle dark_mode off

# Force toggle (bypass safety gates)
npx @cavdax/flagsmith-mcp toggle dark_mode off --force
```

---

## License
Apache-2.0 © Team AWDAX
