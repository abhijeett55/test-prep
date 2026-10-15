import { client } from "../../client";
import type {
  InstitutePerformance,
  DashboardStats,
} from "../../types";

export interface DateRange {
  from?: string; // ISO date
  to?: string;
}

// ---- dashboard tile data ----

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await client.get<DashboardStats>("/reports/dashboard");
  return data;
}

// ---- institute-wide performance ----

export interface InstitutePerformanceReport {
  overview: InstitutePerformance;
  trend: { date: string; avg_score: number }[];
  top_batches: { batch_name: string; avg_score: number }[];
}

export async function getInstitutePerformance(
  params: DateRange = {}
): Promise<InstitutePerformanceReport> {
  const { data } = await client.get<InstitutePerformanceReport>(
    "/reports/institute-performance",
    { params }
  );
  return data;
}

// ---- batch comparison ----

export interface BatchComparisonRow {
  batch_id: string;
  batch_name: string;
  student_count: number;
  avg_score: number | null;
  pass_rate: number | null;
}

export async function getBatchComparison(
  batchIds: string[],
  params: DateRange = {}
): Promise<BatchComparisonRow[]> {
  const { data } = await client.get<BatchComparisonRow[]>(
    "/reports/batch-comparison",
    { params: { ...params, batch_ids: batchIds.join(",") } }
  );
  return data;
}

// ---- teacher comparison ----

export interface TeacherComparisonRow {
  teacher_id: string;
  full_name: string;
  subject_count: number;
  student_count: number;
  avg_score: number | null;
}

export async function getTeacherComparison(
  teacherIds: string[] = [],
  params: DateRange = {}
): Promise<TeacherComparisonRow[]> {
  const { data } = await client.get<TeacherComparisonRow[]>(
    "/reports/teacher-comparison",
    {
      params: {
        ...params,
        teacher_ids: teacherIds.length ? teacherIds.join(",") : undefined,
      },
    }
  );
  return data;
}

// ---- course performance ----

export interface CoursePerformanceRow {
  course_id: string;
  course_name: string;
  enrolled: number;
  completed: number;
  avg_score: number | null;
  pass_rate: number | null;
}

export async function getCoursePerformance(
  params: DateRange = {}
): Promise<CoursePerformanceRow[]> {
  const { data } = await client.get<CoursePerformanceRow[]>(
    "/reports/course-performance",
    { params }
  );
  return data;
}