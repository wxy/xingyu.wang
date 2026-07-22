import { NextResponse } from "next/server";
import { readMetricsHistory } from "@/lib/metrics/storage";
export const runtime = "nodejs";
export async function GET() {
  const h = await readMetricsHistory("extension:hitable");
  return NextResponse.json({ points: h?.points?.length ?? 0, dates: h?.points?.map(p => p.date) ?? [] });
}
