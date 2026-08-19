"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/i18n-provider";
import { useCourse } from "@/features/catalog/hooks/use-course";
import { questionsFilterSchema } from "../schemas/questions-filter.schema";
import { useQuestions } from "../hooks/use-questions";
import type { QuestionBankMode } from "../types/questions.types";
import { QuestionFilters } from "./question-filters";
import { QuestionItem } from "./question-item";

const COURSE_SLUG = "defesa-civil-lgnd";

export function QuestionsBank() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const parsed = questionsFilterSchema.safeParse({
    moduleCode: searchParams.get("moduleCode") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ?? 1,
    pageSize: searchParams.get("pageSize") ?? 20,
  });
  const initial = parsed.success
    ? parsed.data
    : { page: 1, pageSize: 20, moduleCode: undefined, search: undefined };

  const [moduleCode, setModuleCode] = useState(initial.moduleCode ?? "");
  const [searchInput, setSearchInput] = useState(initial.search ?? "");
  const [search, setSearch] = useState(initial.search ?? "");
  const [page, setPage] = useState(initial.page);
  const [mode, setMode] = useState<QuestionBankMode>("study");

  const filter = useMemo(
    () => ({
      moduleCode: moduleCode || undefined,
      search: search || undefined,
      page,
      pageSize: 20,
    }),
    [moduleCode, search, page],
  );

  const courseQuery = useCourse(COURSE_SLUG);
  const questionsQuery = useQuestions(filter);
  const modules = courseQuery.data?.data.modules ?? [];
  const questions = questionsQuery.data?.data ?? [];
  const meta = questionsQuery.data?.meta;

  function handleModuleChange(next: string) {
    setModuleCode(next);
    setPage(1);
  }

  function handleSearchSubmit(next: string) {
    setSearch(next.trim());
    setPage(1);
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-navy">{t("questions.title")}</h1>
        <p className="mt-2 text-slate-600">
          {t("questions.description", { count: meta?.total ?? "…" })}
        </p>
      </header>

      <QuestionFilters
        modules={modules}
        moduleCode={moduleCode}
        search={searchInput}
        mode={mode}
        onModuleChange={handleModuleChange}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
        onModeChange={setMode}
      />

      <div className="mt-6">
        {questionsQuery.isLoading ? <p className="text-slate-600">{t("questions.loading")}</p> : null}
        {questionsQuery.isError ? (
          <p className="text-red-600">{t("questions.error")}</p>
        ) : null}
        {!questionsQuery.isLoading && questions.length === 0 ? (
          <p className="text-slate-600">{t("questions.empty")}</p>
        ) : null}

        <div className="space-y-4">
          {questions.map((question, index) => (
            <QuestionItem
              key={question.id}
              question={question}
              index={(page - 1) * 20 + index + 1}
              mode={mode}
            />
          ))}
        </div>
      </div>

      {meta && (meta.pageCount ?? 0) > 1 ? (
        <div className="mt-6 flex items-center justify-between">
          <Button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="bg-slate-700 hover:bg-slate-700/90"
          >
            {t("common.previous")}
          </Button>
          <p className="text-sm text-slate-600">
            {t("questions.pagination", {
              page: meta.page ?? page,
              pageCount: meta.pageCount ?? 1,
              total: meta.total ?? questions.length,
            })}
          </p>
          <Button
            type="button"
            disabled={page >= (meta.pageCount ?? 1)}
            onClick={() => setPage((current) => current + 1)}
            className="bg-slate-700 hover:bg-slate-700/90"
          >
            {t("common.next")}
          </Button>
        </div>
      ) : meta ? (
        <p className="mt-6 text-center text-sm text-slate-600">
          {t("questions.total", { total: meta.total ?? questions.length })}
        </p>
      ) : null}
    </section>
  );
}
