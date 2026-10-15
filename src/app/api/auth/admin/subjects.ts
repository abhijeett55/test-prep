import { client } from "../../client";
import type { SubjectRow } from "../../types";

export interface SubjectCreate {
  institute_id: string;
  subject_name: string;
  subject_code: string;
}

export interface SubjectUpdate {
  subject_name?: string;
  subject_code?: string;
}

export interface ListSubjectsParams {
  institute_id?: string;
  q?: string;
  limit?: number;
  offset?: number;
}

export async function listSubjects(
  params: ListSubjectsParams = {}
): Promise<SubjectRow[]> {
  const { data } = await client.get<SubjectRow[]>("/subjects", { params });
  return data;
}

export async function getSubject(id: string): Promise<SubjectRow> {
  const { data } = await client.get<SubjectRow>(`/subjects/${id}`);
  return data;
}

export async function createSubject(payload: SubjectCreate): Promise<SubjectRow> {
  const { data } = await client.post<SubjectRow>("/subjects", payload);
  return data;
}

export async function updateSubject(
  id: string,
  payload: SubjectUpdate
): Promise<SubjectRow> {
  const { data } = await client.patch<SubjectRow>(`/subjects/${id}`, payload);
  return data;
}

export async function deleteSubject(id: string): Promise<void> {
  await client.delete(`/subjects/${id}`);
}

// ---- assignments ----

export async function assignSubjectToCourse(
  subjectId: string,
  courseId: string
): Promise<void> {
  await client.post(`/subjects/${subjectId}/courses`, { course_id: courseId });
}

export async function unassignSubjectFromCourse(
  subjectId: string,
  courseId: string
): Promise<void> {
  await client.delete(`/subjects/${subjectId}/courses/${courseId}`);
}

export async function assignSubjectToTeacher(
  subjectId: string,
  teacherId: string
): Promise<void> {
  await client.post(`/subjects/${subjectId}/teachers`, {
    teacher_id: teacherId,
  });
}