import NotificationBar from '@/components/app/notification';
import AuthProvider from '@/providers/auth/auth.provider';
import { NotificationProvider } from '@/providers/notification/notification.provider';
import '@/styles/globals.css';

import type { AppProps } from 'next/app';

function ft_transcendence({ Component, pageProps }: AppProps) {
  return (
    <NotificationProvider>
      <NotificationBar />
      <AuthProvider>
        {/* <SocketProvider> */}
        <Component {...pageProps} />
        {/* </SocketProvider> */}
      </AuthProvider>
    </NotificationProvider>
  );
}

export default ft_transcendence;
