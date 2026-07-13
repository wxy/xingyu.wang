import {
  getFeaturedProducts,
  achievements,
  getProductId,
  type Locale,
} from "@/lib/products";
import { getActivityFeed, getLatestMetricsForProducts } from "@/lib/metrics";
import { fetchGitHubRepoInfo } from "@/lib/metrics/github";
import { getTranslations } from "next-intl/server";
import { CrtMonitorCard } from "@/components/CrtMonitorCard";
import { MonitorGrid } from "@/components/MonitorGrid";
import Link from "next/link";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("home");
  const ach = await getTranslations("achievements");
  const m = await getTranslations("metrics");
  const at = await getTranslations("activity");
  const featured = getFeaturedProducts();

  const [recentEvents, metricsMap, lcttRepo] = await Promise.all([
    getActivityFeed(3),
    getLatestMetricsForProducts(),
    achievements.find((a) => a.repoUrl)?.repoUrl
      ? fetchGitHubRepoInfo(achievements.find((a) => a.repoUrl)!.repoUrl!)
      : null,
  ]);

  // Aggregate stats across all products
  let totalCommits = 0;
  let totalPRs = 0;
  for (const snap of Object.values(metricsMap)) {
    totalCommits += snap.github?.commitsLast30d ?? 0;
    totalPRs += snap.github?.mergedPRsLast30d ?? 0;
  }

  const extensions = featured.filter((p) => p.type === "extension");
  const apps = featured.filter((p) => p.type === "app");

  function cardStats(product: (typeof featured)[number]) {
    const snap = metricsMap[getProductId(product)];
    if (!snap) return undefined;
    return {
      commits: snap.github?.commitsLast30d,
      prs: snap.github?.mergedPRsLast30d,
      release: snap.github?.latestRelease?.tag,
      activity: snap.activity
        ? m(snap.activity as "active" | "maintained" | "quiet" | "unknown")
        : undefined,
      rawActivity: snap.activity,
    };
  }

  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="px-6 pt-10 pb-8 text-center">
        <h1 className="heading-glow text-[34px] tracking-[3px] mb-1">
          XINGYU WANG
        </h1>
        <p className="text-muted-dim text-[11px] tracking-[1px] mb-5">
          {t("subtitle")}
        </p>

        {/* Stat counters */}
        <div className="flex justify-center gap-3 mb-5">
          <StatBox value={totalCommits} label={t("commits").toUpperCase()} color="#33ff33" />
          <StatBox value={totalPRs} label={t("prsMerged").toUpperCase()} color="#ffaa00" />
          <StatBox value={featured.length} label={t("products").toUpperCase()} color="#33ff33" />
        </div>

        {/* CTA buttons */}
        <div className="flex justify-center gap-2.5">
          <Link href="/extensions" className="no-underline">
            <button className="btn-gold">
              [ {t("browseExtensions")} ]
            </button>
          </Link>
          <Link href="/apps" className="no-underline">
            <button className="btn-gold">
              [ {t("browseApps")} ]
            </button>
          </Link>
        </div>
      </section>

      {/* ═══════ EXTENSIONS ═══════ */}
      <SectionBox title={t("extensions").toUpperCase()} viewAllHref="/extensions" viewAllLabel={t("viewAll")}>
        {extensions.length >= 2 ? (
          <MonitorGrid items={[
            <CrtMonitorCard key="0" product={extensions[0]} href={`/extensions/${extensions[0].slug}`} mon="01"  stats={cardStats(extensions[0])} />,
            <CrtMonitorCard key="1" product={extensions[1]} href={`/extensions/${extensions[1].slug}`} mon="02"  stats={cardStats(extensions[1])} />,
            <CrtMonitorCard key="2" product={extensions[2] || extensions[0]} href={`/extensions/${extensions[2]?.slug || extensions[0].slug}`} mon="03"  stats={extensions[2] ? cardStats(extensions[2]) : undefined} />,
            extensions[3] ? <CrtMonitorCard key="3" product={extensions[3]} href={`/extensions/${extensions[3].slug}`} mon="04"  stats={cardStats(extensions[3])} /> : null,
          ].filter(Boolean)} />
        ) : (
          <div className="flex justify-center">
            {extensions.map((ext, i) => (
              <CrtMonitorCard key={ext.slug} product={ext} href={`/extensions/${ext.slug}`} mon={String(i + 1).padStart(2, "0")}  stats={cardStats(ext)} />
            ))}
          </div>
        )}
      </SectionBox>

      {/* ═══════ APPS ═══════ */}
      {apps.length > 0 && (
        <SectionBox title={t("apps").toUpperCase()} viewAllHref="/apps" viewAllLabel={t("viewAll")}>
          <div className="flex justify-center items-center gap-0">
            <MonitorGrid items={apps.map((app) => (
              <CrtMonitorCard key={app.slug} product={app} href={`/apps/${app.slug}`} mon={String(apps.indexOf(app) + 5).padStart(2, "0")}  stats={cardStats(app)} />
            ))} />
          </div>
        </SectionBox>
      )}

      {/* ═══════ ACTIVITY PREVIEW ═══════ */}
      {recentEvents.length > 0 && (
        <SectionBox title={at("previewTitle").toUpperCase()} viewAllHref="/activity" viewAllLabel={at("viewAll")}>
          <div className="bg-[rgba(10,20,10,0.5)] border border-[rgba(51,255,51,0.08)] p-3 font-['Courier_New'] text-left w-full box-border">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="text-[10px] text-muted-dim py-1 border-b border-[rgba(51,255,51,0.04)]"
              >
                <span className="text-fg">[{event.occurredAt.slice(0, 10)}]</span>{" "}
                <span className="text-accent">{event.version ?? event.title}</span>
                {" — "}
                <span>{event.title}</span>
              </div>
            ))}
          </div>
        </SectionBox>
      )}

      {/* ═══════ ACHIEVEMENTS ═══════ */}
      {achievements.length > 0 && (
        <SectionBox title={t("achievements").toUpperCase()} viewAllHref="" viewAllLabel="">
          <div className="flex justify-center gap-4 flex-wrap">
            {achievements.map((a) => (
              <a key={a.name} href={a.url} target="_blank" rel="noopener noreferrer" className="no-underline">
                <div className="card p-4 max-w-[300px] text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{a.icon}</span>
                    <span className="text-[9px] text-[rgba(51,255,51,0.3)] border border-border rounded-[10px] px-2 py-0.5 uppercase tracking-[1px]">{ach("lctt.org")}</span>
                  </div>
                  <h3 className="text-xs text-fg mb-1">{ach("lctt.name")}</h3>
                  <p className="text-[9px] text-muted leading-relaxed">{ach("lctt.description")}</p>
                  <p className="text-[8px] text-muted-dim mt-1.5">{ach("lctt.year")}</p>
                  {lcttRepo && (
                    <div className="flex gap-3 mt-2 text-[9px]">
                      <span className="text-muted">⭐ {lcttRepo.stars.toLocaleString()}</span>
                      <span className="text-muted">⑂ {lcttRepo.forks.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </SectionBox>
      )}
    </>
  );
}

function SectionBox({
  title,
  viewAllHref,
  viewAllLabel,
  children,
}: {
  title: string;
  viewAllHref: string;
  viewAllLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-6 px-4 text-center">
      <div className="section-frame">
        {/* Title with horizontal rules */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="flex-1 h-0.5 max-w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
          <span className="text-[13px] font-bold text-accent [text-shadow:0_0_6px_rgba(255,170,0,0.3)] whitespace-nowrap">
            {title}
          </span>
          <span className="flex-1 h-0.5 max-w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
        </div>
        {children}
        {viewAllHref && (
          <div className="mt-3">
            <Link href={viewAllHref} className="text-accent text-[10px] no-underline">
              {viewAllLabel}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-[rgba(10,20,10,0.8)] border-2 px-5 py-2.5 min-w-[100px] text-center" style={{ borderColor: `${color}18` }}>
      <div
        className="text-[22px] font-bold"
        style={{
          color,
          textShadow: `0 0 8px ${color}44`,
        }}
      >
        {value.toLocaleString()}
      </div>
      <div className="text-muted-dim text-[8px] uppercase tracking-[1px] mt-0.5">
        {label}
      </div>
    </div>
  );
}
