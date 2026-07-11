import { extensions, getProductId } from "@/lib/products";
import { getLatestMetricsForProducts } from "@/lib/metrics";
import { getTranslations } from "next-intl/server";
import { CrtMonitorCard } from "@/components/CrtMonitorCard";
import { MonitorGrid } from "@/components/MonitorGrid";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Extensions" };

export default async function ExtensionsPage() {
  const t = await getTranslations("extensions");
  const m = await getTranslations("metrics");
  const metricsMap = await getLatestMetricsForProducts();

  function stats(slug: string) {
    const snap = metricsMap[getProductId(extensions.find((e) => e.slug === slug)!)];
    if (!snap) return undefined;
    return {
      commits: snap.github?.commitsLast30d,
      prs: snap.github?.mergedPRsLast30d,
      release: snap.github?.latestRelease?.tag,
      activity: snap.activity ? m(snap.activity as "active" | "maintained" | "quiet" | "unknown") : undefined,
      rawActivity: snap.activity,
    };
  }

  return (
    <div style={{ background: "#0a0a06", minHeight: "100vh", padding: "32px 24px" }}>
      <div style={{ maxWidth: 1024, margin: "0 auto", textAlign: "center" }}>
        <div style={{
          border: "4px double #ffaa00",
          display: "inline-block",
          padding: "20px 32px",
          width: "100%",
          boxSizing: "border-box",
          boxShadow: "0 0 20px rgba(255,170,0,0.08), inset 0 0 20px rgba(255,170,0,0.04)",
        }}>
          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ flex: 1, height: 2, background: "linear-gradient(90deg, transparent, #ffaa00 20%, #ffaa00 80%, transparent)", maxWidth: 80 }} />
            <span style={{ fontSize: 13, fontWeight: "bold", color: "#ffaa00", textShadow: "0 0 6px rgba(255,170,0,0.3)" }}>
              {t("title").toUpperCase()}
            </span>
            <span style={{ flex: 1, height: 2, background: "linear-gradient(90deg, transparent, #ffaa00 20%, #ffaa00 80%, transparent)", maxWidth: 80 }} />
          </div>

          <MonitorGrid items={extensions.map((ext, i) => (
            <CrtMonitorCard key={ext.slug} product={ext} href={`/extensions/${ext.slug}`} mon={String(i + 1).padStart(2, "0")} stats={stats(ext.slug)} />
          ))} />
        </div>
      </div>
    </div>
  );
}
