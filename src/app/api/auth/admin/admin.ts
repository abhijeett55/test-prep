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

/** GET /api/v1/admins/options  (admin only) */
export async function getAdminOptions(): Promise<OptionsResponse> {
  const { data } = await client.get<OptionsResponse>("/api/v1/admins/options");
  return data;
}

/** GET /api/v1/admins  (admin only) */
export async function listAdmins(): Promise<AdminProfile[]> {
  const { data } = await client.get<AdminProfile[]>("/api/v1/admins");
  return data;
}

/** POST /api/v1/admins  (admin only) — returns the one-time temp password */
export async function createAdmin(payload: AdminCreate): Promise<AdminCreated> {
  const { data } = await client.post<AdminCreated>("/api/v1/admins", payload);
  return data;
}