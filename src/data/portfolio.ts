export type ProjectStatus = "SHIPPED" | "MAINTAINED" | "WIP" | "ARCHIVED" | "LIVE";
export interface Project {
  id: string;
  name: string;
  folder: string;
  folderId: string;
  year: string;
  status: ProjectStatus;
  summary: string;
  stack: string[];
  highlights: string[];
  metrics?: {
    label: string;
    value: string;
  }[];
  description: string;
}
export interface WorkFolder {
  id: string;
  name: string;
  glyph: string;
  blurb: string;
}
export const workFolders: WorkFolder[] = [
  { id: "minecraft", name: "Minecraft", glyph: "⛏", blurb: "Server software, plugins & packet engineering" },
  { id: "java", name: "Java", glyph: "☕", blurb: "Core systems, concurrency & JVM tooling" },
  { id: "web", name: "Web", glyph: "◐", blurb: "Interfaces, dashboards & realtime apps" },
  { id: "experiments", name: "Experiments", glyph: "⚗", blurb: "Half-baked, fully dangerous ideas" },
  { id: "archived", name: "Archived", glyph: "▣", blurb: "Old builds, kept for posterity" },
  { id: "github", name: "GitHub", glyph: "⑂", blurb: "Live-indexed from GitHub — topic: spectre-portfolio" },
];
export const projects: Project[] = [
  {
    id: "packet-replay",
    name: "ReplayCore",
    folder: "Minecraft",
    folderId: "minecraft",
    year: "2024",
    status: "MAINTAINED",
    summary: "A packet recording & replay engine built on ProtocolLib.",
    stack: ["Java", "ProtocolLib", "Netty", "Paper"],
    highlights: [
      "Captures raw play-phase packets into a compact delta-encoded stream.",
      "Replays player movement, combat and inventory frame-perfect.",
      "Used as the backbone of the LAB Packet Visualizer.",
    ],
    metrics: [
      { label: "PACKETS/S", value: "12k" },
      { label: "OVERHEAD", value: "<2%" },
      { label: "REPLAY DRIFT", value: "0ms" },
    ],
    description:
      "ReplayCore is a deterministic packet recorder. Instead of saving block states, it snapshots the network traffic itself — letting you rewind a raid, a grief, or a world record attempt and play it back tick-for-tick. It taught me more about the protocol than every wiki page combined.",
  },
  {
    id: "citadel",
    name: "Citadel",
    folder: "Minecraft",
    folderId: "minecraft",
    year: "2023",
    status: "SHIPPED",
    summary: "Region protection that thinks in claims, not coordinates.",
    stack: ["Java", "Paper", "SQLite", "Async"],
    highlights: [
      "Sub-millisecond claim lookups via spatial hashing.",
      "Trust hierarchies: owner → member → visitor flags.",
      "Handles 40k concurrent claims without breaking a sweat.",
    ],
    metrics: [
      { label: "CLAIMS", value: "40k+" },
      { label: "LOOKUP", value: "0.4ms" },
      { label: "SERVERS", value: "120" },
    ],
    description:
      "Citadel is grief protection for big networks. The hard part wasn't the permissions — it was making 40,000 overlapping regions queryable in under a millisecond while the server tick loop begged for mercy. Spatial hashing + an async save queue got us there.",
  },
  {
    id: "mythic-entities",
    name: "MythicEntities",
    folder: "Minecraft",
    folderId: "minecraft",
    year: "2022",
    status: "ARCHIVED",
    summary: "Custom mob behaviour defined in YAML, not bytecode.",
    stack: ["Java", "Spigot", "NMS"],
    highlights: [
      "Declarative AI graph: goals, targets and triggers as data.",
      "Spawned 1,000 custom entities at stable TPS.",
    ],
    metrics: [
      { label: "ENTITY TYPES", value: "200+" },
      { label: "TPS @ 1k", value: "19.8" },
    ],
    description:
      "Before datapacks could do this, MythicEntities let server owners script entire boss fights in a config file. It's archived now — the platform caught up — but it's where I learned that good abstractions age better than clever code.",
  },
  {
    id: "kv-store",
    name: "ConcurrentKV",
    folder: "Java",
    folderId: "java",
    year: "2024",
    status: "LIVE",
    summary: "A lock-free-ish in-memory key-value store, written for fun.",
    stack: ["Java", "Concurrency", "JMH", "Netty"],
    highlights: [
      "Striped locks + copy-on-write segments for read-heavy loads.",
      "Benchmarked against ConcurrentHashMap with JMH.",
      "Survives 1M ops/sec on a single core.",
    ],
    metrics: [
      { label: "OPS/SEC", value: "1.1M" },
      { label: "P99 LATENCY", value: "0.9ms" },
      { label: "LANG", value: "Java 21" },
    ],
    description:
      "A weekend project that spiralled. I wanted to truly understand what happens under contention — striped locks, false sharing, memory barriers. The result isn't faster than the JDK's map, but I can finally explain why.",
  },
  {
    id: "bytecode-weaver",
    name: "BytecodeWeaver",
    folder: "Java",
    folderId: "java",
    year: "2023",
    status: "MAINTAINED",
    summary: "Runtime bytecode rewriting for hot-patching live plugins.",
    stack: ["Java", "ASM", "Agents", "JVM"],
    highlights: [
      "Java agent that instruments classes at load time.",
      "Reload plugin logic without restarting the server.",
      "Survives the legendary ClassDefChangedError minefield.",
    ],
    description:
      "BytecodeWeaver injects hooks into compiled classes so a plugin can be patched live. It is equal parts powerful and terrifying. I wrote it because waiting 90 seconds for a restart during a livestreamed debug session was, frankly, unacceptable.",
  },
  {
    id: "event-bus",
    name: "HighwayBus",
    folder: "Java",
    folderId: "java",
    year: "2022",
    status: "MAINTAINED",
    summary: "An event dispatcher measured in nanoseconds.",
    stack: ["Java", "Reflection", "Codegen"],
    highlights: [
      "Method-handle based dispatch, zero reflection on the hot path.",
      "Subscriber indexing generated at registration time.",
    ],
    metrics: [
      { label: "DISPATCH", value: "38ns" },
      { label: "SUBSCRIBERS", value: "∞" },
    ],
    description:
      "HighwayBus is an event bus that refuses to reflect at dispatch time. Everything is resolved into method handles up front. The 38-nanosecond number is real, and slightly embarrassing to brag about — but here we are.",
  },
  {
    id: "spectre-os",
    name: "spectre.os",
    folder: "Web",
    folderId: "web",
    year: "2025",
    status: "LIVE",
    summary: "The very operating system you are staring at right now.",
    stack: ["React", "TypeScript", "Tailwind", "Vite"],
    highlights: [
      "Fully simulated window manager: drag, resize, snap, minimise.",
      "A working command terminal with a hidden sudo command.",
      "No frameworks for the OS chrome — every pixel is hand-rolled.",
    ],
    metrics: [
      { label: "WINDOWS", value: "∞" },
      { label: "COMMANDS", value: "12" },
      { label: "STATUS", value: "RUNNING" },
    ],
    description:
      "Most portfolios are a list. This one is a machine. I wanted hiring managers to leave thinking 'that was weird, in a good way' — and to remember the name. If you're reading this inside the SYSTEM > ABOUT window, the meta-joke has fully landed.",
  },
  {
    id: "realtime-dash",
    name: "TelemetryDeck",
    folder: "Web",
    folderId: "web",
    year: "2024",
    status: "SHIPPED",
    summary: "A realtime server dashboard that updates 10× a second.",
    stack: ["TypeScript", "React", "WebSockets", "Canvas"],
    highlights: ["Canvas-rendered sparklines at 60fps.", "WebSocket stream with backpressure-aware batching."],
    metrics: [
      { label: "REFRESH", value: "10Hz" },
      { label: "FPS", value: "60" },
    ],
    description:
      "TelemetryDeck watches a fleet of game servers and draws their vitals live. The trick was rendering 40 animated charts without the browser crying — Canvas and a single draw loop did the heavy lifting.",
  },
  {
    id: "shader-playground",
    name: "ShaderPlayground",
    folder: "Experiments",
    folderId: "experiments",
    year: "2024",
    status: "WIP",
    summary: "Live GLSL editor that renders as you type.",
    stack: ["TypeScript", "WebGL", "Monaco"],
    highlights: ["Hot-reloading fragment shaders.", "Error annotations straight from the compiler."],
    description:
      "A tiny ShaderToy clone. Mostly built so I could learn the maths behind signed-distance fields. Currently 'WIP' which is developer for 'I'll finish it on a rainy weekend that never comes.'",
  },
  {
    id: "llm-router",
    name: "CheapRouter",
    folder: "Experiments",
    folderId: "experiments",
    year: "2025",
    status: "WIP",
    summary: "Routes prompts to the cheapest LLM that can still answer them.",
    stack: ["TypeScript", "Node", "Edge"],
    highlights: ["Tiny classifier decides model tier per request.", "Cut a side-project's API bill by ~70%."],
    description:
      "CheapRouter is a greedy little proxy. It classifies how hard your prompt is and sends it to the cheapest model that probably won't embarrass itself. It is 70% savings and 30% existential dread.",
  },
  {
    id: "legacy-economy",
    name: "LegacyEconomy",
    folder: "Archived",
    folderId: "archived",
    year: "2019",
    status: "ARCHIVED",
    summary: "My first plugin. An economy system. It was... a lot.",
    stack: ["Java", "Bukkit", "MySQL"],
    highlights: ["Written before I knew what 'normalisation' meant.", "Somehow still ran in production for two years."],
    description:
      "The code is unspeakable. God classes, raw SQL concatenated from user input, a giant switch statement that ruled them all. I keep it here as a humbling monument to how far I've come — and a warning to never stop refactoring.",
  },
  {
    id: "v1-site",
    name: "v1-portfolio",
    folder: "Archived",
    folderId: "archived",
    year: "2020",
    status: "ARCHIVED",
    summary: "The portfolio this one replaced. Plain, polite, forgettable.",
    stack: ["HTML", "CSS", "Regret"],
    highlights: ["Had a hero section. And a contact form. That's it."],
    description:
      "A clean, responsive, professionally boring portfolio. It listed my skills with progress bars (lies), showed three projects, and vanished from memory within seconds of being closed. SPECTRE.OS is its revenge.",
  },
];
export const projectById = (id: string) => projects.find((p) => p.id === id);
export interface Skill {
  id: string;
  label: string;
  group: "core" | "jvm" | "web" | "infra";
  level: number;
  years: number;
  blurb: string;
}
export const skills: Skill[] = [
  {
    id: "java",
    label: "JAVA",
    group: "core",
    level: 95,
    years: 8,
    blurb:
      "Mother tongue. A decade deep in the JVM — concurrency, bytecode, GC tuning, and long-running arguments with the classloader that I mostly win.",
  },
  {
    id: "ts",
    label: "TYPESCRIPT",
    group: "core",
    level: 88,
    years: 6,
    blurb: "The escape hatch when Java gets ceremonious. I write types the way some people write tests — early, and a little defensively.",
  },
  {
    id: "paper",
    label: "PAPER",
    group: "jvm",
    level: 92,
    years: 7,
    blurb: "The Minecraft server platform. I know its scheduler, its region threads, and its opinions, intimately.",
  },
  {
    id: "protocollib",
    label: "PROTOCOLLIB",
    group: "jvm",
    level: 90,
    years: 6,
    blurb: "Packet interception. Where the real magic — and the real bugs — live.",
  },
  {
    id: "maven",
    label: "MAVEN",
    group: "jvm",
    level: 80,
    years: 8,
    blurb: "Builds, dependency graphs, multi-module repos. Yes I've read the POM reference. No, I'm not proud.",
  },
  {
    id: "spigot",
    label: "SPIGOT",
    group: "jvm",
    level: 85,
    years: 9,
    blurb: "The older API. Still alive in a thousand servers, and still in my muscle memory.",
  },
  {
    id: "react",
    label: "REACT",
    group: "web",
    level: 86,
    years: 5,
    blurb: "Hooks, suspense, the occasional context-induced headache. This whole OS runs on it.",
  },
  {
    id: "node",
    label: "NODE",
    group: "web",
    level: 82,
    years: 5,
    blurb: "Backends, CLIs, the odd edge function. I've made peace with the event loop — it still tests me occasionally.",
  },
  {
    id: "tailwind",
    label: "TAILWIND",
    group: "web",
    level: 84,
    years: 4,
    blurb: "Design system as syntax. Skeptical at first, fully converted now.",
  },
  {
    id: "docker",
    label: "DOCKER",
    group: "infra",
    level: 78,
    years: 5,
    blurb: "If it works locally, it ships in a container and takes the blame with it.",
  },
  {
    id: "linux",
    label: "LINUX",
    group: "infra",
    level: 83,
    years: 8,
    blurb: "My daily driver. I write bash like some people write poetry — badly, but with feeling.",
  },
  {
    id: "git",
    label: "GIT",
    group: "infra",
    level: 90,
    years: 9,
    blurb: "Rebases, reflogs, the occasional cherry-pick from the ninth circle. I've dug myself out of every hole.",
  },
  {
    id: "sql",
    label: "SQL",
    group: "infra",
    level: 76,
    years: 7,
    blurb: "Indexes, execution plans, and a standing feud with anything that quietly does N+1 queries.",
  },
];
export const skillEdges: [string, string][] = [
  ["java", "paper"],
  ["paper", "spigot"],
  ["paper", "protocollib"],
  ["java", "maven"],
  ["java", "protocollib"],
  ["spigot", "protocollib"],
  ["java", "sql"],
  ["ts", "react"],
  ["ts", "node"],
  ["react", "tailwind"],
  ["node", "docker"],
  ["linux", "docker"],
  ["linux", "git"],
  ["java", "git"],
  ["node", "sql"],
  ["java", "ts"],
];
export interface Experiment {
  id: string;
  codename: string;
  name: string;
  status: "WORKING" | "UNSTABLE" | "CLASSIFIED";
  desc: string;
  classified?: boolean;
}
export const experiments: Experiment[] = [
  {
    id: "exp-17",
    codename: "EXPERIMENT_17",
    name: "Packet Visualizer",
    status: "WORKING",
    desc: "Renders live Minecraft network traffic as a flowing particle stream. Click a packet, inspect its fields. Surprisingly useful for debugging desync.",
  },
  {
    id: "exp-23",
    codename: "EXPERIMENT_23",
    name: "Procedural World Generator",
    status: "UNSTABLE",
    desc: "A noise-based terrain engine. Produces beautiful continents, and occasionally a 10,000-block-tall spike that crashes the client. Hence: unstable.",
  },
  {
    id: "exp-08",
    codename: "EXPERIMENT_08",
    name: "ChatTunnel",
    status: "WORKING",
    desc: "Bridges in-game chat to a Discord channel over a WebSocket. Latency under 80ms. Has survived three DDOS attempts.",
  },
  {
    id: "exp-42",
    codename: "EXPERIMENT_42",
    name: "NeuralReverb",
    status: "UNSTABLE",
    desc: "Attempts to generate ambient soundtrack music with a tiny model. Sometimes gorgeous. Sometimes the sound of a robot dying. 50/50.",
  },
  {
    id: "exp-31",
    codename: "EXPERIMENT_31",
    name: "???",
    status: "CLASSIFIED",
    desc: "[ACCESS DENIED] This experiment is sealed. Repeated attempts to declassify it may, however, yield results.",
    classified: true,
  },
];
export const classifiedSecret = {
  title: "CLASSIFICATION LIFTED",
  lines: [
    "EXPERIMENT_31 :: SPECTRE_AUTOLOOM",
    "",
    "An experiment in making an operating system write its own portfolio.",
    "It worked. You are looking at the output right now.",
    "",
    "If you've made it this far, you should probably just hire the human.",
    "",
    "> sudo hire-spectre",
  ],
};
export interface Note {
  id: string;
  title: string;
  date: string;
  body: string;
  tags: string[];
}
export const changelog: Note[] = [
  {
    id: "honest-changelog",
    title: "This tab used to be fake",
    date: "2026.08.16",
    tags: ["meta", "honesty"],
    body: `This used to be a "devlog" full of invented entries — fake dates, a made-up story about a first plugin, opinions I never actually wrote down. It read fine, but none of it happened.

So it's a changelog now. Real entries about real changes to this OS, added as they ship. Less personality-as-decoration, more "here's what actually got built and why."

If a claim shows up here, it's because it's true, not because it sounded good.`,
  },
  {
    id: "skill-blurbs",
    title: "Rewrote the BRAIN skill descriptions",
    date: "2026.08.16",
    tags: ["copy", "polish"],
    body: `Went through every node in the BRAIN skill graph and rewrote the weaker blurbs — TypeScript, Node, Tailwind, Docker, SQL. A few had drifted into stock lines ("types as a safety net," the "if it runs on my machine" joke) that could've been written about anyone.

Kept the ones that already had a real voice — Java, ProtocolLib, Maven, Spigot, Linux, Git — untouched, and matched the new ones to that same dry, first-person tone so the graph doesn't feel stitched together.`,
  },
  {
    id: "status-widget",
    title: "Retired the fake quick-notes widget",
    date: "2026.08.16",
    tags: ["ui", "portfolio"],
    body: `The desktop used to have a "Quick Notes" widget — a checklist with placeholder to-dos ("Build portfolio UI", "Work on plugins") and a + button that just appended more fake entries. It looked interactive but told a visitor nothing real.

Replaced it with a status panel: an availability line, top skills pulled live from the actual BRAIN skill data, and a "sudo hire-spectre" button that opens Contact — reusing the phrase that was already the terminal's hire easter egg instead of a generic CTA.

Same footprint, same corner of the screen. It just does something now.`,
  },
  {
    id: "bg-layer",
    title: "Configurable background layer",
    date: "2026.08.16",
    tags: ["feature", "engineering"],
    body: `Added a background video/image layer behind the whole desktop, driven by a single URL in src/config/background.ts — swap that one string and every panel, the dock, and the windows adapt with no other code changes.

The tricky part wasn't the video, it was making the rest of the UI hold up under it. This project builds to one inlined HTML file, so a bundled video would either bloat that file or bloat the repo — the config takes an external link instead so it stays decoupled from the build. On top of the footage: a darkening scrim, grain, and stronger backdrop-blur on every glass panel, so text stays legible no matter what's playing behind it. Also respects prefers-reduced-motion — the video is skipped entirely for anyone who's asked for less motion.`,
  },
];
export const systemInfo: {
  k: string;
  v: string;
}[] = [
  { k: "OS", v: "SPECTRE.OS" },
  { k: "VERSION", v: "v1.3 (stable)" },
  { k: "KERNEL", v: "HUMAN-1.0" },
  { k: "PRIMARY LANG", v: "JAVA" },
  { k: "SECONDARY", v: "TYPESCRIPT" },
  { k: "SHELL", v: "/bin/zsh" },
  { k: "ENGINE", v: "CAFFEINE" },
  { k: "LOCATION", v: "IND / REMOTE" },
  { k: "BUGS", v: "UNKNOWN (FEATURING)" },
];
export const knownIssues: string[] = [
  "Sleeps irregularly",
  "Refuses to stop debugging",
  '"One more feature" syndrome',
  "Talks to rubber ducks in times of crisis",
  "Refactors code that already works",
  "caffeine.dll: dependency not found (retries forever)",
  "Will refactor your variable names given the chance",
];
export const notifications: {
  title: string;
  body: string;
  tone?: "info" | "warn" | "accent";
}[] = [
  { title: "SPECTRE.OS", body: "New project detected." },
  { title: "SYSTEM", body: "Autosave complete. 0 files changed.", tone: "info" },
  { title: "WARNING", body: "You've been here a while. That's probably a good sign.", tone: "warn" },
  { title: "PROCESS", body: "coffee.exe has stopped responding.", tone: "warn" },
  { title: "SYSTEM", body: "Memory leak in [motivation.dll] patched.", tone: "info" },
  { title: "SPECTRE.OS", body: "A wild recruiter appeared!", tone: "accent" },
  { title: "KERNEL", body: "Rubber duck engaged. Bug resolve imminent.", tone: "info" },
];
export const socials: {
  label: string;
  handle: string;
  value: string;
}[] = [
  { label: "EMAIL", handle: "mail", value: "hello@spectre.dev" },
  { label: "GITHUB", handle: "github", value: "github.com/deathspectre" },
  { label: "DISCORD", handle: "discord", value: "deathspectre#0001" },
];
