"use client";

import { cn } from "@/lib/utils";
import { MarkdownView } from "@/components/shared/markdown-view";
import { CurrentCardView } from "../types/study.types";

const LEVEL_LABEL: Record<CurrentCardView["state"]["level"], string> = {
  NEW: "novo",
  HARD: "difícil",
  LEARNING: "aprendendo",
  EASY: "fácil",
};

interface FlashcardProps {
  card: CurrentCardView;
  isFlipped: boolean;
  onFlip: () => void;
}

export function Flashcard({ card, isFlipped, onFlip }: FlashcardProps) {
  const frontLabel =
    card.deck === "EXAM"
      ? "Questão de prova"
      : card.direction === "REVERSE"
        ? "Resposta · inversa"
        : "Pergunta";
  const backLabel =
    card.deck === "EXAM"
      ? "Resposta"
      : card.direction === "REVERSE"
        ? "Conceito · inversa"
        : "Resposta";

  return (
    <button
      type="button"
      onClick={onFlip}
      className="flashcard-scene w-full cursor-pointer text-left"
      aria-label={isFlipped ? "Carta virada" : "Virar carta"}
    >
      <div className={cn("flashcard-inner", isFlipped && "is-flipped")}>
        <div className="flashcard-face border border-slate-200 bg-white p-6 shadow-sm">
          <p className="absolute top-4 left-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            {frontLabel}
          </p>
          <p className="absolute top-4 right-5 text-[11px] font-semibold text-navy">{card.code}</p>
          <div className="flex flex-1 items-center justify-center px-2 pt-6 text-center">
            <MarkdownView
              markdown={card.front}
              className="text-xl font-semibold leading-snug text-navy"
            />
          </div>
          <p className="mt-4 text-center text-xs text-slate-400">
            Clique no cartão ou aperte espaço para ver a resposta
          </p>
          <span
            className={cn(
              "absolute bottom-4 left-5 rounded-full border px-2 py-0.5 text-[11px] uppercase",
              card.state.level === "HARD" && "border-red-400 text-red-600",
              card.state.level === "LEARNING" && "border-amber text-amber",
              card.state.level === "EASY" && "border-emerald-500 text-emerald-600",
              card.state.level === "NEW" && "border-slate-300 text-slate-500",
            )}
          >
            {LEVEL_LABEL[card.state.level]}
          </span>
        </div>

        <div className="flashcard-face flashcard-back border border-amber/50 bg-slate-50 p-6 shadow-sm">
          <p className="absolute top-4 left-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber">
            {backLabel}
          </p>
          <p className="absolute top-4 right-5 text-[11px] font-semibold text-navy">{card.code}</p>
          <div className="flex flex-1 items-center px-1 pt-6">
            <MarkdownView markdown={card.back} className="text-base leading-relaxed text-slate-900" />
          </div>
        </div>
      </div>
    </button>
  );
}
