import React, { ReactElement } from 'react';
import {
  SocketContext,
  useProvideSocket,
} from '@/providers/socket/socket.context';

interface SocketProviderProps {
  children: React.ReactNode;
}

function SocketProvider({ children }: SocketProviderProps): ReactElement {
  const value = useProvideSocket();

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export default SocketProvider;
