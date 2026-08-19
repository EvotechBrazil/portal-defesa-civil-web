"use client";

import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n/i18n-provider";
import type { ModuleAccuracy } from "../types/stats.types";

export function ModuleAccuracyHeat({ modules }: { modules: ModuleAccuracy[] }) {
  const { t } = useI18n();
  if (modules.length === 0) {
    return (
      <Card>
        <h2 className="text-base font-semibold text-navy">{t("stats.accuracy")}</h2>
        <p className="mt-2 text-sm text-slate-500">{t("stats.noModules")}</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-base font-semibold text-navy">{t("stats.accuracy")}</h2>
      <p className="mt-1 text-sm text-slate-500">
        {t("stats.accuracyHint")}
      </p>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {modules.map((module) => (
          <li
            key={module.code}
            className={`rounded-lg border p-3 ${heatClass(module.accuracyPct, module.attempts)}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide">{module.code}</p>
            <p className="mt-1 line-clamp-2 text-sm font-medium">{module.title}</p>
            <p className="mt-3 text-2xl font-semibold tabular-nums">
              {module.attempts === 0 ? "—" : `${module.accuracyPct}%`}
            </p>
            <p className="text-xs opacity-80">
              {module.attempts === 0
                ? t("stats.noAttempts")
                : t("stats.attemptCount", { count: module.attempts })}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function heatClass(accuracyPct: number, attempts: number): string {
  if (attempts === 0) {
    return "border-slate-200 bg-slate-100 text-slate-600";
  }
  if (accuracyPct < 40) {
    return "border-red-200 bg-red-100 text-red-950";
  }
  if (accuracyPct < 70) {
    return "border-amber-200 bg-amber-100 text-amber-950";
  }
  return "border-emerald-200 bg-emerald-100 text-emerald-950";
}
