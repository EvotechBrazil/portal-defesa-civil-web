"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n/i18n-provider";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { useManadaMembers } from "../hooks/use-stats";
import type { ManadaMember } from "../types/stats.types";

export function ManadaMembersList() {
  const { t, locale } = useI18n();
  const { user } = useAuthUser();
  const { data, isLoading, isError } = useManadaMembers();

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-paper">{t("pack.members.title")}</h2>
      <p className="mt-1 text-sm text-mist">{t("pack.members.description")}</p>

      {isLoading ? <p className="mt-4 text-sm text-mist">{t("common.loading")}</p> : null}
      {isError ? <p className="mt-4 text-sm text-hard">{t("pack.members.error")}</p> : null}
      {data?.reason === "NO_MANADA" ? (
        <p className="mt-4 text-sm text-mist">{t("pack.members.noPack")}</p>
      ) : null}
      {data && data.reason !== "NO_MANADA" && data.members.length === 0 ? (
        <p className="mt-4 text-sm text-mist">{t("pack.members.empty")}</p>
      ) : null}
      {data && data.members.length > 0 ? (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {data.members.map((member) => (
            <li key={member.userId}>
              <MemberCard member={member} isSelf={member.userId === user?.id} locale={locale} />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function MemberCard({
  member,
  isSelf,
  locale,
}: {
  member: ManadaMember;
  isSelf: boolean;
  locale: string;
}) {
  const { t } = useI18n();
  return (
    <Link href={`/desempenho/${member.userId}`} className="block">
      <Card className="h-full transition hover:border-flare/40">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium text-paper">
              {member.name}
              {isSelf ? <span className="ml-2 text-xs text-mist">{t("pack.members.you")}</span> : null}
            </p>
            <p className="mt-1 text-xs text-mist">
              {member.lgndNumber ?? "—"}
              {member.squad ? ` · ${member.squad}` : ""}
            </p>
          </div>
          <p className="text-lg font-semibold tabular-nums text-paper">{member.practiceAccuracyPct}%</p>
        </div>
        <p className="mt-3 text-xs text-mist">
          {t("pack.members.meta", {
            days: member.activeDays30d,
            coverage: member.coveragePct,
            last: formatLastActive(member.lastActiveAt, locale),
          })}
        </p>
      </Card>
    </Link>
  );
}

function formatLastActive(value: string | null, locale: string): string {
  if (!value) {
    return "—";
  }
  return new Date(value).toLocaleDateString(locale, { day: "2-digit", month: "short" });
}
