import { useState } from "react";
import toast from "react-hot-toast";
import { loginApi } from "../api/auth.api";
import { tokenStore } from "../../../services/storage/tokenStore";
import type { LoginRequest } from "../model/auth.types";
import type { User } from "../../user/model/user.types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function login(payload: LoginRequest) {
    setIsLoading(true);
    setErrorMessage(null);

    const result = await loginApi(payload);

    if (!result.ok) {
      setErrorMessage(result.error.message);
      toast.error(result.error.message);
      setIsLoading(false);
      return { ok: false as const };
    }

    tokenStore.set(result.data.accessToken);
    setUser(result.data.user);

    setIsLoading(false);
    return { ok: true as const };
  }

  function logout() {
    tokenStore.clear();
    setUser(null);
  }

  return { user, isLoading, errorMessage, login, logout };
}
