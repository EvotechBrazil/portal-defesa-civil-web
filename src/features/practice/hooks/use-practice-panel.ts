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
  const [keyRevealed, setKeyRevealed] = useState(false);
  const attemptRef = useRef<string | null>(null);
  const resumedId = useRef<string | null>(null);
  const advanceTimer = useRef<number | null>(null);

  // §11.3: callback assíncrono não pode sobreviver ao contexto que o criou.
  // A guarda por attemptId já existe; faltava soltar o timer no unmount.
  const cancelAdvance = useCallback(() => {
    if (advanceTimer.current !== null) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }, []);

  useEffect(() => cancelAdvance, [cancelAdvance]);

  const answerKeyQuery = usePracticeAnswerKey(cardId, phase === "answer_key");

  useEffect(() => {
    cancelAdvance();
    setPhase("idle");
    setAttempt(null);
    setResult(null);
    setStep(0);
    setLockedOptionId(null);
    setErrorMessage(null);
    setKeyRevealed(false);
    attemptRef.current = null;
    resumedId.current = null;
  }, [cardId, cancelAdvance]);

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
    if (keyRevealed) {
      setErrorMessage("Gabarito já revelado. Esta avaliação não pode ser refeita.");
      return;
    }
    setErrorMessage(null);
    try {
      const next = await createMutation.mutateAsync();
      attemptRef.current = next.attemptId;
      resumedId.current = next.attemptId;
      setAttempt(next);
      setResult(null);
      setStep(0);
      setLockedOptionId(null);
      setPhase("running");
    } catch (error: unknown) {
      setErrorMessage(getApiErrorMessage(error));
    }
  }, [createMutation, keyRevealed]);

  const viewAnswerKey = useCallback(() => {
    setErrorMessage(null);
    setKeyRevealed(true);
    setPhase("answer_key");
  }, []);

  const backToIdle = useCallback(() => {
    cancelAdvance();
    attemptRef.current = null;
    resumedId.current = null;
    setPhase("idle");
    setAttempt(null);
    setResult(null);
    setLockedOptionId(null);
  }, [cancelAdvance]);

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
        cancelAdvance();
        advanceTimer.current = window.setTimeout(() => {
          advanceTimer.current = null;
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
    [answerMutation, attempt, cancelAdvance, finishMutation, lockedOptionId, step],
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
    keyRevealed,
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
