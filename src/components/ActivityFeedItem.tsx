import Link from "next/link";
import { ActivityIndicator } from "./ActivityIndicator";
import { formatRelativeTime } from "@/lib/metrics/format";
import type { ActivityEvent, ActivityLevel } from "@/lib/metrics/types";

export interface ActivityFeedTimeLabels {
  justNow: string;
  hoursAgo: string;
  daysAgo: string;
  weeksAgo: string;
}

interface Props {
  event: ActivityEvent;
  productName: string;
  productIcon?: string;
  productIconUrl?: string;
  productHref: string;
  activityLevel?: ActivityLevel;
  activityLabel?: string;
  timeLabels: ActivityFeedTimeLabels;
  locale: string;
  compact?: boolean;
}

export function ActivityFeedItem({
  event,
  productName,
  productIcon,
  productIconUrl,
  productHref,
  activityLevel,
  activityLabel,
  timeLabels,
  locale,
  compact = false,
}: Props) {
  const timeText = formatRelativeTime({
    isoDate: event.occurredAt,
    locale,
    labels: timeLabels,
  });

  const version = event.version ?? event.title;

  return (
    <div className={compact ? "" : "card p-4"}>
      <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
        {/* Product link */}
        <Link
          href={productHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-fg hover:text-accent transition-colors"
        >
          {productIconUrl ? (
            <img
              src={productIconUrl}
              alt=""
              className="h-4 w-4 rounded object-contain"
            />
          ) : productIcon ? (
            <span className="text-base leading-none" aria-hidden>
              {productIcon}
            </span>
          ) : null}
          {productName}
        </Link>

        {/* Version */}
        <span className="font-mono text-sm font-semibold text-accent">
          {version}
        </span>

        {/* Time */}
        <span className="text-xs text-muted">{timeText}</span>

        {/* Activity dot */}
        {activityLevel && activityLabel && (
          <ActivityIndicator
            level={activityLevel}
            label={activityLabel}
            size="sm"
          />
        )}
      </div>

      {/* Summary — full view only */}
      {!compact && event.summary && (
        <p className="mb-3 text-sm leading-relaxed text-muted line-clamp-2">
          {event.summary}
        </p>
      )}

      {/* GitHub link — full view only */}
      {!compact && (
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-accent hover:opacity-80"
        >
          GitHub →
        </a>
      )}
    </div>
  );
}
