"use client";

import { useQuery } from "@tanstack/react-query";
import { listDecks } from "../services/study-api.service";

export const decksQueryKey = ["decks"] as const;

export function useDecks() {
  return useQuery({
    queryKey: decksQueryKey,
    queryFn: listDecks,
  });
}
