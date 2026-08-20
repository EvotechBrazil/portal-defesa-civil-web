"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MarkdownView } from "@/components/shared/markdown-view";
import { useI18n } from "@/i18n/i18n-provider";
import { useCourse } from "../hooks/use-course";
import { useCoursePage } from "../hooks/use-course-page";
import { useLibraryFontSize } from "../hooks/use-library-font-size";

export function ContentPageView() {
  const { t, translateContent } = useI18n();
  const params = useParams<{ slug: string; pageSlug: string }>();
  const slug = params.slug ?? "";
  const pageSlug = params.pageSlug ?? "";
  const pageQuery = useCoursePage(slug, pageSlug);
  const courseQuery = useCourse(slug);
  const { px, cycle } = useLibraryFontSize();
  const page = pageQuery.data?.data;
  const pages = courseQuery.data?.data.pages ?? [];
  const index = pages.findIndex((item) => item.slug === pageSlug);
  const prev = index > 0 ? pages[index - 1] : undefined;
  const next = index >= 0 && index < pages.length - 1 ? pages[index + 1] : undefined;

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between gap-3 border-b border-line pb-4">
        <Link
          href={`/curso/${slug}`}
          className="inline-flex size-11 items-center justify-center rounded-ctl text-paper"
          aria-label={t("course.back")}
        >
          ‹
        </Link>
        <p className="min-w-0 truncate font-mono text-xs tracking-[0.12em] text-mist uppercase">
          {page ? translateContent(page.title) : t("course.pageLoading")}
        </p>
        <button
          type="button"
          onClick={cycle}
          className="inline-flex size-11 items-center justify-center rounded-ctl text-sm font-semibold text-paper"
          aria-label={t("reader.fontSize")}
        >
          Aa
        </button>
      </header>

      {pageQuery.isLoading ? <p className="text-mist">{t("course.pageLoading")}</p> : null}
      {pageQuery.isError ? (
        <EmptyState
          tone="hard"
          title={t("error.moduleFailed")}
          actions={
            <>
              <Button type="button" onClick={() => void pageQuery.refetch()}>
                {t("ui.retry")}
              </Button>
              <Link href={`/curso/${slug}`}>
                <Button type="button" className="border border-line bg-panel text-paper hover:bg-inset">
                  {t("course.index")}
                </Button>
              </Link>
            </>
          }
        >
          {t("error.moduleFailedHint")}
        </EmptyState>
      ) : null}

      {page ? (
        <div
          className="mx-auto max-w-measure"
          style={{ ["--library-body" as string]: `${px}px` }}
        >
          <h1 className="text-3xl font-semibold tracking-tight text-balance text-paper">
            {translateContent(page.title)}
          </h1>
          <MarkdownView
            className="mt-6"
            variant="longform"
            markdown={translateContent(page.bodyMd)}
          />
          <nav className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
            {prev ? (
              <Link href={`/curso/${slug}/${prev.slug}`}>
                <Button type="button" className="border border-line bg-panel text-paper hover:bg-inset">
                  ‹ {t("reader.prev")}
                </Button>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/curso/${slug}/${next.slug}`}>
                <Button type="button">{t("reader.next")} ›</Button>
              </Link>
            ) : (
              <Link href="/estudar">
                <Button type="button">{t("course.studyCards")}</Button>
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </article>
  );
}
