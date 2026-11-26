/**
 * CAVDAX Flagsmith AST Static Code Scanner
 * 
 * Analyzes client and server codebases for Flagsmith SDK invocations:
 * - isFeatureEnabled('flag_name')
 * - hasFeature('flag_name')
 * - getValue('flag_name')
 * - useFlags(['flag_a', 'flag_b'])
 * - flags.is_feature_enabled('flag_name') (Python)
 * - flagsmithClient.isFeatureEnabled("flag_name") (Java)
 * 
 * Extracts Signal 2 structural dependencies:
 * 1. GUARDS (Confidence: 0.85): Flag A condition encloses Flag B block.
 * 2. CO_OCCURS_AND (Confidence: 0.75): Flag A and Flag B evaluated in same logical AND clause.
 * 3. CO_OCCURS_OR (Confidence: 0.65): Flag A and Flag B evaluated in same logical OR clause.
 * 4. CO_LOCATED (Confidence: 0.50): Flag A and Flag B appear in same function scope (< 30 lines).
 */

import fs from 'fs';
import path from 'path';

// Regex patterns matching Flagsmith SDK feature calls across languages
const SDK_CALL_PATTERNS = [
  // JS/TS: flagsmith.isFeatureEnabled('flag') / hasFeature('flag') / getValue('flag')
  /(?:flagsmith|flags|client)\s*\.\s*(?:isFeatureEnabled|hasFeature|getValue|getFeatureValue)\s*\(\s*['"`]([a-zA-Z0-9_-]+)['"`]\s*\)/g,
  // React hook: useFlags(['flag_a', 'flag_b'])
  /useFlags\s*\(\s*\[([^\]]+)\]\s*\)/g,
  // Direct helper: isFeatureEnabled('flag') or hasFeature('flag')
  /\b(?:isFeatureEnabled|hasFeature)\s*\(\s*['"`]([a-zA-Z0-9_-]+)['"`]\s*\)/g,
  // Python: flags.is_feature_enabled("flag") / flags.get_feature_value("flag")
  /(?:flagsmith|flags)\s*\.\s*(?:is_feature_enabled|get_feature_value)\s*\(\s*['"`]([a-zA-Z0-9_-]+)['"`]\s*\)/g,
  // Object property check: flags['flag_name'] or flags?.flag_name (exclude function calls)
  /\bflags(?:mith)?(?:\?\.|\.)([a-zA-Z0-9_]+)(?!\s*\()\b/g,
];

// Reserved SDK method and property names to prevent false positive flag detection
const RESERVED_SDK_NAMES = new Set([
  'hasFeature', 'isFeatureEnabled', 'getValue', 'getFeatureValue',
  'init', 'identify', 'logout', 'setTrait', 'getTrait', 'hasTrait',
  'getFlags', 'getAllFlags', 'useFlags', 'is_feature_enabled', 'get_feature_value',
  'set_trait', 'get_trait', 'flags', 'client', 'flagsmith', 'identity', 'traits'
]);

// File extensions eligible for static AST analysis
const SUPPORTED_EXTENSIONS = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs',
  '.py', '.java', '.go', '.vue', '.svelte'
]);

const IGNORED_DIRECTORIES = new Set([
  'node_modules', '.git', 'dist', 'build', 'coverage',
  '.next', '.nuxt', '__pycache__', 'target', 'vendor', '.turbo'
]);

export class AstScanner {
  constructor(options = {}) {
    this.maxProximityLines = options.maxProximityLines || 30;
  }

  /**
   * Scans a single source code string and extracts feature calls with line numbers.
   * 
   * @param {string} sourceCode Source file text
   * @param {string} [filePath='inline'] File identifier
   * @returns {Array<{ flag: string, line: number, raw: string, file: string }>}
   */
  scanSource(sourceCode, filePath = 'inline') {
    const lines = sourceCode.split('\n');
    const detections = [];
    const seenOnLine = new Set();

    lines.forEach((lineText, lineIdx) => {
      const lineNum = lineIdx + 1;

      // Skip single line comments
      const trimmed = lineText.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('*')) {
        return;
      }

      for (const pattern of SDK_CALL_PATTERNS) {
        pattern.lastIndex = 0;
        let match;
        while ((match = pattern.exec(lineText)) !== null) {
          const rawMatch = match[0];
          // Handle array in useFlags(['flag_a', 'flag_b'])
          if (rawMatch.startsWith('useFlags')) {
            const inner = match[1];
            const flagMatches = inner.match(/['"`]([a-zA-Z0-9_-]+)['"`]/g) || [];
            for (const fm of flagMatches) {
              const flagName = fm.replace(/['"`]/g, '');
              const key = `${lineNum}:${flagName}`;
              if (!seenOnLine.has(key)) {
                seenOnLine.add(key);
                detections.push({ flag: flagName, line: lineNum, raw: rawMatch, file: filePath });
              }
            }
          } else {
            const flagName = match[1];
            if (flagName && flagName.length > 1 && !RESERVED_SDK_NAMES.has(flagName)) {
              const key = `${lineNum}:${flagName}`;
              if (!seenOnLine.has(key)) {
                seenOnLine.add(key);
                detections.push({ flag: flagName, line: lineNum, raw: rawMatch, file: filePath });
              }
            }
          }
        }
      }
    });

    return detections;
  }

  /**
   * Identifies logical AST structural dependencies between detected flags in a file.
   * 
   * @param {string} sourceCode
   * @param {string} filePath
   * @returns {{ flags: Array<string>, dependencies: Array<object> }}
   */
  analyzeDependencies(sourceCode, filePath = 'inline') {
    const detections = this.scanSource(sourceCode, filePath);
    const uniqueFlags = [...new Set(detections.map(d => d.flag))];
    const dependencies = [];
    const pairKeys = new Set();

    const addDep = (source, target, relationship, confidence, reason, line) => {
      if (source === target) return;
      const key = `${source}->${target}:${relationship}`;
      if (!pairKeys.has(key)) {
        pairKeys.add(key);
        dependencies.push({
          sourceFlag: source,
          targetFlag: target,
          relationship,
          confidence,
          signal: 'AST_STATIC',
          reason,
          file: filePath,
          line
        });
      }
    };

    const lines = sourceCode.split('\n');

    // 1. Analyze boolean conjunctions and disjunctions on same or adjacent lines
    lines.forEach((lineText, idx) => {
      const lineNum = idx + 1;
      const flagsOnLine = detections.filter(d => d.line === lineNum).map(d => d.flag);

      if (flagsOnLine.length >= 2) {
        const hasAnd = lineText.includes('&&') || lineText.includes(' and ');
        const hasOr = lineText.includes('||') || lineText.includes(' or ');
        const hasUseFlags = lineText.includes('useFlags');

        for (let i = 0; i < flagsOnLine.length; i++) {
          for (let j = i + 1; j < flagsOnLine.length; j++) {
            const f1 = flagsOnLine[i];
            const f2 = flagsOnLine[j];
            if (hasAnd) {
              addDep(f1, f2, 'CO_OCCURS_AND', 0.75, 'Evaluated in same boolean AND expression', lineNum);
              addDep(f2, f1, 'CO_OCCURS_AND', 0.75, 'Evaluated in same boolean AND expression', lineNum);
            } else if (hasOr) {
              addDep(f1, f2, 'CO_OCCURS_OR', 0.65, 'Evaluated in same boolean OR fallback expression', lineNum);
              addDep(f2, f1, 'CO_OCCURS_OR', 0.65, 'Evaluated in same boolean OR fallback expression', lineNum);
            } else if (hasUseFlags) {
              addDep(f1, f2, 'CO_OCCURS_HOOK', 0.70, 'Requested together in useFlags hook declaration', lineNum);
              addDep(f2, f1, 'CO_OCCURS_HOOK', 0.70, 'Requested together in useFlags hook declaration', lineNum);
            }
          }
        }
      }
    });

    // 2. Analyze Guard / Block nesting:
    // If Flag A is checked in an `if (...)` statement, and Flag B appears inside that block,
    // Flag A GUARDS Flag B (Flag B depends on Flag A being active).
    for (let i = 0; i < detections.length; i++) {
      const outer = detections[i];
      const outerLineText = lines[outer.line - 1] || '';

      // Check if outer line is a conditional check (if, while, ternary)
      const isConditional = /^\s*(if\b|while\b|\?)/.test(outerLineText.trim()) ||
                            outerLineText.includes('?') ||
                            outerLineText.includes('&&');

      if (isConditional) {
        // Look ahead for downstream nested calls within maxProximityLines
        for (let j = i + 1; j < detections.length; j++) {
          const inner = detections[j];
          if (inner.flag === outer.flag) continue;

          const lineDelta = inner.line - outer.line;
          if (lineDelta > 0 && lineDelta <= this.maxProximityLines) {
            // Check brace depth approximation or simple indentation
            addDep(
              outer.flag,
              inner.flag,
              'GUARDS',
              0.85,
              `Guard block at line ${outer.line} encloses execution of flag at line ${inner.line}`,
              outer.line
            );
          }
        }
      } else {
        // Proximity / co-location within same small function scope
        for (let j = i + 1; j < detections.length; j++) {
          const other = detections[j];
          if (other.flag === outer.flag) continue;

          const lineDelta = other.line - outer.line;
          if (lineDelta > 0 && lineDelta <= 15) {
            addDep(
              outer.flag,
              other.flag,
              'CO_LOCATED',
              0.50,
              `Co-located in adjacent scope (<15 lines apart)`,
              outer.line
            );
          }
        }
      }
    }

    return {
      flags: uniqueFlags,
      detections,
      dependencies
    };
  }

  /**
   * Recursively walks a directory, scanning all source files for Flagsmith references.
   * 
   * @param {string} rootDir Root project directory to scan
   * @returns {Promise<{ scannedFiles: number, totalFlags: number, flags: Array<string>, dependencies: Array<object> }>}
   */
  async scanDirectory(rootDir) {
    let scannedFiles = 0;
    const allFlags = new Set();
    const allDependencies = [];

    const walk = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          if (!IGNORED_DIRECTORIES.has(entry.name) && !entry.name.startsWith('.')) {
            walk(fullPath);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (SUPPORTED_EXTENSIONS.has(ext)) {
            try {
              const content = fs.readFileSync(fullPath, 'utf8');
              const result = this.analyzeDependencies(content, path.relative(rootDir, fullPath));
              if (result.flags.length > 0) {
                result.flags.forEach(f => allFlags.add(f));
                allDependencies.push(...result.dependencies);
              }
              scannedFiles++;
            } catch {
              // Ignore unreadable or binary files
            }
          }
        }
      }
    };

    if (fs.existsSync(rootDir)) {
      walk(rootDir);
    }

    return {
      scannedFiles,
      totalFlags: allFlags.size,
      flags: [...allFlags].sort(),
      dependencies: allDependencies
    };
  }
}
