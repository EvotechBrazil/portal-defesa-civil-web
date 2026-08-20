"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { FlashcardSkeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/i18n/i18n-provider";
import {
  useFinishStudySession,
  useReviewStudySession,
  useStudySession,
} from "../hooks/use-study-session";
import {
  CurrentCardView,
  ReviewRating,
  StudyFocus,
  StudySessionView,
} from "../types/study.types";
import { Flashcard } from "./flashcard";
import { RatingButtons } from "./rating-buttons";
import { SessionSummary } from "./session-summary";
import { TheoryPanel } from "./theory-panel";

interface StudyBoardProps {
  sessionId: string;
}

type Tone = "fac" | "apr" | "dif";

const TONE_COLOR: Record<Tone, string> = {
  fac: "var(--ok)",
  apr: "var(--learn)",
  dif: "var(--hard)",
};

/** Ordem espelha o gesto: fácil à esquerda, difícil à direita. */
const FOCUS_STATS: { focus: Exclude<StudyFocus, null>; labelKey: string; tone: Tone }[] = [
  { focus: "EASY", labelKey: "study.easy", tone: "fac" },
  { focus: "LEARNING", labelKey: "study.learning", tone: "apr" },
  { focus: "HARD", labelKey: "study.hard", tone: "dif" },
];

export function StudyBoard({ sessionId }: StudyBoardProps) {
  const { t } = useI18n();
  const [focus, setFocus] = useState<StudyFocus>(null);
  const sessionQuery = useStudySession(sessionId, focus);
  const reviewMutation = useReviewStudySession(sessionId, focus);
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
      if (reviewMutation.isPending) {
        return;
      }
      reviewMutation.mutate(rating, {
        onSuccess: (view) => {
          // Avança sozinho: a próxima carta já entra desvirada.
          setIsFlipped(false);
          setDisplayed(view);
          setBackCard(view.card);
        },
      });
    },
    [reviewMutation],
  );

  const changeFocus = useCallback((next: StudyFocus) => {
    setIsFlipped(false);
    setBackCard(null);
    setFocus(next);
  }, []);

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
      if (event.key === "ArrowLeft" || event.key === "3") handleRate("EASY");
      if (event.key === "ArrowRight" || event.key === "1") handleRate("HARD");
      if (event.key === "2") handleRate("LEARNING");
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [displayed?.finished, handleRate]);

  if (sessionQuery.isLoading && !displayed) {
    return <FlashcardSkeleton>{t("study.queueLoading")}</FlashcardSkeleton>;
  }
  if (sessionQuery.isError || !displayed) {
    return (
      <p className="px-1 py-10 text-sm text-hard">
        {t("study.sessionError")}
      </p>
    );
  }

  if (displayed.finished) {
    return (
      <div className="rounded-2xl border border-line bg-panel p-4">
        <SessionSummary
          summary={finishMutation.data}
          fallback={{ reviews: displayed.reviews, tally: displayed.tally }}
          isLoading={finishMutation.isPending}
          onFinish={() => finishMutation.mutate()}
        />
      </div>
    );
  }

  const levels = displayed.queueLevels;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        <Stat
          label={t("study.inQueue")}
          value={displayed.queueLength}
          active={focus === null}
          onSelect={() => changeFocus(null)}
        />
        {FOCUS_STATS.map((item) => (
          <Stat
            key={item.focus}
            label={t(item.labelKey)}
            value={levels[item.focus]}
            tone={item.tone}
            active={focus === item.focus}
            disabled={levels[item.focus] === 0 && focus !== item.focus}
            onSelect={() => changeFocus(focus === item.focus ? null : item.focus)}
          />
        ))}
      </div>
      <p className="flex justify-between text-[12.5px] text-mist">
        <span>
          {focus
            ? t("study.focus", { focus: t(`study.${focus.toLowerCase()}`) })
            : displayed.card?.direction === "REVERSE"
              ? displayed.card.deck === "EXAM"
                ? t("study.bidirAnswerQuestion")
                : t("study.bidirDefinitionConcept")
              : displayed.card?.deck === "EXAM"
                ? t("study.bidirQuestionAnswer")
                : t("study.bidirConceptDefinition")}
        </span>
        <span>{t("study.reviewed", { count: displayed.reviews })}</span>
      </p>

      {displayed.card ? (
        <>
          <Flashcard
            frontCard={displayed.card}
            backCard={backCard ?? displayed.card}
            courseSlug={displayed.courseSlug}
            isFlipped={isFlipped}
            disabled={reviewMutation.isPending}
            onFlip={() => setIsFlipped((current) => !current)}
            onRate={handleRate}
          />

          <RatingButtons disabled={reviewMutation.isPending} onRate={handleRate} />
        </>
      ) : (
        <div className="rounded-2xl border border-line bg-panel px-5 py-10 text-center">
          <p className="text-sm text-paper">
            {t("study.noCard", {
              focus: focus ? t(`study.${focus.toLowerCase()}`).toLowerCase() : t("study.queue"),
            })}
          </p>
          <button
            type="button"
            onClick={() => changeFocus(null)}
            className="mt-3 min-h-11 cursor-pointer rounded-2xl border border-flare px-4 py-2 text-sm font-semibold text-flare-ink transition duration-200 hover:bg-flare/10"
          >
            {t("study.backFullQueue")}
          </button>
        </div>
      )}

      {reviewMutation.isError ? (
        <p className="text-sm text-hard">{t("study.reviewError")}</p>
      ) : null}

      {isFlipped && displayed.card ? <TheoryPanel card={displayed.card} /> : null}
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
  active,
  disabled,
  onSelect,
}: {
  label: string;
  value: number;
  tone?: Tone;
  active: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  const color = tone ? TONE_COLOR[tone] : undefined;
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        "cursor-pointer rounded-xl border border-line border-t-[3px] bg-panel px-3 py-2.5 text-center text-paper transition duration-200",
        "hover:-translate-y-0.5 active:scale-[0.98]",
        active && "bg-black/5 dark:bg-white/[0.07]",
        disabled && "cursor-not-allowed opacity-45 hover:translate-y-0",
      )}
      style={{
        borderTopColor: tone ? color : undefined,
        ...(active ? { boxShadow: `0 0 0 2px ${color}, 0 6px 20px -12px ${color}` } : {}),
      }}
    >
      <b className="block text-[22px] leading-tight" style={{ color }}>
        {value}
      </b>
      <small className="text-[11px] uppercase tracking-[0.07em] text-mist">{label}</small>
    </button>
  );
}
