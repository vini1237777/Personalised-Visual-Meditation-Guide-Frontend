import makeRequest from "../api/makeRequest";
import url from "../api/urls";
import type { User } from "../features/user/model/user.types";
import {
  ApiResponse,
  GetScriptRequest,
  GetScriptResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UpdateUserRequest,
} from "./config/userService.config";

export class UserService {
  static async getByEmail(email: string) {
    return makeRequest(url.getUser, "get", { email });
  }

  static async register(payload: RegisterRequest) {
    return makeRequest(url.register, "post", payload) as Promise<
      ApiResponse<User>
    >;
  }

  static async login(payload: LoginRequest) {
    return makeRequest(url.login, "post", payload) as Promise<
      ApiResponse<LoginResponse>
    >;
  }

  static async updateUser(id: string, payload: UpdateUserRequest) {
    return makeRequest(`${url.updateUser}/${id}`, "put", payload) as Promise<
      ApiResponse<User>
    >;
  }

  static async deleteUser(id: string) {
    return makeRequest(`${url.deleteUser}/${id}`, "delete") as Promise<
      ApiResponse<{ ok: boolean }>
    >;
  }

  static async getScript(payload: GetScriptRequest) {
    return makeRequest(url.getScript, "post", payload) as Promise<
      ApiResponse<GetScriptResponse>
    >;
  }
}
