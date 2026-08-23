import React from 'react';
import { BuildLogData } from '../types';
import { Icon } from '../components/Icon';

interface BuildLogAppProps {
  buildLogs: BuildLogData;
}

export const BuildLogApp: React.FC<BuildLogAppProps> = ({ buildLogs }) => {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-transparent border border-amber-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Icon name="Flame" className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Live Development Stream</h2>
            <p className="text-xs text-os-muted">Real-time changelog, active sprints, and upcoming explorations</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/30">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>ACTIVE SPRINT</span>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Icon name="Radio" className="w-4 h-4" /> 01. NOW — Active Engineering Work
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {buildLogs.now.map((item, i) => (
            <div key={i} className="p-4 rounded-2xl bg-os-panel border border-amber-500/20 space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-white">{item.title}</span>
                <span className="text-[10px] font-mono text-os-muted">{item.time}</span>
              </div>
              <p className="text-xs text-os-muted leading-relaxed selectable-text">{item.details}</p>
              <div>
                <div className="flex justify-between text-[11px] font-mono text-os-muted mb-1">
                  <span>Completion</span>
                  <span className="text-amber-400">{item.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-os-surface rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold font-mono text-sky-400 uppercase tracking-wider flex items-center gap-2">
          <Icon name="PackageCheck" className="w-4 h-4" /> 02. RECENTLY SHIPPED
        </h3>
        <div className="space-y-2.5">
          {buildLogs.recentlyShipped.map((ship, i) => (
            <div key={i} className="p-4 rounded-xl bg-os-panel border border-os-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  {ship.title}
                  <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-1.5 py-0.2 rounded border border-sky-500/20">
                    {ship.date}
                  </span>
                </div>
                <p className="text-os-muted mt-1 leading-relaxed selectable-text">{ship.description}</p>
              </div>
              <span className="text-[11px] font-mono text-sky-400 shrink-0 font-medium">{ship.linkText}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
