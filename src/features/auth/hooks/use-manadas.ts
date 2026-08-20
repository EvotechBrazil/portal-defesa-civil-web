"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createManada, listManadas } from "../services/manadas.service";
import type { CreateManadaInput, ManadaListParams } from "../types/manada.types";

export function useManadas(params: ManadaListParams, enabled = true) {
  return useQuery({
    queryKey: ["manadas", params],
    queryFn: () => listManadas(params),
    enabled,
    staleTime: 60_000,
  });
}

export function useCreateManada() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateManadaInput) => createManada(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["manadas"] });
    },
  });
}
