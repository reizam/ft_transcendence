import socket from '@/lib/socket';
import { ISocketContext } from '@/providers/socket/socket.interface';
import React from 'react';

export const SocketContext = React.createContext<ISocketContext>({
  socket: null,
  connected: false,
});

export const useSocket = (): ISocketContext => React.useContext(SocketContext);

export const useProvideSocket = (): ISocketContext => {
  const [connected, setConnected] = React.useState(socket.connected);

  React.useEffect(() => {
    function onConnect(): void {
      setConnected(true);
      console.log('Socket connected');
    }

    function onDisconnect(): void {
      setConnected(false);
      console.log('Socket disconnected');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

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
