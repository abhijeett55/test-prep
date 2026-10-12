import { client } from "../../client";
import type { OptionsResponse, TestSetterRow } from "../../types";

export interface TestSetterCreate {
  testsetter_id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  institute_id: string;
  employee_code?: string | null;
}

export interface TestSetterCreated extends TestSetterRow {
  temp_password: string;
}

/** GET /api/v1/testsetters/options  (admin only) */
export async function getTestSetterOptions(): Promise<OptionsResponse> {
  const { data } = await client.get<OptionsResponse>("/api/v1/testsetters/options");
  return data;
}

/** GET /api/v1/testsetters  (admin only) */
export async function listTestSetters(): Promise<TestSetterRow[]> {
  const { data } = await client.get<TestSetterRow[]>("/api/v1/testsetters");
  return data;
}

/** POST /api/v1/testsetters  (admin only) */
export async function createTestSetter(
  payload: TestSetterCreate
): Promise<TestSetterCreated> {
  const { data } = await client.post<TestSetterCreated>("/api/v1/testsetters", payload);
  return data;
}