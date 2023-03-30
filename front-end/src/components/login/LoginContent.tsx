import React from "react";
import Image from "next/image";
import Logo from "@public/images/logo.png";
import Link from "next/link";
import { BACKEND_URL } from "@/constants/env";

function LoginContent() {
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
