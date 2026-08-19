import { useMutation } from "@tanstack/react-query";
import { requestAccess } from "../services/auth.service";
import type { AccessRequestInput } from "../types/auth.types";

export function useRequestAccess() {
  return useMutation({
    mutationFn: (input: AccessRequestInput) => requestAccess(input),
  });
}
