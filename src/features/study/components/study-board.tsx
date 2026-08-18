"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/stores/ui.store";
import {
  useFinishStudySession,
  useReviewStudySession,
  useStudySession,
} from "../hooks/use-study-session";
import { CurrentCardView, ReviewRating, StudySessionView } from "../types/study.types";
import { Flashcard } from "./flashcard";
import { RatingButtons } from "./rating-buttons";
import { SessionSummary } from "./session-summary";
import { TheoryPanel } from "./theory-panel";

interface StudyBoardProps {
  sessionId: string;
  courseSlug: string;
}

export function StudyBoard({ sessionId, courseSlug }: StudyBoardProps) {
  const sessionQuery = useStudySession(sessionId);
  const reviewMutation = useReviewStudySession(sessionId);
  const finishMutation = useFinishStudySession(sessionId);
  const keepTheoryOpen = useUiStore((state) => state.keepTheoryOpen);
  const setKeepTheoryOpen = useUiStore((state) => state.setKeepTheoryOpen);

  const [isFlipped, setIsFlipped] = useState(false);
  const [awaitingNext, setAwaitingNext] = useState(false);
  const [pending, setPending] = useState<StudySessionView | null>(null);
  const [displayed, setDisplayed] = useState<StudySessionView | null>(null);
  const [backCard, setBackCard] = useState<CurrentCardView | null>(null);
  const [isTurning, setIsTurning] = useState(false);

  useEffect(() => {
    if (sessionQuery.data && !awaitingNext && !isTurning) {
      setDisplayed(sessionQuery.data);
      if (sessionQuery.data.card && !isFlipped) {
        setBackCard(sessionQuery.data.card);
      }
    }
  }, [awaitingNext, isFlipped, isTurning, sessionQuery.data]);

  const flipToNext = useCallback((next: StudySessionView) => {
    if (displayed?.card && next.card) {
      setBackCard(displayed.card);
      setIsTurning(true);
    }
    setDisplayed(next);
    setPending(null);
    setAwaitingNext(false);
    setIsFlipped(false);
  }, [displayed]);

  const showNext = useCallback(() => {
    if (!pending) {
      return;
    }
    flipToNext(pending);
  }, [flipToNext, pending]);

  const handleRate = useCallback(
    (rating: ReviewRating) => {
      if (!isFlipped || awaitingNext || isTurning || reviewMutation.isPending) {
        return;
      }
      reviewMutation.mutate(rating, {
        onSuccess: (view) => {
          if (keepTheoryOpen && !view.finished) {
            setPending(view);
            setAwaitingNext(true);
            return;
          }
          flipToNext(view);
        },
      });
    },
    [awaitingNext, flipToNext, isFlipped, isTurning, keepTheoryOpen, reviewMutation],
  );

  useEffect(() => {
    if (displayed?.finished) {
      return;
    }
    function handleKey(event: KeyboardEvent) {
      // Elemento interativo em foco resolve o próprio Space/Enter. Sequestrar
      // o evento aqui deixaria botões e links inalcançáveis pelo teclado.
      const target = event.target as HTMLElement | null;
      if (
        target?.closest("input, textarea, select, button, a, [contenteditable], [role='button']")
      ) {
        return;
      }
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        if (!isFlipped) {
          setIsFlipped(true);
          return;
        }
        if (awaitingNext) {
          showNext();
        }
        return;
      }
      if (!isFlipped || awaitingNext) {
        return;
      }
      if (event.key === "1") handleRate("HARD");
      if (event.key === "2") handleRate("LEARNING");
      if (event.key === "3") handleRate("EASY");
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [awaitingNext, displayed?.finished, handleRate, isFlipped, showNext]);

  if (sessionQuery.isLoading) {
    return <p className="px-4 py-10 text-sm text-slate-600">Carregando sessão…</p>;
  }
  if (sessionQuery.isError || !displayed) {
    return (
      <p className="px-4 py-10 text-sm text-red-600">
        Não foi possível carregar a sessão. Recarregue a página.
      </p>
    );
  }

  if (displayed.finished || !displayed.card) {
    return (
      <SessionSummary
        summary={finishMutation.data}
        fallback={{ reviews: displayed.reviews, tally: displayed.tally }}
        isLoading={finishMutation.isPending}
        onFinish={() => finishMutation.mutate()}
      />
    );
  }

  return (
    <section className="mx-auto max-w-3xl space-y-4 px-4 py-8">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber">
            {displayed.deckSelector === "FULL" ? "Baralho completo" : "Essenciais"}
          </p>
          <h1 className="text-xl font-semibold text-navy">Estudar</h1>
        </div>
        <p className="text-xs text-slate-500">
          Na fila: {displayed.queueLength} · revisadas: {displayed.reviews}
        </p>
      </header>

      <Flashcard
        frontCard={displayed.card}
        backCard={backCard ?? displayed.card}
        isFlipped={isFlipped}
        onFlip={() => {
          if (!isFlipped) {
            setIsFlipped(true);
            return;
          }
          if (awaitingNext) {
            showNext();
          }
        }}
        onFlipEnd={() => {
          if (!isFlipped && displayed.card) {
            setBackCard(displayed.card);
            setIsTurning(false);
          }
        }}
      />

      {!isFlipped && !isTurning ? (
        <Button type="button" onClick={() => setIsFlipped(true)}>
          Mostrar resposta · espaço
        </Button>
      ) : awaitingNext ? (
        <div className="space-y-2">
          <p className="text-sm text-slate-600">
            Carta marcada. Pratique abaixo e avance quando quiser.
          </p>
          <Button type="button" onClick={showNext}>
            Próxima carta
          </Button>
        </div>
      ) : (
        <RatingButtons disabled={reviewMutation.isPending || isTurning} onRate={handleRate} />
      )}

      {reviewMutation.isError ? (
        <p className="text-sm text-red-600">Falha ao registrar a revisão. Tente de novo.</p>
      ) : null}

      {isFlipped ? (
        <TheoryPanel
          card={displayed.card}
          courseSlug={courseSlug}
          isOpen={keepTheoryOpen}
          onToggle={setKeepTheoryOpen}
        />
      ) : null}
    </section>
  );
}
