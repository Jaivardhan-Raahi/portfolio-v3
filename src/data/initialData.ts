import { DeveloperProfile, Project, SkillCategory, ExperienceEntry, BuildLogData, StickyNote, TrashItem, AppDefinition } from '../types';

export const DEFAULT_PROFILE: DeveloperProfile = {
  name: "Jaivardhan Raahi",
  handle: "Jaivardhan-Raahi",
  role: "Full-Stack Developer, Systems Engineer & Builder",
  status: "Compiling next-gen web applications & AI runtimes",
  location: "India / Remote",
  avatar: "https://github.com/Jaivardhan-Raahi.png",
  email: "jaivardhan@raahi.dev",
  github: "https://github.com/Jaivardhan-Raahi",
  linkedin: "https://linkedin.com",
  x: "https://x.com",
  stats: {
    contributions: 1420,
    streak: 84,
    longestStreak: 180,
    stars: "450+",
    repos: 24,
    uptime: "99.98%"
  },
  systemProfile: {
    focus: "Full-stack Web Applications, Systems Performance & AI Agents",
    learning: "Local LLM inference, Rust & Distributed Systems",
    favoriteStack: ["TypeScript", "React", "Node.js", "Python", "Tailwind CSS"],
    philosophy: "Build intuitive, high-performance software that feels alive."
  }
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "portfolio-v3",
    name: "JaiOS Portfolio",
    tagline: "Personal Operating Environment & Desktop Portfolio in React/TS",
    badge: "Production / OSS",
    category: "Web & Graphics",
    date: "2026.08",
    stars: 128,
    tech: ["TypeScript", "React", "Tailwind CSS", "Vite", "Web Audio API"],
    summary: "Production-grade desktop OS experience designed as an interactive portfolio communicating developer skills, personality, and live GitHub telemetry.",
    problem: "Generic portfolio websites feel static and standard.",
    solution: "Created an authentic multi-window desktop interface with window dragging, 8-direction resizing, sound effects, AI assistant, and GitHub REST API integration.",
    architecture: "React 18 -> Custom Window Manager -> GitHub REST API -> LocalStorage Persistence -> Audio Synthesizer Engine",
    features: [
      "Real-time GitHub API repo and activity sync for @Jaivardhan-Raahi",
      "Interactive multi-window desktop with taskbar focus and status sync",
      "Context-aware Persona AI Assistant answering visitor queries",
      "Organic sticky note Guestbook board with localStorage persistence"
    ],
    github: "https://github.com/Jaivardhan-Raahi",
    demo: "http://localhost:3000"
  },
  {
    id: "nexus-kv",
    name: "Nexus-KV",
    tagline: "Distributed Raft-consensus Vector Database in Rust",
    badge: "Featured",
    category: "Systems",
    date: "2025.11",
    stars: 942,
    tech: ["Rust", "SIMD", "Raft", "gRPC", "io_uring"],
    summary: "Ultra-low latency vector database engine engineered for sub-millisecond approximate nearest neighbor (ANN) retrieval over multi-node clusters.",
    problem: "Existing vector databases suffer from high memory overhead and GC pauses under sustained 100k+ QPS vector ingest workloads.",
    solution: "Built a custom LSM-tree engine with SIMD-accelerated HNSW index serialization, zero-copy serialization, and Raft consensus.",
    architecture: "Client -> gRPC Gateway -> Raft Log (io_uring) -> MemTable (SIMD HNSW) -> Immutable SSTables on NVMe.",
    features: [
      "120k QPS per node at p99 < 1.4ms latency",
      "AVX-512 & ARM NEON vectorized cosine distance kernels",
      "Decoupled storage and compute with automated partition rebalancing",
      "Full ACID compliance with Raft consensus replication"
    ],
    github: "https://github.com/Jaivardhan-Raahi",
    demo: "https://github.com/Jaivardhan-Raahi"
  },
  {
    id: "synapse-flow",
    name: "SynapseFlow",
    tagline: "Deterministic Multi-Agent Execution Orchestrator",
    badge: "Featured",
    category: "AI / ML",
    date: "2025.08",
    stars: 610,
    tech: ["TypeScript", "Python", "WebSockets", "Redis", "LangGraph"],
    summary: "Declarative runtime for orchestrating autonomous AI agent teams with formal state verification, rollback support, and real-time execution graphs.",
    problem: "Multi-agent LLM loops frequently enter non-deterministic deadlock states or hallucinate recursive tool invocations without human circuit breakers.",
    solution: "Developed an actor-model state machine with time-travel debugging, semantic token throttling, and step-level human-in-the-loop approvals.",
    architecture: "Agent Graph Compiler -> Actor Scheduler -> Memory Context Ring -> Tool Sandbox Worker Pools.",
    features: [
      "Interactive WebGL canvas showing live multi-agent token stream",
      "Sub-10ms state transitions with zero-loss checkpoint serialization",
      "Automated fallback routes when model latency spikes",
      "Integrated sandboxed code execution in isolated microVMs"
    ],
    github: "https://github.com/Jaivardhan-Raahi",
    demo: "https://github.com/Jaivardhan-Raahi"
  }
];

