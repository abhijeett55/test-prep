import { client } from "../../client";
import type { InstituteProfile, DepartmentRow } from "../../types";

export interface InstituteUpdate {
  institute_name?: string;
  phone?: string | null;
  address?: string | null;
}

// ---- own institute ----

export async function getMyInstitute(): Promise<InstituteProfile> {
  const { data } = await client.get<InstituteProfile>("/institutes/me");
  return data;
}

export async function updateMyInstitute(
  payload: InstituteUpdate
): Promise<InstituteProfile> {
  const { data } = await client.patch<InstituteProfile>(
    "/institutes/me",
    payload
  );
  return data;
}

// ---- departments (if you add the model) ----

export interface DepartmentCreate {
  department_name: string;
  head_teacher_id?: string | null;
}

export interface DepartmentUpdate {
  department_name?: string;
  head_teacher_id?: string | null;
}

export async function listDepartments(): Promise<DepartmentRow[]> {
  const { data } = await client.get<DepartmentRow[]>("/institutes/me/departments");
  return data;
}

export async function createDepartment(
  payload: DepartmentCreate
): Promise<DepartmentRow> {
  const { data } = await client.post<DepartmentRow>(
    "/institutes/me/departments",
    payload
  );
  return data;
}

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

export async function deleteDepartment(id: string): Promise<void> {
  await client.delete(`/institutes/me/departments/${id}`);
}