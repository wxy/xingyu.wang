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
    <section style={{ marginBottom: 0, padding: 0 }}>
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
    <div style={{ border: "1px solid rgba(51,255,51,0.1)", padding: "10px 14px", background: "rgba(0,0,0,0.2)" }}>
      <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "rgba(51,255,51,0.5)" }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#33ff33" }}>{value}</p>
      {sub && <p style={{ margin: 0, fontSize: 9, color: "rgba(51,255,51,0.5)" }}>{sub}</p>}
    </div>
  );
}
