"use client";

import { CardLevelDistribution } from "./card-level-distribution";
import { ModuleAccuracyHeat } from "./module-accuracy-heat";
import { SessionsTimeline } from "./sessions-timeline";
import { StuckCardsList } from "./stuck-cards-list";
import type { ModuleAccuracy, UserStats } from "../types/stats.types";
import { useI18n } from "@/i18n/i18n-provider";

export function StatsPanels({ data }: { data: UserStats }) {
  return (
    <div className="space-y-4">
      <WeakSpotBanner modules={data.byModule} stuckCount={data.stuckCards.length} />
      <div className="grid gap-4 lg:grid-cols-2">
        <ModuleAccuracyHeat modules={data.byModule} />
        <CardLevelDistribution levels={data.cardLevels} />
        <StuckCardsList cards={data.stuckCards} />
        <SessionsTimeline sessions={data.sessionsLast30d} />
      </div>
    </div>
  );
}

function WeakSpotBanner({
  modules,
  stuckCount,
}: {
  modules: ModuleAccuracy[];
  stuckCount: number;
}) {
  const { t } = useI18n();
  const weakest = weakestModule(modules);
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      {weakest ? (
        <p>
          {t("stats.weakest", {
            code: weakest.code,
            accuracy: weakest.accuracyPct,
            attempts: weakest.attempts,
          })}
        </p>
      ) : (
        <p>{t("stats.noWeakest")}</p>
      )}
      <p className="mt-1">
        {stuckCount === 0 ? t("stats.noStuck") : t("stats.stuckCount", { count: stuckCount })}
      </p>
    </div>
  );
}

export function hasStatsData(stats: UserStats): boolean {
  const practiced = stats.byModule.some((module) => module.attempts > 0);
  const hasLevels = Object.values(stats.cardLevels).some((count) => count > 0);
  return practiced || hasLevels || stats.stuckCards.length > 0 || stats.sessionsLast30d.length > 0;
}

function weakestModule(modules: ModuleAccuracy[]): ModuleAccuracy | null {
  const practiced = modules.filter((module) => module.attempts > 0);
  if (practiced.length === 0) {
    return null;
  }
  return practiced.reduce((worst, current) =>
    current.accuracyPct < worst.accuracyPct ? current : worst,
  );
}
