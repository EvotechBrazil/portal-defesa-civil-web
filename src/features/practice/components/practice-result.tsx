import { cn } from "@/lib/utils";
import type { FinishedAttempt } from "../types/practice.types";
import { PracticeAnswerKey } from "./practice-answer-key";
import { PracticeSparkline } from "./practice-sparkline";

interface PracticeResultProps {
  result: FinishedAttempt;
}

export function PracticeResult({ result }: PracticeResultProps) {
  const tone =
    result.scorePct === 100
      ? "text-emerald-600"
      : result.scorePct >= 60
        ? "text-amber-600"
        : "text-red-600";

  let comparison = "primeira tentativa registrada";
  if (result.previous && result.deltaPct !== null) {
    if (result.deltaPct > 0) {
      comparison = `anterior: ${result.previous.correctCount}/${result.previous.totalCount} · +${result.deltaPct} pontos percentuais`;
    } else if (result.deltaPct < 0) {
      comparison = `anterior: ${result.previous.correctCount}/${result.previous.totalCount} · ${result.deltaPct} pontos percentuais`;
    } else {
      comparison = `anterior: ${result.previous.correctCount}/${result.previous.totalCount} · mesmo resultado`;
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-slate-50 p-4 text-center">
        <p className={cn("text-2xl font-semibold", tone)}>
          {result.correctCount}/{result.totalCount} · {result.scorePct}%
        </p>
        <p
          className={cn(
            "mt-1 text-sm",
            result.deltaPct !== null && result.deltaPct > 0 && "text-emerald-700",
            result.deltaPct !== null && result.deltaPct < 0 && "text-red-700",
            (result.deltaPct === null || result.deltaPct === 0) && "text-slate-600",
          )}
        >
          {comparison}
        </p>
        <div className="mt-3">
          <PracticeSparkline points={result.history} />
        </div>
      </div>
      <PracticeAnswerKey questions={result.answerKey} />
      <p className="text-xs text-slate-500">
        Gabarito revelado. Esta avaliação ficou no histórico e não pode ser refeita.
      </p>
    </div>
  );
}
