"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePracticePanel } from "../hooks/use-practice-panel";
import { PracticeAnswerKey } from "./practice-answer-key";
import { PracticeIdle } from "./practice-idle";
import { PracticeResult } from "./practice-result";
import { PracticeRunning } from "./practice-running";
import { PracticeSparkline } from "./practice-sparkline";

export interface PracticePanelProps {
  cardId: string;
}

export function PracticePanel({ cardId }: PracticePanelProps) {
  const panel = usePracticePanel(cardId);

  if (panel.isHistoryLoading) {
    return (
      <Card>
        <p className="text-sm text-slate-500">Carregando mini-prova…</p>
      </Card>
    );
  }

  if (panel.isHistoryError) {
    return (
      <Card>
        <p className="text-sm text-red-600">Não foi possível carregar o histórico desta carta.</p>
      </Card>
    );
  }

  const questionCount =
    panel.attempt?.total ?? panel.questionCount ?? panel.history[0]?.totalCount ?? 0;

  return (
    <Card className="space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-navy">
            {panel.phase === "running" && panel.attempt
              ? `Tentativa em andamento — sem gabarito até o fim`
              : panel.phase === "done"
                ? "Resultado da tentativa"
                : panel.phase === "answer_key"
                  ? "Gabarito — sem tentativa registrada"
                  : "Mini-prova"}
          </p>
          {panel.phase === "running" && panel.attempt ? (
            <p className="text-xs text-slate-500">
              questão {panel.step + 1} de {panel.attempt.total}
            </p>
          ) : panel.history.length > 0 ? (
            <p className="text-xs text-slate-500">
              {panel.history.length} tentativa{panel.history.length > 1 ? "s" : ""} nesta carta
            </p>
          ) : null}
        </div>
        {panel.phase !== "running" && panel.history.length > 0 ? (
          <PracticeSparkline points={panel.history} />
        ) : null}
      </header>

      {panel.errorMessage ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{panel.errorMessage}</p>
      ) : null}

      {panel.phase === "idle" ? (
        <PracticeIdle
          questionCount={questionCount}
          history={panel.history}
          isStarting={panel.isBusy}
          onStart={() => void panel.start()}
          onViewAnswerKey={panel.viewAnswerKey}
        />
      ) : null}

      {panel.phase === "running" && panel.currentQuestion && panel.attempt ? (
        <PracticeRunning
          step={panel.step}
          total={panel.attempt.total}
          question={panel.currentQuestion}
          lockedOptionId={panel.lockedOptionId}
          disabled={panel.isBusy}
          onChoose={(optionId) => void panel.chooseOption(optionId)}
        />
      ) : null}

      {panel.phase === "done" && panel.result ? (
        <PracticeResult
          result={panel.result}
          isStarting={panel.isBusy}
          onRetry={() => void panel.start()}
        />
      ) : null}

      {panel.phase === "answer_key" ? (
        <div className="space-y-4">
          {panel.isAnswerKeyLoading ? (
            <p className="text-sm text-slate-500">Carregando gabarito…</p>
          ) : null}
          {panel.isAnswerKeyError ? (
            <p className="text-sm text-red-600">Não foi possível carregar o gabarito.</p>
          ) : null}
          {panel.answerKey.length > 0 ? (
            <PracticeAnswerKey questions={panel.answerKey} />
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button type="button" disabled={panel.isBusy} onClick={() => void panel.start()}>
              {panel.isBusy ? "Preparando…" : "Praticar mesmo assim"}
            </Button>
            <Button
              type="button"
              disabled={panel.isBusy}
              onClick={panel.backToIdle}
              className="bg-slate-200 text-slate-800 hover:bg-slate-300"
            >
              Voltar
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
