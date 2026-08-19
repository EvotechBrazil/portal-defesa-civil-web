"use client";

import { MarkdownView } from "@/components/shared/markdown-view";
import { PracticePanel } from "@/features/practice/components/practice-panel";
import { CurrentCardView } from "../types/study.types";

interface TheoryPanelProps {
  card: CurrentCardView;
}

export function TheoryPanel({ card }: TheoryPanelProps) {
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-white/10 bg-panel px-4 py-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-flare">
          Material teórico
        </p>
        <MarkdownView
          tone="onDark"
          markdown={card.theoryMd}
          className="text-[15px] leading-relaxed [&_p]:text-paper"
        />
        {card.sourceMd ? (
          <p className="mt-3 rounded-xl border-l-[3px] border-flare bg-white/5 px-3 py-2 text-[13px] text-mist">
            {card.sourceMd}
          </p>
        ) : null}
      </section>
      <section>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-flare">
          Avaliação desta carta
        </p>
        <PracticePanel cardId={card.id} variant="onDark" autoResume={false} />
      </section>
    </div>
  );
}
