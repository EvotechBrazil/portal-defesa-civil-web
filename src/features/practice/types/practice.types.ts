export interface RunningOption {
  optionId: string;
  text: string;
}

export interface RunningQuestion {
  questionId: string;
  shownOrd: number;
  stem: string;
  sourceRef: string | null;
  chosenOptionId: string | null;
  options: RunningOption[];
}

export interface RunningAttempt {
  attemptId: string;
  total: number;
  answered: number;
  questions: RunningQuestion[];
}

export interface AnswerRecord {
  recorded: true;
  answered: number;
  total: number;
}

export interface HistoryItem {
  attemptId: string;
  correctCount: number;
  totalCount: number;
  scorePct: number;
  finishedAt: string;
}

export interface AttemptHistory {
  history: HistoryItem[];
  current: RunningAttempt | null;
  questionCount: number;
}

export interface AnswerKeyOption {
  optionId: string;
  text: string;
  isCorrect: boolean;
}

export interface AnswerKeyQuestion {
  questionId: string;
  stem: string;
  explanationMd: string | null;
  correctOptionId: string;
  chosenOptionId: string | null;
  isCorrect: boolean;
  options: AnswerKeyOption[];
}

export interface PreviousAttempt {
  correctCount: number;
  totalCount: number;
  scorePct: number;
  finishedAt: string;
}

export interface FinishedAttempt {
  correctCount: number;
  totalCount: number;
  scorePct: number;
  previous: PreviousAttempt | null;
  deltaPct: number | null;
  history: Array<{
    correctCount: number;
    totalCount: number;
    finishedAt: string;
  }>;
  answerKey: AnswerKeyQuestion[];
}

export interface PracticeCard {
  id: string;
  code: string;
  front: string;
  deckKind: "ESSENTIAL" | "EXAM";
  questionCount: number;
}

export interface RecentAttempt {
  attemptId: string;
  cardId: string;
  cardCode: string;
  cardFront: string;
  correctCount: number;
  totalCount: number;
  scorePct: number;
  finishedAt: string;
}

export interface PracticeCardsPage {
  items: PracticeCard[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

export type PracticePhase = "idle" | "running" | "done" | "answer_key";
