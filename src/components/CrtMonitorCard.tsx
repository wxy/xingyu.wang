"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";

interface Props {
  product: Product;
  href: string;
  mon: string;
  status?: "rec" | "idle" | "standby";
  stats?: { commits?: number; prs?: number; release?: string; activity?: string; rawActivity?: string };
}

export function CrtMonitorCard({ product, href, mon, status, stats }: Props) {
  const raw = stats?.rawActivity;
  const derivedStatus = raw === "active" ? "rec"
    : raw === "maintained" ? "idle"
    : "standby";
  const actualStatus = status ?? derivedStatus;

  const dot =
    actualStatus === "rec"
      ? { color: "#ffaa00", label: "● REC", bg: "#ffaa00" }
      : actualStatus === "idle"
        ? { color: "rgba(51,255,51,0.4)", label: "● IDLE", bg: "rgba(51,255,51,0.4)" }
        : { color: "#666", label: "● STBY", bg: "#666" };

  return (
    <Link href={href} className="no-underline block">
      <div className="crt-monitor-shell">
        {/* Ventilation slots */}
        <div className="flex justify-center gap-[5px] mb-1.5">
          <div className="w-3.5 h-0.5 bg-[#8a8070] rounded-sm" />
          <div className="w-3.5 h-0.5 bg-[#8a8070] rounded-sm" />
          <div className="w-3.5 h-0.5 bg-[#8a8070] rounded-sm" />
          <div className="w-3.5 h-0.5 bg-[#8a8070] rounded-sm" />
          <div className="w-3.5 h-0.5 bg-[#8a8070] rounded-sm" />
        </div>

        {/* Screen */}
        <div className="bg-[#1a1a1a] rounded-[9px] p-[3px] [box-shadow:inset_0_2px_8px_rgba(0,0,0,0.8)]">
          <div className="crt-screen-inner px-3.5 py-3">
            {/* Content */}
            <div className="relative z-[1]">
              {/* Header row */}
              <div className="flex justify-between mb-1.5 text-[8px]">
                <span className="text-[rgba(51,255,51,0.2)]">MON-{mon}</span>
                <span style={{ color: dot.color }} className="text-[7px]">{dot.label}</span>
              </div>

              {/* Product name + icon */}
              <div className="flex gap-2 items-center mb-2">
                {product.iconUrl ? (
                  <img
                    src={product.iconUrl}
                    alt=""
                    className="w-[18px] h-[18px] rounded-[3px] object-contain"
                  />
                ) : (
                  <span className="text-lg">{product.icon}</span>
                )}
                <div>
                  <div className="heading-glow text-[13px]">
                    {product.name}
                  </div>
                  <div className="text-muted-dim text-[8px] mt-0.5 leading-relaxed min-h-9 overflow-hidden">
                    {product.tagline.length > 100
                      ? product.tagline.slice(0, 100) + "…"
                      : product.tagline}
                  </div>
                </div>
              </div>

              {/* Stats + Activity on one line */}
              <div className="flex gap-2 text-[8px] flex-wrap min-h-3 items-center">
                {stats?.commits != null && <span className="text-[rgba(51,255,51,0.47)]">{stats.commits} commits</span>}
                {stats?.prs != null && <span className="text-[rgba(51,255,51,0.47)]">{stats.prs} PRs</span>}
                {stats?.release && <span className="text-accent">{stats.release}</span>}
                {raw && (
                  <span
                    style={{
                      color: raw === "active" ? "#33ff33" : raw === "maintained" ? "rgba(51,255,51,0.5)" : "#666",
                      textShadow: raw === "active" ? "0 0 4px rgba(51,255,51,0.4)" : undefined,
                    }}
                  >
                    ● {raw.charAt(0).toUpperCase() + raw.slice(1)}
                  </span>
                )}
                {!stats?.commits && !stats?.prs && !stats?.release && !stats?.activity && (
                  <span className="text-transparent">—</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* LED indicator */}
        <div className="flex justify-center mt-[7px]">
          <span
            className="w-1 h-1 rounded-full inline-block"
            style={{
              background: dot.bg,
              boxShadow: actualStatus === "rec" ? "0 0 5px #ffaa00" : undefined,
            }}
          />
        </div>
      </div>
    </Link>
  );
}
