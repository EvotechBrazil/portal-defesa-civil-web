"use client";

import { MarkdownView } from "@/components/shared/markdown-view";
import { PracticePanel } from "@/features/practice/components/practice-panel";
import { CurrentCardView } from "../types/study.types";

interface TheoryPanelProps {
  card: CurrentCardView;
}

export function TheoryPanel({ card }: TheoryPanelProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-[14px] border border-[#272d38] bg-[#161a21] px-4 py-4">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ff7a1a]">
          Material teórico
        </p>
        <MarkdownView
          markdown={card.theoryMd}
          className="text-[14.5px] leading-relaxed text-[#e8ecf3] [&_strong]:text-white"
        />
        {card.sourceMd ? (
          <p className="mt-3 border-l-[3px] border-[#ff7a1a] bg-[#1c212a] px-3 py-2 text-[13px] text-[#9aa5b6]">
            {card.sourceMd}
          </p>
        ) : null}
      </section>
      <section>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ff7a1a]">
          Avaliação desta carta
        </p>
        <PracticePanel cardId={card.id} />
      </section>
    </div>
  );
}
