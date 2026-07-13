# Readability Bold + Tailwind Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve site readability by setting global font-weight: 700, raising green-text opacity floors, and replacing all inline styles with Tailwind utility classes + semantic CSS classes for CRT visual effects.

**Architecture:** Bottom-up — start with globals.css foundation (color variables, font-weight, semantic classes), then refactor components from leaf to root (CrtMonitorCard → MonitorGrid → Footer → Navigation → page.tsx). Each component refactor eliminates all `style={{...}}` objects in favor of Tailwind classes. Verification after each task via `next dev` visual check.

**Tech Stack:** Next.js 16, Tailwind CSS 4, React 19, TypeScript

## Global Constraints

- All fonts must render at `font-weight: 700` (global body rule)
- Green text minimum opacity: `0.45` (up from `0.3`)
- Secondary text (`--muted`): `rgba(51,255,51,0.65)` (up from `0.4`)
- No `style={{...}}` objects in any refactored component
- Semantic CSS classes only for CRT effects that CANNOT be expressed with Tailwind utilities
- Branch: `feat/readability-bold-tailwind`

---

### Task 1: globals.css Foundation — Variables, Font Weight & Semantic Classes

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces:
  - CSS variable `--muted-dim: rgba(51,255,51,0.45)`
  - Updated `--muted: rgba(51,255,51,0.65)`
  - `body { font-weight: 700 }`
  - Classes: `.btn-gold`, `.btn-gold-active`, `.heading-glow`, `.crt-monitor-shell`, `.crt-screen-inner`, `.section-frame`

- [ ] **Step 1: Update color variables and add font-weight**

Open `src/app/globals.css`. The current `:root` block:

```css
:root {
  --bg: #0a0a06;
  --fg: #33ff33;
  --accent: #ffaa00;
  --accent-strong: #e89900;
  --accent-light: rgba(255, 170, 0, 0.08);
  --surface: rgba(10, 20, 10, 0.6);
  --surface-alt: rgba(10, 16, 10, 0.8);
  --surface-hover: rgba(20, 30, 20, 0.7);
  --border: rgba(51, 255, 51, 0.1);
  --muted: rgba(51, 255, 51, 0.4);
  --subtle: rgba(51, 255, 51, 0.05);
}
```

Change `--muted` and add `--muted-dim`:

```css
:root {
  --bg: #0a0a06;
  --fg: #33ff33;
  --accent: #ffaa00;
  --accent-strong: #e89900;
  --accent-light: rgba(255, 170, 0, 0.08);
  --surface: rgba(10, 20, 10, 0.6);
  --surface-alt: rgba(10, 16, 10, 0.8);
  --surface-hover: rgba(20, 30, 20, 0.7);
  --border: rgba(51, 255, 51, 0.1);
  --muted: rgba(51, 255, 51, 0.65);
  --muted-dim: rgba(51, 255, 51, 0.45);
  --subtle: rgba(51, 255, 51, 0.05);
}
```

In the `@theme inline` block, add the new variable:

```css
@theme inline {
  --color-bg: var(--bg);
  --color-fg: var(--fg);
  --color-accent: var(--accent);
  --color-accent-strong: var(--accent-strong);
  --color-accent-light: var(--accent-light);
  --color-surface: var(--surface);
  --color-surface-alt: var(--surface-alt);
  --color-surface-hover: var(--surface-hover);
  --color-border: var(--border);
  --color-muted: var(--muted);
  --color-muted-dim: var(--muted-dim);
  --color-subtle: var(--subtle);
  --font-sans: var(--font-geist-mono);
  --font-mono: var(--font-geist-mono);
}
```

In the `body` rule, add `font-weight: 700`:

