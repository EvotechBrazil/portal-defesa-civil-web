"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n-provider";
import { baseById, CONTENT_BASES, DEFAULT_BASE_ID } from "../content-bases";
import { useCreateStudySession } from "../hooks/use-study-session";
import type { DeckSelector } from "../types/study.types";
import { StudyBoard } from "./study-board";

export function StudyDesk() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useSearchParams();
  const base = baseById(params.get("base") ?? DEFAULT_BASE_ID);
  const deckSelector: DeckSelector = params.get("modo") === "completo" ? "FULL" : "ESSENTIAL";
  const createSession = useCreateStudySession();
  const startedFor = useRef<string | null>(null);
  const sessionId = createSession.data?.sessionId;

  useEffect(() => {
    if (base.status !== "open" || !base.courseSlug) {
      return;
    }
    const sessionKey = `${base.id}:${deckSelector}`;
    if (startedFor.current === sessionKey) {
      return;
    }
    startedFor.current = sessionKey;
    createSession.reset();
    createSession.mutate({
      deckSelector,
      bidir: true,
      filter: "ALL",
      courseSlug: base.courseSlug,
    });
    // mutate/reset mudam de identidade a cada render do mutation — a guarda
    // startedFor impede retrigger; a dependência é só a base escolhida.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base.courseSlug, base.id, base.status, deckSelector]);

  function selectMode(next: DeckSelector) {
    const query = new URLSearchParams(params.toString());
    if (next === "FULL") {
      query.set("modo", "completo");
    } else {
      query.delete("modo");
    }
    startedFor.current = null;
    const search = query.toString();
    router.replace(search ? `/estudar?${search}` : "/estudar");
  }

  return (
    <div className="study-shell">
      <div className="mx-auto max-w-[680px] px-4 py-6">
        <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-flare-ink">
          {t("study.spacedRepetition")} · {deckSelector === "FULL" ? t("study.coverageFull") : "80/20"}
        </p>
        <h1 className="mt-1 text-[clamp(22px,3vw,30px)] font-semibold tracking-tight text-paper">
          {deckSelector === "FULL" ? t("study.full") : t("study.essential")}
        </h1>
        <p className="mt-2 max-w-[62ch] text-sm text-mist">
          {deckSelector === "FULL"
            ? t("study.fullDescription")
            : t("study.essentialDescription")}
        </p>

        {base.id === DEFAULT_BASE_ID ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2" aria-label={t("study.modeLabel")}>
            <ModeChoice
              selected={deckSelector === "ESSENTIAL"}
              eyebrow={t("study.recommended")}
              title={t("study.essential")}
              description={t("study.essentialCount")}
              onSelect={() => selectMode("ESSENTIAL")}
            />
            <ModeChoice
              selected={deckSelector === "FULL"}
              eyebrow={t("study.fullRoute")}
              title={t("study.full")}
              description={t("study.fullCount")}
              onSelect={() => selectMode("FULL")}
            />
          </div>
        ) : null}

        <nav className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {CONTENT_BASES.map((item) => {
            const active = item.id === base.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  startedFor.current = null;
                  router.replace(`/estudar?base=${item.id}`);
                }}
                className={cn(
                  "min-h-11 shrink-0 rounded-2xl border px-3 py-2 text-left text-[13px] transition duration-200",
                  active
                    ? "border-flare bg-primary font-semibold text-primary-ink"
                    : "border-line bg-panel text-mist hover:border-flare/40 hover:text-paper",
                  item.status === "soon" && !active && "opacity-55",
                )}
              >
                <span className="block leading-tight">{contentBaseText(item.id, "title", t)}</span>
                <span className="block text-[10px] uppercase tracking-[0.06em] opacity-80">
                  {item.status === "soon" ? `${t("common.soon")} · ` : ""}
                  {contentBaseText(item.id, "subtitle", t)}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mt-6">
          {base.status === "soon" ? (
            <div className="rounded-2xl border border-line bg-panel px-5 py-10 text-center">
              <p className="text-lg font-semibold text-paper">{contentBaseText(base.id, "title", t)}</p>
              <p className="mt-2 text-sm text-mist">
                {t("study.soonDeck", { subtitle: contentBaseText(base.id, "subtitle", t) })}
              </p>
            </div>
          ) : createSession.isPending && !sessionId ? (
            <p className="py-10 text-sm text-mist">
              {t("study.buildingDeck", {
                mode: deckSelector === "FULL" ? t("study.modeComplete") : t("study.modeEssential"),
              })}
            </p>
          ) : createSession.isError ? (
            <p className="py-10 text-sm text-hard">
              {t("study.openError")}
            </p>
          ) : sessionId ? (
            <StudyBoard key={sessionId} sessionId={sessionId} />
          ) : null}
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
        "min-h-28 rounded-2xl border p-4 text-left transition duration-200 active:scale-[0.99]",
        selected
          ? "border-flare bg-flare/10 shadow-[0_0_0_1px_rgba(249,115,22,0.35)]"
          : "border-line bg-panel hover:border-flare/50",
      )}
    >
      <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-flare-ink">
        {eyebrow}
      </span>
      <span className="mt-1 block text-base font-semibold text-paper">{title}</span>
      <span className="mt-1 block text-xs leading-relaxed text-mist">{description}</span>
    </button>
  );
}
