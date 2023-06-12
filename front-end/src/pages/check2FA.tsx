import { NextPage } from 'next';
import FAStyles from '@/styles/FA.module.css';
import { GoShield } from 'react-icons/go';
import { ReactNode, useState } from 'react';
import axios from 'axios';
import { error } from 'console';
import { BACKEND_URL } from '@/constants/env';
import { getCookie } from 'cookies-next';
import { withProtected } from '@/providers/auth/auth.routes';
import { useRouter } from 'next/router';

const check2FA: NextPage = () => {
  const router = useRouter();
  const [token, setToken] = useState('');

  const handleSubmit = async (event: { preventDefault: any }) => {
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
      };
      const response = await axios.post(
        `${BACKEND_URL}${'/auth/verify2FA'}`,
        { token },
        config
      );

      if (response.status === 200) {
        router.push('/index');
      } else {
        alert({response})
        alert('Invalid 2FA token. Please try again.');
        // toast error
        router.push('/login');
      }
    } catch (error) {
      // toast error
      console.error('2FA verification failed', error);
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
