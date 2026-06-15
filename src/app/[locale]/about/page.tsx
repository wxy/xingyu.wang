import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-16">
        <h1 className="mb-8 font-mono text-3xl font-bold">{t("title")}</h1>
        <div className="max-w-2xl space-y-4 leading-relaxed text-muted">
          <p>{t("content.p1")}</p>
          <p>{t("content.p2")}</p>
          <p>{t("content.p3")}</p>
          <p>{t("content.p4")}</p>
        </div>
      </div>

      {/* Contact */}
      <div className="card p-8">
        <h2 className="mb-4 font-mono text-lg font-semibold tracking-tight">
          {t("contact")}
        </h2>
        <div className="space-y-2 text-sm text-muted">
          <p>
            {t("emailLabel")}:{" "}
            <a
              href="mailto:xingyu.wang@gmail.com"
              className="text-accent hover:opacity-80"
            >
              xingyu.wang@gmail.com
            </a>
          </p>
          <p>
            {t("githubLabel")}:{" "}
            <a
              href="https://github.com/wxy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:opacity-80"
            >
              @wxy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
