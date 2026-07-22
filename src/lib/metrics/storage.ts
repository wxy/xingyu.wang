import { get, put } from "@vercel/blob";
import type {
  ActivityEvent,
  LatestMetricsStore,
  MetricsHistory,
  MetricsHistoryPoint,
  ProductMetricsSnapshot,
} from "./types";
import { ACTIVITY_EVENTS_LIMIT, METRICS_HISTORY_DAYS } from "./types";
import { getCached, setCache } from "./cache";

const LATEST_BLOB = "metrics/latest.json";
const EVENTS_BLOB = "activity/events.json";
const HISTORY_PREFIX = "metrics/history/";
const BLOB_CACHE_TTL = 5 * 60 * 1000;

function hasBlobToken(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.BLOB_STORE_ID ||
      process.env.VERCEL,
  );
}

async function readBlobJson<T>(pathname: string): Promise<T | null> {
  if (!hasBlobToken()) return null;

  const cacheKey = `blob:${pathname}`;
  const cached = getCached<T>(cacheKey);
  if (cached !== undefined) return cached;

  try {
    // SDK auto-detects BLOB_READ_WRITE_TOKEN and BLOB_STORE_ID from env
    const result = await get(pathname, { access: "private" });

    if (!result || result.statusCode !== 200) return null;
    const text = await new Response(result.stream).text();
    const data = JSON.parse(text) as T;
    setCache(cacheKey, data, BLOB_CACHE_TTL);
    return data;
  } catch {
    return null;
  }
}

async function writeBlobJson<T>(pathname: string, data: T): Promise<void> {
  if (!hasBlobToken()) return;
  await put(pathname, JSON.stringify(data), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function readLatestMetricsStore(): Promise<LatestMetricsStore | null> {
  return readBlobJson<LatestMetricsStore>(LATEST_BLOB);
}

export async function readMetricsHistory(
  productId: string,
): Promise<MetricsHistory | null> {
  return readBlobJson<MetricsHistory>(`${HISTORY_PREFIX}${productId}.json`);
}

export async function readActivityEvents(): Promise<ActivityEvent[]> {
  const data = await readBlobJson<{ events: ActivityEvent[] }>(EVENTS_BLOB);
  return data?.events ?? [];
}

export function appendHistoryPoint(
  history: MetricsHistory | null,
  productId: string,
  point: MetricsHistoryPoint,
): MetricsHistory {
  const existing = history?.points ?? [];
  const withoutToday = existing.filter((p) => p.date !== point.date);
  const points = [...withoutToday, point]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-METRICS_HISTORY_DAYS);

  return { productId, points };
}

export async function persistMetricsSnapshot(
  snapshot: ProductMetricsSnapshot,
  history: MetricsHistory,
): Promise<void> {
  const store =
    (await readLatestMetricsStore()) ??
    ({ updatedAt: new Date().toISOString(), products: {} } satisfies LatestMetricsStore);

  store.products[snapshot.productId] = snapshot;
  store.updatedAt = new Date().toISOString();

  await writeBlobJson(LATEST_BLOB, store);
  await writeBlobJson(`${HISTORY_PREFIX}${snapshot.productId}.json`, history);
}

export async function persistActivityEvents(events: ActivityEvent[]): Promise<void> {
  await writeBlobJson(EVENTS_BLOB, {
    updatedAt: new Date().toISOString(),
    events: events.slice(0, ACTIVITY_EVENTS_LIMIT),
  });
}

export async function readProductSnapshot(
  productId: string,
): Promise<ProductMetricsSnapshot | null> {
  const store = await readLatestMetricsStore();
  return store?.products[productId] ?? null;
}
