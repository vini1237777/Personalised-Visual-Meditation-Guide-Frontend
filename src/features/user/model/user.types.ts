export type UserId = string;

export type User = {
  id?: string;
  email?: string | null;
  fullName?: string | null;
  category?: string | null;
};

export interface IUser {
  email?: string;
  fullName?: string;
}
