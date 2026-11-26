import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Zap,
  ArrowRight,
  ShieldAlert,
  GitBranch,
  Layers,
  Code2,
  GitCommit
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
export default function FlagBlastRadiusCard({ isDarkTheme = true, onSelectFlag }) {
  const [features, setFeatures] = useState([]);
  const [selectedFlagName, setSelectedFlagName] = useState('dark_mode');
  const [blastRadius, setBlastRadius] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [togglePending, setTogglePending] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch all features from Flagsmith & FalkorDB
  const fetchFeatures = useCallback(async () => {
    try {
      const res = await fetch('/api/flagsmith/features');
      const data = await res.json();
      if (data.success && Array.isArray(data.features)) {
        setFeatures(data.features);
        if (data.features.length > 0 && !selectedFlagName) {
          setSelectedFlagName(data.features[0].name);
        }
      }
    } catch (err) {
      console.error('[FlagBlastRadius] Failed to fetch features:', err);
    }
  }, [selectedFlagName]);

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

  // Compute Risk Tier styling
  const riskColor = blastRadius?.risk_tier === 'CRITICAL'
    ? 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    : blastRadius?.risk_tier === 'HIGH'
    ? 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    : blastRadius?.risk_tier === 'MODERATE'
    ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
    : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B0D11] text-slate-900 dark:text-white shadow-xl transition-all">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Flagsmith Blast Radius Radar</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-balance line-clamp-1">
                Real-time GraphBLAS topological dependency traversal across 3 signals.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
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

      {/* Feature Selector Tabs */}
      <div className="py-4">
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
          Select Feature Flag
        </label>
        <div className="flex flex-wrap gap-2">
          {features.map((feat) => {
            const isSelected = feat.name === selectedFlagName;
            return (
              <button
                key={feat.name}
                onClick={() => {
                  playClick();
                  setSelectedFlagName(feat.name);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold shadow-md'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${feat.enabled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                <span>{feat.name}</span>
                {feat.incoming_dependents > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-white/10 font-sans">
                    {feat.incoming_dependents} dep
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
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
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
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Flag Telemetry Grid */}
      {blastRadius && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Column 1: Flag State & Safe Toggle */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#11141A] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                  Active State
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${riskColor}`}>
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    blastRadius.enabled
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                  }`}
                >
                  {blastRadius.enabled ? (
                    <>
                      <ToggleRight className="w-4 h-4" />
                      <span>Disable</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4" />
                      <span>Enable</span>
                    </>
                  )}
                </button>
              </div>
              <div className="mt-2 text-[10px] text-slate-400">
                FalkorDB Traversal: {blastRadius.latency_ms || 0.1} ms
              </div>
            </div>
          </div>

          {/* Column 2: Downstream Dependents (Blast Radius) */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#11141A]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                Downstream Impact ({blastRadius.downstream_impact_count || 0})
              </span>
              <Tooltip content="Features that break or stop working if this flag is disabled">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
              </Tooltip>
            </div>

            {blastRadius.downstream_dependents && blastRadius.downstream_dependents.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {blastRadius.downstream_dependents.map((dep, idx) => (
                  <div
                    key={`${dep.name}-${idx}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-1.5 h-1.5 rounded-full ${dep.enabled ? 'bg-rose-500' : 'bg-slate-400'}`} />
                      <span className="font-mono truncate font-medium">{dep.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                      Hop {dep.depth}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-emerald-500 opacity-80" />
                <span>Zero downstream dependents. Safe to toggle without cascading breaking changes.</span>
              </div>
            )}
          </div>

          {/* Column 3: Upstream Prerequisites */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#11141A]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                Upstream Prerequisites ({blastRadius.upstream_prerequisites?.length || 0})
              </span>
              <Tooltip content="Features required to be active before this flag can safely execute">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
              </Tooltip>
            </div>

            {blastRadius.upstream_prerequisites && blastRadius.upstream_prerequisites.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {blastRadius.upstream_prerequisites.map((pre, idx) => (
                  <div
                    key={`${pre.name}-${idx}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-1.5 h-1.5 rounded-full ${pre.enabled ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="font-mono truncate font-medium">{pre.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold ${pre.enabled ? 'text-emerald-500' : 'text-amber-500'}`}>
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

      {/* 3-Signal Technical Provenance Bar */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Signal 1: Tags (c=1.0)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            <span>Signal 2: AST Static</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Signal 3: Git Temporal (Jaccard)</span>
          </div>
        </div>
        <div className="font-mono text-[10px]">
          FalkorDB GraphBLAS Matrix Engine
        </div>
      </div>
    </div>
  );
}
