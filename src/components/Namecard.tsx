"use client";

import { useState } from "react";

export function Namecard() {
  const [showFront, setShowFront] = useState(true);

  return (
    <div
      className="group relative mx-auto w-full max-w-lg cursor-pointer overflow-hidden rounded-2xl border border-border bg-white shadow-lg transition-shadow hover:shadow-xl dark:bg-zinc-900"
      onClick={() => setShowFront(!showFront)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setShowFront(!showFront);
        }
      }}
      aria-label="Click to flip namecard"
    >
      {/* Front */}
      <div
        className={`transition-opacity duration-300 ${
          showFront ? "opacity-100" : "absolute inset-0 opacity-0"
        }`}
      >
        <img
          src="/namecard-1.svg"
          alt="Namecard front"
          className="h-auto w-full"
        />
      </div>
      {/* Back */}
      <div
        className={`transition-opacity duration-300 ${
          !showFront ? "opacity-100" : "absolute inset-0 opacity-0"
        }`}
      >
        <img
          src="/namecard-2.svg"
          alt="Namecard back"
          className="h-auto w-full"
        />
      </div>
      {/* Flip hint */}
      <div className="absolute bottom-3 right-4 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
        Click to flip
      </div>
    </div>
  );
}
