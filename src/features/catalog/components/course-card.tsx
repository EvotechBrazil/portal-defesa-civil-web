"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n-provider";
import { useEnroll } from "../hooks/use-enroll";
import type { CourseListItem } from "../types/catalog.types";

export interface CourseCardProps {
  course: CourseListItem;
}

export function CourseCard({ course }: CourseCardProps) {
  const { t, translateContent } = useI18n();
  const enroll = useEnroll();
  const enrolled = course.isEnrolled;

  return (
    <Card
      className={cn(
        "flex flex-col gap-4",
        enrolled ? "border-primary bg-card lg:col-span-2" : "bg-panel",
      )}
    >
      {enrolled ? (
        <div className="flex items-start justify-between gap-3">
          <p className="font-mono text-[10.5px] font-semibold tracking-[0.12em] text-mist uppercase">
            {t("library.enrolled")}
          </p>
          <span className="inline-flex items-center rounded-chip border border-ok bg-ok-surf px-2.5 py-1 font-mono text-[10px] font-semibold text-ok">
            {t("library.active")}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <span
            className="flex size-9 items-center justify-center rounded-[10px] border border-line bg-inset text-mist"
            aria-hidden
          >
            <Lock className="size-4" strokeWidth={1.75} />
          </span>
          <p className="font-mono text-[10.5px] font-semibold tracking-[0.12em] text-mist uppercase">
            {t("library.locked")}
          </p>
        </div>
      )}

      <div>
        {course.sourcePlatform ? (
          <p className="mb-1 font-mono text-[10.5px] font-semibold tracking-[0.12em] text-mist uppercase">
            {course.sourcePlatform}
          </p>
        ) : null}
        <h2 className={cn("font-semibold text-paper", enrolled ? "text-2xl" : "text-xl")}>
          {translateContent(course.title)}
        </h2>
        {course.description ? (
          <p className="mt-2 text-sm leading-relaxed text-mist">
            {translateContent(course.description)}
          </p>
        ) : null}
        {!enrolled ? (
          <p className="mt-3 text-sm leading-relaxed text-mist">{t("library.lockedHint")}</p>
        ) : null}
      </div>

      <div className="mt-auto flex flex-wrap gap-2">
        {enrolled ? (
          <Link href={`/curso/${course.slug}`}>
            <Button type="button">{t("catalog.openCourse")}</Button>
          </Link>
        ) : (
          <>
            <Button
              type="button"
              className="border border-line bg-inset text-paper hover:bg-inset/80"
              disabled={enroll.isPending}
              onClick={() => enroll.mutate(course.slug)}
            >
              {enroll.isPending ? t("catalog.enrolling") : t("catalog.enroll")}
            </Button>
            <Link href={`/curso/${course.slug}`}>
              <Button type="button" className="border border-line bg-panel text-paper hover:bg-inset">
                {t("library.howToAccess")}
              </Button>
            </Link>
          </>
        )}
      </div>
      {enroll.isError ? (
        <p className="text-sm text-hard">{t("catalog.enrollError")}</p>
      ) : null}
    </Card>
  );
}
