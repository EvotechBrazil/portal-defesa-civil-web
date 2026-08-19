"use client";

import { useCourses } from "../hooks/use-courses";
import { CourseCard } from "./course-card";
import { useI18n } from "@/i18n/i18n-provider";

export function CourseCatalog() {
  const { t } = useI18n();
  const { data, isLoading, isError } = useCourses({ page: 1, pageSize: 20 });

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-navy">{t("catalog.title")}</h1>
        <p className="mt-2 text-slate-600">{t("catalog.description")}</p>
      </header>

      {isLoading ? <p className="text-slate-600">{t("catalog.loading")}</p> : null}
      {isError ? (
        <p className="text-red-600">{t("catalog.error")}</p>
      ) : null}
      {data && data.data.length === 0 ? (
        <p className="text-slate-600">{t("catalog.empty")}</p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {data?.data.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
