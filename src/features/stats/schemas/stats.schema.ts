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

export const peerManadaSchema = z.object({
  id: z.string(),
  name: z.string(),
  city: z.string(),
  state: z.string(),
});

export const peerProfileSchema = z.object({
  userId: z.string(),
  name: z.string(),
  photoUrl: z.string().nullable(),
  lgndNumber: z.string().nullable(),
  squad: z.string().nullable(),
  manada: peerManadaSchema.nullable(),
});

export const peerStatsSchema = userStatsSchema.extend({
  profile: peerProfileSchema,
  disclaimer: z.string(),
});

export const manadaMemberSchema = z.object({
  userId: z.string(),
  name: z.string(),
  photoUrl: z.string().nullable(),
  lgndNumber: z.string().nullable(),
  squad: z.string().nullable(),
  coveragePct: z.number(),
  practiceAccuracyPct: z.number(),
  activeDays30d: z.number(),
  lastActiveAt: z.string().nullable(),
});

export const rankingStudySchema = z.object({
  practiceAccuracyPct: z.number(),
  attempts: z.number(),
  activeDays30d: z.number(),
  coveragePct: z.number(),
  lastActiveAt: z.string().nullable(),
  selfReported: z.array(z.string()),
});

export const rankingItemSchema = z.object({
  userId: z.string(),
  name: z.string(),
  photoUrl: z.string().nullable(),
  lgndNumber: z.string().nullable(),
  manada: peerManadaSchema.nullable(),
  study: rankingStudySchema,
  priorityScore: z.number(),
  engagementBand: z.enum(["high", "mid", "low"]),
  priorityParts: z.object({
    accuracy: z.number(),
    consistency: z.number(),
    volume: z.number(),
  }),
  operational: z.null(),
  practicalTrainingNotice: z.string().min(1),
});

export const rankingDataSchema = z.object({
  ranked: z.array(rankingItemSchema),
  insufficientBase: z.array(rankingItemSchema),
});

export const rankingMetaSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  pageCount: z.number(),
  disclaimer: z.string().min(1),
  truncated: z.boolean(),
});

export const rankingEnvelopeSchema = z.object({
  data: rankingDataSchema,
  meta: rankingMetaSchema,
});
