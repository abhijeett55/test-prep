import { client } from "../../client";
import type { InstituteProfile } from "../../types";
export type { InstituteProfile };
export type InstituteStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface CreateInstitute {
  institute_name: string;
  code: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  status?: InstituteStatus;
  ip_address?: string | null;
  latitude?: string | null;
  longitude?: string | null;
}

export interface RegisterInstitute {
  institute_name: string;
  code: string;
  email: string;
  password: string;
  phone?: string | null;
  address?: string | null;
}

export interface UpdateInstitute {
  institute_name?: string;
  email?: string;
  phone?: string | null;
  address?: string | null;
  status?: InstituteStatus;
  ip_address?: string | null;
  latitude?: string | null;
  longitude?: string | null;
}

export interface InstituteCreated extends InstituteProfile {
  temp_password: string;
  admin_temp_password: string;
}

/* ---- function bodies unchanged below this line ---- */

/** POST /institutes/register  (public) */
export async function registerInstitute(
  payload: RegisterInstitute
): Promise<InstituteProfile> {
  const { data } = await client.post<InstituteProfile>(
    "/institutes/register",
    payload
  );
  return data;
}

/** GET /institutes  (admin only) */
export async function listInstitutes(): Promise<InstituteProfile[]> {
  const { data } = await client.get<InstituteProfile[]>("/institutes");
  return data;
}

/** POST /institutes  (admin only) */
export async function createInstitute(
  payload: CreateInstitute
): Promise<InstituteCreated> {
  const { data } = await client.post<InstituteCreated>("/institutes", payload);
  return data;
}

/** GET /institutes/{id}  (admin only) */
export async function getInstitute(id: string): Promise<InstituteProfile> {
  const { data } = await client.get<InstituteProfile>(`/institutes/${id}`);
  return data;
}

/** PATCH /institutes/{id}  (admin only) */
export async function updateInstitute(
  id: string,
  payload: UpdateInstitute
): Promise<InstituteProfile> {
  const { data } = await client.patch<InstituteProfile>(
    `/institutes/${id}`,
    payload
  );
  return data;
}

/** DELETE /institutes/{id}  (admin only) */
export async function deleteInstitute(id: string): Promise<void> {
  await client.delete(`/institutes/${id}`);
}