import type { JointVariant } from "./types";
import { JOINT_GRADIENT, JOINT_SHADOW } from "./types";

interface Props {
  /** Default 34 */
  size?: number;
  /** Corner cut radius, default 7 */
  cutRadius?: number;
  variant?: JointVariant;
  className?: string;
  style?: React.CSSProperties;
}

export function CrossJoint({
  size = 34,
  cutRadius = 7,
  variant = "silver",
  className,
  style,
}: Props) {
  const mask = [
    `radial-gradient(circle ${cutRadius}px at 0 0, transparent ${cutRadius}px, black ${cutRadius + 1}px)`,
    `radial-gradient(circle ${cutRadius}px at 100% 0, transparent ${cutRadius}px, black ${cutRadius + 1}px)`,
    `radial-gradient(circle ${cutRadius}px at 0 100%, transparent ${cutRadius}px, black ${cutRadius + 1}px)`,
    `radial-gradient(circle ${cutRadius}px at 100% 100%, transparent ${cutRadius}px, black ${cutRadius + 1}px)`,
  ].join(",");

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
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
