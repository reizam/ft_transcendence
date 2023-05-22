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
    socket?.on('stop', () => {
      router.push('/game');
    });
    socket?.on('ready', () => {
      const div = canvas?.parentElement;
      if (div) {
        const dimensions = {
          width: div?.clientWidth,
          height: div?.clientHeight,
        };
        socket.emit('dimensions', dimensions);

        if (canvasRef.current) {
          canvas.width = dimensions.width;
          canvas.height = dimensions.height;
        }
      }
    });
    socket?.on('gameState', (state: { paddlePositions: any; ball: any }) => {
      if (context) {
        // Clean the canvas
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        drawPaddle(
          context,
          { width: context.canvas.width, height: context.canvas.height },
          state.paddlePositions
        );
        drawBall(context, state.ball);
      }
    });
  }, []);

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
    context.fillRect(10, positions.left, paddleWidth, paddleHeight);

    // Draw the paddle on the right
    context.fillStyle = borderColor;
    context.fillRect(
      dimensions.width - 10,
      positions.right,
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
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
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

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  const ball = {
    x: 50,
    y: 50,
    radius: 10,
    speedX: 2,
    speedY: 2,
  };

  const paddlePositions = {
    left: 0,
    right: 0,
  };

  return <canvas ref={canvasRef} />;
};

export default Canvas;
