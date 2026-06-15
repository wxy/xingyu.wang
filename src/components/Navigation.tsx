"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navigation({ locale }: { locale: string }) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const links = [
    { href: "/", label: t("home") },
    { href: "/extensions", label: t("extensions") },
    { href: "/apps", label: t("apps") },
    { href: "/about", label: t("about") },
  ];

  // Site name based on locale
  const siteName = locale === "zh" ? "硬核老王" : "xingyu.wang";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-fg transition-all hover:text-accent/80"
        >
          {siteName}
        </Link>
        <div className="flex items-center gap-4">
          <ul className="flex items-center gap-0.5">
            {links.map(({ href, label }) => {
              const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || "/";
              const hrefWithoutLocale = href;
              const isActive =
                hrefWithoutLocale === "/"
                  ? pathWithoutLocale === "/"
                  : pathWithoutLocale.startsWith(hrefWithoutLocale);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-accent/10 text-accent"
                        : "text-muted hover:text-fg hover:bg-subtle"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}
