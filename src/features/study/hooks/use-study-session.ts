"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStudySession,
  finishStudySession,
  getStudySession,
  reviewStudySession,
} from "../services/study-api.service";
import {
  CreateStudySessionInput,
  ReviewRating,
  StudyFocus,
} from "../types/study.types";
import { decksQueryKey } from "./use-decks";

export function studySessionQueryKey(
  sessionId: string,
  focus: StudyFocus = null,
) {
  return ["study-session", sessionId, focus] as const;
}

export function useStudySession(
  sessionId: string | undefined,
  focus: StudyFocus = null,
) {
  return useQuery({
    queryKey: sessionId
      ? studySessionQueryKey(sessionId, focus)
      : ["study-session"],
    queryFn: () => getStudySession(sessionId as string, focus),
    enabled: Boolean(sessionId),
  });
}

export function useCreateStudySession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateStudySessionInput) => createStudySession(input),
    onSuccess: (view) => {
      queryClient.setQueryData(studySessionQueryKey(view.sessionId), view);
      void queryClient.invalidateQueries({ queryKey: decksQueryKey });
    },
  });
}

export function useReviewStudySession(sessionId: string, focus: StudyFocus = null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rating: ReviewRating) =>
      reviewStudySession(sessionId, rating, focus),
    onSuccess: (view) => {
      queryClient.setQueryData(studySessionQueryKey(sessionId, focus), view);
      // A lente ativa já veio na resposta; as dos outros focos ficaram velhas.
      void queryClient.invalidateQueries({
        queryKey: ["study-session", sessionId],
        predicate: (query) => query.queryKey[2] !== focus,
      });
      void queryClient.invalidateQueries({ queryKey: decksQueryKey });
    },
  });
}

export function useFinishStudySession(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => finishStudySession(sessionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["study-session", sessionId],
      });
      void queryClient.invalidateQueries({ queryKey: decksQueryKey });
    },
  });
}
