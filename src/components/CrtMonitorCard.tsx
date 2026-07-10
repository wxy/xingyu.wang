"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";

interface Props {
  product: Product;
  href: string;
  mon: string;
  status?: "rec" | "idle" | "standby";
  stats?: { commits?: number; prs?: number; release?: string; activity?: string };
}

export function CrtMonitorCard({ product, href, mon, status, stats }: Props) {
  // Derive monitor status from project activity level
  const activityLevel = stats?.activity;
  const derivedStatus = activityLevel === "Active" ? "rec"
    : activityLevel === "Maintained" ? "idle"
    : "standby";
  const actualStatus = status ?? derivedStatus;

  const dot =
    actualStatus === "rec"
      ? { color: "#ffaa00", label: "● REC", bg: "#ffaa00" }
      : actualStatus === "idle"
        ? { color: "#33ff3366", label: "● IDLE", bg: "#666" }
        : { color: "#666", label: "● STBY", bg: "#666" };

  return (
    <Link
      href={href}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          background:
            "linear-gradient(180deg, #f5f0e8 0%, #e8e0d0 8%, #ddd5c0 20%, #e0d8c5 40%, #d5ccb5 70%, #e5ddd0 90%, #f0ead8 100%)",
          borderRadius: 16,
          padding: "12px 12px 16px 12px",
          boxShadow:
            "0 6px 24px rgba(0,0,0,0.5), inset 0 2px 3px rgba(255,255,255,0.4), inset 0 -2px 3px rgba(0,0,0,0.12), 0 0 0 2px #1a1a1a, 0 0 0 4px #2a2a2a",
          width: 220,
          transition: "transform 0.15s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Ventilation slots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 5,
            marginBottom: 6,
          }}
        >
          <div style={{ width: 14, height: 2, background: "#8a8070", borderRadius: 1 }} />
          <div style={{ width: 14, height: 2, background: "#8a8070", borderRadius: 1 }} />
          <div style={{ width: 14, height: 2, background: "#8a8070", borderRadius: 1 }} />
          <div style={{ width: 14, height: 2, background: "#8a8070", borderRadius: 1 }} />
          <div style={{ width: 14, height: 2, background: "#8a8070", borderRadius: 1 }} />
        </div>

        {/* Screen */}
        <div
          style={{
            background: "#1a1a1a",
            borderRadius: 9,
            padding: 3,
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          <div
            style={{
              background:
                "radial-gradient(ellipse at 40% 30%, #0d200d 0%, #050d05 100%)",
              borderRadius: 7,
              padding: "12px 14px",
              border: "1px solid #33ff3310",
              boxShadow: "inset 0 0 40px rgba(0,0,0,0.5)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Scanlines */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,20,0,0.05) 2px, rgba(0,20,0,0.05) 4px)",
                pointerEvents: "none",
                zIndex: 2,
              }}
            />
            {/* Screen glare */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at 35% 25%, rgba(51,255,51,0.04) 0%, transparent 55%)",
                pointerEvents: "none",
                zIndex: 3,
              }}
            />

            {/* Content */}
            <div style={{ position: "relative", zIndex: 1 }}>
              {/* Header row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                  fontSize: 8,
                }}
              >
                <span style={{ color: "#33ff3333" }}>MON-{mon}</span>
                <span style={{ color: dot.color, fontSize: 7 }}>{dot.label}</span>
              </div>

              {/* Product name + icon */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                {product.iconUrl ? (
                  <img
                    src={product.iconUrl}
                    alt=""
                    style={{ width: 18, height: 18, borderRadius: 3, objectFit: "contain" }}
                  />
                ) : (
                  <span style={{ fontSize: 18 }}>{product.icon}</span>
                )}
                <div>
                  <div
                    style={{
                      color: "#33ff33",
                      fontSize: 13,
                      fontWeight: "bold",
                      textShadow: "0 0 6px #33ff3344",
                    }}
                  >
                    {product.name}
                  </div>
                  <div style={{ color: "#33ff3355", fontSize: 8, marginTop: 1 }}>
                    {product.tagline.length > 40
                      ? product.tagline.slice(0, 40) + "…"
                      : product.tagline}
                  </div>
                </div>
              </div>

              {/* Stats row */}
              {stats && (
                <>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      fontSize: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    {stats.commits != null && (
                      <span style={{ color: "#33ff3377" }}>{stats.commits} commits</span>
                    )}
                    {stats.prs != null && (
                      <span style={{ color: "#33ff3377" }}>{stats.prs} PRs</span>
                    )}
                    {stats.release && (
                      <span style={{ color: "#ffaa00" }}>{stats.release}</span>
                    )}
                  </div>
                  {/* Activity label — always on its own line */}
                  {stats.activity && (
                    <div style={{ fontSize: 8, marginTop: 4 }}>
                      <span
                        style={{
                          color: stats.activity === "Active" ? "#33ff33" : "#666",
                          textShadow: stats.activity === "Active" ? "0 0 4px #33ff3366" : undefined,
                        }}
                      >
                        ● {stats.activity}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* LED indicator */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 7,
          }}
        >
          <span
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: dot.bg,
              boxShadow: status === "rec" ? "0 0 5px #ffaa00" : undefined,
              display: "inline-block",
            }}
          />
        </div>
      </div>
    </Link>
  );
}
