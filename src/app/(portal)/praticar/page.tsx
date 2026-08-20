import { Suspense } from "react";
import { PracticePage } from "@/features/practice/components/practice-page";
import { TranslatedText } from "@/components/shared/translated-text";

export default function Page() {
  return (
    <Suspense fallback={<p className="px-4 py-10 text-sm text-mist"><TranslatedText translationKey="practice.loadingPage" /></p>}>
      <PracticePage />
    </Suspense>
  );
}
