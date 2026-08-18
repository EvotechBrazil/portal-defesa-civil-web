import Link from "next/link";

const NAV = [
  { href: "/biblioteca", label: "Biblioteca" },
  { href: "/questoes", label: "Questões" },
  { href: "/estudar", label: "Estudar" },
  { href: "/praticar", label: "Praticar" },
  { href: "/desempenho", label: "Desempenho" },
];

export function PortalHeader() {
  return (
    <header className="border-b border-slate-200 bg-navy text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/biblioteca" className="cursor-pointer font-semibold tracking-tight">
          Portal Defesa Civil
        </Link>
        <nav className="flex gap-4 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="cursor-pointer rounded px-2 py-1 hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
