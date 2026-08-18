import { useQuery } from "@tanstack/react-query";
import { getCourse } from "../services/catalog.service";

export function useCourse(slug: string) {
  return useQuery({
    queryKey: ["course", slug],
    queryFn: () => getCourse(slug),
    enabled: slug.length > 0,
  });
}
