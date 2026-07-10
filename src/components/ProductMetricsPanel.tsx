import { getTranslations } from "next-intl/server";
import type { ProductMetricsView } from "@/lib/metrics";
import { ActivityIndicator } from "./ActivityIndicator";
import { formatNumber, formatRelativeTime } from "@/lib/metrics/format";

interface Props {
  metrics: ProductMetricsView;
  locale: string;
}

export async function ProductMetricsPanel({ metrics, locale }: Props) {
  const t = await getTranslations("metrics");
  const timeLabels = {
    justNow: t("justNow"),
    hoursAgo: t("hoursAgo"),
    daysAgo: t("daysAgo"),
    weeksAgo: t("weeksAgo"),
  };

  const activityLabel = t(metrics.activity);

  return (
    <section className="mb-12 card p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{t("panelTitle")}</h2>
        <ActivityIndicator level={metrics.activity} label={activityLabel} />
      </div>

      {metrics.github?.lastPushAt && (
        <p className="mb-5 text-sm text-muted">
          {t("lastPush")}:{" "}
          {formatRelativeTime({
            isoDate: metrics.github.lastPushAt,
            locale,
            labels: timeLabels,
          })}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Commits (30d) */}
        {metrics.github?.commitsLast30d != null && (
          <MetricTile
            label={t("commits30d")}
            value={formatNumber(metrics.github.commitsLast30d, locale)}
          />
        )}

        {/* PRs merged (30d) */}
        {metrics.github?.mergedPRsLast30d != null && (
          <MetricTile
            label={t("prsMerged")}
            value={formatNumber(metrics.github.mergedPRsLast30d, locale)}
          />
        )}

        {/* Latest Release */}
        {metrics.github?.latestRelease && (
          <MetricTile
            label={t("latestRelease")}
            value={metrics.github.latestRelease.tag}
            sub={formatRelativeTime({
              isoDate: metrics.github.latestRelease.publishedAt,
              locale,
              labels: timeLabels,
            })}
          />
        )}

        {/* Open Issues */}
        {metrics.github?.openIssues != null && (
          <MetricTile
            label={t("openIssues")}
            value={formatNumber(metrics.github.openIssues, locale)}
          />
        )}
      </div>
    </section>
  );
}

function MetricTile({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface-alt p-4">
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="text-xl font-semibold text-fg">{value}</p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  );
}
