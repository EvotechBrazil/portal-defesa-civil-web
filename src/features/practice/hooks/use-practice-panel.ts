import { useCallback, useEffect, useRef, useState } from "react";
import { getApiErrorMessage } from "../services/practice.service";
import type {
  FinishedAttempt,
  PracticePhase,
  RunningAttempt,
} from "../types/practice.types";
import {
  useCreateAttempt,
  useFinishAttempt,
  usePracticeAnswerKey,
  usePracticeHistory,
  useSubmitAnswer,
} from "./use-practice-queries";

const ADVANCE_MS = 260;

export function usePracticePanel(cardId: string) {
  const historyQuery = usePracticeHistory(cardId);
  const createMutation = useCreateAttempt(cardId);
  const answerMutation = useSubmitAnswer();
  const finishMutation = useFinishAttempt(cardId);

  const [phase, setPhase] = useState<PracticePhase>("idle");
  const [attempt, setAttempt] = useState<RunningAttempt | null>(null);
  const [result, setResult] = useState<FinishedAttempt | null>(null);
  const [step, setStep] = useState(0);
  const [lockedOptionId, setLockedOptionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const attemptRef = useRef<string | null>(null);
  const resumedId = useRef<string | null>(null);

  const answerKeyQuery = usePracticeAnswerKey(cardId, phase === "answer_key");

  useEffect(() => {
    setPhase("idle");
    setAttempt(null);
    setResult(null);
    setStep(0);
    setLockedOptionId(null);
    setErrorMessage(null);
    attemptRef.current = null;
    resumedId.current = null;
  }, [cardId]);

  useEffect(() => {
    const current = historyQuery.data?.current;
    if (!current || resumedId.current === current.attemptId) {
      return;
    }
    resumedId.current = current.attemptId;
    attemptRef.current = current.attemptId;
    setAttempt(current);
    setPhase("running");
    const firstOpen = current.questions.findIndex((question) => !question.chosenOptionId);
    setStep(firstOpen === -1 ? Math.max(current.questions.length - 1, 0) : firstOpen);
  }, [historyQuery.data]);

  const start = useCallback(async () => {
    setErrorMessage(null);
    try {
      const next = await createMutation.mutateAsync();
      attemptRef.current = next.attemptId;
      setAttempt(next);
      setResult(null);
      setStep(0);
      setLockedOptionId(null);
      setPhase("running");
    } catch (error: unknown) {
      setErrorMessage(getApiErrorMessage(error));
    }
  }, [createMutation]);

  const viewAnswerKey = useCallback(() => {
    setErrorMessage(null);
    setPhase("answer_key");
  }, []);

  const backToIdle = useCallback(() => {
    setPhase("idle");
    setResult(null);
    setLockedOptionId(null);
  }, []);

  const chooseOption = useCallback(
    async (optionId: string) => {
      if (!attempt || lockedOptionId || answerMutation.isPending || finishMutation.isPending) {
        return;
      }
      const question = attempt.questions[step];
      if (!question || question.chosenOptionId) {
        return;
      }
      const attemptId = attempt.attemptId;
      setLockedOptionId(optionId);
      setErrorMessage(null);
      try {
        const recorded = await answerMutation.mutateAsync({
          attemptId,
          questionId: question.questionId,
          optionId,
        });
        setAttempt((current) => {
          if (!current || current.attemptId !== attemptId) {
            return current;
          }
          return {
            ...current,
            answered: recorded.answered,
            questions: current.questions.map((item) =>
              item.questionId === question.questionId
                ? { ...item, chosenOptionId: optionId }
                : item,
            ),
          };
        });
        window.setTimeout(() => {
          if (attemptRef.current !== attemptId) {
            return;
          }
          const isLast = step >= attempt.questions.length - 1;
          if (isLast) {
            void finishMutation
              .mutateAsync(attemptId)
              .then((finished) => {
                if (attemptRef.current !== attemptId) {
                  return;
                }
                setResult(finished);
                setPhase("done");
                setLockedOptionId(null);
              })
              .catch((error: unknown) => {
                setErrorMessage(getApiErrorMessage(error));
                setLockedOptionId(null);
              });
            return;
          }
          setStep((current) => current + 1);
          setLockedOptionId(null);
        }, ADVANCE_MS);
      } catch (error: unknown) {
        setErrorMessage(getApiErrorMessage(error));
        setLockedOptionId(null);
      }
    },
    [answerMutation, attempt, finishMutation, lockedOptionId, step],
  );

  const currentQuestion = attempt?.questions[step] ?? null;
  const isBusy =
    createMutation.isPending ||
    answerMutation.isPending ||
    finishMutation.isPending;

  return {
    phase,
    attempt,
    result,
    step,
    currentQuestion,
    lockedOptionId,
    errorMessage,
    isBusy,
    history: historyQuery.data?.history ?? [],
    questionCount: historyQuery.data?.questionCount ?? 0,
    isHistoryLoading: historyQuery.isLoading,
    isHistoryError: historyQuery.isError,
    answerKey: answerKeyQuery.data?.questions ?? [],
    isAnswerKeyLoading: answerKeyQuery.isLoading,
    isAnswerKeyError: answerKeyQuery.isError,
    start,
    viewAnswerKey,
    backToIdle,
    chooseOption,
  };
}
