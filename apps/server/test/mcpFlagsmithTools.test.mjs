import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { CavdaxMcpServer } from '../../../core/mcp/server.js';

describe('Flagsmith MCP Tools Expansion', () => {
  const mockGraph = {
    query: async (cypher, { params } = {}) => {
      if (cypher.includes('MATCH (target:FlagsmithFeature')) {
        return {
          data: [{
            target_flag: params?.flagName || 'dark_mode',
            target_enabled: true,
            target_description: 'Dark mode',
            upstream_prerequisites: [{ name: 'theme_system', enabled: true, depth: 1 }],
            downstream_dependents: [{ name: 'premium_analytics', enabled: true, depth: 1 }],
            blocked_features: []
          }]
        };
      }
      if (cypher.includes('MATCH (f:FlagsmithFeature)')) {
        return {
          data: [
            { name: 'dark_mode', id: '1', enabled: true, outgoing_dependencies: 1, incoming_dependents: 1 }
          ]
        };
      }
      return { data: [] };
    }
  };

  const mcp = new CavdaxMcpServer(mockGraph);

  test('Exposes Flagsmith tools in getTools() registry', () => {
    const tools = mcp.getTools();
    const toolNames = tools.map(t => t.name);

    assert.ok(toolNames.includes('get_flag_blast_radius'), 'Must expose get_flag_blast_radius');
    assert.ok(toolNames.includes('safe_toggle_flag'), 'Must expose safe_toggle_flag');
    assert.ok(toolNames.includes('list_flagsmith_features'), 'Must expose list_flagsmith_features');
  });

  test('get_flag_blast_radius returns full topology report', async () => {
    const res = await mcp.handleToolCall('get_flag_blast_radius', { flag_name: 'dark_mode' });
    assert.equal(res.status, 'SUCCESS');
    assert.equal(res.flag_name, 'dark_mode');
    assert.equal(res.downstream_impact_count, 1);
  });

  test('safe_toggle_flag enforces safety gate against breaking active dependents', async () => {
    const res = await mcp.handleToolCall('safe_toggle_flag', { flag_name: 'dark_mode', enabled: false, force: false });
    assert.equal(res.isError, true);
    assert.equal(res.gate_verdict, 'BLOCKED_BLAST_RADIUS_VIOLATION');
  });

  test('safe_toggle_flag allows bypass when force: true is provided', async () => {
    const res = await mcp.handleToolCall('safe_toggle_flag', { flag_name: 'dark_mode', enabled: false, force: true });
    assert.equal(res.status, 'SUCCESS');
    assert.equal(res.enabled, false);
    assert.equal(res.forced, true);
  });
});
