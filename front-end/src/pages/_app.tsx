import AuthProvider from "@/providers/auth/auth.provider";
import SocketProvider from "@/providers/socket/socket.provider";
import "@/styles/globals.css";

import type { AppProps } from "next/app";

function ft_transcendence({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <SocketProvider>
        <Component {...pageProps} />
      </SocketProvider>
    </AuthProvider>
  );
}

export default ft_transcendence;
