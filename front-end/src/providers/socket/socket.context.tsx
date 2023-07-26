import socket from '@/lib/socket';
import { ISocketContext } from '@/providers/socket/socket.interface';
import React from 'react';
import { useAuth } from '../auth/auth.context';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';

export const SocketContext = React.createContext<ISocketContext>({
  socket: null,
  connected: false,
});

export const useSocket = (): ISocketContext => React.useContext(SocketContext);

export const useProvideSocket = (): ISocketContext => {
  const [connected, setConnected] = React.useState(socket.connected);
  const { logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    function onConnect(): void {
      setConnected(true);
      console.log('Socket connected');
    }

    function onDisconnect(): void {
      setConnected(false);
      console.log('Socket disconnected');
    }

    function onConnectError(error: Error): void {
      setTimeout(() => {
        if (socket.disconnected) {
          toast.error(
            ('Socket connection error: ' + error?.message ?? 'unknown error') +
              ' (try reconnecting)'
          );
          logout();
        }
      }, 5000);
    }

    const handleChallengedBy = (
      challengerName: string,
      ackCallback: (ack: string) => void
    ): void => {
      let handleClose = (): void => ackCallback('refuse');
      const toastId = toast.info(
        `${challengerName} challenged you! Click here to accept if you dare`,
        {
          onClick: () => {
            handleClose = (): null => null;
            ackCallback('accept');
          },
          closeOnClick: true,
          autoClose: 14000,
          pauseOnFocusLoss: false,
          pauseOnHover: false,
        }
      );

      setTimeout(
        () =>
          toast.update(toastId, {
            onClose: () => handleClose(),
          }),
        500
      );
    };

    const handleChallengeError = (err: string): void => {
      toast.error(err ?? 'Unknown challenge error');
    };

    const handleWatchError = (err: string): void => {
      toast.error(err ?? 'Unknown watch error');
    };

    const handleJoinChallenge = async (gameId: number): Promise<void> => {
      await router.push('/game/' + gameId.toString());
    };

    const handleNewMessage = (channelId: number): void => {
      if (router.pathname.startsWith('/chat'))
        void queryClient.invalidateQueries(['CHANNELS', 'GET']);
      if (router.asPath === `/chat/channel/${channelId}`)
        void queryClient.invalidateQueries([
          'CHANNEL_MESSAGES',
          'GET',
          channelId,
        ]);
    };

    const handleChannelUpdate = (channelId: number): void => {
      if (router.pathname.startsWith('/chat'))
        void queryClient.invalidateQueries(['CHANNELS', 'GET']);
      if (router.asPath.startsWith(`/chat/channel/${channelId}`))
        void queryClient.invalidateQueries(['CHANNEL', 'GET', channelId]);
    };

    socket.on('connect', onConnect);
    socket.on('connect_error', onConnectError);
    socket.on('disconnect', onDisconnect);

    socket.on('challengedBy', handleChallengedBy);
    socket.on('challengeError', handleChallengeError);
    socket.on('joinChallenge', handleJoinChallenge);
    socket.on('watchError', handleWatchError);

    socket.on('newMessage', handleNewMessage);
    socket.on('channelUpdate', handleChannelUpdate);

    if (
      socket.disconnected &&
      router.pathname !== '/' &&
      router.pathname !== '/login'
    ) {
      socket.connect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onConnectError);
      socket.off('disconnect', onDisconnect);
      socket.removeAllListeners('challengedBy');
      socket.removeAllListeners('challengeError');
      socket.removeAllListeners('joinChallenge');
      socket.removeAllListeners('watchError');
      socket.removeAllListeners('newMessage');
    };
  }, [router.pathname, router, logout, queryClient]);

  return {
    socket,
    connected,
  };
};
