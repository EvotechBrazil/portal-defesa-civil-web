export type QuestionBankMode = "study" | "answer-key";

export interface QuestionOption {
  id: string;
  ord: number;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  stem: string;
  explanationMd: string | null;
  sourceRef: string | null;
  moduleCode: string;
  quizCode: string;
  options: QuestionOption[];
}

export interface QuestionsFilter {
  moduleCode?: string;
  quizCode?: string;
  search?: string;
  page: number;
  pageSize: number;
}
