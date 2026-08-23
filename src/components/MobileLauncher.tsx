import React from 'react';
import { DeveloperProfile, AppDefinition } from '../types';
import { Icon } from './Icon';

interface MobileLauncherProps {
  currentTime: Date;
  profileData: DeveloperProfile;
  appDefinitions: AppDefinition[];
  mobileActiveApp: string | null;
  setMobileActiveApp: (appId: string | null) => void;
  renderAppContent: (appId: string) => React.ReactNode;
}

export const MobileLauncher: React.FC<MobileLauncherProps> = ({
  currentTime,
  profileData,
  appDefinitions,
  mobileActiveApp,
  setMobileActiveApp,
  renderAppContent
}) => {
  return (
    <div className="w-screen h-screen bg-os-bg text-os-text flex flex-col justify-between overflow-hidden relative font-sans select-none">
      <div className="absolute top-0 right-0 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Mobile Status Bar */}
      <div className="h-10 px-5 flex items-center justify-between text-xs font-mono text-os-muted z-20 border-b border-white/5 bg-os-surface/40 backdrop-blur-md">
        <span className="font-semibold text-slate-200">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 5G
          </span>
          <span className="text-slate-300">98%</span>
          <Icon name="BatteryCharging" className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {mobileActiveApp ? (
        <div className="flex-1 flex flex-col z-30 bg-os-surface overflow-hidden animate-fade-in">
          <div className="h-14 px-4 bg-os-panel border-b border-os-border flex items-center justify-between">
            <button
              onClick={() => setMobileActiveApp(null)}
              className="flex items-center gap-1.5 text-xs text-sky-400 font-semibold active:opacity-60 py-2 px-1"
            >
              <Icon name="ChevronLeft" className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="text-sm font-semibold text-white truncate max-w-[200px] text-center">
              {appDefinitions.find(a => a.id === mobileActiveApp)?.title}
            </div>
            <button
              onClick={() => setMobileActiveApp(null)}
              className="p-1 text-os-muted hover:text-white"
            >
              <Icon name="X" className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {renderAppContent(mobileActiveApp)}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between p-6 z-10 overflow-y-auto">
          <div className="bg-os-surface/90 border border-os-border rounded-2xl p-4 shadow-xl mb-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <img
                src={profileData.avatar}
                alt="Avatar"
                className="w-14 h-14 rounded-2xl object-cover border border-sky-400/30"
              />
              <div>
                <h2 className="text-base font-bold text-white leading-tight">{profileData.name}</h2>
                <p className="text-xs text-sky-400 font-medium">{profileData.role}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-os-muted mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>@{profileData.handle}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-os-border/50 text-center font-mono">
              <div className="bg-os-panel/70 p-2 rounded-lg">
                <div className="text-xs text-os-muted">Contribs</div>
                <div className="text-sm font-semibold text-white">{profileData.stats.contributions}</div>
              </div>
              <div className="bg-os-panel/70 p-2 rounded-lg">
                <div className="text-xs text-os-muted">Streak</div>
                <div className="text-sm font-semibold text-sky-400">{profileData.stats.streak}d</div>
              </div>
              <div className="bg-os-panel/70 p-2 rounded-lg">
                <div className="text-xs text-os-muted">Stars</div>
                <div className="text-sm font-semibold text-amber-400">{profileData.stats.stars}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 my-auto py-2">
            {appDefinitions.map(app => (
              <button
                key={app.id}
                onClick={() => setMobileActiveApp(app.id)}
                className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
              >
                <div className="w-14 h-14 rounded-2xl bg-os-panel border border-os-border flex items-center justify-center text-sky-400 shadow-md">
                  <Icon name={app.icon} className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-medium text-slate-300 tracking-tight text-center truncate max-w-full">
                  {app.title}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4 bg-os-surface/90 border border-os-border/80 rounded-3xl p-3 flex justify-around items-center backdrop-blur-xl shadow-2xl">
            {['about', 'projects', 'terminal', 'contact'].map(id => {
              const app = appDefinitions.find(a => a.id === id);
              if (!app) return null;
              return (
                <button
                  key={id}
                  onClick={() => setMobileActiveApp(id)}
                  className="p-3 rounded-2xl bg-os-panel border border-os-border text-sky-400 active:scale-90 transition-transform"
                >
                  <Icon name={app.icon} className="w-6 h-6" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
