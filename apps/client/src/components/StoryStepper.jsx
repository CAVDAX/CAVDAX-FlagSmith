import React from 'react';
import { Play, GitCommit, AlertTriangle, Check } from 'lucide-react';

export default function StoryStepper({ currentAct, onSelectAct, loadingAct }) {
  const acts = [
    {
      act: 1,
      title: 'Act I: Flag Baseline',
      subtitle: 'dark_mode Active',
      desc: 'Topological mesh healthy; 2 downstream dependents satisfied.',
      icon: Play,
    },
    {
      act: 2,
      title: 'Act II: Blast Radius',
      subtitle: 'Cascading Impact',
      desc: 'FalkorDB computes 2-hop blast radius across AST & Git coupling in 4.5ms.',
      icon: GitCommit,
    },
    {
      act: 3,
      title: 'Act III: Enclosed MCP Gate',
      subtitle: 'Unsafe Toggle Blocked',
      desc: 'Agent calls safe_toggle_flag; Gate intercepts & hard blocks critical blast.',
      icon: AlertTriangle,
    },
    {
      act: 4,
      title: 'Act IV: Safe Cutover',
      subtitle: 'Topological Approval',
      desc: 'Downstream migrated; Gate approves & safely executes toggle in Flagsmith.',
      icon: Check,
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-[#0B0D11] border-b border-slate-300 dark:border-white/10 px-6 py-3 select-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {acts.map((item) => {
          const Icon = item.icon;
          const isActive = currentAct === item.act;
          const isLoading = loadingAct === item.act;

          const inactiveAccent = 'border-slate-300 dark:border-white/20 text-slate-700 group-hover:text-slate-950 dark:text-slate-200 dark:group-hover:text-white bg-slate-100 group-hover:bg-slate-200/80 dark:bg-white/5 dark:group-hover:bg-white/10';
          
          let activeAccent = 'border-slate-900 dark:border-white text-slate-950 dark:text-white bg-slate-200/90 dark:bg-white/15';
          if (item.act === 3) {
            activeAccent = 'border-rose-400 dark:border-rose-500/50 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30';
          } else if (item.act === 4) {
            activeAccent = 'border-emerald-400 dark:border-emerald-500/50 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30';
          }

          const iconContainerClass = isActive ? activeAccent : inactiveAccent;

          return (
            <button
              key={item.act}
              onClick={() => onSelectAct(item.act)}
              disabled={isLoading}
              className={`text-left p-3 rounded-xl border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                isActive
                  ? 'border-slate-950 bg-white text-slate-950 shadow-md ring-1 ring-slate-900/20 dark:border-amber-400/40 dark:bg-white/10 dark:text-white dark:shadow-[0_0_14px_rgba(217,163,83,0.08)] dark:ring-1 dark:ring-amber-400/20'
                  : 'border-slate-200 bg-white/80 hover:border-slate-900/40 hover:bg-white hover:shadow-xs dark:border-white/10 dark:bg-[#11141B]/70 dark:hover:border-amber-400/30 dark:hover:bg-[#161B22]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg border transition-all duration-150 ${iconContainerClass}`}>
                    <Icon className="w-3.5 h-3.5 text-current transition-colors" />
                  </div>
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-900 dark:text-white">
                    {item.title}
                  </span>
                </div>
                {isActive && (
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-white bg-slate-900 dark:text-black dark:bg-white px-1.5 py-0.5 rounded">
                    ACTIVE
                  </span>
                )}
              </div>

              <div className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                {item.subtitle}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-mono">
                {item.desc}
              </div>

              {isLoading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-[#0B0D11]/90 backdrop-blur-xs flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
