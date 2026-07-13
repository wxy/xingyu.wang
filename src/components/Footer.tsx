import Link from "next/link";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const n = useTranslations("nav");

  return (
    <footer className="border-t-[3px] border-[#3a3a2a] bg-[rgba(10,10,6,0.9)]">
      <div className="mx-auto max-w-[1024px] flex flex-col items-center gap-1.5 px-6 py-4 text-center">
        <p className="font-['Courier_New'] text-[10px] text-muted-dim m-0">
          &copy; {new Date().getFullYear()} Xingyu Wang. {t("allRightsReserved")}
        </p>
        <div className="flex items-center gap-4 text-[10px]">
          <Link href="/activity" className="text-muted-dim no-underline font-['Courier_New']">
            [{n("activity")}]
          </Link>
          <a href="https://github.com/wxy" target="_blank" rel="noopener noreferrer" className="text-muted-dim no-underline font-['Courier_New']">
            [GitHub]
          </a>
          <a href="mailto:xingyu.wang@gmail.com" className="text-muted-dim no-underline font-['Courier_New']">
            [xingyu.wang@gmail.com]
          </a>
        </div>
      </div>
    </footer>
  );
}
