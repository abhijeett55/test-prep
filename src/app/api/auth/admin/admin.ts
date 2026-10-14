import { client } from "../../client";
import type {
  AdminProfile,
  OptionsResponse,
} from "../../types";

export interface AdminCreate {
  admin_id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  institute_id?: string | null;
}

export interface AdminCreated extends AdminProfile {
  temp_password: string;
}

/** GET /admins/options — baseURL carries /api/v1 */
export async function getAdminOptions(): Promise<OptionsResponse> {
  const { data } = await client.get<OptionsResponse>("/admins/options");
  return data;
}

/** GET /admins */
export async function listAdmins(): Promise<AdminProfile[]> {
  const { data } = await client.get<AdminProfile[]>("/admins");
  return data;
}

/** POST /admins — returns the one-time temp password */
export async function createAdmin(payload: AdminCreate): Promise<AdminCreated> {
  const { data } = await client.post<AdminCreated>("/admins", payload);
  return data;
}

/** GET /admins/me — the caller's own profile */
export async function getMe(): Promise<AdminProfile> {
  const { data } = await client.get<AdminProfile>("/admins/me");
  return data;
}