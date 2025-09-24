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

export default async function makeRequest(
  url: string,
  method: Method,
  payload?: any
) {
  let requestConfig = {
    baseURL: `${process.env.REACT_APP_API}`,
    url: url,
    method: method,
    headers: {
      Authorization: sessionStorage.getItem("auth-Key") || "",
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
    console.log(error, "message:error:::::");
    if (error?.response?.data) {
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      }
    }
    axiosHandler(error.message);
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
