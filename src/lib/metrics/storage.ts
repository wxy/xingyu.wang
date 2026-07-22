// Blob storage disabled — metrics are fetched live from GitHub API.
// History/sparklines not available without persistent storage.

import type {
  ActivityEvent,
  LatestMetricsStore,
  MetricsHistory,
  MetricsHistoryPoint,
  ProductMetricsSnapshot,
} from "./types";
import { METRICS_HISTORY_DAYS } from "./types";

export async function readLatestMetricsStore(): Promise<LatestMetricsStore | null> {
  return null;
}

export async function readMetricsHistory(
  _productId: string,
): Promise<MetricsHistory | null> {
  return null;
}

export async function readActivityEvents(): Promise<ActivityEvent[]> {
  return [];
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
  _snapshot: ProductMetricsSnapshot,
  _history: MetricsHistory,
): Promise<void> {
  // no-op: Blob disabled
}

export async function persistActivityEvents(_events: ActivityEvent[]): Promise<void> {
  // no-op: Blob disabled
}

export async function readProductSnapshot(
  _productId: string,
): Promise<ProductMetricsSnapshot | null> {
  return null;
}
