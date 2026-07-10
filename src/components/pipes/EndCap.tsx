import type { PipeDirection } from "./types";

interface Props {
  direction: PipeDirection;
  /** Default 14 (pipe diameter) */
  pipeDiameter?: number;
}

export function EndCap({ direction, pipeDiameter = 14 }: Props) {
  const isH = direction === "horizontal";
  // Cap sits perpendicular to the pipe.
  const capWidth = isH ? 6 : pipeDiameter + 6;
  const capHeight = isH ? pipeDiameter + 6 : 6;

  return (
    <div
      style={{
        width: capWidth,
        height: capHeight,
        background: [
          "radial-gradient(ellipse at 35% 25%,",
          "rgba(255,255,255,0.15) 0%, transparent 50%),",
          isH
            ? "linear-gradient(180deg,#c8c8c8,#a0a0a0 40%,#808080 70%,#999)"
            : "linear-gradient(90deg,#c8c8c8,#a0a0a0 40%,#808080 70%,#999)",
        ].join(""),
        borderRadius: 1,
        boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
        flexShrink: 0,
        zIndex: 10,
      }}
    />
  );
}
