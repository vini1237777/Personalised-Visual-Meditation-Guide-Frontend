const KEY = "auth-Key";

export const tokenStore = {
  get(): string | null {
    return window.sessionStorage.getItem(KEY);
  },
  set(token: string): void {
    window.sessionStorage.setItem(KEY, token);
  },
  clear(): void {
    window.sessionStorage.removeItem(KEY);
  },
};
