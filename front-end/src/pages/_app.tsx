import AuthProvider from '@/providers/auth/auth.provider';
import SocketProvider from '@/providers/socket/socket.provider';
import ThemeProvider from '@/providers/theme/theme.provider';
import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import { ReactElement } from 'react';
import { ToastContainer } from 'react-toastify';

const queryClient = new QueryClient();

function ft_transcendence({ Component, pageProps }: AppProps): ReactElement {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <ThemeProvider>
            <Component {...pageProps} />
          </ThemeProvider>
          <ReactQueryDevtools />
          <ToastContainer
            position="top-center"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </SocketProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default ft_transcendence;
