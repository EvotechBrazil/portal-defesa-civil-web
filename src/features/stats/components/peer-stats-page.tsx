"use client";

import Link from "next/link";
import { hasStatsData, StatsPanels } from "./stats-panels";
import { StatsEmpty, StatsError, StatsLoading } from "./stats-status";
import { usePeerStats } from "../hooks/use-stats";
import { useI18n } from "@/i18n/i18n-provider";

export function PeerStatsPage({ userId }: { userId: string }) {
  const { t } = useI18n();
  const { data, isLoading, isError, refetch } = usePeerStats(userId);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-sm">
        <Link href="/desempenho" className="text-flare hover:underline">
          {t("common.back")}
        </Link>
      </p>

      {isLoading ? <StatsLoading /> : null}
      {isError ? <StatsError onRetry={() => void refetch()} /> : null}

      {data ? (
        <>
          <header className="mt-4 mb-6">
            <p className="text-sm font-medium uppercase tracking-wide text-amber">
              {t("pack.profile.eyebrow")}
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-navy">{data.profile.name}</h1>
            <p className="mt-2 text-sm text-slate-600">
              {[data.profile.lgndNumber, data.profile.squad, data.profile.manada?.name]
                .filter(Boolean)
                .join(" · ") || t("pack.profile.noMeta")}
            </p>
            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              {data.disclaimer}
            </p>
          </header>
          {hasStatsData(data) ? <StatsPanels data={data} /> : <StatsEmpty />}
        </>
      ) : null}
    </section>
  );
}
