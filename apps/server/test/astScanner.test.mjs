import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { AstScanner } from '../../../core/ingestion/astScanner.js';

describe('Signal 2: AstScanner (Static Flagsmith Code Analysis)', () => {
  const scanner = new AstScanner();

  test('detects JavaScript Flagsmith SDK calls across standard syntax variants', () => {
    const code = `
      import flagsmith from 'flagsmith';

      export function renderApp() {
        if (flagsmith.isFeatureEnabled('dark_mode')) {
          console.log('Dark mode active');
        }
        if (flagsmith.hasFeature('beta_streaming')) {
          enableStreaming();
        }
        const val = flagsmith.getValue('sample_rate');
      }
    `;

    const result = scanner.scanSource(code, 'app.js');
    const flags = result.map(r => r.flag);

    assert.ok(flags.includes('dark_mode'), 'Must detect dark_mode');
    assert.ok(flags.includes('beta_streaming'), 'Must detect beta_streaming');
    assert.ok(flags.includes('sample_rate'), 'Must detect sample_rate');
  });

  test('detects boolean conjunction dependencies (CO_OCCURS_AND)', () => {
    const code = `
      if (flagsmith.isFeatureEnabled('auth_v2') && flagsmith.isFeatureEnabled('mfa_enforced')) {
        promptMfa();
      }
    `;

    const result = scanner.analyzeDependencies(code, 'auth.js');
    const andDep = result.dependencies.find(d => d.relationship === 'CO_OCCURS_AND');

    assert.ok(andDep, 'Must identify boolean conjunction dependency');
    assert.equal(andDep.confidence, 0.75, 'Confidence must be 0.75 for conjunction');
    assert.equal(andDep.signal, 'AST_STATIC');
  });

  test('detects enclosing nested guard relationships (GUARDS with confidence 0.85)', () => {
    const code = `
      function loadPlayer() {
        if (flagsmith.isFeatureEnabled('video_player_v2')) {
          initCanvas();
          if (flagsmith.isFeatureEnabled('hardware_acceleration')) {
            enableWebGl2();
          }
        }
      }
    `;

    const result = scanner.analyzeDependencies(code, 'player.js');
    const guardDep = result.dependencies.find(d => d.sourceFlag === 'video_player_v2' && d.targetFlag === 'hardware_acceleration');

    assert.ok(guardDep, 'Must identify enclosing guard relationship');
    assert.equal(guardDep.relationship, 'GUARDS');
    assert.equal(guardDep.confidence, 0.85, 'Confidence must be 0.85 for guard condition');
  });

  test('detects React useFlags hook array syntax', () => {
    const code = `
      const flags = useFlags(['ai_copilot', 'voice_dsp', 'haptic_feedback']);
    `;

    const result = scanner.scanSource(code, 'HookTest.jsx');
    const flags = result.map(r => r.flag);

    assert.deepEqual(flags.sort(), ['ai_copilot', 'haptic_feedback', 'voice_dsp'].sort());
  });
});
