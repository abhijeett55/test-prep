import { client } from "../../client";
import type { StudentRow, StudentDetail } from "../../types";
export type { StudentRow, StudentDetail };

// ============================================================
//  Students — CRUD
// ============================================================

export interface StudentCreate {
  student_id?: string;
  full_name: string;
  email: string;
  institute_id?: string | null;
  father_name: string;
  mother_name: string;
  address: string;
  self_phone?: string | null;
  father_phone?: string | null;
  mother_phone?: string | null;
  ip_address?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  course_ids?: string[];
  subject_ids?: string[];
}


export interface StudentUpdate {
  full_name?: string;
  email?: string;
  self_phone?: string | null;
  father_name?: string;
  father_phone?: string | null;
  mother_name?: string;
  mother_phone?: string | null;
  address?: string;
  status?: "ACTIVE" | "INACTIVE" | "BLOCKED";
}


export interface StudentCreated extends StudentRow {
  temp_password: string;
}

export interface ListStudentsParams {
  q?: string;
  batch_id?: string;
  course_id?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export interface StudentOptions {
  institutes: { id: string; name: string }[];
  courses: { id: string; name: string }[];
  subjects: { id: string; name: string }[];
}

export async function getStudentOptions(): Promise<StudentOptions> {
  const { data } = await client.get<StudentOptions>("/students/options");
  return data;
}

export async function listStudents(
  params: ListStudentsParams = {}
): Promise<StudentRow[]> {
  const { data } = await client.get<StudentRow[]>("/students", { params });
  return data;
}

export async function getStudent(id: string): Promise<StudentDetail> {
  const { data } = await client.get<StudentDetail>(`/students/${id}`);
  return data;
}

export async function createStudent(
  payload: StudentCreate
): Promise<StudentCreated> {
  const { data } = await client.post<StudentCreated>("/students", payload);
  return data;
}

export async function updateStudent(
  id: string,
  payload: StudentUpdate
): Promise<StudentDetail> {
  const { data } = await client.patch<StudentDetail>(`/students/${id}`, payload);
  return data;
}

export async function deleteStudent(id: string): Promise<void> {
  await client.delete(`/students/${id}`);
}


export async function setStudentCourses(
  studentId: string,
  courseIds: string[]
): Promise<StudentDetail> {
  const { data } = await client.post<StudentDetail>(
    `/students/${studentId}/courses/bulk`,
    { course_ids: courseIds }
  );
  return data;
}
// ============================================================
//  Enrollment (student → course)
// ============================================================

export async function enrollInCourse(
  studentId: string,
  courseId: string
): Promise<StudentDetail> {
  const { data } = await client.post<StudentDetail>(
    `/students/${studentId}/courses`,
    { course_id: courseId }
  );
  return data;
}

export async function unenrollFromCourse(
  studentId: string,
  courseId: string
): Promise<void> {
  await client.delete(`/students/${studentId}/courses/${courseId}`);
}

export async function assignSubjects(
  studentId: string,
  subjectIds: string[]
): Promise<StudentDetail> {
  const { data } = await client.post<StudentDetail>(
    `/students/${studentId}/subjects`,
    { subject_ids: subjectIds }
  );
  return data;
}

// ============================================================
//  Batch transfers (student → batch)
// ============================================================

export async function transferStudentToBatch(
  studentId: string,
  toBatchId: string
): Promise<StudentDetail> {
  const { data } = await client.post<StudentDetail>(
    `/students/${studentId}/transfer`,
    { to_batch_id: toBatchId }
  );
  return data;
}

export async function bulkTransferToBatch(
  studentIds: string[],
  toBatchId: string
): Promise<{ moved: number }> {
  const { data } = await client.post<{ moved: number }>(
    "/students/bulk-transfer",
    { student_ids: studentIds, to_batch_id: toBatchId }
  );
  return data;
}

// ============================================================
//  Enrollment requests (admin approval queue)
// ============================================================

export type EnrollmentStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface EnrollmentRequestRow {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  requested_batch_id: string | null;
  requested_batch_name: string | null;
  applied_at: string;
  status: EnrollmentStatus;
  decided_at: string | null;
  decision_notes: string | null;
}

export interface EnrollmentSummary {
  pending: number;
  approved: number;
  rejected: number;
  requests: EnrollmentRequestRow[];
}

export async function listEnrollmentRequests(): Promise<EnrollmentSummary> {
  const { data } = await client.get<EnrollmentSummary>(
    "/students/enrollment-requests"
  );
  return data;
}

export async function decideEnrollmentRequest(
  id: string,
  status: "APPROVED" | "REJECTED"
): Promise<EnrollmentRequestRow> {
  const { data } = await client.post<EnrollmentRequestRow>(
    `/students/enrollment-requests/${id}/decide`,
    { status }
  );
  return data;
}

// ============================================================
//  Batch transfer requests (admin approval queue)
// ============================================================

export type TransferStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface BatchTransferRow {
  id: string;
  student_id: string;
  student_name: string;
  from_batch_id: string | null;
  from_batch_name: string;
  to_batch_id: string | null;
  to_batch_name: string;
  reason: string | null;
  requested_at: string;
  status: TransferStatus;
  decided_at: string | null;
  decision_notes: string | null;
}

export async function listBatchTransfers(): Promise<BatchTransferRow[]> {
  const { data } = await client.get<BatchTransferRow[]>("/students/transfers");
  return data;
}

export async function decideBatchTransfer(
  id: string,
  status: "APPROVED" | "REJECTED"
): Promise<BatchTransferRow> {
  const { data } = await client.post<BatchTransferRow>(
    `/students/transfers/${id}/decide`,
    { status }
  );
  return data;
}
// ============================================================
//  Fees
// ============================================================

export type FeeStatusValue = "PAID" | "PARTIAL" | "PENDING" | "OVERDUE";

export interface FeeRow {
  student_id: string;
  student_name: string;
  batch_name: string | null;
  total_fee: number;
  paid: number;
  due_date: string | null;
  status: FeeStatusValue;
}

export interface StudentFeeDetail {
  student_id: string;
  total_due: number;
  total_paid: number;
  balance: number;
  status: FeeStatusValue;
  last_payment_at: string | null;
}

export async function listFees(params?: {
  status?: FeeStatusValue;
  q?: string;
}): Promise<FeeRow[]> {
  const { data } = await client.get<FeeRow[]>("/students/fees", { params });
  return data;
}

export async function getStudentFees(
  studentId: string
): Promise<StudentFeeDetail> {
  const { data } = await client.get<StudentFeeDetail>(
    `/students/${studentId}/fees`
  );
  return data;
}

export async function sendFeeReminder(studentId: string): Promise<void> {
  await client.post(`/students/${studentId}/fees/reminder`);
}