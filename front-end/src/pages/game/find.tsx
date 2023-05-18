import Layout from '@/components/app/layouts/Layout';
import styleLoadingScreen from '@components/app/screen/LoadingScreen.module.css';
import gameStyles from '@/styles/game.module.css';
import { useSocket } from '@/providers/socket/socket.context';
import { useRouter } from 'next/router';

function LoadingScreen(): JSX.Element {
  const { socket } = useSocket();
  const router = useRouter();

  socket?.emit('joinGame');
  socket?.on('foundGame', (id: number) => router.push('/game/id'));

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

export default LoadingScreen;
