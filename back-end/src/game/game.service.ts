import { GameInfos, GameParameters, GameState } from '@/game/types/game.types';
import { PrismaService } from '@/prisma/prisma.service';
import { Status } from '@/user/types/user.types';
import { UserService } from '@/user/user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  static parameters: GameParameters = {
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

  static getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  updateBall(game: GameInfos): void {
    game.ball.update();

    if (game.paddles.left.detectCollision(game.ball)) {
      game.ball.updateAfterCollision(game.paddles.left);
    } else if (game.paddles.right.detectCollision(game.ball)) {
      game.ball.updateAfterCollision(game.paddles.right);
    } else if (
      game.ball.x - game.ball.radius < 0 ||
      game.ball.x + game.ball.radius >= GameService.parameters.dimensions.width
    ) {
      if (game.ball.x - game.ball.radius < 0) {
        game.ball.reset();
        game.ball.dx = -game.ball.speed;
        game.playerTwoScore += 1;
      } else {
        game.ball.reset();
        game.ball.dx = game.ball.speed;
        game.playerOneScore += 1;
      }
      game.ball.dy = GameService.getRandomArbitrary(
        -game.ball.speed,
        game.ball.speed,
      );
    }
  }

  reset(game: GameInfos): void {
    game.paddles.left.reset();
    game.paddles.right.reset();
    game.ball.reset();
  }

  update(game: GameInfos): GameState {
    this.updateBall(game);
    if (
      game.playerOneScore === GameService.parameters.scoreLimit ||
      game.playerTwoScore === GameService.parameters.scoreLimit
    ) {
      this.reset(game);
      return GameState.STOPPED;
    } else return GameState.INGAME;
  }

  async updateUserStatus(userId: number, newStatus?: string): Promise<void> {
    const onlineIds: number[] = this.userService.getOnlineIds();
    const status =
      newStatus ??
      (onlineIds.includes(userId) ? Status.ONLINE : Status.OFFLINE);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status,
      },
    });
  }
}
