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

    function onConnectError(error: unknown): void {
      // TODO: Show an error toast ("Connexion error: please disconnect and retry later")
      //       then push to "/"
      setConnected(false);
      console.error(error);
    }

    socket.on('connect', onConnect);
    socket.on('connect_error', onConnectError);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onConnectError);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return {
    socket,
    connected,
  };
};
