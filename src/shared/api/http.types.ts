import type { AxiosRequestConfig, AxiosResponse } from "axios";

export type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export type ApiResponse<T> = AxiosResponse<T>;

export type RequestConfig<TBody = unknown> = Omit<
  AxiosRequestConfig<TBody>,
  "method" | "url" | "data" | "params"
> & {
  params?: Record<string, string | number | boolean | undefined | null>;
};

export type ApiErrorPayload = {
  message?: string;
  error?: string;
  statusCode?: number;
  [k: string]: unknown;
};
