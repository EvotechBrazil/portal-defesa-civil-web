import { z } from "zod";

export const createStudySessionSchema = z.object({
  deckSelector: z.enum(["ESSENTIAL", "FULL"]),
  bidir: z.boolean(),
  filter: z.enum(["ALL", "HARD_ONLY"]),
});

export type CreateStudySessionForm = z.infer<typeof createStudySessionSchema>;
