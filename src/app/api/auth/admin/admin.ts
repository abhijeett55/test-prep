import { client } from "../../client";
import type { AdminProfile, OptionsResponse } from "../../types";

export interface AdminCreate {
  admin_id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  institute_id?: string | null;
}

export interface AdminUpdate {
  full_name?: string;
  email?: string;
  phone?: string | null;
  institute_id?: string | null;
}

export interface AdminCreated extends AdminProfile {
  temp_password: string;
}

/** GET /admins/options */
export async function getAdminOptions(): Promise<OptionsResponse> {
  const { data } = await client.get<OptionsResponse>("/admins/options");
  return data;
}

/** GET /admins */
export async function listAdmins(): Promise<AdminProfile[]> {
  const { data } = await client.get<AdminProfile[]>("/admins");
  return data;
}

/** GET /admins/me — the caller's own profile */
export async function getMe(): Promise<AdminProfile> {
  const { data } = await client.get<AdminProfile>("/admins/me");
  return data;
}

/** GET /admins/{id} */
export async function getAdmin(id: string): Promise<AdminProfile> {
  const { data } = await client.get<AdminProfile>(`/admins/${id}`);
  return data;
}

/** POST /admins */
export async function createAdmin(payload: AdminCreate): Promise<AdminCreated> {
  const { data } = await client.post<AdminCreated>("/admins", payload);
  return data;
}

/** PATCH /admins/{id} */
export async function updateAdmin(
  id: string,
  payload: AdminUpdate
): Promise<AdminProfile> {
  const { data } = await client.patch<AdminProfile>(`/admins/${id}`, payload);
  return data;
}

/** DELETE /admins/{id} */
export async function deleteAdmin(id: string): Promise<void> {
  await client.delete(`/admins/${id}`);
}