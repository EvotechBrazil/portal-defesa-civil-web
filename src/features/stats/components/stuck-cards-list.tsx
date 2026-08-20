"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n/i18n-provider";
import type { StuckCard } from "../types/stats.types";

export function StuckCardsList({ cards }: { cards: StuckCard[] }) {
  const { formatDate, t, translateContent } = useI18n();
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-paper">{t("stats.stuckCards")}</h2>
          <p className="mt-1 text-sm text-mist">
            {t("stats.stuckHint")}
          </p>
        </div>
        {cards.length > 0 ? (
          <Link
            href="/estudar"
            className="cursor-pointer text-sm font-medium text-paper underline-offset-2 hover:underline"
          >
            {t("stats.study")}
          </Link>
        ) : null}
      </div>
      {cards.length === 0 ? (
        <p className="mt-4 text-sm text-mist">{t("stats.noStuckNow")}</p>
      ) : (
        <ul className="mt-4 divide-y divide-line">
          {cards.map((card) => (
            <li key={card.cardId} className="py-3 first:pt-0 last:pb-0">
              <p className="text-sm font-semibold text-paper">
                {card.code}
                <span className="ml-2 font-normal text-paper">
                  {previewMarkdown(translateContent(card.frontMd))}
                </span>
              </p>
              <p className="mt-1 text-xs text-mist">
                {t("stats.seen", { count: card.seen })}
                {card.lastSeenAt
                  ? ` · ${t("stats.lastSeen", {
                      date: formatDate(card.lastSeenAt, { dateStyle: "short" }),
                    })}`
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
