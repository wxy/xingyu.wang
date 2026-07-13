import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="min-h-screen py-8 px-6 font-['Courier_New']">
      <div className="max-w-[700px] mx-auto">
        {/* Title — outside box */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-sm font-bold text-accent [text-shadow:0_0_6px_rgba(255,170,0,0.3)]">
            ═══ {t("title").toUpperCase()} ═══
          </span>
        </div>
        <div className="section-frame">

          <div className="text-[11px] text-muted-dim leading-relaxed">
            <p>{t("content.p1")}</p>
            <p>{t("content.p2")}</p>
            <p>{t("content.p3")}</p>
            <p>{t("content.p4")}</p>
          </div>

          <div className="mt-5 border-t border-[rgba(51,255,51,0.08)] pt-4">
            <div className="text-[11px] text-accent mb-2">{t("contact")}</div>
            <div className="text-[10px] text-muted-dim">
              <a href="https://github.com/wxy" target="_blank" rel="noopener noreferrer" className="text-fg">[GitHub]</a>{" "}
              <a href="mailto:xingyu.wang@gmail.com" className="text-fg">[xingyu.wang@gmail.com]</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
