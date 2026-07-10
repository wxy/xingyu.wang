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
    <div className="mx-auto max-w-4xl px-6 py-16">
      <nav className="mb-8">
        <Link href="/extensions" className="text-sm text-muted transition-colors hover:text-accent">
          {t("backToList")}
        </Link>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-4">
          {product.iconUrl ? (
            <img
              src={product.iconUrl}
              alt=""
              className="h-14 w-14 rounded-xl object-contain"
            />
          ) : (
            <span className="text-4xl">{product.icon}</span>
          )}
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-lg text-muted">{product.tagline}</p>
          </div>
        </div>

      </div>

      <ProductMetricsSection
        product={raw}
        slug={slug}
        type="extension"
        locale={locale}
      />

      {/* Description */}
      <div className="mb-12">
        <h2 className="mb-3 text-lg font-semibold">{t("about")}</h2>
        <p className="max-w-2xl leading-relaxed text-muted">
          {product.description}
        </p>
      </div>

      {/* Features */}
      {product.features.length > 0 && (
        <div className="mb-12">
          <h2 className="mb-4 text-lg font-semibold">{t("features")}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {product.features.map((feature, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg border border-border p-4"
              >
                <span className="mt-0.5 flex-shrink-0 text-accent">▹</span>
                <span className="text-sm leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tech Stack */}
      <div className="mb-12">
        <h2 className="mb-3 text-lg font-semibold">{t("techStack")}</h2>
        <div className="flex flex-wrap gap-2">
          {product.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-accent-light px-3 py-1.5 text-sm font-medium text-accent-strong"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-3">
        {product.url && (
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-strong"
          >
            {t("install")}
          </a>
        )}
        {product.repoUrl && (
          <a
            href={product.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 text-sm font-medium text-fg transition-all hover:border-accent hover:text-accent"
          >
            {t("viewOnGitHub")}
          </a>
        )}
      </div>
    </div>
  );
}
