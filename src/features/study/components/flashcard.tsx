"use client";

import { TransitionEvent } from "react";
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
  frontCard: CurrentCardView;
  backCard: CurrentCardView;
  isFlipped: boolean;
  onFlip: () => void;
  onFlipEnd?: () => void;
}

function faceLabel(card: CurrentCardView, side: "front" | "back"): string {
  if (card.deck === "EXAM") {
    return side === "front" ? "Questão de prova" : "Resposta";
  }
  if (card.direction === "REVERSE") {
    return side === "front" ? "Resposta · inversa" : "Conceito · inversa";
  }
  return side === "front" ? "Pergunta" : "Resposta";
}

function CardFace({
  card,
  side,
}: {
  card: CurrentCardView;
  side: "front" | "back";
}) {
  const isBack = side === "back";
  return (
    <div
      className={cn(
        "flashcard-face p-6 shadow-sm",
        isBack
          ? "flashcard-back border border-amber/50 bg-slate-50"
          : "border border-slate-200 bg-white",
      )}
    >
      <p
        className={cn(
          "absolute top-4 left-5 text-[11px] font-semibold uppercase tracking-[0.14em]",
          isBack ? "text-amber" : "text-slate-400",
        )}
      >
        {faceLabel(card, side)}
      </p>
      <p className="absolute top-4 right-5 text-[11px] font-semibold text-navy">{card.code}</p>
      <div
        className={cn(
          "flex flex-1 items-center px-1 pt-6",
          !isBack && "justify-center px-2 text-center",
        )}
      >
        <MarkdownView
          markdown={isBack ? card.back : card.front}
          className={
            isBack
              ? "text-base leading-relaxed text-slate-900"
              : "text-xl font-semibold leading-snug text-navy"
          }
        />
      </div>
      {!isBack ? (
        <p className="mt-4 text-center text-xs text-slate-400">
          Clique no cartão ou aperte espaço para ver a resposta
        </p>
      ) : null}
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
  );
}

export function Flashcard({
  frontCard,
  backCard,
  isFlipped,
  onFlip,
  onFlipEnd,
}: FlashcardProps) {
  function handleTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.propertyName !== "transform") {
      return;
    }
    onFlipEnd?.();
  }

  return (
    <button
      type="button"
      onClick={onFlip}
      className="flashcard-scene w-full cursor-pointer text-left"
      aria-label={isFlipped ? "Carta virada" : "Virar carta"}
    >
      <div
        className={cn("flashcard-inner", isFlipped && "is-flipped")}
        onTransitionEnd={handleTransitionEnd}
      >
        <CardFace card={frontCard} side="front" />
        <CardFace card={backCard} side="back" />
      </div>
    </button>
  );
}
