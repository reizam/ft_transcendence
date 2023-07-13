import { IUserData } from '@/api/user/user.types';

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

export interface IAuthContext {
  getAccessToken: () => Promise<string | null>;
  get2FAToken: () => Promise<string | null>;
  logout: () => void;
  status: AuthStatus;
  user: IUserData | null;
}
