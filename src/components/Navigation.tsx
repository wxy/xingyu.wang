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
    { href: "/activity", label: t("activity") },
    { href: "/about", label: t("about") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-[#3a3a2a] bg-[rgba(10,10,6,0.9)] backdrop-blur-lg">
      <nav className="mx-auto max-w-[1024px] flex items-center justify-between flex-wrap gap-2 px-6 py-2.5">
        <Link
          href="/"
          className="text-xs font-bold text-fg tracking-[1px] no-underline whitespace-nowrap shrink-0 [text-shadow:0_0_8px_rgba(51,255,51,0.4)]"
        >
          {locale === "zh" ? "硬核老王" : "xingyu.wang"}
        </Link>

        <div className="flex items-center gap-1 flex-wrap justify-center">
          {links.map(({ href, label }) => {
            let pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
            if (!pathWithoutLocale.startsWith("/")) pathWithoutLocale = "/" + pathWithoutLocale;
            const isActive =
              href === "/"
                ? pathWithoutLocale === "/"
                : pathWithoutLocale.startsWith(href);

            return (
              <Link key={href} href={href} className="no-underline">
                <button className={isActive ? "btn-gold-active" : "btn-gold"}>
                  {label}
                </button>
              </Link>
            );
          })}
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}
