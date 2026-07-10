import type { Product } from "@/lib/products";
import { getCached, setCache, cacheKey } from "./cache";

export interface GitHubRepoInfo {
  stars: number;
  forks: number;
  openIssues: number;
  lastPushAt: string;
}

export interface GitHubRelease {
  tag: string;
  name: string;
  publishedAt: string;
  url: string;
  body: string;
}

export function parseGitHubRepo(repoUrl: string): { owner: string; repo: string } | null {
  try {
    const { pathname } = new URL(repoUrl);
    const [owner, repo] = pathname.replace(/^\/+/, "").split("/");
    if (!owner || !repo) return null;
    return { owner, repo: repo.replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

// ---------------------------------------------------------------------------
// Cached GitHub fetch functions
// ---------------------------------------------------------------------------

export async function fetchGitHubRepoInfo(
  repoUrl: string,
): Promise<GitHubRepoInfo | null> {
  const parsed = parseGitHubRepo(repoUrl);
  if (!parsed) return null;
  const key = cacheKey("repo", parsed.owner, parsed.repo);

  const cached = getCached<GitHubRepoInfo>(key);
  if (cached) return cached;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`,
      { headers: githubHeaders(), next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;

    const data = (await res.json()) as {
      stargazers_count: number;
      forks_count: number;
      open_issues_count: number;
      pushed_at: string;
    };

    const result: GitHubRepoInfo = {
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssues: data.open_issues_count,
      lastPushAt: data.pushed_at,
    };
    setCache(key, result);
    return result;
  } catch {
    return null;
  }
}

export async function fetchCommitsLast30d(repoUrl: string): Promise<number> {
  const parsed = parseGitHubRepo(repoUrl);
  if (!parsed) return 0;
  const key = cacheKey("commits", parsed.owner, parsed.repo);

  const cached = getCached<number>(key);
  if (cached !== undefined) return cached;

  try {
    // Use per_page=1 and parse the Link header to get total commit count.
    const res = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/commits?per_page=1`,
      { headers: githubHeaders(), next: { revalidate: 3600 } },
    );
    if (!res.ok) return 0;

    // Parse rel="last" URL from Link header — its page number = total commits.
    const link = res.headers.get("link");
    if (link) {
      const m = link.match(/[?&]page=(\d+)[^>]*>; rel="last"/);
      if (m) {
        const count = parseInt(m[1], 10);
        setCache(key, count);
        return count;
      }
    }

    // Fallback: if no Link header (single page), count returned items.
    const data = (await res.json()) as unknown[];
    const count = data.length;
    setCache(key, count);
    return count;
  } catch {
    return 0;
  }
}

export async function fetchMergedPRsLast30d(repoUrl: string): Promise<number> {
  const parsed = parseGitHubRepo(repoUrl);
  if (!parsed) return 0;
  const key = cacheKey("prs", parsed.owner, parsed.repo);

  const cached = getCached<number>(key);
  if (cached !== undefined) return cached;

  try {
    const q = encodeURIComponent(
      `repo:${parsed.owner}/${parsed.repo} is:pr is:merged`,
    );
    const res = await fetch(
      `https://api.github.com/search/issues?q=${q}&per_page=1`,
      { headers: githubHeaders(), next: { revalidate: 3600 } },
    );
    if (!res.ok) return 0;

    const data = (await res.json()) as { total_count: number };
    const count = data.total_count ?? 0;
    setCache(key, count);
    return count;
  } catch {
    return 0;
  }
}

export async function fetchGitHubReleases(
  repoUrl: string,
  limit = 10,
): Promise<GitHubRelease[]> {
  const parsed = parseGitHubRepo(repoUrl);
  if (!parsed) return [];
  const key = cacheKey("releases", parsed.owner, parsed.repo, String(limit));

  const cached = getCached<GitHubRelease[]>(key);
  if (cached) return cached;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/releases?per_page=${limit}`,
      { headers: githubHeaders(), next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];

    const data = (await res.json()) as Array<{
      tag_name: string;
      name: string;
      published_at: string;
      html_url: string;
      body: string;
      draft: boolean;
      prerelease: boolean;
    }>;

    const result = data
      .filter((r) => !r.draft)
      .map((r) => ({
        tag: r.tag_name,
        name: r.name || r.tag_name,
        publishedAt: r.published_at,
        url: r.html_url,
        body: r.body ?? "",
      }));
    setCache(key, result);
    return result;
  } catch {
    return [];
  }
}

export function releaseToActivityEvent(
  release: GitHubRelease,
  product: Product,
  productId: string,
): import("./types").ActivityEvent {
  const summary = release.body
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/[#*_`[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  return {
    id: `release:${productId}:${release.tag}`,
    productId,
    type: "release",
    occurredAt: release.publishedAt,
    title: release.name,
    summary: summary || undefined,
    url: release.url,
    version: release.tag,
  };
}
