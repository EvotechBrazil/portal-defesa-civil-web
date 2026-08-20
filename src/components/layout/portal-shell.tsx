"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  BookOpen,
  CircleHelp,
  Layers,
  ListOrdered,
  MoreHorizontal,
  ScrollText,
  Shield,
  Target,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { AccountMenu } from "@/components/layout/account-menu";
import { BrandMark } from "@/components/layout/brand-mark";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { useI18n } from "@/i18n/i18n-provider";
import { hasAtLeast } from "@/lib/authz";
import { cn } from "@/lib/utils";
import type { Role } from "@/types/api.types";

type NavItem = {
  href: string;
  labelKey: string;
  icon: LucideIcon;
  minRole?: Role;
};

const PRIMARY: NavItem[] = [
  { href: "/estudar", labelKey: "nav.cards", icon: Layers },
  { href: "/biblioteca", labelKey: "nav.material", icon: BookOpen },
  { href: "/questoes", labelKey: "nav.questions", icon: CircleHelp },
  { href: "/desempenho", labelKey: "nav.performance", icon: BarChart3 },
];

const SECONDARY: NavItem[] = [
  { href: "/praticar", labelKey: "nav.practice", icon: Target },
];

const ADMIN: NavItem[] = [
  { href: "/admin/acessos", labelKey: "nav.access", icon: Shield, minRole: "ADMIN" },
  { href: "/admin/engajamento-estudo", labelKey: "nav.studyEngagement", icon: ListOrdered, minRole: "ADMIN" },
  { href: "/admin/usuarios", labelKey: "nav.users", icon: Users, minRole: "ADMIN" },
  { href: "/admin/auditoria", labelKey: "nav.audit", icon: ScrollText, minRole: "ADMIN_SENIOR" },
];

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const inSession = pathname.startsWith("/estudar/");
  const { user } = useAuthUser();
  const { t, locale } = useI18n();
  const [moreOpen, setMoreOpen] = useState(false);
  const adminItems = ADMIN.filter(
    (item) => item.minRole && user != null && hasAtLeast(user.role, item.minRole),
  );
  const railItems = [...PRIMARY, ...SECONDARY, ...adminItems];
  const moreItems = [...SECONDARY, ...adminItems];
  const firstName = user?.name?.trim().split(/\s+/)[0] ?? "";
  const hour = new Date().getHours();
  const greetKey =
    hour < 12 ? "home.greeting.morning" : hour < 18 ? "home.greeting.afternoon" : "home.greeting.evening";
  const weekday = new Date().toLocaleDateString(locale, { weekday: "long" });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[72px] flex-col border-r border-line bg-panel py-3 lg:flex">
        <div className="px-1 text-center">
          <BrandMark href="/estudar" />
        </div>
        <nav className="mt-4 flex flex-1 flex-col gap-1 px-1" aria-label={t("nav.primary")}>
          {railItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            const showRule = item.minRole && index === railItems.findIndex((entry) => entry.minRole);
            return (
              <div key={item.href}>
                {showRule ? <div className="mx-2 my-2 border-t border-line" /> : null}
                <Link
                  href={item.href}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-ctl px-1 text-center text-[10px] font-medium leading-tight",
                    active
                      ? "bg-inset font-semibold text-paper shadow-[inset_3px_0_0_0_var(--fg)]"
                      : "text-mist hover:bg-inset hover:text-paper",
                  )}
                >
                  <Icon className="size-5" strokeWidth={active ? 2.25 : 1.75} aria-hidden />
                  <span className="max-w-full px-0.5">{t(item.labelKey)}</span>
                </Link>
              </div>
            );
          })}
        </nav>
        <div className="flex flex-col items-center gap-2 px-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <AccountMenu compact />
        </div>
      </aside>

      <div className="lg:pl-[72px]">
        <header className="sticky top-0 z-30 flex min-h-14 items-center justify-between gap-3 border-b border-line bg-panel/95 px-4 py-2 backdrop-blur-md">
          <div className="min-w-0 lg:hidden">
            <p className="truncate text-sm font-semibold text-paper">
              {firstName ? t(greetKey, { name: firstName }) : t("brand.short")}
            </p>
            <p className="truncate font-mono text-micro uppercase tracking-[0.14em] text-mist">
              {weekday}
            </p>
          </div>
          <div className="hidden min-w-0 lg:block">
            <p className="truncate text-sm font-semibold text-paper">{t("brand.short")}</p>
            <p className="font-mono text-micro uppercase tracking-[0.14em] text-mist">{weekday}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            <ThemeToggle />
            <AccountMenu />
          </div>
        </header>

        <main className={cn(inSession ? "pb-6" : "pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-8")}>
          {children}
        </main>
      </div>

      {inSession ? null : (
        <nav
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-panel/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
          aria-label={t("nav.primary")}
        >
          <div className="grid grid-cols-5">
            {PRIMARY.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-[10px] leading-tight",
                    active ? "font-semibold text-paper" : "font-medium text-mist",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full",
                      active && "shadow-[0_2px_0_0_var(--fg)]",
                    )}
                  >
                    <Icon className="size-5" strokeWidth={active ? 2.25 : 1.75} aria-hidden />
                  </span>
                  {t(item.labelKey)}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              className="flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-medium leading-tight text-mist"
            >
              <MoreHorizontal className="size-5" strokeWidth={1.75} aria-hidden />
              {t("nav.more")}
            </button>
          </div>
        </nav>
      )}

      {moreOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-scrim"
            aria-label={t("ui.close")}
            onClick={() => setMoreOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-card border border-line bg-panel px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 shadow-e3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-paper">{t("nav.more")}</p>
              <button
                type="button"
                className="flex size-11 items-center justify-center rounded-ctl"
                onClick={() => setMoreOpen(false)}
                aria-label={t("ui.close")}
              >
                <X className="size-4" strokeWidth={1.75} />
              </button>
            </div>
            <div className="grid gap-1">
              {moreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className="flex min-h-11 items-center gap-3 rounded-ctl px-2 text-sm text-paper hover:bg-inset"
                  >
                    <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                    {t(item.labelKey)}
                  </Link>
                );
              })}
              <div className="mt-2 flex items-center justify-between gap-2 border-t border-line pt-3">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
