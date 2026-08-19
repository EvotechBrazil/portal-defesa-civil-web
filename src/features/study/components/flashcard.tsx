"use client";

import { PointerEvent, TransitionEvent, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MarkdownView } from "@/components/shared/markdown-view";
import { CurrentCardView, ReviewRating } from "../types/study.types";

const LEVEL_LABEL: Record<CurrentCardView["state"]["level"], string> = {
  NEW: "novo",
  HARD: "difícil",
  LEARNING: "aprendendo",
  EASY: "fácil",
};

const SWIPE_PX = 88;

interface FlashcardProps {
  frontCard: CurrentCardView;
  backCard: CurrentCardView;
  isFlipped: boolean;
  disabled?: boolean;
  onFlip: () => void;
  onRate: (rating: ReviewRating) => void;
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
    <div className={cn("flashcard-face", isBack && "flashcard-back")}>
      <p className="absolute top-[15px] left-[19px] text-[11px] uppercase tracking-[0.14em] text-[#9aa5b6]">
        {faceLabel(card, side)}
      </p>
      <p className="absolute top-[15px] right-[19px] text-[11px] text-[#9aa5b6]">{card.code}</p>
      <div className="flex flex-1 items-center justify-center px-1 text-center">
        <MarkdownView
          markdown={isBack ? card.back : card.front}
          className={
            isBack
              ? "text-[17.5px] leading-[1.55] text-[#e8ecf3] [&_strong]:text-[#ff7a1a]"
              : "text-[23px] font-bold leading-[1.35] text-white"
          }
        />
      </div>
      {!isBack ? (
        <p className="absolute bottom-[15px] left-0 right-0 text-center text-[11.5px] text-[#9aa5b6] opacity-70">
          Toque para virar · arraste ← fácil · arraste → difícil
        </p>
      ) : null}
      <span
        className={cn(
          "absolute bottom-[14px] left-[19px] rounded-full border px-2 py-0.5 text-[11px] uppercase",
          card.state.level === "HARD" && "border-[#e0524b] text-[#e0524b]",
          card.state.level === "LEARNING" && "border-[#eba43a] text-[#eba43a]",
          card.state.level === "EASY" && "border-[#2fbf71] text-[#2fbf71]",
          card.state.level === "NEW" && "border-[#272d38] text-[#9aa5b6]",
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
  disabled,
  onFlip,
  onRate,
  onFlipEnd,
}: FlashcardProps) {
  const startX = useRef(0);
  const startY = useRef(0);
  const dragging = useRef(false);
  const [dragX, setDragX] = useState(0);

  function handleTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.propertyName !== "transform") {
      return;
    }
    onFlipEnd?.();
  }

  function onPointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (disabled) {
      return;
    }
    dragging.current = true;
    startX.current = event.clientX;
    startY.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (!dragging.current) {
      return;
    }
    const dx = event.clientX - startX.current;
    const dy = event.clientY - startY.current;
    if (Math.abs(dx) > Math.abs(dy)) {
      setDragX(dx);
    }
  }

  function onPointerUp() {
    if (!dragging.current) {
      return;
    }
    dragging.current = false;
    const dx = dragX;
    setDragX(0);
    if (dx <= -SWIPE_PX) {
      if (!isFlipped) {
        onFlip();
        return;
      }
      onRate("EASY");
      return;
    }
    if (dx >= SWIPE_PX) {
      if (!isFlipped) {
        onFlip();
        return;
      }
      onRate("HARD");
      return;
    }
    if (Math.abs(dx) < 12) {
      onFlip();
    }
  }

  const overlay =
    dragX < -24 ? "fácil" : dragX > 24 ? "difícil" : null;

  return (
    <button
      type="button"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="flashcard-scene relative w-full cursor-pointer text-left"
      aria-label={isFlipped ? "Desvirar carta" : "Virar carta"}
      disabled={disabled}
    >
      {overlay ? (
        <span
          className={cn(
            "pointer-events-none absolute inset-x-0 top-3 z-10 text-center text-xs font-semibold uppercase tracking-[0.14em]",
            overlay === "fácil" ? "text-[#2fbf71]" : "text-[#e0524b]",
          )}
        >
          {overlay}
        </span>
      ) : null}
      <div
        className={cn(
          "flashcard-inner",
          isFlipped && "is-flipped",
          dragX !== 0 && "is-dragging",
        )}
        style={
          dragX
            ? {
                transform: `rotateY(${isFlipped ? 180 : 0}deg) rotateZ(${dragX / 28}deg) translateX(${dragX}px)`,
              }
            : undefined
        }
        onTransitionEnd={handleTransitionEnd}
      >
        <CardFace card={frontCard} side="front" />
        <CardFace card={backCard} side="back" />
      </div>
    </button>
  );
}
