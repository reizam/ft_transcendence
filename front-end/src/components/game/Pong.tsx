import Canvas from '@/components/app/canvas/Canvas';
import useColors from '@/hooks/useColors';
import { useSocket } from '@/providers/socket/socket.context';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

interface PongProps {
  gameId: number;
  isPlayer: boolean;
  isLocal: boolean;
}

const Pong = ({ gameId, isPlayer, isLocal }: PongProps): JSX.Element => {
  const { primary: primaryColor, secondary: secondaryColor } = useColors();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { socket } = useSocket();

  const parameters = {
    frameInterval: 1000 / 120,
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
    keys: isLocal
      ? ['w', 's', 'ArrowUp', 'ArrowDown']
      : ['ArrowUp', 'ArrowDown'],
  };

  const gameState = useRef({
    paddleY: {
      left: (parameters.dimensions.height - parameters.paddle.height) / 2,
      right: (parameters.dimensions.height - parameters.paddle.height) / 2,
    },
    ball: {
      x: parameters.dimensions.width / 2,
      y: parameters.dimensions.height / 2,
      radius: parameters.ball.radius,
    },
    score: { left: 0, right: 0 },
  });

  const keyState = useRef<{ [key: string]: boolean }>({});

  const frame = useRef(0);
  const ratio = useRef(1);

  useEffect(() => {
    const handleResize = (): void => {
      const canvas = canvasRef.current;
      const div = canvas?.parentElement;

      if (!canvas) {
        toast.error('Canvas failed to mount');
        return;
      }
      if (!div) {
        toast.error('Canvas parent element failed to mount');
        return;
      }

      const aspectRatio = 16 / 9;

      canvas.width = div.clientWidth;
      canvas.height = div.clientWidth / aspectRatio;
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
      context.fillStyle = primaryColor;
      context.fillRect(
        parameters.paddle.offset / ratio.current,
        gameState.current.paddleY.left / ratio.current,
        parameters.paddle.width / ratio.current,
        parameters.paddle.height / ratio.current
      );

      context.fillRect(
        (parameters.dimensions.width -
          parameters.paddle.offset -
          parameters.paddle.width) /
          ratio.current,
        gameState.current.paddleY.right / ratio.current,
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
      context.fillStyle = secondaryColor;
      context.fill();
      context.closePath();
    };

    const drawScore = (): void => {
      context.font = `${(context.canvas.height / 100) * 15}px Poppins`;
      context.fillStyle = primaryColor + '60';
      context.fillText(
        gameState.current.score.left.toString(),
        (context.canvas.width * 25) / 100,
        context.canvas.height / 5
      );
      context.fillText(
        gameState.current.score.right.toString(),
        context.canvas.width - (context.canvas.width * 30) / 100,
        context.canvas.height / 5
      );
    };

    socket?.on('gameState', (gameState_: typeof gameState.current) => {
      gameState.current = { ...gameState.current, ...gameState_ };
      ratio.current = parameters.dimensions.width / context.canvas.width;
    });

    const draw = (): void => {
      const now = new Date().getTime();
      const elapsed = now - lastTime;

      if (context && elapsed > parameters.frameInterval) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        drawBall();
        drawPaddle();
        drawScore();
        lastTime = now;
      }
      frame.current = window.requestAnimationFrame(draw);
    };

    frame.current = window.requestAnimationFrame(draw);

    return () => {
      socket?.removeAllListeners('gameState');
      cancelAnimationFrame(frame.current);
    };
  }, [socket, primaryColor, secondaryColor]);

  useEffect(() => {
    if (!isPlayer) return;

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (parameters.keys.includes(e.key)) {
        keyState.current[e.key] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent): void => {
      if (parameters.keys.includes(e.key)) {
        keyState.current[e.key] = false;
      }
    };

    const updatePaddles = (): void => {
      if (isLocal) {
        if (keyState.current['w']) {
          gameState.current.paddleY.left -= parameters.paddle.speed;
          if (gameState.current.paddleY.left < 0)
            gameState.current.paddleY.left = 0;
        }
        if (keyState.current['s']) {
          gameState.current.paddleY.left += parameters.paddle.speed;
          if (
            gameState.current.paddleY.left + parameters.paddle.height >=
            parameters.dimensions.height
          )
            gameState.current.paddleY.left =
              parameters.dimensions.height - parameters.paddle.height;
        }
        if (keyState.current['ArrowUp']) {
          gameState.current.paddleY.right -= parameters.paddle.speed;
          if (gameState.current.paddleY.right < 0)
            gameState.current.paddleY.right = 0;
        }
        if (keyState.current['ArrowDown']) {
          gameState.current.paddleY.right += parameters.paddle.speed;
          if (
            gameState.current.paddleY.right + parameters.paddle.height >=
            parameters.dimensions.height
          )
            gameState.current.paddleY.right =
              parameters.dimensions.height - parameters.paddle.height;
        }
      } else {
        if (keyState.current['w'] || keyState.current['ArrowUp']) {
          gameState.current.paddleY.left -= parameters.paddle.speed;
          if (gameState.current.paddleY.left < 0)
            gameState.current.paddleY.left = 0;
        }
        if (keyState.current['s'] || keyState.current['ArrowDown']) {
          gameState.current.paddleY.left += parameters.paddle.speed;
          if (
            gameState.current.paddleY.left + parameters.paddle.height >=
            parameters.dimensions.height
          )
            gameState.current.paddleY.left =
              parameters.dimensions.height - parameters.paddle.height;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    const intervalId = setInterval((): void => {
      updatePaddles();
      socket?.volatile.emit(
        'move',
        {
          gameId: gameId,
          data: { paddleY: gameState.current.paddleY },
        },
        (data: { left: number; right: number }) => {
          gameState.current.paddleY = data;
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
