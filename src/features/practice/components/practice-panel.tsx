"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n/i18n-provider";
import { usePracticePanel } from "../hooks/use-practice-panel";
import { PracticeAnswerKey } from "./practice-answer-key";
import { PracticeIdle } from "./practice-idle";
import { PracticeResult } from "./practice-result";
import { PracticeRunning } from "./practice-running";
import { PracticeSparkline } from "./practice-sparkline";

export interface PracticePanelProps {
  cardId: string;
  variant?: "light" | "onDark";
  autoResume?: boolean;
}

export function PracticePanel({
  cardId,
  variant = "light",
  autoResume = true,
}: PracticePanelProps) {
  const { t } = useI18n();
  const panel = usePracticePanel(cardId, { autoResume });
  const dark = variant === "onDark";

  if (panel.isHistoryLoading) {
    return (
      <Card className={dark ? "border-line bg-panel text-paper" : undefined}>
        <p className={dark ? "text-sm text-mist" : "text-sm text-slate-500"}>{t("practice.loading")}</p>
      </Card>
    );
  }

  if (panel.isHistoryError) {
    return (
      <Card className={dark ? "border-line bg-panel text-paper" : undefined}>
        <p className="text-sm text-hard">{t("practice.historyError")}</p>
      </Card>
    );
  }

  const questionCount =
    panel.attempt?.total ?? panel.questionCount ?? panel.history[0]?.totalCount ?? 0;

  return (
    <Card className={dark ? "space-y-4 border-line bg-panel text-paper" : "space-y-4"}>
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className={dark ? "text-sm font-semibold text-paper" : "text-sm font-semibold text-navy"}>
            {panel.phase === "running" && panel.attempt
              ? t("practice.running")
              : panel.phase === "done"
                ? t("practice.result")
                : panel.phase === "answer_key"
                  ? t("practice.keyNoAttempt")
                  : t("practice.miniTest")}
          </p>
          {panel.phase === "running" && panel.attempt ? (
            <p className={dark ? "text-xs text-mist" : "text-xs text-slate-500"}>
              {t("practice.step", { current: panel.step + 1, total: panel.attempt.total })}
            </p>
          ) : panel.history.length > 0 ? (
            <p className={dark ? "text-xs text-mist" : "text-xs text-slate-500"}>
              {t("practice.attemptsOnCard", { count: panel.history.length })}
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
          locked={panel.keyRevealed || panel.history.length > 0}
          variant={variant}
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
          variant={variant}
          onChoose={(optionId) => void panel.chooseOption(optionId)}
        />
      ) : null}

      {panel.phase === "done" && panel.result ? (
        <PracticeResult result={panel.result} />
      ) : null}

      {panel.phase === "answer_key" ? (
        <div className="space-y-4">
          {panel.isAnswerKeyLoading ? (
            <p className="text-sm text-slate-500">{t("practice.keyLoading")}</p>
          ) : null}
          {panel.isAnswerKeyError ? (
            <p className="text-sm text-red-600">{t("practice.keyError")}</p>
          ) : null}
          {panel.answerKey.length > 0 ? (
            <PracticeAnswerKey questions={panel.answerKey} />
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={panel.isBusy}
              onClick={panel.backToIdle}
              className="bg-slate-200 text-slate-800 hover:bg-slate-300"
            >
              {t("common.back")}
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
