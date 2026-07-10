import type { ActivityLevel, ActivityEvent, ProductMetricsSnapshot } from "./types";
import type { GitHubRelease } from "./github";

const DAY_MS = 86_400_000;

export function computeActivityLevel(
  lastPushAt?: string,
  latestReleaseAt?: string,
): ActivityLevel {
  if (!lastPushAt && !latestReleaseAt) return "unknown";

  const now = Date.now();
  const pushAge = lastPushAt ? now - new Date(lastPushAt).getTime() : Infinity;
  const releaseAge = latestReleaseAt
    ? now - new Date(latestReleaseAt).getTime()
    : Infinity;
  const recent = Math.min(pushAge, releaseAge);

  if (recent <= 7 * DAY_MS) return "active";
  if (recent <= 30 * DAY_MS) return "maintained";
  return "quiet";
}

export function mergeActivityEvents(
  existing: ActivityEvent[],
  incoming: ActivityEvent[],
): ActivityEvent[] {
  const map = new Map<string, ActivityEvent>();
  for (const event of [...existing, ...incoming]) {
    map.set(event.id, event);
  }
  return [...map.values()].sort(
    (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  );
}

export function metricDelta(
  historyPoints: { date: string; stars?: number; users?: number }[],
  key: "stars" | "users",
  days = 7,
): number | null {
  if (historyPoints.length < 2) return null;

  const sorted = [...historyPoints].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted.at(-1);
  if (!latest) return null;

  const targetDate = new Date(latest.date);
  targetDate.setDate(targetDate.getDate() - days);
  const targetStr = targetDate.toISOString().slice(0, 10);

  const baseline =
    [...sorted].reverse().find((p) => p.date <= targetStr) ?? sorted[0];
  const current = latest[key];
  const base = baseline[key];
  if (current == null || base == null) return null;
  return current - base;
}

export function snapshotFromGitHub(
  productId: string,
  repoInfo: {
    stars: number;
    forks: number;
    openIssues: number;
    lastPushAt: string;
    commitsLast30d: number;
    mergedPRsLast30d: number;
    latestRelease?: GitHubRelease;
  },
  chromeStore?: ProductMetricsSnapshot["chromeStore"],
): ProductMetricsSnapshot {
  const latestRelease = repoInfo.latestRelease;
  return {
    productId,
    fetchedAt: new Date().toISOString(),
    github: {
      stars: repoInfo.stars,
      forks: repoInfo.forks,
      openIssues: repoInfo.openIssues,
      lastPushAt: repoInfo.lastPushAt,
      commitsLast30d: repoInfo.commitsLast30d,
      mergedPRsLast30d: repoInfo.mergedPRsLast30d,
      latestRelease: latestRelease
        ? {
            tag: latestRelease.tag,
            name: latestRelease.name,
            publishedAt: latestRelease.publishedAt,
            url: latestRelease.url,
          }
        : undefined,
    },
    chromeStore,
    activity: computeActivityLevel(
      repoInfo.lastPushAt,
      latestRelease?.publishedAt,
    ),
  };
}
