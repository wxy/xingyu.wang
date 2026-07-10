export type ActivityLevel = "active" | "maintained" | "quiet" | "unknown";

export interface ProductMetricsSnapshot {
  productId: string;
  fetchedAt: string;
  github?: {
    stars: number;
    forks: number;
    openIssues: number;
    lastPushAt: string;
    commitsLast30d: number;
    mergedPRsLast30d: number;
    latestRelease?: {
      tag: string;
      name: string;
      publishedAt: string;
      url: string;
    };
  };
  chromeStore?: {
    users: number;
    rating?: number;
  };
  activity: ActivityLevel;
}

export interface MetricsHistoryPoint {
  date: string;
  stars?: number;
  users?: number;
  openIssues?: number;
}

export interface MetricsHistory {
  productId: string;
  points: MetricsHistoryPoint[];
}

export interface ActivityEvent {
  id: string;
  productId: string;
  type: "release";
  occurredAt: string;
  title: string;
  summary?: string;
  url: string;
  version?: string;
}

export interface LatestMetricsStore {
  updatedAt: string;
  products: Record<string, ProductMetricsSnapshot>;
}

export const METRICS_HISTORY_DAYS = 90;
export const ACTIVITY_EVENTS_LIMIT = 200;
export const DETAIL_RELEASE_LIMIT = 5;
