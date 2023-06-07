import Layout from '@/components/app/layouts/Layout';
import ThemeSwitcher from '@/components/app/theme/ThemeSwitcher';
import Pong from '@/components/game/Pong';
import useColors from '@/hooks/useColors';
import { withProtected } from '@/providers/auth/auth.routes';
import { useSocket } from '@/providers/socket/socket.context';
import gameStyles from '@/styles/game.module.css';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Game: NextPage = () => {
  const { primary: primaryColor } = useColors();

  const { socket } = useSocket();
  const router = useRouter();

  const [gameId, setGameId] = useState<number>(-1);
  const [startCountdown, setStartCountdown] = useState<boolean>(false);
  const [startGame, setStartGame] = useState<boolean>(false);

  useEffect(() => {
    const sendJoinGame = () => {
      socket?.volatile.emit('joinLocalGame', (id: number) => {
        if (gameId < 0) setGameId(id);
      });
    };
    const timer1 = setTimeout(sendJoinGame, 1000);

    return () => {
      clearTimeout(timer1);
    };
  }, [socket, router]);

  useEffect(() => {
    const handleStartCountdown = (): void => {
      if (!startCountdown) setStartCountdown(true);
    };
    const handleStartGame = (): void => {
      if (!startGame) setStartGame(true);
    };

    socket?.once('startCountdown', handleStartCountdown);
    socket?.once('startGame', handleStartGame);

    return () => {
      socket?.off('startCountdown', handleStartCountdown);
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
          {startGame && gameId > 0 ? (
            <Pong gameId={gameId} isPlayer={true} />
          ) : (
            <div className={gameStyles.ctn__canvas}>
              <div
                className={gameStyles.ctn__game__canvas}
                style={{
                  borderColor: primaryColor,
                  boxShadow: `0 0 1px ${primaryColor}, 0 0 2px ${primaryColor}, 0 0 4px ${primaryColor}, 0 0 8px ${primaryColor}, 0 0 12px ${primaryColor}`,
                }}
              >
                <div className={gameStyles.ctn__countdown}>
                  {/* <Countdown timer="10" start={startCountdown} /> */}
                  <button className={gameStyles.style__button}>
                    {startCountdown ? 'Countdown started' : 'Countdown stopped'}
                  </button>
                </div>
              </div>
            </div>
          )}
          <ThemeSwitcher />
        </div>
      </div>
    </Layout>
  );
};

export default withProtected(Game);
