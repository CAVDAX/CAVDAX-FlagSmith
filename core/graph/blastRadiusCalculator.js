/**
 * CAVDAX Flagsmith Bayesian Blast Radius Aggregator
 * 
 * Aggregates dependency signals across:
 * - Signal 1: Tag-declared contracts (confidence 1.0)
 * - Signal 2: AST Static code analysis (confidence 0.50 - 0.85)
 * - Signal 3: Git Temporal coupling / co-change (confidence = Jaccard index)
 * 
 * Formulates unified Bayesian link probabilities:
 *   P(A -> B) = 1 - ∏ (1 - c_i)
 * 
 * Computes multi-hop topological blast radius, risk classification,
 * upstream prerequisite checks, and safe-toggle governance verdicts.
 */

export class BlastRadiusCalculator {
  /**
   * Combines multiple raw dependency edges between the same flag pair into a unified Bayesian edge.
   * 
   * @param {Array<object>} rawEdges Array of dependency objects
   * @returns {Map<string, object>} Aggregated edge map keyed by "source->target"
   */
  static aggregateSignals(rawEdges) {
    const edgeMap = new Map();

    for (const edge of rawEdges) {
      const source = edge.sourceFlag;
      const target = edge.targetFlag;
      if (!source || !target || source === target) continue;

      const key = `${source}->${target}`;
      const conf = Math.max(0.01, Math.min(1.0, Number(edge.confidence) || 0.5));

      if (!edgeMap.has(key)) {
        edgeMap.set(key, {
          sourceFlag: source,
          targetFlag: target,
          relationship: edge.relationship || 'DEPENDS_ON',
          signals: [edge.signal || 'UNKNOWN'],
          confidences: [conf],
          details: [edge],
        });
      } else {
        const existing = edgeMap.get(key);
        if (!existing.signals.includes(edge.signal)) {
          existing.signals.push(edge.signal);
        }
        existing.confidences.push(conf);
        existing.details.push(edge);
      }
    }

    // Compute Bayesian unified probability: P = 1 - ∏ (1 - c_i)
    for (const [key, data] of edgeMap.entries()) {
      let productOfComplement = 1.0;
      for (const c of data.confidences) {
        productOfComplement *= (1.0 - c);
      }
      const bayesianProb = parseFloat((1.0 - productOfComplement).toFixed(3));
      data.probability = bayesianProb;
      edgeMap.set(key, data);
    }

    return edgeMap;
  }

