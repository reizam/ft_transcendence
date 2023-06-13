import { NextPage } from 'next';
import FAStyles from '@/styles/FA.module.css';
import { GoShield } from 'react-icons/go';
import { FormEvent, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/constants/env';
import { getCookie } from 'cookies-next';
import { withProtected } from '@/providers/auth/auth.routes';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const check2FA: NextPage = () => {
  const router = useRouter();
  const [token, setToken] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const jwtToken = getCookie('jwt');

      if (!jwtToken)
        throw new Error('No JWT token found. Please log in again.');

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
        router.push('/');
      } else {
        toast.error(response?.data?.message ?? 'Invalid server response');
        router.push('/login');
      }
    } catch (error: any) {
      let errorMessage = '2FA verification failed';

      if (Array.isArray(error?.response?.data?.message)) {
        errorMessage = error.response.data.message[0];
      } else if (typeof error?.response?.data?.message === 'string') {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
      router.push('/login');
    }
  };

  return (
    <>
      <div className={FAStyles.ctn__2FA}>
        <div className={FAStyles.top__2FA}>
          <div className={FAStyles.lock__icon}>
            <GoShield size="50" color="aliceblue" />
          </div>
          <h1>Easy peasy</h1>
          <p>
            Protecting your account is our top priority. Please confirm your
            account by entering the 6-digit code from your two factor
            authentificator APP.
          </p>
        </div>
        <div className={FAStyles.down__2FA}>
          <form onSubmit={handleSubmit}>
            <div className={FAStyles.input__2FAcode}>
              <input
                type="number"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </div>
            <div className={FAStyles.button__submit2FA}>
              <button
                type="submit"
                value="Verify"
                className={FAStyles.style__button}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default withProtected(check2FA);
