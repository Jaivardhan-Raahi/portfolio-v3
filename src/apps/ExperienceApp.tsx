import React, { useState, useMemo } from 'react';
import { ExperienceEntry } from '../types';
import { Icon } from '../components/Icon';

interface ExperienceAppProps {
  experienceData: ExperienceEntry[];
}

export const ExperienceApp: React.FC<ExperienceAppProps> = ({ experienceData }) => {
  const [filterType, setFilterType] = useState<string>("ALL");

  const filtered = useMemo(() => {
    if (filterType === "ALL") return experienceData;
    return experienceData.filter(e => e.type === filterType);
  }, [experienceData, filterType]);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="p-4 rounded-2xl bg-os-panel border border-os-border flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Icon name="History" className="w-4 h-4 text-sky-400" />
            System Event & Career Chronology
          </h2>
          <p className="text-xs text-os-muted">Verified engineering milestones and leadership roles</p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          {["ALL", "Full-Time", "Milestone", "Education"].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-lg border transition-colors ${
                filterType === t
                  ? 'bg-sky-500 text-white border-sky-400 font-semibold'
                  : 'bg-os-surface text-os-muted border-os-border hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="relative border-l-2 border-os-border ml-4 pl-6 space-y-8">
        {filtered.map(entry => (
          <div key={entry.id} className="relative group">
            <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-os-panel border-2 border-sky-400 group-hover:bg-sky-400 transition-colors" />

            <div className="p-5 rounded-2xl bg-os-panel border border-os-border os-card-hover space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">{entry.role}</h3>
                  <div className="text-xs font-semibold text-sky-400">{entry.org}</div>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-os-surface text-os-muted border border-os-border">
                    {entry.location}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/30 font-semibold">
                    {entry.date}
                  </span>
                </div>
              </div>

              <p className="text-xs text-os-muted leading-relaxed selectable-text">
                {entry.summary}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-os-border/50 font-mono text-[11px]">
                {entry.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-os-surface text-slate-300 border border-os-border">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
