import twoFactorStyles from '@/styles/twoFactor.module.css';
import { GoShield } from 'react-icons/go';
import { FormEvent, ReactElement, useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { BACKEND_URL } from '@/constants/env';
import { getCookie } from 'cookies-next';
import { withProtected } from '@/providers/auth/auth.routes';
import { useRouter } from 'next/router';
import { Id, toast } from 'react-toastify';
import { useAuth } from '@/providers/auth/auth.context';

function Check2FA(): ReactElement {
  const router = useRouter();
  const [token, setToken] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    let id: Id = 0;

    try {
      const jwtToken = getCookie('jwt');

      if (!jwtToken)
        throw new Error('No JWT token found. Please log in again.');

      id = toast.loading('Verifying');
      const config = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Cache-Control': 'private',
        },
        withCredentials: true,
      };
      const response = await axios.post(
        `${BACKEND_URL}${'/auth/verify2FA'}`,
        { token },
        config
      );

      if (response.status === 200) {
        toast.update(id, {
          render: `Welcome home${user ? ' ' + user.username : ''}!`,
          type: 'success',
          autoClose: 2000,
          isLoading: false,
        });
        void router.push('/profile');
      } else {
        toast.update(id, {
          render: response?.data?.message ?? 'Invalid server response',
          type: 'error',
          autoClose: 2000,
          isLoading: false,
        });
        void router.push('/login');
      }
    } catch (error: unknown) {
      let errorMessage = '2FA verification failed';

      if (isAxiosError(error)) {
        if (Array.isArray(error?.response?.data?.message)) {
          errorMessage = error.response?.data.message[0];
        } else if (typeof error?.response?.data?.message === 'string') {
          errorMessage = error.response.data.message;
        }
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }
      toast.update(id, {
        render: errorMessage,
        type: 'error',
        autoClose: 2000,
        isLoading: false,
      });
      void router.push('/login');
    }
  };

  return (
    <>
      <div className={twoFactorStyles.ctn__2FA}>
        <div className={twoFactorStyles.top__2FA}>
          <div className={twoFactorStyles.lock__icon}>
            <GoShield size="50" color="aliceblue" />
          </div>
          <h1>Easy peasy</h1>
          <p>
            Protecting your account is our top priority. Please confirm your
            account by entering the 6-digit code from your two factor
            authentificator APP.
          </p>
        </div>
        <div className={twoFactorStyles.down__2FA}>
          <form onSubmit={handleSubmit}>
            <div className={twoFactorStyles.input__2FAcode}>
              <input
                type="number"
                value={token}
                onChange={(e): void => setToken(e.target.value)}
              />
            </div>
            <div className={twoFactorStyles.button__submit2FA}>
              <button
                type="submit"
                value="Verify"
                className={twoFactorStyles.style__button}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default withProtected(Check2FA);
