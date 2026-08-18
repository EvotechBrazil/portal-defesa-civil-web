import { useQuery } from "@tanstack/react-query";
import { listCourses } from "../services/catalog.service";

export function useCourses(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: () => listCourses(params),
  });
}
