import type { JointVariant } from "./types";
import { JOINT_GRADIENT, JOINT_SHADOW } from "./types";

interface Props {
  /** Default 28 */
  width?: number;
  /** Default 34 */
  height?: number;
  /** Corner cut radius, default 7 */
  cutRadius?: number;
  variant?: JointVariant;
  className?: string;
  style?: React.CSSProperties;
}

export function TJoint({
  width = 28,
  height = 34,
  cutRadius = 7,
  variant = "silver",
  className,
  style,
}: Props) {
  // Two concave cuts on the right side only.
  const mask = [
    `radial-gradient(circle ${cutRadius}px at 100% 0, transparent ${cutRadius}px, black ${cutRadius + 1}px)`,
    `radial-gradient(circle ${cutRadius}px at 100% 100%, transparent ${cutRadius}px, black ${cutRadius + 1}px)`,
  ].join(",");

  return (
    <div
      className={className}
      style={{
        width,
        height,
        background: JOINT_GRADIENT[variant],
        borderRadius: 3,
        boxShadow: JOINT_SHADOW,
        WebkitMask: mask,
        WebkitMaskComposite: "source-in",
        mask,
        maskComposite: "intersect",
        flexShrink: 0,
        position: "relative",
        zIndex: 11, // above pipes (10)
        ...style,
      }}
    />
  );
}
