import React, { useState, useEffect, useCallback } from 'react';
import { WindowState, DeveloperProfile, Project, StickyNote, NotificationItem } from './types';
import { sound } from './services/soundEngine';
import { fetchGitHubProfileData } from './services/githubService';
import { fetchGlobalGuestbookNotes, saveGlobalGuestbookNote } from './services/guestbookService';
import {
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
  SKILLS_DATA,
  EXPERIENCE_DATA,
  BUILD_LOGS,
  INITIAL_STICKY_NOTES,
  TRASH_ITEMS,
  APP_DEFINITIONS
} from './data/initialData';

import { BootScreen } from './components/BootScreen';
import { MobileLauncher } from './components/MobileLauncher';
import { Window } from './components/Window';
import { Taskbar } from './components/Taskbar';
import { StartMenu } from './components/StartMenu';
import { Icon } from './components/Icon';

import { AboutApp } from './apps/AboutApp';
import { ProjectsApp } from './apps/ProjectsApp';
import { SkillsApp } from './apps/SkillsApp';
import { ExperienceApp } from './apps/ExperienceApp';
import { BuildLogApp } from './apps/BuildLogApp';
import { AIAssistantApp } from './apps/AIAssistantApp';
import { GuestbookApp } from './apps/GuestbookApp';
import { TerminalApp } from './apps/TerminalApp';
import { ContactApp } from './apps/ContactApp';
import { ResumeApp } from './apps/ResumeApp';
import { SettingsApp } from './apps/SettingsApp';
import { TrashApp } from './apps/TrashApp';

