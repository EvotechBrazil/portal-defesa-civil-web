"use client";

import { PointerEvent, useEffect, useRef, useState } from "react";
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

/** Distância que confirma a nota. Antes disso o arrasto só pré-visualiza. */
const SWIPE_PX = 88;
/** Movimento abaixo disso conta como toque (vira a carta). */
const TAP_PX = 12;
/** Duração da saída da carta, casada com a transição de .flashcard-inner. */
const FLY_MS = 200;

type SwipeSide = "left" | "right";

const SWIPE_RATING: Record<SwipeSide, ReviewRating> = {
  left: "EASY",
  right: "HARD",
};

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
      {showArt ? (
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/15" />
      ) : null}
      <p
        className={cn(
          "absolute top-4 left-5 z-10 text-[11px] font-semibold uppercase tracking-[0.16em]",
          showArt ? "text-white/80" : "text-mist",
        )}
      >
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
      <p className="absolute bottom-4 left-0 right-0 z-10 text-center text-[12px] text-mist">
        {isBack
          ? "Arraste ← fácil · arraste → difícil"
          : "Toque para virar · arraste ← fácil · arraste → difícil"}
      </p>
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

/** Marca de água que acompanha o arrasto e antecipa a nota que será dada. */
function SwipeOverlay({ side, strength }: { side: SwipeSide; strength: number }) {
  const isEasy = side === "left";
  return (
    <div
      className="pointer-events-none absolute inset-0 z-30 rounded-[20px]"
      style={{ opacity: 0.25 + strength * 0.75 }}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-[20px] border-2",
          isEasy ? "border-ok bg-ok/10" : "border-hard bg-hard/10",
        )}
      />
      <span
        className={cn(
          "absolute top-1/2 -translate-y-1/2 rounded-2xl border-[3px] px-4 py-2 text-[26px] font-extrabold uppercase tracking-[0.08em]",
          isEasy
            ? "left-6 -rotate-12 border-ok text-ok"
            : "right-6 rotate-12 border-hard text-hard",
        )}
        style={{ transform: `scale(${0.85 + strength * 0.25})` }}
      >
        {isEasy ? "Fácil ←" : "→ Difícil"}
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
  const flyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dragX, setDragX] = useState(0);
  const [flyOut, setFlyOut] = useState<SwipeSide | null>(null);
  const art = cardArt(courseSlug, frontCard.code);

  // Carta nova entrando: zera o arrasto e a animação de saída da anterior.
  useEffect(() => {
    setDragX(0);
    setFlyOut(null);
  }, [frontCard.id, frontCard.direction]);

  useEffect(
    () => () => {
      if (flyTimer.current) {
        clearTimeout(flyTimer.current);
      }
    },
    [],
  );

  function onPointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (disabled || flyOut) {
      return;
    }
    dragging.current = true;
    startX.current = event.clientX;
    startY.current = event.clientY;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Sem captura o arrasto ainda funciona enquanto o ponteiro ficar na carta.
    }
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

  function commitSwipe(side: SwipeSide) {
    setFlyOut(side);
    setDragX(0);
    flyTimer.current = setTimeout(() => onRate(SWIPE_RATING[side]), FLY_MS);
  }

  function onPointerUp() {
    if (!dragging.current) {
      return;
    }
    dragging.current = false;
    const dx = dragX;
    setDragX(0);
    // Estudar a carta acontece antes do gesto: soltar já nota e puxa a próxima.
    if (dx <= -SWIPE_PX) {
      commitSwipe("left");
      return;
    }
    if (dx >= SWIPE_PX) {
      commitSwipe("right");
      return;
    }
    if (Math.abs(dx) < TAP_PX) {
      onFlip();
    }
  }

  const side: SwipeSide | null =
    flyOut ?? (dragX < -TAP_PX ? "left" : dragX > TAP_PX ? "right" : null);
  const strength = flyOut ? 1 : Math.min(1, Math.abs(dragX) / SWIPE_PX);

  return (
    <button
      type="button"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="flashcard-scene relative w-full cursor-pointer text-left"
      aria-label={isFlipped ? "Desvirar carta" : "Virar carta"}
      disabled={disabled && !flyOut}
    >
      {side ? <SwipeOverlay side={side} strength={strength} /> : null}
      <div
        className={cn(
          "flashcard-inner",
          isFlipped && "is-flipped",
          dragX !== 0 && "is-dragging",
        )}
        style={
          flyOut
            ? {
                transform: `rotateY(${isFlipped ? 180 : 0}deg) rotateZ(${
                  flyOut === "left" ? -18 : 18
                }deg) translateX(${flyOut === "left" ? -140 : 140}%)`,
                opacity: 0,
                transitionDuration: `${FLY_MS}ms`,
              }
            : dragX
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
