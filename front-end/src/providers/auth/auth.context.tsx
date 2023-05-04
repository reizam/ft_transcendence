import { AuthStatus, IAuthContext } from '@/providers/auth/auth.interface';
import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext<IAuthContext>({
  logout: () => Promise.resolve(),
  getAccessToken: () => Promise.resolve(null),
  status: 'loading',
});

export const useAuth = () => useContext(AuthContext);

export const useProvideAuth = (): IAuthContext => {
  const router = useRouter();

  const [status, setStatus] = useState<AuthStatus>('loading');

  const getAccessToken = async () => {
    const cookie = getCookie('jwt', {
      sameSite: 'strict',
    });

    if (cookie) {
      return cookie.toString();
    }

    return null;
  };

  const logout = () => {
    setStatus('unauthenticated');
    deleteCookie('jwt', {
      sameSite: 'strict',
    });
  };

  useEffect(() => {
    const update = async () => {
      const token = await getAccessToken();

      setStatus(token ? 'authenticated' : 'unauthenticated');
    };

    update();
  }, [router.pathname]);

  return {
    getAccessToken,
    logout,
    status,
  };
};
