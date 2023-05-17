import { ThemeContext } from '@/pages/ThemeContext';
import { useSocket } from '@/providers/socket/socket.context';
import { ReactElement, useContext, useEffect, useRef } from 'react';

// interface Props {}

const Canvas = (): ReactElement => {
  const { borderColor } = useContext(ThemeContext);
  // console.log('borderColor: ', borderColor);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { socket } = useSocket();

  // Draw the paddle for the player
  const drawPaddle = (
    ctx: CanvasRenderingContext2D,
    dimensions: { width: number; height: number },
    positions: { left: number; right: number }
  ): void => {
    console.log('DrawPaddle');
    const paddleHeight = dimensions.height * 0.2;
    const paddleWidth = 10;

    // Draw the paddle on the left
    ctx.fillStyle = borderColor;
    ctx.fillRect(10, positions.left, paddleWidth, paddleHeight);

    // Draw the paddle on the right
    ctx.fillStyle = borderColor;
    ctx.fillRect(
      dimensions.width - 10,
      positions.right,
      paddleWidth,
      paddleHeight
    );
  };

  // Draw the ball
  const drawBall = (
    ctx: CanvasRenderingContext2D,
    ball: { x: number; y: number; radius: number }
  ): void => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
  };

  useEffect(() => {
    socket?.on('connect', () => {
      const div = canvasRef.current?.parentElement;
      if (div) {
        const dimensions = { width: 700, height: 400 };
        socket.emit('getDimensions', dimensions);

        if (canvasRef.current) {
          canvasRef.current.width = dimensions.width;
          canvasRef.current.height = dimensions.height;
        }
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['w', 's', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        socket?.emit('keyDown', e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
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

    const dimensions = { width: 700, height: 400 };
    const ctx = canvasRef.current?.getContext('2d');

    socket?.on(
      'gameState',
      (gameState: { paddlePositions: any; ball: any }) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          drawBall(ctx, gameState.ball);
        }
      }
    );

    socket?.on(
      'gameState',
      (gameState: { paddlePositions: any; ball: any }) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          // Clean the canvas
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          drawPaddle(
            ctx,
            { width: ctx.canvas.width, height: ctx.canvas.height },
            gameState.paddlePositions
          );
          drawBall(ctx, gameState.ball);
        }
      }
    );
  }, []);

  return (
    <div className="ctn__games">
      <div className="frame">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default Canvas;
