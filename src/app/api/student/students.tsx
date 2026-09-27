import type { FormValues } from "../../components/FormLayout/types";

const API_BASE_URL =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (import.meta as any).env?.VITE_API_BASE_URL ?? "http://localhost:8002";

export type StudentStatusApi = "ACTIVE" | "INACTIVE" | "BLOCKED";

// Mirrors app/schemas/student.py -> StudentResponse
export type StudentApiResponse = {
  id: string;
  full_name: string;
  email: string;
  self_phone: string | null;
  father_name: string;
  father_phone: string | null;
  mother_name: string;
  mother_phone: string | null;
  address: string;
  status: StudentStatusApi;
  ip_address: string | null;
  latitude: number | null;
  longitude: number | null;
  placeholder: string | null;
  institute_id: string | null;
  created_at: string;
  updated_at: string;
};

type StudentApiError = { detail?: string };

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function asUuidOrUndefined(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return UUID_PATTERN.test(value) ? value : undefined;
}

function numberOrUndefined(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

/** Maps the raw FormValues out of StudentForm to the FastAPI StudentCreate payload. */
export function mapFormValuesToStudentCreate(values: FormValues) {
  return {
    full_name: `${values.firstName ?? ""} ${values.LastName ?? ""}`.trim(),
    email: values.email ?? "",
    self_phone: values.phone || undefined,
    father_name: `${values.fatherFirstName ?? ""} ${values.fatherLastName ?? ""}`.trim(),
    father_phone: values.fatherPhone || undefined,
    mother_name: `${values.motherFirstName ?? ""} ${values.motherLastName ?? ""}`.trim(),
    mother_phone: values.motherPhone || undefined,
    address: values.address ?? "",
    status: (values.status || "ACTIVE") as StudentStatusApi,
    ip_address: values.ip_address || undefined,
    latitude: numberOrUndefined(values.latitude),
    longitude: numberOrUndefined(values.longitude),
    placeholder: values.placeholder || undefined,
    institute_id: asUuidOrUndefined(values.institute_id),
  };
}

export async function createStudent(values: FormValues): Promise<StudentApiResponse> {
  const payload = mapFormValuesToStudentCreate(values);

  const res = await fetch(`${API_BASE_URL}/students/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let detail = `Request failed with status ${res.status}`;
    try {
      const body = (await res.json()) as StudentApiError;
      if (body?.detail) detail = body.detail;
    } catch {
      // response body wasn't JSON — keep the generic message
    }
    throw new Error(detail);
  }

  return res.json();
}