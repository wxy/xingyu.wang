import { getProductBySlug, extensions, localized } from "@/lib/products";
import type { Locale } from "@/lib/products";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ProductMetricsSection } from "@/components/ProductMetricsSection";

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

        {/* Live Stats in CRT monitor frame */}
        <div style={{
          background: "linear-gradient(180deg, #f5f0e8, #e8e0d0 8%, #ddd5c0 20%, #e0d8c5 40%, #d5ccb5 70%, #f0ead8)",
          borderRadius: 16, padding: "12px 12px 16px 12px", marginBottom: 24,
          boxShadow: "0 6px 24px rgba(0,0,0,0.5), 0 0 0 2px #1a1a1a, 0 0 0 4px #2a2a2a",
        }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 5, marginBottom: 6 }}>
            <div style={{ width: 14, height: 2, background: "#8a8070", borderRadius: 1 }} />
            <div style={{ width: 14, height: 2, background: "#8a8070", borderRadius: 1 }} />
            <div style={{ width: 14, height: 2, background: "#8a8070", borderRadius: 1 }} />
            <div style={{ width: 14, height: 2, background: "#8a8070", borderRadius: 1 }} />
            <div style={{ width: 14, height: 2, background: "#8a8070", borderRadius: 1 }} />
          </div>
          <div style={{ background: "#1a1a1a", borderRadius: 9, padding: 3, boxShadow: "inset 0 2px 8px rgba(0,0,0,0.8)" }}>
            <div style={{ background: "radial-gradient(ellipse at 40% 30%, #0d200d, #050d05)", borderRadius: 7, padding: 12, border: "1px solid #33ff3310", boxShadow: "inset 0 0 40px rgba(0,0,0,0.5)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,20,0,0.04) 2px, rgba(0,20,0,0.04) 4px)", pointerEvents: "none", zIndex: 2 }} />
              <div style={{ position: "relative", zIndex: 1, padding: 8 }}>
                <ProductMetricsSection product={raw} slug={slug} type="extension" locale={locale} />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 24, border: "1px solid rgba(51,255,51,0.08)", padding: "14px 16px" }}>
          <h2 style={{ fontSize: 12, fontWeight: "bold", color: "#ffaa00", marginBottom: 6 }}>{t("about")}</h2>
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
