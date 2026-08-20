import { Suspense } from "react";
import { StudyDesk } from "@/features/study/components/study-desk";
import { TranslatedText } from "@/components/shared/translated-text";

export default function Page() {
  return (
    <Suspense fallback={<p className="px-4 py-10 text-sm text-mist"><TranslatedText translationKey="study.openingDeck" /></p>}>
      <StudyDesk />
    </Suspense>
  );
}
