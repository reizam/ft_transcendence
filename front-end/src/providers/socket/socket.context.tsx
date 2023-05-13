import React from 'react';
import { ISocketContext } from '@/providers/socket/socket.interface';
import socket from '@/lib/socket';

export const SocketContext = React.createContext<ISocketContext>({
  socket: null,
  connected: false,
});

export const useSocket = (): ISocketContext => React.useContext(SocketContext);

export const useProvideSocket = (): ISocketContext => {
  const [connected, setConnected] = React.useState<boolean>(false);

  React.useEffect(() => {
    socket.on('connect', () => {
      setConnected(true);
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('Socket disconnected');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return {
    socket,
    connected,
  };
};
