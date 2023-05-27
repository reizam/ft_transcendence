import Layout from '@/components/app/layouts/Layout';
import styleLoadingScreen from '@components/app/screen/LoadingScreen.module.css';
import gameStyles from '@/styles/game.module.css';
import { useSocket } from '@/providers/socket/socket.context';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

function showError(err: unknown, toastErr: string = 'Unknown error'): void {
  console.error(err);
  toast.error(toastErr);
}

function FindGame(): JSX.Element {
  const { socket } = useSocket();
  const router = useRouter();

  useEffect(() => {
    const handleFindError = (err: string) => {
      console.log(err);
      setTimeout(() => toast.error(err ?? 'Unknown error'), 200);
      setTimeout(() => router.push('/game'), 1500);
    };
    const handleFoundGame = (data: any) => {
      console.log({ data });
      router.push('/game');
    };

    socket?.once('findError', handleFindError);
    // socket?.once('foundGame', (id: number) => router.push('/game/id'));
    socket?.once('foundGame', handleFoundGame);

    return () => {
      socket?.off('findError', handleFindError);
    };
  }, [socket, router]);

  useEffect(() => {
    const sendFindGame = () => {
      socket?.volatile.emit('findGame');
    };

    const timer = setTimeout(sendFindGame, 1000);

    return () => {
      clearTimeout(timer);
      socket?.removeAllListeners('foundGame');
      socket?.emit('stopFindGame');
    };
  }, [socket]);

  return (
    <Layout title="Game">
      <div className={gameStyles.ctn__pre__game}>
        <div className={gameStyles.ctn__pre__game__canvas}>
          Looking for a player...
          <div style={{ height: '5%', display: 'hidden' }} />
          <div className={styleLoadingScreen.style__loader}></div>
        </div>
      </div>
    </Layout>
  );
}

export default FindGame;
