import { NextResponse } from "next/server";
import { readMetricsHistory } from "@/lib/metrics/storage";

export const runtime = "nodejs";

export async function GET() {
  const history = await readMetricsHistory("extension:hitable");
  return NextResponse.json({
    points: history?.points?.length ?? 0,
    dates: history?.points?.map((p) => p.date) ?? [],
    users: history?.points?.map((p) => ({ date: p.date, users: p.users })) ?? [],
  });
}
