import { cn } from "@/lib/utils";
import type { RunningQuestion } from "../types/practice.types";

const KEYS = ["A", "B", "C", "D", "E"];

interface PracticeRunningProps {
  step: number;
  total: number;
  question: RunningQuestion;
  lockedOptionId: string | null;
  disabled: boolean;
  onChoose: (optionId: string) => void;
}

export function PracticeRunning({
  step,
  total,
  question,
  lockedOptionId,
  disabled,
  onChoose,
}: PracticeRunningProps) {
  const progress = total > 0 ? (step / total) * 100 : 0;
  const selected = lockedOptionId ?? question.chosenOptionId;
  const locked = Boolean(selected) || disabled;

  return (
    <div>
      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full bg-amber-500 transition-all" style={{ width: `${progress}%` }} />
      </div>
      {question.sourceRef ? (
        <p className="mb-1 text-[11px] uppercase tracking-wider text-slate-500">
          {question.sourceRef}
        </p>
      ) : null}
      <p className="mb-3 font-semibold text-slate-900">{question.stem}</p>
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
                  "flex w-full cursor-pointer items-start gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition",
                  isChosen
                    ? "border-sky-400 bg-sky-50"
                    : "border-slate-200 bg-white hover:border-sky-300",
                  locked && !isChosen && "cursor-default hover:border-slate-200",
                  locked && "disabled:cursor-not-allowed",
                )}
              >
                <span className="w-4 font-semibold text-slate-500">
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
