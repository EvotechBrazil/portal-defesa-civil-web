import { z } from "zod";

export const cardLevelsSchema = z.object({
  NEW: z.number(),
  HARD: z.number(),
  LEARNING: z.number(),
  EASY: z.number(),
});

export const reviewTallySchema = z.object({
  HARD: z.number(),
  LEARNING: z.number(),
  EASY: z.number(),
});

export const moduleAccuracySchema = z.object({
  code: z.string(),
  title: z.string(),
  accuracyPct: z.number(),
  attempts: z.number(),
});

export const stuckCardSchema = z.object({
  cardId: z.string(),
  code: z.string(),
  frontMd: z.string(),
  seen: z.number(),
  streak: z.number(),
  lastSeenAt: z.string().nullable(),
});

export const sessionLast30dSchema = z.object({
  id: z.string(),
  startedAt: z.string(),
  endedAt: z.string().nullable(),
  reviews: z.number(),
  tally: reviewTallySchema,
  deckSelector: z.enum(["ESSENTIAL", "FULL"]),
});

export const userStatsSchema = z.object({
  byModule: z.array(moduleAccuracySchema),
  cardLevels: cardLevelsSchema,
  stuckCards: z.array(stuckCardSchema),
  sessionsLast30d: z.array(sessionLast30dSchema),
});
