/**
 * Simple in-memory TTL cache for GitHub API responses.
 * Avoids exhausting rate limits when Next.js fetch cache isn't available (dev mode)
 * and reduces API calls even with a GITHUB_TOKEN.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function getCached<T>(key: string): T | undefined {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.data;
}

export function setCache<T>(key: string, data: T, ttlMs = DEFAULT_TTL_MS): void {
  store.set(key, { data, expiresAt: Date.now() + ttlMs });
}

/** Build a cache key from a function name and its arguments. */
export function cacheKey(fn: string, ...args: string[]): string {
  return `gh:${fn}:${args.join(":")}`;
}
