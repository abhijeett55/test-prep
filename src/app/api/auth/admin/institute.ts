import { client } from "../../client";
import type { InstituteProfile, DepartmentRow } from "../../types";
export type { InstituteProfile, DepartmentRow };

export interface InstituteUpdate {
  institute_name?: string;
  phone?: string | null;
  address?: string | null;
}

export interface DepartmentCreate {
  department_name: string;
  head_teacher_id?: string | null;
}

export interface DepartmentUpdate {
  department_name?: string;
  head_teacher_id?: string | null;
}

// ---- institute ----

/** GET /institutes/my-institute */
export async function getMyInstitute(): Promise<InstituteProfile> {
  const { data } = await client.get<InstituteProfile>("/institutes/my-institute");
  return data;
}

/** PATCH /institutes/my-institute */
export async function updateMyInstitute(payload: InstituteUpdate) {
  const { data } = await client.patch<InstituteProfile>("/institutes/my-institute", payload);
  return data;
}

/** GET /institutes */
export async function listInstitutes(): Promise<InstituteProfile[]> {
  const { data } = await client.get<InstituteProfile[]>("/institutes");
  return data;
}

/** GET /institutes/{id} */
export async function getInstitute(id: string): Promise<InstituteProfile> {
  const { data } = await client.get<InstituteProfile>(`/institutes/${id}`);
  return data;
}

// ---- departments ----


/** GET /institutes/me/departments */
export async function listDepartments(): Promise<DepartmentRow[]> {
  const { data } = await client.get<DepartmentRow[]>("/institutes/me/departments");
  return data;
}

/** POST /institutes/me/departments */
export async function createDepartment(
  payload: DepartmentCreate
): Promise<DepartmentRow> {
  const { data } = await client.post<DepartmentRow>(
    "/institutes/me/departments",
    payload
  );
  return data;
}

/** PATCH /institutes/me/departments/{id} */
export async function updateDepartment(
  id: string,
  payload: DepartmentUpdate
): Promise<DepartmentRow> {
  const { data } = await client.patch<DepartmentRow>(
    `/institutes/me/departments/${id}`,
    payload
  );
  return data;
}

/** DELETE /institutes/me/departments/{id} */
export async function deleteDepartment(id: string): Promise<void> {
  await client.delete(`/institutes/me/departments/${id}`);
}