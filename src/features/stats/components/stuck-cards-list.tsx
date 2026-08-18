import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { StuckCard } from "../types/stats.types";

export function StuckCardsList({ cards }: { cards: StuckCard[] }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-navy">Cartas travadas</h2>
          <p className="mt-1 text-sm text-slate-500">
            Nível difícil com 3 ou mais revisões — é aqui que você está mal.
          </p>
        </div>
        {cards.length > 0 ? (
          <Link
            href="/estudar"
            className="cursor-pointer text-sm font-medium text-navy underline-offset-2 hover:underline"
          >
            Estudar
          </Link>
        ) : null}
      </div>
      {cards.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Nenhuma carta travada no momento.</p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100">
          {cards.map((card) => (
            <li key={card.cardId} className="py-3 first:pt-0 last:pb-0">
              <p className="text-sm font-semibold text-navy">
                {card.code}
                <span className="ml-2 font-normal text-slate-700">
                  {previewMarkdown(card.frontMd)}
                </span>
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Vista {card.seen} vezes
                {card.lastSeenAt
                  ? ` · última em ${formatDate(card.lastSeenAt)}`
                  : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function previewMarkdown(markdown: string, max = 90): string {
  const plain = markdown
    .replace(/[#*_>`[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > max ? `${plain.slice(0, max)}…` : plain;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleDateString("pt-BR");
}
