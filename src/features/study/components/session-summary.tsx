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
  const levels = tally
    ? [
        { key: "hard", count: tally.HARD, bar: "bg-hard", label: t("study.hard") },
        { key: "learn", count: tally.LEARNING, bar: "bg-learn", label: t("study.learning") },
        { key: "easy", count: tally.EASY, bar: "bg-ok", label: t("study.easy") },
      ]
    : [];
  const max = Math.max(1, ...levels.map((level) => level.count));

  return (
    <section className="mx-auto max-w-xl">
      <Card className="space-y-5">
        <h1 className="text-2xl font-semibold text-paper">{t("study.sessionComplete")}</h1>
        <p className="text-sm text-mist">{t("study.roundReviews", { count: reviews })}</p>
        {levels.length > 0 ? (
          <div>
            <p className="font-mono text-micro uppercase tracking-[0.14em] text-mist">{t("study.byLevel")}</p>
            <ul className="mt-3 space-y-2">
              {levels.map((level) => (
                <li key={level.key}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-paper">{level.label}</span>
                    <span className="tabular-nums text-mist">{level.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-inset">
                    <div
                      className={`h-full rounded-full ${level.bar}`}
                      style={{ width: `${Math.round((level.count / max) * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {summary ? (
          <p className="text-sm text-paper">
            <b>
              {summary.easyCount} {t("common.of")} {summary.poolSize}
            </b>{" "}
            {t("study.easyPool")}
          </p>
        ) : (
          <Button type="button" disabled={isLoading} onClick={onFinish}>
            {isLoading ? t("study.closing") : t("study.viewSummary")}
          </Button>
        )}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/estudar"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-ctl bg-primary px-4 text-sm font-medium text-primary-ink"
          >
            {t("study.stopToday")}
          </Link>
          <Link
            href="/estudar"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-ctl border border-line bg-panel px-4 text-sm font-medium text-paper"
          >
            {t("study.newSession")}
          </Link>
        </div>
      </Card>
    </section>
  );
}
