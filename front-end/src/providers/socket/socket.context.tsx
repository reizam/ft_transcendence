import { BACKEND_URL } from '@/constants/env';
import { ISocketContext } from '@/providers/socket/socket.interface';
import React from 'react';
import { io } from 'socket.io-client';

export const SocketContext = React.createContext<ISocketContext>({
  socket: null,
  connect: () => Promise.resolve(),
  disconnect: () => Promise.resolve(),
  connected: false,
});

export const useSocket = () => React.useContext(SocketContext);

export const useProvideSocket = (): ISocketContext => {
  const [socket, setSocket] = React.useState<ISocketContext['socket']>(null);
  const [connected, setConnected] = React.useState<boolean>(false);

  const connect = (token: string) => {
    if (!connected) {
      const newSocket = io(BACKEND_URL, {
        query: {
          token,
        },
      });

      setSocket(newSocket);
    }
  };

  const disconnect = () => {
    if (connected && socket) {
      socket.close();
    }
  };

  React.useEffect(() => {
    if (socket) {
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
    }
    return;
  }, [socket]);

  return {
    socket,
    connect,
    disconnect,
    connected,
  };
};
