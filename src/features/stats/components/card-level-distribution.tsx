import { Card } from "@/components/ui/card";
import type { CardLevels } from "../types/stats.types";

const LEVELS: Array<{ key: keyof CardLevels; label: string; bar: string }> = [
  { key: "HARD", label: "Difíceis", bar: "bg-red-600" },
  { key: "LEARNING", label: "Aprendendo", bar: "bg-amber-500" },
  { key: "NEW", label: "Novas", bar: "bg-slate-400" },
  { key: "EASY", label: "Fáceis", bar: "bg-emerald-600" },
];

export function CardLevelDistribution({ levels }: { levels: CardLevels }) {
  const total = LEVELS.reduce((sum, level) => sum + levels[level.key], 0);

  return (
    <Card>
      <h2 className="text-base font-semibold text-navy">Cartas por nível</h2>
      <p className="mt-1 text-sm text-slate-500">
        {total === 0
          ? "Nenhuma carta revisada ainda."
          : `${total} carta${total === 1 ? "" : "s"} com estado gravado.`}
      </p>
      <ul className="mt-4 space-y-3">
        {LEVELS.map((level) => {
          const count = levels[level.key];
          const width = total === 0 ? 0 : Math.round((count / total) * 100);
          return (
            <li key={level.key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{level.label}</span>
                <span className="tabular-nums text-slate-600">{count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
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
