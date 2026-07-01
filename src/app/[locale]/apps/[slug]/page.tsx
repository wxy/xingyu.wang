import { getProductBySlug, apps, localized } from "@/lib/products";
import type { Locale } from "@/lib/products";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export function generateStaticParams() {
  return apps.map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug, "app");
  if (!product) return { title: "Not Found" };
  return { title: product.name };
}

const badgeBase = "https://img.shields.io/github";

export default async function AppDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const t = await getTranslations("apps");
  const raw = getProductBySlug(slug, "app");
  if (!raw || raw.type !== "app") notFound();

  const product = localized(raw, locale as Locale);
  const owner = product.repoUrl?.split("/").slice(-2, -1)[0] || "";
  const repo = product.repoUrl?.split("/").pop() || "";

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <nav className="mb-8">
        <Link href="/apps" className="text-sm text-muted transition-colors hover:text-accent">
          {t("backToList")}
        </Link>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <div className="mb-4 flex items-center gap-4">
          {product.iconUrl ? (
            <img
              src={product.iconUrl}
              alt=""
              className="h-12 w-12 rounded-xl object-contain"
            />
          ) : (
            <span className="text-4xl">{product.icon}</span>
          )}
          <div>
            <h1 className="font-mono text-3xl font-bold">{product.name}</h1>
            <p className="text-lg text-muted">{product.tagline}</p>
          </div>
        </div>
        {/* Badges — only for public repos */}
        {product.repoUrl && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            <img
              src={`${badgeBase}/stars/${owner}/${repo}?style=for-the-badge&color=0d9488`}
              alt="Stars"
              className="h-7"
            />
            <img
              src={`${badgeBase}/license/${owner}/${repo}?style=for-the-badge&color=71717a`}
              alt="License"
              className="h-7"
            />
            <img
              src={`${badgeBase}/last-commit/${owner}/${repo}?style=for-the-badge&color=71717a`}
              alt="Last commit"
              className="h-7"
            />
          </div>
        )}
      </div>

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
              className="rounded-md bg-accent/10 px-3 py-1.5 text-sm text-accent"
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
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-accent/90"
          >
            {product.url}
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
