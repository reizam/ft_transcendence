import AuthProvider from "@/providers/auth/auth.provider";
import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";

const poppins = Poppins({
	weight: '300',
	subsets: ['latin'] })

function ft_transcendence({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default ft_transcendence;
