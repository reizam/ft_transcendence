import { useProvideAuth } from '@/providers/auth/auth.context';
import {
  SocketContext,
  useProvideSocket,
} from '@/providers/socket/socket.context';
import React, { ReactElement } from 'react';

interface SocketProviderProps {
  children: React.ReactNode;
}

function SocketProvider({ children }: SocketProviderProps): ReactElement {
  const value = useProvideSocket();
  const { status, getAccessToken } = useProvideAuth();

  React.useEffect(() => {
    if (status === 'authenticated') {
      getAccessToken().then((token) => token && value.connect(token));
    } else if (status === 'unauthenticated') {
      value.disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export default SocketProvider;
