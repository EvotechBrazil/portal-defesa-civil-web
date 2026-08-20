"use client";

import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import type { RunningQuestion } from "../types/practice.types";

const KEYS = ["A", "B", "C", "D", "E"];

interface PracticeRunningProps {
  step: number;
  total: number;
  question: RunningQuestion;
  lockedOptionId: string | null;
  disabled: boolean;
  variant?: "light" | "onDark";
  onChoose: (optionId: string) => void;
}

export function PracticeRunning({
  step,
  total,
  question,
  lockedOptionId,
  disabled,
  variant = "light",
  onChoose,
}: PracticeRunningProps) {
  const { translateContent } = useI18n();
  const dark = variant === "onDark";
  const progress = total > 0 ? (step / total) * 100 : 0;
  const selected = lockedOptionId ?? question.chosenOptionId;
  const locked = Boolean(selected) || disabled;

  return (
    <div>
      <div className={cn("mb-3 h-1.5 overflow-hidden rounded-full", dark ? "bg-white/10" : "bg-inset")}>
        <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>
      {question.sourceRef ? (
        <p className={cn("mb-1 text-[11px] uppercase tracking-wider", dark ? "text-mist" : "text-mist")}>
          {translateContent(question.sourceRef)}
        </p>
      ) : null}
      <p className={cn("mb-3 font-semibold", dark ? "text-paper" : "text-paper")}>
        {translateContent(question.stem)}
      </p>
      <ul className="space-y-2">
        {question.options.map((option, index) => {
          const isChosen = selected === option.optionId;
          return (
            <li key={option.optionId}>
              <button
                type="button"
                disabled={locked}
                onClick={() => onChoose(option.optionId)}
                className={cn(
                  "flex min-h-11 w-full cursor-pointer items-start gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition duration-200",
                  dark ? "text-paper" : "text-paper",
                  isChosen
                    ? dark
                      ? "border-flare bg-flare/15"
                      : "border-flare bg-learn-surf"
                    : dark
                      ? "border-white/10 bg-scrim hover:border-flare/50"
                      : "border-line bg-panel hover:border-flare/60",
                  locked && !isChosen && (dark ? "hover:border-white/10" : "hover:border-line"),
                  locked && "disabled:cursor-not-allowed",
                )}
              >
                <span className={cn("w-5 font-semibold", dark ? "text-flare-ink" : "text-mist")}>
                  {KEYS[index] ?? String(index + 1)}
                </span>
                <span>{translateContent(option.text)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
