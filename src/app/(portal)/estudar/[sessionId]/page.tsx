import { StudyBoard } from "@/features/study/components/study-board";

export default async function Page({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return (
    <div className="study-shell">
      <div className="mx-auto max-w-[680px] px-4 py-6">
        <StudyBoard sessionId={sessionId} />
      </div>
    </div>
  );
}
