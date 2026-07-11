"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";

const BTN_BASE: React.CSSProperties = {
  background:
    "linear-gradient(180deg, #e8c878 0%, #c89840 25%, #d4a850 50%, #b88830 75%, #c09838 100%)",
  border: "none",
  borderRadius: 5,
  padding: "7px",
  fontFamily: "'Courier New', monospace",
  fontSize: 11,
  fontWeight: "bold",
  whiteSpace: "nowrap",
  letterSpacing: 2,
  color: "#1a1a08",
  textShadow: "0 1px 0 rgba(255,255,200,0.3)",
  boxShadow:
    "0 3px 0 #7a6020, 0 4px 8px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,200,0.35), inset 0 -1px 3px rgba(0,0,0,0.2)",
  cursor: "pointer",
  transition: "all 0.08s",
};

const BTN_ACTIVE: React.CSSProperties = {
  background:
    "linear-gradient(180deg, #888 0%, #666 30%, #555 60%, #777 100%)",
  border: "2px solid #ffaa00",
  borderRadius: 5,
  padding: "7px",
  fontFamily: "'Courier New', monospace",
  fontSize: 11,
  fontWeight: "bold",
  letterSpacing: 2,
  color: "#ffaa00",
  textShadow: "0 0 12px rgba(255,170,0,0.5)",
  boxShadow:
    "0 1px 0 #333, 0 2px 4px rgba(0,0,0,0.4), inset 0 3px 6px rgba(0,0,0,0.5), 0 0 10px rgba(255,170,0,0.2)",
  cursor: "pointer",
  transition: "all 0.08s",
};

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
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "3px solid #3a3a2a",
        background: "rgba(10, 10, 6, 0.9)",
        backdropFilter: "blur(8px)",
      }}
    >
      <nav
        style={{
          margin: "0 auto",
          maxWidth: 1024,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
          padding: "10px 24px",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: 12,
            fontWeight: "bold",
            whiteSpace: "nowrap",
            flexShrink: 0,
            color: "#33ff33",
            textShadow: "0 0 8px rgba(51,255,51,0.15)",
            letterSpacing: 1,
            textDecoration: "none",
          }}
        >
          {locale === "zh" ? "硬核老王" : "xingyu.wang"}
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
          {links.map(({ href, label }) => {
            // Strip locale prefix: /en/xxx → /xxx, /en → /
            let pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
            if (!pathWithoutLocale.startsWith("/")) pathWithoutLocale = "/" + pathWithoutLocale;
            const isActive =
              href === "/"
                ? pathWithoutLocale === "/"
                : pathWithoutLocale.startsWith(href);

            return (
              <Link key={href} href={href} style={{ textDecoration: "none" }}>
                <button style={isActive ? BTN_ACTIVE : BTN_BASE}>
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
