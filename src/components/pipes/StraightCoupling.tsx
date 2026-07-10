import type { PipeDirection } from "./types";

interface Props {
  direction: PipeDirection;
  /** Default 14 */
  pipeDiameter?: number;
}

export function StraightCoupling({ direction, pipeDiameter = 14 }: Props) {
  const isH = direction === "horizontal";
  const w = isH ? 24 : pipeDiameter + 4;
  const h = isH ? pipeDiameter + 4 : 24;

  return (
    <div
      style={{
        width: w,
        height: h,
        background: [
          "radial-gradient(ellipse at 35% 25%,",
          "rgba(255,255,255,0.15) 0%, transparent 50%),",
          isH
            ? "linear-gradient(180deg,#c8c8c8,#b0b0b0 25%,#999 50%,#b0b0b0 75%,#a0a0a0)"
            : "linear-gradient(90deg,#c8c8c8,#b0b0b0 25%,#999 50%,#b0b0b0 75%,#a0a0a0)",
        ].join(""),
        borderRadius: 2,
        boxShadow: "0 2px 4px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1)",
        zIndex: 11, // above pipes (10)
        margin: isH ? "0 -6px" : "-6px 0",
        flexShrink: 0,
      }}
    />
  );
}
