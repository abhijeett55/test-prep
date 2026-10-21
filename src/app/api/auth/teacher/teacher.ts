import { client } from "../../client";
import type {
  TeacherOptionsResponse,
  TeacherRow,
  CourseRow,
  BatchRow,
  StudentRow
} from "../../types";
export type {
  TeacherOptionsResponse,
  TeacherRow,
  CourseRow,
  BatchRow,
  StudentRow
}

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

export interface TeacherUpdate {
  full_name?: string;
  email?: string | null;
  phone?: string | null;
  employee_code?: string | null;
  qualification?: string | null;
}

export type TeacherDetail = TeacherRow & {
  subject_ids: string[];
};

export interface AttemptOut {
  attemptId: string;
  student: string;
  testName: string;
  batch: string;
  attemptedAt: string;
  score: number;
  totalMarks: number;
  passMarks: number;
}

export interface BatchAnalyticsOut {
  batchId: string;
  batchName: string;
  students: number;
  testsConducted: number;
  avgScore: number | null;
  passRate: number | null;
  topScorer: string | null;
}

export interface WeakTopicOut {
  topicId: string;
  topic: string;
  subject: string;
  batch: string;
  accuracy: number;
  studentsStruggling: number;
}

/** GET /teachers/me/attempts */
export async function getMyAttempts(): Promise<AttemptOut[]> {
  const { data } = await client.get<AttemptOut[]>("/teachers/me/attempts");
  return data;
}

/** GET /teachers/me/batch-analytics */
export async function getMyBatchAnalytics(): Promise<BatchAnalyticsOut[]> {
  const { data } = await client.get<BatchAnalyticsOut[]>("/teachers/me/batch-analytics");
  return data;
}

/** GET /teachers/me/weak-topics  */
export async function getMyWeakTopics(): Promise<WeakTopicOut[]> {
  const { data } = await client.get<WeakTopicOut[]>("/teachers/me/weak-topics");
  return data;
}

/** GET /teachers/{id}  */
export async function getTeacher(id: string): Promise<TeacherDetail> {
  const { data } = await client.get<TeacherDetail>(`/teachers/${id}`);
  return data;
}

/** PATCH /teachers/{id}  (admin only)  */
export async function updateTeacher(
  id: string,
  payload: TeacherUpdate
): Promise<TeacherDetail> {
  const { data } = await client.patch<TeacherDetail>(`/teachers/${id}`, payload);
  return data;
}

/** POST /teachers/{id}/subjects/subjectIds  (admin only) */
export async function setTeacherSubjects(
  id: string,
  subjectIds: string[]
): Promise<TeacherDetail> {
  const { data } = await client.post<TeacherDetail>(
    `/teachers/${id}/subjects`,
    { subject_ids: subjectIds }
  );
  return data;
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

/** GET /teachers/me/courses  (admin only) */
export async function getMyCourses(): Promise<CourseRow[]> {
  const { data } = await client.get<CourseRow[]>("/teachers/me/courses");
  return data;
}

/** GET /teachers/me/batches */
export async function getMyBatches(): Promise<BatchRow[]> {
  const { data } = await client.get<BatchRow[]>("/teachers/me/batches");
  return data;
}

/** GET /teachers/me/students */
export async function getMyStudents(): Promise<StudentRow[]> {
  const { data } = await client.get<StudentRow[]>("/teachers/me/students");
  return data;
}

/** POST /teachers/{teacherId}/students */
export async function assignStudentsToTeacher(
  teacherId: string,
  studentIds: string[]
): Promise<unknown> {
  const { data } = await client.post(`/teachers/${teacherId}/students`, {
    student_ids: studentIds,
  });
  return data;
}