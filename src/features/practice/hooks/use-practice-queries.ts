import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAttempt,
  finishAttempt,
  getAnswerKey,
  getAttemptHistory,
  listPracticeCards,
  listRecentAttempts,
  submitAnswer,
} from "../services/practice.service";

export const practiceKeys = {
  history: (cardId: string) => ["practice", "history", cardId] as const,
  answerKey: (cardId: string) => ["practice", "answer-key", cardId] as const,
  cards: (page: number, search: string) =>
    ["practice", "cards", page, search] as const,
  recent: ["practice", "recent"] as const,
};

export function usePracticeHistory(cardId: string) {
  return useQuery({
    queryKey: practiceKeys.history(cardId),
    queryFn: () => getAttemptHistory(cardId),
    enabled: cardId.length > 0,
  });
}

export function usePracticeAnswerKey(cardId: string, enabled: boolean) {
  return useQuery({
    queryKey: practiceKeys.answerKey(cardId),
    queryFn: () => getAnswerKey(cardId),
    enabled: enabled && cardId.length > 0,
  });
}

export function usePracticeCards(page: number, search: string) {
  return useQuery({
    queryKey: practiceKeys.cards(page, search),
    queryFn: () =>
      listPracticeCards({
        page,
        pageSize: 12,
        search: search.trim() || undefined,
      }),
  });
}

export function useRecentAttempts() {
  return useQuery({
    queryKey: practiceKeys.recent,
    queryFn: listRecentAttempts,
  });
}

export function useCreateAttempt(cardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => createAttempt(cardId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: practiceKeys.history(cardId) });
    },
  });
}

export function useSubmitAnswer() {
  return useMutation({
    mutationFn: (input: {
      attemptId: string;
      questionId: string;
      optionId: string;
    }) => submitAnswer(input.attemptId, input.questionId, input.optionId),
  });
}

export function useFinishAttempt(cardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attemptId: string) => finishAttempt(attemptId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: practiceKeys.history(cardId) }),
        queryClient.invalidateQueries({ queryKey: practiceKeys.recent }),
      ]);
    },
  });
}
