"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n/i18n-provider";
import { useCourse } from "../hooks/use-course";
import { useEnroll } from "../hooks/use-enroll";

export function CourseDetail() {
  const { t, translateContent } = useI18n();
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const { data, isLoading, isError } = useCourse(slug);
  const enroll = useEnroll();
  const course = data?.data;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      {isLoading ? <p className="text-mist">{t("course.loading")}</p> : null}
      {isError ? <p className="text-hard">{t("course.notFound")}</p> : null}
      {course ? (
        <>
          <p className="text-sm">
            <Link href="/biblioteca" className="cursor-pointer text-flare-ink hover:underline">
              ← {t("course.backLibrary")}
            </Link>
          </p>
          <header className="mt-3 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-paper">{translateContent(course.title)}</h1>
              {course.description ? (
                <p className="mt-2 max-w-3xl text-mist">
                  {translateContent(course.description)}
                </p>
              ) : null}
            </div>
            {course.isEnrolled ? (
              <span className="rounded-full bg-ok-surf px-3 py-1 text-sm text-ok">
                {t("course.enrolled")}
              </span>
            ) : (
              <Button
                type="button"
                disabled={enroll.isPending}
                onClick={() => enroll.mutate(course.slug)}
              >
                {enroll.isPending ? t("catalog.enrolling") : t("catalog.enroll")}
              </Button>
            )}
          </header>
          {enroll.isError ? (
            <p className="mt-2 text-sm text-hard">{t("course.enrollError")}</p>
          ) : null}

          <h2 className="mt-8 mb-3 text-lg font-semibold text-paper">{t("course.contentPages")}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {course.pages.map((page) => (
              <Link key={page.slug} href={`/curso/${course.slug}/${page.slug}`}>
                <Card className="h-full cursor-pointer transition hover:border-flare/50">
                  <p className="text-xs tracking-wide text-flare-ink uppercase">
                    {t("course.page", { number: page.ord })}
                  </p>
                  <p className="mt-1 font-medium text-paper">{translateContent(page.title)}</p>
                </Card>
              </Link>
            ))}
          </div>

          <h2 className="mt-8 mb-3 text-lg font-semibold text-paper">{t("course.modules")}</h2>
          <div className="space-y-3">
            {course.modules.map((module) => (
              <Card key={module.id} className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-paper">
                    {module.code} — {translateContent(module.title)}
                  </p>
                  <p className="text-sm text-mist">
                    {t("course.counts", { quizzes: module.quizCount, questions: module.questionCount })}
                  </p>
                </div>
                <Link href={`/questoes?moduleCode=${module.code}`}>
                  <Button type="button" className="bg-paper hover:bg-paper/90">
                    {t("course.viewQuestions")}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
