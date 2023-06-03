import { Keyframes } from '@/components/utils/Keyframes';
import { useSocket } from '@/providers/socket/socket.context';
import { useTheme } from '@/providers/theme/theme.context';
import { IThemeContext } from '@/providers/theme/theme.interface';
import gameStyles from '@/styles/game.module.css';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useLayoutEffect, useRef } from 'react';
import { toast } from 'react-toastify';

interface CanvasProps {
  gameId: number;
}

const Canvas = ({ gameId }: CanvasProps): ReactElement => {
  const { theme }: IThemeContext = useTheme();
  const primaryColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue(theme.colors.primary);
  const secondaryColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue(theme.colors.secondary);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { socket } = useSocket();
  const router = useRouter();
  const frame = useRef(0);

  const parameters = {
    dimensions: {
      width: 1920,
      height: 1080,
    },
    paddle: {
      width: 20,
      height: 200,
      offset: 10,
      speed: 15,
    },
    ball: {
      speed: 8,
      radius: 20,
    },
    scoreLimit: 10,
  };

  useLayoutEffect(() => {
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
    const context = canvas?.getContext('2d');
    let ratio = 0;
    let state = {
      paddles: { left: 0, right: 0 },
      ball: {
        x: 0,
        y: 0,
        radius: 0,
      },
      score: { left: 0, right: 0 },
    };
    const fps = 120;
    const frameInterval = 1000 / fps;
    let lastTime = new Date().getTime();

    // Draw the paddle for the player
    const drawPaddle = (
      context: CanvasRenderingContext2D,
      canvas: { width: number; height: number },
      positions: { left: number; right: number }
    ): void => {
      // Draw the paddle on the left
      context.fillStyle = primaryColor;
      context.fillRect(
        parameters.paddle.offset / ratio,
        positions.left / ratio,
        parameters.paddle.width / ratio,
        parameters.paddle.height / ratio
      );

      context.fillRect(
        canvas.width -
          parameters.paddle.offset -
          parameters.paddle.width / ratio,
        positions.right / ratio,
        parameters.paddle.width / ratio,
        parameters.paddle.height / ratio
      );
    };

    // Draw the ball
    const drawBall = (
      context: CanvasRenderingContext2D,
      ball: { x: number; y: number; radius: number }
    ): void => {
      context.beginPath();
      context.arc(
        ball.x / ratio,
        ball.y / ratio,
        ball.radius / ratio,
        0,
        Math.PI * 2
      );
      context.fillStyle = secondaryColor;
      context.fill();
      context.closePath();
    };

    const drawScore = (
      context: CanvasRenderingContext2D,
      score: { left: number; right: number }
    ): void => {
      context.font = `${(context.canvas.height / 100) * 15}px Poppins`;
      context.fillStyle = primaryColor + '60';
      context.fillText(
        score.left.toString(),
        (context.canvas.width * 25) / 100,
        context.canvas.height / 5
      );
      context.fillText(
        score.right.toString(),
        context.canvas.width - (context.canvas.width * 30) / 100,
        context.canvas.height / 5
      );
    };

    socket?.once('stop', () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push('/game');
    });

    socket?.on(
      'gameState',
      (state_: {
        paddles: { left: number; right: number };
        ball: {
          x: number;
          y: number;
          radius: number;
        };
        score: { left: number; right: number };
      }) => {
        state = state_;
        if (context) {
          ratio = parameters.dimensions.width / context.canvas.width;
        }
      }
    );

    const draw = (): void => {
      const now = new Date().getTime();
      const elapsed = now - lastTime;

      if (context && elapsed > frameInterval) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        drawBall(context, state.ball);
        drawPaddle(
          context,
          { width: context.canvas.width, height: context.canvas.height },
          state.paddles
        );
        drawScore(context, state.score);

        lastTime = now;
      }
      frame.current = window.requestAnimationFrame(draw);
    };

    frame.current = window.requestAnimationFrame(draw);

    return () => {
      socket?.removeAllListeners('stop');
      socket?.removeAllListeners('ready');
      socket?.removeAllListeners('gamestate');
      cancelAnimationFrame(frame.current);
    };
  }, [socket, router, theme]);

  useEffect(() => {
    const keyState: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (['w', 's', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        keyState[e.key] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent): void => {
      if (['w', 's', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        keyState[e.key] = false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    const intervalId = setInterval((): void => {
      socket?.volatile.emit('move', { gameId: gameId, data: keyState });
    }, 1000 / 120);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      clearInterval(intervalId);
    };
  }, [socket]);

  return (
    <div className={gameStyles.ctn__canvas}>
      <div
        className={gameStyles.ctn__game__canvas}
        style={{
          borderColor: primaryColor,
          boxShadow: `0 0 1px ${primaryColor}ff, 0 0 2px ${primaryColor}ff, 0 0 4px ${primaryColor}ff, 0 0 8px ${primaryColor}ff, 0 0 12px ${primaryColor}ff`,
          animation: 'neon-blink 3s infinite alternate',
        }}
      >
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
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default Canvas;
