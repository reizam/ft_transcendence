import Canvas from '@/components/app/canvas/Canvas';
import useColors from '@/hooks/useColors';
import { useSocket } from '@/providers/socket/socket.context';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { toast } from 'react-toastify';

interface PongProps {
  gameId: number;
  isPlayer: boolean;
}

const Pong = ({ gameId, isPlayer }: PongProps): JSX.Element => {
  const { primary: primaryColor, secondary: secondaryColor } = useColors();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { socket } = useSocket();

  const frame = useRef(0);
  const ratio = useRef(0);

  const parameters = {
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
        parameters.paddle.offset / ratio.current,
        positions.left / ratio.current,
        parameters.paddle.width / ratio.current,
        parameters.paddle.height / ratio.current
      );

      context.fillRect(
        canvas.width -
          (parameters.paddle.offset + parameters.paddle.width) / ratio.current,
        positions.right / ratio.current,
        parameters.paddle.width / ratio.current,
        parameters.paddle.height / ratio.current
      );
    };

    // Draw the ball
    const drawBall = (
      context: CanvasRenderingContext2D,
      ball: { x: number; y: number; radius: number }
    ): void => {
      if (ball.x === -1 || ball.y === -1) return;
      context.beginPath();
      context.arc(
        ball.x / ratio.current,
        ball.y / ratio.current,
        ball.radius / ratio.current,
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
          ratio.current = parameters.dimensions.width / context.canvas.width;
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
      socket?.removeAllListeners('gamestate');
      cancelAnimationFrame(frame.current);
    };
  }, [socket, primaryColor, secondaryColor]);

  useEffect(() => {
    if (!isPlayer) return;

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

  return <Canvas ref={canvasRef} />;
};

export default Pong;
