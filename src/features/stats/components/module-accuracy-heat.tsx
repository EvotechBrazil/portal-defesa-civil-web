import { Card } from "@/components/ui/card";
import type { ModuleAccuracy } from "../types/stats.types";

export function ModuleAccuracyHeat({ modules }: { modules: ModuleAccuracy[] }) {
  if (modules.length === 0) {
    return (
      <Card>
        <h2 className="text-base font-semibold text-navy">Acurácia por módulo</h2>
        <p className="mt-2 text-sm text-slate-500">Nenhum módulo neste curso.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-base font-semibold text-navy">Acurácia por módulo</h2>
      <p className="mt-1 text-sm text-slate-500">
        Vermelho pede reforço. Cinza ainda não foi praticado.
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
                ? "sem tentativas"
                : `${module.attempts} tentativa${module.attempts === 1 ? "" : "s"}`}
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
