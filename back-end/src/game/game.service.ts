import {
  GameInfos,
  GameParameters,
  GameState,
  Role,
} from '@/game/types/game.types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {
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
    fuseCount: 3,
    scoreLimit: 10,
  };

  static getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  updateBall(game: GameInfos): void {
    game.ball.update();

    if (game.player[Role.PLAYER1].paddle.detectCollision(game.ball)) {
      game.ball.updateAfterCollision(game.player[Role.PLAYER1].paddle);
    } else if (game.player[Role.PLAYER2].paddle.detectCollision(game.ball)) {
      game.ball.updateAfterCollision(game.player[Role.PLAYER2].paddle);
    } else if (
      game.ball.x - game.ball.radius < 0 ||
      game.ball.x + game.ball.radius >= GameService.parameters.dimensions.width
    ) {
      game.ball.reset();
      if (game.ball.x - game.ball.radius < 0) {
        game.ball.dx = -game.ball.speed;
        game.playerTwoScore += 1;
      } else {
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
    game.player[Role.PLAYER1].paddle.reset();
    game.player[Role.PLAYER2].paddle.reset();
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
}
