import { api } from "@/lib/api";
import type { ApiEnvelope } from "@/types/api.types";
import type {
  CreateManadaInput,
  ManadaListParams,
  ManadaListResult,
  ManadaView,
} from "../types/manada.types";

export async function listManadas(params: ManadaListParams): Promise<ManadaListResult> {
  const response = await api.get<ApiEnvelope<ManadaListResult>>("/manadas", {
    params: {
      country: params.country || undefined,
      state: params.state || undefined,
      city: params.city || undefined,
      q: params.q || undefined,
    },
  });
  return response.data.data;
}

export async function createManada(input: CreateManadaInput): Promise<ManadaView> {
  const response = await api.post<ApiEnvelope<ManadaView>>("/manadas", input);
  return response.data.data;
}