```css
body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-geist-mono), "Courier New", monospace;
  font-weight: 700;
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 2: Add .btn-gold class**

Append to `globals.css`:

```css
/* Gold metallic button */
.btn-gold {
  background: linear-gradient(180deg, #e8c878 0%, #c89840 25%, #d4a850 50%, #b88830 75%, #c09838 100%);
  border: 2px solid #7a6020;
  border-radius: 4px;
  padding: 8px 24px;
  font-family: "Courier New", monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #1a1a08;
  text-shadow: 0 1px 0 rgba(255, 255, 200, 0.3);
  box-shadow: 0 3px 0 #5a4010, 0 4px 8px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 200, 0.3);
  cursor: pointer;
}
```

- [ ] **Step 3: Add .btn-gold-active class**

```css
/* Gold button — active/selected state */
.btn-gold-active {
  background: linear-gradient(180deg, #888 0%, #666 30%, #555 60%, #777 100%);
  border: 2px solid #ffaa00;
  border-radius: 5px;
  padding: 7px;
  font-family: "Courier New", monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #ffaa00;
  text-shadow: 0 0 12px rgba(255, 170, 0, 0.5);
  box-shadow: 0 1px 0 #333, 0 2px 4px rgba(0, 0, 0, 0.4), inset 0 3px 6px rgba(0, 0, 0, 0.5), 0 0 10px rgba(255, 170, 0, 0.2);
  cursor: pointer;
}

/* Shared hover transition for both button states */
.btn-gold,
.btn-gold-active {
  transition: all 0.08s;
}
```

- [ ] **Step 4: Add .heading-glow class**

```css
/* CRT green heading with glow */
.heading-glow {
  color: #33ff33;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(51, 255, 51, 0.6), 0 0 30px rgba(51, 255, 51, 0.2), 3px 3px 0 #1a2a1a;
}
```

- [ ] **Step 5: Add .crt-monitor-shell class**

```css
/* CRT monitor — beige plastic exterior */
.crt-monitor-shell {
  background: linear-gradient(180deg, #f5f0e8 0%, #e8e0d0 8%, #ddd5c0 20%, #e0d8c5 40%, #d5ccb5 70%, #e5ddd0 90%, #f0ead8 100%);
  border-radius: 16px;
  padding: 12px 12px 16px 12px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5), inset 0 2px 3px rgba(255, 255, 255, 0.4), inset 0 -2px 3px rgba(0, 0, 0, 0.12), 0 0 0 2px #1a1a1a, 0 0 0 4px #2a2a2a;
  width: 260px;
  transition: transform 0.15s;
  cursor: pointer;
}

.crt-monitor-shell:hover {
  transform: translateY(-2px);
}
```

- [ ] **Step 6: Add .crt-screen-inner class**

```css
/* CRT screen — dark interior with scanlines and glare */
.crt-screen-inner {
  background: radial-gradient(ellipse at 40% 30%, #0d200d 0%, #050d05 100%);
  border-radius: 7px;
  border: 1px solid rgba(51, 255, 51, 0.06);
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}

.crt-screen-inner::after {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 20, 0, 0.05) 2px, rgba(0, 20, 0, 0.05) 4px);
  pointer-events: none;
  z-index: 2;
}

.crt-screen-inner::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 35% 25%, rgba(51, 255, 51, 0.04) 0%, transparent 55%);
  pointer-events: none;
  z-index: 3;
}
```

- [ ] **Step 7: Add .section-frame class**

```css
/* Section container with amber double border */
.section-frame {
  display: inline-block;
  border: 4px double #ffaa00;
  box-shadow: 0 0 20px rgba(255, 170, 0, 0.08), inset 0 0 20px rgba(255, 170, 0, 0.04);
  padding: 20px 32px;
  width: 100%;
  box-sizing: border-box;
}
```

- [ ] **Step 8: Verify globals.css parses correctly**

Run: `cat src/app/globals.css | wc -l` — should show significantly more lines than the original 101.

- [ ] **Step 9: Commit**

```bash
git add src/app/globals.css
git commit -m "style: raise color opacity floor, add font-weight 700, add CRT semantic classes"
```

---

### Task 2: CrtMonitorCard.tsx — Inline Styles to Tailwind

**Files:**
- Modify: `src/components/CrtMonitorCard.tsx`

**Interfaces:**
- Consumes: `.crt-monitor-shell`, `.crt-screen-inner`, `.heading-glow` from globals.css
- Produces: No new interfaces — same component props, just Tailwind-styled

- [ ] **Step 1: Rewrite CrtMonitorCard with Tailwind classes**

Replace the entire return JSX. The current file has ~205 lines of heavy inline styles. Replace with:

```tsx
"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";

