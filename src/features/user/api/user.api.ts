import type { ApiResult } from "../../../shared/types/api";
import { toApiError } from "../../../shared/lib/httpError";
import { http } from "../../../services/http/client";
import type { User } from "../model/user.types";

export async function fetchCurrentUser(): Promise<ApiResult<User>> {
  try {
    const res = await http.get<User>("/user/me");
    return { ok: true, data: res.data };
  } catch (err) {
    return { ok: false, error: toApiError(err) };
  }
}
