"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { baseById, CONTENT_BASES, DEFAULT_BASE_ID } from "../content-bases";
import { useCreateStudySession } from "../hooks/use-study-session";
import { StudyBoard } from "./study-board";

export function StudyDesk() {
  const router = useRouter();
  const params = useSearchParams();
  const base = baseById(params.get("base") ?? DEFAULT_BASE_ID);
  const createSession = useCreateStudySession();
  const startedFor = useRef<string | null>(null);
  const sessionId = createSession.data?.sessionId;

  useEffect(() => {
    if (base.status !== "open" || !base.courseSlug) {
      return;
    }
    if (startedFor.current === base.id) {
      return;
    }
    startedFor.current = base.id;
    createSession.reset();
    createSession.mutate({
      deckSelector: "ESSENTIAL",
      bidir: true,
      filter: "ALL",
      courseSlug: base.courseSlug,
    });
    // mutate/reset mudam de identidade a cada render do mutation — a guarda
    // startedFor impede retrigger; a dependência é só a base escolhida.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base.courseSlug, base.id, base.status]);

  return (
    <div className="study-shell">
      <div className="mx-auto max-w-[680px] px-4 py-6">
        <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-flare">
          Repetição espaçada · 80/20
        </p>
        <h1 className="mt-1 text-[clamp(22px,3vw,30px)] font-semibold tracking-tight text-paper">
          Essenciais
        </h1>
        <p className="mt-2 max-w-[62ch] text-sm text-mist">
          Pareto do material: vire a carta, marque a dificuldade, leia a teoria embaixo e
          faça a mini-prova. Fácil volta pouco. Aprendendo, no meio. Difícil repete mais.
        </p>

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
                    ? "border-flare bg-flare font-semibold text-white"
                    : "border-white/10 bg-panel text-mist hover:border-flare/40 hover:text-paper",
                  item.status === "soon" && !active && "opacity-55",
                )}
              >
                <span className="block leading-tight">{item.title}</span>
                <span className="block text-[10px] uppercase tracking-[0.06em] opacity-80">
                  {item.status === "soon" ? "Em breve · " : ""}
                  {item.subtitle}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mt-6">
          {base.status === "soon" ? (
            <div className="rounded-2xl border border-white/10 bg-panel px-5 py-10 text-center">
              <p className="text-lg font-semibold text-paper">{base.title}</p>
              <p className="mt-2 text-sm text-mist">
                Em breve · {base.subtitle}. O baralho 80/20 entra no ar depois da aula.
              </p>
            </div>
          ) : createSession.isPending && !sessionId ? (
            <p className="py-10 text-sm text-mist">Montando o baralho essenciais…</p>
          ) : createSession.isError ? (
            <p className="py-10 text-sm text-hard">
              Não foi possível abrir as cartas. Recarregue.
            </p>
          ) : sessionId ? (
            <StudyBoard key={sessionId} sessionId={sessionId} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
