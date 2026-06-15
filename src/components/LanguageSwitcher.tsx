"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  function toggle() {
    const nextLocale = locale === "en" ? "zh" : "en";
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      onClick={toggle}
      className="rounded-md border border-border px-2 py-1 text-xs font-medium text-muted transition-colors hover:border-accent/30 hover:text-accent"
      title={locale === "en" ? "切换到中文" : "Switch to English"}
    >
      {locale === "en" ? "中文" : "EN"}
    </button>
  );
}
