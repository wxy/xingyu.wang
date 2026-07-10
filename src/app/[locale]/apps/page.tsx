import { apps, getProductId } from "@/lib/products";
import { getLatestMetricsForProducts } from "@/lib/metrics";
import { getTranslations } from "next-intl/server";
import { CrtMonitorCard } from "@/components/CrtMonitorCard";
import { PipeSegment, EndCap, StraightCoupling } from "@/components/pipes";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Apps" };

export default async function AppsPage() {
  const t = await getTranslations("apps");
  const m = await getTranslations("metrics");
  const metricsMap = await getLatestMetricsForProducts();

  function stats(slug: string) {
    const snap = metricsMap[getProductId(apps.find((a) => a.slug === slug)!)];
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
          minWidth: 700,
          boxShadow: "0 0 20px rgba(255,170,0,0.08), inset 0 0 20px rgba(255,170,0,0.04)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ flex: 1, height: 2, background: "linear-gradient(90deg, transparent, #ffaa00 20%, #ffaa00 80%, transparent)", maxWidth: 80 }} />
            <span style={{ fontSize: 13, fontWeight: "bold", color: "#ffaa00", textShadow: "0 0 6px rgba(255,170,0,0.3)" }}>
              {t("title").toUpperCase()}
            </span>
            <span style={{ flex: 1, height: 2, background: "linear-gradient(90deg, transparent, #ffaa00 20%, #ffaa00 80%, transparent)", maxWidth: 80 }} />
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0 }}>
            <CrtMonitorCard product={apps[0]} href={`/apps/${apps[0].slug}`} mon="05" status="idle" stats={stats(apps[0].slug)} />
            {apps.length > 1 && (
              <>
                <EndCap direction="horizontal" />
                <PipeSegment direction="horizontal" length={60} />
                <StraightCoupling direction="horizontal" />
                <PipeSegment direction="horizontal" length={60} />
                <EndCap direction="horizontal" />
                <CrtMonitorCard product={apps[1]} href={`/apps/${apps[1].slug}`} mon="06" status="idle" stats={stats(apps[1].slug)} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
