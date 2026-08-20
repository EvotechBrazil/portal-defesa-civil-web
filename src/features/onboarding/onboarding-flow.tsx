"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CONTENT_BASES, baseById } from "@/features/study/content-bases";
import { useCreateStudySession } from "@/features/study/hooks/use-study-session";
import { useI18n } from "@/i18n/i18n-provider";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import {
  saveOnboardingPrefs,
  skipOnboarding,
  type OnboardingGoal,
  type OnboardingReminder,
  type OnboardingTrack,
} from "@/features/auth/lib/onboarding";

type Step = "welcome" | "track" | "base" | "goal" | "tour" | "done";

export function OnboardingFlow() {
  const { t } = useI18n();
  const router = useRouter();
  const { user } = useAuthUser();
  const createSession = useCreateStudySession();
  const firstName = user?.name?.trim().split(/\s+/)[0] ?? "";
  const [step, setStep] = useState<Step>("welcome");
  const [track, setTrack] = useState<OnboardingTrack>("ESSENTIAL");
  const [baseId, setBaseId] = useState("teorico");
  const [goal, setGoal] = useState<OnboardingGoal>(20);
  const [reminder, setReminder] = useState<OnboardingReminder>("21:30");
  const [flipped, setFlipped] = useState(false);

  function skip() {
    skipOnboarding();
    router.push("/estudar");
  }

  function persist() {
    saveOnboardingPrefs({ track, baseId, goal, reminder });
  }

  function startStudy() {
    persist();
    const base = baseById(baseId);
    if (base.status !== "open" || !base.courseSlug) {
      router.push("/estudar");
      return;
    }
    createSession.mutate(
      {
        deckSelector: track,
        bidir: true,
        filter: "ALL",
        courseSlug: base.courseSlug,
      },
      {
        onSuccess: (view) => {
          if (view.sessionId && view.card) {
            router.push(`/estudar/${view.sessionId}`);
            return;
          }
          router.push("/estudar");
        },
        onError: () => router.push("/estudar"),
      },
    );
  }

  return (
    <Card className="space-y-5">
      <div className="flex justify-end">
        <button type="button" className="min-h-11 text-sm font-medium text-mist hover:text-paper" onClick={skip}>
          {step === "welcome" ? t("onb.skipAll") : t("onb.skip")}
        </button>
      </div>

      {step === "welcome" ? (
        <>
          <h1 className="text-2xl font-semibold text-paper">
            {t("onb.welcome.title", { name: firstName || BRAND.short })}
          </h1>
          <p className="text-sm leading-relaxed text-mist">{t("onb.welcome.body")}</p>
          <ol className="space-y-2 text-sm text-paper">
            <li>1. {t("onb.welcome.s1")}</li>
            <li>2. {t("onb.welcome.s2")}</li>
            <li>3. {t("onb.welcome.s3")}</li>
            <li>4. {t("onb.welcome.s4")}</li>
          </ol>
          <Button type="button" className="w-full" onClick={() => setStep("track")}>
            {t("onb.welcome.cta")}
          </Button>
        </>
      ) : null}

      {step === "track" ? (
        <>
          <p className="font-mono text-micro uppercase tracking-[0.14em] text-mist">{t("onb.step", { n: 1 })}</p>
          <h1 className="text-2xl font-semibold text-paper">{t("onb.track.title")}</h1>
          <Choice selected={track === "ESSENTIAL"} title={t("study.essential")} hint={t("onb.track.essential")} onSelect={() => setTrack("ESSENTIAL")} />
          <Choice selected={track === "FULL"} title={t("study.full")} hint={t("onb.track.full")} onSelect={() => setTrack("FULL")} />
          <p className="text-xs text-mist">{t("onb.track.hint")}</p>
          <Button type="button" className="w-full" onClick={() => setStep("base")}>
            {t("register.continue")}
          </Button>
        </>
      ) : null}

      {step === "base" ? (
        <>
          <p className="font-mono text-micro uppercase tracking-[0.14em] text-mist">{t("onb.step", { n: 2 })}</p>
          <h1 className="text-2xl font-semibold text-paper">{t("onb.base.title")}</h1>
          <p className="text-sm text-mist">{t("onb.base.hint")}</p>
          <div className="grid gap-2">
            {CONTENT_BASES.map((item) => {
              const soon = item.status === "soon";
              const selected = item.id === baseId;
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={soon}
                  onClick={() => setBaseId(item.id)}
                  className={cn(
                    "min-h-11 rounded-ctl border px-3 py-3 text-left text-sm",
                    soon && "cursor-not-allowed border-dashed opacity-60",
                    selected && !soon ? "border-paper font-semibold text-paper" : "border-line text-mist",
                  )}
                >
                  {t(`content.base.${idKey(item.id)}.title`)}
                  {soon ? ` · ${t("common.soon")}` : null}
                </button>
              );
            })}
          </div>
          <Button type="button" className="w-full" onClick={() => setStep("goal")}>
            {t("register.continue")}
          </Button>
        </>
      ) : null}

      {step === "goal" ? (
        <>
          <p className="font-mono text-micro uppercase tracking-[0.14em] text-mist">{t("onb.step", { n: 3 })}</p>
          <h1 className="text-2xl font-semibold text-paper">{t("onb.goal.title")}</h1>
          {([10, 20, 30] as const).map((value) => (
            <Choice
              key={value}
              selected={goal === value}
              title={`${value} ${t("onb.goal.cards")}`}
              hint={t(`onb.goal.${value}`)}
              onSelect={() => setGoal(value)}
            />
          ))}
          <p className="mt-2 font-mono text-micro uppercase tracking-[0.14em] text-mist">{t("onb.reminder")}</p>
          <div className="flex flex-wrap gap-2">
            {(["19:00", "21:30", "22:30", "none"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setReminder(value)}
                className={cn(
                  "min-h-11 rounded-ctl border px-3 text-sm",
                  reminder === value ? "border-paper bg-paper text-ink" : "border-line text-mist",
                )}
              >
                {value === "none" ? t("onb.reminder.none") : value}
              </button>
            ))}
          </div>
          <Button type="button" className="w-full" onClick={() => setStep("tour")}>
            {t("register.continue")}
          </Button>
        </>
      ) : null}

      {step === "tour" ? (
        <>
          <p className="font-mono text-micro uppercase tracking-[0.14em] text-mist">{t("onb.step", { n: 4 })}</p>
          <h1 className="text-2xl font-semibold text-paper">{t("onb.tour.title")}</h1>
          <p className="font-mono text-micro uppercase tracking-[0.14em] text-learn">{t("onb.tour.demo")}</p>
          <button
            type="button"
            onClick={() => setFlipped((value) => !value)}
            className="min-h-40 w-full rounded-card border border-line bg-card p-5 text-left"
          >
            <p className="text-xs text-mist">{flipped ? t("study.face.answer") : t("study.face.question")}</p>
            <p className="mt-3 text-base font-medium text-paper">{flipped ? t("onb.tour.answer") : t("onb.tour.prompt")}</p>
            <p className="mt-4 text-sm text-flare-ink">{t("onb.tour.flip")}</p>
          </button>
          <p className="text-sm text-mist">{t("onb.tour.twoWay")}</p>
          <p className="text-sm text-mist">{t("onb.tour.honest")}</p>
          <Button type="button" className="w-full" onClick={() => setStep("done")}>
            {t("onb.tour.cta")}
          </Button>
        </>
      ) : null}

      {step === "done" ? (
        <>
          <h1 className="text-2xl font-semibold text-paper">{t("onb.done.title")}</h1>
          <ul className="space-y-1 text-sm text-paper">
            <li>{t("onb.done.track")}: {track === "FULL" ? t("study.full") : t("study.essential")}</li>
            <li>{t("onb.done.base")}: {t(`content.base.${idKey(baseId)}.title`)}</li>
            <li>{t("onb.done.goal")}: {goal}</li>
            <li>{t("onb.reminder")}: {reminder === "none" ? t("onb.reminder.none") : reminder}</li>
          </ul>
          <p className="text-sm text-mist">{t("onb.done.body")}</p>
          <Button type="button" className="w-full" disabled={createSession.isPending} onClick={startStudy}>
            {createSession.isPending ? t("common.loading") : t("onb.done.start")}
          </Button>
          <Button type="button" className="w-full bg-inset text-paper hover:bg-inset" onClick={() => { persist(); router.push("/estudar"); }}>
            {t("onb.done.later")}
          </Button>
        </>
      ) : null}
    </Card>
  );
}

function idKey(id: string): string {
  return ({ teorico: "theory", "aula-1": "lesson1", "aula-2": "lesson2", "aula-3": "lesson3", "aula-4": "lesson4" }[id] ?? "theory");
}

function Choice({
  selected,
  title,
  hint,
  onSelect,
}: {
  selected: boolean;
  title: string;
  hint: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "w-full rounded-card border p-4 text-left",
        selected ? "border-paper bg-card" : "border-line bg-panel",
      )}
    >
      <span className="block font-semibold text-paper">{title}</span>
      <span className="mt-1 block text-sm text-mist">{hint}</span>
    </button>
  );
}
