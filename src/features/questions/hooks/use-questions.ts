import { useQuery } from "@tanstack/react-query";
import { listQuestions } from "../services/questions.service";
import type { QuestionsFilter } from "../types/questions.types";

export function useQuestions(filter: QuestionsFilter) {
  return useQuery({
    queryKey: ["questions", filter],
    queryFn: () => listQuestions(filter),
  });
}
