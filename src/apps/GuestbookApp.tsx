import React from 'react';
import { StickyNote } from '../types';
import { Icon } from '../components/Icon';

interface GuestbookAppProps {
  stickyNotes: StickyNote[];
  isAddingNote: boolean;
  setIsAddingNote: (v: boolean) => void;
  newNoteAuthor: string;
  setNewNoteAuthor: (v: string) => void;
  newNoteRole: string;
  setNewNoteRole: (v: string) => void;
  newNoteText: string;
  setNewNoteText: (v: string) => void;
  handleAddStickyNote: (e: React.FormEvent) => void;
}

export const GuestbookApp: React.FC<GuestbookAppProps> = ({
  stickyNotes,
  isAddingNote,
  setIsAddingNote,
  newNoteAuthor,
  setNewNoteAuthor,
  newNoteRole,
  setNewNoteRole,
  newNoteText,
  setNewNoteText,
  handleAddStickyNote
}) => {
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="p-4 rounded-2xl bg-os-panel border border-os-border flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Icon name="StickyNote" className="w-4 h-4 text-amber-400" />
            Community Guestbook & Sticky Wall
          </h2>
          <p className="text-xs text-os-muted">Leave a permanent note, endorsement, or greeting on JaiOS</p>
        </div>
        <button
          onClick={() => setIsAddingNote(!isAddingNote)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Icon name={isAddingNote ? "X" : "Plus"} className="w-4 h-4" />
          <span>{isAddingNote ? "Cancel" : "Leave a Note"}</span>
        </button>
      </div>

      {isAddingNote && (
        <form
          onSubmit={handleAddStickyNote}
          className="p-5 rounded-2xl bg-os-card border border-amber-500/40 space-y-4 animate-slide-down shadow-2xl"
        >
          <div className="text-xs font-bold text-amber-300 font-mono uppercase tracking-wider">
            Post to Sticky Wall
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Your Name (e.g. Linus Torvalds)"
              value={newNoteAuthor}
              onChange={(e) => setNewNoteAuthor(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-os-surface border border-os-border text-xs text-white placeholder-os-muted focus:outline-none focus:border-amber-400"
            />
            <input
              type="text"
              placeholder="Role / Handle (e.g. Developer)"
              value={newNoteRole}
              onChange={(e) => setNewNoteRole(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-os-surface border border-os-border text-xs text-white placeholder-os-muted focus:outline-none focus:border-amber-400"
            />
          </div>
          <textarea
            required
            rows={3}
            placeholder="Write your note or greeting..."
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-os-surface border border-os-border text-xs text-white placeholder-os-muted focus:outline-none focus:border-amber-400 resize-none"
          />
          <button
            type="submit"
            className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Icon name="Pin" className="w-3.5 h-3.5" />
            <span>Pin Note to Board</span>
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
        {stickyNotes.map(note => (
          <div
            key={note.id}
            style={{ transform: `rotate(${note.rotation})` }}
            className={`p-5 rounded-2xl border shadow-xl transition-transform hover:scale-105 hover:z-10 ${note.color} flex flex-col justify-between space-y-3 min-h-[170px] backdrop-blur-md`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-3 h-3 rounded-full bg-white/20 border border-white/40" />
                <span className="text-[10px] font-mono opacity-60">{note.date}</span>
              </div>
              <p className="text-xs leading-relaxed font-sans font-medium selectable-text">
                "{note.text}"
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white leading-none">{note.author}</div>
                <div className="text-[10px] opacity-70 mt-0.5">{note.role}</div>
              </div>
              <Icon name="Pin" className="w-3.5 h-3.5 opacity-40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
