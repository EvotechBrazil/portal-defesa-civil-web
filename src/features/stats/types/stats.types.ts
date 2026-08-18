import type { z } from "zod";
import type {
  cardLevelsSchema,
  moduleAccuracySchema,
  sessionLast30dSchema,
  stuckCardSchema,
  userStatsSchema,
} from "../schemas/stats.schema";

export type CardLevels = z.infer<typeof cardLevelsSchema>;
export type ModuleAccuracy = z.infer<typeof moduleAccuracySchema>;
export type StuckCard = z.infer<typeof stuckCardSchema>;
export type SessionLast30d = z.infer<typeof sessionLast30dSchema>;
export type UserStats = z.infer<typeof userStatsSchema>;
