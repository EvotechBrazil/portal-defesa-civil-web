"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCourse } from "@/features/catalog/hooks/use-course";
import { useCourses } from "@/features/catalog/hooks/use-courses";
import { useI18n } from "@/i18n/i18n-provider";
import { useMembersRanking } from "../hooks/use-stats";
import type { RankingItem, RankingSortBy } from "../types/stats.types";

export function RankingPage() {
  const { t } = useI18n();
  const coursesQuery = useCourses({ page: 1, pageSize: 50 });
  const courses = coursesQuery.data?.data ?? [];
  const [courseId, setCourseId] = useState("");
  const [moduleCode, setModuleCode] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [sortBy, setSortBy] = useState<RankingSortBy>("priority");

  const selectedCourse = courses.find((course) => course.id === courseId);
  const courseDetail = useCourse(selectedCourse?.slug ?? "");
  const modules = courseDetail.data?.data.modules ?? [];

  const query = useMemo(
    () => ({
      page: 1,
      pageSize: 50,
      courseId: courseId || undefined,
      moduleCode: moduleCode || undefined,
      state: state.trim() || undefined,
      city: city.trim() || undefined,
      sortBy,
    }),
    [courseId, moduleCode, state, city, sortBy],
  );
  const { data, isLoading, isError } = useMembersRanking(query);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-paper">{t("admin.ranking.title")}</h1>
        <p className="mt-1 text-sm text-mist">{t("admin.ranking.description")}</p>
      </div>

      {data ? (
        <div role="note" className="rounded-xl border border-hard/30 bg-hard/10 px-4 py-3 text-sm text-paper">
          <p className="font-semibold uppercase tracking-wide">{t("admin.ranking.disclaimerLabel")}</p>
          <p className="mt-1">{data.disclaimer}</p>
        </div>
      ) : null}

      <Card>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm">
            <span className="mb-1 block text-mist">{t("admin.ranking.course")}</span>
            <select
              className="h-10 w-full rounded-md border border-line bg-background px-3 text-sm text-foreground"
              value={courseId}
              onChange={(event) => {
                setCourseId(event.target.value);
                setModuleCode("");
              }}
            >
              <option value="">{t("admin.ranking.coursePlaceholder")}</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-mist">{t("admin.ranking.module")}</span>
            <select
              className="h-10 w-full rounded-md border border-line bg-background px-3 text-sm text-foreground"
              value={moduleCode}
              disabled={!courseId}
              onChange={(event) => setModuleCode(event.target.value)}
            >
              <option value="">{t("admin.ranking.moduleAll")}</option>
              {modules.map((courseModule) => (
                <option key={courseModule.id} value={courseModule.code}>
                  {courseModule.code} · {courseModule.title}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-mist">{t("admin.ranking.sortBy")}</span>
            <select
              className="h-10 w-full rounded-md border border-line bg-background px-3 text-sm text-foreground"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as RankingSortBy)}
            >
              <option value="priority">{t("admin.ranking.sort.priority")}</option>
              <option value="accuracy">{t("admin.ranking.sort.accuracy")}</option>
              <option value="activeDays">{t("admin.ranking.sort.activeDays")}</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-mist">{t("register.state")}</span>
            <Input value={state} onChange={(event) => setState(event.target.value)} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-mist">{t("register.city")}</span>
            <Input value={city} onChange={(event) => setCity(event.target.value)} />
          </label>
        </div>
      </Card>

      {!courseId ? <p className="text-sm text-mist">{t("admin.ranking.needScope")}</p> : null}
      {courseId && isLoading ? <p className="text-sm text-mist">{t("common.loading")}</p> : null}
      {courseId && isError ? <p className="text-sm text-hard">{t("admin.ranking.error")}</p> : null}
      {data?.truncated ? <p className="text-sm text-learn">{t("admin.ranking.truncated")}</p> : null}

      {data ? (
        <>
          <RankingBlock
            title={t("admin.ranking.ranked")}
            empty={t("admin.ranking.emptyRanked")}
            rows={data.data.ranked}
          />
          <RankingBlock
            title={t("admin.ranking.insufficient")}
            empty={t("admin.ranking.emptyInsufficient")}
            rows={data.data.insufficientBase}
            muted
          />
        </>
      ) : null}
    </div>
  );
}

function RankingBlock({
  title,
  empty,
  rows,
  muted = false,
}: {
  title: string;
  empty: string;
  rows: RankingItem[];
  muted?: boolean;
}) {
  const { t } = useI18n();
  return (
    <section>
      <h2 className="text-lg font-semibold text-paper">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-2 text-sm text-mist">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {rows.map((row) => (
            <li
              key={row.userId}
              className={`rounded-xl border border-line bg-panel px-4 py-3 ${muted ? "opacity-80" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-paper">{row.name}</p>
                  <p className="text-xs text-mist">
                    {row.lgndNumber ?? "—"}
                    {row.manada ? ` · ${row.manada.name} · ${row.manada.city}/${row.manada.state}` : ""}
                  </p>
                </div>
                <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-paper dark:bg-white/10">
                  {t(`admin.ranking.band.${row.engagementBand}`)}
                </span>
              </div>
              {row.operational === null ? (
                <p className="mt-3 rounded-md border border-hard/40 bg-hard/15 px-3 py-2 text-sm font-semibold uppercase tracking-wide text-hard">
                  {row.practicalTrainingNotice}
                </p>
              ) : null}
              <p className="mt-2 text-xs text-mist">
                {t("admin.ranking.rowMeta", {
                  accuracy: row.study.practiceAccuracyPct,
                  attempts: row.study.attempts,
                  days: row.study.activeDays30d,
                  coverage: row.study.coveragePct,
                })}
              </p>
              <p className="mt-1 text-xs text-mist">
                {t("admin.ranking.parts", {
                  accuracy: Math.round(row.priorityParts.accuracy),
                  consistency: Math.round(row.priorityParts.consistency),
                  volume: Math.round(row.priorityParts.volume),
                })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
