"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n/i18n-provider";
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
  const { t } = useI18n();
  const tally = summary?.tally ?? fallback?.tally;
  const reviews = summary?.reviews ?? fallback?.reviews ?? 0;

  return (
    <section className="mx-auto max-w-xl px-4 py-10">
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold text-paper">{t("study.sessionComplete")}</h1>
        <p className="text-sm text-mist">{t("study.roundReviews", { count: reviews })}</p>
        {tally ? (
          <p className="text-sm text-paper">
            {t("study.tally", { easy: tally.EASY, learning: tally.LEARNING, hard: tally.HARD })}
          </p>
        ) : null}
        {summary ? (
          <p className="text-sm">
            <b>
              {summary.easyCount} de {summary.poolSize}
            </b>{" "}
            {t("study.easyPool")}
          </p>
        ) : (
          <Button type="button" disabled={isLoading} onClick={onFinish}>
            {isLoading ? t("study.closing") : t("study.viewSummary")}
          </Button>
        )}
        <Link
          href="/estudar"
          className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-ctl bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:bg-paper/90"
        >
          {t("study.newSession")}
        </Link>
      </Card>
    </section>
  );
}
