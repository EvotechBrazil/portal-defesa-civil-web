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
} from "../types/study.types";
import { decksQueryKey } from "./use-decks";

export function studySessionQueryKey(sessionId: string) {
  return ["study-session", sessionId] as const;
}

export function useStudySession(sessionId: string | undefined) {
  return useQuery({
    queryKey: sessionId ? studySessionQueryKey(sessionId) : ["study-session"],
    queryFn: () => getStudySession(sessionId as string),
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

export function useReviewStudySession(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rating: ReviewRating) => reviewStudySession(sessionId, rating),
    onSuccess: (view) => {
      queryClient.setQueryData(studySessionQueryKey(sessionId), view);
      void queryClient.invalidateQueries({ queryKey: decksQueryKey });
    },
  });
}

export function useFinishStudySession(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => finishStudySession(sessionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: studySessionQueryKey(sessionId) });
      void queryClient.invalidateQueries({ queryKey: decksQueryKey });
    },
  });
}
