import React from 'react';
import { DeveloperProfile } from '../types';
import { Icon } from '../components/Icon';

interface ContactAppProps {
  profileData: DeveloperProfile;
  contactForm: { name: string; email: string; message: string };
  setContactForm: React.Dispatch<React.SetStateAction<{ name: string; email: string; message: string }>>;
  handleContactSubmit: (e: React.FormEvent) => void;
  contactSending: boolean;
  contactSent: boolean;
}

export const ContactApp: React.FC<ContactAppProps> = ({
  profileData,
  contactForm,
  setContactForm,
  handleContactSubmit,
  contactSending,
  contactSent
}) => {
  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div className="p-5 rounded-2xl bg-os-panel border border-os-border space-y-2">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Icon name="Mail" className="w-5 h-5 text-sky-400" />
          Direct Communication Channel
        </h2>
        <p className="text-xs text-os-muted leading-relaxed selectable-text">
          Have a full-stack project, an AI infrastructure roadmap, or a engineering role to discuss? Dispatch a message below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-os-panel border border-os-border space-y-1">
            <div className="text-[10px] text-os-muted uppercase">Direct Email</div>
            <a href={`mailto:${profileData.email}`} className="font-semibold text-sky-400 hover:underline truncate block">
              {profileData.email}
            </a>
          </div>

          <div className="p-3.5 rounded-xl bg-os-panel border border-os-border space-y-1">
            <div className="text-[10px] text-os-muted uppercase">GitHub Profile</div>
            <a href={profileData.github} target="_blank" rel="noreferrer" className="font-semibold text-slate-200 hover:underline truncate block">
              github.com/{profileData.handle}
            </a>
          </div>

          <div className="p-3.5 rounded-xl bg-os-panel border border-os-border space-y-1">
            <div className="text-[10px] text-os-muted uppercase">PGP Fingerprint</div>
            <div className="text-[10px] text-os-muted truncate">
              8F2A 99D1 4C09 7E11 B88A
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          {contactSent ? (
            <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2 animate-scale-up">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Icon name="CheckCircle2" className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">Message Dispatched Successfully</h3>
              <p className="text-xs text-emerald-200/80">{profileData.name} will respond directly to your email address.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="p-5 rounded-2xl bg-os-panel border border-os-border space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Ada Lovelace"
                    className="w-full px-3.5 py-2 rounded-xl bg-os-surface border border-os-border text-xs text-white placeholder-os-muted focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="ada@computing.org"
                    className="w-full px-3.5 py-2 rounded-xl bg-os-surface border border-os-border text-xs text-white placeholder-os-muted focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Discussing a project, role, or opportunity..."
                  className="w-full px-3.5 py-2 rounded-xl bg-os-surface border border-os-border text-xs text-white placeholder-os-muted focus:outline-none focus:border-sky-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={contactSending}
                className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-sky-500/20"
              >
                {contactSending ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Transmitting Packet...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Send" className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