  /**
   * Computes the complete blast radius for toggling a specific flag.
   * 
   * @param {object} params
   * @param {string} params.targetFlag Name of flag to inspect
   * @param {boolean} [params.currentEnabled=true] Current state of target flag
   * @param {Array<object>} params.features Full list of available features with their current states
   * @param {Array<object>} params.rawDependencies All extracted edges (Signals 1, 2, 3)
   * @param {number} [params.maxDepth=6] Maximum traversal hops
   * @returns {object} Comprehensive blast radius report
   */
  static compute({
    targetFlag,
    currentEnabled = true,
    features = [],
    rawDependencies = [],
    maxDepth = 6,
  }) {
    const hrtStart = process.hrtime.bigint();
    const featureMap = new Map(features.map(f => [f.name, f]));
    const targetMeta = featureMap.get(targetFlag) || {
      name: targetFlag,
      enabled: currentEnabled,
      description: '',
      tags: [],
    };

    const edgeMap = this.aggregateSignals(rawDependencies);

    // Build adjacency graphs
    // forwardAdj: source -> [{ target, probability, signals }] (source depends on target OR source guards target)
    // reverseAdj: target -> [{ source, probability, signals }] (who depends on target)
    const forwardAdj = new Map();
    const reverseAdj = new Map();

    for (const edge of edgeMap.values()) {
      if (!forwardAdj.has(edge.sourceFlag)) forwardAdj.set(edge.sourceFlag, []);
      forwardAdj.get(edge.sourceFlag).push({
        target: edge.targetFlag,
        probability: edge.probability,
        signals: edge.signals,
        relationship: edge.relationship,
      });

      if (!reverseAdj.has(edge.targetFlag)) reverseAdj.set(edge.targetFlag, []);
      reverseAdj.get(edge.targetFlag).push({
        source: edge.sourceFlag,
        probability: edge.probability,
        signals: edge.signals,
        relationship: edge.relationship,
      });
    }

    // 1. Traverse Downstream Dependents (Who will break or be impacted if targetFlag changes)
    // In our convention: if A DEPENDS_ON targetFlag, or targetFlag GUARDS B,
    // toggling targetFlag impacts A and B.
    const downstream = [];
    const visitedDownstream = new Map(); // name -> max probability

    const traverseDownstream = (current, currentProb, depth) => {
      if (depth > maxDepth) return;

      // Check features that declare dependency on current
      const incoming = reverseAdj.get(current) || [];
      for (const edge of incoming) {
        const dependentName = edge.source;
        const pathProb = parseFloat((currentProb * edge.probability).toFixed(3));

        if (!visitedDownstream.has(dependentName) || visitedDownstream.get(dependentName) < pathProb) {
          visitedDownstream.set(dependentName, pathProb);
          const feat = featureMap.get(dependentName);

          downstream.push({
            name: dependentName,
            enabled: feat ? Boolean(feat.enabled) : true,
            depth,
            pathProbability: pathProb,
            signals: edge.signals,
            relationship: edge.relationship,
          });

          traverseDownstream(dependentName, pathProb, depth + 1);
        }
      }
    };

    traverseDownstream(targetFlag, 1.0, 1);

    // 2. Traverse Upstream Prerequisites (What must be enabled for targetFlag to function)
    const upstream = [];
    const visitedUpstream = new Set();

    const traverseUpstream = (current, depth) => {
      if (depth > maxDepth) return;

      const outgoing = forwardAdj.get(current) || [];
      for (const edge of outgoing) {
        const prereqName = edge.target;
        if (!visitedUpstream.has(prereqName)) {
          visitedUpstream.add(prereqName);
          const feat = featureMap.get(prereqName);

          upstream.push({
            name: prereqName,
            enabled: feat ? Boolean(feat.enabled) : false,
            depth,
            signals: edge.signals,
            relationship: edge.relationship,
            missingPrerequisite: feat ? !feat.enabled : true,
          });

          traverseUpstream(prereqName, depth + 1);
        }
      }
    };

    traverseUpstream(targetFlag, 1);

    // 3. Compute Quantitative Impact Score & Risk Tier
    const activeDownstream = downstream.filter(d => d.enabled);
    const downstreamScore = activeDownstream.reduce((acc, d) => acc + d.pathProbability, 0);

    let riskTier = 'LOW';
    if (downstreamScore >= 4.0 || activeDownstream.length >= 5) {
      riskTier = 'CRITICAL';
    } else if (downstreamScore >= 2.0 || activeDownstream.length >= 2) {
      riskTier = 'HIGH';
    } else if (downstreamScore >= 0.8 || activeDownstream.length >= 1) {
      riskTier = 'MODERATE';
    }

    // 4. Governance Verdicts:
    // Safe to Disable: Unsafe if any active downstream dependent exists with probability >= 0.50
    const breakingDependents = activeDownstream.filter(d => d.pathProbability >= 0.50);
    const safeToDisable = breakingDependents.length === 0;

    // Safe to Enable: Unsafe if any upstream prerequisite is currently DISABLED
    const missingPrereqs = upstream.filter(u => u.missingPrerequisite);
    const safeToEnable = missingPrereqs.length === 0;

    const elapsedNs = process.hrtime.bigint() - hrtStart;
    const latencyMs = parseFloat((Number(elapsedNs) / 1_000_000).toFixed(2));

    return {
      flag_name: targetFlag,
      current_enabled: Boolean(targetMeta.enabled),
      description: targetMeta.description || '',
      tags: targetMeta.tags || [],
      risk_tier: riskTier,
      downstream_impact_score: parseFloat(downstreamScore.toFixed(2)),
      total_downstream_count: downstream.length,
      active_downstream_count: activeDownstream.length,
      breaking_dependents: breakingDependents,
      downstream_dependents: downstream,
      upstream_prerequisites: upstream,
      missing_prerequisites: missingPrereqs,
      verdict: {
        safe_to_disable: safeToDisable,
        safe_to_enable: safeToEnable,
        disable_warning: safeToDisable
          ? 'Safe to disable without breaking downstream active features.'
          : `Disabling will break ${breakingDependents.length} active downstream feature(s): ${breakingDependents.map(d => d.name).join(', ')}.`,
        enable_warning: safeToEnable
          ? 'All upstream prerequisites satisfied.'
          : `Prerequisite violation: must enable [${missingPrereqs.map(p => p.name).join(', ')}] first.`,
      },
      latency_ms: latencyMs,
    };
  }
}
