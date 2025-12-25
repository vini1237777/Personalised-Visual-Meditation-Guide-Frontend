import type { User } from "../../features/user/model/user.types";

export function formatUserName(user?: User | null): string {
  const name = user?.fullName?.trim();
  if (!name) return "";

  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
