"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBrazilCities, fetchBrazilStates } from "../lib/locations";

export function useBrazilStates(enabled: boolean) {
  return useQuery({
    queryKey: ["ibge-states"],
    queryFn: fetchBrazilStates,
    enabled,
    staleTime: Infinity,
    retry: 1,
  });
}

export function useBrazilCities(uf: string | undefined) {
  return useQuery({
    queryKey: ["ibge-cities", uf],
    queryFn: () => fetchBrazilCities(uf ?? ""),
    enabled: Boolean(uf),
    staleTime: Infinity,
    retry: 1,
  });
}
