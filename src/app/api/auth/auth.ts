import { client } from "../client";
import type { TokenResponse } from "../types";
import {
  ROLE_API_SEGMENT,
  ROLE_ID_FIELD,
  type Role,
} from "./roleRouting";

// POST /{segment}/login
export async function login(
  role: Role,
  userId: string,
  password: string
): Promise<TokenResponse> {
  const segment = ROLE_API_SEGMENT[role];
  const idField = ROLE_ID_FIELD[role];

  const { data } = await client.post<TokenResponse>(
    `/${segment}/login`,
    { [idField]: userId, password }
  );
  return data;
}


// POST /{segment}/change-password
export async function changePassword(
  role: Role,
  current: string,
  next: string
): Promise<void> {
  const segment = ROLE_API_SEGMENT[role];
  await client.post(`/${segment}/change-password`, {
    current_password: current,
    new_password: next,
  });
}

// GET /{segment}/me
export async function getMe<T = unknown>(role: Role): Promise<T> {
  const segment = ROLE_API_SEGMENT[role];
  const { data } = await client.get<T>(`/${segment}/me`);
  return data;
}