import type { Product } from "@/lib/products";
import { isMetricsEnabled } from "@/lib/products";
import {
  fetchChromeStoreRating,
  fetchChromeStoreUsers,
} from "./chrome-store";
import {
  fetchCommitsLast30d,
  fetchGitHubReleases,
  fetchGitHubRepoInfo,
  fetchMergedPRsLast30d,
  releaseToActivityEvent,
} from "./github";
import { snapshotFromGitHub } from "./activity";
import type { ActivityEvent, ProductMetricsSnapshot } from "./types";
import { DETAIL_RELEASE_LIMIT } from "./types";

export async function fetchLiveProductMetrics(
  product: Product,
  productId: string,
): Promise<ProductMetricsSnapshot | null> {
  if (!isMetricsEnabled(product) || !product.repoUrl) return null;

  try {
    const [repoInfo, commitsLast30d, mergedPRsLast30d, releases] =
      await Promise.all([
        fetchGitHubRepoInfo(product.repoUrl),
        fetchCommitsLast30d(product.repoUrl),
        fetchMergedPRsLast30d(product.repoUrl),
        fetchGitHubReleases(product.repoUrl, DETAIL_RELEASE_LIMIT),
      ]);

    if (!repoInfo) return null;

    let chromeStore: ProductMetricsSnapshot["chromeStore"];
    if (product.chromeStoreId) {
      const [users, rating] = await Promise.all([
        fetchChromeStoreUsers(product.chromeStoreId),
        fetchChromeStoreRating(product.chromeStoreId),
      ]);
      if (users != null) {
        chromeStore = { users, rating: rating ?? undefined };
      }
    }

    const latestRelease = releases[0];

    return snapshotFromGitHub(
      productId,
      {
        ...repoInfo,
        commitsLast30d,
        mergedPRsLast30d,
        latestRelease,
      },
      chromeStore,
    );
  } catch {
    return null;
  }
}

export async function fetchLiveProductReleases(
  product: Product,
  productId: string,
  limit = DETAIL_RELEASE_LIMIT,
): Promise<ActivityEvent[]> {
  if (!isMetricsEnabled(product) || !product.repoUrl) return [];

  const releases = await fetchGitHubReleases(product.repoUrl, limit);
  return releases.map((r) => releaseToActivityEvent(r, product, productId));
}

export async function fetchAllLiveReleases(
  products: Product[],
  getProductId: (p: Product) => string,
  limitPerProduct = 10,
): Promise<ActivityEvent[]> {
  const batches = await Promise.all(
    products
      .filter(isMetricsEnabled)
      .map(async (product) => {
        const productId = getProductId(product);
        return fetchLiveProductReleases(product, productId, limitPerProduct);
      }),
  );

  return batches
    .flat()
    .sort(
      (a, b) =>
        new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
    );
}
