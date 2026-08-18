"use client";

import Link from "next/link";
import { MarkdownView } from "@/components/shared/markdown-view";
import { PracticePanel } from "@/features/practice/components/practice-panel";
import { CurrentCardView } from "../types/study.types";

interface TheoryPanelProps {
  card: CurrentCardView;
  courseSlug: string;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

export function TheoryPanel({ card, courseSlug, isOpen, onToggle }: TheoryPanelProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-navy">Fundamentação</h2>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            className="cursor-pointer accent-navy"
            checked={isOpen}
            onChange={(event) => onToggle(event.target.checked)}
          />
          Manter painel aberto
        </label>
      </div>
      {isOpen ? (
        <div className="space-y-4 px-4 py-4">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Teoria
            </p>
            <MarkdownView markdown={card.theoryMd} />
          </div>
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Origem
            </p>
            <MarkdownView markdown={card.sourceMd} />
          </div>
          {card.links.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {card.links.map((link) => (
                <Link
                  key={`${link.targetSlug}-${link.label}`}
                  href={`/curso/${courseSlug}/${link.targetSlug}`}
                  className="cursor-pointer rounded-full border border-slate-200 px-3 py-1 text-xs text-navy transition hover:border-navy/40 hover:bg-slate-50"
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          ) : null}
          <PracticePanel cardId={card.id} />
        </div>
      ) : (
        <p className="px-4 py-3 text-xs text-slate-500">
          Painel fechado — marcar a dificuldade avança direto para a próxima carta.
        </p>
      )}
    </section>
  );
}
