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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/90 text-paper backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/estudar"
          className="cursor-pointer text-sm font-semibold tracking-tight text-paper"
        >
          Portal <span className="text-flare">Defesa Civil</span>
        </Link>
        <nav className="flex gap-1 text-sm">
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
                    : "text-mist hover:bg-white/10 hover:text-paper",
                )}
              >
                <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
