export type DeckKind = "ESSENTIAL" | "EXAM";
export type DeckSelector = "ESSENTIAL" | "FULL";
export type StudyFilter = "ALL" | "HARD_ONLY";
export type CardLevel = "NEW" | "HARD" | "LEARNING" | "EASY";
export type ReviewRating = "HARD" | "LEARNING" | "EASY";
export type CardDirection = "FORWARD" | "REVERSE";
/** Nível em foco na fila. `null` = fila inteira. */
export type StudyFocus = Exclude<CardLevel, "NEW"> | null;

export interface CardLinkView {
  label: string;
  targetSlug: string;
}

export interface CardStateView {
  level: CardLevel;
  streak: number;
  seen: number;
}

export interface CurrentCardView {
  id: string;
  code: string;
  deck: DeckKind;
  direction: CardDirection;
  front: string;
  back: string;
  theoryMd: string;
  sourceMd: string;
  links: CardLinkView[];
  state: CardStateView;
  practiceQuestionIds: string[];
}

export interface ReviewTally {
  HARD: number;
  LEARNING: number;
  EASY: number;
}

export interface StudySessionView {
  sessionId: string;
  queueLength: number;
  reviews: number;
  bidir: boolean;
  courseSlug?: string | null;
  deckSelector: DeckSelector;
  finished: boolean;
  tally: ReviewTally;
  /** Composição da fila restante por nível — base dos KPIs clicáveis. */
  queueLevels: Record<CardLevel, number>;
  focus: StudyFocus;
  card: CurrentCardView | null;
}

export interface ReviewSessionView extends StudySessionView {
  reviewed: {
    cardId: string;
    level: CardLevel;
    streak: number;
    seen: number;
    retired: boolean;
  };
}

export interface FinishSessionView {
  sessionId: string;
  reviews: number;
  tally: ReviewTally;
  easyCount: number;
  poolSize: number;
  endedAt: string;
}

export interface DeckListItem {
  id: string;
  kind: DeckKind;
  title: string;
  courseId: string;
  courseSlug: string;
  cardCount: number;
  levels: Record<CardLevel, number>;
}

export interface CreateStudySessionInput {
  deckSelector: DeckSelector;
  bidir: boolean;
  filter: StudyFilter;
  courseSlug?: string;
}
