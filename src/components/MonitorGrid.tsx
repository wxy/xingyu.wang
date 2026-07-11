"use client";

import { useEffect, useState, type ReactNode } from "react";
import { PipeSegment, EndCap, StraightCoupling } from "./pipes";

/* ══════════════════════ useMediaQuery ══════════════════════ */

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

function VPipe({ length = 40 }: { length?: number }) {
  return (
    <>
      <EndCap direction="vertical" />
      <PipeSegment direction="vertical" length={length} />
      <EndCap direction="vertical" />
    </>
  );
}

/* ══════════════════════ layouts ══════════════════════ */

interface MonitorItem {
  node: ReactNode;
  /** Optional pipe to render BEFORE this item (between it and the previous item) */
  pipeBefore?: ReactNode;
}

interface Props {
  /** Array of monitors + optional pipeBefore markers */
  items: MonitorItem[];
  /** Columns on wide screens */
  columns?: 2;
}

/**
 * Renders a 2-column grid on wide screens (≥640px),
 * or a single vertical stack on narrow screens.
 *
 * Pipe items (`pipeBefore`) become horizontal on wide and vertical on narrow.
 */
export function MonitorGrid({ items, columns = 2 }: Props) {
  const isWide = useMediaQuery("(min-width: 640px)");

  if (columns !== 2 || items.length < 2) {
    // Simple vertical stack
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        {items.map((item, i) => (
          <span key={i} style={{ display: "contents" }}>
            {item.pipeBefore && <VPipe />}
            {item.node}
          </span>
        ))}
      </div>
    );
  }

  // Build 2-column grid items
  const leftCol: MonitorItem[] = [];
  const rightCol: MonitorItem[] = [];
  items.forEach((item, i) => {
    (i % 2 === 0 ? leftCol : rightCol).push(item);
  });

  if (!isWide) {
    // Narrow: stack all items vertically with vertical pipes
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        {items.map((item, i) => (
          <span key={i} style={{ display: "contents" }}>
            {item.pipeBefore && <VPipe />}
            {item.node}
          </span>
        ))}
      </div>
    );
  }

  // Wide: 2-column grid
  const maxRows = Math.max(leftCol.length, rightCol.length);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {/* Left column */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        {leftCol.map((item, i) => (
          <span key={i} style={{ display: "contents" }}>
            {item.pipeBefore && <VPipe />}
            {item.node}
          </span>
        ))}
      </div>

      {/* Horizontal pipe between columns */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        {Array.from({ length: maxRows }).map((_, i) => (
          <span key={i} style={{ display: "contents" }}>
            {i > 0 && <VPipe length={60} />}
            <HPipe />
          </span>
        ))}
      </div>

      {/* Right column */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        {rightCol.map((item, i) => (
          <span key={i} style={{ display: "contents" }}>
            {item.pipeBefore && <VPipe />}
            {item.node}
          </span>
        ))}
      </div>
    </div>
  );
}
