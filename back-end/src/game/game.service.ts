import { GameInfos, GameState, GameParameters } from '@/game/types/game.types';
import { Injectable } from '@nestjs/common';

// class Ball {
//   x: number;
//   y: number;
//   radius: number;
//   speed: number;
//   dx: number;
//   dy: number;

//   constructor() {
//     this.reset();
//     this.radius = parameters.ball.radius;
//     this.speed = parameters.ball.speed;
//   }

//   update(): void {
//     this.x += this.dx;
//     this.y += this.dy;

//     if (this.y - this.radius < 0) {
//       this.y = this.radius;
//       this.dy *= -1;
//     } else if (this.y + this.radius >= parameters.dimensions.height) {
//       this.y = parameters.dimensions.height - this.radius - 1;
//       this.dy *= -1;
//     }
//   }

//   updateAfterCollision(paddle: Paddle): void {
//     const maxYSpeed = 5;
//     const relativeIntersectY = this.y - (paddle.y + paddle.height / 2);

//     this.dy = (relativeIntersectY / (paddle.height / 2)) * maxYSpeed;
//     this.dx *= -1.05;

//     if (paddle.side === 'left') {
//       this.x = paddle.x + paddle.width + this.radius;
//     } else {
//       this.x = paddle.x - this.radius;
//     }
//   }

//   reset(): void {
//     this.x = parameters.dimensions.width / 2;
//     this.y = parameters.dimensions.height / 2;
//     this.dx = parameters.ball.speed;
//     this.dy = getRandomArbitrary(-parameters.ball.speed, parameters.ball.speed);
//   }
// }

// class Paddle {
//   side: 'left' | 'right';
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   speed: number;

//   constructor(side: 'left' | 'right') {
//     this.side = side;
//     if (side === 'left') this.x = parameters.paddle.offset;
//     else
//       this.x =
//         parameters.dimensions.width -
//         parameters.paddle.offset -
//         parameters.paddle.width;
//     this.width = parameters.paddle.width;
//     this.height = parameters.paddle.height;
//     this.speed = parameters.paddle.speed;
//   }

//   detectCollision(ball: Ball): boolean {
//     return (
//       ball.x < this.x + this.width &&
//       ball.x + ball.radius > this.x &&
//       ball.y < this.y + this.height &&
//       ball.y + ball.radius > this.y
//     );
//   }

//   reset(): void {
//     this.y = (parameters.dimensions.height - parameters.paddle.height) / 2;
//   }
// }

// class Score {
//   left = 0;
//   right = 0;

//   reset(): void {
//     this.left = 0;
//     this.right = 0;
//   }
// }

@Injectable()
export class GameService {
  static parameters: GameParameters = {
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

  static getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  ball: Ball = new Ball();

  paddles: { left: Paddle; right: Paddle } = {
    left: new Paddle('left'),
    right: new Paddle('right'),
  };

  keyState: { [key: string]: boolean } = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false,
  };

  // score = new Score();

  updatePaddles(game: GameInfos): void {
    if (game.keyState.w) {
      game.paddles.left.y -= game.paddles.left.speed;
      if (game.paddles.left.y < 0) game.paddles.left.y = 0;
    }
    if (game.keyState.s) {
      game.paddles.left.y += game.paddles.left.speed;
      if (
        game.paddles.left.y + game.paddles.left.height >=
        GameService.parameters.dimensions.height
      )
        game.paddles.left.y =
          GameService.parameters.dimensions.height - game.paddles.left.height;
    }
    if (game.keyState.ArrowUp) {
      game.paddles.right.y -= game.paddles.right.speed;
      if (game.paddles.right.y < 0) game.paddles.right.y = 0;
    }
    if (game.keyState.ArrowDown) {
      game.paddles.right.y += game.paddles.right.speed;
      if (
        game.paddles.right.y + game.paddles.right.height >=
        GameService.parameters.dimensions.height
      )
        game.paddles.right.y =
          GameService.parameters.dimensions.height - game.paddles.right.height;
    }
  }

  updateBall(): void {
    this.ball.update();

    if (this.paddles.left.detectCollision(this.ball)) {
      this.ball.updateAfterCollision(this.paddles.left);
    } else if (this.paddles.right.detectCollision(this.ball)) {
      this.ball.updateAfterCollision(this.paddles.right);
    } else if (
      this.ball.x - this.ball.radius < 0 ||
      this.ball.x + this.ball.radius >= GameService.parameters.dimensions.width
    ) {
      const lostLeftPaddle = this.ball.x - this.ball.radius < 0;

      this.ball.dx = lostLeftPaddle ? -this.ball.speed : this.ball.speed;
      this.ball.dy = getRandomArbitrary(-this.ball.speed, this.ball.speed);

      lostLeftPaddle ? (this.score.left += 1) : (this.score.right += 1);

      this.ball.reset();
    }
  }

  reset(): void {
    this.paddles.left.reset();
    this.paddles.right.reset();
    this.ball.reset();
    this.score.reset();
  }

  update(game: GameInfos): GameState {
    this.updatePaddles();
    this.updateBall();

    if (
      this.score.left === GameService.parameters.scoreLimit ||
      this.score.right === GameService.parameters.scoreLimit
    ) {
      this.reset();
      return GameState.STOPPED;
    } else return GameState.INGAME;
  }
}
