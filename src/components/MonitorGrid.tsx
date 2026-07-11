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

/**
 * On wide screens (≥640px): monitors arranged in rows of 2, with horizontal
 * pipes between side-by-side monitors and vertical pipes between rows.
 * On narrow screens: all monitors stacked vertically with vertical pipes.
 * Handles any number of monitors (1-6+).
 */
export function MonitorGrid({ items }: Props) {
  const isWide = useMediaQuery("(min-width: 640px)");

  // Narrow: vertical stack
  if (!isWide) {
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

  // Wide: rows of 2
  const rows: ReactNode[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      {rows.map((row, rowIdx) => (
        <span key={rowIdx} style={{ display: "contents" }}>
          {/* Vertical pipes between rows */}
          {rowIdx > 0 && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 260, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <VPipe />
              </div>
              <div style={{ width: 156 }} />
              <div style={{ width: 260, display: "flex", flexDirection: "column", alignItems: "center" }}>
                {row.length > 1 ? <VPipe /> : <div />}
              </div>
            </div>
          )}

          {/* Row content */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {row[0]}
            {row.length > 1 ? (
              <>
                <HPipe />
                {row[1]}
              </>
            ) : (
              // Spacer to keep single-item row left-aligned
              <div style={{ width: 260 + 156 }} />
            )}
          </div>
        </span>
      ))}
    </div>
  );
}
