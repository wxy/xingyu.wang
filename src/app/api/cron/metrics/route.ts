import { NextResponse } from "next/server";
import { getAllProducts, getProductId, isMetricsEnabled } from "@/lib/products";
import { mergeActivityEvents } from "@/lib/metrics/activity";
import {
  fetchLiveProductMetrics,
  fetchLiveProductReleases,
} from "@/lib/metrics/fetch-product";
import {
  appendHistoryPoint,
  persistActivityEvents,
  persistMetricsSnapshot,
  readActivityEvents,
  readMetricsHistory,
} from "@/lib/metrics/storage";
import { ACTIVITY_EVENTS_LIMIT } from "@/lib/metrics/types";

export const runtime = "nodejs";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // dev mode: no secret configured, allow access
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = getAllProducts().filter(isMetricsEnabled);
  const today = new Date().toISOString().slice(0, 10);
  const allEvents = await readActivityEvents();

  let incomingEvents = [...allEvents];

  for (const product of products) {
    const productId = getProductId(product);
    const snapshot = await fetchLiveProductMetrics(product, productId);
    if (!snapshot) continue;

    const history = appendHistoryPoint(
      await readMetricsHistory(productId),
      productId,
      {
        date: today,
        stars: snapshot.github?.stars,
        users: snapshot.chromeStore?.users,
        openIssues: snapshot.github?.openIssues,
      },
    );

    await persistMetricsSnapshot(snapshot, history);

    const releases = await fetchLiveProductReleases(product, productId, 10);
    incomingEvents = mergeActivityEvents(incomingEvents, releases);
  }

  await persistActivityEvents(incomingEvents.slice(0, ACTIVITY_EVENTS_LIMIT));

  return NextResponse.json({
    ok: true,
    products: products.length,
    events: Math.min(incomingEvents.length, ACTIVITY_EVENTS_LIMIT),
    at: new Date().toISOString(),
  });
}
