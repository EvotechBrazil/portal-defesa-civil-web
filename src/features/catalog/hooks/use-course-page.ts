import { useQuery } from "@tanstack/react-query";
import { getCoursePage } from "../services/catalog.service";

export function useCoursePage(slug: string, pageSlug: string) {
  return useQuery({
    queryKey: ["course-page", slug, pageSlug],
    queryFn: () => getCoursePage(slug, pageSlug),
    enabled: slug.length > 0 && pageSlug.length > 0,
  });
}
