import { StudyBoard } from "@/features/study/components/study-board";

export default async function Page({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return <StudyBoard sessionId={sessionId} courseSlug="defesa-civil-lgnd" />;
}
