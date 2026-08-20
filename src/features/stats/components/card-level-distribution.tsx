"use client";

import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n/i18n-provider";
import type { CardLevels } from "../types/stats.types";

const LEVELS: Array<{ key: keyof CardLevels; labelKey: string; bar: string }> = [
  { key: "HARD", labelKey: "stats.levelHard", bar: "bg-hard" },
  { key: "LEARNING", labelKey: "stats.levelLearning", bar: "bg-learn" },
  { key: "NEW", labelKey: "stats.levelNew", bar: "bg-mist" },
  { key: "EASY", labelKey: "stats.levelEasy", bar: "bg-ok" },
];

export function CardLevelDistribution({ levels }: { levels: CardLevels }) {
  const { t } = useI18n();
  const total = LEVELS.reduce((sum, level) => sum + levels[level.key], 0);

  return (
    <Card>
      <h2 className="text-base font-semibold text-paper">{t("stats.levels")}</h2>
      <p className="mt-1 text-sm text-mist">
        {total === 0
          ? t("stats.noReviewed")
          : t("stats.savedCards", { count: total })}
      </p>
      <ul className="mt-4 space-y-3">
        {LEVELS.map((level) => {
          const count = levels[level.key];
          const width = total === 0 ? 0 : Math.round((count / total) * 100);
          return (
            <li key={level.key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-paper">{t(level.labelKey)}</span>
                <span className="tabular-nums text-mist">{count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-inset">
                <div
                  className={`h-full rounded-full ${level.bar}`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
