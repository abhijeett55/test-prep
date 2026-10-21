import { client } from "../../client";
import type { OptionsResponse, TestSetterRow } from "../../types";
export type { OptionsResponse, TestSetterRow };

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

/** GET /testsetters/options  (admin only) */
export async function getTestSetterOptions(): Promise<OptionsResponse> {
  const { data } = await client.get<OptionsResponse>("/testsetters/options");
  return data;
}

/** GET /testsetters  (admin only) */
export async function listTestSetters(): Promise<TestSetterRow[]> {
  const { data } = await client.get<TestSetterRow[]>("/testsetters");
  return data;
}

/** POST /testsetters  (admin only) */
export async function createTestSetter(
  payload: TestSetterCreate
): Promise<TestSetterCreated> {
  const { data } = await client.post<TestSetterCreated>("/testsetters", payload);
  return data;
}