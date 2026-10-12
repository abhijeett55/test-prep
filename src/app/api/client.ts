import axios, { AxiosError } from "axios";

export const TOKEN_KEY = "auth_token";
export const USER_KEY  = "auth_user";

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8001",
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

client.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (window.location.pathname !== "/role") {
        window.location.href = "/role";
      }
    }
    return Promise.reject(err);
  }
);

export function errorMessage(err: unknown): string {
  const e = err as AxiosError<{ detail?: unknown }>;
  const detail = e?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail.length) {
    const first = detail[0] as { msg?: string };
    return first?.msg ?? "Request failed";
  }
  return e?.message ?? "Something went wrong";
}