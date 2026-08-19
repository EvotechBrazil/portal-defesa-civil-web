"use client";

import { useCallback, useEffect, useState } from "react";
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
}

export function StudyBoard({ sessionId }: StudyBoardProps) {
  const sessionQuery = useStudySession(sessionId);
  const reviewMutation = useReviewStudySession(sessionId);
  const finishMutation = useFinishStudySession(sessionId);

  const [isFlipped, setIsFlipped] = useState(false);
  const [displayed, setDisplayed] = useState<StudySessionView | null>(null);
  const [backCard, setBackCard] = useState<CurrentCardView | null>(null);

  useEffect(() => {
    if (sessionQuery.data) {
      setDisplayed(sessionQuery.data);
      if (sessionQuery.data.card && !isFlipped) {
        setBackCard(sessionQuery.data.card);
      }
    }
  }, [isFlipped, sessionQuery.data]);

  const handleRate = useCallback(
    (rating: ReviewRating) => {
      if (!isFlipped || reviewMutation.isPending) {
        return;
      }
      reviewMutation.mutate(rating, {
        onSuccess: (view) => {
          setIsFlipped(false);
          setDisplayed(view);
          setBackCard(view.card);
        },
      });
    },
    [isFlipped, reviewMutation],
  );

  useEffect(() => {
    if (displayed?.finished) {
      return;
    }
    function handleKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        target?.closest("input, textarea, select, button, a, [contenteditable], [role='button']")
      ) {
        return;
      }
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        setIsFlipped((current) => !current);
        return;
      }
      if (!isFlipped) {
        return;
      }
      if (event.key === "1") handleRate("HARD");
      if (event.key === "2") handleRate("LEARNING");
      if (event.key === "3") handleRate("EASY");
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [displayed?.finished, handleRate, isFlipped]);

  if (sessionQuery.isLoading) {
    return <p className="px-1 py-10 text-sm text-mist">Carregando a fila…</p>;
  }
  if (sessionQuery.isError || !displayed) {
    return (
      <p className="px-1 py-10 text-sm text-hard">
        Não foi possível carregar a sessão. Recarregue a página.
      </p>
    );
  }

  if (displayed.finished || !displayed.card) {
    return (
      <div className="rounded-2xl border border-white/10 bg-panel p-4">
        <SessionSummary
          summary={finishMutation.data}
          fallback={{ reviews: displayed.reviews, tally: displayed.tally }}
          isLoading={finishMutation.isPending}
          onFinish={() => finishMutation.mutate()}
        />
      </div>
    );
  }

  const tally = displayed.tally;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        <Stat label="Na fila" value={displayed.queueLength} />
        <Stat label="Difícil" value={tally.HARD} tone="dif" />
        <Stat label="Aprendendo" value={tally.LEARNING} tone="apr" />
        <Stat label="Fácil" value={tally.EASY} tone="fac" />
      </div>
      <p className="flex justify-between text-[12.5px] text-mist">
        <span>
          {displayed.card.direction === "REVERSE" ? "Mão dupla · inversa" : "Mão dupla · conceito → definição"}
        </span>
        <span>revisadas {displayed.reviews}</span>
      </p>

      <Flashcard
        frontCard={displayed.card}
        backCard={backCard ?? displayed.card}
        courseSlug={displayed.courseSlug}
        isFlipped={isFlipped}
        disabled={reviewMutation.isPending}
        onFlip={() => setIsFlipped((current) => !current)}
        onRate={handleRate}
      />

      {isFlipped ? (
        <RatingButtons disabled={reviewMutation.isPending} onRate={handleRate} />
      ) : (
        <p className="text-center text-[12.5px] text-mist">
          Vire a carta. Depois: Fácil ← · Aprendendo · Difícil →
        </p>
      )}

      {reviewMutation.isError ? (
        <p className="text-sm text-hard">Falha ao registrar. Tente de novo.</p>
      ) : null}

      {isFlipped ? <TheoryPanel card={displayed.card} /> : null}
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "dif" | "apr" | "fac";
}) {
  return (
    <div
      className="rounded-xl border border-white/10 border-t-[3px] bg-panel px-3 py-2.5 text-center"
      style={{
        borderTopColor:
          tone === "dif" ? "#f87171" : tone === "apr" ? "#fbbf24" : tone === "fac" ? "#34d399" : "rgba(255,255,255,0.1)",
      }}
    >
      <b
        className="block text-[22px] leading-tight"
        style={{
          color:
            tone === "dif" ? "#f87171" : tone === "apr" ? "#fbbf24" : tone === "fac" ? "#34d399" : "#f4ede4",
        }}
      >
        {value}
      </b>
      <small className="text-[11px] uppercase tracking-[0.07em] text-mist">{label}</small>
    </div>
  );
}
