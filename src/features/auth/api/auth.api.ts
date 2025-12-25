import type { ApiResult } from "../../../shared/types/api";
import { toApiError } from "../../../shared/lib/httpError";
import { http } from "../../../services/http/client";
import { ENDPOINTS } from "../../../services/http/endpoints";
import type { LoginRequest, LoginResponse } from "../model/auth.types";

export async function loginApi(
  payload: LoginRequest
): Promise<ApiResult<LoginResponse>> {
  try {
    const res = await http.post<LoginResponse>(ENDPOINTS.auth.login, payload);
    return { ok: true, data: res.data };
  } catch (err) {
    return { ok: false, error: toApiError(err) };
  }
}
