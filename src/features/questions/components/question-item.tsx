"use client";

import { useState } from "react";
import { MarkdownView } from "@/components/shared/markdown-view";
import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import type { Question, QuestionBankMode } from "../types/questions.types";

export interface QuestionItemProps {
  question: Question;
  index: number;
  mode: QuestionBankMode;
}

export function QuestionItem({ question, index, mode }: QuestionItemProps) {
  const { translateContent } = useI18n();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isAnswerKey = mode === "answer-key";
  const hasAnswered = isAnswerKey || selectedId !== null;

  return (
    <article className="rounded-card border border-line bg-panel p-5">
      <p className="text-xs tracking-wide text-mist uppercase">
        {question.moduleCode} · Quiz {question.quizCode}
        {question.sourceRef ? ` · ${translateContent(question.sourceRef)}` : ""}
      </p>
      <h2 className="mt-2 text-base font-medium text-paper">
        {index}. {translateContent(question.stem)}
      </h2>
      <ul className="mt-4 space-y-2">
        {question.options.map((option) => {
          const isSelected = selectedId === option.id;
          const showCorrect = hasAnswered && option.isCorrect;
          const showWrong = hasAnswered && isSelected && !option.isCorrect;
          return (
            <li key={option.id}>
              <button
                type="button"
                disabled={hasAnswered && !isAnswerKey}
                onClick={() => setSelectedId(option.id)}
                className={cn(
                  "flex w-full cursor-pointer items-start rounded-lg border px-3 py-2 text-left text-sm transition",
                  "hover:border-flare/60 hover:bg-flare/5 disabled:cursor-default",
                  showCorrect && "border-ok bg-ok-surf text-ok",
                  showWrong && "border-hard bg-hard-surf text-hard",
                  !showCorrect && !showWrong && "border-line bg-panel",
                )}
              >
                <span className="mr-2 font-semibold">
                  {String.fromCharCode(65 + option.ord)}.
                </span>
                <span>{translateContent(option.text)}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {hasAnswered && question.explanationMd ? (
        <div className="mt-4 rounded-lg bg-inset px-3 py-2 text-sm">
          <MarkdownView markdown={translateContent(question.explanationMd)} />
        </div>
      ) : null}
    </article>
  );
}
