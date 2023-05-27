import { ThemeContext } from '@/pages/ThemeContext';
import { useSocket } from '@/providers/socket/socket.context';
import { useRouter } from 'next/router';
import { ReactElement, useContext, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

// interface Props {}

const Canvas = (): ReactElement => {
  const { borderColor } = useContext(ThemeContext);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { socket } = useSocket();
  const router = useRouter();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const div = canvas?.parentElement;
    let ratio = 0;

    console.log(div);

    // Draw the paddle for the player
    const drawPaddle = (
      context: CanvasRenderingContext2D,
      dimensions: { width: number; height: number },
      positions: { left: number; right: number }
    ): void => {
      const paddleHeight = dimensions.height * 0.2;
      const paddleWidth = dimensions.width * 0.01;

      // Draw the paddle on the left
      context.fillStyle = borderColor;
      context.fillRect(
        10 / ratio,
        positions.left / ratio,
        paddleWidth,
        paddleHeight
      );

      // Draw the paddle on the right
      context.fillStyle = borderColor;
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
      context.fillStyle = 'white';
      context.fill();
      context.closePath();
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
      const context = canvas?.getContext('2d');
      const div = canvas?.parentElement;

      if (!canvas) {
        toast.error('Canvas failed to mount');
        return;
      }

      if (!div) {
        toast.error('Canvas parent element failed to mount');
        return;
      }

      canvas.width = div.clientWidth ?? 640;
      canvas.height = div.clientHeight ?? 480;
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
  }, [socket, router]);

  return <canvas ref={canvasRef} />;
};

export default Canvas;
