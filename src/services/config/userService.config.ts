import { User } from "../../features/user/model/user.types";

export type ApiResponse<T> = {
  status: number;
  data: T;
};

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = Partial<User> & {
  name?: string;
};

export type UpdateUserRequest = Partial<User>;

export type GetScriptRequest = {
  selectedFeelings: string[];
  selectedEmojis: string[];
  email: string;
};

export type GetScriptResponse = {
  generatedScripts?: string;
  videoUrl?: string;
  email?: string;
  fullName?: string;
};
