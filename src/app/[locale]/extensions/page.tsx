import { extensions, getProductId } from "@/lib/products";
import { getLatestMetricsForProducts } from "@/lib/metrics";
import { getTranslations } from "next-intl/server";
import { CrtMonitorCard } from "@/components/CrtMonitorCard";
import { PipeSegment, EndCap, StraightCoupling } from "@/components/pipes";
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

          {/* 2×2 grid with pipes */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
            {/* Row 1 */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <CrtMonitorCard product={extensions[0]} href={`/extensions/${extensions[0].slug}`} mon="01" status="rec" stats={stats(extensions[0].slug)} />
              <EndCap direction="horizontal" />
              <PipeSegment direction="horizontal" length={60} />
              <StraightCoupling direction="horizontal" />
              <PipeSegment direction="horizontal" length={60} />
              <EndCap direction="horizontal" />
              <CrtMonitorCard product={extensions[1]} href={`/extensions/${extensions[1].slug}`} mon="02" status="idle" stats={stats(extensions[1].slug)} />
            </div>
            {/* Vertical pipes */}
            <div style={{ display: "flex" }}>
              <div style={{ width: 220, display: "flex", flexDirection: "column", alignItems: "center" }}><EndCap direction="vertical" /><PipeSegment direction="vertical" length={40} /><EndCap direction="vertical" /></div>
              <div style={{ width: 156 }} />
              <div style={{ width: 220, display: "flex", flexDirection: "column", alignItems: "center" }}><EndCap direction="vertical" /><PipeSegment direction="vertical" length={40} /><EndCap direction="vertical" /></div>
            </div>
            {/* Row 2 */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <CrtMonitorCard product={extensions[2]} href={`/extensions/${extensions[2].slug}`} mon="03" status="idle" stats={stats(extensions[2].slug)} />
              <EndCap direction="horizontal" />
              <PipeSegment direction="horizontal" length={60} />
              <StraightCoupling direction="horizontal" />
              <PipeSegment direction="horizontal" length={60} />
              <EndCap direction="horizontal" />
              <CrtMonitorCard product={extensions[3]} href={`/extensions/${extensions[3].slug}`} mon="04" status="standby" stats={stats(extensions[3].slug)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
