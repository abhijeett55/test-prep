import { client } from "../../client";
import type { OptionsResponse, ProviderRow } from "../../types";

export interface ProviderCreate {
  provider_id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  employee_code?: string | null;
  institute_id?: string | null;
}

export interface ProviderCreated extends ProviderRow {
  temp_password: string;
}

/** GET /api/v1/providers/options  (admin only) */
export async function getProviderOptions(): Promise<OptionsResponse> {
  const { data } = await client.get<OptionsResponse>("/api/v1/providers/options");
  return data;
}

/** GET /api/v1/providers  (admin only) */
export async function listProviders(): Promise<ProviderRow[]> {
  const { data } = await client.get<ProviderRow[]>("/api/v1/providers");
  return data;
}

/** POST /api/v1/providers  (admin only) */
export async function createProvider(payload: ProviderCreate): Promise<ProviderCreated> {
  const { data } = await client.post<ProviderCreated>("/api/v1/providers", payload);
  return data;
}