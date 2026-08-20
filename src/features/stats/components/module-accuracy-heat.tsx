"use client";

import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n/i18n-provider";
import type { ModuleAccuracy } from "../types/stats.types";

export function ModuleAccuracyHeat({ modules }: { modules: ModuleAccuracy[] }) {
  const { t, translateContent } = useI18n();
  if (modules.length === 0) {
    return (
      <Card>
        <h2 className="text-base font-semibold text-paper">{t("stats.accuracy")}</h2>
        <p className="mt-2 text-sm text-mist">{t("stats.noModules")}</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-base font-semibold text-paper">{t("stats.accuracy")}</h2>
      <p className="mt-1 text-sm text-mist">
        {t("stats.accuracyHint")}
      </p>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {modules.map((module) => {
          const band = heatBand(module.accuracyPct, module.attempts);
          return (
            <li
              key={module.code}
              className={`rounded-lg border p-3 ${band.className}`}
              style={band.hatch ? { backgroundImage: band.hatch } : undefined}
            >
              <p className="text-xs font-semibold uppercase tracking-wide">
                {band.mark} {module.code}
              </p>
              <p className="mt-1 line-clamp-2 text-sm font-medium">
                {translateContent(module.title)}
              </p>
              <p className="mt-3 text-2xl font-semibold tabular-nums">
                {module.attempts === 0 ? "—" : `${module.accuracyPct}%`}
              </p>
              <p className="text-xs opacity-80">
                {module.attempts === 0
                  ? t("stats.noAttempts")
                  : t("stats.attemptCount", { count: module.attempts })}
              </p>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-micro uppercase tracking-[0.12em] text-mist">
        <span>✓ {t("stats.legend.ok")}</span>
        <span>△ {t("stats.legend.watch")}</span>
        <span>✕ {t("stats.legend.weak")}</span>
      </p>
    </Card>
  );
}

function heatBand(accuracyPct: number, attempts: number): {
  className: string;
  mark: string;
  hatch?: string;
} {
  if (attempts === 0) {
    return { className: "border-line bg-inset text-mist", mark: "·" };
  }
  if (accuracyPct < 55) {
    return {
      className: "border-hard text-hard",
      mark: "✕",
      hatch: "repeating-linear-gradient(-45deg, var(--hard-surf), var(--hard-surf) 6px, transparent 6px, transparent 10px)",
    };
  }
  if (accuracyPct < 70) {
    return { className: "border-learn bg-learn-surf text-learn", mark: "△" };
  }
  return { className: "border-ok bg-ok-surf text-ok", mark: "✓" };
}
