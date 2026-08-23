import React, { useState, useRef, useEffect } from 'react';
import { DeveloperProfile, Project, SkillCategory, AppDefinition } from '../types';
import { sound } from '../services/soundEngine';

interface TerminalAppProps {
  profileData: DeveloperProfile;
  projectsData: Project[];
  skillsData: SkillCategory[];
  appDefinitions: AppDefinition[];
  openWindow: (appId: string) => void;
}

interface TerminalHistoryItem {
  type: 'system' | 'user' | 'error';
  text: string;
}

export const TerminalApp: React.FC<TerminalAppProps> = ({
  profileData,
  projectsData,
  skillsData,
  appDefinitions,
  openWindow
}) => {
  const [history, setHistory] = useState<TerminalHistoryItem[]>([
    { type: "system", text: "JaiOS Terminal (x86_64-jaivardhan-system)" },
    { type: "system", text: "Type 'help' or 'neofetch' to view available system telemetry." }
  ]);
  const [command, setCommand] = useState<string>("");
  const termEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    termEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = command.trim().toLowerCase();
    if (!cmd) return;

    sound.playClick();
    const newHist: TerminalHistoryItem[] = [...history, { type: "user", text: `visitor@jaiOS:~$ ${command}` }];
    setCommand("");

    const parts = cmd.split(" ");
    const action = parts[0];

    switch (action) {
      case "help":
        newHist.push({
          type: "system",
          text: `Available shell commands:
neofetch Print system telemetry & hardware specs
about Display developer summary
projects List active software repositories
skills Inspect diagnostic capability scores
whoami Print current session user
clear Flush terminal screen
open <app> Launch an OS window (e.g. 'open projects', 'open contact')`
        });
        break;

      case "neofetch":
        newHist.push({
          type: "system",
          text: `
/\\_/\ ${profileData.handle}@jaiOS
( o.o ) --------------
> ^ < OS: JaiOS v3.4.0 (x86_64)
Host: ${profileData.name} Node Cluster
Kernel: 2026.08-lts
Uptime: ${profileData.stats.uptime}
Packages: ${profileData.stats.repos} Repositories
Shell: jai-zsh 5.9
CPU: High-Throughput Quad Core
GPU: WebGPU Instanced Rendering
Memory: Optimized Type-Safe Runtimes`
        });
        break;

      case "about":
        newHist.push({
          type: "system",
          text: `${profileData.name} — ${profileData.role}\nLocation: ${profileData.location}\nBio: ${profileData.systemProfile.philosophy}`
        });
        break;

      case "projects":
        newHist.push({
          type: "system",
          text: projectsData.map(p => `• ${p.name.padEnd(18)} [${p.category.padEnd(14)}] - ${p.tagline}`).join("\n")
        });
        break;

      case "skills":
        newHist.push({
          type: "system",
          text: skillsData.map(g => `[${g.category.toUpperCase()}]\n ${g.items.map(i => `${i.name} (${i.experience})`).join(", ")}`).join("\n\n")
        });
        break;

      case "whoami":
        newHist.push({ type: "system", text: "visitor (uid=1000, gid=1000, roles=[collaborator, reviewer])" });
        break;

      case "clear":
        setHistory([]);
        return;

      case "open":
        const targetApp = parts[1];
        if (targetApp && appDefinitions.some(a => a.id === targetApp)) {
          newHist.push({ type: "system", text: `Launching window: ${targetApp}...` });
          openWindow(targetApp);
        } else {
          newHist.push({ type: "error", text: `Unknown app '${targetApp}'. Type 'help' for options.` });
        }
        break;

      default:
        newHist.push({
          type: "error",
          text: `zsh: command not found: ${action}. Type 'help' for command list.`
        });
        break;
    }

    setHistory(newHist);
  };

  return (
    <div className="h-full bg-os-bg p-4 font-mono text-xs text-slate-300 flex flex-col selectable-text overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-2">
        {history.map((h, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap leading-relaxed ${
              h.type === 'user'
                ? 'text-sky-300 font-semibold'
                : h.type === 'error'
                ? 'text-rose-400'
                : 'text-slate-300'
            }`}
          >
            {h.text}
          </div>
        ))}
        <div ref={termEndRef} />
      </div>

      <form onSubmit={handleCommand} className="mt-2 pt-2 border-t border-os-border flex items-center gap-2">
        <span className="text-sky-400 font-bold shrink-0">visitor@jaiOS:~$</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="type 'help' or 'neofetch'..."
          className="flex-1 bg-transparent text-white focus:outline-none font-mono text-xs"
          autoFocus
        />
      </form>
    </div>
  );
};
