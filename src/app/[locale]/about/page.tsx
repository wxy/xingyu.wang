import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div style={{ background: "#0a0a06", minHeight: "100vh", padding: "32px 24px", fontFamily: "'Courier New', monospace" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        {/* Title — outside box */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 14, fontWeight: "bold", color: "#ffaa00", textShadow: "0 0 6px rgba(255,170,0,0.3)" }}>
            ═══ {t("title").toUpperCase()} ═══
          </span>
        </div>
        <div style={{
          border: "4px double #ffaa00",
          padding: "20px 32px",
          boxShadow: "0 0 20px rgba(255,170,0,0.08), inset 0 0 20px rgba(255,170,0,0.04)",
        }}>

          <div style={{ fontSize: 11, color: "rgba(51,255,51,0.5)", lineHeight: 1.8 }}>
            <p>{t("content.p1")}</p>
            <p>{t("content.p2")}</p>
            <p>{t("content.p3")}</p>
            <p>{t("content.p4")}</p>
          </div>

          <div style={{ marginTop: 20, borderTop: "1px solid rgba(51,255,51,0.08)", paddingTop: 16 }}>
            <div style={{ fontSize: 11, color: "#ffaa00", marginBottom: 8 }}>{t("contact")}</div>
            <div style={{ fontSize: 10, color: "rgba(51,255,51,0.4)" }}>
              <a href="https://github.com/wxy" target="_blank" rel="noopener noreferrer" style={{ color: "#33ff33" }}>[GitHub]</a>{" "}
              <a href="mailto:xingyu.wang@gmail.com" style={{ color: "#33ff33" }}>[xingyu.wang@gmail.com]</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
