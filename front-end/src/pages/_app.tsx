import AuthProvider from "@/providers/auth/auth.provider";
import "@/styles/globals.css";

import type { AppProps } from "next/app";

function ft_transcendence({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default ft_transcendence;
