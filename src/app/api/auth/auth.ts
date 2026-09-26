import { apiClient, tokenStorage } from "./client";

export type Role = "admin" | "teacher" | "testsetter" | "provider";

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  role: Role;
};


export type CurrentUser = {
  id: string;
  user_id: string;
  role: Role;
  is_active: boolean;
  full_name: string | null;
  institute_id: string | null;
};


export async function login(userId: string, password: string): Promise<TokenResponse> {
  const res = await apiClient.post<TokenResponse>("/auth/login", {
    user_id: userId,
    password,
  });
  return res.data;
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const res = await apiClient.get<CurrentUser>("/auth/me");
  return res.data;
}

export function logout(): void {
  tokenStorage.clear();
}