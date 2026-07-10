import { cache } from "react";
import {
  getAllProducts,
  getProductBySlug,
  getProductId,
  isMetricsEnabled,
  type Product,
  type ProductType,
} from "@/lib/products";
import { metricDelta } from "./activity";
import {
  fetchAllLiveReleases,
  fetchLiveProductMetrics,
  fetchLiveProductReleases,
} from "./fetch-product";
import {
  readActivityEvents,
  readLatestMetricsStore,
  readMetricsHistory,
  readProductSnapshot,
} from "./storage";
import type {
  ActivityEvent,
  MetricsHistory,
  ProductMetricsSnapshot,
} from "./types";
import { ACTIVITY_EVENTS_LIMIT, DETAIL_RELEASE_LIMIT } from "./types";

export { getProductId } from "@/lib/products";

export interface ProductMetricsView extends ProductMetricsSnapshot {
  deltas?: {
    stars7d?: number | null;
    users7d?: number | null;
  };
  history?: MetricsHistory;
}

const getCachedLiveMetrics = cache(
  async (productId: string): Promise<ProductMetricsSnapshot | null> => {
    const product = findProductById(productId);
    if (!product) return null;
    return fetchLiveProductMetrics(product, productId);
  },
);

function findProductById(productId: string): Product | undefined {
  return getAllProducts().find((p) => getProductId(p) === productId);
}

export async function getProductMetricsView(
  productId: string,
): Promise<ProductMetricsView | null> {
  const product = findProductById(productId);
  if (!product || !isMetricsEnabled(product)) return null;

  const [stored, history] = await Promise.all([
    readProductSnapshot(productId),
    readMetricsHistory(productId),
  ]);

  const snapshot = stored ?? (await getCachedLiveMetrics(productId));
  if (!snapshot) return null;

  return {
    ...snapshot,
    history: history ?? undefined,
    deltas: history
      ? {
          stars7d: metricDelta(history.points, "stars"),
          users7d: metricDelta(history.points, "users"),
        }
      : undefined,
  };
}

export async function getProductReleases(
  productId: string,
  limit = DETAIL_RELEASE_LIMIT,
): Promise<ActivityEvent[]> {
  const product = findProductById(productId);
  if (!product || !isMetricsEnabled(product)) return [];

  const allEvents = await getActivityFeed(ACTIVITY_EVENTS_LIMIT);
  const fromStore = allEvents.filter((e) => e.productId === productId);
  if (fromStore.length >= limit) return fromStore.slice(0, limit);

  const live = await fetchLiveProductReleases(product, productId, limit);
  const merged = new Map<string, ActivityEvent>();
  for (const event of [...fromStore, ...live]) merged.set(event.id, event);
  return [...merged.values()]
    .sort(
      (a, b) =>
        new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
    )
    .slice(0, limit);
}

export const getActivityFeed = cache(async (limit = ACTIVITY_EVENTS_LIMIT) => {
  const stored = await readActivityEvents();
  if (stored.length > 0) return stored.slice(0, limit);

  const products = getAllProducts().filter(isMetricsEnabled);
  return fetchAllLiveReleases(products, getProductId, 10).then((events) =>
    events.slice(0, limit),
  );
});

/**
 * Returns the most recent release per product (up to `limit` products).
 * Ensures diverse product representation in preview sections.
 */
export const getDiverseActivityFeed = cache(
  async (limit = 5): Promise<ActivityEvent[]> => {
    // Fetch more events than needed, then deduplicate by product.
    const all = await getActivityFeed(ACTIVITY_EVENTS_LIMIT);
    const seen = new Set<string>();
    const result: ActivityEvent[] = [];

    for (const event of all) {
      if (seen.has(event.productId)) continue;
      seen.add(event.productId);
      result.push(event);
      if (result.length >= limit) break;
    }

    return result;
  },
);

export async function getLatestMetricsForProducts(): Promise<
  Record<string, ProductMetricsSnapshot>
> {
  const store = await readLatestMetricsStore();
  if (store?.products && Object.keys(store.products).length > 0) {
    return store.products;
  }

  const products = getAllProducts().filter(isMetricsEnabled);
  const entries = await Promise.all(
    products.map(async (product) => {
      try {
        const id = getProductId(product);
        const metrics = await getCachedLiveMetrics(id);
        return metrics ? ([id, metrics] as const) : null;
      } catch {
        return null;
      }
    }),
  );

  return Object.fromEntries(entries.filter(Boolean) as [string, ProductMetricsSnapshot][]);
}

export function resolveProductFromId(productId: string): Product | undefined {
  return findProductById(productId);
}

export function filterActivityFeed(
  events: ActivityEvent[],
  filter?: { type?: ProductType; productId?: string },
): ActivityEvent[] {
  if (!filter?.type && !filter?.productId) return events;

  return events.filter((event) => {
    const product = resolveProductFromId(event.productId);
    if (!product) return false;
    if (filter.productId && event.productId !== filter.productId) return false;
    if (filter.type && product.type !== filter.type) return false;
    return true;
  });
}

export async function getMetricsForProductSlug(
  slug: string,
  type: ProductType,
): Promise<ProductMetricsView | null> {
  const product = getProductBySlug(slug, type);
  if (!product) return null;
  return getProductMetricsView(getProductId(product));
}

export async function getReleasesForProductSlug(
  slug: string,
  type: ProductType,
  limit = DETAIL_RELEASE_LIMIT,
): Promise<ActivityEvent[]> {
  const product = getProductBySlug(slug, type);
  if (!product) return [];
  return getProductReleases(getProductId(product), limit);
}
