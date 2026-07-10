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

export const metadata: Metadata = {
  title: "Product Updates",
};

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function monthHeader(isoDate: string, locale: string): string {
  const d = new Date(isoDate);
  if (locale === "zh") {
    return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月`;
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(d);
}

function groupByMonth(
  events: ActivityEvent[],
  locale: string,
): [string, ActivityEvent[]][] {
  const map = new Map<string, ActivityEvent[]>();
  for (const event of events) {
    const key = monthHeader(event.occurredAt, locale);
    const group = map.get(key) ?? [];
    group.push(event);
    map.set(key, group);
  }
  // Map insertion order follows event order, which is `occurredAt` desc.
  return [...map];
}

function resolveProductMeta(event: ActivityEvent, locale: Locale) {
  const product = resolveProductFromId(event.productId);
  if (!product) return null;
  const p = localized(product, locale);
  const isExt = product.type === "extension";
  return {
    name: p.name,
    icon: p.icon,
    iconUrl: p.iconUrl,
    href: isExt ? `/extensions/${p.slug}` : `/apps/${p.slug}`,
    type: product.type,
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ActivityPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { type } = await searchParams;
  const t = await getTranslations("activity");
  const m = await getTranslations("metrics");

  const filterType: ProductType | undefined =
    type === "extension" || type === "app" ? type : undefined;

  const [events, metricsMap] = await Promise.all([
    getActivityFeed(),
    getLatestMetricsForProducts(),
  ]);

  // Filter
  const filtered = filterType
    ? events.filter((e) => resolveProductFromId(e.productId)?.type === filterType)
    : events;

  const timeLabels: ActivityFeedTimeLabels = {
    justNow: m("justNow"),
    hoursAgo: m("hoursAgo"),
    daysAgo: m("daysAgo"),
    weeksAgo: m("weeksAgo"),
  };

  const groups = groupByMonth(filtered, locale);

  // Tab config
  const tabs: { label: string; type: ProductType | undefined }[] = [
    { label: t("filterAll"), type: undefined },
    { label: t("filterExtensions"), type: "extension" },
    { label: t("filterApps"), type: "app" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Back link */}
      <nav className="mb-8">
        <Link
          href="/"
          className="text-sm text-muted transition-colors hover:text-accent"
        >
          {t("backToHome")}
        </Link>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-muted">{t("subtitle")}</p>
      </div>

      {/* Filter tabs */}
      <div className="mb-8 flex gap-2">
        {tabs.map((tab) => {
          const isActive =
            filterType === tab.type || (!filterType && !tab.type);
          const href =
            tab.type
              ? `/${locale}/activity?type=${tab.type}`
              : `/${locale}/activity`;

          return (
            <Link
              key={tab.label}
              href={href}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent text-white"
                  : "bg-surface-alt text-muted hover:text-fg"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <p className="mb-2 text-4xl">📦</p>
          <h2 className="mb-2 text-lg font-semibold">{t("empty")}</h2>
          <p className="text-sm text-muted">{t("emptyHint")}</p>
        </div>
      )}

      {/* Event list — grouped by month */}
      {groups.map(([month, monthEvents]) => {
        // Track first occurrence per product to show post-release activity.
        const seenProductIds = new Set<string>();

        return (
          <section key={month} className="mb-10">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
              {month}
            </h2>

            <ul className="space-y-3">
              {monthEvents.map((event) => {
                const product = resolveProductMeta(event, locale as Locale);
                if (!product) return null;

                const isFirstForProduct = !seenProductIds.has(event.productId);
                if (isFirstForProduct) seenProductIds.add(event.productId);

                const snapshot = metricsMap[event.productId];
                const activityLevel: ActivityLevel | undefined =
                  snapshot?.activity;
                const activityLabel = activityLevel
                  ? m(activityLevel)
                  : undefined;

                // Post-release activity: for each product's latest release,
                // show dev activity if the repo was pushed to after the release.
                const releaseAgeMs =
                  Date.now() - new Date(event.occurredAt).getTime();
                const isReleaseStale = releaseAgeMs > 7 * 86_400_000;

                const lastPushMs = snapshot?.github?.lastPushAt
                  ? new Date(snapshot.github.lastPushAt).getTime()
                  : 0;
                const pushedAfterRelease =
                  lastPushMs > new Date(event.occurredAt).getTime();
                const showSince =
                  isFirstForProduct &&
                  isReleaseStale &&
                  snapshot?.github &&
                  pushedAfterRelease;

                return (
                  <li key={event.id}>
                    <ActivityFeedItem
                      event={event}
                      productName={product.name}
                      productIcon={product.icon}
                      productIconUrl={product.iconUrl}
                      productHref={product.href}
                      activityLevel={activityLevel}
                      activityLabel={activityLabel}
                      timeLabels={timeLabels}
                      locale={locale}
                    />

                    {/* Post-release development activity */}
                    {showSince && (
                      <div className="ml-6 mt-2 border-l-2 border-border pl-5 py-2">
                        <p className="text-xs leading-relaxed text-muted">
                          {snapshot.github!.commitsLast30d > 0
                            ? t("sinceRelease", {
                                tag: event.version ?? event.title,
                                commits: snapshot.github!.commitsLast30d,
                              })
                            : t("sinceReleaseSimple", {
                                tag: event.version ?? event.title,
                              })}
                        </p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
