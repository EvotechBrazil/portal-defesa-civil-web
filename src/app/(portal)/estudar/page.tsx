import { Suspense } from "react";
import { StudyDesk } from "@/features/study/components/study-desk";
import { TranslatedText } from "@/components/shared/translated-text";
import { FlashcardSkeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[680px] px-4 py-6">
          <FlashcardSkeleton>
            <TranslatedText translationKey="study.openingDeck" />
          </FlashcardSkeleton>
        </div>
      }
    >
      <StudyDesk />
    </Suspense>
  );
}
