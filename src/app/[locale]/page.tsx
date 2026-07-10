import {
  getFeaturedProducts,
  achievements,
  getProductId,
  localized,
  type Locale,
} from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import {
  getActivityFeed,
  getDiverseActivityFeed,
  getLatestMetricsForProducts,
  resolveProductFromId,
} from "@/lib/metrics";
import {
  ActivityFeedItem,
  type ActivityFeedTimeLabels,
} from "@/components/ActivityFeedItem";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("home");
  const ach = await getTranslations("achievements");
  const at = await getTranslations("activity");
  const m = await getTranslations("metrics");
  const featured = getFeaturedProducts();

  // Fetch live metrics + recent activity for enhanced display.
  const [recentEvents, metricsMap] = await Promise.all([
    getDiverseActivityFeed(5),
    getLatestMetricsForProducts(),
  ]);

  const timeLabels: ActivityFeedTimeLabels = {
    justNow: m("justNow"),
    hoursAgo: m("hoursAgo"),
    daysAgo: m("daysAgo"),
    weeksAgo: m("weeksAgo"),
  };

  // Helpers to build ProductCard metrics props.
  function cardMetrics(product: (typeof featured)[number]) {
    const snap = metricsMap[getProductId(product)];
    if (!snap) return undefined;
    return {
      activity: snap.activity,
      latestRelease: snap.github?.latestRelease,
    };
  }

  return (
    <>
      {/* Hero */}
      <section className="px-6 pb-20 pt-24 sm:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-balance text-lg leading-relaxed text-muted">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/extensions"
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent/90"
            >
              {t("browseExtensions")}
            </Link>
            <Link
              href="/apps"
              className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-fg transition-all hover:border-accent hover:text-accent"
            >
              {t("browseApps")}
            </Link>
          </div>
        </div>
      </section>

      {/* Activity Preview */}
      {recentEvents.length > 0 && (
        <section className="section-alt px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{at("previewTitle")}</h2>
              <Link
                href="/activity"
                className="text-sm font-medium text-accent hover:opacity-80"
              >
                {at("viewAll")}
              </Link>
            </div>
            <p className="mb-8 text-sm text-muted">{at("previewSubtitle")}</p>

            <ul className="space-y-2">
              {recentEvents.map((event) => {
                const product = resolveProductFromId(event.productId);
                if (!product) return null;
                const p = localized(product, locale as Locale);
                const isExt = product.type === "extension";
                const href = isExt
                  ? `/extensions/${p.slug}`
                  : `/apps/${p.slug}`;
                const activityLevel = metricsMap[event.productId]?.activity;
                const activityLabel = activityLevel
                  ? m(activityLevel)
                  : undefined;

                return (
                  <li key={event.id}>
                    <ActivityFeedItem
                      event={event}
                      productName={p.name}
                      productIcon={p.icon}
                      productIconUrl={p.iconUrl}
                      productHref={href}
                      activityLevel={activityLevel}
                      activityLabel={activityLabel}
                      timeLabels={timeLabels}
                      locale={locale}
                      compact
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* Extensions */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t("extensions")}</h2>
            <Link
              href="/extensions"
              className="text-sm font-medium text-accent hover:opacity-80"
            >
              {t("viewAll")}
            </Link>
          </div>
          <p className="mb-8 text-sm text-muted">{t("extensionsDesc")}</p>
          <div className="grid gap-5 sm:grid-cols-2">
            {featured
              .filter((p) => p.type === "extension")
              .map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  metrics={cardMetrics(product)}
                />
              ))}
          </div>
        </div>
      </section>

      {/* Apps */}
      <section className="section-alt px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t("apps")}</h2>
            <Link
              href="/apps"
              className="text-sm font-medium text-accent hover:opacity-80"
            >
              {t("viewAll")}
            </Link>
          </div>
          <p className="mb-8 text-sm text-muted">{t("appsDesc")}</p>
          <div className="grid gap-5 sm:grid-cols-2">
            {featured
              .filter((p) => p.type === "app")
              .map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  metrics={cardMetrics(product)}
                />
              ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      {achievements.length > 0 && (
        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-xl font-semibold">
              {t("achievements")}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {achievements.map((a) => (
                <a
                  key={a.name}
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card flex flex-col p-6 transition-all hover:-translate-y-0.5"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-2xl">{a.icon}</span>
                    <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted">
                      {ach(`lctt.org`)}
                    </span>
                  </div>
                  <h3 className="mb-2 font-semibold text-fg">
                    {ach(`lctt.name`)}
                  </h3>
                  <p className="mb-3 text-sm leading-relaxed text-muted">
                    {ach(`lctt.description`)}
                  </p>
                  <p className="text-xs text-muted">{ach(`lctt.year`)}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
