import { getTranslations } from "next-intl/server";
import type { ActivityEvent } from "@/lib/metrics/types";
import { ActivityIndicator } from "./ActivityIndicator";
import { formatRelativeTime } from "@/lib/metrics/format";
import type { ActivityLevel } from "@/lib/metrics/types";

interface Props {
  releases: ActivityEvent[];
  locale: string;
  activity?: ActivityLevel;
  repoReleasesUrl?: string;
}

export async function ProductReleaseList({
  releases,
  locale,
  activity,
  repoReleasesUrl,
}: Props) {
  if (releases.length === 0) return null;

  const t = await getTranslations("activity");
  const m = await getTranslations("metrics");
  const timeLabels = {
    justNow: m("justNow"),
    hoursAgo: m("hoursAgo"),
    daysAgo: m("daysAgo"),
    weeksAgo: m("weeksAgo"),
  };

  return (
    <section className="mb-12">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{t("releasesTitle")}</h2>
      </div>

      <ul className="space-y-3">
        {releases.map((release) => (
          <li key={release.id} className="card p-4">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-semibold text-accent">
                {release.version ?? release.title}
              </span>
              <span className="text-xs text-muted">
                {formatRelativeTime({
                  isoDate: release.occurredAt,
                  locale,
                  labels: timeLabels,
                })}
              </span>
            </div>
            {release.title !== release.version && (
              <p className="mb-1 text-sm font-medium text-fg">{release.title}</p>
            )}
            {release.summary && (
              <p className="mb-3 text-sm leading-relaxed text-muted line-clamp-2">
                {release.summary}
              </p>
            )}
            <a
              href={release.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-accent hover:opacity-80"
            >
              {t("viewOnGitHub")}
            </a>
          </li>
        ))}
      </ul>

      {repoReleasesUrl && (
        <a
          href={repoReleasesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-medium text-accent hover:opacity-80"
        >
          {t("viewAllReleases")}
        </a>
      )}
    </section>
  );
}
