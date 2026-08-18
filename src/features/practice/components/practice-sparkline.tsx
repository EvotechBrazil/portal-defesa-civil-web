import { cn } from "@/lib/utils";

export interface SparklinePoint {
  correctCount: number;
  totalCount: number;
}

export function PracticeSparkline({ points }: { points: SparklinePoint[] }) {
  if (points.length === 0) {
    return null;
  }

  return (
    <div
      className="flex h-8 items-end justify-center gap-1"
      aria-label="Histórico das últimas tentativas"
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
                ? "bg-amber-500"
                : ratio === 1
                  ? "bg-emerald-500"
                  : ratio >= 0.6
                    ? "bg-amber-400"
                    : "bg-red-500",
            )}
            style={{ height: Math.max(6, Math.round(ratio * 28)) }}
          />
        );
      })}
    </div>
  );
}
