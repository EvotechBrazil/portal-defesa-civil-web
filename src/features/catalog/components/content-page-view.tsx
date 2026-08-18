"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MarkdownView } from "@/components/shared/markdown-view";
import { useCoursePage } from "../hooks/use-course-page";

export function ContentPageView() {
  const params = useParams<{ slug: string; pageSlug: string }>();
  const slug = params.slug ?? "";
  const pageSlug = params.pageSlug ?? "";
  const { data, isLoading, isError } = useCoursePage(slug, pageSlug);
  const page = data?.data;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm">
        <Link href={`/curso/${slug}`} className="cursor-pointer text-amber hover:underline">
          ← Voltar ao curso
        </Link>
      </p>
      {isLoading ? <p className="mt-4 text-slate-600">Carregando página…</p> : null}
      {isError ? <p className="mt-4 text-red-600">Página não encontrada.</p> : null}
      {page ? (
        <>
          <h1 className="mt-3 text-2xl font-semibold text-navy">{page.title}</h1>
          <MarkdownView className="mt-6" markdown={page.bodyMd} />
        </>
      ) : null}
    </article>
  );
}
