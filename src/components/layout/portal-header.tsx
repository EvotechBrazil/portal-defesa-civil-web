"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CircleHelp,
  Layers,
  ListOrdered,
  ScrollText,
  Shield,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { BrandMark } from "@/components/layout/brand-mark";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { useI18n } from "@/i18n/i18n-provider";
import { hasAtLeast } from "@/lib/authz";
import { cn } from "@/lib/utils";
import type { Role } from "@/types/api.types";

type NavItem = {
  href: string;
  labelKey: string;
  icon: LucideIcon;
  /** Papel minimo para o item aparecer. Ausente = todo usuario logado. */
  minRole?: Role;
};

// A regua vive no dado, nao num ternario: com quatro papeis, `role === "ADMIN"`
// esconderia o menu admin justamente de quem esta ACIMA de ADMIN.
const NAV: NavItem[] = [
  { href: "/estudar", labelKey: "nav.cards", icon: Layers },
  { href: "/biblioteca", labelKey: "nav.material", icon: BookOpen },
  { href: "/questoes", labelKey: "nav.questions", icon: CircleHelp },
  { href: "/praticar", labelKey: "nav.practice", icon: Target },
  { href: "/desempenho", labelKey: "nav.performance", icon: BarChart3 },
  {
    href: "/admin/engajamento-estudo",
    labelKey: "nav.studyEngagement",
    icon: ListOrdered,
    minRole: "ADMIN",
  },
  { href: "/admin/acessos", labelKey: "nav.access", icon: Shield, minRole: "ADMIN" },
  {
    href: "/admin/usuarios",
    labelKey: "nav.users",
    icon: Users,
    minRole: "ADMIN",
  },
  {
    href: "/admin/auditoria",
    labelKey: "nav.audit",
    icon: ScrollText,
    minRole: "ADMIN_SENIOR",
  },
];

export function PortalHeader() {
  const pathname = usePathname();
  const { t } = useI18n();
  const { user } = useAuthUser();
  const items = NAV.filter(
    (item) => !item.minRole || (user != null && hasAtLeast(user.role, item.minRole)),
  );
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/90 text-paper backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <BrandMark href="/estudar" compactOnMobile />
        <nav className="flex min-w-0 flex-1 justify-center gap-1 overflow-x-auto text-sm" aria-label={t("nav.primary")}>
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 transition duration-200",
                  active
                    ? "bg-flare text-white"
                    : "text-mist hover:bg-black/5 hover:text-paper dark:hover:bg-white/10",
                )}
              >
                <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                <span className="hidden sm:inline">{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
