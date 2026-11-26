/**
 * Flagsmith MCP Stdio Server
 *
 * Implements the Model Context Protocol (MCP) JSON-RPC 2.0 stdio specification.
 * Connects AI coding agents (Cursor, Claude Code, Windsurf) to Flagsmith & FalkorDB GraphBLAS.
 */

import readline from 'readline';

const GATEWAY_URL = (process.env.FLAGSMITH_GATEWAY_URL || 'https://cavdax-flagsmith.sahnirmaan.live/api').replace(/\/+$/, '');

export const TOOLS = [
  {
    name: 'get_flag_blast_radius',
    description: 'Flagsmith Integration: Computes the multi-hop topological blast radius of a feature flag across Signal 1 (Tags), Signal 2 (Static AST calls), and Signal 3 (Git temporal coupling).',
    inputSchema: {
      type: 'object',
      properties: {
        flag_name: {
          type: 'string',
          description: 'The feature flag name (e.g. "dark_mode", "premium_analytics").'
        }
      },
      required: ['flag_name']
    }
  },
  {
    name: 'safe_toggle_flag',
    description: 'Flagsmith Integration: Safely toggles a feature flag in Flagsmith and FalkorDB, validating that no active downstream features are broken and all upstream prerequisites are satisfied.',
    inputSchema: {
      type: 'object',
      properties: {
        flag_name: {
          type: 'string',
          description: 'The feature flag name to toggle.'
        },
        enabled: {
          type: 'boolean',
          description: 'The target boolean state (true to enable, false to disable).'
        },
        force: {
          type: 'boolean',
          description: 'Set to true to bypass safety gates and force-toggle even if breaking changes exist.'
        }
      },
      required: ['flag_name', 'enabled']
    }
  },
  {
    name: 'list_flagsmith_features',
    description: 'Flagsmith Integration: Lists all registered feature flags, their current enabled status, tag-declared dependencies, and topological degree counts.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'scan_code_for_flags',
    description: 'Flagsmith Integration: Analyzes code snippets or files for Flagsmith SDK invocations (Signal 2 Static AST analysis), inferring structural dependencies (GUARDS, CO_OCCURS_AND, CO_OCCURS_HOOK), checking live production states, and reporting prerequisite risks.',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'The source code string to scan for Flagsmith SDK calls.'
        },
        file_path: {
          type: 'string',
          description: 'Optional file path or name (e.g. "App.jsx", "checkout.ts"). Defaults to "snippet.js".'
        }
      },
      required: ['code']
    }
  },
  {
    name: 'sync_flagsmith_graph',
    description: 'Flagsmith Integration: Triggers bidirectional synchronization between the self-hosted Flagsmith instance and the FalkorDB GraphBLAS dependency matrix across all 3 signals (Tags, AST, and Git).',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'list_stale_flags',
    description: 'Flagsmith Integration: Identifies stale feature flags that are candidates for sunset and removal. Scans for enabled flags with zero downstream dependents across the FalkorDB dependency matrix.',
    inputSchema: {
      type: 'object',
      properties: {
        days: {
          type: 'number',
          description: 'Inactivity threshold in days (defaults to 90).'
        }
      }
    }
  }
];

export async function fetchGateway(endpoint, options = {}) {
  const url = `${GATEWAY_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    ...options
  });
  return await res.json();
}

export async function handleToolCall(name, args = {}) {
  if (name === 'get_flag_blast_radius') {
    const data = await fetchGateway(`/flagsmith/blast-radius/${encodeURIComponent(args.flag_name)}`);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2)
        }
      ]
    };
  } else if (name === 'safe_toggle_flag') {
    const data = await fetchGateway('/flagsmith/safe-toggle', {
      method: 'POST',
      body: JSON.stringify({
        flagName: args.flag_name,
        enabled: args.enabled,
        force: Boolean(args.force)
      })
    });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2)
        }
      ],
      isError: !data.success
    };
  } else if (name === 'list_flagsmith_features') {
    const data = await fetchGateway('/flagsmith/features');
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2)
        }
      ]
    };
  } else if (name === 'scan_code_for_flags') {
    const data = await fetchGateway('/flagsmith/scan-code', {
      method: 'POST',
      body: JSON.stringify({
        code: args.code,
        filePath: args.file_path || 'snippet.js'
      })
    });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2)
        }
      ],
      isError: !data.success
    };
  } else if (name === 'sync_flagsmith_graph') {
    const data = await fetchGateway('/flagsmith/sync', {
      method: 'POST'
    });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2)
        }
      ],
      isError: !data.success
    };
  } else if (name === 'list_stale_flags') {
    const days = args.days || 90;
    const data = await fetchGateway(`/flagsmith/stale?days=${encodeURIComponent(days)}`);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2)
        }
      ]
    };
  } else {
    throw new Error(`Unknown tool: '${name}'`);
  }
}

export function startStdioServer() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  const sendResponse = (id, result, error = null) => {
    const payload = { jsonrpc: '2.0', id };
    if (error) payload.error = error;
    else payload.result = result;
    process.stdout.write(JSON.stringify(payload) + '\n');
  };

  rl.on('line', async (line) => {
    if (!line.trim()) return;
    try {
      const msg = JSON.parse(line);
      const { id, method, params } = msg;

      if (method === 'initialize') {
        sendResponse(id, {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: {
            name: '@cavdax/flagsmith-mcp',
            version: '1.0.3'
          }
        });
      } else if (method === 'notifications/initialized') {
        // No-op for initialized notification
      } else if (method === 'tools/list') {
        sendResponse(id, { tools: TOOLS });
      } else if (method === 'tools/call') {
        const { name, arguments: toolArgs } = params;
        const result = await handleToolCall(name, toolArgs);
        sendResponse(id, result);
      } else {
        sendResponse(id, null, { code: -32601, message: `Method '${method}' not found` });
      }
    } catch (err) {
      process.stderr.write(`[flagsmith-mcp] Error: ${err.message}\n`);
    }
  });

  process.stderr.write(`[flagsmith-mcp] Stdio MCP Server active. Gateway: ${GATEWAY_URL}\n`);
}
