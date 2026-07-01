# AI Pulse Website Pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Register AI Pulse Mac app on xingyu.wang, add privacy & about sub-pages for both products (Chrome extension + Mac app), with platform-aware badges and neutralized homepage copy.

**Architecture:** Extend the existing `Product` data model with `platform` and `license` fields; enhance `getProductBySlug` with optional type filter for slug disambiguation. Add 4 dynamic route files under `extensions/[slug]/` and `apps/[slug]/` backed by 2 shared components (`PrivacyPage`, `AboutPage`). All content flows from `products.ts` data + i18n JSON.

**Tech Stack:** Next.js 16 App Router, TypeScript, React 19, Tailwind CSS v4, next-intl v4

## Global Constraints

- Locale prefix is `"never"` — URLs omit the locale segment (e.g., `/extensions/ai-pulse/privacy`)
- Both products share slug `"ai-pulse"`; disambiguated via `getProductBySlug(slug, type?)` second arg
- All pages must build without errors via `npm run build` (Turbopack)
- Contact email: `xingyu.wang@gmail.com`
- Style: use existing Tailwind utility classes + `card` CSS class; match existing page patterns

---

### Task 1: Update product data model and add Mac app entry

**Files:**
- Modify: `src/lib/products.ts`

**Interfaces:**
- Produces: `Platform` type, `Product.platform`, `Product.license`, enhanced `getProductBySlug(slug, type?)`, Mac app entry in `apps` array, updated Chrome ext entry

- [ ] **Step 1: Add `Platform` type and new fields to `Product` interface**

Add after the existing `Locale` type declaration:

```ts
export type Platform = "chrome" | "android" | "macos";
```

Add two new optional fields to the `Product` interface (after `featured`):

```ts
  platform?: Platform;
  license?: string;
```

- [ ] **Step 2: Enhance `getProductBySlug` with optional type filter**

Replace the existing `getProductBySlug` function:

```ts
export function getProductBySlug(slug: string, type?: ProductType): Product | undefined {
  if (type) return getAllProducts().find((p) => p.slug === slug && p.type === type);
  return getAllProducts().find((p) => p.slug === slug);
}
```

- [ ] **Step 3: Add `platform` and `license` to the existing Chrome extension entry**

In the `extensions` array, find the `ai-pulse` entry and add two fields after `featured: true`:

```ts
    featured: true,
    platform: "chrome",
    license: "Apache-2.0",
```

- [ ] **Step 4: Add Mac app entry to the `apps` array**

Insert before the closing `];` of the `apps` array:

```ts
  {
    slug: "ai-pulse",
    name: "AI Pulse",
    nameZh: "AI Pulse",
    tagline: "Your AI fuel gauge — track spending and code output",
    taglineZh: "AI 燃油表 — 追踪 AI 花费与代码产出",
    description:
      "AI Pulse for macOS is your AI coding fuel gauge. It tracks how much you spend on AI coding tools (Claude Code, aider, Cursor, Windsurf, etc.) and compares it against your code output — so you always know your cost-per-line. Fully local, zero data leaves your machine.",
    descriptionZh:
      "AI Pulse for macOS 是你的 AI 编码燃油表。追踪 AI 编码工具（Claude Code、aider、Cursor、Windsurf 等）的花费，与代码产出对比，让你始终掌握代码行成本。完全本地运行，零数据离开你的设备。",
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
  },
```

- [ ] **Step 5: Verify build compiles**

Run: `cd /Users/xingyuwang/develop/xingyu.wang && npm run build 2>&1 | tail -20`
Expected: "✓ Compiled successfully" or successful completion with no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
cd /Users/xingyuwang/develop/xingyu.wang
git add src/lib/products.ts
git commit -m "feat: add Platform type, license fields, and AI Pulse Mac app entry"
```

---

### Task 2: Update detail pages to use type-disambiguated lookup

**Files:**
- Modify: `src/app/[locale]/extensions/[slug]/page.tsx`
- Modify: `src/app/[locale]/apps/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getProductBySlug(slug, type?)` from Task 1
- Produces: Correct detail page rendering for `ai-pulse` slug when both products exist

- [ ] **Step 1: Update extension detail page**

In `src/app/[locale]/extensions/[slug]/page.tsx`, change `getProductBySlug(slug)` to pass the type filter. Find the line:

```ts
  const raw = getProductBySlug(slug);
