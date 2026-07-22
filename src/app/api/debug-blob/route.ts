import { NextResponse } from "next/server";
import { readLatestMetricsStore, readMetricsHistory } from "@/lib/metrics/storage";

export const runtime = "nodejs";

export async function GET() {
  const latest = await readLatestMetricsStore();
  const history = await readMetricsHistory("extension:hitable");

  return NextResponse.json({
    hasLatest: !!latest,
    productCount: Object.keys(latest?.products ?? {}).length,
    hasHistory: !!history,
    historyPoints: history?.points?.length ?? 0,
    sampleUsers: history?.points?.slice(-3).map((p) => ({ date: p.date, users: p.users })),
  });
}
