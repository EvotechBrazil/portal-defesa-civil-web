"use client";

import { MarkdownView } from "@/components/shared/markdown-view";
import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import type { AnswerKeyQuestion } from "../types/practice.types";

const KEYS = ["A", "B", "C", "D", "E"];

export function PracticeAnswerKey({ questions }: { questions: AnswerKeyQuestion[] }) {
  const { t, translateContent } = useI18n();
  return (
    <div className="space-y-4">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.13em] text-flare-ink">
        {t("practice.commentedKey")}
      </h3>
      {questions.map((question) => (
        <article key={question.questionId} className="rounded-lg border border-line p-3">
          {question.stem ? (
            <p className="font-medium text-paper">{translateContent(question.stem)}</p>
          ) : null}
          <ul className="mt-2 space-y-1.5">
            {question.options.map((option, index) => {
              const isChosenWrong =
                question.chosenOptionId === option.optionId && !option.isCorrect;
              return (
                <li
                  key={option.optionId}
                  className={cn(
                    "flex gap-2 rounded-md border px-3 py-2 text-sm",
                    option.isCorrect &&
                      "border-ok bg-ok-surf text-ok",
                    isChosenWrong && "border-hard bg-hard-surf text-hard",
                    !option.isCorrect &&
                      !isChosenWrong &&
                      "border-line bg-panel text-paper",
                  )}
                >
                  <span className="w-4 font-semibold">{KEYS[index] ?? String(index + 1)}</span>
                  <span>{translateContent(option.text)}</span>
                </li>
              );
            })}
          </ul>
          {question.chosenOptionId && !question.isCorrect ? (
            <p className="mt-2 text-xs text-mist">
              {t("practice.youChose")}{" "}
              {translateContent(
                question.options.find((option) => option.optionId === question.chosenOptionId)
                  ?.text ?? t("practice.invalidOption"),
              )}
            </p>
          ) : null}
          {question.explanationMd ? (
            <MarkdownView
              className="mt-2 text-sm leading-relaxed text-mist"
              markdown={translateContent(question.explanationMd)}
            />
          ) : null}
        </article>
      ))}
    </div>
  );
}
