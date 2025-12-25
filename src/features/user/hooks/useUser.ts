import { useEffect, useState } from "react";
import type { User } from "../model/user.types";
import { fetchCurrentUser } from "../api/user.api";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function load() {
    setIsLoading(true);
    setErrorMessage(null);

    const result = await fetchCurrentUser();
    if (!result.ok) {
      setErrorMessage(result.error.message);
      setIsLoading(false);
      return;
    }

    setUser(result.data);
    setIsLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return { user, isLoading, errorMessage, reload: load };
}
