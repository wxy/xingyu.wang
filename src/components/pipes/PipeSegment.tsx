import type { PipeDirection } from "./types";
import { PIPE_GRADIENT, PIPE_METAL, PIPE_METAL_V, PIPE_SHADOW } from "./types";

interface Props {
  direction: PipeDirection;
  /** Fixed length in px. If omitted, pipe fills available space (flex: 1). */
  length?: number;
  /** Default 14 */
  diameter?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function PipeSegment({ direction, length, diameter = 14, className, style }: Props) {
  const isH = direction === "horizontal";
  const isFlex = length == null;

  const base: React.CSSProperties = {
    width: isH && !isFlex ? length : isH ? "100%" : diameter,
    height: !isH && !isFlex ? length : !isH ? "100%" : diameter,
    minWidth: isH && isFlex ? 0 : undefined,
    minHeight: !isH && isFlex ? 0 : undefined,
    flex: isFlex ? "1 1 0" : undefined,
    background: `${PIPE_GRADIENT[direction]}, ${isH ? PIPE_METAL : PIPE_METAL_V}`,
    borderRadius: 0,
    boxShadow: PIPE_SHADOW,
    zIndex: 10,
    ...style,
  };

  return <div className={className} style={base} />;
}
