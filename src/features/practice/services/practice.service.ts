import { api } from "@/lib/api";
import type { ApiEnvelope } from "@/types/api.types";
import { submitAnswerSchema } from "../schemas/practice.schema";
import type {
  AnswerKeyQuestion,
  AnswerRecord,
  AttemptHistory,
  FinishedAttempt,
  PracticeCard,
  PracticeCardsPage,
  RecentAttempt,
  RunningAttempt,
} from "../types/practice.types";

export async function createAttempt(cardId: string): Promise<RunningAttempt> {
  const response = await api.post<ApiEnvelope<RunningAttempt>>(
    `/cards/${cardId}/attempts`,
  );
  return response.data.data;
}

export async function submitAnswer(
  attemptId: string,
  questionId: string,
  optionId: string,
): Promise<AnswerRecord> {
  const payload = submitAnswerSchema.parse({ questionId, optionId });
  const response = await api.post<ApiEnvelope<AnswerRecord>>(
    `/attempts/${attemptId}/answers`,
    payload,
  );
  return response.data.data;
}

export async function finishAttempt(attemptId: string): Promise<FinishedAttempt> {
  const response = await api.post<ApiEnvelope<FinishedAttempt>>(
    `/attempts/${attemptId}/finish`,
  );
  return response.data.data;
}

export async function getAttemptHistory(cardId: string): Promise<AttemptHistory> {
  const response = await api.get<ApiEnvelope<AttemptHistory>>(
    `/cards/${cardId}/attempts`,
  );
  return response.data.data;
}

export async function getAnswerKey(
  cardId: string,
): Promise<{ questions: AnswerKeyQuestion[] }> {
  const response = await api.get<ApiEnvelope<{ questions: AnswerKeyQuestion[] }>>(
    `/cards/${cardId}/answer-key`,
  );
  return response.data.data;
}

export async function listPracticeCards(params: {
  page: number;
  pageSize: number;
  search?: string;
}): Promise<PracticeCardsPage> {
  const response = await api.get<
    ApiEnvelope<PracticeCard[]> & {
      meta?: { page?: number; pageSize?: number; total?: number; pageCount?: number };
    }
  >("/practice/cards", { params });
  const meta = response.data.meta;
  return {
    items: response.data.data,
    page: meta?.page ?? params.page,
    pageSize: meta?.pageSize ?? params.pageSize,
    total: meta?.total ?? response.data.data.length,
    pageCount: meta?.pageCount ?? 1,
  };
}

export async function listRecentAttempts(): Promise<RecentAttempt[]> {
  const response = await api.get<ApiEnvelope<{ items: RecentAttempt[] }>>(
    "/practice/recent",
  );
  return response.data.data.items;
}

export function getApiErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: unknown } } })
      .response;
    const message = response?.data?.message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
    if (Array.isArray(message) && message.every((item) => typeof item === "string")) {
      return message.join(", ");
    }
  }
  return "Não foi possível concluir a operação.";
}
