"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/i18n-provider";

export function StatsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2" aria-busy="true">
      {["heat", "levels", "stuck", "sessions"].map((slot) => (
        <div
          key={slot}
          className="h-48 animate-pulse rounded-xl border border-line bg-inset"
        />
      ))}
    </div>
  );
}

export function StatsError({ onRetry }: { onRetry: () => void }) {
  const { t } = useI18n();
  return (
    <div className="rounded-xl border border-hard bg-hard-surf p-6 text-hard">
      <h2 className="text-lg font-semibold">{t("stats.loadError")}</h2>
      <p className="mt-1 text-sm text-hard">
        {t("stats.loadErrorHint")}
      </p>
      <Button
        type="button"
        onClick={onRetry}
        className="mt-4 bg-hard hover:bg-hard/90"
      >
        {t("common.tryAgain")}
      </Button>
    </div>
  );
}

export function StatsEmpty() {
  const { t } = useI18n();
  return (
    <div className="rounded-xl border border-dashed border-line bg-panel p-8 text-center">
      <h2 className="text-lg font-semibold text-paper">{t("stats.empty")}</h2>
      <p className="mt-2 text-sm text-mist">{t("stats.emptyHint")}</p>
    </div>
  );
}
