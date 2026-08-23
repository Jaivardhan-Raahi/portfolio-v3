import React from 'react';
import { TrashItem } from '../types';
import { Icon } from '../components/Icon';

interface TrashAppProps {
  trashItems: TrashItem[];
  addNotification: (title: string, message: string, icon?: string) => void;
}

export const TrashApp: React.FC<TrashAppProps> = ({ trashItems, addNotification }) => {
  return (
    <div className="p-6 space-y-5 max-w-3xl mx-auto font-mono text-xs">
      <div className="p-4 rounded-2xl bg-os-panel border border-os-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon name="Trash2" className="w-5 h-5 text-rose-400" />
          <div>
            <h3 className="font-bold text-white text-sm">Recycle Bin</h3>
            <p className="text-os-muted text-[11px]">4 discarded artifacts from previous engineering iterations</p>
          </div>
        </div>
        <button
          onClick={() => addNotification("Trash Notice", "Cannot empty recycle bin: memories are write-protected.", "AlertCircle")}
          className="px-3 py-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/50 border border-rose-500/30 text-rose-300 text-xs transition-colors"
        >
          Empty Bin
        </button>
      </div>

      <div className="space-y-2">
        {trashItems.map((item, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-os-panel border border-os-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="font-bold text-slate-200 font-mono">{item.name}</div>
              <p className="text-os-muted text-[11px] font-sans mt-0.5">{item.note}</p>
            </div>
            <div className="text-right text-[11px] text-os-muted shrink-0">
              <span className="text-sky-400 font-semibold">{item.size}</span> • {item.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
