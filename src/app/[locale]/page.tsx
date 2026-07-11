import {
  getFeaturedProducts,
  achievements,
  getProductId,
  type Locale,
} from "@/lib/products";
import { getActivityFeed, getLatestMetricsForProducts } from "@/lib/metrics";
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
  const featured = getFeaturedProducts();

  const [recentEvents, metricsMap] = await Promise.all([
    getActivityFeed(3),
    getLatestMetricsForProducts(),
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
      <section style={{ padding: "40px 24px 32px", textAlign: "center" }}>
        <h1
          style={{
            color: "#33ff33",
            fontSize: 34,
            fontWeight: "bold",
            textShadow:
              "0 0 10px rgba(51,255,51,0.6), 0 0 30px rgba(51,255,51,0.2), 3px 3px 0 #1a2a1a",
            letterSpacing: 3,
            margin: "0 0 6px",
          }}
        >
          XINGYU WANG
        </h1>
        <p
          style={{
            color: "rgba(51,255,51,0.5)",
            fontSize: 11,
            letterSpacing: 1,
            margin: "0 0 20px",
          }}
        >
          {t("subtitle")}
        </p>

        {/* Stat counters */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <StatBox value={totalCommits} label="COMMITS" color="#33ff33" />
          <StatBox value={totalPRs} label="PRs MERGED" color="#ffaa00" />
          <StatBox value={featured.length} label="PRODUCTS" color="#33ff33" />
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          <Link href="/extensions" style={{ textDecoration: "none" }}>
            <button
              style={{
                background:
                  "linear-gradient(180deg, #e8c878 0%, #c89840 25%, #d4a850 50%, #b88830 75%, #c09838 100%)",
                border: "2px solid #7a6020",
                borderRadius: 4,
                padding: "8px 24px",
                fontFamily: "'Courier New', monospace",
                fontSize: 11,
                fontWeight: "bold",
                letterSpacing: 1,
                color: "#1a1a08",
                textShadow: "0 1px 0 rgba(255,255,200,0.3)",
                boxShadow:
                  "0 3px 0 #5a4010, 0 4px 8px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,200,0.3)",
                cursor: "pointer",
              }}
            >
              [ {t("browseExtensions")} ]
            </button>
          </Link>
          <Link href="/apps" style={{ textDecoration: "none" }}>
            <button
              style={{
                background:
                  "linear-gradient(180deg, #e8c878 0%, #c89840 25%, #d4a850 50%, #b88830 75%, #c09838 100%)",
                border: "2px solid #7a6020",
                borderRadius: 4,
                padding: "8px 24px",
                fontFamily: "'Courier New', monospace",
                fontSize: 11,
                fontWeight: "bold",
                letterSpacing: 1,
                color: "#1a1a08",
                textShadow: "0 1px 0 rgba(255,255,200,0.3)",
                boxShadow:
                  "0 3px 0 #5a4010, 0 4px 8px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,200,0.3)",
                cursor: "pointer",
              }}
            >
              [ {t("browseApps")} ]
            </button>
          </Link>
        </div>
      </section>

      {/* ═══════ EXTENSIONS ═══════ */}
      <SectionBox title={t("extensions").toUpperCase()} viewAllHref="/extensions" viewAllLabel={t("viewAll")}>
        {extensions.length >= 2 ? (
          <MonitorGrid items={[
            <CrtMonitorCard key="0" product={extensions[0]} href={`/extensions/${extensions[0].slug}`} mon="01" status="rec" stats={cardStats(extensions[0])} />,
            <CrtMonitorCard key="1" product={extensions[1]} href={`/extensions/${extensions[1].slug}`} mon="02" status="idle" stats={cardStats(extensions[1])} />,
            <CrtMonitorCard key="2" product={extensions[2] || extensions[0]} href={`/extensions/${extensions[2]?.slug || extensions[0].slug}`} mon="03" status="idle" stats={extensions[2] ? cardStats(extensions[2]) : undefined} />,
            extensions[3] ? <CrtMonitorCard key="3" product={extensions[3]} href={`/extensions/${extensions[3].slug}`} mon="04" status="standby" stats={cardStats(extensions[3])} /> : null,
          ].filter(Boolean)} />
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {extensions.map((ext, i) => (
              <CrtMonitorCard key={ext.slug} product={ext} href={`/extensions/${ext.slug}`} mon={String(i + 1).padStart(2, "0")} status="rec" stats={cardStats(ext)} />
            ))}
          </div>
        )}
      </SectionBox>

      {/* ═══════ APPS ═══════ */}
      {apps.length > 0 && (
        <SectionBox title={t("apps").toUpperCase()} viewAllHref="/apps" viewAllLabel={t("viewAll")}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0 }}>
            <MonitorGrid items={[
              ...apps.map((app) => (
                <CrtMonitorCard key={app.slug} product={app} href={`/apps/${app.slug}`} mon={String(apps.indexOf(app) + 5).padStart(2, "0")} status="idle" stats={cardStats(app)} />
              )),
              // Test card for odd-number layout
              <CrtMonitorCard key="test" product={apps[0]} href={`/apps/${apps[0].slug}`} mon="07" status="standby" stats={undefined} />,
            ]} />
          </div>
        </SectionBox>
      )}

      {/* ═══════ ACTIVITY PREVIEW ═══════ */}
      {recentEvents.length > 0 && (
        <SectionBox title="RECENT UPDATES" viewAllHref="/activity" viewAllLabel="VIEW ALL →">
          <div
            style={{
              background: "rgba(10, 20, 10, 0.5)",
              border: "1px solid rgba(51,255,51,0.08)",
              padding: "12px 16px",
              fontFamily: "'Courier New', monospace",
              textAlign: "left",
              minWidth: 400,
            }}
          >
            {recentEvents.map((event) => (
              <div
                key={event.id}
                style={{
                  fontSize: 10,
                  color: "rgba(51,255,51,0.5)",
                  padding: "4px 0",
                  borderBottom: "1px solid rgba(51,255,51,0.04)",
                }}
              >
                <span style={{ color: "#33ff33" }}>[{event.occurredAt.slice(0, 10)}]</span>{" "}
                <span style={{ color: "#ffaa00" }}>{event.version ?? event.title}</span>
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
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            {achievements.map((a) => (
              <a key={a.name} href={a.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <div style={{ padding: "16px 20px", textAlign: "left", maxWidth: 300, background: "rgba(10,20,10,0.6)", border: "1px solid rgba(51,255,51,0.1)", borderRadius: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{a.icon}</span>
                    <span style={{ fontSize: 9, color: "rgba(51,255,51,0.3)", border: "1px solid rgba(51,255,51,0.1)", borderRadius: 10, padding: "2px 8px", textTransform: "uppercase", letterSpacing: 1 }}>{ach("lctt.org")}</span>
                  </div>
                  <h3 style={{ fontSize: 12, color: "#33ff33", marginBottom: 4 }}>{ach("lctt.name")}</h3>
                  <p style={{ fontSize: 9, color: "rgba(51,255,51,0.4)", lineHeight: 1.5 }}>{ach("lctt.description")}</p>
                  <p style={{ fontSize: 8, color: "rgba(51,255,51,0.25)", marginTop: 6 }}>{ach("lctt.year")}</p>
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
    <div style={{ padding: "24px 0", textAlign: "center" }}>
      <div style={{
        display: "inline-block",
        border: "4px double #ffaa00",
        boxShadow: "0 0 20px rgba(255,170,0,0.08), inset 0 0 20px rgba(255,170,0,0.04)",
        padding: "20px 32px",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}>
        {/* Title with horizontal rules */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          marginBottom: 16,
        }}>
          <span style={{
            flex: 1,
            height: 2,
            background: "linear-gradient(90deg, transparent, #ffaa00 20%, #ffaa00 80%, transparent)",
            maxWidth: 80,
          }} />
          <span style={{
            fontSize: 13,
            fontWeight: "bold",
            color: "#ffaa00",
            textShadow: "0 0 6px rgba(255,170,0,0.3)",
            whiteSpace: "nowrap",
          }}>
            {title}
          </span>
          <span style={{
            flex: 1,
            height: 2,
            background: "linear-gradient(90deg, transparent, #ffaa00 20%, #ffaa00 80%, transparent)",
            maxWidth: 80,
          }} />
        </div>
        {children}
        {viewAllHref && (
          <div style={{ marginTop: 12 }}>
            <Link href={viewAllHref} style={{ color: "#ffaa00", fontSize: 10, textDecoration: "none" }}>
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
    <div
      style={{
        background: "rgba(10, 20, 10, 0.8)",
        border: `2px solid ${color}18`,
        padding: "10px 20px",
        minWidth: 100,
        textAlign: "center",
      }}
    >
      <div
        style={{
          color,
          fontSize: 22,
          fontWeight: "bold",
          textShadow: `0 0 8px ${color}44`,
        }}
      >
        {value.toLocaleString()}
      </div>
      <div
        style={{
          color: "rgba(51,255,51,0.4)",
          fontSize: 8,
          textTransform: "uppercase",
          letterSpacing: 1,
          marginTop: 2,
        }}
      >
        {label}
      </div>
    </div>
  );
}
