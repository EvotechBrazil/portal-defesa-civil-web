import { useQuery } from "@tanstack/react-query";
import {
  getMembersRanking,
  getMyStats,
  getPeerStats,
  listManadaMembers,
} from "../services/stats.service";
import type { RankingQuery } from "../types/stats.types";

export function useStats(courseId?: string) {
  return useQuery({
    queryKey: ["stats", "me", courseId ?? null],
    queryFn: () => getMyStats(courseId),
  });
}

export function usePeerStats(userId: string, courseId?: string) {
  return useQuery({
    queryKey: ["stats", "peer", userId, courseId ?? null],
    queryFn: () => getPeerStats(userId, courseId),
    enabled: Boolean(userId),
  });
}

export function useManadaMembers() {
  return useQuery({
    queryKey: ["stats", "manada-members"],
    queryFn: listManadaMembers,
  });
}

export function useMembersRanking(query: RankingQuery) {
  const scoped = Boolean(query.courseId || query.moduleCode);
  return useQuery({
    queryKey: ["admin", "members-ranking", query],
    queryFn: () => getMembersRanking(query),
    enabled: scoped,
  });
}
