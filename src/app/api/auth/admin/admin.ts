import { client } from "../../client";
import type { AdminProfile } from "../../types";

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

/** DELETE /admins/{id} */
export async function deleteAdmin(id: string): Promise<void> {
  await client.delete(`/admins/${id}`);
}