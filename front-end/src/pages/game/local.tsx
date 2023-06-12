import Layout from '@/components/app/layouts/Layout';
import ThemeSwitcher from '@/components/app/theme/ThemeSwitcher';
import Pong from '@/components/game/Pong';
import Countdown from '@/components/utils/Countdown';
import { Keyframes } from '@/components/utils/Keyframes';
import useColors from '@/hooks/useColors';
import { useCountdown } from '@/hooks/useCountdown';
import { withProtected } from '@/providers/auth/auth.routes';
import { useSocket } from '@/providers/socket/socket.context';
import gameStyles from '@/styles/game.module.css';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Game: NextPage = () => {
  const { primary: primaryColor } = useColors();
  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 10,
    });

  const { socket } = useSocket();
  const router = useRouter();

  const [gameId, setGameId] = useState<number>(-1);
  const [startGame, setStartGame] = useState<boolean>(false);

  useEffect(() => {
    if (count === 0) {
      stopCountdown();
    }
  }, [count]);

  useEffect(() => resetCountdown(), []);

  useEffect(() => {
    const sendJoinGame = (): void => {
      socket?.volatile.emit('joinLocalGame', (id: number) => {
        if (gameId < 0) setGameId(id);
      });
    };
    const timer1 = setTimeout(sendJoinGame, 100);

    return () => {
      clearTimeout(timer1);
    };
  }, [socket, router]);

  useEffect(() => {
    const handleStartGame = (): void => {
      if (!startGame) setStartGame(true);
    };

    socket?.once('startCountdown', startCountdown);
    socket?.once('startGame', handleStartGame);

    return () => {
      socket?.off('startCountdown', startCountdown);
      socket?.off('startGame', handleStartGame);
    };
  }, [socket, router]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      const confirmationMessage = 'Are you sure you want to leave the game?';

      e.returnValue = ''; // Required for Chrome
      return confirmationMessage;
    };
    const handleUnload = (e: Event) => {
      socket?.volatile.emit('leaveGame', gameId);
    };

    const handleRouteChange = () => {
      if (!window.confirm('Are you sure you want to leave the game?')) {
        throw 'routeChange aborted';
      } else {
        socket?.volatile.emit('leaveGame', gameId);
      }
    };
    const handleRejection = (e: any) => {
      if (e?.reason === 'routeChange aborted') e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
    router.events.on('routeChangeStart', handleRouteChange);
    window.addEventListener('unhandledrejection', handleRejection);

    let timer1: NodeJS.Timeout = 0 as any;
    let timer2: NodeJS.Timeout = 0 as any;
    const handleGameError = (err: string) => {
      timer1 = setTimeout(() => toast.error(err ?? 'Unknown error'), 200);
      timer2 = setTimeout(() => router.push('/game'), 1500);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      router.events.off('routeChangeStart', handleRouteChange);
      window.removeEventListener('unhandledrejection', handleRejection);
    };

    const handleEndGame = (): void => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      router.events.off('routeChangeStart', handleRouteChange);
      window.removeEventListener('unhandledrejection', handleRejection);
    };

    socket?.once('gameError', handleGameError);
    socket?.once('endGame', handleEndGame);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      socket?.off('gameError', handleGameError);
      socket?.off('endGame', handleEndGame);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      router.events.off('routeChangeStart', handleRouteChange);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [socket, router, gameId]);

  return (
    <Layout title="Game">
      <div className={gameStyles.ctn__main__game}>
        <div className={gameStyles.ctn__game}>
          <div className={gameStyles.ctn__canvas}>
            <Keyframes
              name={'neon-blink'}
              _35={{
                boxShadow: `0 0 1px ${primaryColor}ff, 0 0 2px ${primaryColor}ff, 0 0 4px ${primaryColor}ff, 0 0 8px ${primaryColor}ff, 0 0 12px ${primaryColor}ff`,
              }}
              _48={{
                boxShadow: `0 0 1px ${primaryColor}d9, 0 0 2px ${primaryColor}d9, 0 0 4px ${primaryColor}d9, 0 0 8px ${primaryColor}d9, 0 0 12px ${primaryColor}d9`,
              }}
              _51={{
                boxShadow: `0 0 1px ${primaryColor}f2, 0 0 2px ${primaryColor}f2, 0 0 4px ${primaryColor}f2, 0 0 8px ${primaryColor}f2, 0 0 12px ${primaryColor}f2`,
              }}
              _54={{
                boxShadow: `0 0 1px ${primaryColor}b7, 0 0 2px ${primaryColor}b7, 0 0 4px ${primaryColor}b7, 0 0 8px ${primaryColor}b7, 0 0 12px ${primaryColor}b7`,
              }}
              _60={{
                boxShadow: `0 0 1px ${primaryColor}ff, 0 0 2px ${primaryColor}ff, 0 0 4px ${primaryColor}ff, 0 0 8px ${primaryColor}ff, 0 0 12px ${primaryColor}ff`,
              }}
            />
            <div
              className={gameStyles.ctn__game__canvas}
              style={{
                borderColor: primaryColor,
                boxShadow: `0 0 1px ${primaryColor}, 0 0 2px ${primaryColor}, 0 0 4px ${primaryColor}, 0 0 8px ${primaryColor}, 0 0 12px ${primaryColor}`,
                animation: 'neon-blink 3s infinite alternate',
              }}
            >
              {startGame && gameId > 0 ? (
                <Pong gameId={gameId} isPlayer={true} isLocal={true} />
              ) : (
                <div className={gameStyles.ctn__countdown}>
                  <Countdown count={count} total={10} color={primaryColor} />
                </div>
              )}
            </div>
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </Layout>
  );
};

export default withProtected(Game);
