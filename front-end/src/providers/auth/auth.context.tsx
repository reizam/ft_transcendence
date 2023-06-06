import { useGetMe } from '@/api/user/user.get.api';
import { IUserData } from '@/api/user/user.types';
import { AuthStatus, IAuthContext } from '@/providers/auth/auth.interface';
import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext<IAuthContext>({
  logout: () => Promise.resolve(),
  getAccessToken: () => Promise.resolve(null),
  status: 'loading',
  user: null,
});

export const useAuth = (): IAuthContext => useContext(AuthContext);

export const useProvideAuth = (): IAuthContext => {
  const router = useRouter();

  const [status, setStatus] = useState<AuthStatus>('loading');
  const { data: user } = useGetMe(status, {
    enabled: status === 'authenticated',
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

  const logout = (): void => {
    setStatus('unauthenticated');
    deleteCookie('jwt', {
      sameSite: 'strict',
    });
  };

  useEffect(() => {
    const update = async (): Promise<void> => {
      const token = await getAccessToken();

      setStatus(token ? 'authenticated' : 'unauthenticated');
    };

    void update();
  }, [router.pathname]);

  return {
    getAccessToken,
    logout,
    status,
    user: user ? (user as IUserData) : null,
  };
};
