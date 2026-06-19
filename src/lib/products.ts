// Product data types and registry for Chrome Extensions, Android Apps, and achievements

export type ProductType = "extension" | "app";
export type Locale = "en" | "zh";

export interface Product {
  slug: string;
  name: string;
  nameZh?: string;
  tagline: string;
  taglineZh?: string;
  description: string;
  descriptionZh?: string;
  type: ProductType;
  icon: string;
  iconUrl?: string;
  coverImage?: string;
  url?: string;
  repoUrl?: string;
  technologies: string[];
  features: string[];
  featuresZh?: string[];
  screenshots?: string[];
  chromeStoreId?: string;
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

// --- Chrome Extensions (sorted by install count) ---

export const extensions: Product[] = [
  {
    slug: "hitable",
    name: "HiTable",
    nameZh: "HiTable",
    tagline: "On-the-go data analysis tool, simplified",
    taglineZh: "随行数据分析工具，化繁为简",
    description:
      "HiTable simplifies your data analysis workflow. It's a lightweight, on-the-go tool for quickly exploring and analyzing tabular data right in your browser — no heavy software needed.",
    descriptionZh:
      "HiTable 简化你的数据分析流程。它是一款轻量的随行工具，让你在浏览器中快速探索和分析表格数据——无需安装重型软件。",
    type: "extension",
    icon: "📊",
    iconUrl: "https://raw.githubusercontent.com/wxy/HiTable/master/assets/logo.png",
    url: "https://chromewebstore.google.com/detail/hitable/gepfjnfkjimhdfemijfnnpefdpocldpc",
    repoUrl: "https://github.com/wxy/HiTable",
    chromeStoreId: "gepfjnfkjimhdfemijfnnpefdpocldpc",
    technologies: ["JavaScript", "Chrome APIs", "HTML/CSS"],
    features: [
      "Quick tabular data exploration in-browser",
      "Lightweight — no heavy dependencies",
      "Intuitive data filtering and sorting",
      "Export results for further analysis",
      "Works offline",
    ],
    featuresZh: [
      "在浏览器中快速探索表格数据",
      "轻量级——无重型依赖",
      "直观的数据筛选与排序",
      "导出结果以供进一步分析",
      "支持离线使用",
    ],
    screenshots: [
      "https://lh3.googleusercontent.com/UebtiweBQXPxeKtnjH-sp6JORBXboidt9ZmtXA4jFkz23LNM3LlImhPM0AsdHgrCexVyKgaDkEf82MBau99akJ8Qpw=w1280-h800",
      "https://lh3.googleusercontent.com/T5EHymEIHjaEX5R-m2W41UG862l71Njh3fH2lIjDYURPyekQFkAi6wAgw1NmkgIW-wpqVH-UvFOxr2UDy28Agnst=w1280-h800",
      "https://lh3.googleusercontent.com/zKOll-DPTwoNqpiB5aQchjp126g2a7C-gM_FYnucxTNxIGOPwqI6qnxr0-XHgAvJ_2cqytdKjg=w1280-h800",
      "https://lh3.googleusercontent.com/uBvJ0URxesL9M9JuK5Obx_OUdh360qU_klJkGP--3RMpRjQGkI3Gc5eOEEqFLSU6XRUV8G1QYNTiAAma3EFwaOc_bA=w1280-h800",
    ],
    featured: true,
  },
  {
    slug: "navigraph",
    name: "Navigraph",
    nameZh: "Navigraph",
    tagline: "Visualize your browsing paths and navigation history intuitively",
    taglineZh: "直观可视化浏览路径与导航历史",
    description:
      "Navigraph helps you understand your information flow and remember browsing trajectories. It visualizes your browsing paths and navigation history in an intuitive way, making it easy to trace back how you arrived at a page and explore your web journey.",
    descriptionZh:
      "Navigraph 帮助你理解信息流转并记住浏览轨迹。它以直观的方式可视化你的浏览路径和导航历史，让你轻松追溯访问路径、探索网络旅程。",
    type: "extension",
    icon: "🧭",
    iconUrl: "https://raw.githubusercontent.com/wxy/Navigraph/master/images/logo-128.png",
    url: "https://chromewebstore.google.com/detail/navigraph/jfjgdldpgmnhclffkkcnbhleijeopkhi",
    repoUrl: "https://github.com/wxy/Navigraph",
    chromeStoreId: "jfjgdldpgmnhclffkkcnbhleijeopkhi",
    technologies: ["TypeScript", "Chrome APIs", "D3.js", "React"],
    features: [
      "Visualize browsing paths as interactive graphs",
      "Track navigation history across tabs and sessions",
      "Understand information flow between sites",
      "Easily trace back how you arrived at any page",
      "Privacy-first — all data stays local",
    ],
    featuresZh: [
      "将浏览路径可视化为交互式关系图",
      "跨标签页和会话追踪导航历史",
      "理解站点间的信息流转",
      "轻松追溯到达任意页面的路径",
      "隐私优先——所有数据仅存本地",
    ],
    screenshots: [
      "https://lh3.googleusercontent.com/BJRLLTUk-JnOdaz6I0pXvg-NFMrdMqpc-_TmLoTlOloQhVCs3AS5u718IRy74ZXJ3WZAYhBR5EELIrOeQwd4IgIOqw=w1280-h800",
      "https://lh3.googleusercontent.com/4FJctuZgf6NrYaJ7K_MwjzGlzmSpQp3zdAV_GDPTXaOU8PwYxIwSNj6HZjEyICJkj_inVSuk7WXKTqYygtjOBm3fRg=w1280-h800",
      "https://lh3.googleusercontent.com/eAHRcuCKJNlawhHsHGsTW2njjzQrk0UOSgo2Ck3W2UdZYH-Q3okbzl24q-IgJEEPuaQR3AmYeyONci_4rMgJbIwt=w1280-h800",
      "https://lh3.googleusercontent.com/7xNL-Tl6a3ShWZdbs0rF5IWwqQKqOs0JwVs-MJGvDuYFNidbCS_AnyLH0ASz5MCEheUzksMpLiywnGBteDgrwCn-IQ=w1280-h800",
      "https://lh3.googleusercontent.com/Jksx1cD5E2BsZogUyR_8FLkpxAnOFxV6i1IiZBcflbhSHPtTYzN6yfZHM0lbIRiZLMGU7Dxnn8FMcLxUx7fwxh4yeg=w1280-h800",
    ],
    featured: true,
  },
  {
    slug: "silentfeed",
    name: "SilentFeed",
    nameZh: "SilentFeed",
    tagline: "AI-powered RSS reader that learns what you love",
    taglineZh: "AI 驱动的 RSS 阅读器，越用越懂你的偏好",
    description:
      "SilentFeed is an AI-powered RSS reader that learns your reading preferences over time, making your feed progressively quieter and more relevant. It filters out noise and surfaces the content that matters most to you.",
    descriptionZh:
      "SilentFeed 是一款 AI 驱动的 RSS 阅读器，随着时间推移学习你的阅读偏好，让你的信息流越来越安静、越来越精准。它过滤噪音，只呈现对你最重要的内容。",
    type: "extension",
    icon: "📡",
    iconUrl: "https://raw.githubusercontent.com/wxy/SilentFeed/master/assets/icon.png",
    url: "https://chromewebstore.google.com/detail/silentfeed/pieiedlagbmcnooloibhigmidpakneca",
    repoUrl: "https://github.com/wxy/SilentFeed",
    chromeStoreId: "pieiedlagbmcnooloibhigmidpakneca",
    technologies: ["TypeScript", "React", "Python", "AI/ML", "Chrome APIs"],
    features: [
      "AI learns your reading preferences over time",
      "Automatically filters out irrelevant content",
      "Keeps your feed clean and focused",
      "Supports multiple RSS sources",
      "Privacy-respecting architecture",
    ],
    featuresZh: [
      "AI 随时间学习你的阅读偏好",
      "自动过滤无关内容",
      "保持信息流干净专注",
      "支持多个 RSS 源",
      "尊重隐私的架构设计",
    ],
    screenshots: [
      "https://lh3.googleusercontent.com/nQgnK2JleJQG1p2sw6POg-VCcX9CxchuJjD0GRTHBp6V-eXoy0CNtX2MZt3K-uze1qvjE3V9IIG9wFwEZfCL3djQ=w1280-h800",
      "https://lh3.googleusercontent.com/G6ZqHSyjyC9-7G09-RA2uIckX5sZ9w4smCAtfvKZbjLeggnMICgjD-6mkpdujbTAzrUuukT8ZC9xvoR6B7iKPOINq9E=w1280-h800",
      "https://lh3.googleusercontent.com/ddEgF0jzIsgd0dFMCMPV5pZPAQqb4qAZEkL6hAvsi4gzU9Hjmdg6F0wyS6jmJ7YfQAT2_EsOHX37RgY6RyZHGXPB=w1280-h800",
    ],
    featured: true,
  },
  {
    slug: "ai-pulse",
    name: "AI Pulse",
    nameZh: "AI Pulse",
    tagline: "Monitor AI service providers' usage, balance & status",
    taglineZh: "监控 AI 服务商的用量、余额和服务状态",
    description:
      "AI Pulse monitors your usage, balance, and service status across multiple AI providers — including DeepSeek, Kimi, ChatGLM, Baichuan, Qwen, and Wenxin. It supports dual modes: balance monitoring with history charts (with API key) or service status monitoring only (without key).",
    descriptionZh:
      "AI Pulse 监控多个 AI 服务商的用量、余额和服务状态——包括 DeepSeek、Kimi、ChatGLM、百川智能、通义千问和文心一言。支持双模式：带余额历史图表的完整监控（需 API Key），或仅服务状态监控（无需 Key）。",
    type: "extension",
    icon: "🤖",
    iconUrl: "https://raw.githubusercontent.com/wxy/ai-pulse/main/public/icons/icon-128.png",
    url: "https://chromewebstore.google.com/detail/ai-pulse/nnjaedlkifjimaajkgaifknaapapbloc",
    repoUrl: "https://github.com/wxy/ai-pulse",
    chromeStoreId: "nnjaedlkifjimaajkgaifknaapapbloc",
    technologies: ["TypeScript", "React", "WXT", "Chrome APIs"],
    features: [
      "Monitor multiple AI providers: DeepSeek, Kimi, ChatGLM, Baichuan, Qwen, Wenxin",
      "Dual mode: balance monitoring + charts, or status-only",
      "Historical balance charts with configurable refresh interval",
      "API keys stored locally — never leaves your machine",
      "Auto-refresh in background",
    ],
    featuresZh: [
      "监控多个 AI 服务商：DeepSeek、Kimi、ChatGLM、百川、通义千问、文心一言",
      "双模式：余额监控+图表 或 纯状态监控",
      "余额历史图表，可配置刷新间隔",
      "API Key 仅存本地——绝不外泄",
      "后台自动定时刷新",
    ],
    featured: true,
  },
];

// --- Android Apps ---

export const apps: Product[] = [
  {
    slug: "actionmoments",
    name: "ActionMoments",
    nameZh: "ActionMoments",
    tagline: "Local-first Android app to find and export the best clips from long videos",
    taglineZh: "本地优先的 Android 应用，从长视频中智能筛选精彩片段",
    description:
      "ActionMoments is a local-first Android app designed to help you quickly scan long video footage, identify the best candidate clips, and export them for editing. It's not a video editor — it's a smart clip finder that uses on-device analysis to surface highlight moments.",
    descriptionZh:
      "ActionMoments 是一款本地优先的 Android 应用，旨在帮助你快速扫描长视频素材，识别最佳候选片段并导出以供剪辑。它不是视频编辑器——而是智能片段发现工具，使用设备端分析来发掘高光时刻。",
    type: "app",
    icon: "🎬",
    url: "https://actionmoments.app",
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
    featuresZh: [
      "本地视频导入与预览",
      "远程相机连接与素材浏览",
      "智能片段扫描，时间轴强度展示",
      "快捷面板半自动精选高光",
      "批量导出确认后的片段",
      "中英文界面",
      "隐私优先：不直接上传原始视频",
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

// --- Localization helpers ---

export function localized(p: Product, locale: Locale): Product {
  return {
    ...p,
    name: (locale === "zh" && p.nameZh) ? p.nameZh : p.name,
    tagline: (locale === "zh" && p.taglineZh) ? p.taglineZh : p.tagline,
    description: (locale === "zh" && p.descriptionZh) ? p.descriptionZh : p.description,
    features: (locale === "zh" && p.featuresZh) ? p.featuresZh : p.features,
  };
}

// --- General helpers ---

export function getAllProducts(): Product[] {
  return [...extensions, ...apps];
}

export function getFeaturedProducts(): Product[] {
  return getAllProducts().filter((p) => p.featured);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getAllProducts().find((p) => p.slug === slug);
}
