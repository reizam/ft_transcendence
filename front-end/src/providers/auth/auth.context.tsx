import { AuthStatus, IAuthContext } from '@/providers/auth/auth.interface';
import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext<IAuthContext>({
  logout: () => Promise.resolve(),
  getAccessToken: () => Promise.resolve(null),
  status: 'loading',
});

export const useAuth = (): IAuthContext => useContext(AuthContext);

export const useProvideAuth = (): IAuthContext => {
  const router = useRouter();

  const [status, setStatus] = useState<AuthStatus>('loading');

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
    logout,
    status,
  };
};
