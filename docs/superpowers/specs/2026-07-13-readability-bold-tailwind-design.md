# Readability & CSS Engineering: Bold Fonts + Tailwind Refactor

**Date**: 2026-07-13
**Branch**: `feat/readability-bold-tailwind`
**Status**: approved

## Problem

1. **Poor readability**: Dark background (#0a0a06) with semi-transparent green text (`rgba(51,255,51,0.3–0.5)`) rendered in Geist Mono (a thin monospace font) is hard to read.
2. **Engineering anti-pattern**: Core components (page.tsx, Navigation, Footer, CrtMonitorCard, MonitorGrid) use heavy inline `style={{...}}` objects instead of CSS classes, while newer components (AboutPage, ProductCard, ActivityFeedItem) already use Tailwind utility classes. The codebase is split between two styling approaches.

## Design Decisions (User-Confirmed)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| CSS approach | Unified Tailwind classes | Stay consistent with components already using Tailwind; leverage existing design tokens in globals.css |
| Font weight | Global `font-bold` (700) on body | Full CRT terminal aesthetic — old terminals were monospace bold throughout |
| Color opacity | Raise the floor | Minimum opacity 0.45 (from 0.3), body text 0.65 (from 0.4), keep pure #33ff33 for headings |

## Implementation Plan

### 1. globals.css — Foundation

**Color variable adjustments:**

| Variable | Current | New | Role |
|----------|---------|-----|------|
| `--muted` | `rgba(51,255,51,0.4)` | `rgba(51,255,51,0.65)` | Secondary text (descriptions, labels) |
| `--muted-dim` | (new) | `rgba(51,255,51,0.45)` | Tertiary text (footer, timestamps) |
| `--subtle` | `rgba(51,255,51,0.05)` | unchanged | Faint backgrounds |
| `--fg` | `#33ff33` | unchanged | Primary body text |

**Global font weight:**
Add `font-weight: 700` to the `body` rule.

**New semantic CSS classes** (for CRT visual effects that cannot be expressed with Tailwind utilities):

- `.btn-gold` — Metallic gold button: linear-gradient background, amber border, beveled box-shadow, dark text. Used in Navigation (BTN_BASE) and page.tsx CTA buttons.
- `.btn-gold-active` — Active/pressed state: gray gradient, amber border, amber glow text-shadow.
- `.heading-glow` — CRT green heading: color #33ff33, text-shadow with green glow.
- `.crt-monitor-shell` — Beige CRT monitor exterior: cream-to-tan linear-gradient, rounded corners, dark outer border rings, drop shadow.
- `.crt-screen-inner` — Screen interior: dark green radial-gradient background, inset shadow, scanline overlay (repeating-linear-gradient), screen glare (radial-gradient highlight), all via pseudo-elements.
- `.section-frame` — Amber double-border section container with glow box-shadow.

### 2. page.tsx — Hero & Homepage Sections

Replace all inline `style={{...}}` objects with Tailwind classes and the new semantic classes:

- **Hero section**: `px-6 pt-10 pb-8 text-center`
- **h1 title**: `heading-glow text-[34px] tracking-[3px] mb-1` (remove inline fontSize, color, textShadow, letterSpacing, margin)
- **Subtitle**: `text-muted-dim text-[11px] tracking-[1px] mb-5`
- **StatBox**: Replace inline background/border/padding with Tailwind (`bg-surface border-2 border-[${color}]/10 px-5 py-2.5 min-w-[100px] text-center`). Keep inline color prop for dynamic green/amber distinction.
- **CTA buttons**: `btn-gold` class (eliminates 12-property inline style objects — duplicated twice identically)
- **SectionBox**: `section-frame` class for double-border container; Title dividers use Tailwind `h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent`
- **Activity feed list**: `bg-surface border border-border p-3 font-['Courier_New'] text-left w-full box-border`
- **Achievement cards**: `card p-4 max-w-[300px] text-left`

### 3. Navigation.tsx

- Delete `BTN_BASE` and `BTN_ACTIVE` constant style objects (~36 lines total)
- Nav buttons: `className="btn-gold"` / `className="btn-gold-active"` conditionally
- Header: `sticky top-0 z-50 border-b-3 border-[#3a3a2a] bg-[rgba(10,10,6,0.9)] backdrop-blur-lg`
- Site title: `text-xs font-bold text-fg tracking-[1px] no-underline whitespace-nowrap shrink-0` with `[text-shadow:0_0_8px_rgba(51,255,51,0.4)]`
- Nav container: `mx-auto max-w-[1024px] flex items-center justify-between flex-wrap gap-2 px-6 py-2.5`

### 4. CrtMonitorCard.tsx

- **Monitor shell**: `crt-monitor-shell` class (replaces ~15 lines of gradient/radius/shadow)
- **Screen area**: `crt-screen-inner` class (replaces ~20 lines of background/border/shadow + scanline/glare pseudo-elements)
- **Ventilation slots**: Extract to small Tailwind classes (`w-3.5 h-0.5 bg-[#8a8070] rounded-sm`)
- **Header row**: `flex justify-between mb-1.5 text-[8px]`
- **Product name**: `heading-glow text-[13px]` instead of inline color+fontSize+fontWeight+textShadow
- **Tagline**: `text-muted-dim text-[8px] mt-0.5 leading-relaxed min-h-9 overflow-hidden`
- **Stats row**: `flex gap-2 text-[8px] flex-wrap min-h-3 items-center`
- **LED indicator**: Inline style is small (4px circle) — acceptable as inline or Tailwind arbitrary value
- **Hover effect**: `hover:-translate-y-0.5 transition-transform` replaces onMouseEnter/onMouseLeave handlers

### 5. Footer.tsx

- Container: `border-t-3 border-[#3a3a2a] bg-[rgba(10,10,6,0.9)]`
- Inner: `mx-auto max-w-[1024px] flex flex-col items-center gap-1.5 px-6 py-4 text-center`
- Copyright text: `font-['Courier_New'] text-[10px] text-muted-dim m-0`
- Links: `text-muted-dim no-underline font-['Courier_New']`

### 6. MonitorGrid.tsx

- Layout containers: Replace inline flex styles with Tailwind (`flex flex-col items-center gap-0`, `flex items-center`)
- Monitor-width spacers: Keep as inline widths since they match `CrtMonitorCard`'s 260px — or use arbitrary values `w-[260px]`

## Files Changed

| File | Change Type |
|------|-------------|
| `src/app/globals.css` | Modify variables, add body font-weight, add 6 semantic classes |
| `src/app/[locale]/page.tsx` | Replace ~200 lines of inline styles with Tailwind classes |
| `src/components/Navigation.tsx` | Delete style objects, use .btn-gold classes |
| `src/components/CrtMonitorCard.tsx` | Replace ~180 lines of inline styles |
| `src/components/Footer.tsx` | Replace ~20 lines of inline styles |
| `src/components/MonitorGrid.tsx` | Replace ~30 lines of inline styles |

## Files NOT Changed

Already use Tailwind classes (no inline styles to refactor):
`AboutPage`, `ActivityFeedItem`, `ActivityIndicator`, `BadgeImg`, `LanguageSwitcher`, `PrivacyPage`, `ProductCard`, `ProductMetricsPanel`, `ProductMetricsSection`, `ProductReleaseList`, `MetricSparkline`, and all pipe components.

## Verification

1. `next dev` — confirm site builds and renders without errors
2. Visual check: all pages at desktop + mobile widths
3. Confirm no inline `style={{...}}` remains in the 6 changed files (grep for `style={{`)
4. Confirm `font-weight: 700` is inherited everywhere via DevTools computed styles
5. Smoke test: navigation, language switcher, all links work
