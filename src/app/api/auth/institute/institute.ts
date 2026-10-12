import { client } from "../../client";
import type { InstituteProfile } from "../../types";

export interface CreateInstitute {
  institute_name: string;
  code: string;
  email: string;
  phone?: string | null;
  address?: string | null;
}

export interface RegisterInstitute extends CreateInstitute {
  password: string;
}

export interface UpdateInstitute {
  institute_name?: string;
  email?: string;
  phone?: string | null;
  address?: string | null;
}

export interface InstituteCreated extends InstituteProfile {
  temp_password: string;
}

/** POST /api/v1/institutes/register  (public) */
export async function registerInstitute(
  payload: RegisterInstitute
): Promise<InstituteProfile> {
  const { data } = await client.post<InstituteProfile>(
    "/api/v1/institutes/register",
    payload
  );
  return data;
}

/** GET /api/v1/institutes  (admin only) */
export async function listInstitutes(): Promise<InstituteProfile[]> {
  const { data } = await client.get<InstituteProfile[]>("/api/v1/institutes");
  return data;
}

/** POST /api/v1/institutes  (admin only) */
export async function createInstitute(
  payload: CreateInstitute
): Promise<InstituteCreated> {
  const { data } = await client.post<InstituteCreated>(
    "/api/v1/institutes",
    payload
  );
  return data;
}

/** GET /api/v1/institutes/{id}  (admin only) */
export async function getInstitute(id: string): Promise<InstituteProfile> {
  const { data } = await client.get<InstituteProfile>(`/api/v1/institutes/${id}`);
  return data;
}

/** PATCH /api/v1/institutes/{id}  (admin only) */
export async function updateInstitute(
  id: string,
  payload: UpdateInstitute
): Promise<InstituteProfile> {
  const { data } = await client.patch<InstituteProfile>(
    `/api/v1/institutes/${id}`,
    payload
  );
  return data;
}

/** DELETE /api/v1/institutes/{id}  (admin only) */
export async function deleteInstitute(id: string): Promise<void> {
  await client.delete(`/api/v1/institutes/${id}`);
}