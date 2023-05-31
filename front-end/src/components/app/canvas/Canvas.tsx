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
  const frame = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    let ratio = 0;
    let state = {
      canvasDimensions: { width: 0, height: 0 },
      paddlePositions: { left: 0, right: 0 },
      ball: {
        x: 0,
        y: 0,
        radius: 0,
        speedX: 0,
        speedY: 0,
      },
      score: { left: 0, right: 0 },
    };
    const fps = 120;
    const frameInterval = 1000 / fps;
    let lastTime = new Date().getTime();

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

    socket?.emit('start');

    socket?.once('stop', () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push('/game');
    });

    socket?.once('ready', () => {
      return;
    });

    socket?.on(
      'gameState',
      (state_: {
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
        state = state_;
        if (context) {
          ratio = state.canvasDimensions.width / context.canvas.width;
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
          state.paddlePositions
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
      socket?.emit('move', keyState);
    }, 1000 / 120);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      clearInterval(intervalId);
    };
  }, [socket]);

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

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