export const SKILLS_DATA: SkillCategory[] = [
  {
    category: "Full-Stack Web & Platforms",
    status: "ACTIVE",
    items: [
      { name: "TypeScript / JavaScript", level: "Mastery", experience: "5+ yrs", metric: "Strict Type Runtimes", active: true },
      { name: "React / Next.js", level: "Mastery", experience: "4+ yrs", metric: "SSR / State Architecture", active: true },
      { name: "Node.js / Express", level: "Senior", experience: "4+ yrs", metric: "REST & WebSockets", active: true },
      { name: "Tailwind CSS", level: "Mastery", experience: "4+ yrs", metric: "Design Tokens & Responsive UI", active: true },
      { name: "WebAssembly", level: "Advanced", experience: "2 yrs", metric: "High-performance JS Interop", active: true }
    ]
  },
  {
    category: "Core Systems & Languages",
    status: "OPTIMAL",
    items: [
      { name: "Python", level: "Senior", experience: "4+ yrs", metric: "FastAPI / Data Processing", active: true },
      { name: "Rust", level: "Advanced", experience: "2 yrs", metric: "Memory Safety & SIMD", active: true },
      { name: "C / C++", level: "Proficient", experience: "2 yrs", metric: "Data Structures & Memory", active: true },
      { name: "Git & Linux", level: "Senior", experience: "5+ yrs", metric: "Version Control & Shell Scripts", active: true }
    ]
  },
  {
    category: "AI, ML & Databases",
    status: "ACCELERATED",
    items: [
      { name: "PyTorch / ONNX", level: "Advanced", experience: "2 yrs", metric: "Edge Model Deployment", active: true },
      { name: "Agent Frameworks", level: "Senior", experience: "2 yrs", metric: "LangChain / Multi-Agent", active: true },
      { name: "PostgreSQL / SQLite", level: "Senior", experience: "4+ yrs", metric: "Schema Design & Indexing", active: true },
      { name: "Redis", level: "Senior", experience: "3 yrs", metric: "Caching & Pub/Sub Channels", active: true }
    ]
  }
];

export const EXPERIENCE_DATA: ExperienceEntry[] = [
  {
    id: "exp-1",
    role: "Full-Stack & Systems Engineer",
    org: "Software & Open Source",
    type: "Full-Time",
    date: "2024 — Present",
    location: "Remote / India",
    summary: "Architecting interactive web applications, high-throughput microservices, and AI agent runtimes. Leading full-stack frontend design and API systems integration.",
    tags: ["TypeScript", "React", "Python", "Node.js", "PostgreSQL"]
  },
  {
    id: "exp-2",
    role: "Open Source Contributor & Builder",
    org: "GitHub Projects",
    type: "Milestone",
    date: "2022 — Present",
    location: "Global",
    summary: "Building open source repositories for modern web platforms, vector retrieval, and developer toolchains on GitHub (@Jaivardhan-Raahi).",
    tags: ["Git", "Rust", "WebAssembly", "Tailwind CSS", "Docker"]
  },
  {
    id: "exp-3",
    role: "B.Tech in Computer Science Engineering",
    org: "University",
    type: "Education",
    date: "2020 — 2024",
    location: "India",
    summary: "Specialized in Computer Systems Architecture, Web Engineering, Database Systems, and Algorithms.",
    tags: ["Data Structures", "Algorithms", "Database Management", "Networks"]
  }
];

