import React, { useMemo } from 'react';
import { DeveloperProfile } from '../types';
import { Icon } from '../components/Icon';

interface AboutAppProps {
  profileData: DeveloperProfile;
  openWindow: (appId: string) => void;
}

export const AboutApp: React.FC<AboutAppProps> = ({ profileData, openWindow }) => {
  const activityDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 52 * 7; i++) {
      const rand = Math.random();
      let level = 0;
      if (rand > 0.85) level = 4;
      else if (rand > 0.65) level = 3;
      else if (rand > 0.45) level = 2;
      else if (rand > 0.25) level = 1;
      days.push({ id: i, level });
    }
    return days;
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-2xl bg-os-panel border border-os-border">
        <img
          src={profileData.avatar}
          alt={profileData.name}
          className="w-24 h-24 rounded-2xl object-cover border-2 border-sky-400/40 shadow-xl"
        />
        <div className="flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">{profileData.name}</h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
              @{profileData.handle}
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Available for Full-Stack Roles
            </span>
          </div>
          <p className="text-sm font-medium text-sky-300">{profileData.role}</p>
          <p className="text-xs text-os-muted leading-relaxed selectable-text">
            Full-stack developer focused on building intuitive web applications, high-performance APIs, and AI agent runtimes. Passionate about clean code architecture and developer tooling.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-os-muted pt-2 font-mono">
            <span className="flex items-center gap-1.5">
              <Icon name="MapPin" className="w-3.5 h-3.5 text-sky-400" /> {profileData.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Icon name="Mail" className="w-3.5 h-3.5 text-sky-400" /> {profileData.email}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-os-panel border border-os-border space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Icon name="Activity" className="w-4 h-4 text-emerald-400" />
              GitHub Commit & Activity Matrix (Past 365 Days)
            </h3>
            <p className="text-xs text-os-muted">Continuous integration and telemetry synced from @{profileData.handle}</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-os-muted">
            <span>Streak: <strong className="text-emerald-400">{profileData.stats.streak} days</strong></span>
            <span>Longest: <strong className="text-sky-400">{profileData.stats.longestStreak} days</strong></span>
          </div>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="grid grid-flow-col grid-rows-7 gap-1 w-max">
            {activityDays.map(d => {
              const colors = [
                'bg-slate-800/40',
                'bg-emerald-950/80 border border-emerald-800/30',
                'bg-emerald-700/80',
                'bg-emerald-500',
                'bg-emerald-300 shadow-sm shadow-emerald-400/50'
              ];
              return (
                <div
                  key={d.id}
                  className={`w-2.5 h-2.5 rounded-sm ${colors[d.level]} transition-all hover:scale-125`}
                  title={`Activity Level: ${d.level}`}
                />
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-os-surface border border-os-border">
            <div className="text-os-muted text-[11px]">Total Contributions</div>
            <div className="text-base font-bold text-white mt-0.5">{profileData.stats.contributions}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-os-surface border border-os-border">
            <div className="text-os-muted text-[11px]">Public Repositories</div>
            <div className="text-base font-bold text-sky-400 mt-0.5">{profileData.stats.repos}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-os-surface border border-os-border">
            <div className="text-os-muted text-[11px]">OSS GitHub Stars</div>
            <div className="text-base font-bold text-amber-400 mt-0.5">{profileData.stats.stars}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-os-surface border border-os-border">
            <div className="text-os-muted text-[11px]">Pipeline Uptime</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">{profileData.stats.uptime}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-os-panel border border-os-border space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Icon name="Compass" className="w-4 h-4 text-sky-400" />
            Current Engineering Focus
          </h3>
          <p className="text-xs text-os-muted leading-relaxed selectable-text">
            {profileData.systemProfile.focus}
          </p>
          <div className="pt-2 border-t border-os-border/60">
            <span className="text-[11px] font-semibold text-slate-300">Currently Learning:</span>
            <p className="text-xs text-sky-300/90 font-mono mt-1">{profileData.systemProfile.learning}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-os-panel border border-os-border space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Icon name="Code" className="w-4 h-4 text-indigo-400" />
            Core Stack & Philosophy
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {profileData.systemProfile.favoriteStack.map(tech => (
              <span key={tech} className="px-2.5 py-1 rounded-lg bg-os-surface border border-os-border font-mono text-xs text-sky-300 font-medium">
                {tech}
              </span>
            ))}
          </div>
          <div className="pt-2 border-t border-os-border/60">
            <span className="text-[11px] font-semibold text-slate-300">Philosophy:</span>
            <p className="text-xs text-os-muted italic mt-1 selectable-text">"{profileData.systemProfile.philosophy}"</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => openWindow('projects')}
          className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-sky-500/20"
        >
          <Icon name="FolderGit2" className="w-4 h-4" />
          <span>Explore Repositories</span>
        </button>
        <button
          onClick={() => openWindow('contact')}
          className="px-4 py-2.5 rounded-xl bg-os-panel hover:bg-os-card border border-os-border text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <Icon name="Mail" className="w-4 h-4" />
          <span>Get In Touch</span>
        </button>
        <button
          onClick={() => openWindow('terminal')}
          className="px-4 py-2.5 rounded-xl bg-os-panel hover:bg-os-card border border-os-border text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <Icon name="Terminal" className="w-4 h-4" />
          <span>Launch Terminal</span>
        </button>
      </div>
    </div>
  );
};
