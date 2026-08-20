"use client";

import { ManadaMembersList } from "./manada-members-list";
import { hasStatsData, StatsPanels } from "./stats-panels";
import { StatsEmpty, StatsError, StatsLoading } from "./stats-status";
import { useStats } from "../hooks/use-stats";
import { useI18n } from "@/i18n/i18n-provider";

export function StatsPage({ courseId }: { courseId?: string }) {
  const { t } = useI18n();
  const { data, isLoading, isError, refetch, isFetching } = useStats(courseId);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6">
        <p className="text-sm font-medium uppercase tracking-wide text-flare-ink">{t("stats.eyebrow")}</p>
        <h1 className="mt-1 text-2xl font-semibold text-paper">{t("stats.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-mist">{t("stats.description")}</p>
      </header>

      {isLoading ? <StatsLoading /> : null}
      {isError ? <StatsError onRetry={() => void refetch()} /> : null}
      {data && !hasStatsData(data) ? <StatsEmpty /> : null}
      {data && hasStatsData(data) ? (
        <div className="space-y-4">
          <StatsPanels data={data} />
          {isFetching ? <p className="text-xs text-mist">{t("stats.updating")}</p> : null}
        </div>
      ) : null}

      <ManadaMembersList />
    </section>
  );
}
