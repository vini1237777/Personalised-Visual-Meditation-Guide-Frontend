class Env {
  readonly apiBaseUrl: string;

  constructor(raw: Record<string, string | undefined>) {
    const base = raw.REACT_APP_API;
    if (!base) throw new Error("Missing env: REACT_APP_API");
    this.apiBaseUrl = base;
  }
}

export const ENV = new Env(process.env as Record<string, string | undefined>);
