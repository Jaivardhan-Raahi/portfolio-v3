import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface SettingsAppProps {
  githubUsername: string;
  setGithubUsername: (u: string) => void;
  githubPAT: string;
  setGithubPAT: (p: string) => void;
  fetchGithubProfile: (u: string, p?: string) => void;
  isSyncingGithub: boolean;
  githubSyncError: string | null;
  addNotification: (title: string, message: string, icon?: string) => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({
  githubUsername,
  setGithubUsername,
  githubPAT,
  setGithubPAT,
  fetchGithubProfile,
  isSyncingGithub,
  githubSyncError,
  addNotification
}) => {
  const [handleInput, setHandleInput] = useState<string>(githubUsername);
  const [patInput, setPatInput] = useState<string>(githubPAT);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = handleInput.trim() || 'Jaivardhan-Raahi';
    setGithubUsername(cleanUser);
    setGithubPAT(patInput.trim());

    localStorage.setItem('kaelos_github_user', cleanUser);
    if (patInput.trim()) {
      sessionStorage.setItem('kaelos_github_pat', patInput.trim());
    } else {
      sessionStorage.removeItem('kaelos_github_pat');
    }

    fetchGithubProfile(cleanUser, patInput.trim());
    addNotification("Settings Saved", `Updated GitHub profile target to @${cleanUser}`, "CheckCircle2");
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto text-xs">
      <div className="p-4 rounded-2xl bg-os-panel border border-os-border space-y-1">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Icon name="Settings" className="w-4 h-4 text-sky-400" />
          System Settings & API Synchronization
        </h2>
        <p className="text-os-muted">Connect live GitHub data, sync private repositories via PAT token, and manage telemetry options.</p>
      </div>

      <form onSubmit={handleSave} className="p-5 rounded-2xl bg-os-panel border border-os-border space-y-4">
        <div className="space-y-1.5">
          <label className="block font-semibold text-slate-200">GitHub Username</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={handleInput}
              onChange={(e) => setHandleInput(e.target.value)}
              placeholder="e.g. Jaivardhan-Raahi"
              className="flex-1 px-3.5 py-2 rounded-xl bg-os-surface border border-os-border text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
            />
          </div>
          <p className="text-[11px] text-os-muted">
            The OS fetches public repositories, bio, stars, and contribution metrics directly from `api.github.com/users/{handleInput}`.
          </p>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-os-border">
          <label className="block font-semibold text-slate-200 flex items-center gap-2">
            <span>GitHub Personal Access Token (PAT)</span>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">Optional for Private Repos</span>
          </label>
          <input
            type="password"
            value={patInput}
            onChange={(e) => setPatInput(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            className="w-full px-3.5 py-2 rounded-xl bg-os-surface border border-os-border text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
          />
          <p className="text-[11px] text-os-muted">
            Stored securely in browser session memory. Enables accessing private repositories and higher GitHub API rate limits.
          </p>
        </div>

        {githubSyncError && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 flex items-center gap-2">
            <Icon name="AlertCircle" className="w-4 h-4 shrink-0" />
            <span>{githubSyncError}</span>
          </div>
        )}

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            disabled={isSyncingGithub}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-sky-500/20"
          >
            {isSyncingGithub ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Syncing GitHub...</span>
              </>
            ) : (
              <>
                <Icon name="RefreshCw" className="w-3.5 h-3.5" />
                <span>Save & Refresh Telemetry</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
