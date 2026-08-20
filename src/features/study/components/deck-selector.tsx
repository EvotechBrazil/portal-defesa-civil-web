"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n-provider";
import { CreateStudySessionForm } from "../schemas/study.schema";
import { DeckListItem, DeckSelector } from "../types/study.types";

interface DeckSelectorProps {
  decks: DeckListItem[];
  value: CreateStudySessionForm;
  isSubmitting: boolean;
  onChange: (next: CreateStudySessionForm) => void;
  onStart: () => void;
}

export function DeckSelectorPanel({
  decks,
  value,
  isSubmitting,
  onChange,
  onStart,
}: DeckSelectorProps) {
  const { t } = useI18n();
  const essential = decks.find((deck) => deck.kind === "ESSENTIAL");
  const exam = decks.find((deck) => deck.kind === "EXAM");
  const essentialCount = essential?.cardCount ?? 51;
  const examCount = exam?.cardCount ?? 133;
  const courseSlug = essential?.courseSlug ?? exam?.courseSlug ?? "defesa-civil-lgnd";

  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flare-ink">
          {t("study.spacedRepetition")}
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-paper">{t("study.studyTitle")}</h1>
        <p className="mt-2 text-sm text-mist">{t("study.selectorDescription")}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <DeckChoice
          selected={value.deckSelector === "ESSENTIAL"}
          title={t("study.essential")}
          description={t("study.conceptCards", { count: essentialCount })}
          levels={essential?.levels}
          onClick={() => onChange({ ...value, deckSelector: "ESSENTIAL" satisfies DeckSelector })}
        />
        <DeckChoice
          selected={value.deckSelector === "FULL"}
          title={t("study.full")}
          description={t("study.fullDeckDescription", { essential: essentialCount, exam: examCount })}
          levels={undefined}
          extra={t("study.cardCount", { count: essentialCount + examCount })}
          onClick={() => onChange({ ...value, deckSelector: "FULL" })}
        />
      </div>

      <Card className="flex flex-col gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="cursor-pointer accent-primary"
            checked={value.bidir}
            onChange={(event) => onChange({ ...value, bidir: event.target.checked })}
          />
          {t("study.bidir")}
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="cursor-pointer accent-primary"
            checked={value.filter === "HARD_ONLY"}
            onChange={(event) =>
              onChange({
                ...value,
                filter: event.target.checked ? "HARD_ONLY" : "ALL",
              })
            }
          />
          {t("study.hardOnly")}
        </label>
      </Card>

      <Button type="button" disabled={isSubmitting} onClick={onStart}>
        {isSubmitting ? t("study.openingSession") : t("study.startSession")}
      </Button>
      <p className="text-xs text-mist">{t("common.course")}: {courseSlug}</p>
    </section>
  );
}

function DeckChoice({
  selected,
  title,
  description,
  extra,
  levels,
  onClick,
}: {
  selected: boolean;
  title: string;
  description: string;
  extra?: string;
  levels?: DeckListItem["levels"];
  onClick: () => void;
}) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-card border bg-panel p-5 text-left transition hover:border-paper/40 active:scale-[0.99]",
        selected ? "border-paper ring-2 ring-paper/20" : "border-line",
      )}
    >
      <p className="text-lg font-semibold text-paper">{title}</p>
      <p className="mt-1 text-sm text-mist">{description}</p>
      {extra ? <p className="mt-1 text-xs text-mist">{extra}</p> : null}
      {levels ? (
        <p className="mt-3 text-xs text-mist">
          {t("study.levelSummary", {
            new: levels.NEW,
            hard: levels.HARD,
            learning: levels.LEARNING,
            easy: levels.EASY,
          })}
        </p>
      ) : null}
    </button>
  );
}
