import React from 'react';
import { SkillCategory } from '../types';
import { Icon } from '../components/Icon';

interface SkillsAppProps {
  skillsData: SkillCategory[];
}

export const SkillsApp: React.FC<SkillsAppProps> = ({ skillsData }) => {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="p-4 rounded-2xl bg-os-panel border border-os-border flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Icon name="Cpu" className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">System Capabilities & Diagnostics</div>
            <div className="text-os-muted">Telemetry Status: Active Production</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-os-muted">
          <span>Stack: Multi-Disciplinary</span>
          <span>Memory Footprint: Lean</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {skillsData.map((group, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-os-panel border border-os-border space-y-4">
            <div className="flex items-center justify-between border-b border-os-border pb-2.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Icon name="Activity" className="w-4 h-4 text-sky-400" />
                {group.category}
              </h3>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-semibold">
                {group.status}
              </span>
            </div>

            <div className="space-y-2.5">
              {group.items.map(skill => (
                <div
                  key={skill.name}
                  className="p-3 rounded-xl bg-os-surface border border-os-border/70 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white truncate">{skill.name}</span>
                      <span className="font-mono text-[10px] text-sky-400 bg-sky-500/10 px-1.5 py-0.2 rounded border border-sky-500/20">
                        {skill.experience}
                      </span>
                    </div>
                    <div className="text-[11px] text-os-muted truncate font-mono">{skill.metric}</div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-os-card text-slate-200 border border-os-border">
                      {skill.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
