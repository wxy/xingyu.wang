import { getProductBySlug, extensions, localized } from "@/lib/products";
import type { Locale } from "@/lib/products";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ProductMetricsPanel } from "@/components/ProductMetricsPanel";
import { ProductReleaseList } from "@/components/ProductReleaseList";
import { getMetricsForProductSlug, getReleasesForProductSlug } from "@/lib/metrics";
import { isMetricsEnabled } from "@/lib/products";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export function generateStaticParams() {
  return extensions.map((ext) => ({ slug: ext.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug, "extension");
  if (!product) return { title: "Not Found" };
  return { title: product.name };
}

export default async function ExtensionDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const t = await getTranslations("extensions");
  const raw = getProductBySlug(slug, "extension");
  if (!raw || raw.type !== "extension") notFound();

  const product = localized(raw, locale as Locale);

  const metricsEnabled = isMetricsEnabled(raw);
  const [metrics, releases] = metricsEnabled
    ? await Promise.all([getMetricsForProductSlug(slug, "extension"), getReleasesForProductSlug(slug, "extension")])
    : [null, []];

  const repoReleasesUrl = raw.repoUrl ? `${raw.repoUrl}/releases` : undefined;

  return (
    <div style={{ background: "#0a0a06", minHeight: "100vh", padding: "32px 24px", fontFamily: "'Courier New', monospace" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Back link */}
        <Link href="/extensions" style={{ color: "rgba(51,255,51,0.4)", fontSize: 11, textDecoration: "none" }}>
          ← {t("backToList")}
        </Link>

        {/* Header — outside box */}
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {product.iconUrl ? (
              <img src={product.iconUrl} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: "contain" }} />
            ) : (
              <span style={{ fontSize: 28 }}>{product.icon}</span>
            )}
            <div>
              <h1 style={{ fontSize: 22, fontWeight: "bold", color: "#33ff33", textShadow: "0 0 10px rgba(51,255,51,0.5)", margin: 0 }}>
                {product.name}
              </h1>
              <p style={{ fontSize: 11, color: "rgba(51,255,51,0.4)", margin: "2px 0 0" }}>{product.tagline}</p>
            </div>
          </div>
        </div>

        {/* Live Stats — terminal panel */}
        {metrics && (
          <div style={{
            border: "2px solid rgba(51,255,51,0.15)",
            background: "rgba(0,0,0,0.3)",
            marginBottom: 24,
            boxShadow: "0 0 16px rgba(51,255,51,0.04), inset 0 0 16px rgba(0,0,0,0.3)",
          }}>
            {/* Title bar */}
            <div style={{
              background: "rgba(51,255,51,0.06)",
              borderBottom: "1px solid rgba(51,255,51,0.1)",
              padding: "6px 12px",
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 9, color: "rgba(51,255,51,0.5)",
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffaa00", boxShadow: "0 0 4px #ffaa00", display: "inline-block" }} />
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(51,255,51,0.2)" }} />
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(51,255,51,0.2)" }} />
              <span style={{ flex: 1, textAlign: "center" }}>live_stats.sh — {product.name}</span>
            </div>
            {/* Stats content */}
            <div style={{ padding: 12 }}>
              <ProductMetricsPanel metrics={metrics} locale={locale} />
            </div>
          </div>
        )}

        {/* Releases — outside CRT frame */}
        {releases.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <ProductReleaseList releases={releases} locale={locale} activity={metrics?.activity} repoReleasesUrl={repoReleasesUrl} />
          </div>
        )}

        {/* Description */}
        <h2 style={{ fontSize: 12, fontWeight: "bold", color: "#ffaa00", margin: "0 0 6px" }}>{t("about")}</h2>
        <div style={{ marginBottom: 24, border: "1px solid rgba(51,255,51,0.08)", padding: "14px 16px" }}>
          <p style={{ fontSize: 11, color: "rgba(51,255,51,0.5)", lineHeight: 1.6, margin: 0 }}>{product.description}</p>
        </div>

        {/* Features */}
        {product.features.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 12, fontWeight: "bold", color: "#ffaa00", marginBottom: 8 }}>{t("features")}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {product.features.map((f, i) => (
                <div key={i} style={{ border: "1px solid rgba(51,255,51,0.08)", padding: "8px 12px", fontSize: 10, color: "rgba(51,255,51,0.45)", display: "flex", alignItems: "flex-start", gap: 6 }}>
                  <span style={{ color: "#ffaa00", flexShrink: 0 }}>▸</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 12, fontWeight: "bold", color: "#ffaa00", marginBottom: 8 }}>{t("techStack")}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {product.technologies.map((tech) => (
              <span key={tech} style={{ border: "1px solid rgba(51,255,51,0.1)", padding: "4px 10px", fontSize: 10, color: "rgba(51,255,51,0.5)", fontFamily: "'Courier New', monospace" }}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: 10 }}>
          {product.url && (
            <a href={product.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button style={{
                background: "linear-gradient(180deg, #e8c878, #c89840 25%, #d4a850 50%, #b88830 75%, #c09838)",
                border: "2px solid #7a6020", borderRadius: 4, padding: "8px 20px",
                fontFamily: "'Courier New', monospace", fontSize: 11, fontWeight: "bold",
                color: "#1a1a08", cursor: "pointer",
                boxShadow: "0 3px 0 #5a4010, 0 4px 8px rgba(0,0,0,0.4)",
              }}>
                [ {t("install")} ]
              </button>
            </a>
          )}
          {product.repoUrl && (
            <a href={product.repoUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button style={{
                background: "transparent", border: "2px solid rgba(51,255,51,0.2)", borderRadius: 4, padding: "8px 20px",
                fontFamily: "'Courier New', monospace", fontSize: 11, fontWeight: "bold",
                color: "#33ff33", cursor: "pointer",
              }}>
                [ {t("viewOnGitHub")} ]
              </button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
