import Layout from '@/components/app/layouts/Layout';
import { GameResult } from '@/components/game/GameResult';
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
  const [count, { startCountdown, stopCountdown, setCountdown }] = useCountdown(
    { countStart: 5 }
  );

  const { socket } = useSocket();
  const router = useRouter();
  const { id: gameId } = router.query;

  const [isPlayer, setIsPlayer] = useState<boolean>(false);
  const [isLeftPlayer, setIsLeftPlayer] = useState<boolean>(false);
  const [startGame, setStartGame] = useState<boolean>(false);
  const [winner, setWinner] = useState<{
    id: number;
    username: string;
    profilePicture: string;
  } | null>(null);

  useEffect(() => {
    if (count === 0) {
      stopCountdown();
    }
  }, [count, stopCountdown]);

  useEffect(() => {
    if (!gameId) {
      return;
    }

    const sendJoinGame = (): void => {
      socket?.volatile.emit(
        'joinGame',
        parseInt(gameId as string),
        (ack: {
          asPlayer: boolean;
          isLeftPlayer: boolean;
          playersReady: boolean;
          gameStarted: boolean;
          countdown: number;
        }) => {
          if (ack.asPlayer) setIsPlayer(true);
          else if (!ack.asPlayer) setIsPlayer(false);
          if (ack.isLeftPlayer) setIsLeftPlayer(true);
          else if (!ack.isLeftPlayer) setIsLeftPlayer(false);
          if (ack.playersReady) setTimeout(() => startCountdown(), 100);
          if (ack.gameStarted) setStartGame(true);
          if (ack.countdown !== 5) setCountdown(ack.countdown);
        }
      );
    };
    const timer1 = setTimeout(sendJoinGame, 1000);

    return () => {
      clearTimeout(timer1);
    };
  }, [socket, router, gameId, startCountdown, setCountdown]);

  useEffect(() => {
    const handleStartGame = (): void => {
      setStartGame(true);
    };

    socket?.once('startCountdown', startCountdown);
    socket?.once('startGame', handleStartGame);

    return () => {
      socket?.off('startCountdown', startCountdown);
      socket?.off('startGame', handleStartGame);
    };
  }, [socket, router, startCountdown]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent): string => {
      e.preventDefault();
      const confirmationMessage = 'Are you sure you want to leave the game?';

      e.returnValue = ''; // Required for Chrome
      return confirmationMessage;
    };
    const handleUnload = (): void => {
      socket?.volatile.emit(
        'leaveGame',
        parseInt(gameId ? (gameId as string) : '0')
      );
    };

    const handleRouteChange = (): void => {
      if (!window.confirm('Are you sure you want to leave the game?')) {
        throw 'routeChange aborted';
      } else {
        socket?.volatile.emit(
          'leaveGame',
          parseInt(gameId ? (gameId as string) : '0')
        );
      }
    };
    const handleRejection = (e: PromiseRejectionEvent): void => {
      if (e?.reason === 'routeChange aborted') e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
    router.events.on('routeChangeStart', handleRouteChange);
    window.addEventListener('unhandledrejection', handleRejection);

    let timer1: NodeJS.Timeout | undefined = undefined;
    let timer2: NodeJS.Timeout | undefined = undefined;
    const handleGameError = (err: string): void => {
      timer1 = setTimeout(() => toast.error(err ?? 'Unknown game error'), 200);
      timer2 = setTimeout(() => router.push('/game'), 1500);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      router.events.off('routeChangeStart', handleRouteChange);
      window.removeEventListener('unhandledrejection', handleRejection);
    };

    const handleEndGame = (winner: {
      id: number;
      username: string;
      profilePicture: string;
    }): void => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      router.events.off('routeChangeStart', handleRouteChange);
      window.removeEventListener('unhandledrejection', handleRejection);
      setWinner(winner);
    };

    const handlePlayerHasLeft = (player: string): void => {
      toast.error(player + ' has left and lost the game!');
    };

    socket?.once('gameError', handleGameError);
    socket?.once('endGame', handleEndGame);
    socket?.once('playerHasLeft', handlePlayerHasLeft);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      socket?.off('gameError', handleGameError);
      socket?.off('endGame', handleEndGame);
      socket?.off('playerHasLeft', handlePlayerHasLeft);
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
              {startGame && !winner && gameId ? (
                <Pong
                  gameId={parseInt(gameId as string)}
                  isPlayer={isPlayer}
                  isLeftPlayer={isLeftPlayer}
                  isLocal={false}
                />
              ) : (
                <div className={gameStyles.ctn__countdown}>
                  {!winner ? (
                    <Countdown count={count} total={5} color={primaryColor} />
                  ) : (
                    <GameResult winner={winner}></GameResult>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withProtected(Game);
