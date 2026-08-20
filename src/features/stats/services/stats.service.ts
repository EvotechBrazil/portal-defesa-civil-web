import { api } from "@/lib/api";
import type { ApiEnvelope } from "@/types/api.types";
import {
  manadaMemberSchema,
  peerStatsSchema,
  rankingEnvelopeSchema,
  userStatsSchema,
} from "../schemas/stats.schema";
import type {
  ManadaMember,
  PeerStats,
  RankingData,
  RankingQuery,
  UserStats,
} from "../types/stats.types";

export async function getMyStats(courseId?: string): Promise<UserStats> {
  const response = await api.get<ApiEnvelope<UserStats>>("/me/stats", {
    params: courseId ? { courseId } : undefined,
  });
  return userStatsSchema.parse(response.data.data);
}

export async function getPeerStats(userId: string, courseId?: string): Promise<PeerStats> {
  const response = await api.get<ApiEnvelope<PeerStats>>(`/users/${userId}/stats`, {
    params: courseId ? { courseId } : undefined,
  });
  return peerStatsSchema.parse(response.data.data);
}

export async function listManadaMembers(): Promise<{
  members: ManadaMember[];
  reason?: string;
}> {
  const response = await api.get<ApiEnvelope<ManadaMember[]>>("/me/manada/members", {
    params: { pageSize: 100 },
  });
  return {
    members: manadaMemberSchema.array().parse(response.data.data),
    reason: response.data.meta?.reason,
  };
}

export async function getMembersRanking(query: RankingQuery): Promise<{
  data: RankingData;
  disclaimer: string;
  total: number;
  pageCount: number;
  page: number;
  truncated: boolean;
}> {
  const response = await api.get<ApiEnvelope<RankingData>>("/admin/members/ranking", {
    params: query,
  });
  const parsed = rankingEnvelopeSchema.parse(response.data);
  return {
    data: parsed.data,
    disclaimer: parsed.meta.disclaimer,
    total: parsed.meta.total,
    pageCount: parsed.meta.pageCount,
    page: parsed.meta.page,
    truncated: parsed.meta.truncated,
  };
}
