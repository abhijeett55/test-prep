import { client } from "../../client";
import type { BatchRow } from "../../types";

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
  course_id?: string;
  start_date?: string | null;
  end_date?: string | null;
}

export interface ListBatchesParams {
  institute_id?: string;
  course_id?: string;
  q?: string;
  limit?: number;
  offset?: number;
}

export async function listBatches(
  params: ListBatchesParams = {}
): Promise<BatchRow[]> {
  const { data } = await client.get<BatchRow[]>("/batches", { params });
  return data;
}

export async function getBatch(id: string): Promise<BatchRow> {
  const { data } = await client.get<BatchRow>(`/batches/${id}`);
  return data;
}

export async function createBatch(payload: BatchCreate): Promise<BatchRow> {
  const { data } = await client.post<BatchRow>("/batches", payload);
  return data;
}

export async function updateBatch(
  id: string,
  payload: BatchUpdate
): Promise<BatchRow> {
  const { data } = await client.patch<BatchRow>(`/batches/${id}`, payload);
  return data;
}

export async function deleteBatch(id: string): Promise<void> {
  await client.delete(`/batches/${id}`);
}

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

export async function unassignTeacherFromBatch(
  batchId: string,
  teacherId: string
): Promise<void> {
  await client.delete(`/batches/${batchId}/teachers/${teacherId}`);
}

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

export async function removeStudentFromBatch(
  batchId: string,
  studentId: string
): Promise<void> {
  await client.delete(`/batches/${batchId}/students/${studentId}`);
}

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