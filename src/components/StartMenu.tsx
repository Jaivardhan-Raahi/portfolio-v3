import React, { useState } from 'react';
import { DeveloperProfile, AppDefinition } from '../types';
import { Icon } from './Icon';

interface StartMenuProps {
  profileData: DeveloperProfile;
  appDefinitions: AppDefinition[];
  openWindow: (id: string) => void;
  restartSystem: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  profileData,
  appDefinitions,
  openWindow,
  restartSystem
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApps = appDefinitions.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.short.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute bottom-14 left-4 w-96 max-h-[580px] bg-os-panel/95 border border-os-border rounded-2xl os-window-shadow z-40 p-4 flex flex-col gap-4 animate-slide-up backdrop-blur-2xl"
    >
      <div className="flex items-center gap-3 p-2 rounded-xl bg-os-card/70 border border-os-border/60">
        <img
          src={profileData.avatar}
          alt={profileData.name}
          className="w-12 h-12 rounded-xl object-cover border border-sky-400/30"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white truncate">{profileData.name}</h3>
          <p className="text-xs text-sky-400 truncate">@{profileData.handle}</p>
          <p className="text-[11px] text-os-muted truncate mt-0.5">{profileData.location}</p>
        </div>
      </div>

      <div className="relative">
        <Icon name="Search" className="w-4 h-4 text-os-muted absolute left-3 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search apps, projects and files..."
          className="w-full pl-9 pr-3 py-2 bg-os-surface border border-os-border rounded-xl text-xs text-white placeholder-os-muted focus:outline-none focus:border-sky-400 transition-colors font-mono"
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        <div className="text-[11px] font-semibold text-os-muted uppercase tracking-wider px-1 mb-2">
          All Applications
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {filteredApps.map(app => (
            <button
              key={app.id}
              onClick={() => openWindow(app.id)}
              className="flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-os-surface border border-os-border flex items-center justify-center text-sky-400 group-hover:border-sky-400/40">
                <Icon name={app.icon} className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-slate-200 group-hover:text-white truncate">{app.title}</div>
                <div className="text-[10px] text-os-muted truncate">{app.short}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-os-border flex items-center justify-between text-xs text-os-muted">
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>JaiOS v3.4</span>
        </div>
        <button
          onClick={restartSystem}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/20 hover:text-rose-300 text-os-muted transition-colors text-xs font-medium"
        >
          <Icon name="Power" className="w-3.5 h-3.5" />
          <span>Restart Environment</span>
        </button>
      </div>
    </div>
  );
};
