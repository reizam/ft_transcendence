import socket from '@/lib/socket';
import { ISocketContext } from '@/providers/socket/socket.interface';
import React from 'react';
import { useAuth } from '../auth/auth.context';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export const SocketContext = React.createContext<ISocketContext>({
  socket: null,
  connected: false,
});

export const useSocket = (): ISocketContext => React.useContext(SocketContext);

export const useProvideSocket = (): ISocketContext => {
  const [connected, setConnected] = React.useState(socket.connected);
  const { logout } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    function onConnect(): void {
      setConnected(true);
      console.log('Socket connected');
    }

    function onDisconnect(): void {
      setConnected(false);
      console.log('Socket disconnected');
    }

    function onConnectError(error: any): void {
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
      let handleClose = () => ackCallback('refuse');

      toast.info(
        `${challengerName} challenged you! Click here to accept if you dare`,
        {
          onClose: () => handleClose,
          onClick: () => {
            handleClose = () => null;
            ackCallback('accept');
          },
          closeOnClick: true,
          autoClose: 14000,
          pauseOnFocusLoss: false,
          pauseOnHover: false,
        }
      );
    };

    const handleChallengeError = (err: string) => {
      toast.error(err ?? 'Unknown challenge error');
    };

    const handleWatchError = (err: string) => {
      toast.error(err ?? 'Unknown watch error');
    };

    const handleJoinChallenge = (gameId: number) => {
      router.push('/game/' + gameId.toString());
    };

    socket.on('connect', onConnect);
    socket.on('connect_error', onConnectError);
    socket.on('disconnect', onDisconnect);

    socket.on('challengedBy', handleChallengedBy);
    socket.on('challengeError', handleChallengeError);
    socket.on('joinChallenge', handleJoinChallenge);
    socket.on('watchError', handleWatchError);

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
    };
  }, [router.pathname]);

  return {
    socket,
    connected,
  };
};
