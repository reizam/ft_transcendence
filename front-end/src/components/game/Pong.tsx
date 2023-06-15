import Canvas from '@/components/app/canvas/Canvas';
import { Role } from '@/components/game/game.types';
import useColors from '@/hooks/useColors';
import { useSocket } from '@/providers/socket/socket.context';
import { useEffect, useLayoutEffect, useRef } from 'react';

interface PongProps {
  gameId: number;
  isLocal: boolean;
  role?: Role;
}

type GameState = {
  ball: { x: number; y: number; radius: number };
  player: {
    [key: number]: {
      paddleY: number;
      fuseCount: number;
      score: number;
    };
  };
};

const parameters = {
  frameInterval: 1000 / 120,
  aspectRatio: 16 / 9,
  dimensions: {
    width: 1920,
    height: 1080,
  },
  paddle: {
    width: 20,
    height: 250,
    offset: 10,
    speed: 15,
  },
  ball: {
    speed: 8,
    radius: 20,
  },
  scoreLimit: 10,
  fuseCount: 3,
  keys: [' ', '0', 'w', 's', 'ArrowUp', 'ArrowDown'],
};

const Pong = ({
  gameId,
  isLocal,
  role = Role.NONE,
}: PongProps): JSX.Element => {
  const colors = useColors();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { socket } = useSocket();

  const gameState = useRef<GameState>({
    ball: {
      x: parameters.dimensions.width / 2,
      y: parameters.dimensions.height / 2,
      radius: parameters.ball.radius,
    },
    player: {
      [Role.PLAYER1]: {
        paddleY: (parameters.dimensions.height - parameters.paddle.height) / 2,
        fuseCount: 3,
        score: 0,
      },
      [Role.PLAYER2]: {
        paddleY: (parameters.dimensions.height - parameters.paddle.height) / 2,
        fuseCount: 3,
        score: 0,
      },
    },
  });

  const keyState = useRef<{ [key: string]: boolean }>({});
  const frame = useRef(0);
  const ratio = useRef(1);

  useLayoutEffect(() => {
    const handleResize = (): void => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const div = canvas?.parentElement;
      if (!div) return;

      ratio.current = div.clientWidth / parameters.dimensions.width;
      canvas.width = div.clientWidth;
      canvas.height = div.clientWidth / parameters.aspectRatio;
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas?.getContext('2d');
    if (!context) return;

    let lastTime = new Date().getTime();

    // Draw the paddle for the player
    const drawPaddle = (): void => {
      // Draw the paddle on the left
      context.fillStyle = colors.primary;
      context.fillRect(
        parameters.paddle.offset / ratio.current,
        gameState.current.player[Role.PLAYER1].paddleY / ratio.current,
        parameters.paddle.width / ratio.current,
        parameters.paddle.height / ratio.current
      );

      context.fillRect(
        (parameters.dimensions.width -
          parameters.paddle.offset -
          parameters.paddle.width) /
          ratio.current,
        gameState.current.player[Role.PLAYER2].paddleY / ratio.current,
        parameters.paddle.width / ratio.current,
        parameters.paddle.height / ratio.current
      );
    };

    // Draw the ball
    const drawBall = (): void => {
      if (gameState.current.ball.x === -1 || gameState.current.ball.y === -1)
        return;
      context.beginPath();
      context.arc(
        gameState.current.ball.x / ratio.current,
        gameState.current.ball.y / ratio.current,
        parameters.ball.radius / ratio.current,
        0,
        Math.PI * 2
      );
      context.fillStyle = colors.secondary;
      context.fill();
      context.closePath();
    };

    const drawScore = (): void => {
      context.font = `${(context.canvas.height / 100) * 15}px Poppins`;
      context.fillStyle = colors.primary + '60';
      context.fillText(
        gameState.current.player[Role.PLAYER1].score.toString(),
        (context.canvas.width * 25) / 100,
        context.canvas.height / 5
      );
      context.fillText(
        gameState.current.player[Role.PLAYER2].score.toString(),
        context.canvas.width - (context.canvas.width * 30) / 100,
        context.canvas.height / 5
      );
    };

    const drawHUD = (): void => {
      context.fillStyle = colors.primary;
      context.strokeStyle = colors.primary;
      const fullRatio = 100 * ratio.current;
      const y = (parameters.dimensions.height * 90) / fullRatio;
      const w = (parameters.dimensions.width * 1) / fullRatio;
      const h = (parameters.dimensions.height * 4) / fullRatio;
      for (const player of [Role.PLAYER1, Role.PLAYER2]) {
        let i = 0;
        const offset = player === Role.PLAYER1 ? 5 : 90;
        while (i < gameState.current.player[player].fuseCount) {
          const x =
            ((i * 2 + offset) * parameters.dimensions.width) / fullRatio;
          context.fillRect(x, y, w, h);
          ++i;
        }
        while (i < parameters.fuseCount) {
          const x =
            ((i * 2 + offset) * parameters.dimensions.width) / fullRatio;
          context.strokeRect(x, y, w, h);
          ++i;
        }
      }
    };

    socket?.on('gameState', (gameState_: GameState) => {
      gameState.current = { ...gameState.current, ...gameState_ };
    });

    const draw = (): void => {
      const now = new Date().getTime();
      const elapsed = now - lastTime;

      if (context && elapsed > parameters.frameInterval) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        drawBall();
        drawPaddle();
        drawScore();
        drawHUD();
        lastTime = now;
      }
      frame.current = window.requestAnimationFrame(draw);
    };

    frame.current = window.requestAnimationFrame(draw);

    return () => {
      socket?.removeAllListeners('gameState');
      cancelAnimationFrame(frame.current);
    };
  }, [socket, colors]);

  useEffect(() => {
    if (!isLocal && !(role & Role.PLAYER)) return;

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (parameters.keys.includes(e.key)) {
        e.preventDefault();
        keyState.current[e.key] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent): void => {
      if (parameters.keys.includes(e.key)) {
        e.preventDefault();
        keyState.current[e.key] = false;
      }
    };

    const updatePaddles = (): void => {
      if (isLocal) {
        if (keyState.current['w']) {
          gameState.current.player[Role.PLAYER1].paddleY -=
            parameters.paddle.speed;
          if (gameState.current.player[Role.PLAYER1].paddleY < 0)
            gameState.current.player[Role.PLAYER1].paddleY = 0;
        }
        if (keyState.current['s']) {
          gameState.current.player[Role.PLAYER1].paddleY +=
            parameters.paddle.speed;
          if (
            gameState.current.player[Role.PLAYER1].paddleY +
              parameters.paddle.height >=
            parameters.dimensions.height
          )
            gameState.current.player[Role.PLAYER1].paddleY =
              parameters.dimensions.height - parameters.paddle.height;
        }
        if (keyState.current['ArrowUp']) {
          gameState.current.player[Role.PLAYER2].paddleY -=
            parameters.paddle.speed;
          if (gameState.current.player[Role.PLAYER2].paddleY < 0)
            gameState.current.player[Role.PLAYER2].paddleY = 0;
        }
        if (keyState.current['ArrowDown']) {
          gameState.current.player[Role.PLAYER2].paddleY +=
            parameters.paddle.speed;
          if (
            gameState.current.player[Role.PLAYER2].paddleY +
              parameters.paddle.height >=
            parameters.dimensions.height
          )
            gameState.current.player[Role.PLAYER2].paddleY =
              parameters.dimensions.height - parameters.paddle.height;
        }
      } else {
        if (keyState.current['w'] || keyState.current['ArrowUp']) {
          gameState.current.player[role].paddleY -= parameters.paddle.speed;
          if (gameState.current.player[role].paddleY < 0)
            gameState.current.player[role].paddleY = 0;
        }
        if (keyState.current['s'] || keyState.current['ArrowDown']) {
          gameState.current.player[role].paddleY += parameters.paddle.speed;
          if (
            gameState.current.player[role].paddleY + parameters.paddle.height >=
            parameters.dimensions.height
          )
            gameState.current.player[role].paddleY =
              parameters.dimensions.height - parameters.paddle.height;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    const intervalId = setInterval((): void => {
      updatePaddles();
      // updateFuses();
      socket?.volatile.emit(
        'move',
        {
          gameId: gameId,
          data: {
            paddleY: {
              [Role.PLAYER1]: gameState.current.player[Role.PLAYER1].paddleY,
              [Role.PLAYER2]: gameState.current.player[Role.PLAYER2].paddleY,
            },
          },
        },
        (data: { [key: number]: number }) => {
          gameState.current.player[Role.PLAYER1].paddleY = data[Role.PLAYER1];
          gameState.current.player[Role.PLAYER2].paddleY = data[Role.PLAYER2];
        }
      );
    }, 1000 / 120);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      clearInterval(intervalId);
    };
  }, [socket, keyState, gameState]);

  return <Canvas ref={canvasRef} />;
};

export default Pong;
