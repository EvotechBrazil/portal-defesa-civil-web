"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEnroll } from "../hooks/use-enroll";
import type { CourseListItem } from "../types/catalog.types";

export interface CourseCardProps {
  course: CourseListItem;
}

export function CourseCard({ course }: CourseCardProps) {
  const enroll = useEnroll();

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-medium tracking-wide text-amber uppercase">
          {course.sourcePlatform ?? "Catálogo"}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-navy">{course.title}</h2>
        {course.description ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{course.description}</p>
        ) : null}
      </div>

      <div className="rounded-lg bg-slate-50 px-3 py-2">
        <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
          <span>Progresso</span>
          <span>{course.isEnrolled ? "em breve" : "matricule-se para acompanhar"}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-0 rounded-full bg-amber" />
        </div>
      </div>

      <div className="mt-auto flex flex-wrap gap-2">
        {course.isEnrolled ? (
          <Link href={`/curso/${course.slug}`}>
            <Button type="button">Abrir curso</Button>
          </Link>
        ) : (
          <Button
            type="button"
            disabled={enroll.isPending}
            onClick={() => enroll.mutate(course.slug)}
          >
            {enroll.isPending ? "Matriculando…" : "Matricular-se"}
          </Button>
        )}
        <Link href={`/curso/${course.slug}`}>
          <Button type="button" className="bg-slate-700 hover:bg-slate-700/90">
            Ver módulos
          </Button>
        </Link>
      </div>
      {enroll.isError ? (
        <p className="text-sm text-red-600">Não foi possível matricular. Tente de novo.</p>
      ) : null}
    </Card>
  );
}
