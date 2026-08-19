import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addAllowedWhatsapp,
  approveAccessRequest,
  listAccessRequests,
  listAllowedWhatsapps,
  rejectAccessRequest,
  removeAllowedWhatsapp,
} from "../services/access.service";
import type { AccessRequestStatus } from "../types/access.types";

export function useAccessRequests(status?: AccessRequestStatus) {
  return useQuery({
    queryKey: ["admin", "access-requests", status],
    queryFn: () => listAccessRequests(status),
  });
}

export function useAllowedWhatsapps() {
  return useQuery({
    queryKey: ["admin", "allowed-whatsapps"],
    queryFn: listAllowedWhatsapps,
  });
}

export function useApproveAccessRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveAccessRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useRejectAccessRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectAccessRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useAddAllowedWhatsapp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addAllowedWhatsapp,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "allowed-whatsapps"] });
    },
  });
}

export function useRemoveAllowedWhatsapp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeAllowedWhatsapp,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "allowed-whatsapps"] });
    },
  });
}
