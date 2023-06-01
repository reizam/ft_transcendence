import Layout from '@/components/app/layouts/Layout';
import styleLoadingScreen from '@components/app/screen/LoadingScreen.module.css';
import gameStyles from '@/styles/game.module.css';
import { useSocket } from '@/providers/socket/socket.context';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';

function FindGame(): JSX.Element {
  const [foundPlayer, setFoundPlayer] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const isReadyRef = useRef<boolean>(false);
  const { socket } = useSocket();
  const router = useRouter();

  useEffect(() => {
    let timer1: NodeJS.Timeout = 0 as any;
    let timer2: NodeJS.Timeout = 0 as any;
    const handleFindError = (err: string) => {
      console.error(err);
      timer1 = setTimeout(() => toast.error(err ?? 'Unknown error'), 200);
      timer2 = setTimeout(() => router.push('/game'), 1500);
      isReadyRef.current = false;
      setFoundPlayer(false);
      setIsReady(false);
    };

    let timer3: NodeJS.Timeout = 0 as any;
    let timer4: NodeJS.Timeout = 0 as any;
    const handleJoinTimeout = (err: string) => {
      console.error(err);
      timer3 = setTimeout(() => toast.error(err ?? 'Unknown error'), 0);
      timer4 = setTimeout(() => router.push('/game/find'), 1500);
      isReadyRef.current = false;
      setFoundPlayer(false);
      setIsReady(false);
    };

    const handleJoinGame = (gameId: number): void => {
      router.push('/game/' + gameId);
    };

    socket?.once('findError', handleFindError);
    socket?.once('joinTimeout', handleJoinTimeout);
    socket?.once('joinGame', handleJoinGame);

    return () => {
      console.log('First effect 1');
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      socket?.off('findError', handleFindError);
      socket?.off('joinTimeout', handleJoinTimeout);
      socket?.off('joinGame', handleJoinGame);
    };
  }, [socket, router]);

  useEffect(() => {
    let timer5: NodeJS.Timeout = 0 as any;
    let timer6: NodeJS.Timeout = 0 as any;
    let ackCallback: (ack: string) => void;
    const handleFoundGame = (callback: (arg: string) => void) => {
      setFoundPlayer(true);
      timer5 = setTimeout(
        () => toast.error('Taking a shit? We let your opponent know about it'),
        8000
      );
      timer6 = setTimeout(() => router.push('/game'), 9000);
      ackCallback = callback;
    };

    socket?.once('foundGame', handleFoundGame);

    return () => {
      console.log('First effect 2');
      clearTimeout(timer5);
      clearTimeout(timer6);
      if (ackCallback != undefined && isReadyRef.current === true)
        ackCallback('ready');
      socket?.removeAllListeners('foundGame');
    };
  }, [socket, router, isReady]);

  useEffect(() => {
    const sendFindGame = () => {
      socket?.volatile.emit('findGame');
    };

    let timer7: NodeJS.Timeout = 0 as any;
    const cancelFindGame = () => {
      toast.error(
        <div>
          No matching player :(
          <br />
          Retry later or invite a friend!
        </div>
      );
      timer7 = setTimeout(() => router.push('/game'), 1500);
    };

    const timer8 = setTimeout(sendFindGame, 1000);
    const timer9 = setTimeout(cancelFindGame, 45000);

    return () => {
      console.log('Second effect');
      clearTimeout(timer7);
      clearTimeout(timer8);
      clearTimeout(timer9);
      socket?.emit('stopFindGame');
    };
  }, [socket, router]);

  useEffect(() => {
    console.log('Third effect');
    if (socket?.connected === false) {
      toast.error('Server error');
      router.push('/game');
    }
  }, [socket, socket?.connected]);

  const onClick = (): void => {
    console.log({ isReady });
    console.log({ isReadyRef });
    isReadyRef.current = true;
    setIsReady(true);
  };

  return (
    <Layout title="Game">
      <div className={gameStyles.ctn__pre__game}>
        <div className={gameStyles.ctn__pre__game__canvas}>
          {!foundPlayer ? (
            <>
              Looking for a player...
              <div style={{ height: '5%', display: 'hidden' }} />
              <div className={styleLoadingScreen.style__loader}></div>
            </>
          ) : !isReady ? (
            <button onClick={onClick} className={gameStyles.style__button}>
              I'm ready!
            </button>
          ) : (
            <>
              Waiting for you opponent...
              <div style={{ height: '5%', display: 'hidden' }} />
              <div className={styleLoadingScreen.style__loader}></div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default FindGame;
