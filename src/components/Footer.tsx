import Link from "next/link";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const n = useTranslations("nav");

  return (
    <footer style={{ borderTop: "3px solid #3a3a2a", background: "rgba(10,10,6,0.9)" }}>
      <div style={{
        margin: "0 auto",
        maxWidth: 1024,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        padding: "16px 24px",
        textAlign: "center",
      }}>
        <p style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "rgba(51,255,51,0.3)", margin: 0 }}>
          &copy; {new Date().getFullYear()} Xingyu Wang. {t("allRightsReserved")}
          {" · "}
          <span style={{ color: "rgba(51,255,51,0.15)", fontSize: 9 }}>
            {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
              ? `build ${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA.slice(0, 7)}`
              : ""}
          </span>
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 10 }}>
          <Link href="/activity" style={{ color: "rgba(51,255,51,0.35)", textDecoration: "none", fontFamily: "'Courier New', monospace" }}>
            [{n("activity")}]
          </Link>
          <a href="https://github.com/wxy" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(51,255,51,0.35)", textDecoration: "none", fontFamily: "'Courier New', monospace" }}>
            [GitHub]
          </a>
          <a href="mailto:xingyu.wang@gmail.com" style={{ color: "rgba(51,255,51,0.35)", textDecoration: "none", fontFamily: "'Courier New', monospace" }}>
            [xingyu.wang@gmail.com]
          </a>
        </div>
      </div>
    </footer>
  );
}
