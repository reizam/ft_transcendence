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

  useEffect(() => {
    // console.log(router.query.id);
    if (!id) return;

    const sendJoinGame = () => {
      socket?.volatile.emit(
        'joinGame',
        parseInt(id as string),
        (isPlayer: boolean) => {
          if (isPlayer) setIsPlayer(true);
          else setIsPlayer(false);
        }
      );
    };
    const timer1 = setTimeout(sendJoinGame, 500);

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

    return () => {
      console.log('Second effect');
      clearTimeout(timer1);
      clearTimeout(timer2);
      socket?.off('findError', handleGameError);
    };
  }, [socket, router]);

  return (
    <Layout title="Game">
      <div className={gameStyles.ctn__main__game}>
        <div className={gameStyles.ctn__game}>
          {/* <Canvas /> */}
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
          <ThemeSwitcher />
        </div>
      </div>
    </Layout>
  );
};

export default withProtected(Game);
