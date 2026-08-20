"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n-provider";
import type { FinishedAttempt } from "../types/practice.types";
import { PracticeAnswerKey } from "./practice-answer-key";
import { PracticeSparkline } from "./practice-sparkline";

interface PracticeResultProps {
  result: FinishedAttempt;
}

export function PracticeResult({ result }: PracticeResultProps) {
  const { t } = useI18n();
  const tone =
    result.scorePct === 100
      ? "text-ok"
      : result.scorePct >= 60
        ? "text-learn"
        : "text-hard";

  let comparison = t("practice.firstAttempt");
  if (result.previous && result.deltaPct !== null) {
    if (result.deltaPct > 0) {
      comparison = t("practice.previousPoints", {
        correct: result.previous.correctCount,
        total: result.previous.totalCount,
        delta: `+${result.deltaPct}`,
      });
    } else if (result.deltaPct < 0) {
      comparison = t("practice.previousPoints", {
        correct: result.previous.correctCount,
        total: result.previous.totalCount,
        delta: result.deltaPct,
      });
    } else {
      comparison = t("practice.sameResult", {
        correct: result.previous.correctCount,
        total: result.previous.totalCount,
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-inset p-4 text-center">
        <p className={cn("text-2xl font-semibold", tone)}>
          {result.correctCount}/{result.totalCount} · {result.scorePct}%
        </p>
        <p
          className={cn(
            "mt-1 text-sm",
            result.deltaPct !== null && result.deltaPct > 0 && "text-ok",
            result.deltaPct !== null && result.deltaPct < 0 && "text-hard",
            (result.deltaPct === null || result.deltaPct === 0) && "text-mist",
          )}
        >
          {comparison}
        </p>
        <div className="mt-3">
          <PracticeSparkline points={result.history} />
        </div>
      </div>
      <PracticeAnswerKey questions={result.answerKey} />
      <p className="text-xs text-mist">
        {t("practice.keyRevealed")}
      </p>
    </div>
  );
}
