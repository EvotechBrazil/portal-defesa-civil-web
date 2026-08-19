"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/i18n-provider";

export function StatsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2" aria-busy="true">
      {["heat", "levels", "stuck", "sessions"].map((slot) => (
        <div
          key={slot}
          className="h-48 animate-pulse rounded-xl border border-slate-200 bg-slate-100"
        />
      ))}
    </div>
  );
}

export function StatsError({ onRetry }: { onRetry: () => void }) {
  const { t } = useI18n();
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-900">
      <h2 className="text-lg font-semibold">{t("stats.loadError")}</h2>
      <p className="mt-1 text-sm text-red-800">
        {t("stats.loadErrorHint")}
      </p>
      <Button
        type="button"
        onClick={onRetry}
        className="mt-4 bg-red-800 hover:bg-red-800/90"
      >
        {t("common.tryAgain")}
      </Button>
    </div>
  );
}

export function StatsEmpty() {
  const { t } = useI18n();
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <h2 className="text-lg font-semibold text-navy">{t("stats.empty")}</h2>
      <p className="mt-2 text-sm text-slate-600">{t("stats.emptyHint")}</p>
    </div>
  );
}
