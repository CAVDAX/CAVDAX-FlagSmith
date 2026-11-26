import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { BlastRadiusCalculator } from '../../../core/graph/blastRadiusCalculator.js';

describe('Signal Aggregator & BlastRadiusCalculator', () => {
  test('Bayesian signal aggregation correctly computes P = 1 - ∏(1 - c_i)', () => {
    // Flag A -> Flag B has AST signal (0.75) and GIT signal (0.60)
    const rawEdges = [
      { sourceFlag: 'mfa_enforced', targetFlag: 'auth_v2', signal: 'AST_STATIC', confidence: 0.75 },
      { sourceFlag: 'mfa_enforced', targetFlag: 'auth_v2', signal: 'GIT_TEMPORAL', confidence: 0.60 },
    ];

    const aggregated = BlastRadiusCalculator.aggregateSignals(rawEdges);
    const edge = aggregated.get('mfa_enforced->auth_v2');

    assert.ok(edge, 'Must aggregate both edges into single key');
    assert.deepEqual(edge.signals.sort(), ['AST_STATIC', 'GIT_TEMPORAL'].sort());
    // P = 1 - (1 - 0.75) * (1 - 0.60) = 1 - 0.25 * 0.40 = 0.90
    assert.equal(edge.probability, 0.9);
  });

  test('Computes multi-hop downstream blast radius and flags breaking dependents', () => {
    // Chain: oled_theme -> dark_mode -> ui_foundation
    const features = [
      { name: 'ui_foundation', enabled: true },
      { name: 'dark_mode', enabled: true },
      { name: 'oled_theme', enabled: true },
    ];

    const rawEdges = [
      { sourceFlag: 'dark_mode', targetFlag: 'ui_foundation', signal: 'TAG', confidence: 1.0 },
      { sourceFlag: 'oled_theme', targetFlag: 'dark_mode', signal: 'TAG', confidence: 1.0 },
    ];

    // Check blast radius of 'dark_mode'
    const report = BlastRadiusCalculator.compute({
      targetFlag: 'dark_mode',
      features,
      rawDependencies: rawEdges,
    });

    assert.equal(report.flag_name, 'dark_mode');
    assert.equal(report.safe_to_disable, undefined); // in report.verdict
    assert.equal(report.verdict.safe_to_disable, false, 'Should NOT be safe to disable because oled_theme is active');
    assert.equal(report.breaking_dependents.length, 1);
    assert.equal(report.breaking_dependents[0].name, 'oled_theme');
  });

  test('Blocks toggling ON when upstream prerequisite is disabled', () => {
    const features = [
      { name: 'auth_v2', enabled: false }, // DISABLED prerequisite
      { name: 'mfa_enforced', enabled: false },
    ];

    const rawEdges = [
      { sourceFlag: 'mfa_enforced', targetFlag: 'auth_v2', signal: 'TAG', confidence: 1.0 },
    ];

    const report = BlastRadiusCalculator.compute({
      targetFlag: 'mfa_enforced',
      features,
      rawDependencies: rawEdges,
    });

    assert.equal(report.verdict.safe_to_enable, false, 'Should be unsafe to enable because auth_v2 is disabled');
    assert.equal(report.missing_prerequisites.length, 1);
    assert.equal(report.missing_prerequisites[0].name, 'auth_v2');
  });
});
