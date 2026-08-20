import { PeerStatsPage } from "@/features/stats/components/peer-stats-page";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return <PeerStatsPage userId={userId} />;
}
