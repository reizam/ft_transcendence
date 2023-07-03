import { useGetMe } from '@/api/user/user.get.api';
import { IUserData } from '@/api/user/user.types';
import { AuthStatus, IAuthContext } from '@/providers/auth/auth.interface';
import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import socket from '@/lib/socket';

export const AuthContext = createContext<IAuthContext>({
  logout: () => Promise.resolve(),
  getAccessToken: () => Promise.resolve(null),
  get2FAToken: () => Promise.resolve(null),
  status: 'loading',
  user: null,
});

export const useAuth = (): IAuthContext => useContext(AuthContext);

export const useProvideAuth = (): IAuthContext => {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>('loading');
  const { data: user } = useGetMe(undefined, {
    enabled: status === 'authenticated',
    // TODO: Add refetch on window focus? Or use useGetMe instead of useAuth in components?
  });

  const getAccessToken = async (): Promise<string | null> => {
    const cookie = getCookie('jwt', {
      sameSite: 'strict',
    });

    if (cookie) {
      return cookie.toString();
    }
    return null;
  };

  const get2FAToken = async (): Promise<string | null> => {
    const cookie = getCookie('2FA', {
      sameSite: 'strict',
    });

    if (cookie) {
      return cookie.toString();
    }
    return null;
  };

  const logout = (): void => {
    setStatus('unauthenticated');
    deleteCookie('jwt', {
      sameSite: 'strict',
    });
    deleteCookie('2FA', {
      sameSite: 'strict',
    });
    socket?.disconnect();
  };

  useEffect(() => {
    const update = async (): Promise<void> => {
      const authToken = await getAccessToken();
      const twoFactorToken = await get2FAToken();

      if (router.pathname === '/check2FA' && authToken) {
        setStatus('authenticated');
        return;
      }
      setStatus(
        authToken && twoFactorToken ? 'authenticated' : 'unauthenticated'
      );
    };

    void update();
  }, [router.pathname]);

  return {
    getAccessToken,
    get2FAToken,
    logout,
    status,
    user: user ? (user as IUserData) : null,
  };
};
