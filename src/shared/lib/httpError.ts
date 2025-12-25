import type { ApiError } from "../types/api";

export function toApiError(err: unknown): ApiError {
  const fallback: ApiError = { message: "Unknown error" };

  if (!err) return fallback;
  if (typeof err === "string") return { message: err };

  const anyErr = err as any;

  const status: number | undefined = anyErr?.response?.status;
  const message: string =
    anyErr?.response?.data?.message ?? anyErr?.message ?? fallback.message;

  const code: string | undefined = anyErr?.response?.data?.code;

  return { message, status, code };
}
