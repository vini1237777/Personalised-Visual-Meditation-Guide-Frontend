import type { Method } from "axios";
import { request } from "../shared/api/http";

type AxiosMethodLower = "get" | "post" | "put" | "delete" | "patch";

interface IParams {
  value: any;
  index: string;
}

function toLowerMethod(method: Method): AxiosMethodLower {
  return String(method).toLowerCase() as AxiosMethodLower;
}

export default function makeRequest<TResponse = any, TBody = any>(
  url: string,
  method: Method,
  payload?: TBody
) {
  const m = toLowerMethod(method);

  if (m === "get" && payload && typeof payload === "object") {
    return request<TResponse, undefined>("get", url, undefined, {
      params: payload as any,
    });
  }

  return request<TResponse, TBody>(m, url, payload);
}

export function makeParams(params: IParams[]) {
  let paramString = "?";
  for (const param in params) {
    if (params[param].value) {
      if (Number(param) !== 0) paramString = paramString + "&";
      paramString =
        paramString + params[param].index + "=" + params[param].value;
    }
  }
  return paramString;
}
