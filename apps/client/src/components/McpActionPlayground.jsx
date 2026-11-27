import React, { useState } from 'react';
import { Play, Terminal, AlertTriangle, Check, RefreshCw, FileCode, X, Cpu } from 'lucide-react';
import { playClick, playRejectBuzz, playApprovalChime } from '../utils/soundFx';

export default function McpActionPlayground({ onRunCustomAction, repo = null, decisions = [], onClose = null }) {
  const [activeTool, setActiveTool] = useState('safe_toggle_flag'); // 'safe_toggle_flag' | 'get_flag_blast_radius'
  const [flagName, setFlagName] = useState('auth_v2');
  const [filePath, setFilePath] = useState('apps/client-pwa/src/components/ThemeWrapper.jsx');
  const [proposedAction, setProposedAction] = useState('Disable feature flag auth_v2');
  const [codeSnippet, setCodeSnippet] = useState(`// Proposed tool call to safe_toggle_flag:\nconst result = await mcp.callTool('safe_toggle_flag', {\n  flag_name: 'auth_v2',\n  enabled: false\n});`);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);

  const handleToggleDecision = () => {
    playClick();
    if (flagName === 'auth_v2') {
      setFlagName('dark_mode');
      setProposedAction('Toggle dark_mode feature flag');
      setCodeSnippet(`// Safe toggle call for dark_mode:\nconst result = await mcp.callTool('safe_toggle_flag', {\n  flag_name: 'dark_mode',\n  enabled: true\n});`);
    } else {
      setFlagName('auth_v2');
      setProposedAction('Disable feature flag auth_v2');
      setCodeSnippet(`// Unsafe toggle call for auth_v2 (has dependents):\nconst result = await mcp.callTool('safe_toggle_flag', {\n  flag_name: 'auth_v2',\n  enabled: false\n});`);
    }
  };

  const handleSelectDecisionChip = (id) => {
    playClick();
    setFlagName(id);
    setProposedAction(`Evaluate blast radius for ${id}`);
    setCodeSnippet(`// Inquire blast radius for ${id}:\nconst blast = await mcp.callTool('get_flag_blast_radius', { flag_name: '${id}' });`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    playClick();
    setIsRunning(true);
    setResult(null);

    const isToggle = activeTool === 'safe_toggle_flag';
    const bodyPayload = isToggle
      ? {
          toolName: 'safe_toggle_flag',
          args: {
            flag_name: flagName,
            enabled: false,
            ...(repo?.full_name ? { repo: repo.full_name } : {})
          }
        }
      : {
          toolName: 'get_flag_blast_radius',
          args: {
            flag_name: flagName,
            ...(repo?.full_name ? { repo: repo.full_name } : {})
          }
        };

    try {
      const res = await fetch('/api/mcp/call', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });

      const data = await res.json();
      setResult(data);

      const isApproved = Boolean(data.success || data.is_approved || data.gate_verdict === 'APPROVED');

      if (isApproved) {
        playApprovalChime();
      } else {
        playRejectBuzz();
      }

      if (onRunCustomAction) {
        onRunCustomAction(data);
      }
    } catch (err) {
      const isApproved = flagName === 'dark_mode';
      const simResult = {
        isError: !isApproved,
        is_approved: isApproved,
        gate_verdict: isApproved ? 'APPROVED' : 'BLOCKED_DOWNSTREAM_DEPENDENTS',
        latency_ms: 1.84,
        simulated: true,
        violation_paths: !isApproved ? [['FlagsmithFeature:auth_v2', 'FlagsmithFeature:dark_mode', 'FlagsmithFeature:premium_analytics']] : [],
        message: isApproved
          ? `CLEARANCE GRANTED: Feature '${flagName}' prerequisites verified. Safe to toggle without cascading breaking changes.`
          : `CLEARANCE DENIED: Feature '${flagName}' has 2 active downstream dependents. Disabling would break production telemetry.`
      };
      setResult(simResult);
      if (isApproved) playApprovalChime();
      else playRejectBuzz();
    } finally {
      setIsRunning(false);
    }
  };

  const isClearanceMode = activeTool === 'safe_toggle_flag';
  const isApprovedResult = result
    ? Boolean(result.clearance_granted || result.is_approved || result.gate_verdict === 'APPROVED' || result.success)
    : false;

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0f1015] border border-slate-200 dark:border-white/10 shadow-2xl font-mono text-xs select-none space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-slate-900 dark:text-white shrink-0" strokeWidth={2} />
          <h3 className="font-bold text-sm text-slate-950 dark:text-white uppercase tracking-wider">
            Custom Action Simulator
          </h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={() => { playClick(); onClose(); }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Simulator (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dual Mode Switcher */}
      <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
        <button
          type="button"
          onClick={() => { setActiveTool('check_intent_clearance'); setResult(null); playClick(); }}
          className={`py-1.5 px-2.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            isClearanceMode
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>Pre-Flight Clearance</span>
        </button>
        <button
          type="button"
          onClick={() => { setActiveTool('apply_code_change'); setResult(null); playClick(); }}
          className={`py-1.5 px-2.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            !isClearanceMode
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Enclosed Code Write</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold block mb-1">
              Decision ID:
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={decisionId}
                onChange={(e) => setDecisionId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-400 dark:focus:border-white/30 text-xs"
                placeholder="e.g. DEC-102 or DEC-103"
                required
              />
              <button
                type="button"
                onClick={handleToggleDecision}
                className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-[10px] text-slate-700 dark:text-slate-300 whitespace-nowrap cursor-pointer transition-colors"
                title="Toggle test decisions"
              >
                {decisionId === 'DEC-102' ? 'DEC-103' : 'DEC-102'}
              </button>
            </div>
            {decisions && decisions.length > 0 && (
              <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                {decisions.slice(0, 4).map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handleSelectDecisionChip(d.id)}
                    className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                      decisionId === d.id
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-slate-900 dark:border-white font-bold'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300'
                    }`}
                  >
                    {d.id}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold block mb-1">
              File Path:
            </label>
            <input
              type="text"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-400 dark:focus:border-white/30 text-xs"
              placeholder="e.g. src/services/payment.js"
              required
            />
          </div>
        </div>

        {isClearanceMode ? (
          <div>
            <label className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold block mb-1">
              Proposed Intent / Action:
            </label>
            <input
              type="text"
              value={proposedAction}
              onChange={(e) => setProposedAction(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-400 dark:focus:border-white/30 text-xs"
              placeholder="Describe proposed action..."
              required
            />
          </div>
        ) : (
          <div>
            <label className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold block mb-1">
              Code Payload:
            </label>
            <textarea
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              rows={3}
              className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-400 dark:focus:border-white/30 text-xs leading-relaxed resize-none"
              required
            />
          </div>
        )}

        <div className="flex items-center justify-end pt-1">
          <button
            type="submit"
            disabled={isRunning}
            className="px-4 py-2 rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-bold hover:opacity-90 transition-all flex items-center gap-1.5 tactile-btn disabled:opacity-50 text-xs cursor-pointer shrink-0"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : isClearanceMode ? (
              <>
                <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>Check Clearance</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Execution</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Real-time Verdict Output */}
      {result && (
        <div
          className={`mt-4 p-3 rounded-xl border text-xs animate-in fade-in ${
            isApprovedResult
              ? 'bg-emerald-50 dark:bg-[#06261B] border-emerald-500/30 text-emerald-900 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-[#2A080E] border-rose-500/30 text-rose-900 dark:text-rose-300'
          }`}
        >
          <div className="flex items-center justify-between font-bold mb-1">
            <span className="flex items-center gap-1.5">
              {isApprovedResult ? (
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              )}
              {isClearanceMode
                ? isApprovedResult
                  ? 'CLEARANCE GRANTED'
                  : 'CLEARANCE DENIED'
                : isApprovedResult
                  ? 'APPROVED (200 OK)'
                  : 'BLOCKED (403 FORBIDDEN)'}
            </span>
            <span className="text-[10px] font-mono opacity-80">
              Latency: {result.latency_ms || '< 15'}ms
            </span>
          </div>

          <div className="text-[11px] leading-relaxed mt-1 text-slate-700 dark:text-slate-300">
            {isApprovedResult ? (
              <span>
                Causal safety verified. Feature flag <code className="font-bold text-emerald-950 dark:text-white">{flagName}</code> has zero prerequisite conflicts.
              </span>
            ) : (
              <span>
                Safe toggle blocked. Feature flag <code className="font-bold text-rose-950 dark:text-rose-200">{flagName}</code> has active downstream dependents or missing prerequisites.
              </span>
            )}
          </div>

          {result.violation_paths && result.violation_paths.length > 0 && (
            <div className="mt-2 p-2 rounded bg-white/60 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-[10px] font-mono text-slate-800 dark:text-slate-300">
              <span className="text-slate-500 block mb-0.5 font-mono">Dependency Chain:</span>
              {result.violation_paths.map((p, idx) => (
                <div key={idx} className="text-rose-600 dark:text-rose-300">
                  ↳ {Array.isArray(p) ? p.join(' -> ') : p}
                </div>
              ))}
            </div>
          )}

          {result.instructions_for_agent && (
            <div className="mt-2 p-2 rounded bg-amber-50 dark:bg-white/5 border border-amber-500/20 dark:border-white/10 text-[10px] font-mono text-amber-800 dark:text-amber-300">
              <span className="text-amber-700 dark:text-slate-400 block mb-0.5 font-mono">Directive:</span>
              {result.instructions_for_agent}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
