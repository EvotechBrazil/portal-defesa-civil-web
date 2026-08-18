import { useQuery } from "@tanstack/react-query";
import { getMyStats } from "../services/stats.service";

export function useStats(courseId?: string) {
  return useQuery({
    queryKey: ["stats", "me", courseId ?? null],
    queryFn: () => getMyStats(courseId),
  });
}
