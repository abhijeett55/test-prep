export type Role = "admin" | "institute" | "teacher" | "provider" | "testsetter";

export const ROLE_HOME_PATH: Record<Role, string> = {
  admin:      "/dashboard/admin",
  institute:  "/dashboard/institute",
  teacher:    "/dashboard/teacher",
  provider:   "/dashboard/provider",
  testsetter: "/dashboard/testsetter",
};

export const ROLE_API_SEGMENT: Record<Role, string> = {
  admin:      "admins",
  institute:  "institutes",
  teacher:    "teachers",
  provider:   "providers",
  testsetter: "testsetters",
};

export const ROLE_ID_FIELD: Record<Role, string> = {
  admin:      "admin_id",
  institute:  "institute_id",
  teacher:    "teacher_id",
  provider:   "provider_id",
  testsetter: "testsetter_id",
};

export const ROLE_LABEL: Record<Role, string> = {
  admin:      "Admin",
  institute:  "Institute",
  teacher:    "Teacher",
  provider:   "Provider",
  testsetter: "Test Setter",
};