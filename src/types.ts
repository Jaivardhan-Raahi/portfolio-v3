export interface DeveloperProfile {
  name: string;
  handle: string;
  role: string;
  status: string;
  location: string;
  avatar: string;
  email: string;
  github: string;
  linkedin: string;
  x: string;
  stats: {
    contributions: number;
    streak: number;
    longestStreak: number;
    stars: string;
    repos: number;
    uptime: string;
  };
  systemProfile: {
    focus: string;
    learning: string;
    favoriteStack: string[];
    philosophy: string;
  };
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  category: "Systems" | "AI / ML" | "Web & Graphics" | "Fullstack";
  date: string;
  stars: number;
  tech: string[];
  summary: string;
  problem: string;
  solution: string;
  architecture: string;
  features: string[];
  github: string;
  demo: string;
}

export interface SkillItem {
  name: string;
  level: string;
  experience: string;
  metric: string;
  active: boolean;
}

export interface SkillCategory {
  category: string;
  status: string;
  items: SkillItem[];
}

export interface ExperienceEntry {
  id: string;
  role: string;
  org: string;
  type: "Full-Time" | "Milestone" | "Education" | "Contract";
  date: string;
  location: string;
  summary: string;
  tags: string[];
}

export interface BuildLogData {
  now: Array<{
    title: string;
    time: string;
    details: string;
    progress: number;
    tag: string;
  }>;
  recentlyShipped: Array<{
    title: string;
    date: string;
    description: string;
    linkText: string;
  }>;
  experiments: Array<{
    name: string;
    desc: string;
    status: string;
  }>;
  learning: string[];
  next: string[];
}

export interface StickyNote {
  id: string;
  author: string;
  role: string;
  text: string;
  date: string;
  rotation: string;
  color: string;
}

export interface TrashItem {
  name: string;
  size: string;
  date: string;
  note: string;
}

export interface WindowState {
  id: string;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface AppDefinition {
  id: string;
  title: string;
  icon: string;
  category: string;
  short: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  icon: string;
  time: string;
}
