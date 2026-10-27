import { client } from "../../client";
import type { BatchRow } from "../../types";
export type { BatchRow };

export interface BatchCreate {
  institute_id: string;
  course_id: string;
  batch_name: string;
  batch_code: string;
  start_date?: string | null;
  end_date?: string | null;
}

export interface BatchUpdate {
  batch_name?: string;
  batch_code?: string;
  course_id?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  student_ids?: string[];
  teacher_ids?: string[];
  subject_ids?: string[];
}

export interface ListBatchesParams {
  institute_id?: string;
  course_id?: string;
  q?: string;
  limit?: number;
  offset?: number;
}

/** GET /batches */
export async function listBatches(
  params: ListBatchesParams = {}
): Promise<BatchRow[]> {
  const { data } = await client.get<BatchRow[]>("/batches", { params });
  return data;
}

/** GET /batches/{id} */
export async function getBatch(id: string): Promise<BatchRow> {
  const { data } = await client.get<BatchRow>(`/batches/${id}`);
  return data;
}

/** POST /batches */
export async function createBatch(payload: BatchCreate): Promise<BatchRow> {
  const { data } = await client.post<BatchRow>("/batches", payload);
  return data;
}

/** PATCH /batches{id} */
export async function updateBatch(
  id: string,
  payload: BatchUpdate
): Promise<BatchRow> {
  const { data } = await client.patch<BatchRow>(`/batches/${id}`, payload);
  return data;
}

/** DELETE /batches/{id} */
export async function deleteBatch(id: string): Promise<void> {
  await client.delete(`/batches/${id}`);
}

/** POST /batches/{batchId}/teachers */
export async function assignTeachersToBatch(
  batchId: string,
  teacherIds: string[]
): Promise<BatchRow> {
  const { data } = await client.post<BatchRow>(
    `/batches/${batchId}/teachers`,
    { teacher_ids: teacherIds }
  );
  return data;
}

/** DELETE /batches/{batchId}/teachers/{teacherId} */
export async function unassignTeacherFromBatch(
  batchId: string,
  teacherId: string
): Promise<void> {
  await client.delete(`/batches/${batchId}/teachers/${teacherId}`);
}

/** POST /batches/{batchId}/students/studentIds */
export async function mapStudentsToBatch(
  batchId: string,
  studentIds: string[]
): Promise<BatchRow> {
  const { data } = await client.post<BatchRow>(
    `/batches/${batchId}/students`,
    { student_ids: studentIds }
  );
  return data;
}

/** DELETE /batches/{batchId}/students/studentId */
export async function removeStudentFromBatch(
  batchId: string,
  studentId: string
): Promise<void> {
  await client.delete(`/batches/${batchId}/students/${studentId}`);
}

/** POST /batches/{batchId}/transfer/toBatchId,studentIds */
export async function transferBatchStudents(
  fromBatchId: string,
  toBatchId: string,
  studentIds: string[]
): Promise<{ moved: number }> {
  const { data } = await client.post<{ moved: number }>(
    `/batches/${fromBatchId}/transfer`,
    { to_batch_id: toBatchId, student_ids: studentIds }
  );
  return data;
}