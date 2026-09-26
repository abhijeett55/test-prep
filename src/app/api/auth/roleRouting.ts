import type { Role } from "./auth";

export const ROLE_HOME_PATH: Record<Role, string> = {
  admin: "/dashboard/admin",
  teacher: "/dashboard/teacher",
  testsetter: "/dashboard/testsetter",
  provider: "/dashboard/provider",
};