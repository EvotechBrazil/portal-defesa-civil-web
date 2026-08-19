"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CourseModule } from "@/features/catalog/types/catalog.types";
import { useI18n } from "@/i18n/i18n-provider";
import type { QuestionBankMode } from "../types/questions.types";

export interface QuestionFiltersProps {
  modules: CourseModule[];
  moduleCode: string;
  search: string;
  mode: QuestionBankMode;
  onModuleChange: (moduleCode: string) => void;
  onSearchChange: (search: string) => void;
  onSearchSubmit: (search: string) => void;
  onModeChange: (mode: QuestionBankMode) => void;
}

export function QuestionFilters({
  modules,
  moduleCode,
  search,
  mode,
  onModuleChange,
  onSearchChange,
  onSearchSubmit,
  onModeChange,
}: QuestionFiltersProps) {
  const { t } = useI18n();
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearchSubmit(search);
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row">
        <label className="flex min-w-48 flex-col gap-1 text-sm text-slate-600">
          {t("questions.module")}
          <select
            value={moduleCode}
            onChange={(event) => onModuleChange(event.target.value)}
            className="h-10 cursor-pointer rounded-md border border-slate-300 bg-white px-3 text-sm outline-none ring-amber-500 focus:ring-2"
          >
            <option value="">{t("questions.allModules")}</option>
            {modules.map((module) => (
              <option key={module.id} value={module.code}>
                {module.code} — {module.title} ({module.questionCount})
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm text-slate-600">
          {t("questions.searchLabel")}
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t("questions.searchPlaceholder")}
          />
        </label>
        <div className="flex items-end">
          <Button type="submit">{t("common.search")}</Button>
        </div>
      </form>

      <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
        <button
          type="button"
          onClick={() => onModeChange("study")}
          className={`cursor-pointer rounded-md px-3 py-1.5 text-sm ${
            mode === "study" ? "bg-navy text-white" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          {t("questions.studyMode")}
        </button>
        <button
          type="button"
          onClick={() => onModeChange("answer-key")}
          className={`cursor-pointer rounded-md px-3 py-1.5 text-sm ${
            mode === "answer-key" ? "bg-navy text-white" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          {t("questions.answerKeyMode")}
        </button>
      </div>
    </div>
  );
}
