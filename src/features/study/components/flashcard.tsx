"use client";

import { PointerEvent, memo, useCallback, useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MarkdownView } from "@/components/shared/markdown-view";
import { useI18n } from "@/i18n/i18n-provider";
import { CardArt, cardArt } from "../card-art";
import { CurrentCardView, ReviewRating } from "../types/study.types";

/** Distância que confirma a nota. Antes disso o arrasto só pré-visualiza. */
const SWIPE_PX = 88;
/** Movimento abaixo disso conta como toque (vira a carta). */
const TAP_PX = 12;
/** Duração da saída da carta. */
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

function faceLabel(card: CurrentCardView, side: "front" | "back", t: (key: string) => string): string {
  if (card.deck === "EXAM") {
    if (card.direction === "REVERSE") {
      return side === "front" ? t("study.face.reverseAnswer") : t("study.face.originalQuestion");
    }
    return side === "front" ? t("study.face.examQuestion") : t("study.face.correctAnswer");
  }
  if (card.direction === "REVERSE") {
    return side === "front" ? t("study.face.reverseAnswer") : t("study.face.reverseConcept");
  }
  return side === "front" ? t("study.face.question") : t("study.face.answer");
}

const CardFace = memo(function CardFace({
  card,
  side,
  art,
  textHidden = false,
}: {
  card: CurrentCardView;
  side: "front" | "back";
  art: CardArt | null;
  textHidden?: boolean;
}) {
  const { locale, t, translateContent } = useI18n();
  const isBack = side === "back";
  const showArt = isBack && art;
  return (
    <div className={cn("flashcard-face", isBack && "flashcard-back")}>
      <div className="flashcard-face-clip">
      {showArt ? (
        <Image
          src={art.src}
          alt={textHidden ? (locale === "pt-BR" ? art.alt : t("study.cardImageAlt", { code: card.code })) : ""}
          fill
          sizes="(max-width: 680px) 100vw, 680px"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      {showArt && !textHidden ? (
        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/35 to-ink/20" />
      ) : null}
      {!textHidden ? (
        <>
          <p className="absolute top-4 left-5 z-10 text-[11px] font-semibold uppercase tracking-[0.16em] text-mist">
            {faceLabel(card, side, t)}
          </p>
          <p
            className={cn(
              "absolute top-4 z-10 text-[11px] font-semibold text-flare-ink",
              showArt ? "right-16" : "right-5",
            )}
          >
            {card.code}
          </p>
          <div
            className={cn(
              "relative z-10 flex flex-1 items-center justify-center px-6 text-center",
              showArt ? "items-end pb-14 pt-16" : "px-8 pt-10 pb-12",
            )}
          >
            {/* As duas faces usam a mesma tipografia: a resposta só muda de cor
                (o <strong> vira flare), nunca de tamanho ou alinhamento. */}
            <MarkdownView
              tone="onDark"
              markdown={translateContent(isBack ? card.back : card.front)}
              className="text-[22px] font-semibold leading-snug [&_p]:my-1 [&_p]:text-paper"
            />
          </div>
          <p className="absolute bottom-4 left-0 right-0 z-10 text-center text-[12px] text-mist">
            {isBack
              ? t("study.swipeBack")
              : t("study.tapAndSwipe")}
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
            {t(`study.${card.state.level.toLowerCase()}`)}
          </span>
        </>
      ) : null}
      </div>
    </div>
  );
});

/**
 * Cor do arrasto interpolada em uma faixa contínua:
 * verde (fácil, esquerda) → amarelo (neutro, centro) → vermelho (difícil, direita).
 * `t` vai de -1 a 1. color-mix mantém os tokens de tema claro/escuro.
 */
function swipeColor(t: number): string {
  const token = t < 0 ? "var(--ok)" : "var(--hard)";
  return `color-mix(in srgb, ${token} ${Math.abs(t) * 100}%, var(--learn))`;
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
  const { t } = useI18n();
  const dragRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const leftLabelRef = useRef<HTMLSpanElement>(null);
  const rightLabelRef = useRef<HTMLSpanElement>(null);

  const startX = useRef(0);
  const startY = useRef(0);
  const dragX = useRef(0);
  const dragging = useRef(false);
  const flying = useRef(false);
  const frame = useRef<number | null>(null);
  const flyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [artTextHidden, setArtTextHidden] = useState(false);

  const art = cardArt(courseSlug, frontCard.code);

  /**
   * Pinta arrasto e overlay direto no DOM. Fora do ciclo de render do React,
   * a carta acompanha o ponteiro quadro a quadro mesmo com markdown pesado.
   */
  const paint = useCallback((dx: number) => {
    const drag = dragRef.current;
    const overlay = overlayRef.current;
    if (!drag || !overlay) {
      return;
    }
    drag.style.transform = `translate3d(${dx}px, 0, 0) rotateZ(${dx / 28}deg)`;

    const t = Math.max(-1, Math.min(1, dx / SWIPE_PX));
    const strength = Math.abs(t);
    const color = swipeColor(t);
    const fade = dx === 0 ? 0 : 0.4 + strength * 0.6;

    overlay.style.opacity = String(fade);
    overlay.style.borderColor = color;
    overlay.style.borderWidth = `${2 + strength}px`;
    overlay.style.background = `linear-gradient(${
      t < 0 ? 270 : 90
    }deg, color-mix(in srgb, ${color} ${6 + strength * 10}%, transparent), transparent 72%)`;
    overlay.style.boxShadow = `0 0 34px -12px color-mix(in srgb, ${color} ${strength * 85}%, transparent)`;

    for (const [ref, side] of [
      [leftLabelRef, "left"],
      [rightLabelRef, "right"],
    ] as const) {
      const label = ref.current;
      if (!label) {
        continue;
      }
      const active = side === "left" ? t < 0 : t > 0;
      label.style.color = color;
      label.style.borderColor = color;
      label.style.opacity = active ? String(0.3 + strength * 0.7) : "0";
      label.style.transform = `translateY(-50%) rotate(${
        side === "left" ? -8 : 8
      }deg) scale(${0.85 + strength * 0.25})`;
    }
  }, []);

  const schedulePaint = useCallback(
    (dx: number) => {
      dragX.current = dx;
      if (frame.current !== null) {
        return;
      }
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        paint(dragX.current);
      });
    },
    [paint],
  );

  const settle = useCallback(() => {
    const drag = dragRef.current;
    if (drag) {
      drag.style.transition = "";
    }
    dragX.current = 0;
    paint(0);
  }, [paint]);

  // Carta nova entrando: zera arrasto, overlay e a animação de saída da anterior.
  useEffect(() => {
    flying.current = false;
    setArtTextHidden(false);
    const drag = dragRef.current;
    if (drag) {
      drag.style.transition = "";
      drag.style.opacity = "";
    }
    dragX.current = 0;
    paint(0);
  }, [frontCard.id, frontCard.direction, paint]);

  useEffect(() => {
    if (!isFlipped) {
      setArtTextHidden(false);
    }
  }, [isFlipped]);

  useEffect(
    () => () => {
      if (flyTimer.current) {
        clearTimeout(flyTimer.current);
      }
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
      }
    },
    [],
  );

  function onPointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (disabled || flying.current) {
      return;
    }
    dragging.current = true;
    startX.current = event.clientX;
    startY.current = event.clientY;
    if (dragRef.current) {
      dragRef.current.style.transition = "none";
    }
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
      schedulePaint(dx);
    }
  }

  function commitSwipe(side: SwipeSide) {
    const drag = dragRef.current;
    flying.current = true;
    if (drag) {
      drag.style.transition = `transform ${FLY_MS}ms ease-out, opacity ${FLY_MS}ms ease-out`;
      drag.style.transform = `translate3d(${
        side === "left" ? "-140%" : "140%"
      }, 0, 0) rotateZ(${side === "left" ? -18 : 18}deg)`;
      drag.style.opacity = "0";
    }
    flyTimer.current = setTimeout(() => onRate(SWIPE_RATING[side]), FLY_MS);
  }

  function onPointerUp() {
    if (!dragging.current) {
      return;
    }
    dragging.current = false;
    const dx = dragX.current;
    // Estudar a carta acontece antes do gesto: soltar já nota e puxa a próxima.
    if (dx <= -SWIPE_PX || dx >= SWIPE_PX) {
      commitSwipe(dx < 0 ? "left" : "right");
      dragX.current = 0;
      paint(0);
      return;
    }
    settle();
    if (Math.abs(dx) < TAP_PX) {
      onFlip();
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="flashcard-scene relative w-full cursor-pointer text-left"
        aria-label={isFlipped ? t("study.unflip") : t("study.flip")}
        disabled={disabled}
      >
        <div
          ref={overlayRef}
          aria-hidden
          className="swipe-overlay pointer-events-none absolute inset-0 z-30 rounded-[20px] border-2 border-transparent opacity-0"
        >
          <span
            ref={leftLabelRef}
            className="absolute top-1/2 left-6 rounded-2xl border-[3px] border-transparent px-4 py-2 text-[26px] font-extrabold uppercase tracking-[0.08em] opacity-0"
          >
            {t("study.easy")} ←
          </span>
          <span
            ref={rightLabelRef}
            className="absolute top-1/2 right-6 rounded-2xl border-[3px] border-transparent px-4 py-2 text-[26px] font-extrabold uppercase tracking-[0.08em] opacity-0"
          >
            → {t("study.hard")}
          </span>
        </div>
        <div ref={dragRef} className="flashcard-drag">
          <div className={cn("flashcard-inner", isFlipped && "is-flipped")}>
            <CardFace card={frontCard} side="front" art={art} />
            <CardFace card={backCard} side="back" art={art} textHidden={artTextHidden} />
          </div>
        </div>
      </button>
      {art && isFlipped ? (
        <button
          type="button"
          onClick={() => setArtTextHidden((current) => !current)}
          aria-label={
            artTextHidden
              ? t("study.showTexts")
              : t("study.hideTexts")
          }
          aria-pressed={artTextHidden}
          title={artTextHidden ? t("study.showTextsShort") : t("study.imageOnly")}
          disabled={disabled}
          className="absolute right-3 top-3 z-40 flex size-11 items-center justify-center rounded-full border border-white/25 bg-scrim text-white shadow-lg backdrop-blur-sm transition duration-200 hover:border-flare hover:bg-scrim disabled:cursor-not-allowed disabled:opacity-50"
        >
          {artTextHidden ? <EyeOff aria-hidden size={20} /> : <Eye aria-hidden size={20} />}
        </button>
      ) : null}
    </div>
  );
}
