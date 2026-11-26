import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { GitMiner } from '../../../core/ingestion/gitMiner.js';

describe('Signal 3: GitMiner (Git Temporal Coupling Co-Change Analysis)', () => {
  const miner = new GitMiner({ minCoCommits: 2, jaccardThreshold: 0.25 });

  test('computes exact Jaccard similarity index across commit histories', () => {
    const knownFlags = ['auth_v2', 'mfa_enforced', 'dark_mode'];

    // 4 Commits:
    // c1: touches auth_v2 and mfa_enforced
    // c2: touches auth_v2 and mfa_enforced
    // c3: touches auth_v2 only
    // c4: touches dark_mode only
    const commits = [
      {
        sha: 'commit_1',
        message: 'feat: wire auth_v2 into login pipeline',
        diff: '+ if (isFeatureEnabled("mfa_enforced")) { prompt(); }'
      },
      {
        sha: 'commit_2',
        message: 'fix: patch token expiration in auth_v2 and mfa_enforced checks',
        diff: '@@ -10,2 +10,4 @@ - auth_v2 + auth_v2 && mfa_enforced'
      },
      {
        sha: 'commit_3',
        message: 'refactor: clean up auth_v2 session storage',
        diff: '+ session.auth_v2 = true;'
      },
      {
        sha: 'commit_4',
        message: 'style: add dark_mode palette variables',
        diff: '+ --bg-obsidian: #090A0C; /* dark_mode */'
      }
    ];

    const result = miner.analyzeCommits(commits, knownFlags);

    // auth_v2 has {c1, c2, c3} = size 3
    // mfa_enforced has {c1, c2} = size 2
    // Intersection = {c1, c2} = size 2
    // Union = {c1, c2, c3} = size 3
    // Jaccard = 2 / 3 = 0.667
    const authMfaCoupling = result.couplings.find(
      c => (c.sourceFlag === 'auth_v2' && c.targetFlag === 'mfa_enforced') ||
           (c.sourceFlag === 'mfa_enforced' && c.targetFlag === 'auth_v2')
    );

    assert.ok(authMfaCoupling, 'Must discover coupling between auth_v2 and mfa_enforced');
    assert.equal(authMfaCoupling.sharedCommitCount, 2);
    assert.equal(authMfaCoupling.confidence, 0.667);
    assert.equal(authMfaCoupling.signal, 'GIT_TEMPORAL');

    // dark_mode has 0 co-commits with auth_v2, so should not have coupling
    const darkCoupling = result.couplings.find(c => c.sourceFlag === 'dark_mode' || c.targetFlag === 'dark_mode');
    assert.equal(darkCoupling, undefined, 'dark_mode must have no coupling');
  });

  test('respects minCoCommits threshold filter', () => {
    const knownFlags = ['flag_x', 'flag_y'];
    // Only 1 commit shares both flags
    const commits = [
      { sha: 'c1', message: 'test', diff: 'flag_x flag_y' },
      { sha: 'c2', message: 'test', diff: 'flag_x' },
    ];

    const result = miner.analyzeCommits(commits, knownFlags);
    assert.equal(result.couplings.length, 0, 'Should not emit coupling when shared commits < minCoCommits');
  });
});
