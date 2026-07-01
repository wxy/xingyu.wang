"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import type { Product, Locale } from "@/lib/products";
import { localized } from "@/lib/products";
import { BadgeImg } from "./BadgeImg";

const ghBadgeBase = "https://img.shields.io/github";
const cwsBadgeBase = "https://img.shields.io/chrome-web-store";

export function ProductCard({ product }: { product: Product }) {
  const locale = useLocale() as Locale;
  const p = localized(product, locale);

  const href =
    p.type === "extension"
      ? `/extensions/${p.slug}`
      : `/apps/${p.slug}`;

  const owner = p.repoUrl?.split("/").slice(-2, -1)[0] || "";
  const repo = p.repoUrl?.split("/").pop() || "";

  return (
    <Link
      href={href}
      className="group card flex flex-col p-5 transition-all hover:-translate-y-0.5"
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        {p.iconUrl ? (
          <img
            src={p.iconUrl}
            alt=""
            className="h-8 w-8 rounded-lg object-contain"
            loading="lazy"
          />
        ) : (
          <span className="text-2xl" role="img" aria-hidden>
            {p.icon}
          </span>
        )}
        <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted">
          {p.platform === "chrome" ? "Chrome" : p.platform === "macos" ? "macOS" : p.platform === "android" ? "Android" : p.type}
        </span>
      </div>

      <h3 className="mb-1 font-semibold text-fg group-hover:text-accent transition-colors">
        {p.name}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-muted line-clamp-2">
        {p.tagline}
      </p>

      {/* Badges */}
      <div className="mt-auto flex flex-wrap gap-1.5">
        {p.chromeStoreId && (
          <BadgeImg
            src={`${cwsBadgeBase}/users/${p.chromeStoreId}?style=flat&color=0d9488`}
            alt="Install count"
          />
        )}
        {p.repoUrl && (
          <>
            <BadgeImg
              src={`${ghBadgeBase}/stars/${owner}/${repo}?style=flat&color=0d9488`}
              alt="GitHub stars"
            />
            <BadgeImg
              src={`${ghBadgeBase}/last-commit/${owner}/${repo}?style=flat&color=71717a`}
              alt="Last commit"
            />
          </>
        )}
      </div>

      {/* Tech tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {p.technologies.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="rounded bg-accent-light px-2 py-0.5 text-[11px] font-medium text-accent-strong"
          >
            {tech}
          </span>
        ))}
      </div>
    </Link>
  );
}
