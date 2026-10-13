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
  full_name: string;
  email: string | null;
  phone: string | null;
  institute_id: string | null;
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

export interface InstituteCreated extends InstituteRow {
  temp_password: string;
}

export interface TeacherRow {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
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