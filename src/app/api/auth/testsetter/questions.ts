import { client } from "../../client";

export interface QuestionCreate {
  subject_id: string;
  question_text: string;
  question_type: "MCQ" | "SUBJECTIVE";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  options?: string[] | null;
  correct_answer?: string | null;
  marks: number;
}

export interface QuestionUpdate {
  question_text?: string;
  options?: string[];
  correct_answer?: string;
  subject_id?: string;
  course_id?: string;
  batch_id?: string;
  test_id?: string;
  status?: string;
}

export interface QuestionRow extends QuestionCreate {
  id: string;
  status: string;
  created_at: string;
}


/** POST /questions */
export async function createQuestion(payload: QuestionCreate): Promise<QuestionRow> {
  const { data } = await client.post<QuestionRow>("/questions", payload);
  return data;
}

/** GET /questions */
export async function listQuestions(subjectId?: string): Promise<QuestionRow[]> {
  const params = subjectId ? { subject_id: subjectId } : {};
  const { data } = await client.get<QuestionRow[]>("/questions", { params });
  return data;
}

/** POST /upload-paper */
export async function uploadQuestionPaper(
  file: File, 
  parserType: "AI" | "REGEX",
  metadata: { title: string, subject_id: string, course_id: string, batch_id: string, teacher_id: string, duration_minutes: number }
): Promise<{ paper_id: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("parser_type", parserType);
  Object.entries(metadata).forEach(([key, value]) => formData.append(key, String(value)));

  const { data } = await client.post("/upload-paper", formData, { headers: { "Content-Type": "multipart/form-data" } });
  return data;
}

export async function updateQuestion(id: string, payload: QuestionUpdate): Promise<QuestionRow> {
  const { data } = await client.put<QuestionRow>(`/questions/${id}`, payload);
  return data;
}

// New functions
export const listPendingPapers = () => client.get("/question-papers/pending").then(r => r.data);
export const getPaperQuestions = (paperId: string) => client.get(`/question-papers/${paperId}/questions`).then(r => r.data);
export const approvePaper = (id: string) => client.post(`/question-papers/${id}/approve`).then(r => r.data);


export const deletePaper = (id: string) => client.delete(`/question-papers/${id}`);
export const deleteQuestion = (id: string) => client.delete(`/questions/${id}`);

