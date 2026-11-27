import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  Check,
  RefreshCw,
  Zap,
  ArrowRight,
  AlertTriangle,
  GitBranch,
  Layers,
  Code2,
  GitCommit,
  Play,
  FileCode2,
  ChevronDown,
  SlidersHorizontal,
  Plus
} from 'lucide-react';
import Tooltip from './Tooltip';
import { playClick, playAlert, playApprovalChime, playRejectBuzz } from '../utils/soundFx';

/**
 * FlagBlastRadiusCard — Monochromatic Obsidian Interactive Flagsmith Blast Radius Console.
 *
 * Implements Track 03: Build on Open Source Flagsmith (Toggle Wars Hackathon).
 * Features:
 * - Real-time FalkorDB GraphBLAS multi-hop blast radius visualization.
 * - 3-Signal Dependency Breakdown: Signal 1 (Tags), Signal 2 (AST Static Calls), Signal 3 (Git Coupling).
 * - Bi-directional Safe Toggle Protection: prevents breaking downstream features and validates upstream prerequisites.
 * - Monochromatic Obsidian aesthetic with strict zero-emoji discipline.
 */
const JUNK_FLAG_NAMES = new Set([
  'forEach', 'length', 'includes', 'sort', 'getValue', 'hasFeature', 'isFeatureEnabled',
  'getFeatureValue', 'map', 'filter', 'slice', 'push', 'pop', 'shift', 'unshift',
  'keys', 'values', 'entries', 'toString', 'toLocaleString', 'valueOf', 'apply', 'bind',
  'call', 'reduce', 'reduceRight', 'find', 'findIndex', 'findLast', 'findLastIndex',
  'some', 'every', 'concat', 'join', 'flat', 'flatMap', 'fill', 'copyWithin',
  'status', 'state', 'data', 'result', 'error', 'name', 'type', 'id', 'count', 'items',
  'enabled', 'disabled', 'value', 'options', 'config', 'append', 'extend', 'insert', 'remove', 'clear'
]);

function RadarIcon({ className = 'w-5 h-5', size = 20 }) {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className={className}>
      <path d='M19.07 4.93A10 10 0 0 0 6.99 3.34' />
      <path d='M4 6h.01' />
      <path d='M2.29 9.62A10 10 0 1 0 21.31 8.35' />
      <path d='M16.24 7.76A6 6 0 1 0 8.23 16.67' />
      <circle cx='12' cy='12' r='2' />
      <path d='m13.41 10.59 5.66-5.66' />
    </svg>
  );
}

