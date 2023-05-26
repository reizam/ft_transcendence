import { ThemeContext } from '@/pages/ThemeContext';
import { useSocket } from '@/providers/socket/socket.context';
import { useRouter } from 'next/router';
import { ReactElement, useContext, useEffect, useRef } from 'react';

// interface Props {}

const Canvas = (): ReactElement => {
  const { borderColor } = useContext(ThemeContext);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { socket } = useSocket();
  const router = useRouter();

  socket?.emit('start');

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const div = canvas?.parentElement;
    const ratio = { width: 0, height: 0 };
    let height = 0;
    let width = 0;

    if (div) {
      height = div?.clientHeight;
      width = div?.clientWidth;
    }

    if (canvas) {
      canvas.width = width;
      canvas.height = height;
    }

    socket?.once('stop', () => {
      router.push('/game');
    });

    socket?.once('ready', () => {
      return;
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
          ratio.width = state.canvasDimensions.width / context.canvas.width;
          ratio.height = state.canvasDimensions.height / context.canvas.height;

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

    // Draw the paddle for the player
    const drawPaddle = (
      context: CanvasRenderingContext2D,
      dimensions: { width: number; height: number },
      positions: { left: number; right: number }
    ): void => {
      const paddleHeight = dimensions.height * 0.2;
      const paddleWidth = 10;

      // Draw the paddle on the left
      context.fillStyle = borderColor;
      context.fillRect(
        0,
        positions.left / ratio.height,
        paddleWidth,
        paddleHeight
      );

      // Draw the paddle on the right
      context.fillStyle = borderColor;
      context.fillRect(
        dimensions.width - 10,
        positions.right / ratio.height,
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
        ball.x / ratio.width,
        ball.y / ratio.height,
        ball.radius,
        0,
        Math.PI * 2
      );
      context.fillStyle = 'white';
      context.fill();
      context.closePath();
    };

    const handleKeyDown = (e: KeyboardEvent): void => {
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
      const context = canvas?.getContext('2d');

      if (div) {
        const dimensions = {
          width: div?.clientWidth,
          height: div?.clientHeight,
        };

        if (canvasRef.current) {
          canvas.width = dimensions.width;
          canvas.height = dimensions.height;
        }
      }
    };

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
