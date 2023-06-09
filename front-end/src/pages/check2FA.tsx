import { NextPage } from 'next';
import FAStyles from '@/styles/FA.module.css';
import { GoShield } from 'react-icons/go';
import { ReactNode } from 'react';

const check2FA: NextPage = () => {
    return (
        <>
            <div className={FAStyles.ctn__2FA}>
                <div className={FAStyles.top__2FA}>
                    <div className={FAStyles.lock__icon}>
                        <GoShield size="50" color='aliceblue' />
                    </div>
                    <h1>Easy peasy</h1>
                    <p>Protecting your account is our top priority. Please confirm your account by entering the 6-digit code from your two factor authentificator APP.</p>
                </div>
                <div className={FAStyles.down__2FA}>
                    <form>
                        <div className={FAStyles.input__2FAcode}>
                            <input
                                type="text"
                            />
                        </div>
                        <div className={FAStyles.button__submit2FA}>
                            <button type="submit" className={FAStyles.style__button}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default check2FA;