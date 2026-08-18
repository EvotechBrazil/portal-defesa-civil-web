import { z } from "zod";

export const questionsFilterSchema = z.object({
  moduleCode: z.string().trim().optional(),
  quizCode: z.string().trim().optional(),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type QuestionsFilterInput = z.infer<typeof questionsFilterSchema>;
