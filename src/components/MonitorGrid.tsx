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
