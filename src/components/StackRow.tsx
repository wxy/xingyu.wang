"use client";

import { useEffect, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  breakpoint?: number;
  className?: string;
  style?: React.CSSProperties;
}

/** Renders children in a row on wide screens, column on narrow. */
export function StackRow({ children, breakpoint = 640, className, style }: Props) {
  const [isWide, setIsWide] = useState(true);

  useEffect(() => {
    const check = () => setIsWide(window.innerWidth > breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: isWide ? "row" : "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
