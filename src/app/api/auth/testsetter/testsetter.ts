import { client } from "../../client";
import type { 
  OptionsResponse, 
  TestSetterRow,
  Test,
  TestRow,
  TestBuilderOptions,
  CreateTestPayload,
  CreateSectionPayload,
  TestSection
} from "../../types";

export type { 
  OptionsResponse, 
  TestSetterRow,
  Test,
  TestRow,
  TestBuilderOptions,
  CreateTestPayload,
  CreateSectionPayload,
  TestSection
};

export interface TestSetterCreate {
  testsetter_id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  institute_id: string;
  employee_code?: string | null;
}

export interface TestSetterUpdate {
  full_name?: string;
  email?: string;
  phone?: string | null;
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

/** PATCH /testsetters/{id} */
export async function updateTestSetter(id: string, payload: TestSetterUpdate): Promise<TestSetterRow> {
  const { data } = await client.patch<TestSetterRow>(`/testsetters/${id}`, payload);
  return data;
}

/** POST /testsetters  (admin only) */
export async function createTestSetter(
  payload: TestSetterCreate
): Promise<TestSetterCreated> {
  const { data } = await client.post<TestSetterCreated>("/testsetters", payload);
  return data;
}


/** GET /testsetters/my-options */
export async function getTestBuilderOptions(): Promise<TestBuilderOptions> {
  const { data } = await client.get<TestBuilderOptions>("/testsetters/my-options");
  return data;
}

/** POST /testsetters/tests (Create Test) */
export async function createTest(payload: CreateTestPayload): Promise<Test> {
  const { data } = await client.post<Test>("/testsetters/tests", payload);
  return data;
}

/** GET /testsetters/tests (My Tests) */
export async function listMyTests(): Promise<TestRow[]> {
  const { data } = await client.get<TestRow[]>("/testsetters/tests");
  return data;
}

/** GET /testsetters/tests/{id} (Fetch single test details) */
export async function getTestDetails(testId: string): Promise<Test> {
  const { data } = await client.get<Test>(`/testsetters/tests/${testId}`);
  return data;
}

/** POST /testsetters/tests/{id}/sections (Add Section) */
export async function addTestSection(
  testId: string,
  payload: CreateSectionPayload
): Promise<TestSection> {
  const { data } = await client.post<TestSection>(
    `/testsetters/tests/${testId}/sections`,
    payload
  );
  return data;
}

/** PUT /testsetters/tests/{id}/sections/{sectionId} (Update Section) */
export async function updateTestSection(
  testId: string,
  sectionId: string,
  payload: CreateSectionPayload
): Promise<TestSection> {
  const { data } = await client.put<TestSection>(
    `/testsetters/tests/${testId}/sections/${sectionId}`,
    payload
  );
  return data;
}

/** DELETE /testsetters/tests/{id}/sections/{sectionId} (Delete Section) */
export async function deleteTestSection(
  testId: string,
  sectionId: string
): Promise<void> {
  await client.delete(`/testsetters/tests/${testId}/sections/${sectionId}`);
}