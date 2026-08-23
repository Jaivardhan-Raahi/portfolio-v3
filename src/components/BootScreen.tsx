import React from 'react';
import { Icon } from './Icon';

interface BootScreenProps {
  bootProgress: number;
  bootLogs: string[];
  bootState: 'booting' | 'ready' | 'desktop';
  launchDesktop: () => void;
  handleName: string;
}

export const BootScreen: React.FC<BootScreenProps> = ({
  bootProgress,
  bootLogs,
  bootState,
  launchDesktop,
  handleName
}) => {
  return (
    <div className="relative w-screen h-screen bg-os-bg text-os-text flex flex-col items-center justify-center p-6 select-none font-sans overflow-hidden">
      <div className="absolute inset-0 wallpaper-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center space-y-6 animate-fade-in">
        <div className="relative w-20 h-20 rounded-2xl bg-os-panel border border-os-border flex items-center justify-center shadow-2xl shadow-sky-500/10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white font-bold text-2xl tracking-wider">
            J
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-sky-500/20 blur-sm -z-10 animate-pulse-subtle" />
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            JaiOS <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">v3.4.0-LTS</span>
          </h1>
          <p className="text-sm text-os-muted mt-1 font-medium tracking-wide">
            Personal Operating Environment
          </p>
        </div>

        <div className="w-full bg-os-surface border border-os-border rounded-lg p-4 font-mono text-xs text-left shadow-inner">
          <div className="flex justify-between items-center text-os-muted mb-2 text-[11px]">
            <span>System Diagnostics</span>
            <span className="text-sky-400">{bootProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-os-border rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-200 ease-out"
              style={{ width: `${bootProgress}%` }}
            />
          </div>
          <div className="space-y-1 text-slate-400 text-[11px]">
            {bootLogs.map((log, i) => (
              <div key={i} className="flex items-center gap-2 truncate">
                <span className="text-emerald-400">✓</span>
                <span>{log}</span>
              </div>
            ))}
            {bootState === 'ready' && (
              <div className="flex items-center gap-2 text-sky-300 font-semibold pt-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>System ready. All subsystems verified.</span>
              </div>
            )}
          </div>
        </div>

        {bootState === 'ready' ? (
          <button
            onClick={launchDesktop}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold tracking-wide shadow-lg shadow-sky-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm flex items-center justify-center gap-2 animate-scale-up"
          >
            <Icon name="Power" className="w-4 h-4" />
            <span>START ENVIRONMENT</span>
          </button>
        ) : (
          <div className="h-12 flex items-center justify-center text-xs text-os-muted font-mono animate-pulse">
            Booting JaiOS kernel...
          </div>
        )}

        <div className="text-[11px] text-os-muted font-mono flex items-center gap-4">
          <span>Arch: x86_64 / WebGPU</span>
          <span>•</span>
          <span>Host: {handleName}</span>
        </div>
      </div>
    </div>
  );
};
