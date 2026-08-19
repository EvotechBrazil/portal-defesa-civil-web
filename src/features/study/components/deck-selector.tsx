"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
  const essential = decks.find((deck) => deck.kind === "ESSENTIAL");
  const exam = decks.find((deck) => deck.kind === "EXAM");
  const essentialCount = essential?.cardCount ?? 51;
  const examCount = exam?.cardCount ?? 133;
  const courseSlug = essential?.courseSlug ?? exam?.courseSlug ?? "defesa-civil-lgnd";

  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber">
          Repetição espaçada
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-navy">Estudar</h1>
        <p className="mt-2 text-sm text-slate-600">
          O servidor monta a fila e o sentido da carta. Seu progresso fica no banco e
          sobrevive ao F5.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <DeckChoice
          selected={value.deckSelector === "ESSENTIAL"}
          title="Essenciais · 80/20"
          description={`${essentialCount} cartas conceituais`}
          levels={essential?.levels}
          onClick={() => onChange({ ...value, deckSelector: "ESSENTIAL" satisfies DeckSelector })}
        />
        <DeckChoice
          selected={value.deckSelector === "FULL"}
          title="Conteúdo completo"
          description={`${essentialCount} conceituais + ${examCount} de prova`}
          levels={undefined}
          extra={`${essentialCount + examCount} cartas`}
          onClick={() => onChange({ ...value, deckSelector: "FULL" })}
        />
      </div>

      <Card className="flex flex-col gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="cursor-pointer accent-navy"
            checked={value.bidir}
            onChange={(event) => onChange({ ...value, bidir: event.target.checked })}
          />
          Mão dupla — alterna conceito e definição nas cartas reversíveis
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="cursor-pointer accent-navy"
            checked={value.filter === "HARD_ONLY"}
            onChange={(event) =>
              onChange({
                ...value,
                filter: event.target.checked ? "HARD_ONLY" : "ALL",
              })
            }
          />
          Só difícil + aprendendo (se vazio, cai para o baralho inteiro)
        </label>
      </Card>

      <Button type="button" disabled={isSubmitting} onClick={onStart}>
        {isSubmitting ? "Abrindo sessão…" : "Começar sessão"}
      </Button>
      <p className="text-xs text-slate-500">Curso: {courseSlug}</p>
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
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-xl border bg-white p-5 text-left shadow-sm transition hover:border-navy/40 active:scale-[0.99]",
        selected ? "border-navy ring-2 ring-navy/20" : "border-slate-200",
      )}
    >
      <p className="text-lg font-semibold text-navy">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
      {extra ? <p className="mt-1 text-xs text-slate-500">{extra}</p> : null}
      {levels ? (
        <p className="mt-3 text-xs text-slate-500">
          novo {levels.NEW} · difícil {levels.HARD} · aprendendo {levels.LEARNING} · fácil{" "}
          {levels.EASY}
        </p>
      ) : null}
    </button>
  );
}
