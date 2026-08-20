"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n/i18n-provider";
import { usePracticeCards, useRecentAttempts } from "../hooks/use-practice-queries";
import { PracticePanel } from "./practice-panel";

export function PracticePage() {
  const { t, translateContent } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("card") ?? "";
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const cardsQuery = usePracticeCards(page, search);
  const recentQuery = useRecentAttempts();

  const title = useMemo(() => {
    const selected = cardsQuery.data?.items.find((card) => card.id === selectedId);
    return selected ? `${selected.code} · ${translateContent(selected.front)}` : t("practice.title");
  }, [cardsQuery.data, selectedId, t, translateContent]);

  function selectCard(cardId: string) {
    router.replace(`/praticar?card=${encodeURIComponent(cardId)}`);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  return (
    <section className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <header>
        <h1 className="text-2xl font-semibold text-navy">{title}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {t("practice.description")}
        </p>
      </header>

      {selectedId ? (
        <div className="space-y-3">
          <Button
            type="button"
            onClick={() => router.replace("/praticar")}
            className="bg-slate-200 text-slate-800 hover:bg-slate-300"
          >
            {t("practice.changeCard")}
          </Button>
          <PracticePanel cardId={selectedId} />
        </div>
      ) : (
        <>
          <Card className="space-y-3">
            <h2 className="text-sm font-semibold text-navy">{t("practice.recent")}</h2>
            {recentQuery.isLoading ? (
              <p className="text-sm text-slate-500">{t("practice.recentLoading")}</p>
            ) : null}
            {recentQuery.isError ? (
              <p className="text-sm text-red-600">{t("practice.recentError")}</p>
            ) : null}
            {recentQuery.data && recentQuery.data.length === 0 ? (
              <p className="text-sm text-slate-500">{t("practice.recentEmpty")}</p>
            ) : null}
            <ul className="divide-y divide-slate-100">
              {recentQuery.data?.map((item) => (
                <li key={item.attemptId}>
                  <button
                    type="button"
                    onClick={() => selectCard(item.cardId)}
                    className="flex w-full cursor-pointer items-center justify-between gap-3 py-2 text-left hover:bg-slate-50"
                  >
                    <span className="text-sm">
                      <span className="font-medium text-navy">{item.cardCode}</span>{" "}
                      <span className="text-slate-600">{translateContent(item.cardFront)}</span>
                    </span>
                    <span className="text-xs text-slate-500">
                      {item.correctCount}/{item.totalCount} · {item.scorePct}%
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="space-y-4">
            <form className="flex flex-wrap gap-2" onSubmit={handleSearch}>
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder={t("practice.searchPlaceholder")}
                className="max-w-md"
              />
              <Button type="submit" disabled={cardsQuery.isFetching}>
                {t("common.search")}
              </Button>
            </form>

            {cardsQuery.isLoading ? (
              <p className="text-sm text-slate-500">{t("practice.cardsLoading")}</p>
            ) : null}
            {cardsQuery.isError ? (
              <p className="text-sm text-red-600">{t("practice.cardsError")}</p>
            ) : null}
            {cardsQuery.data && cardsQuery.data.items.length === 0 ? (
              <p className="text-sm text-slate-500">{t("practice.cardsEmpty")}</p>
            ) : null}

            <ul className="grid gap-2 sm:grid-cols-2">
              {cardsQuery.data?.items.map((card) => (
                <li key={card.id}>
                  <button
                    type="button"
                    onClick={() => selectCard(card.id)}
                    className="flex h-full w-full cursor-pointer flex-col rounded-lg border border-slate-200 px-3 py-3 text-left transition hover:border-amber-400 hover:bg-amber-50/40"
                  >
                    <span className="text-xs uppercase tracking-wide text-slate-500">
                      {card.deckKind === "ESSENTIAL" ? t("practice.essential") : t("practice.exam")} · {card.code}
                    </span>
                    <span className="mt-1 font-medium text-navy">{translateContent(card.front)}</span>
                    <span className="mt-1 text-xs text-slate-500">
                      {t("practice.questionCount", { count: card.questionCount })}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {cardsQuery.data && cardsQuery.data.pageCount > 1 ? (
              <div className="flex items-center justify-between text-sm">
                <Button
                  type="button"
                  disabled={page <= 1 || cardsQuery.isFetching}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="bg-slate-200 text-slate-800 hover:bg-slate-300"
                >
                  {t("common.previous")}
                </Button>
                <span className="text-slate-500">
                  {t("common.pageOf", { page: cardsQuery.data.page, pageCount: cardsQuery.data.pageCount })}
                </span>
                <Button
                  type="button"
                  disabled={page >= cardsQuery.data.pageCount || cardsQuery.isFetching}
                  onClick={() => setPage((current) => current + 1)}
                  className="bg-slate-200 text-slate-800 hover:bg-slate-300"
                >
                  {t("common.next")}
                </Button>
              </div>
            ) : null}
          </Card>
        </>
      )}
    </section>
  );
}
