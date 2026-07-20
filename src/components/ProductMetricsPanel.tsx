import { getTranslations } from "next-intl/server";
import type { ProductMetricsView } from "@/lib/metrics";
import { ActivityIndicator } from "./ActivityIndicator";
import { MetricSparkline } from "./MetricSparkline";
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
  const hasHistory = metrics.history && metrics.history.points.length >= 2;

  return (
    <section style={{ marginBottom: 0, padding: 0 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#33ff33" }}>{t("panelTitle")}</span>
        <ActivityIndicator level={metrics.activity} label={activityLabel} />
      </div>

      {metrics.github?.lastPushAt && (
        <p style={{ fontSize: 10, color: "rgba(51,255,51,0.5)", marginBottom: 16 }}>
          {t("lastPush")}:{" "}
          {formatRelativeTime({ isoDate: metrics.github.lastPushAt, locale, labels: timeLabels })}
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10 }}>
        {metrics.github?.commitsLast30d != null && (
          <MetricTile
            label={t("commits30d")}
            value={formatNumber(metrics.github.commitsLast30d, locale)}
          />
        )}
        {metrics.chromeStore?.users != null && (
          <MetricTile
            label={t("users")}
            value={formatNumber(metrics.chromeStore.users, locale)}
            sparkline={hasHistory ? <MetricSparkline points={metrics.history!.points} dataKey="users" /> : undefined}
          />
        )}
        {metrics.github?.mergedPRsLast30d != null && (
          <MetricTile
            label={t("prsMerged")}
            value={formatNumber(metrics.github.mergedPRsLast30d, locale)}
          />
        )}
        {metrics.github?.latestRelease && (
          <MetricTile
            label={t("latestRelease")}
            value={metrics.github.latestRelease.tag}
            sub={formatRelativeTime({ isoDate: metrics.github.latestRelease.publishedAt, locale, labels: timeLabels })}
          />
        )}
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
  sparkline,
}: {
  label: string;
  value: string;
  sub?: string;
  sparkline?: React.ReactNode;
}) {
  return (
    <div style={{ border: "1px solid rgba(51,255,51,0.1)", padding: "10px 14px", background: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "rgba(51,255,51,0.5)" }}>
          {label}
        </p>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#33ff33" }}>{value}</p>
        {sub && <p style={{ margin: 0, fontSize: 9, color: "rgba(51,255,51,0.5)" }}>{sub}</p>}
      </div>
      {sparkline}
    </div>
  );
}