export const App: React.FC = () => {
  // System States
  const [bootState, setBootState] = useState<'booting' | 'ready' | 'desktop'>('booting');
  const [bootProgress, setBootProgress] = useState<number>(0);
  const [bootLogs] = useState<string[]>([
    "Initializing kernel memory...",
    "Loading hardware drivers & WebGPU context...",
    "Mounting virtual file system...",
    "Connecting to GitHub REST API telemetry...",
    "Loading JaiOS persona & AI assistant..."
  ]);

  // GitHub & Settings State
  const [githubUsername, setGithubUsername] = useState<string>(() => localStorage.getItem('kaelos_github_user') || 'Jaivardhan-Raahi');
  const [githubPAT, setGithubPAT] = useState<string>(() => sessionStorage.getItem('kaelos_github_pat') || '');
  const [profileData, setProfileData] = useState<DeveloperProfile>(DEFAULT_PROFILE);
  const [projectsData, setProjectsData] = useState<Project[]>(DEFAULT_PROJECTS);
  const [isSyncingGithub, setIsSyncingGithub] = useState<boolean>(false);
  const [githubSyncError, setGithubSyncError] = useState<string | null>(null);

  // Active Windows Manager State
  const [activeWindows, setActiveWindows] = useState<WindowState[]>([
    { id: "about", zIndex: 10, isMinimized: false, isMaximized: false, position: { x: 80, y: 50 }, size: { width: 820, height: 580 } }
  ]);
  const [focusedWindowId, setFocusedWindowId] = useState<string | null>("about");
  const [topZ, setTopZ] = useState<number>(12);

  // OS Flyout States
  const [startMenuOpen, setStartMenuOpen] = useState<boolean>(false);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState<boolean>(false);
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const iconClickTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const iconClickCountRef = React.useRef<Record<string, number>>({});
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project>(DEFAULT_PROJECTS[0]);

  // Guestbook – loaded from Firestore (shared across all visitors)
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>(INITIAL_STICKY_NOTES);

  useEffect(() => {
    fetchGlobalGuestbookNotes(INITIAL_STICKY_NOTES).then(setStickyNotes);
  }, []);
  const [newNoteAuthor, setNewNoteAuthor] = useState("");
  const [newNoteRole, setNewNoteRole] = useState("");
  const [newNoteText, setNewNoteText] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSending, setContactSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  // Mobile Device Check
  const [isMobile, setIsMobile] = useState(false);
  const [mobileActiveApp, setMobileActiveApp] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // localStorage sync handled inside guestbookService

  // Fetch real GitHub API data dynamically
  const fetchGithubProfile = useCallback(async (username: string, token = "") => {
    if (!username) return;
    setIsSyncingGithub(true);
    setGithubSyncError(null);
    try {
      const { profile, projects } = await fetchGitHubProfileData(username, token);
      setProfileData(prev => ({
        ...prev,
        ...profile,
        stats: { ...prev.stats, ...(profile.stats || {}) }
      }));
      if (projects.length > 0) {
        setProjectsData(projects);
        setSelectedProject(projects[0]);
      }
      // Notify only when triggered manually (not on initial boot)
      if (token) {
        setNotifications(prev => [{
          id: Date.now().toString(), title: "GitHub Synced",
          message: `Loaded ${projects.length} repos from @${username}`, icon: "Github", time: "Just now"
        }, ...prev].slice(0, 5));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "GitHub sync failed";
      setGithubSyncError(msg);
      console.warn("[GitHub API]", msg);
    } finally {
      setIsSyncingGithub(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchGithubProfile(githubUsername, githubPAT);
  }, [fetchGithubProfile, githubUsername, githubPAT]);


  // Boot sequence progress
  useEffect(() => {
    if (bootState === 'booting') {
      const interval = setInterval(() => {
        setBootProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setBootState('ready');
            return 100;
          }
          return prev + 20;
        });
      }, 120);
      return () => clearInterval(interval);
    }
  }, [bootState]);

  const addNotification = useCallback((title: string, message: string, icon = "Info") => {
    const id = Date.now().toString();
    setNotifications(prev => [{ id, title, message, icon, time: "Just now" }, ...prev].slice(0, 5));
    sound.playPop();
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5500);
  }, []);

  const launchDesktop = () => {
    sound.playBootChime();
    setBootState('desktop');
    setTimeout(() => {
      addNotification("System Ready", "Welcome to JaiOS v3.4. Explore applications via Desktop or Start Menu.", "CheckCircle2");
    }, 800);
  };

  const openWindow = useCallback((appId: string) => {
    sound.playClick();
    if (isMobile) {
      setMobileActiveApp(appId);
      setStartMenuOpen(false);
      return;
    }

    setStartMenuOpen(false);

    setActiveWindows(prev => {
      const highestZ = Math.max(...prev.map(w => w.zIndex), 10) + 1;
      const existing = prev.find(w => w.id === appId);

      if (existing) {
        return prev.map(w => w.id === appId ? { ...w, isMinimized: false, zIndex: highestZ } : w);
      } else {
        const offset = (prev.length % 5) * 32;
        const defaultWidth = Math.min(window.innerWidth - 60, appId === 'terminal' ? 720 : (appId === 'projects' ? 940 : 840));
        const defaultHeight = Math.min(window.innerHeight - 120, appId === 'terminal' ? 480 : 620);
        const newWin: WindowState = {
          id: appId,
          zIndex: highestZ,
          isMinimized: false,
          isMaximized: false,
          position: { x: Math.max(40, 80 + offset), y: Math.max(30, 50 + offset) },
          size: { width: defaultWidth, height: defaultHeight }
        };
        return [...prev, newWin];
      }
    });

    setFocusedWindowId(appId);

    const appDef = APP_DEFINITIONS.find(a => a.id === appId);
    if (appDef && appId !== 'about') {
      addNotification(`Launched ${appDef.title}`, appDef.short, appDef.icon);
    }
  }, [isMobile, addNotification]);

  const closeWindow = useCallback((appId: string) => {
    sound.playClick();
    setActiveWindows(prev => prev.filter(w => w.id !== appId));
    setFocusedWindowId(prevId => (prevId === appId ? null : prevId));
  }, []);

  const minimizeWindow = useCallback((appId: string) => {
    sound.playClick();
    setActiveWindows(prev => prev.map(w => w.id === appId ? { ...w, isMinimized: true } : w));
    setFocusedWindowId(prevId => (prevId === appId ? null : prevId));
  }, []);

  const toggleMaximize = useCallback((appId: string) => {
    sound.playClick();
    setActiveWindows(prev => prev.map(w => w.id === appId ? { ...w, isMaximized: !w.isMaximized } : w));
  }, []);

  const focusWindow = useCallback((appId: string) => {
    setFocusedWindowId(appId);
    setActiveWindows(prev => {
      const highestZ = Math.max(...prev.map(w => w.zIndex), 10) + 1;
      return prev.map(w => w.id === appId ? { ...w, zIndex: highestZ, isMinimized: false } : w);
    });
  }, []);

  const handleWindowDrag = (e: React.MouseEvent, winId: string) => {
    const target = e.target as HTMLElement;
    if (target.closest('.window-control-btn') || target.closest('.no-drag')) return;
    const win = activeWindows.find(w => w.id === winId);
    if (!win || win.isMaximized) return;

    focusWindow(winId);
    const startX = e.clientX;
    const startY = e.clientY;
    const initialPosX = win.position.x;
    const initialPosY = win.position.y;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const newX = Math.max(0, Math.min(window.innerWidth - 100, initialPosX + dx));
      const newY = Math.max(0, Math.min(window.innerHeight - 80, initialPosY + dy));
      setActiveWindows(prev => prev.map(w => w.id === winId ? { ...w, position: { x: newX, y: newY } } : w));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleWindowResize = (e: React.MouseEvent, winId: string, direction: string) => {
    e.stopPropagation();
    e.preventDefault();
    const win = activeWindows.find(w => w.id === winId);
    if (!win || win.isMaximized) return;

    focusWindow(winId);
    const startX = e.clientX;
    const startY = e.clientY;
    const initialWidth = win.size.width;
    const initialHeight = win.size.height;
    const initialPosX = win.position.x;
    const initialPosY = win.position.y;

    const minW = 400;
    const minH = 300;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let newW = initialWidth;
      let newH = initialHeight;
      let newX = initialPosX;
      let newY = initialPosY;

      if (direction.includes('e')) newW = Math.max(minW, initialWidth + dx);
      if (direction.includes('s')) newH = Math.max(minH, initialHeight + dy);
      if (direction.includes('w')) {
        const potentialW = initialWidth - dx;
        if (potentialW >= minW) {
          newW = potentialW;
          newX = initialPosX + dx;
        }
      }
      if (direction.includes('n')) {
        const potentialH = initialHeight - dy;
        if (potentialH >= minH) {
          newH = potentialH;
          newY = initialPosY + dy;
        }
      }

      setActiveWindows(prev => prev.map(w => w.id === winId ? {
        ...w,
        size: { width: newW, height: newH },
        position: { x: newX, y: newY }
      } : w));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleAddStickyNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteAuthor.trim() || !newNoteText.trim()) return;
    const rotations = ["-2deg", "-1deg", "1.5deg", "2.2deg", "-1.8deg"];
    const colors = [
      "bg-amber-950/40 border-amber-500/30 text-amber-200",
      "bg-sky-950/40 border-sky-500/30 text-sky-200",
      "bg-emerald-950/40 border-emerald-500/30 text-emerald-200",
      "bg-rose-950/40 border-rose-500/30 text-rose-200"
    ];
    const randomRot = rotations[Math.floor(Math.random() * rotations.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newNote: StickyNote = {
      id: `note-${Date.now()}`,
      author: newNoteAuthor.trim(),
      role: newNoteRole.trim() || "Visitor",
      text: newNoteText.trim(),
      date: "Just now",
      rotation: randomRot,
      color: randomColor
    };

    saveGlobalGuestbookNote(newNote, stickyNotes).then(updated => {
      setStickyNotes(updated);
    });

    setNewNoteAuthor("");
    setNewNoteRole("");
    setNewNoteText("");
    setIsAddingNote(false);
    addNotification("Guestbook Signed", `Note added from ${newNote.author}!`, "StickyNote");
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSending(true);
    setTimeout(() => {
      setContactSending(false);
      setContactSent(true);
      addNotification("Message Dispatched", `Thank you ${contactForm.name}, your message has been buffered.`, "Send");
      setContactForm({ name: "", email: "", message: "" });
      setTimeout(() => setContactSent(false), 6000);
    }, 800);
  };

  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    sound.enabled = !next;
    if (!next) sound.playClick();
  };

  const renderAppContent = (appId: string) => {
    switch (appId) {
      case "about":
        return <AboutApp profileData={profileData} openWindow={openWindow} />;
      case "projects":
        return (
          <ProjectsApp
            projectsData={projectsData}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            isSyncingGithub={isSyncingGithub}
          />
        );
      case "skills":
        return <SkillsApp skillsData={SKILLS_DATA} />;
      case "experience":
        return <ExperienceApp experienceData={EXPERIENCE_DATA} />;
      case "buildlog":
        return <BuildLogApp buildLogs={BUILD_LOGS} />;
      case "ai-assistant":
        return <AIAssistantApp profileData={profileData} projectsData={projectsData} openWindow={openWindow} />;
      case "guestbook":
        return (
          <GuestbookApp
            stickyNotes={stickyNotes}
            isAddingNote={isAddingNote}
            setIsAddingNote={setIsAddingNote}
            newNoteAuthor={newNoteAuthor}
            setNewNoteAuthor={setNewNoteAuthor}
            newNoteRole={newNoteRole}
            setNewNoteRole={setNewNoteRole}
            newNoteText={newNoteText}
            setNewNoteText={setNewNoteText}
            handleAddStickyNote={handleAddStickyNote}
          />
        );
      case "terminal":
        return (
          <TerminalApp
            profileData={profileData}
            projectsData={projectsData}
            skillsData={SKILLS_DATA}
            appDefinitions={APP_DEFINITIONS}
            openWindow={openWindow}
          />
        );
      case "contact":
        return (
          <ContactApp
            profileData={profileData}
            contactForm={contactForm}
            setContactForm={setContactForm}
            handleContactSubmit={handleContactSubmit}
            contactSending={contactSending}
            contactSent={contactSent}
          />
        );
      case "resume":
        return <ResumeApp profileData={profileData} addNotification={addNotification} />;
      case "settings":
        return (
          <SettingsApp
            githubUsername={githubUsername}
            setGithubUsername={setGithubUsername}
            githubPAT={githubPAT}
            setGithubPAT={setGithubPAT}
            fetchGithubProfile={fetchGithubProfile}
            isSyncingGithub={isSyncingGithub}
            githubSyncError={githubSyncError}
            addNotification={addNotification}
          />
        );
      case "trash":
        return <TrashApp trashItems={TRASH_ITEMS} addNotification={addNotification} />;
      default:
        return <div className="p-8 text-center text-os-muted">Application content unavailable.</div>;
    }
  };

  if (bootState === 'booting' || bootState === 'ready') {
    return (
      <BootScreen
        bootProgress={bootProgress}
        bootLogs={bootLogs}
        bootState={bootState}
        launchDesktop={launchDesktop}
        handleName={profileData.handle}
      />
    );
  }

  if (isMobile) {
    return (
      <MobileLauncher
        currentTime={currentTime}
        profileData={profileData}
        appDefinitions={APP_DEFINITIONS}
        mobileActiveApp={mobileActiveApp}
        setMobileActiveApp={setMobileActiveApp}
        renderAppContent={renderAppContent}
      />
    );
  }

  return (
    <div
      className="relative w-screen h-screen bg-os-bg text-os-text overflow-hidden select-none flex flex-col font-sans"
      onClick={() => {
        if (startMenuOpen) setStartMenuOpen(false);
        if (quickSettingsOpen) setQuickSettingsOpen(false);
        if (calendarOpen) setCalendarOpen(false);
      }}
    >
      <div className="absolute inset-0 wallpaper-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div
        className="relative flex-1 p-6 z-0 overflow-hidden"
        onClick={() => setSelectedIconId(null)}
      >
        <div className="grid grid-flow-col grid-rows-6 gap-3 w-max select-none">
          {APP_DEFINITIONS.map(app => {
            const isSelected = selectedIconId === app.id;
            return (
              <div
                key={app.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIconId(app.id);
                  openWindow(app.id);
                }}
                className={`group w-24 h-24 p-2 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-sky-500/20 border-sky-400/40 shadow-lg'
                    : 'bg-transparent border-transparent hover:bg-white/[0.04] hover:border-white/10'
                }`}
              >
                <div className="relative w-12 h-12 rounded-xl bg-os-panel border border-os-border flex items-center justify-center text-sky-400 shadow-md group-hover:scale-105 group-hover:border-sky-400/40 transition-transform">
                  <Icon name={app.icon} className="w-6 h-6" />
                  {app.id === 'trash' && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-700 text-[9px] font-mono flex items-center justify-center text-white border border-slate-600">
                      4
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium text-slate-200 text-center leading-tight truncate max-w-full px-1 drop-shadow-md">
                  {app.title}
                </span>
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-6 right-8 text-right pointer-events-none select-none opacity-40 font-mono text-xs space-y-0.5">
          <div className="font-semibold text-slate-400">JaiOS Workstation</div>
          <div>Kernel 2026.4 — x86_64</div>
          <div>Uptime: {profileData.stats.uptime}</div>
        </div>

        {activeWindows.map(win => {
          const appDef = APP_DEFINITIONS.find(a => a.id === win.id);
          if (!appDef || win.isMinimized) return null;
          const isFocused = focusedWindowId === win.id;

          return (
            <Window
              key={win.id}
              win={win}
              appDef={appDef}
              isFocused={isFocused}
              onFocus={() => focusWindow(win.id)}
              onClose={() => closeWindow(win.id)}
              onMinimize={() => minimizeWindow(win.id)}
              onMaximize={() => toggleMaximize(win.id)}
              onDragStart={(e) => handleWindowDrag(e, win.id)}
              onResizeStart={(e, dir) => handleWindowResize(e, win.id, dir)}
            >
              {renderAppContent(win.id)}
            </Window>
          );
        })}
      </div>

      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className="pointer-events-auto bg-os-panel/95 border border-sky-500/30 text-white rounded-xl p-3.5 shadow-2xl flex items-start gap-3 animate-slide-down backdrop-blur-xl"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
              <Icon name={notif.icon} className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white truncate">{notif.title}</span>
                <span className="text-[10px] text-os-muted font-mono">{notif.time}</span>
              </div>
              <p className="text-xs text-os-muted mt-0.5 leading-relaxed">{notif.message}</p>
            </div>
            <button
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
              className="text-os-muted hover:text-white"
            >
              <Icon name="X" className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {startMenuOpen && (
        <StartMenu
          profileData={profileData}
          appDefinitions={APP_DEFINITIONS}
          openWindow={openWindow}
          restartSystem={() => setBootState('ready')}
        />
      )}

      {quickSettingsOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-14 right-4 w-80 bg-os-panel/95 border border-os-border rounded-2xl os-window-shadow z-40 p-4 flex flex-col gap-4 animate-slide-up backdrop-blur-2xl"
        >
          <div className="text-xs font-semibold text-slate-300 border-b border-os-border pb-2 flex justify-between items-center">
            <span>Quick Settings & Diagnostics</span>
            <span className="font-mono text-[10px] text-sky-400">STATUS: OK</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-os-surface border border-os-border flex items-center gap-2.5">
              <Icon name="Wifi" className="w-4 h-4 text-emerald-400" />
              <div className="text-xs">
                <div className="font-medium text-white">Network</div>
                <div className="text-[10px] text-os-muted">Gigabit Fiber (0.8ms)</div>
              </div>
            </div>
            <div
              onClick={toggleSound}
              className="p-2.5 rounded-xl bg-os-surface border border-os-border flex items-center gap-2.5 cursor-pointer hover:border-sky-400/40"
            >
              <Icon name={soundMuted ? "VolumeX" : "Volume2"} className={`w-4 h-4 ${soundMuted ? 'text-rose-400' : 'text-sky-400'}`} />
              <div className="text-xs">
                <div className="font-medium text-white">Sound</div>
                <div className="text-[10px] text-os-muted">{soundMuted ? 'Muted' : 'Synthesizer On'}</div>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-os-surface border border-os-border flex items-center gap-2.5">
              <Icon name="Cpu" className="w-4 h-4 text-amber-400" />
              <div className="text-xs">
                <div className="font-medium text-white">CPU Load</div>
                <div className="text-[10px] text-os-muted">4.2% / 16 Threads</div>
              </div>
            </div>
            <div
              onClick={() => openWindow('settings')}
              className="p-2.5 rounded-xl bg-os-surface border border-os-border flex items-center gap-2.5 cursor-pointer hover:border-sky-400/40"
            >
              <Icon name="Github" className="w-4 h-4 text-indigo-400" />
              <div className="text-xs">
                <div className="font-medium text-white">GitHub API</div>
                <div className="text-[10px] text-sky-400 truncate">@{githubUsername}</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-os-border text-[11px] font-mono text-os-muted flex justify-between items-center">
            <span>Theme: Midnight Charcoal</span>
            <span>Accent: Sky Blue</span>
          </div>
        </div>
      )}

      {calendarOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-14 right-2 w-72 bg-os-panel/95 border border-os-border rounded-2xl os-window-shadow z-40 p-4 flex flex-col gap-3 animate-slide-up backdrop-blur-2xl font-mono text-xs"
        >
          <div className="flex justify-between items-center border-b border-os-border pb-2">
            <span className="font-bold text-white text-sm">
              {currentTime.toLocaleDateString([], { month: 'long', year: 'numeric' })}
            </span>
            <span className="text-sky-400 font-semibold">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
          <div className="text-os-muted text-[11px] leading-relaxed">
            <div>Date: {currentTime.toDateString()}</div>
            <div>Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
            <div className="text-emerald-400 mt-2">● Systems nominal, accepting collaborations.</div>
          </div>
        </div>
      )}

      <Taskbar
        startMenuOpen={startMenuOpen}
        setStartMenuOpen={setStartMenuOpen}
        quickSettingsOpen={quickSettingsOpen}
        setQuickSettingsOpen={setQuickSettingsOpen}
        calendarOpen={calendarOpen}
        setCalendarOpen={setCalendarOpen}
        activeWindows={activeWindows}
        focusedWindowId={focusedWindowId}
        appDefinitions={APP_DEFINITIONS}
        currentTime={currentTime}
        soundMuted={soundMuted}
        toggleSound={toggleSound}
        openWindow={openWindow}
        focusWindow={focusWindow}
        minimizeWindow={minimizeWindow}
      />
    </div>
  );
};