```

Replace with:

```ts
  const raw = getProductBySlug(slug, "extension");
```

- [ ] **Step 2: Update app detail page**

In `src/app/[locale]/apps/[slug]/page.tsx`, change `getProductBySlug(slug)` to pass the type filter. Find the line:

```ts
  const raw = getProductBySlug(slug);
```

Replace with:

```ts
  const raw = getProductBySlug(slug, "app");
```

- [ ] **Step 3: Verify build compiles**

Run: `cd /Users/xingyuwang/develop/xingyu.wang && npm run build 2>&1 | tail -20`
Expected: Successful build.

- [ ] **Step 4: Commit**

```bash
cd /Users/xingyuwang/develop/xingyu.wang
git add src/app/
git commit -m "fix: pass type filter to getProductBySlug in detail pages"
```

---

### Task 3: Add i18n keys

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/zh.json`

**Interfaces:**
- Produces: `productPage` namespace with keys for privacy/about page headings, section titles, and labels

- [ ] **Step 1: Add English translation keys**

In `messages/en.json`, add a new top-level key `"productPage"` before the closing `}` of the JSON object:

```json
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
    "privacyContact": "If you have questions about this privacy policy, please contact:",
    "features": "Features",
    "techStack": "Tech Stack"
  }
```

- [ ] **Step 2: Add Chinese translation keys**

In `messages/zh.json`, add the same structure with Chinese translations:

```json
  "productPage": {
    "privacyTitle": "隐私政策",
    "aboutTitle": "关于 {product}",
    "backToProduct": "← 返回 {product}",
    "support": "技术支持",
    "supportContact": "如有 Bug 反馈、功能建议或其他问题，请联系：",
    "openSource": "开源",
    "licenseLabel": "基于 {license} 协议开源。",
    "viewSource": "在 GitHub 查看源码 →",
    "lastUpdated": "最后更新：{date}",
    "dataCollection": "数据收集",
    "apiKeys": "API 密钥",
    "networkRequests": "网络请求",
    "permissions": "浏览器权限",
    "fileAccess": "文件系统访问",
    "appSandbox": "应用沙盒",
    "thirdParty": "第三方服务",
    "contact": "联系方式",
    "privacyContact": "如有关于本隐私政策的问题，请联系：",
    "features": "功能特性",
    "techStack": "技术栈"
  }
```

- [ ] **Step 3: Verify JSON is valid**

Run: `cd /Users/xingyuwang/develop/xingyu.wang && node -e "JSON.parse(require('fs').readFileSync('messages/en.json','utf8')); console.log('en.json: OK')" && node -e "JSON.parse(require('fs').readFileSync('messages/zh.json','utf8')); console.log('zh.json: OK')"`
Expected: Both print "OK" with no errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/xingyuwang/develop/xingyu.wang
git add messages/
git commit -m "feat: add productPage i18n keys for privacy and about pages"
```

---

### Task 4: Create PrivacyPage shared component

**Files:**
- Create: `src/components/PrivacyPage.tsx`

**Interfaces:**
- Consumes: `productPage` i18n namespace from Task 3, `Platform` type and `Product` interface from Task 1
- Produces: `<PrivacyPage>` — a `"use client"` component rendering a privacy policy page layout

- [ ] **Step 1: Write the component**

Create `src/components/PrivacyPage.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import type { Product, Platform } from "@/lib/products";

interface PrivacySection {
  title: string;
  content: string;
}

interface PrivacyPageProps {
  product: Product;
  backHref: string;
  platform: Platform;
  contactEmail: string;
}

