import { Button } from "@/components/ui/button";

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
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-900">
      <h2 className="text-lg font-semibold">Não foi possível carregar o desempenho</h2>
      <p className="mt-1 text-sm text-red-800">
        Tente de novo. Se o erro continuar, faça login outra vez.
      </p>
      <Button
        type="button"
        onClick={onRetry}
        className="mt-4 bg-red-800 hover:bg-red-800/90"
      >
        Tentar novamente
      </Button>
    </div>
  );
}

export function StatsEmpty() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <h2 className="text-lg font-semibold text-navy">Ainda sem dados</h2>
      <p className="mt-2 text-sm text-slate-600">
        Estude cartas e faça mini-provas para ver onde você está mal — acurácia por
        módulo, cartas travadas e sessões dos últimos 30 dias.
      </p>
    </div>
  );
}
