import { Game, User } from '@prisma/client';
import { GameService } from '../game.service';
import { IsNumber } from 'class-validator';

export type Player = Pick<User, 'id' | 'elo'> & {
  socketId: string;
  searchGameSince: number;
};

export interface IFindGame {
  error?: string;
  players?: Player[];
}

export class CreateGame {
  @IsNumber()
  challengedId: number;
}

export type GameParameters = {
  dimensions: {
    width: number;
    height: number;
  };
  paddle: {
    width: number;
    height: number;
    offset: number;
    speed: number;
  };
  ball: {
    speed: number;
    radius: number;
  };
  scoreLimit: number;
};

export class Ball {
  x: number;
  y: number;
  radius: number;
  speed: number;
  dx: number;
  dy: number;

  constructor() {
    this.reset();
    this.radius = GameService.parameters.ball.radius;
    this.speed = GameService.parameters.ball.speed;
  }

  update(): void {
    this.x += this.dx;
    this.y += this.dy;

    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.dy *= -1;
    } else if (
      this.y + this.radius >=
      GameService.parameters.dimensions.height
    ) {
      this.y = GameService.parameters.dimensions.height - this.radius - 1;
      this.dy *= -1;
    }
  }

  updateAfterCollision(paddle: Paddle): void {
    const maxYSpeed = 10;
    const relativeIntersectY = this.y - (paddle.y + paddle.height / 2);

    this.dy = (relativeIntersectY / (paddle.height / 2)) * maxYSpeed;
    this.dx *= -1.05;

    if (paddle.side === 'left') {
      this.x = paddle.x + paddle.width + this.radius;
    } else {
      this.x = paddle.x - this.radius;
    }
  }

  reset(): void {
    this.x = GameService.parameters.dimensions.width / 2;
    this.y = GameService.parameters.dimensions.height / 2;
    this.dx = GameService.parameters.ball.speed;
    this.dy = GameService.getRandomArbitrary(
      -GameService.parameters.ball.speed,
      GameService.parameters.ball.speed,
    );
  }
}

export class Paddle {
  side: 'left' | 'right';
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;

  constructor(side: 'left' | 'right') {
    this.side = side;
    if (side === 'left') this.x = GameService.parameters.paddle.offset;
    else
      this.x =
        GameService.parameters.dimensions.width -
        GameService.parameters.paddle.offset -
        GameService.parameters.paddle.width;
    this.width = GameService.parameters.paddle.width;
    this.height = GameService.parameters.paddle.height;
    this.speed = GameService.parameters.paddle.speed;
  }

  update(y: number): void {
    this.y = y;
  }

  detectCollision(ball: Ball): boolean {
    return (
      ball.x < this.x + this.width &&
      ball.x + ball.radius > this.x &&
      ball.y < this.y + this.height &&
      ball.y + ball.radius > this.y
    );
  }

  reset(): void {
    this.y =
      (GameService.parameters.dimensions.height -
        GameService.parameters.paddle.height) /
      2;
  }
}

export type GameInfos = Game & {
  ball: Ball;
  paddles: { left: Paddle; right: Paddle };
};

export type GameRoom = {
  isLocal: boolean;
  game: GameInfos;
  userIds: number[];
};

export enum GameState {
  WAITING = 'waiting',
  INGAME = 'playing',
  STOPPED = 'finished',
}
