import Layout from '@/components/app/layouts/Layout';
import styleLoadingScreen from '@components/app/screen/LoadingScreen.module.css';
import gameStyles from '@/styles/game.module.css';
import { useSocket } from '@/providers/socket/socket.context';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

function FindGame(): JSX.Element {
  const { socket } = useSocket();
  const router = useRouter();

  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;
    const handleFindError = (err: string) => {
      console.error(err);
      timer1 = setTimeout(() => toast.error(err ?? 'Unknown error'), 200);
      timer2 = setTimeout(() => router.push('/game'), 1500);
    };
    const handleFoundGame = (gameId: number) => {
      router.push('/game/' + gameId);
    };

    socket?.once('findError', handleFindError);
    socket?.once('foundGame', handleFoundGame);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      socket?.off('findError', handleFindError);
    };
  }, [socket, router]);

  useEffect(() => {
    const sendFindGame = () => {
      socket?.volatile.emit('findGame');
    };
    let timer3: NodeJS.Timeout;
    const cancelFindGame = () => {
      toast.error(
        <div>
          No matching player :(
          <br />
          Retry later or invite a friend!
        </div>
      );
      timer3 = setTimeout(() => router.push('/game'), 1500);
    };

    const timer4 = setTimeout(sendFindGame, 1000);
    const timer5 = setTimeout(cancelFindGame, 60000);

    return () => {
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      socket?.removeAllListeners('foundGame');
      socket?.emit('stopFindGame');
    };
  }, [socket]);

  useEffect(() => {
    if (socket?.connected === false) {
      toast.error('Server error');
      router.push('/game');
    }
  }, [socket, socket?.connected]);

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
