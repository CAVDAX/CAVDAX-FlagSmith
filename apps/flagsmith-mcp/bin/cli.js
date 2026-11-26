#!/usr/bin/env node

/**
 * @cavdax/flagsmith-mcp CLI & Stdio Server
 *
 * Usage:
 *   npx @cavdax/flagsmith-mcp                     -> Starts MCP Stdio Server (for Cursor / Claude)
 *   npx @cavdax/flagsmith-mcp blast <flagName>    -> Computes blast radius of flag
 *   npx @cavdax/flagsmith-mcp features            -> Lists all feature flags & dependency metrics
 *   npx @cavdax/flagsmith-mcp toggle <flag> on|off [--force] -> Safely toggles flag
 *   npx @cavdax/flagsmith-mcp scan <file>         -> Scans code for Flagsmith calls & AST dependencies
 *   npx @cavdax/flagsmith-mcp sync                -> Synchronizes Flagsmith & FalkorDB GraphBLAS matrix
 */

import fs from 'fs';
import path from 'path';
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
  } else if (command === 'scan') {
    const targetFile = args[1];
    if (!targetFile) {
      console.error('Usage: flagsmith-mcp scan <filePath>');
      process.exit(1);
    }
    const resolvedPath = path.resolve(process.cwd(), targetFile);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`Error: File not found: ${resolvedPath}`);
      process.exit(1);
    }
    const code = fs.readFileSync(resolvedPath, 'utf8');
    console.log(`Scanning '${targetFile}' for Flagsmith SDK calls & AST dependencies...`);
    const data = await fetchGateway('/flagsmith/scan-code', {
      method: 'POST',
      body: JSON.stringify({ code, filePath: targetFile })
    });

    if (data.flags && data.flags.length > 0) {
      console.log(`\nDetected ${data.flags.length} Feature Flag Reference(s):`);
      console.table(data.flags.map(f => ({
        Flag: f.name,
        KnownInGraph: f.exists ? 'YES' : 'NO',
        LiveState: f.enabled === true ? 'ENABLED' : (f.enabled === false ? 'DISABLED' : 'UNKNOWN'),
        RiskTier: f.risk_tier || 'UNKNOWN',
        DownstreamDependents: f.downstream_dependents_count || 0,
        MissingPrereqs: f.missing_prerequisites_count || 0
      })));
    } else {
      console.log('\nZero Flagsmith feature flag references detected in file.');
    }

    if (data.dependencies && data.dependencies.length > 0) {
      console.log(`\nInferred ${data.dependencies.length} Structural AST Dependency Relation(s):`);
      console.table(data.dependencies.map(d => ({
        Source: d.sourceFlag,
        Target: d.targetFlag,
        Relation: d.relationship,
        Confidence: d.confidence,
        Line: d.line,
        Reason: d.reason
      })));
    }
  } else if (command === 'sync') {
    console.log('Triggering 3-Signal Sync (Flagsmith API + AST Ingestion + Git Coupling)...');
    const data = await fetchGateway('/flagsmith/sync', { method: 'POST' });
    console.log('\n✅ Sync Complete:');
    console.log(JSON.stringify(data, null, 2));
  } else if (command === 'stale') {
    const daysIdx = args.indexOf('--days');
    const days = daysIdx !== -1 && args[daysIdx + 1] ? args[daysIdx + 1] : 90;
    console.log(`Querying stale feature flags (inactivity threshold: ${days} days)...`);
    const data = await fetchGateway(`/flagsmith/stale?days=${encodeURIComponent(days)}`);
    if (data.stale_flags && data.stale_flags.length > 0) {
      console.log(`\nFound ${data.stale_flags.length} Stale Feature Flag Candidate(s) for Sunset:`);
      console.table(data.stale_flags.map(f => ({
        Flag: f.name,
        State: f.enabled ? 'ENABLED' : 'DISABLED',
        IncomingDependents: f.incoming_dependents || 0,
        Status: f.status || 'CANDIDATE_FOR_SUNSET',
        Recommendation: f.recommendation || ''
      })));
    } else {
      console.log(`\nZero stale flags found with threshold ${days} days.`);
    }
  } else if (command === '--help' || command === '-h' || command === 'help') {
    console.log(`
@cavdax/flagsmith-mcp v1.0.3
Flagsmith Feature Flag Blast Radius & Safe-Toggle MCP Server for AI Coding Agents

Usage:
  npx @cavdax/flagsmith-mcp                     Start MCP Stdio Server (for Cursor / Claude)
  npx @cavdax/flagsmith-mcp blast <flagName>    Inspect topological blast radius of a flag
  npx @cavdax/flagsmith-mcp features            List all registered feature flags & dependencies
  npx @cavdax/flagsmith-mcp toggle <f> on|off   Safely toggle a flag with dependency validation
  npx @cavdax/flagsmith-mcp scan <filePath>     Scan code file for Flagsmith calls & AST relations
  npx @cavdax/flagsmith-mcp sync                Synchronize Flagsmith instance with GraphBLAS matrix
  npx @cavdax/flagsmith-mcp stale [--days <n>]  Identify stale flags eligible for sunset/removal

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
