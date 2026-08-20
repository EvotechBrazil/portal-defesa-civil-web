"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FlashcardSkeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import { baseById, CONTENT_BASES, DEFAULT_BASE_ID } from "../content-bases";
import { useCreateStudySession } from "../hooks/use-study-session";
import type { DeckSelector } from "../types/study.types";

export function StudyDesk() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useSearchParams();
  const base = baseById(params.get("base") ?? DEFAULT_BASE_ID);
  const deckSelector: DeckSelector = params.get("modo") === "completo" ? "FULL" : "ESSENTIAL";
  const createSession = useCreateStudySession();

  function setQuery(next: { base?: string; modo?: DeckSelector }) {
    const query = new URLSearchParams(params.toString());
    const nextBase = next.base ?? base.id;
    if (nextBase === DEFAULT_BASE_ID) {
      query.delete("base");
    } else {
      query.set("base", nextBase);
    }
    const nextMode = next.modo ?? deckSelector;
    if (nextMode === "FULL") {
      query.set("modo", "completo");
    } else {
      query.delete("modo");
    }
    const search = query.toString();
    router.replace(search ? `/estudar?${search}` : "/estudar");
  }

  function start() {
    if (base.status !== "open" || !base.courseSlug) {
      return;
    }
    createSession.mutate(
      {
        deckSelector,
        bidir: true,
        filter: "ALL",
        courseSlug: base.courseSlug,
      },
      {
        onSuccess: (view) => {
          if (view.finished || !view.card) {
            return;
          }
          router.push(`/estudar/${view.sessionId}`);
        },
      },
    );
  }

  const emptyQueue = Boolean(createSession.data && (createSession.data.finished || !createSession.data.card));

  return (
    <div className="study-shell">
      <div className="mx-auto max-w-[680px] px-4 py-6">
        <p className="font-mono text-micro font-medium uppercase tracking-[0.14em] text-mist">
          {t("study.newSession")}
        </p>
        <h1 className="mt-1 text-[clamp(22px,3vw,30px)] font-semibold tracking-tight text-paper">
          {t("study.startTitle")}
        </h1>
        <p className="mt-2 max-w-[62ch] text-sm text-mist">{t("study.startHint")}</p>

        <p className="mt-6 font-mono text-micro uppercase tracking-[0.14em] text-mist">{t("study.trackStep")}</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2" aria-label={t("study.modeLabel")}>
          <ModeChoice
            selected={deckSelector === "ESSENTIAL"}
            eyebrow={t("study.recommended")}
            title={t("study.essential")}
            description={t("study.essentialCount")}
            onSelect={() => setQuery({ modo: "ESSENTIAL" })}
          />
          <ModeChoice
            selected={deckSelector === "FULL"}
            eyebrow={t("study.fullRoute")}
            title={t("study.full")}
            description={t("study.fullCount")}
            onSelect={() => setQuery({ modo: "FULL" })}
          />
        </div>

        <p className="mt-6 font-mono text-micro uppercase tracking-[0.14em] text-mist">{t("study.baseStep")}</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {CONTENT_BASES.map((item) => {
            const active = item.id === base.id;
            const soon = item.status === "soon";
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setQuery({ base: item.id })}
                className={cn(
                  "min-h-11 rounded-ctl border px-3 py-3 text-left text-sm transition",
                  active
                    ? "border-paper bg-panel font-semibold text-paper"
                    : "border-line bg-panel text-mist hover:border-paper/40 hover:text-paper",
                  soon && "border-dashed",
                )}
              >
                <span className="block leading-tight">{contentBaseText(item.id, "title", t)}</span>
                <span className="mt-0.5 block text-xs text-mist">
                  {soon ? `${t("common.soon")} · ` : null}
                  {contentBaseText(item.id, "subtitle", t)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          {base.status === "soon" ? (
            <EmptyState tone="learn" title={contentBaseText(base.id, "title", t)}>
              {t("study.soonDeck", { subtitle: contentBaseText(base.id, "subtitle", t) })}
            </EmptyState>
          ) : createSession.isPending ? (
            <FlashcardSkeleton>{t("study.buildingDeck", { mode: deckSelector === "FULL" ? t("study.modeComplete") : t("study.modeEssential") })}</FlashcardSkeleton>
          ) : createSession.isError ? (
            <EmptyState
              tone="hard"
              title={t("study.openErrorTitle")}
              actions={
                <Button type="button" onClick={start}>
                  {t("common.tryAgain")}
                </Button>
              }
            >
              {t("study.openErrorBody")}
            </EmptyState>
          ) : emptyQueue ? (
            <EmptyState
              title={t("study.queueEmptyTitle")}
              actions={
                <Button type="button" className="bg-inset text-paper hover:bg-inset" onClick={() => router.push("/desempenho")}>
                  {t("nav.performance")}
                </Button>
              }
            >
              {t("study.queueEmptyBody")}
            </EmptyState>
          ) : (
            <Button type="button" className="min-h-12 w-full sm:w-auto" onClick={start}>
              {t("study.startSession")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function contentBaseText(
  id: string,
  field: "title" | "subtitle",
  t: (key: string) => string,
): string {
  const baseKey: Record<string, string> = {
    teorico: "theory",
    "aula-1": "lesson1",
    "aula-2": "lesson2",
    "aula-3": "lesson3",
    "aula-4": "lesson4",
  };
  return t(`content.base.${baseKey[id] ?? "theory"}.${field}`);
}

function ModeChoice({
  selected,
  eyebrow,
  title,
  description,
  onSelect,
}: {
  selected: boolean;
  eyebrow: string;
  title: string;
  description: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "min-h-28 rounded-card border p-4 text-left transition duration-200 active:scale-[0.99]",
        selected ? "border-paper bg-card" : "border-line bg-panel hover:border-paper/40",
      )}
    >
      <span className="block font-mono text-micro font-medium uppercase tracking-[0.12em] text-flare-ink">
        {eyebrow}
      </span>
      <span className="mt-1 block text-base font-semibold text-paper">{title}</span>
      <span className="mt-1 block text-xs leading-relaxed text-mist">{description}</span>
    </button>
  );
}
