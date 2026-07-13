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
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-[1024px] mx-auto text-center">
        <div className="section-frame">
          {/* Title */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="flex-1 h-0.5 max-w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
            <span className="text-[13px] font-bold text-accent [text-shadow:0_0_6px_rgba(255,170,0,0.3)]">
              {t("title").toUpperCase()}
            </span>
            <span className="flex-1 h-0.5 max-w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </div>

          <MonitorGrid items={extensions.map((ext, i) => (
            <CrtMonitorCard key={ext.slug} product={ext} href={`/extensions/${ext.slug}`} mon={String(i + 1).padStart(2, "0")} stats={stats(ext.slug)} />
          ))} />
        </div>
      </div>
    </div>
  );
}
