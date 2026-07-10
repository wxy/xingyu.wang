import {
  getActivityFeed,
  getLatestMetricsForProducts,
  resolveProductFromId,
} from "@/lib/metrics";
import { getTranslations } from "next-intl/server";
import {
  ActivityFeedItem,
  type ActivityFeedTimeLabels,
} from "@/components/ActivityFeedItem";
import { localized, type Locale, type ProductType } from "@/lib/products";
import Link from "next/link";
import type { Metadata } from "next";
import type { ActivityEvent, ActivityLevel } from "@/lib/metrics/types";

export const metadata: Metadata = { title: "Product Updates" };

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}

function monthHeader(isoDate: string, locale: string): string {
  const d = new Date(isoDate);
  if (locale === "zh") return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月`;
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long" }).format(d);
}

function groupByMonth(events: ActivityEvent[], locale: string): [string, ActivityEvent[]][] {
  const map = new Map<string, ActivityEvent[]>();
  for (const event of events) {
    const key = monthHeader(event.occurredAt, locale);
    const group = map.get(key) ?? [];
    group.push(event);
    map.set(key, group);
  }
  return [...map];
}

function resolveProductMeta(event: ActivityEvent, locale: Locale) {
  const product = resolveProductFromId(event.productId);
  if (!product) return null;
  const p = localized(product, locale);
  const isExt = product.type === "extension";
  return { name: p.name, icon: p.icon, iconUrl: p.iconUrl, href: isExt ? `/extensions/${p.slug}` : `/apps/${p.slug}`, type: product.type };
}

export default async function ActivityPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { type } = await searchParams;
  const t = await getTranslations("activity");
  const m = await getTranslations("metrics");

  const filterType: ProductType | undefined = type === "extension" || type === "app" ? type : undefined;

  const [events, metricsMap] = await Promise.all([getActivityFeed(), getLatestMetricsForProducts()]);
  const filtered = filterType ? events.filter((e) => resolveProductFromId(e.productId)?.type === filterType) : events;

  const timeLabels: ActivityFeedTimeLabels = { justNow: m("justNow"), hoursAgo: m("hoursAgo"), daysAgo: m("daysAgo"), weeksAgo: m("weeksAgo") };
  const groups = groupByMonth(filtered, locale);

  const tabs: { label: string; type: ProductType | undefined }[] = [
    { label: t("filterAll"), type: undefined },
    { label: t("filterExtensions"), type: "extension" },
    { label: t("filterApps"), type: "app" },
  ];

  return (
    <div style={{ background: "#0a0a06", minHeight: "100vh", padding: "32px 24px", fontFamily: "'Courier New', monospace" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Back link */}
        <Link href="/" style={{ color: "rgba(51,255,51,0.4)", fontSize: 11, textDecoration: "none" }}>← {t("backToHome")}</Link>

        {/* Header */}
        <div style={{ marginTop: 16, marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: "bold", color: "#33ff33", textShadow: "0 0 10px rgba(51,255,51,0.4)", margin: "0 0 4px" }}>{t("title")}</h1>
          <p style={{ fontSize: 11, color: "rgba(51,255,51,0.4)", margin: 0 }}>{t("subtitle")}</p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {tabs.map((tab) => {
            const isActive = filterType === tab.type || (!filterType && !tab.type);
            const href = tab.type ? `/${locale}/activity?type=${tab.type}` : `/${locale}/activity`;
            return (
              <Link key={tab.label} href={href} style={{ textDecoration: "none" }}>
                <span style={{
                  padding: "6px 16px", fontSize: 11, fontWeight: 600, fontFamily: "'Courier New', monospace",
                  background: isActive ? "rgba(51,255,51,0.1)" : "rgba(51,255,51,0.03)",
                  color: isActive ? "#33ff33" : "rgba(51,255,51,0.4)",
                  border: `1px solid ${isActive ? "rgba(51,255,51,0.2)" : "rgba(51,255,51,0.06)"}`,
                }}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{ border: "1px solid rgba(51,255,51,0.08)", padding: 32, textAlign: "center", background: "rgba(10,20,10,0.5)" }}>
            <p style={{ fontSize: 32, margin: "0 0 8px" }}>📦</p>
            <h2 style={{ fontSize: 14, color: "#33ff33", margin: "0 0 4px" }}>{t("empty")}</h2>
            <p style={{ fontSize: 10, color: "rgba(51,255,51,0.3)" }}>{t("emptyHint")}</p>
          </div>
        )}

        {/* Event list */}
        {groups.map(([month, monthEvents]) => {
          const seenProductIds = new Set<string>();
          return (
            <section key={month} style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "rgba(51,255,51,0.3)", marginBottom: 12 }}>
                {month}
              </h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {monthEvents.map((event) => {
                  const product = resolveProductMeta(event, locale as Locale);
                  if (!product) return null;
                  const isFirstForProduct = !seenProductIds.has(event.productId);
                  if (isFirstForProduct) seenProductIds.add(event.productId);
                  const snapshot = metricsMap[event.productId];
                  const activityLevel: ActivityLevel | undefined = snapshot?.activity;
                  const activityLabel = activityLevel ? m(activityLevel) : undefined;
                  const releaseAgeMs = Date.now() - new Date(event.occurredAt).getTime();
                  const isReleaseStale = releaseAgeMs > 7 * 86_400_000;
                  const lastPushMs = snapshot?.github?.lastPushAt ? new Date(snapshot.github.lastPushAt).getTime() : 0;
                  const pushedAfterRelease = lastPushMs > new Date(event.occurredAt).getTime();
                  const showSince = isFirstForProduct && isReleaseStale && snapshot?.github && pushedAfterRelease;

                  return (
                    <li key={event.id}>
                      {showSince && (
                        <div style={{ marginLeft: 24, marginBottom: 8, borderLeft: "2px solid rgba(51,255,51,0.1)", paddingLeft: 20, paddingTop: 8, paddingBottom: 8 }}>
                          <p style={{ fontSize: 10, lineHeight: 1.5, color: "rgba(51,255,51,0.35)", margin: 0 }}>
                            {snapshot.github!.commitsLast30d > 0
                              ? t("sinceRelease", { tag: event.version ?? event.title, commits: snapshot.github!.commitsLast30d })
                              : t("sinceReleaseSimple", { tag: event.version ?? event.title })}
                          </p>
                        </div>
                      )}
                      <ActivityFeedItem event={event} productName={product.name} productIcon={product.icon} productIconUrl={product.iconUrl} productHref={product.href} activityLevel={activityLevel} activityLabel={activityLabel} timeLabels={timeLabels} locale={locale} />
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
