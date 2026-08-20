"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { useI18n } from "@/i18n/i18n-provider";
import { useCourse } from "../hooks/use-course";
import { useEnroll } from "../hooks/use-enroll";
import type { CourseModule } from "../types/catalog.types";

export function CourseDetail() {
  const { t, translateContent } = useI18n();
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug ?? "";
  const { data, isLoading, isError, refetch } = useCourse(slug);
  const enroll = useEnroll();
  const course = data?.data;
  const firstPage = course?.pages[0];

  const columns: Array<DataTableColumn<CourseModule>> = [
    {
      id: "module",
      header: t("course.moduleCol"),
      primary: true,
      cell: (row) => `${row.code} — ${translateContent(row.title)}`,
    },
    {
      id: "quizzes",
      header: t("course.quizzes"),
      chip: true,
      cell: (row) => String(row.quizCount),
    },
    {
      id: "questions",
      header: t("course.questions"),
      chip: true,
      cell: (row) => String(row.questionCount),
    },
    {
      id: "next",
      header: t("course.nextStep"),
      cell: () => t("course.viewQuestions"),
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      {isLoading ? <p className="text-mist">{t("course.loading")}</p> : null}
      {isError ? (
        <EmptyState
          tone="hard"
          title={t("course.notFound")}
          actions={
            <>
              <Button type="button" onClick={() => void refetch()}>
                {t("ui.retry")}
              </Button>
              <Link href="/biblioteca">
                <Button type="button" className="border border-line bg-panel text-paper hover:bg-inset">
                  {t("course.backLibrary")}
                </Button>
              </Link>
            </>
          }
        />
      ) : null}
      {course ? (
        <>
          <p className="font-mono text-[10.5px] font-semibold tracking-[0.12em] text-mist uppercase">
            /{t("library.title")} · {t("course.eyebrow")}
          </p>
          <header className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-paper">
                {translateContent(course.title)}
              </h1>
              {course.description ? (
                <p className="mt-2 max-w-3xl text-mist">{translateContent(course.description)}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {course.isEnrolled ? (
                <>
                  <Link href="/estudar">
                    <Button type="button" className="border border-line bg-panel text-paper hover:bg-inset">
                      {t("course.studyCards")}
                    </Button>
                  </Link>
                  {firstPage ? (
                    <Link href={`/curso/${course.slug}/${firstPage.slug}`}>
                      <Button type="button">{t("course.readMaterial")}</Button>
                    </Link>
                  ) : null}
                </>
              ) : (
                <Button
                  type="button"
                  disabled={enroll.isPending}
                  onClick={() => enroll.mutate(course.slug)}
                >
                  {enroll.isPending ? t("catalog.enrolling") : t("catalog.enroll")}
                </Button>
              )}
            </div>
          </header>
          {enroll.isError ? (
            <p className="mt-2 text-sm text-hard">{t("course.enrollError")}</p>
          ) : null}

          <div className="mt-8 grid gap-8 md:grid-cols-[16rem_1fr]">
            <nav aria-label={t("course.index")}>
              <p className="mb-2 font-mono text-[10px] font-semibold tracking-[0.12em] text-mist uppercase">
                {t("course.index")}
              </p>
              {course.pages.length === 0 ? (
                <p className="text-sm text-mist">{t("course.noPages")}</p>
              ) : (
                <ol className="flex flex-col gap-1">
                  {course.pages.map((page) => (
                    <li key={page.slug}>
                      <Link
                        href={`/curso/${course.slug}/${page.slug}`}
                        className="flex min-h-11 items-center rounded-ctl px-3 py-2 text-sm font-medium text-mist hover:bg-card hover:text-paper"
                      >
                        {page.ord} · {translateContent(page.title)}
                      </Link>
                    </li>
                  ))}
                </ol>
              )}
            </nav>

            <div>
              <DataTable
                columns={columns}
                rows={course.modules}
                rowKey={(row) => row.id}
                page={1}
                pageSize={Math.max(course.modules.length, 1)}
                total={course.modules.length}
                caption={t("course.modules")}
                empty={t("course.noModules")}
                onPageChange={() => undefined}
                onRowClick={(row) => router.push(`/questoes?moduleCode=${row.code}`)}
              />
              <p className="mt-4 rounded-ctl border border-steel/30 bg-steel-surf px-4 py-3 text-sm leading-relaxed text-steel">
                {t("course.modulesHint")}
              </p>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
