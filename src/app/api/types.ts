export interface TokenResponse {
  access_token: string;
  token_type: string;
  role: string;
  full_name: string;
  must_change_password: boolean;
}

export interface OptionItem {
  id: string;
  name: string;
}

export interface OptionsResponse {
  institutes: OptionItem[];
}

export interface TeacherOptionsResponse extends OptionsResponse {
  subjects: (OptionItem & { institute_id: string })[];
}

// ---- per-role profile shapes ----

export interface AdminProfile {
  id: string;
  admin_id: string;
  institute_id: string;
  institute_name: string;
}

export interface InstituteProfile {
  id: string;
  institute_id: string;
  institute_name: string;
  code: string;
  email: string;
  phone: string | null;
  address: string | null;
  status: string;
  ip_address: string | null;
  latitude: string | null;
  longitude: string | null;
  created_at: string;
  updated_at: string;
}

export interface InstituteRow {
  id: string;
  institute_id: string;
  institute_name: string;
  code: string;
  email: string;
  phone: string | null;
  address: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface InstituteCreated extends InstituteProfile {
  temp_password: string;
  admin_temp_password: string;
}

export interface TeacherRow {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  institute_id: string | null;
  institute: string;
  subject: string;
  employee_code: string | null;
  teacher_id: string;
  qualification: string | null;
}

export interface ProviderRow {
  id: string;
  provider_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  employee_code: string | null;
  institute_id: string | null;
}

export interface TestSetterRow {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  institute: string;
  employee_code: string | null;
  testsetter_id: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

// ---- student ----

export interface StudentRow {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  self_phone: string | null;
  institute_id: string | null;
  institute: string;
  status: string;
  batch_name: string | null;
  subjects?: string;
}

export interface StudentDetail extends StudentRow {
  father_name: string;
  father_phone: string | null;
  mother_name: string;
  mother_phone: string | null;
  address: string;
  ip_address: string | null;
  latitude: string | null;
  longitude: string | null;
  course_ids: string[];
  subject_ids: string[];
  teacher_ids: string[];
  created_at: string;
  updated_at: string;
}

// ---- courses ----

export interface CourseRow {
  id: string;
  course_name: string;
  course_code: string;
  course_description: string | null;
  institute_id: string;
  institute: string;
  student_count: number;
  teacher_count: number;
  created_at: string;
  subjects?: string;
}


export interface CourseDetail {
  id: string;
  institute_id: string;
  course_name: string;
  course_code: string;
  course_description: string | null;
  student_ids: string[];
  teacher_ids: string[];
  subject_ids: string[];
  created_at: string;
  updated_at: string;
}

// ---- subjects ----

export interface SubjectRow {
  id: string;
  subject_name: string;
  subject_code: string;
  institute_id: string;
  institute: string;
  course_count: number;
  teacher_count: number;
  created_at: string;
}


// ---- batches ----

export interface BatchRow {
  id: string;
  batch_name: string;
  batch_code: string;
  institute_id: string;
  institute: string;
  course_id: string | null;
  course_name: string | null;
  start_date: string | null;
  end_date: string | null;
  student_count: number;
  teacher_count: number;
  student_ids?: string[];
  teacher_ids?: string[];
}

// ---- announcements ----

export interface AnnouncementRow {
  id: string;
  title: string;
  body: string;
  scope: "INSTITUTE" | "BATCH";
  batch_id: string | null;
  batch_name: string | null;
  published_at: string | null;
  created_at: string;
}

// ---- reports ----

export interface InstitutePerformance {
  students_total: number;
  students_active: number;
  teachers_total: number;
  courses_total: number;
  batches_total: number;
  avg_score: number | null;
  pass_rate: number | null;
}


// ---- dashboard ----

export interface DashboardStats {
  institutes?: number;
  teachers: number;
  students: number;
  courses: number;
  batches: number;
  pending_enrollments: number;
  pending_fees: number;
  pending_transfers: number;
}

// ---- department ----

export interface DepartmentRow {
  id: string;
  department_name: string;
  institute_id: string;
  head_teacher_id: string | null;
  head_teacher_name: string | null;
  teacher_count: number;
}


// api/auth/testsetter/types.ts

export interface Option {
  id: string;
  name: string;
}

export interface BatchOption extends Option {
  course_id: string | null;
}

export interface TestBuilderOptions {
  courses: Option[];
  batches: BatchOption[];
  subjects: Option[];
  teachers: Option[];
}

export interface TestSection {
  id: string;
  test_id: string;
  name: string;
  total_questions: number;
  marks_per_question: number;
  has_negative_marking: boolean;
  negative_marks_value: number | null;
  negative_marks_type: "ABSOLUTE" | "PERCENTAGE" | null;
}

export interface Test {
  id: string;
  testsetter_id: string;
  institute_id: string;
  course_id: string;
  batch_id: string;
  subject_id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  scheduled_at: string | null;
  total_marks: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  created_at: string;
  updated_at: string;
  sections?: TestSection[];
}

export interface TestRow {
  id: string;
  title: string;
  subject_id: string;
  batch_id: string;
  total_marks: number;
  duration_minutes: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  created_at: string;
}

export interface CreateTestPayload {
  course_id: string;
  batch_id: string;
  subject_id: string;
  teacher_id: string;
  title: string;
  description?: string;
  duration_minutes: number;
  scheduled_at?: string;
}

export interface CreateSectionPayload {
  name: string;
  total_questions: number;
  marks_per_question: number;
  has_negative_marking: boolean;
  negative_marks_value?: number | null;
  negative_marks_type?: "ABSOLUTE" | "PERCENTAGE" | null;
}