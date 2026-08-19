"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CircleHelp,
  Layers,
  Target,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/estudar", label: "Cartas", icon: Layers },
  { href: "/biblioteca", label: "Material", icon: BookOpen },
  { href: "/questoes", label: "Questões", icon: CircleHelp },
  { href: "/praticar", label: "Praticar", icon: Target },
  { href: "/desempenho", label: "Desempenho", icon: BarChart3 },
];

export function PortalHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/90 text-paper backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link
          href="/estudar"
          className="cursor-pointer text-sm font-semibold tracking-tight text-paper"
        >
          Portal <span className="text-flare">Defesa Civil</span>
        </Link>
        <nav className="flex min-w-0 flex-1 justify-center gap-1 overflow-x-auto text-sm">
          {NAV.map((item) => {
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
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
