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

/* ══════════════════════ pipe fragments ══════════════════════ */

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

/* ══════════════════════ MonitorGrid ══════════════════════ */

interface Props {
  /** Must be exactly 2 or 4 items (rendered as 1 or 2 rows) */
  items: ReactNode[];
}

/**
 * 2×2 grid on wide screens (≥640px), vertical stack on narrow.
 *
 * Wide layout (matches original working code):
 *   Row 1: [M1] --hpipe-- [M2]
 *          [vpipe]       [vpipe]
 *   Row 2: [M3] --hpipe-- [M4]
 *
 * Narrow layout:
 *   [M1] → vpipe → [M2] → vpipe → [M3] → vpipe → [M4]
 */
export function MonitorGrid({ items }: Props) {
  const isWide = useMediaQuery("(min-width: 640px)");

  if (!isWide) {
    // Narrow: vertical stack, all pipes vertical
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        {items.map((node, i) => (
          <span key={i} style={{ display: "contents" }}>
            {i > 0 && <VPipe />}
            {node}
          </span>
        ))}
      </div>
    );
  }

  // Wide: original 2×2 layout
  const [m1, m2, m3, m4] = items;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      {/* Row 1 */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {m1}
        <HPipe />
        {m2}
      </div>
      {/* Vertical pipes between rows */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ width: 260, display: "flex", flexDirection: "column", alignItems: "center" }}><VPipe /></div>
        <div style={{ width: 156 }} />
        <div style={{ width: 260, display: "flex", flexDirection: "column", alignItems: "center" }}><VPipe /></div>
      </div>
      {/* Row 2 */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {m3 || <div style={{ width: 260 }} />}
        {m3 && m4 ? <HPipe /> : null}
        {m4 || <div style={{ width: 260 }} />}
      </div>
    </div>
  );
}
