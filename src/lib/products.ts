// Product data types and registry for Chrome Extensions, Android Apps, and achievements

export type ProductType = "extension" | "app";

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  type: ProductType;
  icon: string;
  coverImage?: string;
  url?: string; // Chrome Web Store, Google Play, GitHub, etc.
  repoUrl?: string; // GitHub repository URL
  technologies: string[];
  features: string[];
  screenshots?: string[];
  featured: boolean;
}

export interface Achievement {
  name: string;
  description: string;
  url: string;
  org: string;
  icon: string;
  year: string;
}

// --- Chrome Extensions ---

export const extensions: Product[] = [
  {
    slug: "navigraph",
    name: "Navigraph",
    tagline:
      "Visualize your browsing paths and navigation history intuitively",
    description:
      "Navigraph helps you understand your information flow and remember browsing trajectories. It visualizes your browsing paths and navigation history in an intuitive way, making it easy to trace back how you arrived at a page and explore your web journey.",
    type: "extension",
    icon: "🧭",
    repoUrl: "https://github.com/wxy/Navigraph",
    technologies: ["TypeScript", "Chrome APIs", "D3.js", "React"],
    features: [
      "Visualize browsing paths as interactive graphs",
      "Track navigation history across tabs and sessions",
      "Understand information flow between sites",
      "Easily trace back how you arrived at any page",
      "Privacy-first — all data stays local",
    ],
    featured: true,
  },
  {
    slug: "silentfeed",
    name: "SilentFeed",
    tagline: "AI-powered RSS reader that learns what you love",
    description:
      "SilentFeed is an AI-powered RSS reader that learns your reading preferences over time, making your feed progressively quieter and more relevant. It filters out noise and surfaces the content that matters most to you.",
    type: "extension",
    icon: "📡",
    repoUrl: "https://github.com/wxy/SilentFeed",
    technologies: [
      "TypeScript",
      "React",
      "Python",
      "AI/ML",
      "Chrome APIs",
    ],
    features: [
      "AI learns your reading preferences over time",
      "Automatically filters out irrelevant content",
      "Keeps your feed clean and focused",
      "Supports multiple RSS sources",
      "Privacy-respecting architecture",
    ],
    featured: true,
  },
  {
    slug: "hitable",
    name: "HiTable",
    tagline: "On-the-go data analysis tool, simplified",
    description:
      "HiTable simplifies your data analysis workflow. It's a lightweight, on-the-go tool for quickly exploring and analyzing tabular data right in your browser — no heavy software needed.",
    type: "extension",
    icon: "📊",
    repoUrl: "https://github.com/wxy/HiTable",
    technologies: ["JavaScript", "Chrome APIs", "HTML/CSS"],
    features: [
      "Quick tabular data exploration in-browser",
      "Lightweight — no heavy dependencies",
      "Intuitive data filtering and sorting",
      "Export results for further analysis",
      "Works offline",
    ],
    featured: true,
  },
  {
    slug: "ai-pulse",
    name: "AI Pulse",
    tagline: "Monitor AI service providers' usage, balance & status",
    description:
      "AI Pulse monitors your usage, balance, and service status across multiple AI providers — including DeepSeek, Kimi, ChatGLM, Baichuan, Qwen, and Wenxin. It supports dual modes: balance monitoring with history charts (with API key) or service status monitoring only (without key).",
    type: "extension",
    icon: "🤖",
    repoUrl: "https://github.com/wxy/ai-pulse",
    technologies: ["TypeScript", "React", "WXT", "Chrome APIs"],
    features: [
      "Monitor multiple AI providers: DeepSeek, Kimi, ChatGLM, Baichuan, Qwen, Wenxin",
      "Dual mode: balance monitoring + charts, or status-only",
      "Historical balance charts with configurable refresh interval",
      "API keys stored locally — never leaves your machine",
      "Auto-refresh in background",
    ],
    featured: true,
  },
];

// --- Android Apps ---

export const apps: Product[] = [
  {
    slug: "actionmoments",
    name: "ActionMoments",
    tagline:
      "Local-first Android app to find and export the best clips from long videos",
    description:
      "ActionMoments is a local-first Android app designed to help you quickly scan long video footage, identify the best candidate clips, and export them for editing. It's not a video editor — it's a smart clip finder that uses on-device analysis to surface highlight moments.",
    type: "app",
    icon: "🎬",
    repoUrl: "https://github.com/wxy/ActionMoments",
    technologies: ["Kotlin", "Jetpack Compose", "Material 3", "Android"],
    features: [
      "Local video import and preview",
      "Remote camera connection and footage browsing",
      "Smart clip scanning with timeline intensity display",
      "Quick panel for semi-automatic highlight selection",
      "Batch export confirmed clips",
      "Chinese and English interface",
      "Privacy-first: no raw video uploads",
    ],
    featured: true,
  },
];

// --- Achievements ---

export const achievements: Achievement[] = [
  {
    name: "LCTT TranslateProject",
    description:
      "Core contributor to the Linux China Translation Project (LCTT), the largest Chinese open-source translation community. Helped translate and publish thousands of technical articles, making Linux and open-source knowledge accessible to Chinese readers worldwide.",
    url: "https://github.com/LCTT/TranslateProject",
    org: "Linux China",
    icon: "🏆",
    year: "2013 – 2025",
  },
];

// --- Helpers ---

export function getAllProducts(): Product[] {
  return [...extensions, ...apps];
}

export function getFeaturedProducts(): Product[] {
  return getAllProducts().filter((p) => p.featured);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getAllProducts().find((p) => p.slug === slug);
}
