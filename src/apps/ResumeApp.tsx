import React from 'react';
import { DeveloperProfile } from '../types';
import { Icon } from '../components/Icon';

interface ResumeAppProps {
  profileData: DeveloperProfile;
  addNotification: (title: string, message: string, icon?: string) => void;
}

export const ResumeApp: React.FC<ResumeAppProps> = ({ profileData, addNotification }) => {
  return (
    <div className="p-6 space-y-4 max-w-3xl mx-auto">
      <div className="p-3 bg-os-panel border border-os-border rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-os-muted">
          <Icon name="FileText" className="w-4 h-4 text-sky-400" />
          <span className="text-white font-semibold">{profileData.handle}_Resume_2026.pdf</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg bg-os-surface hover:bg-os-card border border-os-border text-xs text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Icon name="Printer" className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            onClick={() => addNotification("Resume Download", "Downloading CV PDF...", "FileText")}
            className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Icon name="Download" className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-os-surface border border-os-border text-xs text-slate-300 space-y-6 shadow-2xl selectable-text font-sans">
        <div className="border-b border-os-border pb-4 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{profileData.name}</h1>
            <p className="text-xs text-sky-400 font-semibold mt-0.5">{profileData.role}</p>
          </div>
          <div className="text-right font-mono text-[11px] text-os-muted">
            <div>{profileData.email}</div>
            <div>{profileData.location}</div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-white uppercase tracking-wider text-[11px] border-b border-os-border/60 pb-1 font-mono">
            Professional Experience
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between font-semibold text-white">
                <span>Full-Stack & Systems Engineer — Software & Open Source</span>
                <span className="font-mono text-os-muted text-[11px]">2024 — Present</span>
              </div>
              <p className="text-os-muted mt-1 leading-relaxed">
                Architecting interactive web applications, high-throughput microservices, and AI agent runtimes. Leading full-stack frontend design and API systems integration.
              </p>
            </div>
            <div>
              <div className="flex justify-between font-semibold text-white">
                <span>Open Source Contributor & Builder — GitHub</span>
                <span className="font-mono text-os-muted text-[11px]">2022 — Present</span>
              </div>
              <p className="text-os-muted mt-1 leading-relaxed">
                Building open source repositories for modern web platforms, vector retrieval, and developer toolchains on GitHub (@Jaivardhan-Raahi).
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-white uppercase tracking-wider text-[11px] border-b border-os-border/60 pb-1 font-mono">
            Education
          </h3>
          <div className="flex justify-between font-semibold text-white">
            <span>B.Tech in Computer Science Engineering</span>
            <span className="font-mono text-os-muted text-[11px]">2020 — 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};
