import { api } from "@/lib/api";
import type { ApiEnvelope } from "@/types/api.types";
import { userStatsSchema } from "../schemas/stats.schema";
import type { UserStats } from "../types/stats.types";

export async function getMyStats(courseId?: string): Promise<UserStats> {
  const response = await api.get<ApiEnvelope<UserStats>>("/me/stats", {
    params: courseId ? { courseId } : undefined,
  });
  return userStatsSchema.parse(response.data.data);
}
