"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/layout/brand-mark";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/i18n-provider";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

const EXAMPLE_BARS = [
  { key: "home.panel.essentials", value: "32/51", width: "62%" },
  { key: "home.panel.full", value: "32/184", width: "17%" },
  { key: "home.panel.questions", value: "45/133", width: "34%" },
] as const;

const OUTCOMES = ["home.outcomes.1.title", "home.outcomes.2.title", "home.outcomes.3.title"] as const;
const OUTCOME_BODIES = ["home.outcomes.1.body", "home.outcomes.2.body", "home.outcomes.3.body"] as const;

export function PublicHome() {
  const { t, setLocale } = useI18n();
  const heroRef = useRef<HTMLElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-line bg-panel/95 backdrop-blur-md">
        <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between gap-3 px-4 md:h-[68px] md:px-7">
          <BrandMark href="/" priority />
          <div className="flex items-center gap-2">
            <a
              href="#como-funciona"
              className="hidden min-h-11 items-center px-2.5 text-sm text-mist hover:text-paper md:inline-flex"
            >
              {t("home.nav.how")}
            </a>
            <a
              href="#trilhas"
              className="hidden min-h-11 items-center px-2.5 text-sm text-mist hover:text-paper md:inline-flex"
            >
              {t("home.nav.tracks")}
            </a>
            <span className="hidden h-6 w-px bg-line md:block" aria-hidden />
            <LanguageSwitcher />
            <ThemeToggle />
            <Link href="/login" className="hidden md:inline-flex">
              <Button
                type="button"
                className="border border-line bg-panel text-paper hover:bg-inset"
              >
                {t("home.cta.login")}
              </Button>
            </Link>
            <Link href="/registro" className="hidden md:inline-flex">
              <Button type="button">{t("home.cta.request")}</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section ref={heroRef} className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[1.15fr_1fr] md:items-center md:px-7 md:py-14">
          <div className="flex flex-col gap-5">
            <p className="font-mono text-[10.5px] font-semibold tracking-[0.16em] text-steel uppercase md:text-[11px]">
              {BRAND.long}
            </p>
            <h1 className="max-w-[20ch] text-balance text-[clamp(2.05rem,1.4rem+2.4vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-paper">
              {t("home.hero.title")}
            </h1>
            <p className="max-w-[52ch] text-pretty text-[15.5px] leading-relaxed text-mist md:text-lg">
              {t("home.hero.sub")}
            </p>
            <div className="mt-1 flex flex-col gap-2.5 sm:flex-row">
              <Link href="/registro">
                <Button type="button" className="min-h-14 w-full px-6 text-base sm:w-auto">
                  {t("home.cta.request")}
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  type="button"
                  className="min-h-14 w-full border border-line bg-panel px-6 text-base text-paper hover:bg-inset sm:w-auto"
                >
                  {t("home.cta.haveAccount")}
                </Button>
              </Link>
            </div>
            <p className="inline-flex items-center gap-2 self-start rounded-ctl border border-line bg-inset px-3.5 py-3 text-sm text-mist">
              {t("home.hero.badge")}
            </p>
          </div>

          <aside className="overflow-hidden rounded-panel border border-line bg-panel">
            <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
              <p className="font-mono text-[10px] font-semibold tracking-[0.12em] text-mist uppercase">
                {t("home.panel.title")}
              </p>
              <span className="rounded-chip border border-steel/30 bg-steel-surf px-2 py-1 font-mono text-[9.5px] font-semibold text-steel">
                {t("home.panel.example")}
              </span>
            </div>
            <div className="flex flex-col gap-3.5 p-4">
              {EXAMPLE_BARS.map((bar) => (
                <div
                  key={bar.key}
                  className={cn(
                    "flex items-center gap-2.5",
                    bar.key === "home.panel.full" && "hidden md:flex",
                  )}
                >
                  <span className="w-[5.4rem] shrink-0 font-mono text-[10.5px] font-medium tracking-wide text-mist uppercase">
                    {t(bar.key)}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-[3px] bg-inset">
                    <div className="h-full bg-steel" style={{ width: bar.width }} />
                  </div>
                  <span className="w-12 text-right font-mono text-[11px] font-semibold text-paper">
                    {bar.value}
                  </span>
                </div>
              ))}
              <div className="hidden grid-cols-3 gap-2.5 border-t border-line pt-3.5 md:grid">
                <ExampleStat value="83%" label={t("home.panel.accuracy")} tone="ok" />
                <ExampleStat value="6 d" label={t("home.panel.streak")} />
                <ExampleStat value="9 min" label={t("home.panel.night")} />
              </div>
              <p className="hidden text-[11.5px] leading-relaxed text-mist md:block">
                {t("home.panel.caption")}
              </p>
            </div>
          </aside>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12 md:px-7">
          <p className="font-mono text-[11px] font-semibold tracking-[0.14em] text-mist uppercase">
            {t("home.outcomes.kicker")}
          </p>
          <div className="mt-4 grid gap-3.5 md:grid-cols-3">
            {OUTCOMES.map((titleKey, index) => (
              <article key={titleKey} className="flex flex-col gap-2 rounded-panel border border-line bg-panel p-5">
                <h2 className="text-lg font-semibold text-paper">{t(titleKey)}</h2>
                <p className="text-sm leading-relaxed text-mist">{t(OUTCOME_BODIES[index]!)}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="como-funciona" className="scroll-mt-20 border-y border-line bg-panel">
          <div className="mx-auto max-w-6xl px-4 py-11 md:px-7">
            <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
              <h2 className="text-2xl font-semibold tracking-tight text-paper md:text-[1.875rem]">
                {t("home.how.title")}
              </h2>
              <p className="text-sm text-mist">{t("home.how.lead")}</p>
            </div>
            <ol className="mt-6 grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((step) => (
                <li
                  key={step}
                  className={cn(
                    "flex flex-col gap-2.5 rounded-panel border p-5",
                    step === 3 ? "border-primary bg-card" : "border-line bg-background",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-[9px] font-mono text-sm font-semibold",
                      step === 3 ? "bg-primary text-primary-ink" : "bg-paper text-ink",
                    )}
                  >
                    {step}
                  </span>
                  <h3 className="text-lg font-semibold text-paper">{t(`home.how.step${step}.title`)}</h3>
                  <p className="text-sm leading-relaxed text-mist">{t(`home.how.step${step}.body`)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="trilhas" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-11 md:px-7">
          <p className="font-mono text-[11px] font-semibold tracking-[0.14em] text-mist uppercase">
            {t("home.tracks.kicker")}
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <article className="flex flex-col gap-3 rounded-card border-[1.5px] border-primary bg-card p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-paper">{t("home.tracks.essential.title")}</h2>
                <span className="rounded-chip bg-primary px-2.5 py-1 font-mono text-[10px] font-semibold text-primary-ink">
                  {t("home.tracks.essential.badge")}
                </span>
              </div>
              <p className="font-mono text-4xl font-semibold text-paper">
                51{" "}
                <span className="text-base font-medium text-mist">{t("home.tracks.cards")}</span>
              </p>
              <p className="text-[15px] leading-relaxed text-mist">{t("home.tracks.essential.body")}</p>
            </article>
            <article className="flex flex-col gap-3 rounded-card border border-line bg-panel p-6">
              <h2 className="text-xl font-semibold text-paper">{t("home.tracks.full.title")}</h2>
              <p className="font-mono text-4xl font-semibold text-paper">
                184{" "}
                <span className="text-base font-medium text-mist">{t("home.tracks.cards")}</span>
              </p>
              <p className="text-[15px] leading-relaxed text-mist">{t("home.tracks.full.body")}</p>
            </article>
          </div>
          <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-panel border border-line bg-line md:grid-cols-4">
            <StatCell value="51" label={t("home.stats.essentials")} />
            <StatCell value="184" label={t("home.stats.full")} />
            <StatCell value="133" label={t("home.stats.questions")} />
            <StatCell value="6" label={t("home.stats.modules")} />
          </div>
        </section>

        <section className="bg-[#171412] px-4 py-10 text-[#f5f1ea] md:px-7">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex max-w-[46ch] flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight">{t("home.close.title")}</h2>
              <p className="text-[15px] leading-relaxed text-[#c4b8ad]">{t("home.close.body")}</p>
            </div>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Link href="/registro">
                <Button type="button" className="min-h-14 w-full px-6 text-base sm:w-auto">
                  {t("home.cta.request")}
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  type="button"
                  className="min-h-14 w-full border border-white/25 bg-transparent px-6 text-base text-[#f5f1ea] hover:bg-white/10 sm:w-auto"
                >
                  {t("home.cta.login")}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-inset px-4 py-8 pb-24 md:px-7 md:pb-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <div className="flex flex-col gap-8 md:flex-row md:justify-between">
            <div className="flex max-w-[46ch] flex-col gap-2">
              <p className="text-[15px] font-semibold text-paper">{BRAND.long}</p>
              <p className="text-[13px] leading-relaxed text-mist">{t("home.footer.blurb")}</p>
            </div>
            <div className="flex gap-9">
              <div className="flex flex-col gap-2">
                <p className="font-mono text-[10px] font-semibold tracking-[0.12em] text-mist uppercase">
                  {t("home.footer.portal")}
                </p>
                <Link href="/login" className="text-[13.5px] text-flare-ink">
                  {t("home.cta.login")}
                </Link>
                <Link href="/registro" className="text-[13.5px] text-flare-ink">
                  {t("home.cta.request")}
                </Link>
                <a href="#como-funciona" className="text-[13.5px] text-flare-ink">
                  {t("home.nav.how")}
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-mono text-[10px] font-semibold tracking-[0.12em] text-mist uppercase">
                  {t("home.footer.language")}
                </p>
                <button type="button" className="text-left text-[13.5px] text-flare-ink" onClick={() => setLocale("pt-BR")}>
                  Português
                </button>
                <button type="button" className="text-left text-[13.5px] text-flare-ink" onClick={() => setLocale("es")}>
                  Español
                </button>
                <button type="button" className="text-left text-[13.5px] text-flare-ink" onClick={() => setLocale("en")}>
                  English
                </button>
              </div>
            </div>
          </div>
          <p className="max-w-[96ch] rounded-ctl border border-line bg-background px-4 py-3.5 text-[12.5px] leading-relaxed text-mist">
            <strong className="font-semibold text-paper">{t("home.footer.thirdPartyTitle")} </strong>
            {t("home.footer.thirdParty")}
          </p>
        </div>
      </footer>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-panel px-4 py-2.5 md:hidden",
          heroVisible ? "pointer-events-none opacity-0" : "opacity-100",
          "motion-reduce:transition-none motion-safe:transition-opacity motion-safe:duration-200",
        )}
      >
        <div className="flex gap-2.5">
          <Link href="/registro" className="flex-1">
            <Button type="button" className="min-h-[52px] w-full text-base">
              {t("home.cta.request")}
            </Button>
          </Link>
          <Link href="/login" className="w-[118px] shrink-0">
            <Button
              type="button"
              className="min-h-[52px] w-full border border-line bg-panel text-base text-paper hover:bg-inset"
            >
              {t("home.cta.login")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ExampleStat({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone?: "ok";
}) {
  return (
    <div className="rounded-ctl bg-background p-3">
      <p className={cn("font-mono text-xl font-semibold", tone === "ok" ? "text-ok" : "text-paper")}>
        {value}
      </p>
      <p className="mt-1.5 font-mono text-[10px] font-medium tracking-[0.08em] text-mist uppercase">
        {label}
      </p>
    </div>
  );
}

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-panel px-5 py-5">
      <p className="font-mono text-[1.875rem] font-semibold leading-none text-paper">{value}</p>
      <p className="mt-1.5 text-[13px] leading-snug text-mist">{label}</p>
    </div>
  );
}
