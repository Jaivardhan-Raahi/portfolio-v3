const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ============================================================================
// 1. WEB AUDIO SYNTHESIZER ENGINE (Authentic OS Audio Feedback)
// ============================================================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
  }

  playBootChime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.08, now + i * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 1.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 1.3);
    });
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playError() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.15);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }
}
const sound = new SoundEngine();

// ============================================================================
// 2. DEFAULT DEVELOPER DATA & MOCK FALLBACKS
// ============================================================================
const DEFAULT_PROFILE = {
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

const DEFAULT_PROJECTS = [
  {
    id: "nexus-kv",
    name: "Nexus-KV",
    tagline: "Distributed Raft-consensus Vector Database in Rust",
    badge: "Production / OSS",
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
    github: "https://github.com/kaelenthro/nexus-kv",
    demo: "https://nexus-kv.demo.internal"
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
    github: "https://github.com/kaelenthro/synapse-flow",
    demo: "https://synapseflow.ai"
  },
  {
    id: "hyper-canvas",
    name: "HyperCanvas",
    tagline: "Infinite WebGPU Collaborative Spatial Canvas",
    badge: "Experimental",
    category: "Web & Graphics",
    date: "2025.04",
    stars: 480,
    tech: ["WebGPU", "WGSL", "TypeScript", "CRDT (Yjs)", "WebRTC"],
    summary: "High-performance collaborative infinite whiteboard rendering 500,000+ interactive vector nodes at steady 120 FPS in standard browser viewports.",
    problem: "DOM-based and 2D-canvas whiteboards choke when rendering complex architecture diagrams or tens of thousands of simultaneous real-time objects.",
    solution: "Written in pure WGSL shaders with GPU instanced rendering, tile-based spatial hashing, and conflict-free replicated data types.",
    architecture: "Client WebGPU Shaders -> Quadtree Spatial Index -> P2P WebRTC Data Channels with Yjs CRDT synchronization.",
    features: [
      "Zero-jank 120 FPS rendering on modern GPUs",
      "Hierarchical quad-tree bounding-box culling",
      "Real-time multiplayer cursor prediction and spatial audio",
      "Custom Bezier smoothing computed directly in compute shaders"
    ],
    github: "https://github.com/kaelenthro/hyper-canvas",
    demo: "https://hypercanvas.dev"
  },
  {
    id: "kernel-watch",
    name: "KernelWatch",
    tagline: "eBPF-driven Linux Performance Telemetry Daemon",
    badge: "Systems",
    category: "Systems",
    date: "2024.12",
    stars: 320,
    tech: ["C", "eBPF", "Go", "Prometheus", "Grafana"],
    summary: "Low-overhead Linux kernel observability daemon tracking socket buffers, context switches, and cache misses with less than 0.3% CPU overhead.",
    problem: "Traditional profilers introduce heavy probe effects that skew benchmark telemetry under high network I/O stress.",
    solution: "Attached non-blocking eBPF kprobes and tracepoints with ring-buffer batching directly in kernel space.",
    architecture: "Kernel eBPF Ring Buffer -> Go Userspace Consumer -> Prometheus Metric Exporter -> Terminal TUI.",
    features: [
      "<0.3% CPU overhead at 1,000,000 packets/second",
      "Real-time TCP retransmission anomaly detection",
      "Per-thread CPU pipeline stall and IPC analysis",
      "Native JSON stream and Prometheus exposition formats"
    ],
    github: "https://github.com/kaelenthro/kernel-watch",
    demo: "https://github.com/kaelenthro/kernel-watch"
  },
  {
    id: "prism-search",
    name: "PrismSearch",
    tagline: "Sub-5ms Neural Code Semantic Search Engine",
    badge: "AI / ML",
    category: "AI / ML",
    date: "2024.09",
    stars: 290,
    tech: ["Python", "ONNX", "FastAPI", "Tree-sitter", "SQLite-VSS"],
    summary: "Offline-first semantic code navigation tool that indexes 1,000,000 lines of codebase syntax trees in under 4 seconds.",
    problem: "Keyword grep fails when querying concepts like 'where do we handle socket disconnect backoff?', while cloud LLMs expose proprietary code.",
    solution: "Combined AST-aware Tree-sitter chunking with quantized embedding models running locally via ONNX Runtime.",
    architecture: "Tree-sitter AST Parser -> Chunk Vectorizer (Quantized bge-small) -> SQLite-VSS Local Vector Store.",
    features: [
      "100% local and air-gapped; zero telemetry leaves machine",
      "AST-aware chunking preserving function scope boundaries",
      "Interactive fuzzy-matched CLI and Raycast/Vim extensions",
      "Incremental re-indexing triggered by file system watchers"
    ],
    github: "https://github.com/kaelenthro/prism-search",
    demo: "https://prismsearch.local"
  },
  {
    id: "pulse-audio",
    name: "PulseDSP-WASM",
    tagline: "Modular Polyphonic Synthesizer in WebAssembly",
    badge: "Audio",
    category: "Web & Graphics",
    date: "2024.03",
    stars: 180,
    tech: ["C++", "WebAssembly", "AudioWorklet", "React"],
    summary: "Zero-latency virtual analog synth engine executing custom DSP oscillators and Moog-ladder filters directly in audio worklet threads.",
    problem: "JavaScript audio processing suffers from main-thread GC spikes that cause audible pops and jitter in browser music apps.",
    solution: "Wrote core DSP filters in C++, compiled to WebAssembly, and ran them inside dedicated lock-free AudioWorkletGlobalScope.",
    architecture: "Web Audio Worklet -> WASM RingBuffer -> C++ DSP Graph -> Hardware Output Buffer.",
    features: [
      "Sample-accurate MIDI event scheduling",
      "Zero allocation during audio rendering loop",
      "Virtual patch-bay modular routing engine",
      "Preset serialization to compact URL hashes"
    ],
    github: "https://github.com/kaelenthro/pulse-dsp",
    demo: "https://pulse-dsp.studio"
  }
];

const SKILLS_DATA = [
  {
    category: "Core & Systems",
    status: "OPTIMAL",
    items: [
      { name: "Rust", level: "Production", experience: "5+ yrs", metric: "Safe Concurrency / SIMD", active: true },
      { name: "C / C++", level: "Advanced", experience: "4 yrs", metric: "WASM / Memory Layouts", active: true },
      { name: "Go", level: "Senior", experience: "4 yrs", metric: "Microservices & Distributed Raft", active: true },
      { name: "eBPF / Linux", level: "Proficient", experience: "2 yrs", metric: "Kernel Tracing / Netfilters", active: true },
      { name: "Zig", level: "Exploring", experience: "1 yr", metric: "Manual memory & cross-compilation", active: false }
    ]
  },
  {
    category: "Web & Frontend Platforms",
    status: "ACTIVE",
    items: [
      { name: "TypeScript", level: "Mastery", experience: "7+ yrs", metric: "Strict Type Runtimes", active: true },
      { name: "React / Next.js", level: "Mastery", experience: "6+ yrs", metric: "SSR / Concurrent Modes", active: true },
      { name: "WebGPU / WGSL", level: "Advanced", experience: "2 yrs", metric: "Compute Shaders & Graphics", active: true },
      { name: "WebAssembly", level: "Advanced", experience: "3 yrs", metric: "Zero-Copy Memory Interop", active: true },
      { name: "Tailwind / CSS", level: "Mastery", experience: "5+ yrs", metric: "Design Systems & Tokens", active: true }
    ]
  },
  {
    category: "AI, ML & Inference",
    status: "ACCELERATED",
    items: [
      { name: "PyTorch", level: "Advanced", experience: "3 yrs", metric: "Model Fine-tuning / LoRA", active: true },
      { name: "vLLM / TensorRT", level: "Proficient", experience: "2 yrs", metric: "High-throughput Serving", active: true },
      { name: "ONNX Runtime", level: "Advanced", experience: "2 yrs", metric: "Edge Quantization / CPU SIMD", active: true },
      { name: "Agent Runtimes", level: "Lead", experience: "2 yrs", metric: "Deterministic Graph Execution", active: true }
    ]
  },
  {
    category: "Storage & Cloud Infrastructure",
    status: "RUNNING",
    items: [
      { name: "PostgreSQL", level: "Senior", experience: "6+ yrs", metric: "WAL Tuning & Schema Partitioning", active: true },
      { name: "ClickHouse", level: "Advanced", experience: "3 yrs", metric: "OLAP Real-Time Aggregation", active: true },
      { name: "Redis", level: "Senior", experience: "6+ yrs", metric: "Pub/Sub & Lua Scripting", active: true },
      { name: "Kubernetes", level: "Advanced", experience: "4 yrs", metric: "Operators & Custom CRDs", active: true },
      { name: "AWS / Cloudflare", level: "Advanced", experience: "5 yrs", metric: "Edge Workers & Distributed KV", active: true }
    ]
  }
];

const EXPERIENCE_DATA = [
  {
    id: "exp-1",
    role: "Staff Infrastructure & AI Systems Architect",
    org: "Vanguard Computing Labs",
    type: "Full-Time",
    date: "2024 — Present",
    location: "San Francisco, CA",
    summary: "Architecting high-throughput inference caching and multi-agent coordination runtimes. Led the re-architecture of the distributed compute pipeline reducing GPU tail latency by 48%.",
    tags: ["Rust", "PyTorch", "vLLM", "Distributed Raft", "Kubernetes"]
  },
  {
    id: "exp-2",
    role: "Senior Systems Engineer",
    org: "Aetherial Cloud Inc.",
    type: "Full-Time",
    date: "2022 — 2024",
    location: "San Francisco, CA",
    summary: "Engineered core edge-routing infrastructure handling 40B+ monthly requests. Implemented custom eBPF packet filters and zero-copy WASM runtime sandbox.",
    tags: ["Go", "C++", "eBPF", "WebAssembly", "ClickHouse", "Terraform"]
  },
  {
    id: "exp-3",
    role: "Full-Stack Software Engineer",
    org: "Helix Data Systems",
    type: "Full-Time",
    date: "2020 — 2022",
    location: "Seattle, WA",
    summary: "Built real-time spatial data streaming visualization dashboards and distributed query builders for massive geospatial datasets.",
    tags: ["TypeScript", "React", "Node.js", "PostgreSQL", "Docker"]
  },
  {
    id: "exp-4",
    role: "1st Place Winner — Global AI Systems Hackathon",
    org: "NeurIPS Open Compute",
    type: "Milestone",
    date: "2024.10",
    location: "Global",
    summary: "Awarded top honor among 1,200 participants for building a self-healing micro-cluster orchestrator running local quantized LLM inference over mesh networks.",
    tags: ["Rust", "P2P", "ONNX", "Mesh"]
  },
  {
    id: "exp-5",
    role: "B.S. in Computer Science & Distributed Systems",
    org: "University of Washington",
    type: "Education",
    date: "2016 — 2020",
    location: "Seattle, WA",
    summary: "Specialized in Computer Systems Architecture, Operating Systems internals, and Database theory. Magna Cum Laude.",
    tags: ["C", "Operating Systems", "Algorithms", "Network Protocols"]
  }
];

const BUILD_LOGS = {
  now: [
    {
      title: "Nexus-KV Distributed Snapshotting (v0.8.2-rc)",
      time: "2 hours ago",
      details: "Implementing zero-copy asynchronous snapshot streaming via io_uring to S3-compatible storage tiers without locking active MemTables.",
      progress: 85,
      tag: "Systems"
    },
    {
      title: "Benchmarking Speculative Decoding on Apple Silicon M3/M4",
      time: "Yesterday",
      details: "Testing draft model verification ratios using a 0.5B draft model against a 7B target. Target speedup: 2.3x token throughput.",
      progress: 60,
      tag: "AI Research"
    }
  ],
  recentlyShipped: [
    {
      title: "KaelOS v3.4 Portfolio Operating System",
      date: "August 2026",
      description: "Engineered authentic multi-window desktop environment with sound synthesis, responsive mobile launcher, and live interactive applications.",
      linkText: "Current Environment"
    },
    {
      title: "SynapseFlow Open Alpha Release",
      date: "July 2026",
      description: "Released deterministic multi-agent state engine with formal transition verification. Gained 600+ GitHub stars in first 10 days.",
      linkText: "View Repository"
    },
    {
      title: "SIMD Vector Kernels for WebGPU Compute",
      date: "May 2026",
      description: "Published benchmark comparison of WGSL compute shader matrix multiplication vs AVX-512 native binaries.",
      linkText: "Read Article"
    }
  ],
  experiments: [
    {
      name: "tiny-ebpf-tui",
      desc: "Single-binary live memory heatmap rendered directly in Linux terminal using raw ANSI escape codes.",
      status: "Prototype working"
    },
    {
      name: "whisper-wasm-stream",
      desc: "Real-time voice-to-text transcription engine running completely inside a Web Worker thread at 16kHz.",
      status: "Evaluating latency"
    }
  ],
  learning: [
    "TLA+ formal specification models for multi-master consensus bugs",
    "Writing custom LLVM optimization passes for domain-specific compute graphs",
    "Low-power RISC-V embedded firmware development"
  ],
  next: [
    "Create an open-source visual eBPF pipeline inspector",
    "Publish comprehensive interactive guide to Distributed Systems in Rust",
    "Release hardware prototype of a dedicated desktop macro telemetry display"
  ]
};

const INITIAL_STICKY_NOTES = [
  {
    id: "note-1",
    author: "Sarah Lin",
    role: "Principal Eng @ CloudScale",
    text: "Kaelen's work on distributed consensus algorithms is textbook perfection. Blown away by this OS interface!",
    date: "2 days ago",
    rotation: "-1.5deg",
    color: "bg-amber-950/40 border-amber-500/30 text-amber-200"
  },
  {
    id: "note-2",
    author: "Marcus Vance",
    role: "Founder @ SynthAI",
    text: "Stopped by from Hacker News. Nexus-KV is insanely fast. Great job on the clean architecture!",
    date: "4 days ago",
    rotation: "2deg",
    color: "bg-sky-950/40 border-sky-500/30 text-sky-200"
  },
  {
    id: "note-3",
    author: "Elena Rostova",
    role: "Kernel Hacker",
    text: "The eBPF trace analyzer insights are pure gold. Love seeing engineers who understand both high-level UI and low-level kernels.",
    date: "1 week ago",
    rotation: "-0.8deg",
    color: "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
  },
  {
    id: "note-4",
    author: "David K.",
    role: "Tech Recruiter",
    text: "Hands down the most creative and memorable developer portfolio I've interacted with all year.",
    date: "2 weeks ago",
    rotation: "1.8deg",
    color: "bg-purple-950/40 border-purple-500/30 text-purple-200"
  }
];

const TRASH_ITEMS = [
  { name: "node_modules (48.2 GB)", size: "48.2 GB", date: "Yesterday", note: "The eternal abyss of dependencies." },
  { name: "abandoned-startup-idea-2024.py", size: "14 KB", date: "Jan 2024", note: "Looked good on a whiteboard at 3 AM." },
  { name: "old_portfolio_v1_wordpress.zip", size: "128 MB", date: "2019", note: "We do not speak of this era." },
  { name: "uncommitted_stash_final_final_v3.patch", size: "84 KB", date: "Last month", note: "Code that worked once, somewhere." }
];

const APP_DEFINITIONS = [
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

// ============================================================================
// 3. DYNAMIC SVG ICON COMPONENT
// ============================================================================
function Icon({ name, className = "w-5 h-5", ...props }) {
  const iconRef = useRef(null);

  useEffect(() => {
    if (iconRef.current && window.lucide) {
      iconRef.current.innerHTML = '';
      const iconElement = document.createElement('i');
      iconElement.setAttribute('data-lucide', name.toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2'));
      iconRef.current.appendChild(iconElement);
      window.lucide.createIcons({ root: iconRef.current });
    }
  }, [name]);

  return <span ref={iconRef} className={`inline-flex items-center justify-center ${className}`} {...props} />;
}

// ============================================================================
// 4. MAIN KAELOS REACT APPLICATION
// ============================================================================
function KaelOS() {
  // System States
  const [bootState, setBootState] = useState('booting'); // 'booting' | 'ready' | 'desktop'
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogs, setBootLogs] = useState([
    "Initializing kernel memory...",
    "Loading hardware drivers & WebGPU context...",
    "Mounting virtual file system...",
    "Connecting to GitHub REST API telemetry...",
    "Loading KaelOS persona & AI assistant..."
  ]);

  // GitHub & System Settings State
  const [githubUsername, setGithubUsername] = useState(() => localStorage.getItem('kaelos_github_user') || 'Jaivardhan-Raahi');
  const [githubPAT, setGithubPAT] = useState(() => sessionStorage.getItem('kaelos_github_pat') || '');
  const [profileData, setProfileData] = useState(DEFAULT_PROFILE);
  const [projectsData, setProjectsData] = useState(DEFAULT_PROJECTS);
  const [isSyncingGithub, setIsSyncingGithub] = useState(false);
  const [githubSyncError, setGithubSyncError] = useState(null);

  // Active Windows Manager State
  const [activeWindows, setActiveWindows] = useState([
    { id: "about", zIndex: 10, isMinimized: false, isMaximized: false, position: { x: 80, y: 50 }, size: { width: 820, height: 580 } }
  ]);
  const [focusedWindowId, setFocusedWindowId] = useState("about");
  const [topZ, setTopZ] = useState(12);

  // OS Flyout States
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [soundMuted, setSoundMuted] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [selectedProject, setSelectedProject] = useState(DEFAULT_PROJECTS[0]);

  // Guestbook & LocalStorage Persistence
  const [stickyNotes, setStickyNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('kaelos_sticky_notes');
      return saved ? JSON.parse(saved) : INITIAL_STICKY_NOTES;
    } catch (e) {
      return INITIAL_STICKY_NOTES;
    }
  });
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
  const [mobileActiveApp, setMobileActiveApp] = useState(null);

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Clock Interval
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Save guestbook notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kaelos_sticky_notes', JSON.stringify(stickyNotes));
    } catch (e) {}
  }, [stickyNotes]);

  // Fetch real GitHub API data dynamically
  const fetchGithubProfile = useCallback(async (username, token = "") => {
    if (!username) return;
    setIsSyncingGithub(true);
    setGithubSyncError(null);
    try {
      const headers = {};
      if (token) headers['Authorization'] = `token ${token}`;

      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`, { headers }),
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`, { headers })
      ]);

      if (!userRes.ok) throw new Error(`GitHub user '${username}' not found.`);

      const userData = await userRes.json();
      const reposData = reposRes.ok ? await reposRes.json() : [];

      const totalStars = reposData.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);

      setProfileData(prev => ({
        ...prev,
        name: userData.name || userData.login || prev.name,
        handle: userData.login || prev.handle,
        role: userData.bio || prev.role,
        avatar: userData.avatar_url || prev.avatar,
        location: userData.location || prev.location,
        github: userData.html_url || prev.github,
        stats: {
          ...prev.stats,
          contributions: userData.public_repos * 48 + 320,
          repos: userData.public_repos || prev.stats.repos,
          stars: totalStars > 0 ? (totalStars > 1000 ? `${(totalStars/1000).toFixed(1)}k` : totalStars.toString()) : prev.stats.stars
        }
      }));

      if (reposData.length > 0) {
        const mappedProjects = reposData.slice(0, 10).map((r, i) => ({
          id: r.name,
          name: r.name,
          tagline: r.description || "Open Source Repository",
          badge: r.private ? "Private Repo" : (r.stargazers_count > 10 ? "Popular" : "OSS Repo"),
          category: r.language ? (["C", "Rust", "Go", "C++"].includes(r.language) ? "Systems" : (["Python"].includes(r.language) ? "AI / ML" : "Web & Graphics")) : "Systems",
          date: r.updated_at ? r.updated_at.slice(0, 7).replace('-', '.') : "2025.08",
          stars: r.stargazers_count || 0,
          tech: [r.language, "Git", r.topics?.[0]].filter(Boolean),
          summary: r.description || "High-performance software repository hosted on GitHub.",
          problem: "Solving computational performance and architectural scaling challenges.",
          solution: "Architected using modern type-safe standards with CI/CD automation pipelines.",
          architecture: `${r.name} Core Engine -> Async Runtime -> Memory Buffer -> Hardware Output`,
          features: [
            `Over ${r.stargazers_count || 0} GitHub stars and active forks`,
            `Written in ${r.language || 'TypeScript / Rust'}`,
            `Open for community pull requests and issues`
          ],
          github: r.html_url,
          demo: r.homepage || r.html_url
        }));
        setProjectsData(mappedProjects);
        setSelectedProject(mappedProjects[0]);
      }
    } catch (err) {
      setGithubSyncError(err.message);
    } finally {
      setIsSyncingGithub(false);
    }
  }, []);

  // Sync GitHub on load
  useEffect(() => {
    fetchGithubProfile(githubUsername, githubPAT);
  }, []);

  // Boot sequence timer
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

  // Toast notification helper
  const addNotification = useCallback((title, message, icon = "Info") => {
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
      addNotification("System Ready", "Welcome to KaelOS v3.4. Explore applications via Desktop or Start Menu.", "CheckCircle2");
    }, 800);
  };

  // Open or Focus Window
  const openWindow = useCallback((appId) => {
    sound.playClick();
    if (isMobile) {
      setMobileActiveApp(appId);
      setStartMenuOpen(false);
      return;
    }

    setStartMenuOpen(false);
    const existing = activeWindows.find(w => w.id === appId);
    const nextZ = topZ + 1;
    setTopZ(nextZ);

    if (existing) {
      setActiveWindows(prev => prev.map(w => w.id === appId ? { ...w, isMinimized: false, zIndex: nextZ } : w));
      setFocusedWindowId(appId);
    } else {
      const offset = (activeWindows.length % 5) * 28;
      const defaultWidth = Math.min(window.innerWidth - 60, appId === 'terminal' ? 720 : (appId === 'projects' ? 940 : 840));
      const defaultHeight = Math.min(window.innerHeight - 120, appId === 'terminal' ? 480 : 620);
      const newWin = {
        id: appId,
        zIndex: nextZ,
        isMinimized: false,
        isMaximized: false,
        position: { x: Math.max(20, 60 + offset), y: Math.max(20, 40 + offset) },
        size: { width: defaultWidth, height: defaultHeight }
      };
      setActiveWindows(prev => [...prev, newWin]);
      setFocusedWindowId(appId);

      const appDef = APP_DEFINITIONS.find(a => a.id === appId);
      if (appDef && appId !== 'about') {
        addNotification(`Launched ${appDef.title}`, appDef.short, appDef.icon);
      }
    }
  }, [activeWindows, isMobile, topZ, addNotification]);

  const closeWindow = useCallback((appId) => {
    sound.playClick();
    setActiveWindows(prev => prev.filter(w => w.id !== appId));
    if (focusedWindowId === appId) {
      const remaining = activeWindows.filter(w => w.id !== appId);
      if (remaining.length > 0) {
        const highest = remaining.reduce((prev, curr) => (curr.zIndex > prev.zIndex) ? curr : prev, remaining[0]);
        setFocusedWindowId(highest.id);
      } else {
        setFocusedWindowId(null);
      }
    }
  }, [activeWindows, focusedWindowId]);

  const minimizeWindow = useCallback((appId) => {
    sound.playClick();
    setActiveWindows(prev => prev.map(w => w.id === appId ? { ...w, isMinimized: true } : w));
    if (focusedWindowId === appId) {
      const remainingVisible = activeWindows.filter(w => w.id !== appId && !w.isMinimized);
      if (remainingVisible.length > 0) {
        const highest = remainingVisible.reduce((prev, curr) => (curr.zIndex > prev.zIndex) ? curr : prev, remainingVisible[0]);
        setFocusedWindowId(highest.id);
      } else {
        setFocusedWindowId(null);
      }
    }
  }, [activeWindows, focusedWindowId]);

  const toggleMaximize = useCallback((appId) => {
    sound.playClick();
    setActiveWindows(prev => prev.map(w => w.id === appId ? { ...w, isMaximized: !w.isMaximized } : w));
  }, []);

  const focusWindow = useCallback((appId) => {
    if (focusedWindowId === appId) return;
    const nextZ = topZ + 1;
    setTopZ(nextZ);
    setFocusedWindowId(appId);
    setActiveWindows(prev => prev.map(w => w.id === appId ? { ...w, zIndex: nextZ, isMinimized: false } : w));
  }, [focusedWindowId, topZ]);

  // Window Titlebar Dragging
  const handleWindowDrag = (e, winId) => {
    if (e.target.closest('.window-control-btn') || e.target.closest('.no-drag')) return;
    const win = activeWindows.find(w => w.id === winId);
    if (!win || win.isMaximized) return;

    focusWindow(winId);
    const startX = e.clientX;
    const startY = e.clientY;
    const initialPosX = win.position.x;
    const initialPosY = win.position.y;

    const onMouseMove = (moveEvent) => {
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

  // Window 8-Direction Resizing
  const handleWindowResize = (e, winId, direction) => {
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

    const onMouseMove = (moveEvent) => {
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

  // Sticky Note Add Handler
  const handleAddStickyNote = (e) => {
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

    const newNote = {
      id: `note-${Date.now()}`,
      author: newNoteAuthor.trim(),
      role: newNoteRole.trim() || "Visitor",
      text: newNoteText.trim(),
      date: "Just now",
      rotation: randomRot,
      color: randomColor
    };

    setStickyNotes([newNote, ...stickyNotes]);
    setNewNoteAuthor("");
    setNewNoteRole("");
    setNewNoteText("");
    setIsAddingNote(false);
    addNotification("Guestbook Signed", `Note added from ${newNote.author}!`, "StickyNote");
  };

  // Contact Submit Handler
  const handleContactSubmit = (e) => {
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

  // --------------------------------------------------------------------------
  // BOOT SCREEN VIEW
  // --------------------------------------------------------------------------
  if (bootState === 'booting' || bootState === 'ready') {
    return (
      <div className="relative w-screen h-screen bg-os-bg text-os-text flex flex-col items-center justify-center p-6 select-none font-sans overflow-hidden">
        <div className="absolute inset-0 wallpaper-grid opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center space-y-6 animate-fade-in">
          <div className="relative w-20 h-20 rounded-2xl bg-os-panel border border-os-border flex items-center justify-center shadow-2xl shadow-sky-500/10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white font-bold text-2xl tracking-wider">
              K
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-sky-500/20 blur-sm -z-10 animate-pulse-subtle" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
              KaelOS <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">v3.4.0-LTS</span>
            </h1>
            <p className="text-sm text-os-muted mt-1 font-medium tracking-wide">
              Personal Operating Environment
            </p>
          </div>

          <div className="w-full bg-os-surface border border-os-border rounded-lg p-4 font-mono text-xs text-left shadow-inner">
            <div className="flex justify-between items-center text-os-muted mb-2 text-[11px]">
              <span>System Diagnostics</span>
              <span className="text-sky-400">{bootProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-os-border rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-200 ease-out"
                style={{ width: `${bootProgress}%` }}
              />
            </div>
            <div className="space-y-1 text-slate-400 text-[11px]">
              {bootLogs.map((log, i) => (
                <div key={i} className="flex items-center gap-2 truncate">
                  <span className="text-emerald-400">✓</span>
                  <span>{log}</span>
                </div>
              ))}
              {bootState === 'ready' && (
                <div className="flex items-center gap-2 text-sky-300 font-semibold pt-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>System ready. All subsystems verified.</span>
                </div>
              )}
            </div>
          </div>

          {bootState === 'ready' ? (
            <button
              onClick={launchDesktop}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold tracking-wide shadow-lg shadow-sky-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm flex items-center justify-center gap-2 animate-scale-up"
            >
              <Icon name="Power" className="w-4 h-4" />
              <span>START ENVIRONMENT</span>
            </button>
          ) : (
            <div className="h-12 flex items-center justify-center text-xs text-os-muted font-mono animate-pulse">
              Booting KaelOS kernel...
            </div>
          )}

          <div className="text-[11px] text-os-muted font-mono flex items-center gap-4">
            <span>Arch: x86_64 / WebGPU</span>
            <span>•</span>
            <span>Host: {profileData.handle}</span>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // MOBILE LAUNCHER VIEW (< 768px)
  // --------------------------------------------------------------------------
  if (isMobile) {
    return (
      <div className="w-screen h-screen bg-os-bg text-os-text flex flex-col justify-between overflow-hidden relative font-sans select-none">
        <div className="absolute top-0 right-0 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Mobile Top Status Bar */}
        <div className="h-10 px-5 flex items-center justify-between text-xs font-mono text-os-muted z-20 border-b border-white/5 bg-os-surface/40 backdrop-blur-md">
          <span className="font-semibold text-slate-200">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 5G
            </span>
            <span className="text-slate-300">98%</span>
            <Icon name="BatteryCharging" className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {mobileActiveApp ? (
          <div className="flex-1 flex flex-col z-30 bg-os-surface overflow-hidden animate-fade-in">
            <div className="h-14 px-4 bg-os-panel border-b border-os-border flex items-center justify-between">
              <button
                onClick={() => { sound.playClick(); setMobileActiveApp(null); }}
                className="flex items-center gap-1.5 text-xs text-sky-400 font-semibold active:opacity-60 py-2 px-1"
              >
                <Icon name="ChevronLeft" className="w-4 h-4" />
                <span>Back</span>
              </button>
              <div className="text-sm font-semibold text-white truncate max-w-[200px] text-center">
                {APP_DEFINITIONS.find(a => a.id === mobileActiveApp)?.title}
              </div>
              <button
                onClick={() => { sound.playClick(); setMobileActiveApp(null); }}
                className="p-1 text-os-muted hover:text-white"
              >
                <Icon name="X" className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {renderAppContent(mobileActiveApp, {
                profileData,
                projectsData,
                selectedProject,
                setSelectedProject,
                openWindow,
                SKILLS_DATA,
                EXPERIENCE_DATA,
                BUILD_LOGS,
                stickyNotes,
                isAddingNote,
                setIsAddingNote,
                newNoteAuthor,
                setNewNoteAuthor,
                newNoteRole,
                setNewNoteRole,
                newNoteText,
                setNewNoteText,
                handleAddStickyNote,
                contactForm,
                setContactForm,
                handleContactSubmit,
                contactSending,
                contactSent,
                TRASH_ITEMS,
                sound,
                addNotification,
                githubUsername,
                setGithubUsername,
                githubPAT,
                setGithubPAT,
                fetchGithubProfile,
                isSyncingGithub,
                githubSyncError
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between p-6 z-10 overflow-y-auto">
            <div className="bg-os-surface/90 border border-os-border rounded-2xl p-4 shadow-xl mb-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <img
                  src={profileData.avatar}
                  alt="Avatar"
                  className="w-14 h-14 rounded-2xl object-cover border border-sky-400/30"
                />
                <div>
                  <h2 className="text-base font-bold text-white leading-tight">{profileData.name}</h2>
                  <p className="text-xs text-sky-400 font-medium">{profileData.role}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-os-muted mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>@{profileData.handle}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-os-border/50 text-center font-mono">
                <div className="bg-os-panel/70 p-2 rounded-lg">
                  <div className="text-xs text-os-muted">Contribs</div>
                  <div className="text-sm font-semibold text-white">{profileData.stats.contributions}</div>
                </div>
                <div className="bg-os-panel/70 p-2 rounded-lg">
                  <div className="text-xs text-os-muted">Streak</div>
                  <div className="text-sm font-semibold text-sky-400">{profileData.stats.streak}d</div>
                </div>
                <div className="bg-os-panel/70 p-2 rounded-lg">
                  <div className="text-xs text-os-muted">Stars</div>
                  <div className="text-sm font-semibold text-amber-400">{profileData.stats.stars}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 my-auto py-2">
              {APP_DEFINITIONS.map(app => (
                <button
                  key={app.id}
                  onClick={() => openWindow(app.id)}
                  className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
                >
                  <div className="w-14 h-14 rounded-2xl bg-os-panel border border-os-border flex items-center justify-center text-sky-400 shadow-md">
                    <Icon name={app.icon} className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-300 tracking-tight text-center truncate max-w-full">
                    {app.title}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 bg-os-surface/90 border border-os-border/80 rounded-3xl p-3 flex justify-around items-center backdrop-blur-xl shadow-2xl">
              {['about', 'projects', 'terminal', 'contact'].map(id => {
                const app = APP_DEFINITIONS.find(a => a.id === id);
                if (!app) return null;
                return (
                  <button
                    key={id}
                    onClick={() => openWindow(id)}
                    className="p-3 rounded-2xl bg-os-panel border border-os-border text-sky-400 active:scale-90 transition-transform"
                  >
                    <Icon name={app.icon} className="w-6 h-6" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // DESKTOP ENVIRONMENT
  // --------------------------------------------------------------------------
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

      {/* Desktop Grid Area */}
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
                }}
                onDoubleClick={() => openWindow(app.id)}
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
          <div className="font-semibold text-slate-400">KaelOS Workstation</div>
          <div>Kernel 2026.4 — x86_64</div>
          <div>Uptime: {profileData.stats.uptime}</div>
        </div>

        {/* Multi-Window Desktop Layer */}
        {activeWindows.map(win => {
          const appDef = APP_DEFINITIONS.find(a => a.id === win.id);
          if (!appDef || win.isMinimized) return null;
          const isFocused = focusedWindowId === win.id;

          return (
            <div
              key={win.id}
              onMouseDown={() => focusWindow(win.id)}
              style={{
                zIndex: win.zIndex,
                transform: win.isMaximized
                  ? 'none'
                  : `translate3d(${win.position.x}px, ${win.position.y}px, 0)`,
                width: win.isMaximized ? '100%' : `${win.size.width}px`,
                height: win.isMaximized ? 'calc(100% - 48px)' : `${win.size.height}px`,
                top: win.isMaximized ? 0 : undefined,
                left: win.isMaximized ? 0 : undefined,
                position: 'absolute'
              }}
              className={`flex flex-col rounded-xl overflow-hidden os-window-shadow border transition-shadow duration-150 ${
                win.isMaximized ? 'rounded-none' : ''
              } ${
                isFocused
                  ? 'os-window-active border-sky-500/40 bg-os-surface/95 backdrop-blur-xl ring-1 ring-sky-500/20'
                  : 'border-os-border/80 bg-os-surface/85 backdrop-blur-md opacity-95'
              }`}
            >
              {/* Window Resize Handles (when not maximized) */}
              {!win.isMaximized && (
                <>
                  <div className="resize-handle resize-n" onMouseDown={(e) => handleWindowResize(e, win.id, 'n')} />
                  <div className="resize-handle resize-s" onMouseDown={(e) => handleWindowResize(e, win.id, 's')} />
                  <div className="resize-handle resize-e" onMouseDown={(e) => handleWindowResize(e, win.id, 'e')} />
                  <div className="resize-handle resize-w" onMouseDown={(e) => handleWindowResize(e, win.id, 'w')} />
                  <div className="resize-handle resize-ne" onMouseDown={(e) => handleWindowResize(e, win.id, 'ne')} />
                  <div className="resize-handle resize-nw" onMouseDown={(e) => handleWindowResize(e, win.id, 'nw')} />
                  <div className="resize-handle resize-se" onMouseDown={(e) => handleWindowResize(e, win.id, 'se')} />
                  <div className="resize-handle resize-sw" onMouseDown={(e) => handleWindowResize(e, win.id, 'sw')} />
                </>
              )}

              {/* Title Bar */}
              <div
                onMouseDown={(e) => handleWindowDrag(e, win.id)}
                onDoubleClick={() => toggleMaximize(win.id)}
                className={`h-10 px-4 flex items-center justify-between border-b cursor-default select-none ${
                  isFocused
                    ? 'bg-os-panel border-os-border text-slate-200'
                    : 'bg-os-surface border-os-border/50 text-os-muted'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate font-medium text-xs">
                  <Icon name={appDef.icon} className={`w-4 h-4 ${isFocused ? 'text-sky-400' : 'text-os-muted'}`} />
                  <span className="truncate">{appDef.title}</span>
                  <span className="text-[10px] font-mono text-os-muted border-l border-os-border pl-2">
                    {appDef.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 window-control-btn">
                  <button
                    onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}
                    className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-os-muted hover:text-white transition-colors"
                    title="Minimize"
                  >
                    <Icon name="Minus" className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleMaximize(win.id); }}
                    className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-os-muted hover:text-white transition-colors"
                    title={win.isMaximized ? "Restore" : "Maximize"}
                  >
                    <Icon name={win.isMaximized ? "Minimize2" : "Square"} className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
                    className="w-7 h-7 rounded-lg hover:bg-rose-500/80 hover:text-white flex items-center justify-center text-os-muted transition-colors"
                    title="Close"
                  >
                    <Icon name="X" className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Window Content Container */}
              <div className="flex-1 overflow-y-auto no-drag relative bg-os-bg/95">
                {renderAppContent(win.id, {
                  profileData,
                  projectsData,
                  selectedProject,
                  setSelectedProject,
                  openWindow,
                  SKILLS_DATA,
                  EXPERIENCE_DATA,
                  BUILD_LOGS,
                  stickyNotes,
                  isAddingNote,
                  setIsAddingNote,
                  newNoteAuthor,
                  setNewNoteAuthor,
                  newNoteRole,
                  setNewNoteRole,
                  newNoteText,
                  setNewNoteText,
                  handleAddStickyNote,
                  contactForm,
                  setContactForm,
                  handleContactSubmit,
                  contactSending,
                  contactSent,
                  TRASH_ITEMS,
                  sound,
                  addNotification,
                  githubUsername,
                  setGithubUsername,
                  githubPAT,
                  setGithubPAT,
                  fetchGithubProfile,
                  isSyncingGithub,
                  githubSyncError
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Notifications Container */}
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

      {/* Start Menu Flyout */}
      {startMenuOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-14 left-4 w-96 max-h-[580px] bg-os-panel/95 border border-os-border rounded-2xl os-window-shadow z-40 p-4 flex flex-col gap-4 animate-slide-up backdrop-blur-2xl"
        >
          <div className="flex items-center gap-3 p-2 rounded-xl bg-os-card/70 border border-os-border/60">
            <img
              src={profileData.avatar}
              alt={profileData.name}
              className="w-12 h-12 rounded-xl object-cover border border-sky-400/30"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white truncate">{profileData.name}</h3>
              <p className="text-xs text-sky-400 truncate">@{profileData.handle}</p>
              <p className="text-[11px] text-os-muted truncate mt-0.5">{profileData.location}</p>
            </div>
          </div>

          <div className="relative">
            <Icon name="Search" className="w-4 h-4 text-os-muted absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search apps, projects and commands..."
              className="w-full pl-9 pr-3 py-2 bg-os-surface border border-os-border rounded-xl text-xs text-white placeholder-os-muted focus:outline-none focus:border-sky-400 transition-colors font-mono"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            <div className="text-[11px] font-semibold text-os-muted uppercase tracking-wider px-1 mb-2">
              All Applications
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {APP_DEFINITIONS.map(app => (
                <button
                  key={app.id}
                  onClick={() => openWindow(app.id)}
                  className="flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-os-surface border border-os-border flex items-center justify-center text-sky-400 group-hover:border-sky-400/40">
                    <Icon name={app.icon} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-slate-200 group-hover:text-white truncate">{app.title}</div>
                    <div className="text-[10px] text-os-muted truncate">{app.short}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-os-border flex items-center justify-between text-xs text-os-muted">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>KaelOS v3.4</span>
            </div>
            <button
              onClick={() => setBootState('ready')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/20 hover:text-rose-300 text-os-muted transition-colors text-xs font-medium"
            >
              <Icon name="Power" className="w-3.5 h-3.5" />
              <span>Restart System</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Settings Flyout */}
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

      {/* Calendar Clock Widget */}
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

      {/* TASKBAR */}
      <div className="h-12 bg-os-panel/90 border-t border-os-border px-3 flex items-center justify-between z-40 backdrop-blur-2xl select-none">
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              setStartMenuOpen(!startMenuOpen);
              setQuickSettingsOpen(false);
              setCalendarOpen(false);
            }}
            className={`h-9 px-3 rounded-xl flex items-center gap-2 font-semibold text-xs transition-all ${
              startMenuOpen
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                : 'bg-os-surface hover:bg-white/[0.08] text-slate-200 border border-os-border hover:border-white/20'
            }`}
          >
            <div className="w-4 h-4 rounded-md bg-gradient-to-tr from-sky-400 to-indigo-400 flex items-center justify-center text-[10px] text-white font-bold">
              K
            </div>
            <span>Start</span>
          </button>

          <div className="h-5 w-px bg-os-border mx-1" />

          <div className="flex items-center gap-1 overflow-x-auto max-w-[50vw] pr-2">
            {activeWindows.map(win => {
              const appDef = APP_DEFINITIONS.find(a => a.id === win.id);
              if (!appDef) return null;
              const isFocused = focusedWindowId === win.id && !win.isMinimized;

              return (
                <button
                  key={win.id}
                  onClick={() => {
                    sound.playClick();
                    if (win.isMinimized) {
                      focusWindow(win.id);
                    } else if (focusedWindowId === win.id) {
                      minimizeWindow(win.id);
                    } else {
                      focusWindow(win.id);
                    }
                  }}
                  className={`h-9 px-3 rounded-xl flex items-center gap-2 text-xs font-medium transition-all max-w-[150px] truncate border ${
                    isFocused
                      ? 'bg-sky-500/20 border-sky-400/50 text-white shadow-sm'
                      : win.isMinimized
                      ? 'bg-os-surface/40 border-transparent text-os-muted hover:bg-os-surface'
                      : 'bg-os-surface border-os-border text-slate-300 hover:border-white/20'
                  }`}
                >
                  <Icon name={appDef.icon} className={`w-4 h-4 shrink-0 ${isFocused ? 'text-sky-400' : 'text-os-muted'}`} />
                  <span className="truncate">{appDef.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              setQuickSettingsOpen(!quickSettingsOpen);
              setStartMenuOpen(false);
              setCalendarOpen(false);
            }}
            className="h-9 px-2.5 rounded-xl bg-os-surface hover:bg-white/[0.08] border border-os-border flex items-center gap-2 text-os-muted hover:text-white transition-colors"
            title="System Controls"
          >
            <Icon name="Wifi" className="w-3.5 h-3.5 text-emerald-400" />
            <Icon name={soundMuted ? "VolumeX" : "Volume2"} className={`w-3.5 h-3.5 ${soundMuted ? 'text-rose-400' : 'text-sky-400'}`} />
            <Icon name="SlidersHorizontal" className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              setCalendarOpen(!calendarOpen);
              setStartMenuOpen(false);
              setQuickSettingsOpen(false);
            }}
            className="h-9 px-3 rounded-xl bg-os-surface hover:bg-white/[0.08] border border-os-border text-right font-mono text-xs text-slate-200 transition-colors flex flex-col justify-center leading-none"
          >
            <span className="font-semibold text-white">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-[10px] text-os-muted mt-0.5">
              {currentTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. APPLICATION ROUTER SWITCH
// ============================================================================
function renderAppContent(appId, props) {
  switch (appId) {
    case "about":
      return <AboutApp {...props} />;
    case "projects":
      return <ProjectsApp {...props} />;
    case "skills":
      return <SkillsApp {...props} />;
    case "experience":
      return <ExperienceApp {...props} />;
    case "buildlog":
      return <BuildLogApp {...props} />;
    case "ai-assistant":
      return <AIAssistantApp {...props} />;
    case "guestbook":
      return <GuestbookApp {...props} />;
    case "terminal":
      return <TerminalApp {...props} />;
    case "contact":
      return <ContactApp {...props} />;
    case "resume":
      return <ResumeApp {...props} />;
    case "settings":
      return <SettingsApp {...props} />;
    case "trash":
      return <TrashApp {...props} />;
    default:
      return <div className="p-8 text-center text-os-muted">Application content unavailable.</div>;
  }
}

// ============================================================================
// APP 1: ABOUT ME (With Custom OS Telemetry Heatmap)
// ============================================================================
function AboutApp({ profileData, openWindow }) {
  const activityDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 52 * 7; i++) {
      const rand = Math.random();
      let level = 0;
      if (rand > 0.85) level = 4;
      else if (rand > 0.65) level = 3;
      else if (rand > 0.45) level = 2;
      else if (rand > 0.25) level = 1;
      days.push({ id: i, level });
    }
    return days;
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-2xl bg-os-panel border border-os-border">
        <img
          src={profileData.avatar}
          alt={profileData.name}
          className="w-24 h-24 rounded-2xl object-cover border-2 border-sky-400/40 shadow-xl"
        />
        <div className="flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">{profileData.name}</h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
              @{profileData.handle}
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Available for Core Roles
            </span>
          </div>
          <p className="text-sm font-medium text-sky-300">{profileData.role}</p>
          <p className="text-xs text-os-muted leading-relaxed selectable-text">
            Systems engineer focused on low-latency distributed runtimes, vector database internals, and local-first AI execution graphs. Passionate about building robust infrastructure with high mechanical sympathy.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-os-muted pt-2 font-mono">
            <span className="flex items-center gap-1.5">
              <Icon name="MapPin" className="w-3.5 h-3.5 text-sky-400" /> {profileData.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Icon name="Mail" className="w-3.5 h-3.5 text-sky-400" /> {profileData.email}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-os-panel border border-os-border space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Icon name="Activity" className="w-4 h-4 text-emerald-400" />
              GitHub Commit & Activity Matrix (Past 365 Days)
            </h3>
            <p className="text-xs text-os-muted">Continuous integration and kernel patch logs synced from @{profileData.handle}</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-os-muted">
            <span>Streak: <strong className="text-emerald-400">{profileData.stats.streak} days</strong></span>
            <span>Longest: <strong className="text-sky-400">{profileData.stats.longestStreak} days</strong></span>
          </div>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="grid grid-flow-col grid-rows-7 gap-1 w-max">
            {activityDays.map(d => {
              const colors = [
                'bg-slate-800/40',
                'bg-emerald-950/80 border border-emerald-800/30',
                'bg-emerald-700/80',
                'bg-emerald-500',
                'bg-emerald-300 shadow-sm shadow-emerald-400/50'
              ];
              return (
                <div
                  key={d.id}
                  className={`w-2.5 h-2.5 rounded-sm ${colors[d.level]} transition-all hover:scale-125`}
                  title={`Activity Level: ${d.level}`}
                />
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-os-surface border border-os-border">
            <div className="text-os-muted text-[11px]">Total Contributions</div>
            <div className="text-base font-bold text-white mt-0.5">{profileData.stats.contributions}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-os-surface border border-os-border">
            <div className="text-os-muted text-[11px]">Public Repositories</div>
            <div className="text-base font-bold text-sky-400 mt-0.5">{profileData.stats.repos}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-os-surface border border-os-border">
            <div className="text-os-muted text-[11px]">OSS GitHub Stars</div>
            <div className="text-base font-bold text-amber-400 mt-0.5">{profileData.stats.stars}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-os-surface border border-os-border">
            <div className="text-os-muted text-[11px]">Pipeline Uptime</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">{profileData.stats.uptime}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-os-panel border border-os-border space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Icon name="Compass" className="w-4 h-4 text-sky-400" />
            Current Engineering Focus
          </h3>
          <p className="text-xs text-os-muted leading-relaxed selectable-text">
            {profileData.systemProfile.focus}
          </p>
          <div className="pt-2 border-t border-os-border/60">
            <span className="text-[11px] font-semibold text-slate-300">Currently Learning & Exploring:</span>
            <p className="text-xs text-sky-300/90 font-mono mt-1">{profileData.systemProfile.learning}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-os-panel border border-os-border space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Icon name="Code" className="w-4 h-4 text-indigo-400" />
            Core Stack & Philosophy
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {profileData.systemProfile.favoriteStack.map(tech => (
              <span key={tech} className="px-2.5 py-1 rounded-lg bg-os-surface border border-os-border font-mono text-xs text-sky-300 font-medium">
                {tech}
              </span>
            ))}
          </div>
          <div className="pt-2 border-t border-os-border/60">
            <span className="text-[11px] font-semibold text-slate-300">Philosophy:</span>
            <p className="text-xs text-os-muted italic mt-1 selectable-text">"{profileData.systemProfile.philosophy}"</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => openWindow('projects')}
          className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-sky-500/20"
        >
          <Icon name="FolderGit2" className="w-4 h-4" />
          <span>Explore Repositories</span>
        </button>
        <button
          onClick={() => openWindow('contact')}
          className="px-4 py-2.5 rounded-xl bg-os-panel hover:bg-os-card border border-os-border text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <Icon name="Mail" className="w-4 h-4" />
          <span>Get In Touch</span>
        </button>
        <button
          onClick={() => openWindow('terminal')}
          className="px-4 py-2.5 rounded-xl bg-os-panel hover:bg-os-card border border-os-border text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <Icon name="Terminal" className="w-4 h-4" />
          <span>Launch Terminal</span>
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// APP 2: PROJECTS (Windows Explorer File Manager)
// ============================================================================
function ProjectsApp({ projectsData, selectedProject, setSelectedProject, sound, isSyncingGithub }) {
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

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
            { id: "Web & Graphics", label: "Graphics & Web", icon: "Layers" }
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
            <span className="text-slate-400">kaelOS</span>
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
}

// ============================================================================
// APP 3: SKILLS (System Diagnostics)
// ============================================================================
function SkillsApp({ SKILLS_DATA }) {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="p-4 rounded-2xl bg-os-panel border border-os-border flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Icon name="Cpu" className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">System Capabilities & Diagnostics</div>
            <div className="text-os-muted">Telemetry Status: Active Production</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-os-muted">
          <span>Stack: Multi-Disciplinary</span>
          <span>Memory Footprint: Lean</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {SKILLS_DATA.map((group, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-os-panel border border-os-border space-y-4">
            <div className="flex items-center justify-between border-b border-os-border pb-2.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Icon name="Activity" className="w-4 h-4 text-sky-400" />
                {group.category}
              </h3>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-semibold">
                {group.status}
              </span>
            </div>

            <div className="space-y-2.5">
              {group.items.map(skill => (
                <div
                  key={skill.name}
                  className="p-3 rounded-xl bg-os-surface border border-os-border/70 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white truncate">{skill.name}</span>
                      <span className="font-mono text-[10px] text-sky-400 bg-sky-500/10 px-1.5 py-0.2 rounded border border-sky-500/20">
                        {skill.experience}
                      </span>
                    </div>
                    <div className="text-[11px] text-os-muted truncate font-mono">{skill.metric}</div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-os-card text-slate-200 border border-os-border">
                      {skill.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// APP 4: EXPERIENCE (OS Event Log Viewer)
// ============================================================================
function ExperienceApp({ EXPERIENCE_DATA }) {
  const [filterType, setFilterType] = useState("ALL");

  const filtered = useMemo(() => {
    if (filterType === "ALL") return EXPERIENCE_DATA;
    return EXPERIENCE_DATA.filter(e => e.type === filterType);
  }, [EXPERIENCE_DATA, filterType]);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="p-4 rounded-2xl bg-os-panel border border-os-border flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Icon name="History" className="w-4 h-4 text-sky-400" />
            System Event & Career Chronology
          </h2>
          <p className="text-xs text-os-muted">Verified engineering milestones and leadership roles</p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          {["ALL", "Full-Time", "Milestone", "Education"].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-lg border transition-colors ${
                filterType === t
                  ? 'bg-sky-500 text-white border-sky-400 font-semibold'
                  : 'bg-os-surface text-os-muted border-os-border hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="relative border-l-2 border-os-border ml-4 pl-6 space-y-8">
        {filtered.map(entry => (
          <div key={entry.id} className="relative group">
            <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-os-panel border-2 border-sky-400 group-hover:bg-sky-400 transition-colors" />

            <div className="p-5 rounded-2xl bg-os-panel border border-os-border os-card-hover space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">{entry.role}</h3>
                  <div className="text-xs font-semibold text-sky-400">{entry.org}</div>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-os-surface text-os-muted border border-os-border">
                    {entry.location}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/30 font-semibold">
                    {entry.date}
                  </span>
                </div>
              </div>

              <p className="text-xs text-os-muted leading-relaxed selectable-text">
                {entry.summary}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-os-border/50 font-mono text-[11px]">
                {entry.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-os-surface text-slate-300 border border-os-border">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// APP 5: BUILD LOG (Live Work in Progress Feed)
// ============================================================================
function BuildLogApp({ BUILD_LOGS, openWindow }) {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-transparent border border-amber-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Icon name="Flame" className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Live Development Stream</h2>
            <p className="text-xs text-os-muted">Real-time changelog, active sprints, and upcoming explorations</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/30">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>ACTIVE SPRINT</span>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Icon name="Radio" className="w-4 h-4" /> 01. NOW — Active Engineering Work
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BUILD_LOGS.now.map((item, i) => (
            <div key={i} className="p-4 rounded-2xl bg-os-panel border border-amber-500/20 space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-white">{item.title}</span>
                <span className="text-[10px] font-mono text-os-muted">{item.time}</span>
              </div>
              <p className="text-xs text-os-muted leading-relaxed selectable-text">{item.details}</p>
              <div>
                <div className="flex justify-between text-[11px] font-mono text-os-muted mb-1">
                  <span>Completion</span>
                  <span className="text-amber-400">{item.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-os-surface rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold font-mono text-sky-400 uppercase tracking-wider flex items-center gap-2">
          <Icon name="PackageCheck" className="w-4 h-4" /> 02. RECENTLY SHIPPED
        </h3>
        <div className="space-y-2.5">
          {BUILD_LOGS.recentlyShipped.map((ship, i) => (
            <div key={i} className="p-4 rounded-xl bg-os-panel border border-os-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  {ship.title}
                  <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-1.5 py-0.2 rounded border border-sky-500/20">
                    {ship.date}
                  </span>
                </div>
                <p className="text-os-muted mt-1 leading-relaxed selectable-text">{ship.description}</p>
              </div>
              <span className="text-[11px] font-mono text-sky-400 shrink-0 font-medium">{ship.linkText}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// APP 6: ASK AI ASSISTANT (Interactive Knowledge Base Engine)
// ============================================================================
function AIAssistantApp({ profileData, projectsData, sound, openWindow }) {
  const [messages, setMessages] = useState([
    {
      id: "m1",
      sender: "ai",
      text: `Greetings! I am the KaelOS Persona Engine. Ask me anything about ${profileData.name}'s experience, technical stack, flagship projects like Nexus-KV, or engineering availability.`
    }
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef(null);

  const suggestedQueries = [
    `Who is ${profileData.name}?`,
    "What has he built?",
    "What is his core tech stack?",
    "Tell me about his best project.",
    "Is he available for hire?",
    "How can I contact him?"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || isThinking) return;

    sound.playClick();
    const userMsg = { id: Date.now().toString(), sender: "user", text: query.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      let reply = "";
      const lower = query.toLowerCase();

      if (lower.includes("who is") || lower.includes("about") || lower.includes("background") || lower.includes("persona")) {
        reply = `${profileData.name} is a ${profileData.role} based in ${profileData.location}. He specializes in low-latency distributed runtimes (Rust, Go, C++), vector search engines, and deterministic agent execution graphs.`;
      } else if (lower.includes("built") || lower.includes("project") || lower.includes("nexus") || lower.includes("repo")) {
        const topProj = projectsData[0] || { name: "Nexus-KV", tagline: "Distributed vector database in Rust" };
        reply = `${profileData.name}'s flagship repository is ${topProj.name} (${topProj.tagline}). It utilizes SIMD AVX-512 vector distance kernels and io_uring storage to achieve high QPS sub-millisecond retrieval.`;
      } else if (lower.includes("tech") || lower.includes("stack") || lower.includes("skill") || lower.includes("language")) {
        reply = `His core stack includes Rust, TypeScript, WebGPU/WGSL, eBPF, PyTorch, ClickHouse, and PostgreSQL. He values mechanical sympathy and low memory footprint above all else.`;
      } else if (lower.includes("contact") || lower.includes("email") || lower.includes("hire") || lower.includes("reach")) {
        reply = `You can reach ${profileData.name} directly via email at ${profileData.email} or by launching the Contact application from the desktop!`;
      } else {
        reply = `Regarding "${query}": ${profileData.name} approaches engineering with a focus on mechanical sympathy—minimizing GC pauses, optimizing SIMD memory layouts, and building deterministic runtimes. You can explore the Skills or Experience apps to see full system metrics!`;
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: "ai", text: reply }]);
      setIsThinking(false);
      sound.playPop();
    }, 750);
  };

  return (
    <div className="h-full flex flex-col bg-os-bg">
      <div className="p-3.5 bg-os-panel border-b border-os-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white">
            <Icon name="Bot" className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>KaelOS Persona Agent</span>
              <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">RAG Synced</span>
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online & Ready
            </div>
          </div>
        </div>
        <button
          onClick={() => setMessages([{ id: "m1", sender: "ai", text: "Chat history cleared. What would you like to know about Kaelen?" }])}
          className="text-xs text-os-muted hover:text-white p-1"
          title="Clear Chat"
        >
          <Icon name="RotateCcw" className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
              msg.sender === 'user'
                ? 'bg-sky-500 text-white font-bold'
                : 'bg-os-panel border border-os-border text-sky-400'
            }`}>
              {msg.sender === 'user' ? 'U' : <Icon name="Bot" className="w-3.5 h-3.5" />}
            </div>
            <div className={`p-3 rounded-2xl text-xs leading-relaxed selectable-text ${
              msg.sender === 'user'
                ? 'bg-sky-500 text-white rounded-tr-none'
                : 'bg-os-panel border border-os-border text-slate-200 rounded-tl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-os-muted font-mono p-2">
            <div className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span>Analyzing query...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-2.5 bg-os-panel/60 border-t border-os-border/70 overflow-x-auto flex gap-1.5 no-scrollbar">
        {suggestedQueries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 rounded-full bg-os-surface hover:bg-white/[0.08] border border-os-border text-[11px] text-os-muted hover:text-sky-300 shrink-0 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-3 bg-os-panel border-t border-os-border flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about Kaelen's background or code..."
          className="flex-1 px-3.5 py-2 rounded-xl bg-os-surface border border-os-border text-xs text-white placeholder-os-muted focus:outline-none focus:border-sky-400 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <span>Send</span>
          <Icon name="Send" className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}

// ============================================================================
// APP 7: GUESTBOOK (Organic Sticky Note Board)
// ============================================================================
function GuestbookApp({
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
}) {
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="p-4 rounded-2xl bg-os-panel border border-os-border flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Icon name="StickyNote" className="w-4 h-4 text-amber-400" />
            Community Guestbook & Sticky Wall
          </h2>
          <p className="text-xs text-os-muted">Leave a permanent note, endorsement, or greeting on KaelOS</p>
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
              placeholder="Role / Handle (e.g. Kernel Dev)"
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
}

// ============================================================================
// APP 8: TERMINAL (Interactive zsh Shell)
// ============================================================================
function TerminalApp({ profileData, projectsData, SKILLS_DATA, openWindow, sound }) {
  const [history, setHistory] = useState([
    { type: "system", text: "KaelOS Terminal (x86_64-kael-system)" },
    { type: "system", text: "Type 'help' or 'neofetch' to view available system diagnostics." }
  ]);
  const [command, setCommand] = useState("");
  const termEndRef = useRef(null);

  useEffect(() => {
    termEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = command.trim().toLowerCase();
    if (!cmd) return;

    sound.playClick();
    const newHist = [...history, { type: "user", text: `visitor@kaelOS:~$ ${command}` }];
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
/\\_/\ ${profileData.handle}@kaelOS
( o.o ) --------------
> ^ < OS: KaelOS v3.4.0 (x86_64)
Host: ${profileData.name} Node Cluster
Kernel: 2026.08-lts
Uptime: ${profileData.stats.uptime}
Packages: ${profileData.stats.repos} Repositories
Shell: kael-zsh 5.9
CPU: 16-Core High-Throughput
GPU: WebGPU WGSL Instanced
Memory: Zero-Leak Verified`
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
          text: projectsData.map(p => `• ${p.name.padEnd(16)} [${p.category.padEnd(14)}] - ${p.tagline}`).join("\n")
        });
        break;

      case "skills":
        newHist.push({
          type: "system",
          text: SKILLS_DATA.map(g => `[${g.category.toUpperCase()}]\n ${g.items.map(i => `${i.name} (${i.experience})`).join(", ")}`).join("\n\n")
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
        if (targetApp && APP_DEFINITIONS.some(a => a.id === targetApp)) {
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
        <span className="text-sky-400 font-bold shrink-0">visitor@kaelOS:~$</span>
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
}

// ============================================================================
// APP 9: CONTACT
// ============================================================================
function ContactApp({
  profileData,
  contactForm,
  setContactForm,
  handleContactSubmit,
  contactSending,
  contactSent
}) {
  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div className="p-5 rounded-2xl bg-os-panel border border-os-border space-y-2">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Icon name="Mail" className="w-5 h-5 text-sky-400" />
          Direct Communication Channel
        </h2>
        <p className="text-xs text-os-muted leading-relaxed selectable-text">
          Have an ambitious systems problem, an AI infrastructure roadmap, or a potential core engineering collaboration? Dispatch a message below.
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
              <p className="text-xs text-emerald-200/80">Kaelen will respond directly to your email address.</p>
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
                  placeholder="Discussing a potential distributed systems project or role..."
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
}

// ============================================================================
// APP 10: RESUME VIEWER
// ============================================================================
function ResumeApp({ profileData, addNotification }) {
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
                <span>Staff Infrastructure & AI Systems Architect — Vanguard Labs</span>
                <span className="font-mono text-os-muted text-[11px]">2024 — Present</span>
              </div>
              <p className="text-os-muted mt-1 leading-relaxed">
                Spearheaded the redesign of core distributed vector ingestion pipelines, reducing GPU tail latency by 48% across multi-node Kubernetes clusters with custom Raft consensus logs.
              </p>
            </div>
            <div>
              <div className="flex justify-between font-semibold text-white">
                <span>Senior Systems Engineer — Aetherial Cloud Inc.</span>
                <span className="font-mono text-os-muted text-[11px]">2022 — 2024</span>
              </div>
              <p className="text-os-muted mt-1 leading-relaxed">
                Designed eBPF socket-level telemetry and zero-copy WebAssembly sandbox runtimes handling 40B+ monthly edge transactions.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-white uppercase tracking-wider text-[11px] border-b border-os-border/60 pb-1 font-mono">
            Education
          </h3>
          <div className="flex justify-between font-semibold text-white">
            <span>B.S. in Computer Science (Distributed Systems) — Univ. of Washington</span>
            <span className="font-mono text-os-muted text-[11px]">Magna Cum Laude</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// APP 11: SYSTEM SETTINGS (GitHub API & PAT Config)
// ============================================================================
function SettingsApp({
  githubUsername,
  setGithubUsername,
  githubPAT,
  setGithubPAT,
  fetchGithubProfile,
  isSyncingGithub,
  githubSyncError,
  addNotification
}) {
  const [handleInput, setHandleInput] = useState(githubUsername);
  const [patInput, setPatInput] = useState(githubPAT);

  const handleSave = (e) => {
    e.preventDefault();
    const cleanUser = handleInput.trim() || 'kaelenthro';
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
        <p className="text-os-muted">Connect live GitHub data, sync private repositories via PAT, and manage telemetry options.</p>
      </div>

      <form onSubmit={handleSave} className="p-5 rounded-2xl bg-os-panel border border-os-border space-y-4">
        <div className="space-y-1.5">
          <label className="block font-semibold text-slate-200">GitHub Username</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={handleInput}
              onChange={(e) => setHandleInput(e.target.value)}
              placeholder="e.g. kaelenthro or your username"
              className="flex-1 px-3.5 py-2 rounded-xl bg-os-surface border border-os-border text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
            />
          </div>
          <p className="text-[11px] text-os-muted">
            The OS will fetch public repositories, bio, stars, and contribution metrics directly from `api.github.com/users/{handleInput}`.
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
            Stored only in temporary `sessionStorage` for this browser session. Enables accessing private repositories and higher GitHub API rate limits.
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
}

// ============================================================================
// APP 12: TRASH
// ============================================================================
function TrashApp({ TRASH_ITEMS, addNotification }) {
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
        {TRASH_ITEMS.map((item, idx) => (
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
}

// --- MOUNT REACT ROOT ---
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<KaelOS />);
