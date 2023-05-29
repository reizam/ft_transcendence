import { useSocket } from '@/providers/socket/socket.context';
import { useTheme } from '@/providers/theme/theme.context';
import { IThemeContext } from '@/providers/theme/theme.interface';
import gameStyles from '@/styles/game.module.css';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

// interface Props {}

const Canvas = (): ReactElement => {
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    let ratio = 0;

    // Draw the paddle for the player
    const drawPaddle = (
      context: CanvasRenderingContext2D,
      dimensions: { width: number; height: number },
      positions: { left: number; right: number }
    ): void => {
      const paddleHeight = dimensions.height * 0.2;
      const paddleWidth = dimensions.width * 0.01;

      // Draw the paddle on the left
      context.fillStyle = primaryColor;
      context.fillRect(
        10 / ratio,
        positions.left / ratio,
        paddleWidth,
        paddleHeight
      );

      context.fillRect(
        dimensions.width - paddleWidth - 10 / ratio,
        positions.right / ratio,
        paddleWidth,
        paddleHeight
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
      context.font = '4rem Poppins';
      context.fillStyle = primaryColor + '40';
      context.fillText(
        score.left.toString(),
        context.canvas.width / 4,
        context.canvas.height / 5
      );
      context.fillText(
        score.right.toString(),
        (context.canvas.width / 4) * 3,
        context.canvas.height / 5
      );
    };

    const handleKeyDown = (e: KeyboardEvent): void => {
      e.preventDefault();
      if (['w', 's', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        socket?.emit('keyDown', e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent): void => {
      if (['w', 's', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        socket?.emit('keyUp', e.key);
      }
    };

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

      const containerWidth = div.clientWidth;
      const containerHeight = div.clientHeight;

      const aspectRatio = 16 / 9;
      let canvasWidth = containerWidth;
      let canvasHeight = containerWidth / aspectRatio;

      if (canvasHeight > containerHeight) {
        canvasHeight = containerHeight;
        canvasWidth = containerHeight * aspectRatio;
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    };

    socket?.emit('start');

    socket?.once('stop', () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push('/game');
    });

    socket?.once('ready', () => {
      handleResize();
    });

    socket?.on(
      'gameState',
      (state: {
        canvasDimensions: { width: number; height: number };
        paddlePositions: { left: number; right: number };
        ball: {
          x: number;
          y: number;
          radius: number;
          speedX: number;
          speedY: number;
        };
        score: { left: number; right: number };
      }) => {
        if (context) {
          ratio = state.canvasDimensions.width / context.canvas.width;

          // Clean the canvas
          context.clearRect(0, 0, context.canvas.width, context.canvas.height);
          drawPaddle(
            context,
            { width: context.canvas.width, height: context.canvas.height },
            state.paddlePositions
          );
          drawBall(context, state.ball);
          drawScore(context, state.score);
        }
      }
    );

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleResize);

    return () => {
      socket?.removeAllListeners('stop');
      socket?.removeAllListeners('ready');
      socket?.removeAllListeners('gamestate');
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
    };
  }, [socket, router, theme]);

  return (
    <div className={gameStyles.ctn__canvas}>
      <div
        className={gameStyles.ctn__game__canvas}
        style={{
          borderColor: primaryColor,
          boxShadow: `0 0 1px ${primaryColor}, 0 0 2px ${primaryColor}, 0 0 4px ${primaryColor}, 0 0 8px ${primaryColor}, 0 0 12px ${primaryColor}`,
        }}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default Canvas;
