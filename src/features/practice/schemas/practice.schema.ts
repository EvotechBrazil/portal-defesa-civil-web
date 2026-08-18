import { z } from "zod";

export const submitAnswerSchema = z.object({
  questionId: z.string().min(1),
  optionId: z.string().min(1),
});

export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;
