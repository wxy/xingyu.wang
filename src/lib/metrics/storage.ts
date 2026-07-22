import { list, put } from "@vercel/blob";
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

// Cache blob URLs from write operations to skip list() on reads
const urlCache = new Map<string, string>();

function hasBlobToken(): boolean {
  // Vercel Blob: OIDC via BLOB_STORE_ID, or legacy token, or Vercel env
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
    // Use cached URL from previous write if available (0 Advanced Requests)
    let url = urlCache.get(pathname);

    if (!url) {
      // Fallback to list() — 1 Advanced Request
      const { blobs } = await list({ prefix: pathname, limit: 1 });
      const blob = blobs.find((b) => b.pathname === pathname);
      if (!blob?.url) return null;
      url = blob.url;
      urlCache.set(pathname, url);
    }

    // For private blobs, use the REST API with x-api-key header
    const cleanPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
    const storeId = process.env.BLOB_STORE_ID || "";
    const apiUrl = storeId
      ? `https://${storeId}.blob.vercel-storage.com/${cleanPath}`
      : url;
    const headers: Record<string, string> = {};
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      headers["x-api-key"] = process.env.BLOB_READ_WRITE_TOKEN;
    } else if (process.env.BLOB_STORE_ID) {
      headers["x-api-vercel-oidc-token"] = process.env.VERCEL_OIDC_TOKEN || "";
    }
    const res = await fetch(apiUrl, { headers, next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = (await res.json()) as T;
    setCache(cacheKey, data, BLOB_CACHE_TTL);
    return data;
  } catch {
    return null;
  }
}

async function writeBlobJson<T>(pathname: string, data: T): Promise<void> {
  if (!hasBlobToken()) { console.warn("[Blob] skipped write — no token"); return; }
  try {
    const blob = await put(pathname, JSON.stringify(data), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    urlCache.set(pathname, blob.url);
    console.log("[Blob] wrote", pathname);
  } catch (err) {
    console.error("[Blob] write failed", pathname, err);
  }
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
