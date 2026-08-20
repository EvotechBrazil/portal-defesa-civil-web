"use client";

import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n/i18n-provider";
import type { SessionLast30d } from "../types/stats.types";

export function SessionsTimeline({ sessions }: { sessions: SessionLast30d[] }) {
  const { formatDate, t } = useI18n();
  const days = reviewsByDay(sessions);
  const maxReviews = days.reduce((max, day) => Math.max(max, day.reviews), 0);

  return (
    <Card>
      <h2 className="text-base font-semibold text-paper">{t("stats.sessions")}</h2>
      <p className="mt-1 text-sm text-mist">
        {sessions.length === 0
          ? t("stats.noSessions")
          : t("stats.sessionSummary", {
              sessions: sessions.length,
              reviews: totalReviews(sessions),
            })}
      </p>
      <div className="mt-4 flex h-24 items-end gap-1">
        {days.map((day) => {
          const height = maxReviews === 0 ? 0 : Math.max(4, (day.reviews / maxReviews) * 100);
          return (
            <div
              key={day.date}
              title={`${formatDate(`${day.date}T12:00:00Z`, { day: "2-digit", month: "2-digit" })}: ${t("stats.reviewCount", { count: day.reviews })}`}
              className={`flex-1 rounded-sm ${
                day.reviews === 0 ? "bg-inset" : "bg-paper"
              }`}
              style={{ height: day.reviews === 0 ? "8%" : `${height}%` }}
            />
          );
        })}
      </div>
      {sessions.length > 0 ? (
        <ul className="mt-4 space-y-2 text-sm text-mist">
          {sessions
            .slice()
            .reverse()
            .slice(0, 5)
            .map((session) => (
              <li key={session.id} className="flex justify-between gap-3">
                <span>
                  {formatDate(session.startedAt, { day: "2-digit", month: "2-digit" })} ·{" "}
                  {session.deckSelector === "FULL" ? t("study.full") : t("study.essential")}
                </span>
                <span className="tabular-nums">
                  {session.reviews} rev. · D{session.tally.HARD} A{session.tally.LEARNING} F
                  {session.tally.EASY}
                </span>
              </li>
            ))}
        </ul>
      ) : null}
    </Card>
  );
}

function totalReviews(sessions: SessionLast30d[]): number {
  return sessions.reduce((sum, session) => sum + session.reviews, 0);
}

function reviewsByDay(sessions: SessionLast30d[]): Array<{ date: string; reviews: number }> {
  const today = startOfUtcDay(new Date());
  const byDate = new Map<string, number>();
  for (const session of sessions) {
    const key = session.startedAt.slice(0, 10);
    byDate.set(key, (byDate.get(key) ?? 0) + session.reviews);
  }

  const days: Array<{ date: string; reviews: number }> = [];
  for (let offset = 29; offset >= 0; offset -= 1) {
    const day = new Date(today);
    day.setUTCDate(today.getUTCDate() - offset);
    const key = day.toISOString().slice(0, 10);
    days.push({ date: key, reviews: byDate.get(key) ?? 0 });
  }
  return days;
}

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