const EXTENSION_SECTIONS: PrivacySection[] = [
  {
    title: "dataCollection",
    content: "AI Pulse does not collect, store, or transmit any personal information. All API keys are stored locally in chrome.storage.local and never sent anywhere except to the respective AI provider's API for balance queries.",
  },
  {
    title: "apiKeys",
    content: "API keys are stored in chrome.storage.local, which is Chrome's built-in encrypted local storage. They are only sent to the corresponding AI provider's API endpoint when you have configured that provider. Keys are never transmitted to us or any third party.",
  },
  {
    title: "networkRequests",
    content: "The extension makes HTTPS requests to AI provider APIs (DeepSeek, OpenAI, Kimi, Zhipu, etc.) solely to fetch balance and usage data on your behalf. No analytics, no tracking, no telemetry of any kind.",
  },
  {
    title: "permissions",
    content: "The extension requests the following Chrome permissions: storage (to save your settings and API keys locally), alarms (to schedule periodic balance refresh), and notifications (to alert you of spending anomalies). It does not access browsing history, cookies, or page content.",
  },
  {
    title: "thirdParty",
    content: "You configure your own API keys for third-party AI providers. AI Pulse is not responsible for those providers' privacy practices. Please refer to their respective privacy policies.",
  },
];

const APP_SECTIONS: PrivacySection[] = [
  {
    title: "dataCollection",
    content: "AI Pulse processes all data locally on your Mac. No usage data, code content, prompts, diffs, or personal information ever leaves your machine. Everything stays on your device.",
  },
  {
    title: "apiKeys",
    content: "API keys are stored in the macOS Keychain with sandboxed access. They are only used to query AI provider balance APIs (DeepSeek, OpenAI, Kimi, Zhipu) when you configure them. Keys are never transmitted elsewhere.",
  },
  {
    title: "fileAccess",
    content: "AI Pulse reads Claude Code logs (~/.claude/), aider history (.llm.history) for token usage estimation, and .git/objects for code change tracking. All reading is local; nothing is uploaded or transmitted.",
  },
  {
    title: "networkRequests",
    content: "Network requests are made only to AI provider balance APIs when you configure API keys. No analytics, no crash reporting, no telemetry of any kind.",
  },
  {
    title: "appSandbox",
    content: "AI Pulse is distributed via the Mac App Store with App Sandbox enabled. Entitlements are limited to: network.client (outbound HTTPS for balance queries) and files.user-selected.read-only (for selecting repositories to track).",
  },
  {
    title: "thirdParty",
    content: "You provide your own API keys for third-party AI providers. AI Pulse is not responsible for those providers' privacy practices. Please refer to their respective privacy policies.",
  },
];

export function PrivacyPage({ product, backHref, platform, contactEmail }: PrivacyPageProps) {
  const t = useTranslations("productPage");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tt = t as any as (key: string) => string;
  const sections = platform === "chrome" ? EXTENSION_SECTIONS : APP_SECTIONS;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Back link */}
      <nav className="mb-8">
        <Link href={backHref} className="text-sm text-muted transition-colors hover:text-accent">
          {t("backToProduct", { product: product.name })}
        </Link>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="mb-2 font-mono text-3xl font-bold">
          {product.name} {t("privacyTitle")}
        </h1>
        <p className="text-sm text-muted">{t("lastUpdated", { date: "2026-07-01" })}</p>
      </div>

      {/* Intro */}
      <div className="card mb-8 p-6">
        <p className="leading-relaxed text-muted">
          {platform === "chrome"
            ? "This privacy policy applies to the AI Pulse Chrome Extension."
            : "This privacy policy applies to AI Pulse for macOS."}
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="card p-6">
            <h2 className="mb-3 text-lg font-semibold">
              {tt(section.title)}
            </h2>
            <p className="leading-relaxed text-muted">{section.content}</p>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="mt-12 card p-6">
        <h2 className="mb-3 text-lg font-semibold">{t("contact")}</h2>
        <p className="text-sm text-muted">
          {t("privacyContact")}{" "}
          <a href={`mailto:${contactEmail}`} className="text-accent hover:opacity-80">
            {contactEmail}
          </a>
        </p>
      </div>
    </div>
  );
}
```

The TypeScript cast `t(section.title as ...)` won't typecheck cleanly. Let me fix that with a simpler approach — use direct string keys since the hook returns `(key: string) => string` at runtime.

- [ ] **Step 2: Verify build compiles**

Run: `cd /Users/xingyuwang/develop/xingyu.wang && npm run build 2>&1 | tail -20`
Expected: Successful build.

- [ ] **Step 3: Commit**

```bash
cd /Users/xingyuwang/develop/xingyu.wang
git add src/components/PrivacyPage.tsx
git commit -m "feat: add PrivacyPage shared component"
```

---

### Task 5: Create AboutPage shared component

**Files:**
- Create: `src/components/AboutPage.tsx`

**Interfaces:**
- Consumes: `productPage` i18n namespace from Task 3, `Product` from products.ts
- Produces: `<AboutPage>` — renders product description, features, tech stack, open source info, and support contact

- [ ] **Step 1: Write the component**

Create `src/components/AboutPage.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import type { Product } from "@/lib/products";

