"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n-provider";

export interface SparklinePoint {
  correctCount: number;
  totalCount: number;
}

export function PracticeSparkline({ points }: { points: SparklinePoint[] }) {
  const { t } = useI18n();
  if (points.length === 0) {
    return null;
  }

  return (
    <div
      className="flex h-8 items-end justify-center gap-1"
      aria-label={t("practice.historyAria")}
    >
      {points.map((point, index) => {
        const ratio = point.totalCount > 0 ? point.correctCount / point.totalCount : 0;
        const isLast = index === points.length - 1;
        return (
          <span
            key={`${point.correctCount}-${point.totalCount}-${index}`}
            title={`${point.correctCount}/${point.totalCount}`}
            className={cn(
              "block w-2 rounded-sm",
              isLast
                ? "bg-learn"
                : ratio === 1
                  ? "bg-ok"
                  : ratio >= 0.6
                    ? "bg-learn"
                    : "bg-hard",
            )}
            style={{ height: Math.max(6, Math.round(ratio * 28)) }}
          />
        );
      })}
    </div>
  );
}
