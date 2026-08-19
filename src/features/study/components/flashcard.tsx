"use client";

import { PointerEvent, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MarkdownView } from "@/components/shared/markdown-view";
import { cardArt } from "../card-art";
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
  courseSlug?: string | null;
  isFlipped: boolean;
  disabled?: boolean;
  onFlip: () => void;
  onRate: (rating: ReviewRating) => void;
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
  art,
}: {
  card: CurrentCardView;
  side: "front" | "back";
  art: string | null;
}) {
  const isBack = side === "back";
  const showArt = isBack && art;
  return (
    <div className={cn("flashcard-face", isBack && "flashcard-back")}>
      {showArt ? (
        <img
          src={art}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      {showArt ? <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/35 to-ink/20" /> : null}
      <p className="absolute top-4 left-5 z-10 text-[11px] font-semibold uppercase tracking-[0.16em] text-mist">
        {faceLabel(card, side)}
      </p>
      <p className="absolute top-4 right-5 z-10 text-[11px] font-semibold text-flare">{card.code}</p>
      <div
        className={cn(
          "relative z-10 flex flex-1 items-center justify-center px-6 text-center",
          showArt ? "items-end pb-14 pt-16" : "px-8 pt-10 pb-12",
        )}
      >
        <MarkdownView
          tone="onDark"
          markdown={isBack ? card.back : card.front}
          className={
            isBack
              ? "text-left text-[17px] leading-snug [&_p]:my-1 [&_p]:text-paper"
              : "text-[22px] font-semibold leading-snug [&_p]:my-1 [&_p]:text-paper"
          }
        />
      </div>
      {!isBack ? (
        <p className="absolute bottom-4 left-0 right-0 z-10 text-center text-[12px] text-mist">
          Toque para virar · arraste ← fácil · arraste → difícil
        </p>
      ) : null}
      <span
        className={cn(
          "absolute bottom-4 left-5 z-10 rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-wide",
          card.state.level === "HARD" && "border-hard text-hard",
          card.state.level === "LEARNING" && "border-learn text-learn",
          card.state.level === "EASY" && "border-ok text-ok",
          card.state.level === "NEW" && "border-white/20 text-mist",
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
  courseSlug,
  isFlipped,
  disabled,
  onFlip,
  onRate,
}: FlashcardProps) {
  const startX = useRef(0);
  const startY = useRef(0);
  const dragging = useRef(false);
  const [dragX, setDragX] = useState(0);
  const art = cardArt(courseSlug, frontCard.code);

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

  const overlay = dragX < -24 ? "fácil" : dragX > 24 ? "difícil" : null;

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
            "pointer-events-none absolute inset-x-0 top-3 z-20 text-center text-xs font-semibold uppercase tracking-[0.14em]",
            overlay === "fácil" ? "text-ok" : "text-hard",
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
      >
        <CardFace card={frontCard} side="front" art={art} />
        <CardFace card={backCard} side="back" art={art} />
      </div>
    </button>
  );
}
