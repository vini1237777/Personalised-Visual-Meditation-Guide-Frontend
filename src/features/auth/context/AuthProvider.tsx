import { useState } from "react";
import type { User } from "../../user/model/user.types";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const isLoggedIn = Boolean(user?.email);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}
