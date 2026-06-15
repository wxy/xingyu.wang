import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 px-6 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="font-mono text-xs text-muted">
          &copy; {new Date().getFullYear()} Xingyu Wang. {t("allRightsReserved")}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted">
          <a
            href="https://github.com/wxy"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent/80"
          >
            GitHub
          </a>
          <a
            href="mailto:xingyu.wang@gmail.com"
            className="transition-colors hover:text-accent-warm"
          >
            xingyu.wang@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
