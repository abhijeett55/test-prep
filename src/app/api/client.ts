import axios, { AxiosError } from "axios";
import { appPath } from "../lib/paths";

export const TOKEN_KEY = "auth_token";
export const USER_KEY  = "auth_user";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://127.0.0.1:8001/api/v1";

export const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});


client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// response

client.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      const loginPath = appPath("/role");
      if (window.location.pathname !== loginPath) {
        window.location.href = loginPath;
      }
    }
    return Promise.reject(err);
  }
);

// errors

export function errorMessage(err: unknown): string {
  const e = err as AxiosError<{ detail?: unknown }>;
  const detail = e?.response?.data?.detail;

  if (typeof detail === "string") return detail;

  if (Array.isArray(detail) && detail.length) {
    const first = detail[0] as { msg?: string };
    return first?.msg ?? "Request failed";
  }

  if (e?.code === "ERR_NETWORK") {
    return "Cannot reach the server. Check that the backend is running.";
  }

  return e?.message ?? "Something went wrong";
}