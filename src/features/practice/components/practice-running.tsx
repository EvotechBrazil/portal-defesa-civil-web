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
  const dark = variant === "onDark";
  const progress = total > 0 ? (step / total) * 100 : 0;
  const selected = lockedOptionId ?? question.chosenOptionId;
  const locked = Boolean(selected) || disabled;

  return (
    <div>
      <div className={cn("mb-3 h-1.5 overflow-hidden rounded-full", dark ? "bg-white/10" : "bg-slate-200")}>
        <div className="h-full bg-flare transition-all" style={{ width: `${progress}%` }} />
      </div>
      {question.sourceRef ? (
        <p className={cn("mb-1 text-[11px] uppercase tracking-wider", dark ? "text-mist" : "text-slate-500")}>
          {question.sourceRef}
        </p>
      ) : null}
      <p className={cn("mb-3 font-semibold", dark ? "text-paper" : "text-slate-900")}>{question.stem}</p>
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
                  dark ? "text-paper" : "text-slate-800",
                  isChosen
                    ? dark
                      ? "border-flare bg-flare/15"
                      : "border-amber bg-orange-50"
                    : dark
                      ? "border-white/10 bg-ink/60 hover:border-flare/50"
                      : "border-slate-200 bg-white hover:border-amber/60",
                  locked && !isChosen && (dark ? "hover:border-white/10" : "hover:border-slate-200"),
                  locked && "disabled:cursor-not-allowed",
                )}
              >
                <span className={cn("w-5 font-semibold", dark ? "text-flare" : "text-slate-500")}>
                  {KEYS[index] ?? String(index + 1)}
                </span>
                <span>{option.text}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
