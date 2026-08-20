import type { z } from "zod";
import type {
  cardLevelsSchema,
  manadaMemberSchema,
  moduleAccuracySchema,
  peerStatsSchema,
  rankingDataSchema,
  rankingItemSchema,
  sessionLast30dSchema,
  stuckCardSchema,
  userStatsSchema,
} from "../schemas/stats.schema";

export type CardLevels = z.infer<typeof cardLevelsSchema>;
export type ModuleAccuracy = z.infer<typeof moduleAccuracySchema>;
export type StuckCard = z.infer<typeof stuckCardSchema>;
export type SessionLast30d = z.infer<typeof sessionLast30dSchema>;
export type UserStats = z.infer<typeof userStatsSchema>;
export type PeerStats = z.infer<typeof peerStatsSchema>;
export type ManadaMember = z.infer<typeof manadaMemberSchema>;
export type RankingItem = z.infer<typeof rankingItemSchema>;
export type RankingData = z.infer<typeof rankingDataSchema>;

export type RankingSortBy = "priority" | "accuracy" | "activeDays";

export type RankingQuery = {
  page?: number;
  pageSize?: number;
  courseId?: string;
  moduleCode?: string;
  manadaId?: string;
  state?: string;
  city?: string;
  sortBy?: RankingSortBy;
};
