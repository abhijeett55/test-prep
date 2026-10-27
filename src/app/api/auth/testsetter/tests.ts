import { client } from "../../client";
import type {
  Test,
  TestRow,
  TestBuilderOptions,
  CreateTestPayload,
  CreateSectionPayload,
  TestSection,
} from "../../types";

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

/** PATCH /testsetters/tests/{id}/publish */
export async function publishTest(testId: string): Promise<TestRow> {
  const { data } = await client.patch<TestRow>(`/testsetters/tests/${testId}/publish`);
  return data;
}

export const listApprovedPapers = () => client.get("/question-papers/approved").then(r => r.data);