"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/i18n/i18n-provider";
import { useCourses } from "../hooks/use-courses";
import { CourseCard } from "./course-card";

export function CourseCatalog() {
  const { t } = useI18n();
  const { data, isLoading, isError, refetch } = useCourses({ page: 1, pageSize: 20 });
  const courses = data?.data ?? [];
  const enrolled = courses.filter((course) => course.isEnrolled);
  const continueHref = enrolled[0] ? `/curso/${enrolled[0].slug}` : null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-paper">{t("library.title")}</h1>
          {!isLoading ? (
            <p className="mt-2 font-mono text-xs tracking-[0.14em] text-mist uppercase">
              {t("library.enrolledCount", { count: enrolled.length })}
            </p>
          ) : null}
          <p className="mt-2 max-w-[62ch] text-mist">{t("catalog.description")}</p>
        </div>
        {continueHref ? (
          <Link href={continueHref}>
            <Button type="button" className="border border-line bg-panel text-paper hover:bg-inset">
              {t("library.continueReading")}
            </Button>
          </Link>
        ) : null}
      </header>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-busy="true">
          <span className="sr-only">{t("catalog.loading")}</span>
          <CourseCardSkeleton className="lg:col-span-2" label={t("catalog.loading")} />
          <CourseCardSkeleton label={t("catalog.loading")} />
        </div>
      ) : null}

      {isError ? (
        <EmptyState
          tone="hard"
          title={t("catalog.error")}
          actions={
            <Button type="button" onClick={() => void refetch()}>
              {t("ui.retry")}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError && courses.length === 0 ? (
        <EmptyState tone="ok" title={t("catalog.empty")} />
      ) : null}

      {courses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function CourseCardSkeleton({ className, label }: { className?: string; label: string }) {
  return (
    <div className={`rounded-card border border-dashed border-line bg-panel p-6 ${className ?? ""}`}>
      <p className="font-mono text-[10px] font-semibold tracking-[0.12em] text-mist uppercase">
        {label}
      </p>
      <Skeleton className="mt-4 h-3 w-[58%]" />
      <Skeleton className="mt-4 h-11 w-full rounded-ctl" />
      <Skeleton className="mt-3 h-2 w-full" />
    </div>
  );
}
