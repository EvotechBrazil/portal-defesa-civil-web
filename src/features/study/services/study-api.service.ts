import { api } from "@/lib/api";
import { ApiEnvelope } from "@/types/api.types";
import {
  CreateStudySessionInput,
  DeckListItem,
  FinishSessionView,
  ReviewRating,
  ReviewSessionView,
  StudyFocus,
  StudySessionView,
} from "../types/study.types";

export async function listDecks(): Promise<{
  data: DeckListItem[];
  meta?: ApiEnvelope<DeckListItem[]>["meta"];
}> {
  const response = await api.get<ApiEnvelope<DeckListItem[]>>("/decks", {
    params: { page: 1, pageSize: 20 },
  });
  return { data: response.data.data, meta: response.data.meta };
}

export async function createStudySession(
  input: CreateStudySessionInput,
): Promise<StudySessionView> {
  const response = await api.post<ApiEnvelope<StudySessionView>>(
    "/study-sessions",
    input,
  );
  return response.data.data;
}

export async function getStudySession(
  sessionId: string,
  focus: StudyFocus = null,
): Promise<StudySessionView> {
  const response = await api.get<ApiEnvelope<StudySessionView>>(
    `/study-sessions/${sessionId}`,
    { params: focus ? { focus } : undefined },
  );
  return response.data.data;
}

export async function reviewStudySession(
  sessionId: string,
  rating: ReviewRating,
  focus: StudyFocus = null,
): Promise<ReviewSessionView> {
  const response = await api.post<ApiEnvelope<ReviewSessionView>>(
    `/study-sessions/${sessionId}/reviews`,
    focus ? { rating, focus } : { rating },
  );
  return response.data.data;
}

export async function finishStudySession(
  sessionId: string,
): Promise<FinishSessionView> {
  const response = await api.post<ApiEnvelope<FinishSessionView>>(
    `/study-sessions/${sessionId}/finish`,
  );
  return response.data.data;
}
