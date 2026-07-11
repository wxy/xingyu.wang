import { list, put } from "@vercel/blob";
import type {
  ActivityEvent,
  LatestMetricsStore,
  MetricsHistory,
  MetricsHistoryPoint,
  ProductMetricsSnapshot,
} from "./types";
import { ACTIVITY_EVENTS_LIMIT, METRICS_HISTORY_DAYS } from "./types";

const LATEST_BLOB = "metrics/latest.json";
const EVENTS_BLOB = "activity/events.json";
const HISTORY_PREFIX = "metrics/history/";

function hasBlobToken(): boolean {
  // Vercel Blob: OIDC auto-auth in production, or legacy token
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL, // OIDC on Vercel
  );
}

async function readBlobJson<T>(pathname: string): Promise<T | null> {
  if (!hasBlobToken()) return null;

  try {
    const { blobs } = await list({ prefix: pathname, limit: 1 });
    const blob = blobs.find((b) => b.pathname === pathname);
    if (!blob?.url) return null;

    const res = await fetch(blob.url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function writeBlobJson<T>(pathname: string, data: T): Promise<void> {
  if (!hasBlobToken()) return;
  await put(pathname, JSON.stringify(data), {
    access: "public",
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
