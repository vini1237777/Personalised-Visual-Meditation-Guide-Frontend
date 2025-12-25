import axios, { AxiosError } from "axios";
import type {
  ApiErrorPayload,
  ApiResponse,
  HttpMethod,
  RequestConfig,
} from "./http.types";

const API_BASE_URL = process.env.REACT_APP_API;

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
});

http.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("auth-Key");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = token;
  }
  return config;
});

export class ApiError extends Error {
  status?: number;
  payload?: ApiErrorPayload;

  constructor(message: string, status?: number, payload?: ApiErrorPayload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function normalizeAxiosError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<ApiErrorPayload>;
    const status = ax.response?.status;
    const payload = ax.response?.data;

    const message =
      payload?.message ||
      payload?.error ||
      ax.message ||
      "Something went wrong";

    return new ApiError(message, status, payload);
  }

  const fallback = err instanceof Error ? err.message : "Unknown error";
  return new ApiError(fallback);
}

export async function request<TResponse, TBody = unknown>(
  method: HttpMethod,
  url: string,
  body?: TBody,
  config?: RequestConfig<TBody>
): Promise<ApiResponse<TResponse>> {
  try {
    return await http.request<TResponse, ApiResponse<TResponse>, TBody>({
      method,
      url,
      data: body,
      ...config,
    });
  } catch (err) {
    throw normalizeAxiosError(err);
  }
}
