"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FinishSessionView, ReviewTally } from "../types/study.types";

interface SessionSummaryProps {
  summary?: FinishSessionView;
  fallback?: { reviews: number; tally: ReviewTally };
  isLoading: boolean;
  onFinish: () => void;
}

export function SessionSummary({
  summary,
  fallback,
  isLoading,
  onFinish,
}: SessionSummaryProps) {
  const tally = summary?.tally ?? fallback?.tally;
  const reviews = summary?.reviews ?? fallback?.reviews ?? 0;

  return (
    <section className="mx-auto max-w-xl px-4 py-10">
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold text-navy">Sessão concluída</h1>
        <p className="text-sm text-slate-600">{reviews} revisões nesta rodada.</p>
        {tally ? (
          <p className="text-sm text-slate-700">
            {tally.EASY} fácil · {tally.LEARNING} aprendendo · {tally.HARD} difícil
          </p>
        ) : null}
        {summary ? (
          <p className="text-sm">
            <b>
              {summary.easyCount} de {summary.poolSize}
            </b>{" "}
            cartas do baralho atual já estão no nível fácil.
          </p>
        ) : (
          <Button type="button" disabled={isLoading} onClick={onFinish}>
            {isLoading ? "Fechando…" : "Ver resumo"}
          </Button>
        )}
        <Link
          href="/estudar"
          className="inline-flex cursor-pointer items-center justify-center rounded-md bg-navy px-4 py-2 text-sm font-medium text-white transition hover:bg-navy/90"
        >
          Nova sessão
        </Link>
      </Card>
    </section>
  );
}
