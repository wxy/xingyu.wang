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

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("activity");
  return { title: t("title") };
}

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
    <div className="min-h-screen py-8 px-6 font-['Courier_New']">
      <div className="max-w-[800px] mx-auto">
        {/* Back link */}
        <Link href="/" className="text-muted-dim text-[11px] no-underline">← {t("backToHome")}</Link>

        {/* Header */}
        <div className="mt-4 mb-6">
          <h1 className="heading-glow text-[22px] mb-1">{t("title")}</h1>
          <p className="text-[11px] text-muted-dim m-0">{t("subtitle")}</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => {
            const isActive = filterType === tab.type || (!filterType && !tab.type);
            const href = tab.type ? `/${locale}/activity?type=${tab.type}` : `/${locale}/activity`;
            return (
              <Link key={tab.label} href={href} className="no-underline">
                <span className={`px-4 py-1.5 text-[11px] font-semibold font-['Courier_New'] ${
                  isActive
                    ? "bg-[rgba(51,255,51,0.1)] text-fg border border-[rgba(51,255,51,0.2)]"
                    : "bg-[rgba(51,255,51,0.03)] text-muted-dim border border-[rgba(51,255,51,0.06)]"
                }`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="border border-[rgba(51,255,51,0.08)] p-8 text-center bg-[rgba(10,20,10,0.5)]">
            <p className="text-[32px] mb-2">📦</p>
            <h2 className="text-sm text-fg mb-1">{t("empty")}</h2>
            <p className="text-[10px] text-[rgba(51,255,51,0.3)]">{t("emptyHint")}</p>
          </div>
        )}

        {/* Event list */}
        {groups.map(([month, monthEvents]) => {
          const seenProductIds = new Set<string>();
          return (
            <section key={month} className="mb-8">
              <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-[rgba(51,255,51,0.3)] mb-3">
                {month}
              </h2>
              <ul className="list-none p-0 m-0 flex flex-col gap-3">
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
                        <div className="ml-6 mb-2 border-l-2 border-[rgba(51,255,51,0.1)] pl-5 py-2">
                          <p className="text-[10px] leading-relaxed text-[rgba(51,255,51,0.35)] m-0">
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