export const BUILD_LOGS: BuildLogData = {
  now: [
    {
      title: "JaiOS Portfolio v3 (TypeScript & React Setup)",
      time: "Active Sprint",
      details: "Converting full desktop operating system portfolio to production TypeScript + Vite with live GitHub API data streaming.",
      progress: 95,
      tag: "Web OS"
    },
    {
      title: "Local AI RAG Persona Assistant",
      time: "Active Sprint",
      details: "Building client-side context engine answering visitor queries grounded in Jaivardhan's GitHub repositories.",
      progress: 85,
      tag: "AI"
    }
  ],
  recentlyShipped: [
    {
      title: "JaiOS Operating System Portfolio",
      date: "August 2026",
      description: "Engineered authentic desktop environment with window dragging, 8-direction resizing, sound synthesis, and mobile launcher.",
      linkText: "Current Environment"
    },
    {
      title: "GitHub API Telemetry Integration",
      date: "July 2026",
      description: "Implemented dynamic profile, repo, and private token sync from GitHub REST API.",
      linkText: "View GitHub"
    }
  ],
  experiments: [
    {
      name: "tiny-ebpf-tui",
      desc: "Single-binary live memory heatmap rendered directly in Linux terminal.",
      status: "Prototype working"
    }
  ],
  learning: [
    "Rust async runtimes & WebAssembly zero-copy memory interop",
    "Advanced WebGL / WebGPU compute shader graphics rendering"
  ],
  next: [
    "Deploy JaiOS to Vercel / Netlify production environment",
    "Publish interactive technical breakdown of window management architecture"
  ]
};

export const INITIAL_STICKY_NOTES: StickyNote[] = [
  {
    id: "note-1",
    author: "Sarah Lin",
    role: "Principal Eng",
    text: "Jaivardhan's work on full-stack web applications and desktop OS interfaces is top tier!",
    date: "2 days ago",
    rotation: "-1.5deg",
    color: "bg-amber-950/40 border-amber-500/30 text-amber-200"
  },
  {
    id: "note-2",
    author: "Marcus Vance",
    role: "Tech Lead",
    text: "Stopped by from GitHub. The real-time GitHub sync and AI assistant are super crisp!",
    date: "4 days ago",
    rotation: "2deg",
    color: "bg-sky-950/40 border-sky-500/30 text-sky-200"
  },
  {
    id: "note-3",
    author: "Elena Rostova",
    role: "OSS Contributor",
    text: "Love seeing developers build original desktop UI experiences. Keep shipping!",
    date: "1 week ago",
    rotation: "-0.8deg",
    color: "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
  }
];

export const TRASH_ITEMS: TrashItem[] = [
  { name: "node_modules (48.2 GB)", size: "48.2 GB", date: "Yesterday", note: "The eternal abyss of dependencies." },
  { name: "abandoned-idea-2024.py", size: "14 KB", date: "Jan 2024", note: "Looked good on a whiteboard at 3 AM." },
  { name: "old_portfolio_wordpress.zip", size: "128 MB", date: "2019", note: "We do not speak of this era." },
  { name: "uncommitted_stash.patch", size: "84 KB", date: "Last month", note: "Code that worked once, somewhere." }
];

export const APP_DEFINITIONS: AppDefinition[] = [
  { id: "about", title: "About Me", icon: "User", category: "Core", short: "Bio & GitHub Telemetry" },
  { id: "projects", title: "Projects", icon: "FolderGit2", category: "Code", short: "Explorer & Repos" },
  { id: "skills", title: "Skills & System", icon: "Cpu", category: "Diagnostics", short: "Technical Capabilities" },
  { id: "experience", title: "Experience", icon: "History", category: "Career", short: "Timeline & Milestones" },
  { id: "buildlog", title: "Build Log", icon: "Flame", category: "Live", short: "What I'm building now" },
  { id: "ai-assistant", title: "Ask AI", icon: "Bot", category: "Agent", short: "Interactive Persona Q&A" },
  { id: "guestbook", title: "Guestbook", icon: "StickyNote", category: "Community", short: "Leave a digital note" },
  { id: "terminal", title: "Terminal", icon: "Terminal", category: "Tools", short: "Interactive zsh shell" },
  { id: "contact", title: "Contact", icon: "Mail", category: "Comm", short: "Get in touch" },
  { id: "resume", title: "Resume.pdf", icon: "FileText", category: "Doc", short: "Curriculum Vitae" },
  { id: "settings", title: "Settings", icon: "Settings", category: "System", short: "GitHub & AI Config" },
  { id: "trash", title: "Trash", icon: "Trash2", category: "System", short: "4 recycled items" }
];
