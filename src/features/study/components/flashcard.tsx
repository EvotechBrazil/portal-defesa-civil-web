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
  return (
    <button
      type="button"
      onClick={onFlip}
      className={cn(
        "relative min-h-64 w-full cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-navy/30",
        isFlipped && "border-amber/40",
      )}
      aria-label={isFlipped ? "Carta virada" : "Virar carta"}
    >
      <div className="mb-4 flex items-center justify-between gap-2 text-xs uppercase tracking-wide">
        <span className="font-semibold text-navy">{card.code}</span>
        <span
          className={cn(
            "rounded-full border px-2 py-0.5",
            card.state.level === "HARD" && "border-red-400 text-red-600",
            card.state.level === "LEARNING" && "border-amber text-amber",
            card.state.level === "EASY" && "border-emerald-500 text-emerald-600",
            card.state.level === "NEW" && "border-slate-300 text-slate-500",
          )}
        >
          {LEVEL_LABEL[card.state.level]}
        </span>
      </div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        {card.deck === "EXAM"
          ? "Questão de prova"
          : isFlipped
            ? card.direction === "REVERSE"
              ? "Conceito"
              : "Resposta"
            : card.direction === "REVERSE"
              ? "Resposta"
              : "Pergunta"}
        {card.direction === "REVERSE" ? " · inversa" : ""}
      </p>
      <MarkdownView markdown={isFlipped ? card.back : card.front} className="text-base text-slate-900" />
      {!isFlipped ? (
        <p className="mt-6 text-xs text-slate-400">
          Clique no cartão ou aperte espaço para ver a resposta
        </p>
      ) : null}
    </button>
  );
}
