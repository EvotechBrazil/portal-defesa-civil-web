import { Button } from "@/components/ui/button";
import type { HistoryItem } from "../types/practice.types";

interface PracticeIdleProps {
  questionCount: number;
  history: HistoryItem[];
  isStarting: boolean;
  locked: boolean;
  onStart: () => void;
  onViewAnswerKey: () => void;
}

export function PracticeIdle({
  questionCount,
  history,
  isStarting,
  locked,
  onStart,
  onViewAnswerKey,
}: PracticeIdleProps) {
  const last = history[history.length - 1];
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        <strong>{questionCount} questões</strong> sobre este ponto — leia a fundamentação e
        depois responda.
      </p>
      <p className="text-xs text-slate-500">
        {last
          ? `última tentativa: ${last.correctCount}/${last.totalCount} (${last.scorePct}%) · ${history.length} tentativa${history.length > 1 ? "s" : ""}`
          : "nenhuma tentativa ainda"}
      </p>
      <div className="flex flex-wrap gap-2">
        {history.length === 0 && !locked ? (
          <Button type="button" disabled={isStarting} onClick={onStart}>
            {isStarting ? "Preparando…" : "Iniciar avaliação · questões embaralhadas"}
          </Button>
        ) : (
          <p className="text-xs text-slate-500">
            Avaliação encerrada. O gabarito já foi revelado e não pode ser refeita.
          </p>
        )}
        <Button
          type="button"
          disabled={isStarting}
          onClick={onViewAnswerKey}
          className="bg-slate-200 text-slate-800 hover:bg-slate-300"
        >
          Ver gabarito
        </Button>
      </div>
    </div>
  );
}
