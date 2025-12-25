import { tokenStore } from "../storage/tokenStore";
import axios from "axios";
import { ENV } from "../../app/config/env";

export const http = axios.create({
  baseURL: ENV.apiBaseUrl,
  timeout: 15000,
});

http.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const token = tokenStore.get();
