import { Card } from "@/components/ui/card";
import type { SessionLast30d } from "../types/stats.types";

export function SessionsTimeline({ sessions }: { sessions: SessionLast30d[] }) {
  const days = reviewsByDay(sessions);
  const maxReviews = days.reduce((max, day) => Math.max(max, day.reviews), 0);

  return (
    <Card>
      <h2 className="text-base font-semibold text-navy">Sessões — últimos 30 dias</h2>
      <p className="mt-1 text-sm text-slate-500">
        {sessions.length === 0
          ? "Nenhuma sessão neste período."
          : `${sessions.length} ${sessions.length === 1 ? "sessão" : "sessões"} · ${totalReviews(sessions)} ${totalReviews(sessions) === 1 ? "revisão" : "revisões"}`}
      </p>
      <div className="mt-4 flex h-24 items-end gap-1">
        {days.map((day) => {
          const height = maxReviews === 0 ? 0 : Math.max(4, (day.reviews / maxReviews) * 100);
          return (
            <div
              key={day.date}
              title={`${formatDay(day.date)}: ${day.reviews} revisão${day.reviews === 1 ? "" : "ões"}`}
              className={`flex-1 rounded-sm ${
                day.reviews === 0 ? "bg-slate-100" : "bg-navy"
              }`}
              style={{ height: day.reviews === 0 ? "8%" : `${height}%` }}
            />
          );
        })}
      </div>
      {sessions.length > 0 ? (
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          {sessions
            .slice()
            .reverse()
            .slice(0, 5)
            .map((session) => (
              <li key={session.id} className="flex justify-between gap-3">
                <span>
                  {formatDay(session.startedAt.slice(0, 10))} ·{" "}
                  {session.deckSelector === "FULL" ? "Conteúdo completo" : "Essenciais · 80/20"}
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

function formatDay(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) {
    return isoDate;
  }
  return `${day}/${month}`;
}
