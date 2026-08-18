"use client";

import { useCourses } from "../hooks/use-courses";
import { CourseCard } from "./course-card";

export function CourseCatalog() {
  const { data, isLoading, isError } = useCourses({ page: 1, pageSize: 20 });

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-navy">Biblioteca</h1>
        <p className="mt-2 text-slate-600">
          Catálogo do curso de Proteção e Defesa Civil. A matrícula libera o acompanhamento de
          progresso.
        </p>
      </header>

      {isLoading ? <p className="text-slate-600">Carregando catálogo…</p> : null}
      {isError ? (
        <p className="text-red-600">Não foi possível carregar o catálogo.</p>
      ) : null}
      {data && data.data.length === 0 ? (
        <p className="text-slate-600">Nenhum curso disponível no momento.</p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {data?.data.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
