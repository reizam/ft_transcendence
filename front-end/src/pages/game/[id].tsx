import Canvas from '@/components/app/canvas/Canvas';
import Layout from '@/components/app/layouts/Layout';
import ThemeSwitcher from '@/components/app/theme/ThemeSwitcher';
import { withProtected } from '@/providers/auth/auth.routes';
import { useSocket } from '@/providers/socket/socket.context';
import { useTheme } from '@/providers/theme/theme.context';
import { IThemeContext } from '@/providers/theme/theme.interface';
import gameStyles from '@/styles/game.module.css';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Game: NextPage = () => {
  const { theme }: IThemeContext = useTheme();
  const primaryColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue(theme.colors.primary);
  const secondaryColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue(theme.colors.secondary);

  const { socket } = useSocket();
  const router = useRouter();
  const { id } = router.query;

  const [isPlayer, setIsPlayer] = useState<boolean>(false);
  const [startCountdown, setStartCountdown] = useState<boolean>(false);
  const [startGame, setStartGame] = useState<boolean>(false);

  useEffect(() => {
    // console.log(router.query.id);
    if (!id) return;

    const sendJoinGame = () => {
      socket?.volatile.emit(
        'joinGame',
        parseInt(id as string),
        (asPlayer: boolean) => {
          if (asPlayer && !isPlayer) setIsPlayer(true);
          else if (!asPlayer) setIsPlayer(false);
        }
      );
    };
    const timer1 = setTimeout(sendJoinGame, 200);

    return () => {
      console.log('First effect');
      clearTimeout(timer1);
    };
  }, [socket, router, id]);
  // }, [id]);

  useEffect(() => {
    let timer1: NodeJS.Timeout = 0 as any;
    let timer2: NodeJS.Timeout = 0 as any;
    const handleGameError = (err: string) => {
      console.error(err);
      timer1 = setTimeout(() => toast.error(err ?? 'Unknown error'), 200);
      timer2 = setTimeout(() => router.push('/game'), 1500);
    };

    const handleStartCountdown = (): void => {
      if (!startCountdown) setStartCountdown(true);
    };

    socket?.once('gameError', handleGameError);
    socket?.once('startCountdown', handleStartCountdown);

    return () => {
      console.log('Second effect');
      clearTimeout(timer1);
      clearTimeout(timer2);
      socket?.off('gameError', handleGameError);
      socket?.off('startCountdown', handleStartCountdown);
    };
  }, [socket, router]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      const confirmationMessage = 'Are you sure you want to leave the game?';

      e.returnValue = ''; // Required for Chrome
      return confirmationMessage;
    };

    const handleRouteChange = () => {
      if (!window.confirm('Are you sure you want to leave the game?')) {
        throw 'routeChange aborted';
      }
    };

    const handleRejection = (e: any) => {
      if (e?.reason === 'routeChange aborted') e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    router.events.on('routeChangeStart', handleRouteChange);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      router.events.off('routeChangeStart', handleRouteChange);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  const handleStartGame = () => setStartGame(true);

  return (
    <Layout title="Game">
      <div className={gameStyles.ctn__main__game}>
        <div className={gameStyles.ctn__game}>
          {startGame ? (
            <Canvas />
          ) : (
            // <Countdown
            //   timer="10"
            //   start={startCountdown}
            //   onEnd={handleStartGame}
            // />
            <div className={gameStyles.ctn__canvas}>
              <div
                className={gameStyles.ctn__game__canvas}
                style={{
                  borderColor: primaryColor,
                  boxShadow: `0 0 1px ${primaryColor}, 0 0 2px ${primaryColor}, 0 0 4px ${primaryColor}, 0 0 8px ${primaryColor}, 0 0 12px ${primaryColor}`,
                }}
              >
                <div className={gameStyles.ctn__countdown}>
                  <button className={gameStyles.style__button}>
                    Countdown over!
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
