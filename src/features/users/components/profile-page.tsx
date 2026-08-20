"use client";

import { useTheme } from "next-themes";
import { AvatarLockup } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/language-switcher";
import { logoutAccount } from "@/features/auth/services/auth.service";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";

export function ProfilePage() {
  const { user } = useAuthUser();
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  const name = user?.name ?? t("nav.profile");

  return (
    <section className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-2xl font-semibold text-paper">{t("profile.title")}</h1>
      <Card className="mt-6 space-y-6">
        <AvatarLockup name={name} roleLabel={user?.role} size={44} />
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="font-mono text-micro uppercase tracking-[0.14em] text-mist">{t("auth.email")}</dt>
            <dd className="mt-1 text-paper">{user?.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-mono text-micro uppercase tracking-[0.14em] text-mist">{t("profile.language")}</dt>
            <dd className="mt-2">
              <LanguageSwitcher />
            </dd>
          </div>
          <div>
            <dt className="font-mono text-micro uppercase tracking-[0.14em] text-mist">{t("profile.theme")}</dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {(
                [
                  ["light", t("theme.light")],
                  ["dark", t("theme.dark")],
                  ["system", t("theme.system")],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTheme(value)}
                  className={cn(
                    "min-h-11 rounded-ctl border px-3 text-sm",
                    theme === value
                      ? "border-paper bg-paper font-semibold text-ink"
                      : "border-line bg-panel text-mist hover:text-paper",
                  )}
                >
                  {label}
                </button>
              ))}
            </dd>
          </div>
        </dl>
        <Button type="button" className="w-full bg-hard hover:bg-hard/90" onClick={() => void logoutAccount()}>
          {t("profile.logout")}
        </Button>
      </Card>
    </section>
  );
}
