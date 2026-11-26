/**
 * CAVDAX Flagsmith Ingestion Client
 * Synchronizes feature flags and tags from self-hosted or cloud Flagsmith REST API,
 * extracting dependency signals and writing topological nodes and edges into FalkorDB.
 */

/**
 * Signal 1 Regex Patterns:
 * Flagsmith tags follow the convention:
 *   depends:flag_name
 *   requires:flag_name
 *   enables:flag_name
 *   blocks:flag_name
 */
const TAG_DEP_REGEX = /^(depends|requires|enables|blocks):([a-zA-Z0-9_-]+)$/i;

export class FlagsmithClient {
  /**
   * @param {object} config
   * @param {string} [config.apiUrl] Base URL for Flagsmith API (e.g. http://localhost:8000/api/v1)
   * @param {string} [config.environmentKey] Client-side / SDK environment key
   * @param {string} [config.managementKey] Management / Admin API token
   * @param {string|number} [config.projectId] Flagsmith Project ID
   */
  constructor(config = {}) {
    this.apiUrl = (config.apiUrl || process.env.FLAGSMITH_API_URL || 'http://localhost:8000/api/v1').replace(/\/+$/, '');
    this.environmentKey = config.environmentKey || process.env.FLAGSMITH_ENVIRONMENT_KEY || '';
    this.managementKey = config.managementKey || process.env.FLAGSMITH_MANAGEMENT_API_KEY || '';
    this.projectId = config.projectId || process.env.FLAGSMITH_PROJECT_ID || '';
  }

  /**
   * Evaluates whether credentials are configured for live sync.
   */
  isConfigured() {
    return Boolean(this.apiUrl && (this.managementKey || this.environmentKey));
  }

  /**
   * Fetches features from Flagsmith REST API.
   * If management key is available, queries the Project features endpoint (richer metadata + tags).
   * Otherwise falls back to environment flags endpoint.
   *
   * @returns {Promise<Array<object>>} Raw feature objects
   */
  async fetchFeatures() {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    let url;
    if (this.managementKey && this.projectId) {
      headers['Authorization'] = `Bearer ${this.managementKey}`;
      url = `${this.apiUrl}/projects/${this.projectId}/features/`;
    } else if (this.environmentKey) {
      headers['X-Environment-Key'] = this.environmentKey;
      url = `${this.apiUrl}/flags/`;
    } else {
      throw new Error('[FlagsmithClient] Neither FLAGSMITH_MANAGEMENT_API_KEY nor FLAGSMITH_ENVIRONMENT_KEY is set.');
    }

    const response = await fetch(url, { headers });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`[FlagsmithClient] Failed to fetch flags from ${url}: HTTP ${response.status} - ${errText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : (data.results || []);
  }

  /**
   * Parses feature tags to discover Signal 1 dependencies.
   * 
   * @param {Array<object>} features
   * @returns {{ parsedFeatures: Array<object>, dependencies: Array<object> }}
   */
  extractDependencies(features) {
    const parsedFeatures = [];
    const dependencies = [];

    for (const feat of features) {
      const name = feat.name || feat.feature?.name;
      if (!name) continue;

      const id = String(feat.id || feat.feature?.id || name);
      const enabled = feat.enabled !== undefined ? Boolean(feat.enabled) : Boolean(feat.default_enabled);
      const value = feat.initial_value !== undefined ? String(feat.initial_value) : (feat.feature_state_value ? String(feat.feature_state_value) : null);
      const description = feat.description || feat.feature?.description || '';
      const tags = (feat.tags || []).map(t => (typeof t === 'string' ? t : (t.label || t.name || '')));

      parsedFeatures.push({
        id,
        name,
        enabled,
        value,
        description,
        tags,
      });

      // Signal 1: Tag-declared dependencies
      for (const tag of tags) {
        const match = tag.match(TAG_DEP_REGEX);
        if (match) {
          const rawRel = match[1].toLowerCase();
          const targetFlag = match[2];

          let relationship = 'DEPENDS_ON';
          if (rawRel === 'enables') relationship = 'ENABLES';
          if (rawRel === 'blocks') relationship = 'BLOCKS';

          dependencies.push({
            sourceFlag: name,
            targetFlag,
            relationship,
            confidence: 1.0,
            signal: 'TAG',
            rawTag: tag,
          });
        }
      }
    }

    return { parsedFeatures, dependencies };
  }

  /**
   * Ingests parsed Flagsmith features and dependencies into FalkorDB.
   *
   * @param {object} graph FalkorDB graph instance
   * @param {object} options
   * @returns {Promise<{ featuresIngested: number, dependenciesIngested: number, latencyMs: number }>}
   */
  async syncToGraph(graph, options = {}) {
    const hrtStart = process.hrtime.bigint();
    let rawFeatures = [];

    if (options.features) {
      rawFeatures = options.features;
    } else {
      rawFeatures = await this.fetchFeatures();
    }

    const { parsedFeatures, dependencies } = this.extractDependencies(rawFeatures);

    // Upsert Features as (:FlagsmithFeature) nodes
    for (const f of parsedFeatures) {
      const query = `
        MERGE (f:FlagsmithFeature {name: $name})
        SET f.id = $id,
            f.enabled = $enabled,
            f.value = $value,
            f.description = $description,
            f.tags = $tags,
            f.updatedAt = timestamp()
        RETURN f.name AS name
      `;
      await graph.query(query, {
        params: {
          name: f.name,
          id: f.id,
          enabled: f.enabled,
          value: f.value ?? '',
          description: f.description ?? '',
          tags: JSON.stringify(f.tags),
        },
      });
    }

    // Upsert Dependencies as graph relationships
    for (const dep of dependencies) {
      let relType = 'DEPENDS_ON';
      if (dep.relationship === 'ENABLES') {
        relType = 'ENABLES';
      } else if (dep.relationship === 'BLOCKS') {
        relType = 'BLOCKS';
      }

      const depQuery = `
        MERGE (s:FlagsmithFeature {name: $sourceFlag})
        MERGE (t:FlagsmithFeature {name: $targetFlag})
        MERGE (s)-[r:${relType} {confidence: $confidence, signal: $signal, rawTag: $rawTag}]->(t)
        RETURN s.name, t.name
      `;

      await graph.query(depQuery, {
        params: {
          sourceFlag: dep.sourceFlag,
          targetFlag: dep.targetFlag,
          confidence: dep.confidence,
          signal: dep.signal,
          rawTag: dep.rawTag || '',
        },
      });
    }

    const elapsedNs = process.hrtime.bigint() - hrtStart;
    const latencyMs = parseFloat((Number(elapsedNs) / 1_000_000).toFixed(2));

    return {
      featuresIngested: parsedFeatures.length,
      dependenciesIngested: dependencies.length,
      latencyMs,
    };
  }
}
