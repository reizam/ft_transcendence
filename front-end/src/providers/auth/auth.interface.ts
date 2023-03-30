export type AuthStatus = "authenticated" | "unauthenticated" | "loading";

export interface IAuthContext {
  getAccessToken: () => Promise<string | null>;
  logout: () => void;
  status: AuthStatus;
}