export default function FlagBlastRadiusCard({
  isDarkTheme = true,
  onSelectFlag,
  connectedRepos = [],
  activeWorkspace = 'demo',
  selectedConnectedRepo = null,
  onSelectWorkspace,
  onConnectRepo,
  githubUser = null,
}) {
  const [features, setFeatures] = useState([]);
  const [selectedFlagName, setSelectedFlagName] = useState('dark_mode');
  const [blastRadius, setBlastRadius] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [togglePending, setTogglePending] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isWsDropdownOpen, setIsWsDropdownOpen] = useState(false);

  // Custom Sliding Pillbar state (Container-Relative, Immune to Flying Bugs)
  const tabRefs = useRef({});
  const [pillPosition, setPillPosition] = useState({ x: 0, width: 0, ready: false, visible: false });

  useLayoutEffect(() => {
    const updatePill = () => {
      const activeEl = tabRefs.current[selectedFlagName];
      if (activeEl) {
        setPillPosition({
          x: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
          ready: true,
          visible: true,
        });
      } else {
        setPillPosition(prev => ({ ...prev, visible: false }));
      }
    };
    updatePill();
    const rafId = requestAnimationFrame(updatePill);
    window.addEventListener('resize', updatePill);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updatePill);
    };
  }, [selectedFlagName, features]);

  useEffect(() => {
    if (!isWsDropdownOpen) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest('#flag-radar-ws-selector')) {
        setIsWsDropdownOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isWsDropdownOpen]);

  // AST Live Code Inspector State (Signal 2 Static Inspector)
  const [activeTab, setActiveTab] = useState('radar'); // 'radar' | 'ast'
  const [astCode, setAstCode] = useState(`function processCheckout(order) {
  if (flagsmith.hasFeature('checkout_flow')) {
    // Nested guard: payment_v2 execution depends on checkout_flow
    if (flagsmith.hasFeature('payment_v2')) {
      dispatchPaymentGateway(order);
    }
  }
}`);
  const [astResult, setAstResult] = useState(null);
  const [isScanningAst, setIsScanningAst] = useState(false);
  const [astError, setAstError] = useState(null);

  const AST_PRESETS = [
    {
      id: 'nested',
      label: 'Nested Guards',
      code: `function handleCheckout() {
  if (flagsmith.hasFeature('checkout_flow')) {
    // Nested guard: payment_v2 depends on checkout_flow
    if (flagsmith.hasFeature('payment_v2')) {
      executeStripePayment();
    }
  }
}`
    },
    {
      id: 'conjunction',
      label: 'Boolean Conjunction',
      code: `function configureTheme() {
  // Boolean conjunction: both flags required in single predicate
  if (flagsmith.hasFeature('dark_mode') && flagsmith.hasFeature('high_contrast')) {
    applyA11yDarkTheme();
  }
}`
    },
    {
      id: 'hook',
      label: 'React Hook useFlags',
      code: `import { useFlags } from 'flagsmith/react';

export function AnalyticsDashboard() {
  // Co-located declarations in React hook
  const { analytics_v2, beta_user } = useFlags(['analytics_v2', 'beta_user']);
  return <Dashboard metrics={analytics_v2} experimental={beta_user} />;
}`
    }
  ];

  const handleScanAst = async () => {
    playClick();
    setIsScanningAst(true);
    setAstError(null);
    try {
      const res = await fetch('/api/flagsmith/scan-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: astCode, filePath: 'InspectorSnippet.js' })
      });
      const data = await res.json();
      if (data.success) {
        playApprovalChime();
        setAstResult(data);
      } else {
        playRejectBuzz();
        setAstError(data.error || 'Failed to analyze code AST');
      }
    } catch (err) {
      playRejectBuzz();
      setAstError(err.message);
    } finally {
      setIsScanningAst(false);
    }
  };

  // Fetch all features from Flagsmith & FalkorDB
  const fetchFeatures = useCallback(async () => {
    try {
      const repoParam = selectedConnectedRepo?.full_name ? `?repo=${encodeURIComponent(selectedConnectedRepo.full_name)}` : '';
      const res = await fetch(`/api/flagsmith/features${repoParam}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.features)) {
        const valid = data.features.filter(f => !JUNK_FLAG_NAMES.has(f.name));
        setFeatures(valid);
        if (data.features.length > 0 && (!selectedFlagName || !valid.some(v => v.name === selectedFlagName))) {
          setSelectedFlagName(data.features[0].name);
        }
      }
    } catch (err) {
      console.error('[FlagBlastRadius] Failed to fetch features:', err);
    }
  }, [selectedFlagName, selectedConnectedRepo]);

  // Fetch blast radius for the selected flag
  const fetchBlastRadius = useCallback(async (flagName) => {
    if (!flagName) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/flagsmith/blast-radius/${encodeURIComponent(flagName)}`);
      const data = await res.json();
      if (data.success) {
        setBlastRadius(data);
      }
    } catch (err) {
      console.error('[FlagBlastRadius] Failed to fetch blast radius:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  useEffect(() => {
    if (selectedFlagName) {
      fetchBlastRadius(selectedFlagName);
    }
  }, [selectedFlagName, fetchBlastRadius]);

  // Trigger full 3-signal re-sync
  const handleSyncAllSignals = async () => {
    playClick();
    setIsSyncing(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/flagsmith/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        playApprovalChime();
        setSuccessMessage(`Synchronized: ${data.totalDependenciesIngested || data.dependenciesIngested || 0} dependency edges indexed into FalkorDB.`);
        await fetchFeatures();
        if (selectedFlagName) await fetchBlastRadius(selectedFlagName);
      } else {
        playRejectBuzz();
        setErrorMessage(data.error || 'Failed to sync');
      }
    } catch (err) {
      playRejectBuzz();
      setErrorMessage(err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  // Safe Toggle handler with bi-directional safety checks
  const handleSafeToggle = async (force = false) => {
    if (!blastRadius) return;
    playClick();
    setTogglePending(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const nextState = !blastRadius.enabled;

    try {
      const res = await fetch('/api/flagsmith/safe-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flagName: selectedFlagName,
          enabled: nextState,
          force
        })
      });

      const data = await res.json();

      if (res.status === 409) {
        playAlert();
        setErrorMessage(data.message);
      } else if (data.success) {
        playApprovalChime();
        setSuccessMessage(`Flag '${selectedFlagName}' toggled ${nextState ? 'ON' : 'OFF'} successfully.`);
        await fetchFeatures();
        await fetchBlastRadius(selectedFlagName);
      } else {
        playRejectBuzz();
        setErrorMessage(data.error || 'Toggle failed');
      }
    } catch (err) {
      playRejectBuzz();
      setErrorMessage(err.message);
    } finally {
      setTogglePending(false);
    }
  };

  const selectedFeature = features.find(f => f.name === selectedFlagName);

  // Deduplicate and prioritize upstream prerequisites and downstream dependents
  const uniqueDownstream = React.useMemo(() => {
    if (!blastRadius?.downstream_dependents) return [];
    const map = new Map();
    for (const dep of blastRadius.downstream_dependents) {
      if (!map.has(dep.name) || (dep.depth && map.get(dep.name).depth > dep.depth)) {
        map.set(dep.name, dep);
      }
    }
    return Array.from(map.values()).filter(d => !JUNK_FLAG_NAMES.has(d.name)).sort((a, b) => (a.depth || 1) - (b.depth || 1) || a.name.localeCompare(b.name));
  }, [blastRadius?.downstream_dependents]);

  const uniqueUpstream = React.useMemo(() => {
    if (!blastRadius?.upstream_prerequisites) return [];
    const map = new Map();
    for (const pre of blastRadius.upstream_prerequisites) {
      if (!map.has(pre.name)) {
        map.set(pre.name, { ...pre });
      } else {
        const existing = map.get(pre.name);
        // If any path is disabled, constraint is unsatisfied/missing
        if (!pre.enabled) existing.enabled = false;
        if (pre.depth && existing.depth && pre.depth < existing.depth) existing.depth = pre.depth;
      }
    }
    return Array.from(map.values()).filter(d => !JUNK_FLAG_NAMES.has(d.name)).sort((a, b) => (a.depth || 1) - (b.depth || 1) || a.name.localeCompare(b.name));
  }, [blastRadius?.upstream_prerequisites]);

  // Compute Risk Tier styling with strict high-contrast dark & light mode parity
  const riskColor = blastRadius?.risk_tier === 'CRITICAL'
    ? 'text-rose-800 dark:text-rose-400 bg-rose-100/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/40'
    : blastRadius?.risk_tier === 'HIGH'
    ? 'text-amber-800 dark:text-amber-400 bg-amber-100/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/40'
    : blastRadius?.risk_tier === 'MODERATE'
    ? 'text-yellow-800 dark:text-yellow-400 bg-yellow-100/90 dark:bg-yellow-950/40 border-yellow-300 dark:border-yellow-500/40'
    : 'text-emerald-800 dark:text-emerald-400 bg-emerald-100/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/40';

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B0D11] text-slate-900 dark:text-white shadow-xl transition-all">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <RadarIcon size={20} className="w-5 h-5 text-slate-900 dark:text-white shrink-0" />
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">Flagsmith Blast Radius Radar</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
                Real-time GraphBLAS topological dependency traversal across 3 signals.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & Tab Switcher (Unified single-line row, immune to wrapping) */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
          {/* Target Workspace / Repository Switcher */}
          <div id="flag-radar-ws-selector" className="relative">
            <button
              onClick={() => {
                playClick();
                setIsWsDropdownOpen(prev => !prev);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono border border-slate-300/80 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer select-none"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
              <span className="font-semibold truncate max-w-[130px] sm:max-w-[190px]">
                {selectedConnectedRepo ? (selectedConnectedRepo.full_name || selectedConnectedRepo.name) : 'Demo: Flagsmith Sandbox'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isWsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isWsDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -4 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 top-full mt-1.5 w-72 rounded-xl bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/15 shadow-2xl p-1.5 z-50 font-mono text-xs"
                >
                  <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-white/10 mb-1">
                    Select Target Repository
                  </div>

                  <button
                    onClick={() => {
                      playClick();
                      if (onSelectWorkspace) onSelectWorkspace('demo', null);
                      setIsWsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all cursor-pointer ${
                      activeWorkspace === 'demo' && !selectedConnectedRepo
                        ? 'bg-slate-100 dark:bg-white/10 text-slate-950 dark:text-white font-bold border border-slate-300 dark:border-white/20'
                        : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300 shrink-0" />
                      <div className="truncate">
                        <div className="text-xs truncate">Demo: Flagsmith Sandbox</div>
                        <div className="text-[10px] font-normal text-slate-500 dark:text-slate-400">Canonical 3-Signal Mesh</div>
                      </div>
                    </div>
                    {activeWorkspace === 'demo' && !selectedConnectedRepo && <Check className="w-3.5 h-3.5 text-slate-950 dark:text-white shrink-0 ml-2" />}
                  </button>

                  {connectedRepos && connectedRepos.length > 0 && (
                    <div className="my-1 border-t border-slate-100 dark:border-white/10 pt-1">
                      <div className="px-2 py-1 text-[9px] uppercase tracking-wider text-slate-400">
                        Connected Repositories ({connectedRepos.length})
                      </div>
                      {connectedRepos.map((repo) => {
                        const isCurrent = String(activeWorkspace) === String(repo.id) || selectedConnectedRepo?.full_name?.toLowerCase() === repo.full_name?.toLowerCase();
                        return (
                          <button
                            key={repo.id}
                            onClick={() => {
                              playClick();
                              if (onSelectWorkspace) onSelectWorkspace(repo.id, repo);
                              setIsWsDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-slate-100 dark:bg-white/10 text-slate-950 dark:text-white font-bold border border-slate-300 dark:border-white/20'
                                : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <GitBranch className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300 shrink-0" />
                              <div className="truncate">
                                <div className="text-xs truncate">{repo.full_name || repo.name}</div>
                                <div className="text-[10px] font-normal text-slate-500 dark:text-slate-400">
                                  {repo.default_branch || 'main'}
                                </div>
                              </div>
                            </div>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-slate-950 dark:text-white shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {onConnectRepo && (
                    <div className="my-1 border-t border-slate-100 dark:border-white/10 pt-1">
                      <button
                        onClick={() => {
                          playClick();
                          setIsWsDropdownOpen(false);
                          onConnectRepo();
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-xs">Connect Another Repository</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tab Switcher: Radar vs AST */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium">
            <button
              onClick={() => { playClick(); setActiveTab('radar'); }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === 'radar'
                  ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white font-semibold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <RadarIcon size={13} className="w-3.5 h-3.5 text-current" />
              <span>Topology Radar</span>
            </button>
            <button
              onClick={() => { playClick(); setActiveTab('ast'); }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === 'ast'
                  ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white font-bold shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>AST Inspector</span>
            </button>
          </div>

          <Tooltip content="Re-mine AST, Git coupling, and Flagsmith tags">
            <button
              onClick={handleSyncAllSignals}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Mesh'}</span>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Tab 1: Topology Blast Radar */}
      {activeTab === 'radar' && (
        <>
          {/* Feature Selector Sliding Pillbar */}
          <div className="py-4">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
              Select Feature Flag
            </label>
            <div className="relative inline-flex items-center p-1 rounded-xl bg-slate-200/60 dark:bg-white/[0.06] border border-slate-300/80 dark:border-white/10 backdrop-blur-md overflow-x-auto max-w-full scrollbar-none gap-1">
              {pillPosition.ready && pillPosition.visible && (
                <motion.div
                  className="absolute top-1 bottom-1 rounded-lg bg-slate-950 dark:bg-white shadow-xs pointer-events-none"
                  initial={false}
                  animate={{
                    x: pillPosition.x,
                    width: pillPosition.width,
                    opacity: 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 450,
                    damping: 35,
                  }}
                />
              )}
              {features.map((feat) => {
                const isSelected = feat.name === selectedFlagName;
                return (
                  <button
                    key={feat.name}
                    ref={(el) => {
                      if (el) tabRefs.current[feat.name] = el;
                    }}
                    onClick={() => {
                      playClick();
                      setSelectedFlagName(feat.name);
                    }}
                    className={`relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer select-none ${
                      isSelected
                        ? 'text-white dark:text-slate-950 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    <span>{feat.name}</span>
                    {feat.incoming_dependents > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold shrink-0 tracking-tight transition-colors ${
                        isSelected
                          ? 'bg-white/20 text-white dark:bg-slate-900/15 dark:text-slate-900'
                          : 'bg-slate-300/80 text-slate-700 dark:bg-white/10 dark:text-slate-300'
                      }`}>
                        {feat.incoming_dependents} DEP
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notification Banners */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Safety Invariant Blocked: </span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleSafeToggle(true)}
                  className="shrink-0 px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                >
                  Force Override
                </button>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2"
              >
                <Check className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Flag Telemetry Grid */}
          {blastRadius && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Column 1: Flag State & Safe Toggle */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-[#11141A] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                      Active State
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider border ${riskColor}`}>
                      {blastRadius.risk_tier} RISK
                    </span>
                  </div>

                  <div className="text-xl font-bold font-mono tracking-tight text-slate-900 dark:text-white mb-1">
                    {blastRadius.flag_name}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 text-balance mb-4">
                    {blastRadius.description || 'No description provided in Flagsmith.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {blastRadius.enabled ? 'Feature Enabled' : 'Feature Disabled'}
                    </span>
                    <button
                      onClick={() => handleSafeToggle(false)}
                      disabled={togglePending}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-semibold border border-slate-300 dark:border-white/15 bg-white dark:bg-white/[0.08] hover:bg-slate-100 dark:hover:bg-white/15 text-slate-800 dark:text-slate-100 transition-all cursor-pointer shadow-2xs hover:shadow-xs disabled:opacity-50"
                    >
                      <span>{blastRadius.enabled ? 'Turn Off' : 'Turn On'}</span>
                    </button>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-400">
                    FalkorDB Traversal: {blastRadius.latency_ms || 0.1} ms
                  </div>
                </div>
              </div>

              {/* Column 2: Downstream Dependents (Blast Radius) */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-[#11141A]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                    Downstream Impact ({uniqueDownstream.length})
                  </span>
                  <Tooltip content="Features that break or stop working if this flag is disabled">
                    <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                  </Tooltip>
                </div>

                {uniqueDownstream.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-48 overflow-y-auto pr-1">
                    {uniqueDownstream.map((dep, idx) => (
                      <div
                        key={`${dep.name}-${idx}`}
                        className="flex items-center justify-between py-2 text-xs"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-mono text-slate-900 dark:text-white font-medium truncate">{dep.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2 font-mono">
                          HOP {dep.depth || 1}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400">
                    <Check className="w-6 h-6 mx-auto mb-2 text-emerald-500 opacity-80" strokeWidth={2.5} />
                    <span>Zero downstream dependents. Safe to toggle without cascading breaking changes.</span>
                  </div>
                )}
              </div>

              {/* Column 3: Upstream Prerequisites */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-[#11141A]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                    Upstream Prerequisites ({uniqueUpstream.length})
                  </span>
                  <Tooltip content="Features required to be active before this flag can safely execute">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                  </Tooltip>
                </div>

                {uniqueUpstream.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-48 overflow-y-auto pr-1">
                    {uniqueUpstream.map((pre, idx) => (
                      <div
                        key={`${pre.name}-${idx}`}
                        className="flex items-center justify-between py-2 text-xs"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-mono text-slate-900 dark:text-white font-medium truncate">{pre.name}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold tracking-wider border shrink-0 ${
                          pre.enabled
                            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/30'
                            : 'text-amber-700 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/30'
                        }`}>
                          {pre.enabled ? 'SATISFIED' : 'MISSING'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400">
                    <Layers className="w-6 h-6 mx-auto mb-2 text-slate-400 opacity-60" />
                    <span>Zero upstream prerequisites. Standalone root feature.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Tab 2: AST Code Inspector (Signal 2 Static Analyzer) */}
      {activeTab === 'ast' && (
        <div className="py-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Static Code Presets (Signal 2)
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Load sample code to extract Flagsmith SDK calls and infer structural AST relationships.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {AST_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    playClick();
                    setAstCode(p.code);
                    setAstResult(null);
                  }}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Code Textarea */}
          <div className="relative rounded-xl border border-slate-200 dark:border-white/10 bg-[#07080A] text-slate-100 overflow-hidden shadow-inner">
            <div className="flex items-center justify-between px-3.5 py-2 bg-slate-950/80 border-b border-white/5 text-[11px] text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>snippet.js</span>
              </div>
              <span className="text-[10px] tracking-wide text-slate-400">AST Parser (Babel Core / Acorn)</span>
            </div>
            <textarea
              value={astCode}
              onChange={(e) => setAstCode(e.target.value)}
              rows={8}
              spellCheck={false}
              className="w-full p-3.5 bg-transparent font-mono text-xs text-emerald-400 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
              placeholder="// Paste source code containing Flagsmith SDK calls here..."
            />
            <div className="p-3 bg-slate-950/60 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                {astCode.split('\n').length} lines
              </span>
              <button
                onClick={handleScanAst}
                disabled={isScanningAst || !astCode.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <Play className={`w-3.5 h-3.5 ${isScanningAst ? 'animate-spin' : ''}`} />
                <span>{isScanningAst ? 'Parsing AST...' : 'Analyze Code AST'}</span>
              </button>
            </div>
          </div>

          {astError && (
            <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{astError}</span>
            </div>
          )}

          {/* AST Results View */}
          {astResult && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 pt-2"
            >
              {/* Detected Flags Summary */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Detected Feature Flags ({astResult.flags_count || 0})
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Live production status verified against FalkorDB
                  </span>
                </div>

                {astResult.flags && astResult.flags.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {astResult.flags.map((f) => (
                      <div
                        key={f.name}
                        className="p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-[#11141A] flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                              {f.name}
                            </span>
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                f.risk_tier === 'CRITICAL'
                                  ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                  : f.risk_tier === 'HIGH'
                                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                  : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              }`}
                            >
                              {f.risk_tier || 'LOW'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {f.downstream_dependents_count || 0} downstream dependents
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              f.enabled === true
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                : f.enabled === false
                                ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                            }`}
                          >
                            {f.enabled === true ? 'ACTIVE IN PROD' : f.enabled === false ? 'DISABLED IN PROD' : 'UNREGISTERED'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-[#11141A] text-center text-xs text-slate-400">
                    Zero Flagsmith feature flag invocations detected in snippet.
                  </div>
                )}
              </div>

              {/* Inferred AST Structural Dependencies */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                  Inferred AST Structural Dependencies ({astResult.dependencies_count || 0})
                </span>

                {astResult.dependencies && astResult.dependencies.length > 0 ? (
                  <div className="space-y-2">
                    {astResult.dependencies.map((dep, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-[#11141A] flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            {dep.sourceFlag}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            {dep.targetFlag}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">
                            {dep.relationship} ({Math.round(dep.confidence * 100)}% conf)
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400">
                          {dep.reason} (line {dep.line})
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#11141A] text-center text-xs text-slate-400">
                    Zero structural dependencies inferred between detected flags.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* 3-Signal Technical Provenance Bar */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">[SIG-1]</span>
            <span>Tags (c=1.0)</span>
          </div>
          <div className="w-[1px] h-3 bg-slate-200 dark:bg-white/10" />
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold">[SIG-2]</span>
            <span>AST Static</span>
          </div>
          <div className="w-[1px] h-3 bg-slate-200 dark:bg-white/10" />
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">[SIG-3]</span>
            <span>Git Temporal (Jaccard)</span>
          </div>
        </div>
        <div className="font-mono text-[10px]">
          FalkorDB GraphBLAS Matrix Engine
        </div>
      </div>
    </div>
  );
}