interface AboutPageProps {
  product: Product;
  backHref: string;
  contactEmail: string;
}

const TECH_LABELS: Record<string, string> = {
  "chrome": "Chrome Extension",
  "macos": "macOS App",
  "android": "Android App",
};

export function AboutPage({ product, backHref, contactEmail }: AboutPageProps) {
  const t = useTranslations("productPage");
  const platformLabel = TECH_LABELS[product.platform ?? ""] ?? "";

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Back link */}
      <nav className="mb-8">
        <Link href={backHref} className="text-sm text-muted transition-colors hover:text-accent">
          {t("backToProduct", { product: product.name })}
        </Link>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <div className="mb-4 flex items-center gap-4">
          {product.iconUrl ? (
            <img
              src={product.iconUrl}
              alt=""
              className="h-12 w-12 rounded-xl object-contain"
            />
          ) : (
            <span className="text-4xl">{product.icon}</span>
          )}
          <div>
            <h1 className="font-mono text-3xl font-bold">
              {t("aboutTitle", { product: product.name })}
            </h1>
            {platformLabel && (
              <p className="text-sm text-muted">{platformLabel}</p>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-12">
        <h2 className="mb-3 text-lg font-semibold">
          {t("aboutTitle", { product: product.name })}
        </h2>
        <p className="max-w-2xl leading-relaxed text-muted">
          {product.description}
        </p>
      </div>

      {/* Features */}
      {product.features.length > 0 && (
        <div className="mb-12">
          <h2 className="mb-4 text-lg font-semibold">{t("features")}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {product.features.map((feature, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg border border-border p-4"
              >
                <span className="mt-0.5 flex-shrink-0 text-accent">▹</span>
                <span className="text-sm leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tech Stack */}
      <div className="mb-12">
        <h2 className="mb-3 text-lg font-semibold">{t("techStack")}</h2>
        <div className="flex flex-wrap gap-2">
          {product.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-accent/10 px-3 py-1.5 text-sm text-accent"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Open Source */}
      <div className="mb-12 card p-6">
        <h2 className="mb-3 text-lg font-semibold">{t("openSource")}</h2>
        <p className="mb-3 text-sm text-muted">
          {t("licenseLabel", { license: product.license ?? "Unknown" })}
        </p>
        {product.repoUrl && (
          <a
            href={product.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 text-sm font-medium text-fg transition-all hover:border-accent hover:text-accent"
          >
            {t("viewSource")}
          </a>
        )}
      </div>

      {/* Support */}
      <div className="card p-6">
        <h2 className="mb-3 text-lg font-semibold">{t("support")}</h2>
        <p className="text-sm text-muted">
          {t("supportContact")}{" "}
          <a href={`mailto:${contactEmail}`} className="text-accent hover:opacity-80">
            {contactEmail}
          </a>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build compiles**

Run: `cd /Users/xingyuwang/develop/xingyu.wang && npm run build 2>&1 | tail -20`
Expected: Successful build.

- [ ] **Step 3: Commit**

```bash
cd /Users/xingyuwang/develop/xingyu.wang
git add src/components/AboutPage.tsx
git commit -m "feat: add AboutPage shared component"
```

---

### Task 6: Create 4 new route files

**Files:**
- Create: `src/app/[locale]/extensions/[slug]/privacy/page.tsx`
- Create: `src/app/[locale]/extensions/[slug]/about/page.tsx`
- Create: `src/app/[locale]/apps/[slug]/privacy/page.tsx`
- Create: `src/app/[locale]/apps/[slug]/about/page.tsx`

**Interfaces:**
- Consumes: `PrivacyPage` from Task 4, `AboutPage` from Task 5, `getProductBySlug` from Task 1, `getTranslations` from next-intl
- Produces: 4 URL routes rendering privacy and about pages for any product by slug

- [ ] **Step 1: Create `extensions/[slug]/privacy/page.tsx`**

Create directory and file at `src/app/[locale]/extensions/[slug]/privacy/page.tsx`:

```tsx
import { getProductBySlug, localized } from "@/lib/products";
import type { Locale } from "@/lib/products";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { PrivacyPage } from "@/components/PrivacyPage";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug, "extension");
  if (!product) return { title: "Not Found" };
  return { title: `${product.name} Privacy Policy` };
}

export default async function ExtensionPrivacyPage({ params }: Props) {
  const { slug, locale } = await params;
  const raw = getProductBySlug(slug, "extension");
  if (!raw) notFound();

  const product = localized(raw, locale as Locale);

  return (
    <PrivacyPage
      product={product}
      backHref={`/extensions/${slug}`}
      platform="chrome"
      contactEmail="xingyu.wang@gmail.com"
    />
  );
}
```

- [ ] **Step 2: Create `extensions/[slug]/about/page.tsx`**

Create directory and file at `src/app/[locale]/extensions/[slug]/about/page.tsx`:

```tsx
import { getProductBySlug, localized } from "@/lib/products";
import type { Locale } from "@/lib/products";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { AboutPage } from "@/components/AboutPage";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug, "extension");
  if (!product) return { title: "Not Found" };
  return { title: `About ${product.name}` };
}

export default async function ExtensionAboutPage({ params }: Props) {
  const { slug, locale } = await params;
  const raw = getProductBySlug(slug, "extension");
  if (!raw) notFound();

  const product = localized(raw, locale as Locale);

  return (
    <AboutPage
      product={product}
      backHref={`/extensions/${slug}`}
      contactEmail="xingyu.wang@gmail.com"
    />
  );
}
```

- [ ] **Step 3: Create `apps/[slug]/privacy/page.tsx`**

Create directory and file at `src/app/[locale]/apps/[slug]/privacy/page.tsx`:

```tsx
import { getProductBySlug, localized } from "@/lib/products";
import type { Locale } from "@/lib/products";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PrivacyPage } from "@/components/PrivacyPage";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug, "app");
  if (!product) return { title: "Not Found" };
  return { title: `${product.name} Privacy Policy` };
}

export default async function AppPrivacyPage({ params }: Props) {
  const { slug, locale } = await params;
  const raw = getProductBySlug(slug, "app");
  if (!raw) notFound();

  const product = localized(raw, locale as Locale);

  return (
    <PrivacyPage
      product={product}
      backHref={`/apps/${slug}`}
      platform={product.platform ?? "macos"}
      contactEmail="xingyu.wang@gmail.com"
    />
  );
}
```

- [ ] **Step 4: Create `apps/[slug]/about/page.tsx`**

Create directory and file at `src/app/[locale]/apps/[slug]/about/page.tsx`:

```tsx
import { getProductBySlug, localized } from "@/lib/products";
import type { Locale } from "@/lib/products";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AboutPage } from "@/components/AboutPage";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug, "app");
  if (!product) return { title: "Not Found" };
  return { title: `About ${product.name}` };
}

export default async function AppAboutPage({ params }: Props) {
  const { slug, locale } = await params;
  const raw = getProductBySlug(slug, "app");
  if (!raw) notFound();

  const product = localized(raw, locale as Locale);

  return (
    <AboutPage
      product={product}
      backHref={`/apps/${slug}`}
      contactEmail="xingyu.wang@gmail.com"
    />
  );
}
```

- [ ] **Step 5: Verify build compiles**

Run: `cd /Users/xingyuwang/develop/xingyu.wang && npm run build 2>&1 | tail -30`
Expected: Successful build with all new routes generated.

- [ ] **Step 6: Commit**

```bash
cd /Users/xingyuwang/develop/xingyu.wang
git add src/app/
git commit -m "feat: add privacy and about routes for extensions and apps"
```

---

### Task 7: Update ProductCard platform badge and homepage subtitle

**Files:**
- Modify: `src/components/ProductCard.tsx`
- Modify: `messages/en.json`
- Modify: `messages/zh.json`

**Interfaces:**
- Consumes: `Product.platform` from Task 1
- Produces: Platform-specific badge labels ("Chrome" / "macOS" / "Android"), neutral homepage apps subtitle

- [ ] **Step 1: Update ProductCard type badge to show platform**

In `src/components/ProductCard.tsx`, find the type badge `<span>`:

```tsx
        <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted">
          {p.type}
        </span>
```

Replace with:

```tsx
        <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted">
          {p.platform === "chrome" ? "Chrome" : p.platform === "macos" ? "macOS" : p.platform === "android" ? "Android" : p.type}
        </span>
```

- [ ] **Step 2: Update English homepage apps subtitle**

In `messages/en.json`, change `home.appsDesc`:

```json
    "appsDesc": "Apps for your devices."
```

- [ ] **Step 3: Update Chinese homepage apps subtitle**

In `messages/zh.json`, change `home.appsDesc`:

```json
    "appsDesc": "各平台应用。"
```

- [ ] **Step 4: Verify build compiles**

Run: `cd /Users/xingyuwang/develop/xingyu.wang && npm run build 2>&1 | tail -20`
Expected: Successful build.

- [ ] **Step 5: Commit**

```bash
cd /Users/xingyuwang/develop/xingyu.wang
git add src/components/ProductCard.tsx messages/
git commit -m "feat: platform-specific badges and neutral apps subtitle"
```

---

### Task 8: Build verification and final commit

- [ ] **Step 1: Full production build**

Run: `cd /Users/xingyuwang/develop/xingyu.wang && npm run build 2>&1`
Expected: Build completes successfully. Check that output includes routes for:
- `extensions/ai-pulse/privacy`
- `extensions/ai-pulse/about`
- `apps/ai-pulse/privacy`
- `apps/ai-pulse/about`

- [ ] **Step 2: Verify no TypeScript errors**

Run: `cd /Users/xingyuwang/develop/xingyu.wang && npx tsc --noEmit 2>&1`
Expected: No errors.

- [ ] **Step 3: Verify all existing pages still work**

Check that these existing routes still resolve correctly in the build output:
- `/extensions/ai-pulse` (Chrome ext detail)
- `/apps/actionmoments` (existing Android app)
- `/extensions/hitable`, `/extensions/navigraph`, `/extensions/silentfeed`

- [ ] **Step 4: Verify invalid slugs return 404**

Check that unknown slugs like `/extensions/nonexistent/privacy` and `/apps/nonexistent/about` do NOT appear in the build output as valid routes (they should be dynamic and return 404 at runtime via `notFound()`).

- [ ] **Step 5: Final commit (if any cleanup needed)**

```bash
cd /Users/xingyuwang/develop/xingyu.wang
git status
# Only commit if there are uncommitted changes
```
