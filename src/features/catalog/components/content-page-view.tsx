"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MarkdownView } from "@/components/shared/markdown-view";
import { useI18n } from "@/i18n/i18n-provider";
import { useCoursePage } from "../hooks/use-course-page";

export function ContentPageView() {
  const { t, translateContent } = useI18n();
  const params = useParams<{ slug: string; pageSlug: string }>();
  const slug = params.slug ?? "";
  const pageSlug = params.pageSlug ?? "";
  const { data, isLoading, isError } = useCoursePage(slug, pageSlug);
  const page = data?.data;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm">
        <Link href={`/curso/${slug}`} className="cursor-pointer text-flare-ink hover:underline">
          ← {t("course.back")}
        </Link>
      </p>
      {isLoading ? <p className="mt-4 text-mist">{t("course.pageLoading")}</p> : null}
      {isError ? <p className="mt-4 text-hard">{t("course.pageNotFound")}</p> : null}
      {page ? (
        <>
          <h1 className="mt-3 text-2xl font-semibold text-paper">{translateContent(page.title)}</h1>
          <MarkdownView className="mt-6" markdown={translateContent(page.bodyMd)} />
        </>
      ) : null}
    </article>
  );
}
