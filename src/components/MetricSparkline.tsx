import type { MetricsHistoryPoint } from "@/lib/metrics/types";

interface Props {
  points: MetricsHistoryPoint[];
  dataKey: "stars" | "users";
  width?: number;
  height?: number;
}

export function MetricSparkline({
  points,
  dataKey,
  width = 72,
  height = 24,
}: Props) {
  const values = points
    .map((p) => p[dataKey])
    .filter((v): v is number => v != null);

  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const coords = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 2) - 1;
    return `${x},${y}`;
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="text-accent"
      aria-hidden
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={coords.join(" ")}
      />
    </svg>
  );
}
