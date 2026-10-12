import { client } from "../../client";
import type {
  TeacherOptionsResponse,
  TeacherRow,
} from "../../types";

export interface TeacherCreate {
  teacher_id: string;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  institute_id?: string | null;
  employee_code?: string | null;
  qualification?: string | null;
  ip_address?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  subject_ids?: string[];
}

export interface TeacherCreated extends TeacherRow {
  temp_password: string;
}

export interface ListTeachersParams {
  q?: string;
  limit?: number;
  offset?: number;
}


/** GET /teachers/options  (admin only) — baseURL already carries /api/v1 */
export async function getTeacherOptions(): Promise<TeacherOptionsResponse> {
  const { data } = await client.get<TeacherOptionsResponse>("/teachers/options");
  return data;
}


export async function listTeachers(
  params: ListTeachersParams = {}
): Promise<TeacherRow[]> {
  const { data } = await client.get<TeacherRow[]>("/teachers", {
    params: {
      q: params.q || undefined,
      limit: params.limit ?? 100,
      offset: params.offset ?? 0,
    },
  });
  return data;
}
/** POST /teachers  (admin only) */
export async function createTeacher(
  payload: TeacherCreate
): Promise<TeacherCreated> {
  const { data } = await client.post<TeacherCreated>("/teachers", payload);
  return data;
}