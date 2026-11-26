/**
 * CAVDAX Flagsmith Git Temporal Coupling Miner
 * 
 * Mines git commit history to detect temporal co-change relationships between feature flags.
 * If Flag A and Flag B are continually modified together in the same commits, they share
 * an implicit architectural coupling (Signal 3).
 * 
 * Computes the Jaccard similarity index:
 *   J(A, B) = |Commits(A) ∩ Commits(B)| / |Commits(A) ∪ Commits(B)|
 * 
 * Emits CO_CHANGED dependency edges with calibrated confidence matching the Jaccard metric.
 */

import { execSync } from 'child_process';

export class GitMiner {
  /**
   * @param {object} [options]
   * @param {number} [options.minCoCommits=2] Minimum number of shared commits to consider coupling
   * @param {number} [options.jaccardThreshold=0.20] Minimum Jaccard index to create an edge
   * @param {number} [options.maxCommits=200] Maximum commits to analyze from git log
   */
  constructor(options = {}) {
    this.minCoCommits = options.minCoCommits ?? 2;
    this.jaccardThreshold = options.jaccardThreshold ?? 0.20;
    this.maxCommits = options.maxCommits ?? 200;
  }

  /**
   * Mines a list of commit records to extract flag occurrences and compute temporal coupling.
   * 
   * @param {Array<{ sha: string, message: string, diff: string, author?: string }>} commits
   * @param {Array<string>} knownFlags Array of known feature flag names
   * @returns {{ flagCommitMap: Record<string, Array<string>>, couplings: Array<object> }}
   */
  analyzeCommits(commits, knownFlags) {
    if (!Array.isArray(commits) || !Array.isArray(knownFlags) || knownFlags.length === 0) {
      return { flagCommitMap: {}, couplings: [] };
    }

    const flagCommitMap = {};
    for (const flag of knownFlags) {
      flagCommitMap[flag] = new Set();
    }

    // Match flags in commit diff and commit message
    for (const commit of commits) {
      const content = `${commit.message || ''}\n${commit.diff || ''}`;

      for (const flag of knownFlags) {
        // Fast boundary check for flag name
        const regex = new RegExp(`\\b${flag}\\b`, 'i');
        if (regex.test(content)) {
          flagCommitMap[flag].add(commit.sha);
        }
      }
    }

    // Convert sets to arrays for serialization
    const serializedMap = {};
    for (const [flag, set] of Object.entries(flagCommitMap)) {
      serializedMap[flag] = Array.from(set);
    }

    // Compute pairwise Jaccard index
    const couplings = [];
    const flags = knownFlags;

    for (let i = 0; i < flags.length; i++) {
      for (let j = i + 1; j < flags.length; j++) {
        const flagA = flags[i];
        const flagB = flags[j];

        const commitsA = flagCommitMap[flagA] || new Set();
        const commitsB = flagCommitMap[flagB] || new Set();

        if (commitsA.size === 0 || commitsB.size === 0) continue;

        // Calculate intersection
        let intersectionCount = 0;
        const sharedCommits = [];
        for (const sha of commitsA) {
          if (commitsB.has(sha)) {
            intersectionCount++;
            sharedCommits.push(sha);
          }
        }

        if (intersectionCount < this.minCoCommits) continue;

        // Union size = |A| + |B| - |A ∩ B|
        const unionSize = commitsA.size + commitsB.size - intersectionCount;
        const jaccard = unionSize > 0 ? intersectionCount / unionSize : 0;
        const roundedJaccard = parseFloat(jaccard.toFixed(3));

        if (roundedJaccard >= this.jaccardThreshold) {
          couplings.push({
            sourceFlag: flagA,
            targetFlag: flagB,
            relationship: 'CO_CHANGED',
            confidence: roundedJaccard,
            signal: 'GIT_TEMPORAL',
            sharedCommitCount: intersectionCount,
            sharedCommits,
            jaccardIndex: roundedJaccard,
          });
        }
      }
    }

    return {
      flagCommitMap: serializedMap,
      couplings: couplings.sort((a, b) => b.confidence - a.confidence),
    };
  }

  /**
   * Executes git log in the repository and analyzes historical flag coupling.
   * 
   * @param {string} repoDir Directory path of git repository
   * @param {Array<string>} knownFlags Array of feature flags
   * @returns {Promise<{ flagCommitMap: Record<string, Array<string>>, couplings: Array<object>, totalCommitsAnalyzed: number }>}
   */
  async mineGitRepository(repoDir, knownFlags) {
    try {
      // Stream git log with SHA, subject, and patch diff
      const logOutput = execSync(
        `git -C "${repoDir}" log -n ${this.maxCommits} --pretty=format:"COMMIT_SPLIT:%H|%s" -p`,
        { maxBuffer: 10 * 1024 * 1024, encoding: 'utf8' }
      );

      const rawBlocks = logOutput.split('COMMIT_SPLIT:').filter(Boolean);
      const commits = [];

      for (const block of rawBlocks) {
        const firstLineEnd = block.indexOf('\n');
        const header = firstLineEnd === -1 ? block : block.substring(0, firstLineEnd);
        const diff = firstLineEnd === -1 ? '' : block.substring(firstLineEnd + 1);

        const [sha, ...msgParts] = header.split('|');
        const message = msgParts.join('|').trim();

        if (sha) {
          commits.push({ sha: sha.trim(), message, diff });
        }
      }

      const result = this.analyzeCommits(commits, knownFlags);
      return {
        ...result,
        totalCommitsAnalyzed: commits.length,
      };
    } catch (err) {
      return {
        flagCommitMap: {},
        couplings: [],
        totalCommitsAnalyzed: 0,
        error: err.message,
      };
    }
  }
}
