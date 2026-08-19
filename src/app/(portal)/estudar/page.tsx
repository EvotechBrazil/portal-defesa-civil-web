import { Suspense } from "react";
import { StudyDesk } from "@/features/study/components/study-desk";

export default function Page() {
  return (
    <Suspense fallback={<p className="px-4 py-10 text-sm text-slate-600">Abrindo o baralho…</p>}>
      <StudyDesk />
    </Suspense>
  );
}
