# AI Pulse Website Pages — Design Spec

**Date:** 2026-07-01
**Repo:** xingyu.wang (personal site, Next.js 16 App Router + Tailwind v4 + next-intl)

## Overview

Register AI Pulse on xingyu.wang as two independent product entries sharing one brand, with sub-pages (privacy + about/support) for each. The Mac app is a new addition; the Chrome extension already has a basic detail page.

## Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Two independent entries | Chrome ext (free, multi-provider monitor) and Mac app (paid, AI coding spend tracker) share only the brand name. Content, audience, tech, and pricing are all different. |
| 2 | Mac app in existing `apps/` category | Extend the category rather than create a new top-level nav item. Differentiate via `platform` field + label in list/detail views. |
| 3 | Separate sub-pages per product | Cleaner directory structure; each product owns its privacy/about URLs independently (required for App Store / Chrome Store submissions). |
| 4 | 2 sub-pages: privacy + about (with support) | About page includes support contact at the bottom; avoids an extra page. |
| 5 | Dynamic `[slug]/privacy` + `[slug]/about` routes | Follows existing pattern (`[slug]/page.tsx`). Products validate slug/type; unknown slugs get 404. Any future product can have privacy/about pages without new route files. |

## Files Changed

### 1. Data Model — `src/lib/products.ts`

**`getProductBySlug` signature change:**
```ts
// Before
export function getProductBySlug(slug: string): Product | undefined

// After — optional type filter for disambiguation
export function getProductBySlug(slug: string, type?: ProductType): Product | undefined {
  if (type) return getAllProducts().find((p) => p.slug === slug && p.type === type);
  return getAllProducts().find((p) => p.slug === slug);
}
```

Existing callers (homepage, ProductCard, detail pages) don't pass `type` — they continue to get first match. New sub-page routes pass `type` for correct disambiguation.

**New types & fields:**
```ts
export type Platform = "chrome" | "android" | "macos";

export interface Product {
  // ...existing fields...
  platform?: Platform;      // NEW
  license?: string;         // NEW — SPDX identifier
}
```

**Updated Chrome extension entry:**
```ts
{
  slug: "ai-pulse",           // unchanged
  platform: "chrome",         // NEW
  license: "Apache-2.0",      // NEW
  // ...all existing fields unchanged...
}
```

**New Mac app entry:**
```ts
{
  slug: "ai-pulse",
  name: "AI Pulse",
  nameZh: "AI Pulse",
  tagline: "Your AI fuel gauge — track spending and code output",
  taglineZh: "AI 燃油表 — 追踪 AI 花费与代码产出",
  description: "AI Pulse for macOS is your AI coding fuel gauge. It tracks how much you spend on AI coding tools (Claude Code, aider, Cursor, Windsurf, etc.) and compares it against your code output — so you always know your cost-per-line. Fully local, zero data leaves your machine.",
  descriptionZh: "AI Pulse for macOS 是你的 AI 编码燃油表。追踪 AI 编码工具（Claude Code、aider、Cursor、Windsurf 等）的花费，与代码产出对比，让你始终掌握代码行成本。完全本地运行，零数据离开你的设备。",
  type: "app",
  platform: "macos",
  icon: "⛽",
  iconUrl: "https://raw.githubusercontent.com/wxy/ai-pulse/main/store-assets/logo.png",
  repoUrl: "https://github.com/wxy/ai-pulse",
  license: "Apache-2.0",
  technologies: ["Swift", "SwiftUI", "AppKit", "SQLite", "libgit2"],
  features: [
    "Dock fuel gauge with real-time spending display",
    "Dashboard: cost charts + code change charts side by side",
    "Tiered data collection: log parsing (Claude Code, aider) + balance API polling (DeepSeek, OpenAI, Kimi, Zhipu) + subscription detection (Cursor, Windsurf, Copilot, Trae, Augment Code)",
    "Cost Per Line (CPL) metric — know what your AI code costs",
    "Anomaly detection for spending spikes",
    "100% local processing — no data ever leaves your machine",
    "API keys secured in macOS Keychain",
    "Sandboxed for Mac App Store distribution",
  ],
  featuresZh: [
    "Dock 油表 — 实时显示今日花费",
    "Dashboard：花费图表 + 代码变更图表并排展示",
    "分级数据采集：日志解析（Claude Code、aider）+ 余额 API 轮询（DeepSeek、OpenAI、Kimi、智谱）+ 订阅检测（Cursor、Windsurf、Copilot、Trae、Augment Code）",
    "CPL（代码行成本）指标 — 清楚你的 AI 代码花了多少钱",
    "花费异常检测与告警",
    "100% 本地处理 — 数据绝不离开你的设备",
    "API Key 存储在 macOS Keychain 中",
    "沙盒化适配 Mac App Store 分发",
  ],
  featured: true,
}
```

> Both products use slug `"ai-pulse"`. `getProductBySlug(slug, type?)` is enhanced to accept an optional `ProductType` filter — `getProductBySlug("ai-pulse", "extension")` vs `getProductBySlug("ai-pulse", "app")`. Existing callers without the second arg behave as before (first match wins).

### 2. New Routes (4 new page files)

```
src/app/[locale]/
  extensions/
    [slug]/
      privacy/page.tsx           ← NEW (dynamic, validates type="extension")
      about/page.tsx             ← NEW (dynamic, validates type="extension")
  apps/
    [slug]/
      privacy/page.tsx           ← NEW (dynamic, validates type="app")
      about/page.tsx             ← NEW (dynamic, validates type="app")
```

The Mac app detail page needs no new file — existing `apps/[slug]/page.tsx` handles it via `generateStaticParams` (add the new entry to `apps` array). The detail page already calls `getProductBySlug(slug)` — update to `getProductBySlug(slug, "app")` for correct disambiguation.

