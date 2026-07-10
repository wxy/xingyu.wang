import type { ActivityLevel } from "@/lib/metrics/types";

const STYLES: Record<ActivityLevel, { dot: string; bg: string; text: string }> = {
  active: {
    dot: "bg-emerald-500",
    bg: "bg-emerald-500/10",
    text: "text-emerald-700",
  },
  maintained: {
    dot: "bg-amber-500",
    bg: "bg-amber-500/10",
    text: "text-amber-700",
  },
  quiet: {
    dot: "bg-zinc-400",
    bg: "bg-zinc-400/10",
    text: "text-zinc-600",
  },
  unknown: {
    dot: "bg-zinc-300",
    bg: "bg-zinc-100",
    text: "text-zinc-500",
  },
};

interface Props {
  level: ActivityLevel;
  label: string;
  size?: "sm" | "md";
}

export function ActivityIndicator({ level, label, size = "md" }: Props) {
  const style = STYLES[level];
  const dotSize = size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5";
  const textSize = size === "sm" ? "text-[11px]" : "text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium ${style.bg} ${style.text} ${textSize}`}
    >
      <span className={`${dotSize} rounded-full ${style.dot}`} aria-hidden />
      {label}
    </span>
  );
}
