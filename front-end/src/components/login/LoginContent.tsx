import { BACKEND_URL } from '@/constants/env';
import Logo from '@public/images/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { ReactElement } from 'react';

function LoginContent(): ReactElement {
  return (
    <div className="flex flex-col space-y-16">
      <Image src={Logo} alt="Logo" width={320} height={100} priority />
      <div className="flex flex-col items-center">
        <Link href={`${BACKEND_URL}/auth/42`}>
          <button className="w-32 h-12 bg-purple ring-1 ring-white hover:ring-2 hover:ring-offset-1 active:opacity-75  rounded-full text-white font-medium text-sm transition ease-in-out duration-200">
            Connexion
          </button>
        </Link>
      </div>
    </div>
  );
}

export default LoginContent;
