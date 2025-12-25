import { createContext } from "react";
import type { User } from "../../user/model/user.types";

export interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
