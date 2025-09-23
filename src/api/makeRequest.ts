import axios, { Method } from "axios";
import toast from "react-hot-toast";
import axiosHandler from "../helpers/axiosHandler";

interface IParams {
  value: any;
  index: string;
}

export enum RequestMethods {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
}

const BASE = process.env.REACT_APP_API?.trim() || "/api";
const token = sessionStorage.getItem("auth-Key") || undefined;
export default async function makeRequest(
  url: string,
  method: Method,
  payload?: any
) {
  let requestConfig = {
    baseURL: BASE,
    url: url,
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: token } : {}), // keep your existing scheme
    },
    data: {},
  };

  if (method !== "get" && payload) {
    requestConfig.data = payload;
  }

  try {
    let response = await axios.request(requestConfig);
    return response;
  } catch (error: any) {
    const status = error?.response?.status;

    const serverMsg =
      (typeof error?.response?.data === "string" && error.response.data) ||
      error?.response?.data?.message ||
      error?.message;

    if (error.response.data) {
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      }
    }
    axiosHandler(
      status ? `[${status}] ${serverMsg}` : serverMsg || "Request failed"
    );
    throw error.message;
  }
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
