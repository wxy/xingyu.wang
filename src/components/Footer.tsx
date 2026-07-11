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
        <p style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "rgba(51,255,51,0.5)", margin: 0 }}>
          &copy; {new Date().getFullYear()} Xingyu Wang. {t("allRightsReserved")}
          {" · "}
          <span style={{ color: "rgba(51,255,51,0.5)", fontSize: 9 }}>
            {(() => {
              const sha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;
              const t = process.env.NEXT_PUBLIC_BUILD_TIME;
              if (!sha && !t) return null;
              const parts = [];
              if (sha) parts.push(`build ${sha.slice(0, 7)}`);
              if (t) {
                const d = new Date(parseInt(t) * 1000);
                parts.push(d.toISOString().slice(0, 16).replace("T", " "));
              }
              return parts.join(" · ");
            })()}
          </span>
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 10 }}>
          <Link href="/activity" style={{ color: "rgba(51,255,51,0.5)", textDecoration: "none", fontFamily: "'Courier New', monospace" }}>
            [{n("activity")}]
          </Link>
          <a href="https://github.com/wxy" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(51,255,51,0.5)", textDecoration: "none", fontFamily: "'Courier New', monospace" }}>
            [GitHub]
          </a>
          <a href="mailto:xingyu.wang@gmail.com" style={{ color: "rgba(51,255,51,0.5)", textDecoration: "none", fontFamily: "'Courier New', monospace" }}>
            [xingyu.wang@gmail.com]
          </a>
        </div>
      </div>
    </footer>
  );
}
