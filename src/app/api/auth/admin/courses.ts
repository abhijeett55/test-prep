import { client } from "../../client";
import type { CourseRow, CourseDetail } from "../../types";
export type { CourseRow, CourseDetail };

export interface CourseCreate {
  institute_id: string;
  course_name: string;
  course_code: string;
  course_description?: string | null;
  student_ids?: string[];
  teacher_ids?: string[];
}

export interface CourseUpdate {
  course_name?: string;
  course_code?: string;
  course_description?: string | null;
  student_ids?: string[];
  teacher_ids?: string[];
}

export interface ListCoursesParams {
  institute_id?: string;
  q?: string;
  limit?: number;
  offset?: number;
}

/** GET /courses */
export async function listCourses(
  params: ListCoursesParams = {}
): Promise<CourseRow[]> {
  const { data } = await client.get<CourseRow[]>("/courses", { params });
  return data;
}

/** GET /courses/{id} */
export async function getCourse(id: string): Promise<CourseDetail> {
  const { data } = await client.get<CourseDetail>(`/courses/${id}`);
  return data;
}

/** POST /courses */
export async function createCourse(payload: CourseCreate): Promise<CourseDetail> {
  const { data } = await client.post<CourseDetail>("/courses", payload);
  return data;
}
/** PATCH /courses/{id} */
export async function updateCourse(
  id: string,
  payload: CourseUpdate
): Promise<CourseDetail> {
  const { data } = await client.patch<CourseDetail>(`/courses/${id}`, payload);
  return data;
}

/** DELETE /courses/{id} */
export async function deleteCourse(id: string): Promise<void> {
  await client.delete(`/courses/${id}`);
}

/** POST /courses/{courseId}/students/{student_ids} */
export async function enrollStudentsInCourse(
  courseId: string,
  studentIds: string[]
): Promise<CourseDetail> {
  const { data } = await client.post<CourseDetail>(
    `/courses/${courseId}/students`,
    { student_ids: studentIds }
  );
  return data;
}

/** DELETE /courses/{courseId}/students/{studentId} */
export async function unenrollStudentFromCourse(
  courseId: string,
  studentId: string
): Promise<void> {
  await client.delete(`/courses/${courseId}/students/${studentId}`);
}

/** POST /courses/{courseId}/teachers/{teacherid} */
export async function assignTeachersToCourse(
  courseId: string,
  teacherIds: string[]
): Promise<CourseDetail> {
  const { data } = await client.post<CourseDetail>(
    `/courses/${courseId}/teachers`,
    { teacher_ids: teacherIds }
  );
  return data;
}

/** DELETE /courses/{courseId}/teachers/{teacherid} */
export async function unassignTeacherFromCourse(
  courseId: string,
  teacherId: string
): Promise<void> {
  await client.delete(`/courses/${courseId}/teachers/${teacherId}`);
}