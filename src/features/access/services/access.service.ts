import { api } from "@/lib/api";
import type { ApiEnvelope } from "@/types/api.types";
import type { AccessRequestStatus, AccessRequestView, AllowedWhatsappView } from "../types/access.types";

export async function listAccessRequests(status?: AccessRequestStatus) {
  const response = await api.get<ApiEnvelope<AccessRequestView[]>>(
    "/admin/access-requests",
    { params: { status, pageSize: 100 } },
  );
  return response.data.data;
}

export async function approveAccessRequest(id: string) {
  const response = await api.post<ApiEnvelope<AccessRequestView>>(
    `/admin/access-requests/${id}/approve`,
  );
  return response.data.data;
}

export async function rejectAccessRequest(id: string) {
  const response = await api.post<ApiEnvelope<AccessRequestView>>(
    `/admin/access-requests/${id}/reject`,
  );
  return response.data.data;
}

export async function listAllowedWhatsapps() {
  const response = await api.get<ApiEnvelope<AllowedWhatsappView[]>>(
    "/admin/allowed-whatsapps",
    { params: { pageSize: 100 } },
  );
  return response.data.data;
}

export async function addAllowedWhatsapp(input: { whatsapp: string; label?: string }) {
  const response = await api.post<ApiEnvelope<AllowedWhatsappView>>(
    "/admin/allowed-whatsapps",
    input,
  );
  return response.data.data;
}

export async function removeAllowedWhatsapp(id: string) {
  await api.delete(`/admin/allowed-whatsapps/${id}`);
}