#### 2a. `extensions/[slug]/privacy/page.tsx`

- `generateMetadata`: title = "{product.name} Privacy Policy"
- Looks up product by slug, validates `product.type === "extension"`, else `notFound()`
- Renders `<PrivacyPage>` shared component with extension-specific props
- Back link: "← Back to {product.name}" → `/extensions/{slug}`

Privacy content (extension-specific):
1. **Data Collection** — No personal info collected. API keys stored in chrome.storage.local.
2. **API Keys** — Only sent to respective AI provider APIs. Never to us or third parties.
3. **Network Requests** — HTTPS to AI provider APIs for balance/usage queries. No analytics/tracking/telemetry.
4. **Browser Permissions** — `storage`, `alarms`, `notifications`. No access to browsing history, cookies, or page content.
5. **Third-Party Services** — Users configure their own keys. Not responsible for providers' privacy practices.
6. **Contact** — Email link.

#### 2b. `extensions/[slug]/about/page.tsx`

- `generateMetadata`: title = "About {product.name}"
- Looks up product, validates type, else `notFound()`
- Renders `<AboutPage>` shared component
- Back link to `/extensions/{slug}`

#### 2c. `apps/[slug]/privacy/page.tsx`

- Same pattern as 2a, validates `product.type === "app"`
- Back link to `/apps/{slug}`

Privacy content (macOS-specific):
1. **Data Collection** — All data processed locally. No usage data, code, prompts, diffs, or personal info leaves the machine.
2. **API Keys** — macOS Keychain, sandboxed. Only used for balance API queries (DeepSeek, OpenAI, Kimi, Zhipu).
3. **File System Access** — Reads `~/.claude/` logs, `.llm.history`, `.git/objects` for local analysis. Nothing uploaded.
4. **Network Requests** — Only to AI provider balance APIs when configured. No analytics, crash reporting, telemetry.
5. **App Sandbox** — Mac App Store distribution. Entitlements: `network.client`, `files.user-selected.read-only`.
6. **Third-Party Services** — Users' own API keys. See provider privacy policies.
7. **Contact** — Email link.

#### 2d. `apps/[slug]/about/page.tsx`

- Same pattern as 2b, validates `product.type === "app"`
- Back link to `/apps/{slug}`

### 3. Shared Components (2 new)

#### `src/components/PrivacyPage.tsx`

Reusable privacy page layout. Props:
```ts
interface PrivacyPageProps {
  product: Product;         // for name, icon, back-link
  productLabel: string;     // "Chrome Extension" / "macOS App"
  sections: { title: string; content: string }[];  // privacy sections
  contactEmail: string;
  lastUpdated: string;
}
```

#### `src/components/AboutPage.tsx`

Reusable about page layout. Props:
```ts
interface AboutPageProps {
  product: Product;         // for name, description, features, technologies, license, repoUrl
  contactEmail: string;
}
```

Each route's `page.tsx` is thin (~30 lines) — looks up product, validates type, renders the shared component.

### 4. i18n — `messages/en.json` and `messages/zh.json`

New namespace `productPage`:

```json
{
  "productPage": {
    "privacyTitle": "Privacy Policy",
    "aboutTitle": "About {product}",
    "backToProduct": "← Back to {product}",
    "support": "Support",
    "supportContact": "For bug reports, feature requests, or questions, please contact:",
    "openSource": "Open Source",
    "licenseLabel": "Licensed under {license}.",
    "viewSource": "View source on GitHub →",
    "lastUpdated": "Last updated: {date}",
    "dataCollection": "Data Collection",
    "apiKeys": "API Keys",
    "networkRequests": "Network Requests",
    "permissions": "Permissions",
    "fileAccess": "File System Access",
    "appSandbox": "App Sandbox",
    "thirdParty": "Third-Party Services",
    "contact": "Contact",
    "privacyContact": "If you have questions about this privacy policy, please contact:"
  }
}
```

### 5. ProductCard — Platform badge update

Current badge shows `p.type` ("extension" / "app"). Update to use `platform` field:
```tsx
<span className="...">
  {p.platform === "chrome" ? "Chrome" : p.platform === "macos" ? "macOS" : "Android"}
</span>
```

### 6. Homepage — apps subtitle update

`home.appsDesc`: "Handy utilities on the go." → "Apps for your devices." / "随手可用的移动工具。" → "各平台应用。"

---

## URL Summary (for App Store / Chrome Store submission)

| Product | Privacy URL | Support/About URL |
|---------|-------------|-------------------|
| Chrome Extension | `https://xingyu.wang/extensions/ai-pulse/privacy` | `https://xingyu.wang/extensions/ai-pulse/about` |
| Mac App | `https://xingyu.wang/apps/ai-pulse/privacy` | `https://xingyu.wang/apps/ai-pulse/about` |

---

## Non-Goals

- NOT updating the AI Pulse repo README (separate prerequisite task)
- NOT creating App Store screenshots or marketing copy
- NOT modifying existing extension/app detail page layouts
- NOT adding a brand-level `/ai-pulse` landing page

---

## Implementation Order

1. Update `products.ts` — add `Platform` type, `platform`/`license` fields, enhance `getProductBySlug(slug, type?)`, update Chrome ext entry, add Mac app entry
2. Update existing detail pages (`extensions/[slug]/page.tsx`, `apps/[slug]/page.tsx`) to pass `type` to `getProductBySlug`
3. Add i18n keys to `en.json` and `zh.json`
4. Create `PrivacyPage` shared component
5. Create `AboutPage` shared component
6. Create 4 new route files
7. Update `ProductCard` platform badge
8. Update homepage apps subtitle (platform-neutral)
9. `npm run build` — verify no errors, all pages render
10. Commit
