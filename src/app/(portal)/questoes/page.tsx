import { Suspense } from "react";
import { QuestionsBank } from "@/features/questions/components/questions-bank";
import { TranslatedText } from "@/components/shared/translated-text";

export default function Page() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-3xl px-4 py-10 text-slate-600"><TranslatedText translationKey="common.loading" /></p>}>
      <QuestionsBank />
    </Suspense>
  );
}