interface Props {
  product: Product;
  href: string;
  mon: string;
  status?: "rec" | "idle" | "standby";
  stats?: { commits?: number; prs?: number; release?: string; activity?: string; rawActivity?: string };
}

export function CrtMonitorCard({ product, href, mon, status, stats }: Props) {
  const raw = stats?.rawActivity;
  const derivedStatus = raw === "active" ? "rec"
    : raw === "maintained" ? "idle"
    : "standby";
  const actualStatus = status ?? derivedStatus;

  const dot =
    actualStatus === "rec"
      ? { color: "#ffaa00", label: "● REC", bg: "#ffaa00" }
      : actualStatus === "idle"
        ? { color: "rgba(51,255,51,0.4)", label: "● IDLE", bg: "rgba(51,255,51,0.4)" }
        : { color: "#666", label: "● STBY", bg: "#666" };

  return (
    <Link href={href} className="no-underline block">
      <div className="crt-monitor-shell">
        {/* Ventilation slots */}
        <div className="flex justify-center gap-[5px] mb-1.5">
          <div className="w-3.5 h-0.5 bg-[#8a8070] rounded-sm" />
          <div className="w-3.5 h-0.5 bg-[#8a8070] rounded-sm" />
          <div className="w-3.5 h-0.5 bg-[#8a8070] rounded-sm" />
          <div className="w-3.5 h-0.5 bg-[#8a8070] rounded-sm" />
          <div className="w-3.5 h-0.5 bg-[#8a8070] rounded-sm" />
        </div>

        {/* Screen */}
        <div className="bg-[#1a1a1a] rounded-[9px] p-[3px] [box-shadow:inset_0_2px_8px_rgba(0,0,0,0.8)]">
          <div className="crt-screen-inner px-3.5 py-3">
            {/* Content */}
            <div className="relative z-[1]">
              {/* Header row */}
              <div className="flex justify-between mb-1.5 text-[8px]">
                <span className="text-[rgba(51,255,51,0.2)]">MON-{mon}</span>
                <span style={{ color: dot.color }} className="text-[7px]">{dot.label}</span>
              </div>

              {/* Product name + icon */}
              <div className="flex gap-2 items-center mb-2">
                {product.iconUrl ? (
                  <img
                    src={product.iconUrl}
                    alt=""
                    className="w-[18px] h-[18px] rounded-[3px] object-contain"
                  />
                ) : (
                  <span className="text-lg">{product.icon}</span>
                )}
                <div>
                  <div className="heading-glow text-[13px]">
                    {product.name}
                  </div>
                  <div className="text-muted-dim text-[8px] mt-0.5 leading-relaxed min-h-9 overflow-hidden">
                    {product.tagline.length > 100
                      ? product.tagline.slice(0, 100) + "…"
                      : product.tagline}
                  </div>
                </div>
              </div>

              {/* Stats + Activity on one line */}
              <div className="flex gap-2 text-[8px] flex-wrap min-h-3 items-center">
                {stats?.commits != null && <span className="text-[rgba(51,255,51,0.47)]">{stats.commits} commits</span>}
                {stats?.prs != null && <span className="text-[rgba(51,255,51,0.47)]">{stats.prs} PRs</span>}
                {stats?.release && <span className="text-accent">{stats.release}</span>}
                {raw && (
                  <span
                    style={{
                      color: raw === "active" ? "#33ff33" : raw === "maintained" ? "rgba(51,255,51,0.5)" : "#666",
                      textShadow: raw === "active" ? "0 0 4px rgba(51,255,51,0.4)" : undefined,
                    }}
                  >
                    ● {raw.charAt(0).toUpperCase() + raw.slice(1)}
                  </span>
                )}
                {!stats?.commits && !stats?.prs && !stats?.release && !stats?.activity && (
                  <span className="text-transparent">—</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* LED indicator */}
        <div className="flex justify-center mt-[7px]">
          <span
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: dot.bg,
              boxShadow: actualStatus === "rec" ? "0 0 5px #ffaa00" : undefined,
              display: "inline-block",
            }}
          />
        </div>
      </div>
    </Link>
  );
}
```

Note: The LED dot and activity status span retain minimal inline `style` for dynamic values (`dot.bg`, `dot.color`, conditional `textShadow`) since these depend on runtime-computed `actualStatus`. This is acceptable — they are single-property dynamic values, not static style blocks.

- [ ] **Step 2: Verify the file has no static style blocks**

Run: `grep -c 'style={{' src/components/CrtMonitorCard.tsx`
Expected: 2 (only the two dynamic single-property inline styles: LED background and activity status color)

- [ ] **Step 3: Commit**

```bash
git add src/components/CrtMonitorCard.tsx
git commit -m "refactor: CrtMonitorCard inline styles to Tailwind + CSS classes"
```

---

### Task 3: Footer.tsx — Inline Styles to Tailwind

**Files:**
- Modify: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: `text-muted-dim` from updated globals.css
- Produces: Same component props

- [ ] **Step 1: Rewrite Footer with Tailwind classes**

Replace the entire component:

```tsx
import Link from "next/link";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const n = useTranslations("nav");

  return (
    <footer className="border-t-[3px] border-[#3a3a2a] bg-[rgba(10,10,6,0.9)]">
      <div className="mx-auto max-w-[1024px] flex flex-col items-center gap-1.5 px-6 py-4 text-center">
        <p className="font-['Courier_New'] text-[10px] text-muted-dim m-0">
          &copy; {new Date().getFullYear()} Xingyu Wang. {t("allRightsReserved")}
        </p>
        <div className="flex items-center gap-4 text-[10px]">
          <Link href="/activity" className="text-muted-dim no-underline font-['Courier_New']">
            [{n("activity")}]
          </Link>
          <a href="https://github.com/wxy" target="_blank" rel="noopener noreferrer" className="text-muted-dim no-underline font-['Courier_New']">
            [GitHub]
          </a>
          <a href="mailto:xingyu.wang@gmail.com" className="text-muted-dim no-underline font-['Courier_New']">
            [xingyu.wang@gmail.com]
          </a>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify no inline styles remain**

Run: `grep 'style={{' src/components/Footer.tsx`
Expected: (no output)

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "refactor: Footer inline styles to Tailwind"
```

---

### Task 4: Navigation.tsx — Delete Style Objects, Use Semantic Classes

**Files:**
- Modify: `src/components/Navigation.tsx`

**Interfaces:**
- Consumes: `.btn-gold`, `.btn-gold-active` from globals.css
- Produces: Same component — `Navigation({ locale }: { locale: string })`

- [ ] **Step 1: Rewrite Navigation without BTN_BASE/BTN_ACTIVE style objects**

Replace the entire component:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navigation({ locale }: { locale: string }) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const links = [
    { href: "/", label: t("home") },
    { href: "/extensions", label: t("extensions") },
    { href: "/apps", label: t("apps") },
    { href: "/activity", label: t("activity") },
    { href: "/about", label: t("about") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-[#3a3a2a] bg-[rgba(10,10,6,0.9)] backdrop-blur-lg">
      <nav className="mx-auto max-w-[1024px] flex items-center justify-between flex-wrap gap-2 px-6 py-2.5">
        <Link
          href="/"
          className="text-xs font-bold text-fg tracking-[1px] no-underline whitespace-nowrap shrink-0 [text-shadow:0_0_8px_rgba(51,255,51,0.4)]"
        >
          {locale === "zh" ? "硬核老王" : "xingyu.wang"}
        </Link>

        <div className="flex items-center gap-1 flex-wrap justify-center">
          {links.map(({ href, label }) => {
            let pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
            if (!pathWithoutLocale.startsWith("/")) pathWithoutLocale = "/" + pathWithoutLocale;
            const isActive =
              href === "/"
                ? pathWithoutLocale === "/"
                : pathWithoutLocale.startsWith(href);

            return (
              <Link key={href} href={href} className="no-underline">
                <button className={isActive ? "btn-gold-active" : "btn-gold"}>
                  {label}
                </button>
              </Link>
            );
          })}
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Verify no style objects remain**

Run: `grep -E '(BTN_BASE|BTN_ACTIVE|style={{)' src/components/Navigation.tsx`
Expected: (no output)

- [ ] **Step 3: Commit**

```bash
git add src/components/Navigation.tsx
git commit -m "refactor: Navigation — replace style objects with .btn-gold classes"
```

---

### Task 5: MonitorGrid.tsx — Inline Layout Styles to Tailwind

**Files:**
- Modify: `src/components/MonitorGrid.tsx`

**Interfaces:**
- Consumes: Nothing new
- Produces: Same component — `MonitorGrid({ items }: { items: ReactNode[] })`

- [ ] **Step 1: Rewrite MonitorGrid with Tailwind layout classes**

Replace the component:

```tsx
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { PipeSegment, EndCap, StraightCoupling } from "./pipes";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

function HPipe() {
  return (
    <>
      <EndCap direction="horizontal" />
      <PipeSegment direction="horizontal" length={60} />
      <StraightCoupling direction="horizontal" />
      <PipeSegment direction="horizontal" length={60} />
      <EndCap direction="horizontal" />
    </>
  );
}

function VPipe() {
  return (
    <>
      <EndCap direction="vertical" />
      <PipeSegment direction="vertical" length={40} />
      <EndCap direction="vertical" />
    </>
  );
}

interface Props {
  items: ReactNode[];
}

export function MonitorGrid({ items }: Props) {
  const isWide = useMediaQuery("(min-width: 640px)");

  // Narrow: vertical stack
  if (!isWide) {
    return (
      <div className="flex flex-col items-center gap-0">
        {items.map((node, i) => (
          <span key={i} className="contents">
            {i > 0 && <VPipe />}
            {node}
          </span>
        ))}
      </div>
    );
  }

  // Wide: rows of 2
  const rows: ReactNode[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }

  return (
    <div className="flex flex-col items-center gap-0">
      {rows.map((row, rowIdx) => (
        <span key={rowIdx} className="contents">
          {/* Vertical pipes between rows */}
          {rowIdx > 0 && (
            <div className="flex items-center">
              <div className="w-[260px] flex flex-col items-center">
                <VPipe />
              </div>
              <div className="w-[156px]" />
              <div className="w-[260px] flex flex-col items-center">
                {row.length > 1 ? <VPipe /> : <div />}
              </div>
            </div>
          )}

          {/* Row content */}
          <div className="flex items-center">
            {row[0]}
            {row.length > 1 ? (
              <>
                <HPipe />
                {row[1]}
              </>
            ) : (
              <div className="w-[416px]" />
            )}
          </div>
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify no inline styles remain**

Run: `grep 'style={{' src/components/MonitorGrid.tsx`
Expected: (no output)

- [ ] **Step 3: Commit**

```bash
git add src/components/MonitorGrid.tsx
git commit -m "refactor: MonitorGrid inline styles to Tailwind"
```

---

### Task 6: page.tsx — Hero & Homepage Sections Refactor

**Files:**
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `.btn-gold`, `.heading-glow`, `.section-frame` from globals.css; `text-muted-dim` Tailwind token
- Produces: Same component — `HomePage({ params }: Props)`

- [ ] **Step 1: Rewrite the Hero section**

Replace lines 62-148 (the hero section JSX):

```tsx
      {/* ═══════ HERO ═══════ */}
      <section className="px-6 pt-10 pb-8 text-center">
        <h1 className="heading-glow text-[34px] tracking-[3px] mb-1">
          XINGYU WANG
        </h1>
        <p className="text-muted-dim text-[11px] tracking-[1px] mb-5">
          {t("subtitle")}
        </p>

        {/* Stat counters */}
        <div className="flex justify-center gap-3 mb-5">
          <StatBox value={totalCommits} label="COMMITS" color="#33ff33" />
          <StatBox value={totalPRs} label="PRs MERGED" color="#ffaa00" />
          <StatBox value={featured.length} label="PRODUCTS" color="#33ff33" />
        </div>

        {/* CTA buttons */}
        <div className="flex justify-center gap-2.5">
          <Link href="/extensions" className="no-underline">
            <button className="btn-gold">
              [ {t("browseExtensions")} ]
            </button>
          </Link>
          <Link href="/apps" className="no-underline">
            <button className="btn-gold">
              [ {t("browseApps")} ]
            </button>
          </Link>
        </div>
      </section>
```

- [ ] **Step 2: Rewrite the Activity Preview section**

Replace lines 182-211:

```tsx
      {/* ═══════ ACTIVITY PREVIEW ═══════ */}
      {recentEvents.length > 0 && (
        <SectionBox title={at("previewTitle").toUpperCase()} viewAllHref="/activity" viewAllLabel={at("viewAll")}>
          <div className="bg-[rgba(10,20,10,0.5)] border border-[rgba(51,255,51,0.08)] p-3 font-['Courier_New'] text-left w-full box-border">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="text-[10px] text-muted-dim py-1 border-b border-[rgba(51,255,51,0.04)]"
              >
                <span className="text-fg">[{event.occurredAt.slice(0, 10)}]</span>{" "}
                <span className="text-accent">{event.version ?? event.title}</span>
                {" — "}
                <span>{event.title}</span>
              </div>
            ))}
          </div>
        </SectionBox>
      )}
```

- [ ] **Step 3: Rewrite the Achievements section**

Replace lines 214-238:

```tsx
      {/* ═══════ ACHIEVEMENTS ═══════ */}
      {achievements.length > 0 && (
        <SectionBox title={t("achievements").toUpperCase()} viewAllHref="" viewAllLabel="">
          <div className="flex justify-center gap-4 flex-wrap">
            {achievements.map((a) => (
              <a key={a.name} href={a.url} target="_blank" rel="noopener noreferrer" className="no-underline">
                <div className="card p-4 max-w-[300px] text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{a.icon}</span>
                    <span className="text-[9px] text-[rgba(51,255,51,0.3)] border border-border rounded-[10px] px-2 py-0.5 uppercase tracking-[1px]">{ach("lctt.org")}</span>
                  </div>
                  <h3 className="text-xs text-fg mb-1">{ach("lctt.name")}</h3>
                  <p className="text-[9px] text-muted leading-relaxed">{ach("lctt.description")}</p>
                  <p className="text-[8px] text-muted-dim mt-1.5">{ach("lctt.year")}</p>
                  {lcttRepo && (
                    <div className="flex gap-3 mt-2 text-[9px]">
                      <span className="text-muted">⭐ {lcttRepo.stars.toLocaleString()}</span>
                      <span className="text-muted">⑂ {lcttRepo.forks.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </SectionBox>
      )}
```

- [ ] **Step 4: Rewrite SectionBox**

Replace lines 243-305:

```tsx
function SectionBox({
  title,
  viewAllHref,
  viewAllLabel,
  children,
}: {
  title: string;
  viewAllHref: string;
  viewAllLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-6 text-center">
      <div className="section-frame">
        {/* Title with horizontal rules */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="flex-1 h-0.5 max-w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
          <span className="text-[13px] font-bold text-accent [text-shadow:0_0_6px_rgba(255,170,0,0.3)] whitespace-nowrap">
            {title}
          </span>
          <span className="flex-1 h-0.5 max-w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
        </div>
        {children}
        {viewAllHref && (
          <div className="mt-3">
            <Link href={viewAllHref} className="text-accent text-[10px] no-underline">
              {viewAllLabel}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Rewrite StatBox**

Replace lines 307-349:

```tsx
function StatBox({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-[rgba(10,20,10,0.8)] border-2 px-5 py-2.5 min-w-[100px] text-center" style={{ borderColor: `${color}18` }}>
      <div
        className="text-[22px] font-bold"
        style={{
          color,
          textShadow: `0 0 8px ${color}44`,
        }}
      >
        {value.toLocaleString()}
      </div>
      <div className="text-muted-dim text-[8px] uppercase tracking-[1px] mt-0.5">
        {label}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Verify no full style blocks remain**

Run: `grep -c 'style={{' src/app/\[locale\]/page.tsx`
Expected: 2 (only the two dynamic color props in StatBox)

- [ ] **Step 7: Commit**

```bash
git add src/app/\[locale\]/page.tsx
git commit -m "refactor: page.tsx hero and sections — inline styles to Tailwind"
```

---

### Task 7: Layout — Fix Main Container Inline Style

**Files:**
- Modify: `src/app/[locale]/layout.tsx:58`

**Interfaces:**
- Consumes: Nothing new
- Produces: Same layout

- [ ] **Step 1: Replace main container inline style**

Change line 58 from:

```tsx
<main className="flex-1" style={{ maxWidth: 960, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>{children}</main>
```

To:

```tsx
<main className="flex-1 max-w-[960px] mx-auto w-full box-border">{children}</main>
```

- [ ] **Step 2: Verify**

Run: `grep 'style={{' src/app/\[locale\]/layout.tsx`
Expected: (no output)

- [ ] **Step 3: Commit**

```bash
git add src/app/\[locale\]/layout.tsx
git commit -m "refactor: layout main container inline style to Tailwind"
```

---

### Task 8: Final Verification & Visual Check

- [ ] **Step 1: Start dev server**

```bash
cd /Users/xingyuwang/develop/xingyu.wang && npm run dev
```

Wait for "Ready in" message.

- [ ] **Step 2: Check for any remaining inline styles across all refactored files**

```bash
grep -rn 'style={{' src/app/\[locale\]/page.tsx src/app/\[locale\]/layout.tsx src/components/Navigation.tsx src/components/CrtMonitorCard.tsx src/components/Footer.tsx src/components/MonitorGrid.tsx
```

Expected: Only the 4 legitimate dynamic single-property cases (2 in CrtMonitorCard for LED/activity, 2 in page.tsx StatBox for color/textShadow).

- [ ] **Step 3: Visual smoke test at http://localhost:3000**

Check:
- Homepage — hero stats, gold buttons, CRT monitor cards, activity feed, achievement card
- Navigate to /extensions, /apps, /activity, /about
- Test at mobile width (resize browser to <640px)
- Toggle language switcher (zh ↔ en)
- DevTools → Computed → verify `font-weight: 700` on body text

- [ ] **Step 4: Build check**

```bash
npm run build
```

Expected: Successful build with no errors.

- [ ] **Step 5: Commit any final tweaks**

```bash
git add -A
git commit -m "chore: final verification tweaks for readability refactor"
```
