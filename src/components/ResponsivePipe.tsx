"use client";

import { useEffect, useState } from "react";
import { PipeSegment, EndCap, StraightCoupling } from "./pipes";

interface Props {
  breakpoint?: number;
}

/** Renders a horizontal pipe on wide screens, vertical pipe on narrow. */
export function ResponsivePipe({ breakpoint = 640 }: Props) {
  const [isWide, setIsWide] = useState(true);

  useEffect(() => {
    const check = () => setIsWide(window.innerWidth > breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  if (isWide) {
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

  return (
    <>
      <EndCap direction="vertical" />
      <PipeSegment direction="vertical" length={40} />
      <StraightCoupling direction="vertical" />
      <PipeSegment direction="vertical" length={40} />
      <EndCap direction="vertical" />
    </>
  );
}
