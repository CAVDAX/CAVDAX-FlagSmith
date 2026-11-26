#!/usr/bin/env node

/**
 * @cavdax/flagsmith-mcp CLI & Stdio Server
 *
 * Usage:
 *   npx @cavdax/flagsmith-mcp                     -> Starts MCP Stdio Server (for Cursor / Claude)
 *   npx @cavdax/flagsmith-mcp blast <flagName>    -> Computes blast radius of flag
 *   npx @cavdax/flagsmith-mcp features            -> Lists all feature flags & dependency metrics
 *   npx @cavdax/flagsmith-mcp toggle <flag> on|off [--force] -> Safely toggles flag
 */

import { startStdioServer, fetchGateway } from '../src/mcpServer.js';

const args = process.argv.slice(2);
const command = args[0] || 'mcp';

async function main() {
  if (command === 'mcp' || command === 'serve') {
    startStdioServer();
  } else if (command === 'blast') {
    const flagName = args[1];
    if (!flagName) {
      console.error('Error: Flag name required. Usage: flagsmith-mcp blast <flagName>');
      process.exit(1);
    }
    console.log(`Analyzing blast radius for '${flagName}' via GraphBLAS...`);
    const data = await fetchGateway(`/flagsmith/blast-radius/${encodeURIComponent(flagName)}`);
    console.log(JSON.stringify(data, null, 2));
  } else if (command === 'features' || command === 'list') {
    console.log('Fetching synchronized feature flags from Flagsmith & FalkorDB...');
    const data = await fetchGateway('/flagsmith/features');
    if (data.features) {
      console.table(data.features.map(f => ({
        Name: f.name,
        State: f.enabled ? 'ENABLED' : 'DISABLED',
        OutgoingDeps: f.outgoing_dependencies,
        IncomingDependents: f.incoming_dependents,
        Description: f.description || ''
      })));
    } else {
      console.log(JSON.stringify(data, null, 2));
    }
  } else if (command === 'toggle') {
    const flagName = args[1];
    const targetState = args[2] === 'on' || args[2] === 'true' || args[2] === '1';
    const force = args.includes('--force');

    if (!flagName || args[2] === undefined) {
      console.error('Usage: flagsmith-mcp toggle <flagName> on|off [--force]');
      process.exit(1);
    }

    console.log(`Executing safe toggle for '${flagName}' -> ${targetState ? 'ON' : 'OFF'} (force=${force})...`);
    const data = await fetchGateway('/flagsmith/safe-toggle', {
      method: 'POST',
      body: JSON.stringify({ flagName, enabled: targetState, force })
    });

    if (data.blocked) {
      console.error(`\n⛔ BLOCKED BY SAFETY GATE:`);
      console.error(data.message);
      console.error(`Run with --force to override.`);
      process.exit(1);
    } else {
      console.log(`\n✅ Toggle Succeeded:`, JSON.stringify(data, null, 2));
    }
  } else if (command === '--help' || command === '-h' || command === 'help') {
    console.log(`
@cavdax/flagsmith-mcp v1.0.0
Flagsmith Feature Flag Blast Radius & Safe-Toggle MCP Server for AI Coding Agents

Usage:
  npx @cavdax/flagsmith-mcp                     Start MCP Stdio Server (for Cursor / Claude)
  npx @cavdax/flagsmith-mcp blast <flagName>    Inspect topological blast radius of a flag
  npx @cavdax/flagsmith-mcp features            List all registered feature flags & dependencies
  npx @cavdax/flagsmith-mcp toggle <f> on|off   Safely toggle a flag with dependency validation

Options:
  --force                                       Bypass safety gates on toggle
  -h, --help                                    Show help
    `);
  } else {
    // If unknown command, default to starting stdio server (so Cursor / Claude always connect seamlessly)
    startStdioServer();
  }
}

main().catch(err => {
  console.error('[flagsmith-mcp] Fatal error:', err);
  process.exit(1);
});
