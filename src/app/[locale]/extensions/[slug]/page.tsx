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
    <div className="min-h-screen py-8 px-6 font-['Courier_New']">
      <div className="max-w-[800px] mx-auto">
        {/* Back link */}
        <Link href="/extensions" className="text-muted-dim text-[11px] no-underline">
          ← {t("backToList")}
        </Link>

        {/* Header */}
        <div className="mt-4 mb-4">
          <div className="flex items-center gap-3">
            {product.iconUrl ? (
              <img src={product.iconUrl} alt="" className="w-10 h-10 rounded-lg object-contain" />
            ) : (
              <span className="text-[28px]">{product.icon}</span>
            )}
            <div>
              <h1 className="heading-glow text-[22px] m-0">
                {product.name}
              </h1>
              <p className="text-[11px] text-muted-dim mt-0.5">{product.tagline}</p>
            </div>
          </div>
        </div>

        {/* Live Stats — terminal panel */}
        {metrics && (
          <div className="border-2 border-[rgba(51,255,51,0.15)] bg-[rgba(0,0,0,0.3)] mb-6 [box-shadow:0_0_16px_rgba(51,255,51,0.04),inset_0_0_16px_rgba(0,0,0,0.3)]">
            {/* Title bar */}
            <div className="bg-[rgba(51,255,51,0.06)] border-b border-[rgba(51,255,51,0.1)] px-3 py-1.5 flex items-center gap-2 text-[9px] text-muted">
              <span className="w-2 h-2 rounded-full bg-accent [box-shadow:0_0_4px_#ffaa00] inline-block" />
              <span className="w-2 h-2 rounded-full bg-[rgba(51,255,51,0.2)]" />
              <span className="w-2 h-2 rounded-full bg-[rgba(51,255,51,0.2)]" />
              <span className="flex-1 text-center">live_stats.sh — {product.name}</span>
            </div>
            {/* Stats content */}
            <div className="p-3">
              <ProductMetricsPanel metrics={metrics} locale={locale} />
            </div>
          </div>
        )}

        {/* Releases */}
        {releases.length > 0 && (
          <div className="mb-6">
            <ProductReleaseList releases={releases} locale={locale} activity={metrics?.activity} repoReleasesUrl={repoReleasesUrl} />
          </div>
        )}

        {/* Description */}
        <h2 className="text-xs font-bold text-accent mb-1.5">{t("about")}</h2>
        <div className="mb-6 border border-[rgba(51,255,51,0.08)] px-4 py-3.5">
          <p className="text-[11px] text-muted leading-relaxed m-0">{product.description}</p>
        </div>

        {/* Features */}
        {product.features.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold text-accent mb-2">{t("features")}</h2>
            <div className="grid grid-cols-2 gap-2">
              {product.features.map((f, i) => (
                <div key={i} className="border border-[rgba(51,255,51,0.08)] px-3 py-2 text-[10px] text-muted-dim flex items-start gap-1.5">
                  <span className="text-accent shrink-0">▸</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        <div className="mb-6">
          <h2 className="text-xs font-bold text-accent mb-2">{t("techStack")}</h2>
          <div className="flex flex-wrap gap-1.5">
            {product.technologies.map((tech) => (
              <span key={tech} className="border border-[rgba(51,255,51,0.1)] px-2.5 py-1 text-[10px] text-muted font-['Courier_New']">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-2.5">
          {product.url && (
            <a href={product.url} target="_blank" rel="noopener noreferrer" className="no-underline">
              <button className="btn-gold">
                [ {t("install")} ]
              </button>
            </a>
          )}
          {product.repoUrl && (
            <a href={product.repoUrl} target="_blank" rel="noopener noreferrer" className="no-underline">
              <button className="bg-transparent border-2 border-[rgba(51,255,51,0.2)] rounded px-5 py-2 font-['Courier_New'] text-[11px] font-bold text-fg cursor-pointer">
                [ {t("viewOnGitHub")} ]
              </button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
