"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import type { Product } from "@/lib/products";

interface AboutPageProps {
  product: Product;
  backHref: string;
  contactEmail: string;
}

const TECH_LABELS: Record<string, string> = {
  "chrome": "Chrome Extension",
  "macos": "macOS App",
  "android": "Android App",
};

export function AboutPage({ product, backHref, contactEmail }: AboutPageProps) {
  const t = useTranslations("productPage");
  const platformLabel = TECH_LABELS[product.platform ?? ""] ?? "";

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Back link */}
      <nav className="mb-8">
        <Link href={backHref} className="text-sm text-muted transition-colors hover:text-accent">
          {t("backToProduct", { product: product.name })}
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
            <h1 className="font-mono text-3xl font-bold">
              {t("aboutTitle", { product: product.name })}
            </h1>
            {platformLabel && (
              <p className="text-sm text-muted">{platformLabel}</p>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-12">
        <h2 className="mb-3 text-lg font-semibold">
          {t("aboutTitle", { product: product.name })}
        </h2>
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

      {/* Open Source */}
      <div className="mb-12 card p-6">
        <h2 className="mb-3 text-lg font-semibold">{t("openSource")}</h2>
        <p className="mb-3 text-sm text-muted">
          {t("licenseLabel", { license: product.license ?? "Unknown" })}
        </p>
        {product.repoUrl && (
          <a
            href={product.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 text-sm font-medium text-fg transition-all hover:border-accent hover:text-accent"
          >
            {t("viewSource")}
          </a>
        )}
      </div>

      {/* Support */}
      <div className="card p-6">
        <h2 className="mb-3 text-lg font-semibold">{t("support")}</h2>
        <p className="text-sm text-muted">
          {t("supportContact")}{" "}
          <a href={`mailto:${contactEmail}`} className="text-accent hover:opacity-80">
            {contactEmail}
          </a>
        </p>
      </div>
    </div>
  );
}
