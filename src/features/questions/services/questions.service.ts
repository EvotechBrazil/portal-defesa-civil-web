import { api } from "@/lib/api";
import type { ApiEnvelope } from "@/types/api.types";
import type { Question, QuestionsFilter } from "../types/questions.types";

function compactParams(filter: QuestionsFilter) {
  return {
    page: filter.page,
    pageSize: filter.pageSize,
    ...(filter.moduleCode ? { moduleCode: filter.moduleCode } : {}),
    ...(filter.quizCode ? { quizCode: filter.quizCode } : {}),
    ...(filter.search ? { search: filter.search } : {}),
  };
}

export async function listQuestions(filter: QuestionsFilter) {
  const response = await api.get<ApiEnvelope<Question[]>>("/questions", {
    params: compactParams(filter),
  });
  return response.data;
}

export async function getQuestion(id: string) {
  const response = await api.get<ApiEnvelope<Question>>(`/questions/${id}`);
  return response.data;
}
