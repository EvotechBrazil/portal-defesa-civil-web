"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/i18n-provider";
import type { HistoryItem } from "../types/practice.types";

interface PracticeIdleProps {
  questionCount: number;
  history: HistoryItem[];
  isStarting: boolean;
  locked: boolean;
  variant?: "light" | "onDark";
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
  variant = "light",
}: PracticeIdleProps) {
  const { t } = useI18n();
  const dark = variant === "onDark";
  const last = history[history.length - 1];
  return (
    <div className="space-y-3">
      <p className={dark ? "text-sm text-paper" : "text-sm text-slate-700"}>
        {t("practice.idleIntro", { count: questionCount })}
      </p>
      <p className={dark ? "text-xs text-mist" : "text-xs text-slate-500"}>
        {last
          ? t("practice.lastAttempt", {
              correct: last.correctCount,
              total: last.totalCount,
              score: last.scorePct,
              count: history.length,
            })
          : t("practice.noAttempts")}
      </p>
      <div className="flex flex-wrap gap-2">
        {history.length === 0 && !locked ? (
          <Button type="button" disabled={isStarting} onClick={onStart}>
            {isStarting ? t("practice.preparing") : t("practice.start")}
          </Button>
        ) : (
          <p className={dark ? "text-xs text-mist" : "text-xs text-slate-500"}>
            {t("practice.closed")}
          </p>
        )}
        <Button
          type="button"
          disabled={isStarting}
          onClick={onViewAnswerKey}
          className={
            dark
              ? "bg-white/10 text-paper hover:bg-white/15"
              : "bg-slate-200 text-slate-800 hover:bg-slate-300"
          }
        >
          {t("practice.viewKey")}
        </Button>
      </div>
    </div>
  );
}
