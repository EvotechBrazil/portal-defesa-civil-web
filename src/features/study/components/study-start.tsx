"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/i18n/i18n-provider";
import { useDecks } from "../hooks/use-decks";
import { useCreateStudySession } from "../hooks/use-study-session";
import { CreateStudySessionForm } from "../schemas/study.schema";
import { DeckSelectorPanel } from "./deck-selector";

const INITIAL: CreateStudySessionForm = {
  deckSelector: "ESSENTIAL",
  bidir: true,
  filter: "ALL",
};

export function StudyStart() {
  const { t } = useI18n();
  const router = useRouter();
  const decksQuery = useDecks();
  const createSession = useCreateStudySession();
  const [form, setForm] = useState<CreateStudySessionForm>(INITIAL);

  if (decksQuery.isLoading) {
    return <p className="px-4 py-10 text-sm text-slate-600">{t("study.loadingDecks")}</p>;
  }
  if (decksQuery.isError) {
    return (
      <p className="px-4 py-10 text-sm text-red-600">
        {t("study.loadDecksError")}
      </p>
    );
  }

  return (
    <div>
      <DeckSelectorPanel
        decks={decksQuery.data?.data ?? []}
        value={form}
        isSubmitting={createSession.isPending}
        onChange={setForm}
        onStart={() => {
          createSession.mutate(form, {
            onSuccess: (view) => {
              router.push(`/estudar/${view.sessionId}`);
            },
          });
        }}
      />
      {createSession.isError ? (
        <p className="px-4 text-sm text-red-600">{t("study.openSessionError")}</p>
      ) : null}
    </div>
  );
}
