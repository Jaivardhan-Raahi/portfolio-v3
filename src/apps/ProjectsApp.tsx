import React, { useState, useMemo } from 'react';
import { Project } from '../types';
import { Icon } from '../components/Icon';
import { sound } from '../services/soundEngine';

interface ProjectsAppProps {
  projectsData: Project[];
  selectedProject: Project | null;
  setSelectedProject: (p: Project) => void;
  isSyncingGithub: boolean;
}

export const ProjectsApp: React.FC<ProjectsAppProps> = ({
  projectsData,
  selectedProject,
  setSelectedProject,
  isSyncingGithub
}) => {
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filtered = useMemo(() => {
    return projectsData.filter(p => {
      const matchCat = filterCategory === "ALL" || p.category === filterCategory;
      const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [projectsData, filterCategory, searchQuery]);

  return (
    <div className="h-full flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-os-border">
      <div className="w-full md:w-56 p-4 bg-os-panel shrink-0 space-y-4">
        <div className="text-xs font-semibold text-os-muted uppercase tracking-wider px-2 flex justify-between items-center">
          <span>File Explorer</span>
          {isSyncingGithub && <span className="text-[10px] text-sky-400 animate-pulse font-mono">Syncing...</span>}
        </div>

        <div className="space-y-1 text-xs font-medium">
          {[
            { id: "ALL", label: "All Repositories", icon: "FolderRoot" },
            { id: "Systems", label: "Systems & Engines", icon: "Cpu" },
            { id: "AI / ML", label: "AI & ML", icon: "Bot" },
            { id: "Web & Graphics", label: "Graphics & Web", icon: "Layers" },
            { id: "Fullstack", label: "Full-Stack Apps", icon: "Code" }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => { sound.playClick(); setFilterCategory(cat.id); }}
              className={`w-full px-2.5 py-2 rounded-xl flex items-center gap-2.5 text-left transition-colors ${
                filterCategory === cat.id
                  ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30'
                  : 'text-os-muted hover:bg-white/[0.04] hover:text-slate-200'
              }`}
            >
              <Icon name={cat.icon} className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-os-border bg-os-panel flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-os-muted overflow-hidden">
            <Icon name="Folder" className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="text-slate-400">jaiOS</span>
            <span>/</span>
            <span className="text-slate-400">projects</span>
            <span>/</span>
            <span className="text-sky-300 font-semibold truncate">{filterCategory.toLowerCase()}</span>
          </div>
          <div className="relative w-48 sm:w-64">
            <Icon name="Search" className="w-3.5 h-3.5 text-os-muted absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter repositories..."
              className="w-full pl-8 pr-2.5 py-1.5 bg-os-surface border border-os-border rounded-lg text-xs text-white placeholder-os-muted focus:outline-none focus:border-sky-400 font-mono"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 auto-rows-max">
            {filtered.map(proj => {
              const isSelected = selectedProject?.id === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => { sound.playClick(); setSelectedProject(proj); }}
                  className={`p-4 rounded-xl border cursor-pointer os-card-hover transition-all text-left flex flex-col justify-between ${
                    isSelected
                      ? 'bg-os-card border-sky-400/50 shadow-lg ring-1 ring-sky-400/20'
                      : 'bg-os-panel border-os-border hover:border-os-border/90'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
                          <Icon name="FolderGit2" className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white leading-none">{proj.name}</h4>
                          <span className="text-[10px] font-mono text-os-muted">{proj.date}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-os-surface text-sky-300 border border-os-border">
                        ★ {proj.stars}
                      </span>
                    </div>
                    <p className="text-xs text-os-muted line-clamp-2 leading-relaxed selectable-text">
                      {proj.summary}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3 pt-2 border-t border-os-border/50">
                    {proj.tech.slice(0, 3).map(t => (
                      <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-os-surface text-slate-300 border border-os-border">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedProject && (
            <div className="w-full lg:w-96 p-5 bg-os-panel border-t lg:border-t-0 lg:border-l border-os-border overflow-y-auto space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30 font-semibold">
                    {selectedProject.category}
                  </span>
                  <span className="text-xs font-mono text-os-muted">Released {selectedProject.date}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-2">{selectedProject.name}</h3>
                <p className="text-xs font-medium text-sky-300 mt-0.5">{selectedProject.tagline}</p>
              </div>

              <div className="flex gap-2">
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 rounded-lg bg-os-card hover:bg-os-surface border border-os-border text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Icon name="Github" className="w-3.5 h-3.5" />
                  <span>Repository</span>
                </a>
                <a
                  href={selectedProject.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Icon name="ExternalLink" className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                </a>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-os-surface border border-os-border">
                  <div className="font-semibold text-rose-300 flex items-center gap-1.5 mb-1">
                    <Icon name="AlertCircle" className="w-3.5 h-3.5" />
                    The Problem
                  </div>
                  <p className="text-os-muted leading-relaxed selectable-text">{selectedProject.problem}</p>
                </div>

                <div className="p-3 rounded-xl bg-os-surface border border-os-border">
                  <div className="font-semibold text-emerald-300 flex items-center gap-1.5 mb-1">
                    <Icon name="CheckCircle2" className="w-3.5 h-3.5" />
                    Engineering Solution
                  </div>
                  <p className="text-os-muted leading-relaxed selectable-text">{selectedProject.solution}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-200">Architecture Pipeline:</div>
                <div className="p-3 rounded-xl bg-os-surface border border-os-border font-mono text-[11px] text-sky-300 leading-relaxed selectable-text">
                  {selectedProject.architecture}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-200">Key Highlights:</div>
                <ul className="space-y-1.5 text-xs text-os-muted">
                  {selectedProject.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 selectable-text">
                      <span className="text-sky-400 mt-0.5">▹</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-os-border">
                <div className="text-xs font-semibold text-slate-200 font-mono">Tech Stack:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.tech.map(t => (
                    <span key={t} className="text-xs font-mono px-2 py-1 rounded bg-os-surface border border-os-border text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
