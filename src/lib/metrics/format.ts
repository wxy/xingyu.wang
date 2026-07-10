interface Props {
  isoDate: string;
  locale: string;
  labels: {
    justNow: string;
    hoursAgo: string;
    daysAgo: string;
    weeksAgo: string;
  };
}

export function formatRelativeTime({ isoDate, locale, labels }: Props): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);
  const weeks = Math.floor(days / 7);

  if (hours < 1) return labels.justNow;
  if (hours < 24) {
    return labels.hoursAgo.replace("{count}", String(hours));
  }
  if (days < 14) {
    return labels.daysAgo.replace("{count}", String(days));
  }
  return labels.weeksAgo.replace("{count}", String(weeks));
}

export function formatShortDate(isoDate: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(isoDate));
}

export function formatNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === "zh" ? "zh-CN" : "en-US").format(value);
}

export function formatDelta(
  delta: number | null | undefined,
  locale: string,
): string | null {
  if (delta == null || delta === 0) return null;
  const sign = delta > 0 ? "+" : "";
  return `${sign}${formatNumber(delta, locale)}`;
}
