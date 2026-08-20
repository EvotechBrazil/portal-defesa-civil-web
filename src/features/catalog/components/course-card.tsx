"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n/i18n-provider";
import { useEnroll } from "../hooks/use-enroll";
import type { CourseListItem } from "../types/catalog.types";

export interface CourseCardProps {
  course: CourseListItem;
}

export function CourseCard({ course }: CourseCardProps) {
  const { t, translateContent } = useI18n();
  const enroll = useEnroll();

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-medium tracking-wide text-flare-ink uppercase">
          {course.sourcePlatform ?? t("catalog.label")}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-paper">{translateContent(course.title)}</h2>
        {course.description ? (
          <p className="mt-2 text-sm leading-relaxed text-mist">
            {translateContent(course.description)}
          </p>
        ) : null}
      </div>

      <div className="rounded-lg bg-inset px-3 py-2">
        <div className="mb-1 flex items-center justify-between text-xs text-mist">
          <span>{t("catalog.progress")}</span>
          <span>{course.isEnrolled ? t("catalog.soon") : t("catalog.enrollToTrack")}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-inset">
          <div className="h-full w-0 rounded-full bg-primary" />
        </div>
      </div>

      <div className="mt-auto flex flex-wrap gap-2">
        {course.isEnrolled ? (
          <Link href={`/curso/${course.slug}`}>
            <Button type="button">{t("catalog.openCourse")}</Button>
          </Link>
        ) : (
          <Button
            type="button"
            disabled={enroll.isPending}
            onClick={() => enroll.mutate(course.slug)}
          >
            {enroll.isPending ? t("catalog.enrolling") : t("catalog.enroll")}
          </Button>
        )}
        <Link href={`/curso/${course.slug}`}>
          <Button type="button" className="bg-paper hover:bg-paper/90">
            {t("catalog.viewModules")}
          </Button>
        </Link>
      </div>
      {enroll.isError ? (
        <p className="text-sm text-hard">{t("catalog.enrollError")}</p>
      ) : null}
    </Card>
  );
}
