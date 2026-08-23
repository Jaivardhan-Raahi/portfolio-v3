import React from 'react';
import { WindowState, AppDefinition } from '../types';
import { Icon } from './Icon';

interface TaskbarProps {
  startMenuOpen: boolean;
  setStartMenuOpen: (v: boolean) => void;
  quickSettingsOpen: boolean;
  setQuickSettingsOpen: (v: boolean) => void;
  calendarOpen: boolean;
  setCalendarOpen: (v: boolean) => void;
  activeWindows: WindowState[];
  focusedWindowId: string | null;
  appDefinitions: AppDefinition[];
  currentTime: Date;
  soundMuted: boolean;
  toggleSound: () => void;
  openWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  startMenuOpen,
  setStartMenuOpen,
  quickSettingsOpen,
  setQuickSettingsOpen,
  calendarOpen,
  setCalendarOpen,
  activeWindows,
  focusedWindowId,
  appDefinitions,
  currentTime,
  soundMuted,
  toggleSound,
  focusWindow,
  minimizeWindow
}) => {
  return (
    <div className="h-12 bg-os-panel/90 border-t border-os-border px-3 flex items-center justify-between z-40 backdrop-blur-2xl select-none">
      <div className="flex items-center gap-1.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setStartMenuOpen(!startMenuOpen);
            setQuickSettingsOpen(false);
            setCalendarOpen(false);
          }}
          className={`h-9 px-3 rounded-xl flex items-center gap-2 font-semibold text-xs transition-all ${
            startMenuOpen
              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
              : 'bg-os-surface hover:bg-white/[0.08] text-slate-200 border border-os-border hover:border-white/20'
          }`}
        >
          <div className="w-4 h-4 rounded-md bg-gradient-to-tr from-sky-400 to-indigo-400 flex items-center justify-center text-[10px] text-white font-bold">
            J
          </div>
          <span>Start</span>
        </button>

        <div className="h-5 w-px bg-os-border mx-1" />

        <div className="flex items-center gap-1 overflow-x-auto max-w-[50vw] pr-2">
          {activeWindows.map(win => {
            const appDef = appDefinitions.find(a => a.id === win.id);
            if (!appDef) return null;
            const isFocused = focusedWindowId === win.id && !win.isMinimized;

            return (
              <button
                key={win.id}
                onClick={() => {
                  if (win.isMinimized) {
                    focusWindow(win.id);
                  } else if (focusedWindowId === win.id) {
                    minimizeWindow(win.id);
                  } else {
                    focusWindow(win.id);
                  }
                }}
                className={`h-9 px-3 rounded-xl flex items-center gap-2 text-xs font-medium transition-all max-w-[150px] truncate border ${
                  isFocused
                    ? 'bg-sky-500/20 border-sky-400/50 text-white shadow-sm'
                    : win.isMinimized
                    ? 'bg-os-surface/40 border-transparent text-os-muted hover:bg-os-surface'
                    : 'bg-os-surface border-os-border text-slate-300 hover:border-white/20'
                }`}
              >
                <Icon name={appDef.icon} className={`w-4 h-4 shrink-0 ${isFocused ? 'text-sky-400' : 'text-os-muted'}`} />
                <span className="truncate">{appDef.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setQuickSettingsOpen(!quickSettingsOpen);
            setStartMenuOpen(false);
            setCalendarOpen(false);
          }}
          className="h-9 px-2.5 rounded-xl bg-os-surface hover:bg-white/[0.08] border border-os-border flex items-center gap-2 text-os-muted hover:text-white transition-colors"
          title="System Controls"
        >
          <Icon name="Wifi" className="w-3.5 h-3.5 text-emerald-400" />
          <Icon name={soundMuted ? "VolumeX" : "Volume2"} className={`w-3.5 h-3.5 ${soundMuted ? 'text-rose-400' : 'text-sky-400'}`} />
          <Icon name="SlidersHorizontal" className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setCalendarOpen(!calendarOpen);
            setStartMenuOpen(false);
            setQuickSettingsOpen(false);
          }}
          className="h-9 px-3 rounded-xl bg-os-surface hover:bg-white/[0.08] border border-os-border text-right font-mono text-xs text-slate-200 transition-colors flex flex-col justify-center leading-none"
        >
          <span className="font-semibold text-white">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-[10px] text-os-muted mt-0.5">
            {currentTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </span>
        </button>
      </div>
    </div>
  );
};
