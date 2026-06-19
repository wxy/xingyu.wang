"use client";

import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  className?: string;
}

export function BadgeImg({ src, alt, className = "h-5" }: Props) {
  const [error, setError] = useState(false);

  if (error) return null;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setError(true)}
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
    />
  );
}
