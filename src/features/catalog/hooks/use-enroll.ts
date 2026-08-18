import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollInCourse } from "../services/catalog.service";

export function useEnroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => enrollInCourse(slug),
    onSuccess: (_data, slug) => {
      void queryClient.invalidateQueries({ queryKey: ["courses"] });
      void queryClient.invalidateQueries({ queryKey: ["course", slug] });
    },
  });
}
