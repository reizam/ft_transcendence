import { GameState } from '@/game/types/game.types';
import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
export class GameService {
  @WebSocketServer()
  server: Server;

  state: GameState = GameState.WAITING;

  keyStates: { [key: string]: boolean } = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false,
  };

  paddlePositions = {
    left: 0,
    right: 0,
  };

  canvasDimensions = { width: 0, height: 0 };
  paddleHeight = 0.2;

  ball = {
    x: 0,
    y: 0,
    radius: 10,
    speedX: 2,
    speedY: 2,
  };

  scores = {
    left: 0,
    right: 0,
  };

  resetScores(): void {
    this.scores.left = 0;
    this.scores.right = 0;
  }

  updatePaddlePosition(): void {
    if (this.state !== GameState.INGAME) {
      return;
    }
    const speed = 10;

    if (this.keyStates.w && this.paddlePositions.left > 0) {
      this.paddlePositions.left -= speed;
    }
    if (
      this.keyStates.s &&
      this.paddlePositions.left <
        this.canvasDimensions.height * (1 - this.paddleHeight)
    ) {
      this.paddlePositions.left += speed;
    }
    if (this.keyStates.ArrowUp && this.paddlePositions.right > 0) {
      this.paddlePositions.right -= speed;
    }
    if (
      this.keyStates.ArrowDown &&
      this.paddlePositions.right <
        this.canvasDimensions.height * (1 - this.paddleHeight)
    ) {
      this.paddlePositions.right += speed;
    }
  }

  getRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  updateBallPosition(): void {
    if (this.state !== GameState.INGAME) {
      return;
    }
    const paddleWidth = 10;
    const actualPaddleHeight = this.canvasDimensions.height * this.paddleHeight;

    // Mettre à jour la position de la Balle
    this.ball.x += this.ball.speedX;
    this.ball.y += this.ball.speedY;

    // Collisions avec les limites inférieurs et supérieures du canvas
    if (
      this.ball.y - this.ball.radius < 0 ||
      this.ball.y + this.ball.radius > this.canvasDimensions.height
    ) {
      this.ball.speedY *= -1;
    }

    // Collision avec les paddles
    const leftPaddleCollision =
      this.ball.x - this.ball.radius < 10 + paddleWidth &&
      this.ball.y + this.ball.radius > this.paddlePositions.left &&
      this.ball.y - this.ball.radius <
        this.paddlePositions.left + actualPaddleHeight;

    const rightPaddleCollision =
      this.ball.x + this.ball.radius >
        this.canvasDimensions.width - 10 - paddleWidth &&
      this.ball.y + this.ball.radius > this.paddlePositions.right &&
      this.ball.y - this.ball.radius <
        this.paddlePositions.right + actualPaddleHeight;

    if (leftPaddleCollision || rightPaddleCollision) {
      this.ball.speedX *= -1.1;

      const paddle = leftPaddleCollision
        ? this.paddlePositions.left
        : this.paddlePositions.right;
      const relativeIntersectY =
        this.ball.y - (paddle + actualPaddleHeight / 2);

      // Utiliser une interpolation linéaire pour déterminer la vitesse en Y de la balle
      const maxYSpeed = 8; // Vitesse maximale en Y pour la balle
      this.ball.speedY =
        (relativeIntersectY / (actualPaddleHeight / 2)) * maxYSpeed;

      // Ajuster la position de la balle pour éviter qu'elle ne reste bloquée dans le paddle
      if (leftPaddleCollision) {
        this.ball.x = 10 + paddleWidth + this.ball.radius;
      } else {
        this.ball.x =
          this.canvasDimensions.width - 10 - paddleWidth - this.ball.radius;
      }
    }

    // Remise à zéro de la balle si elle sort du canvas sur les côtés gauche ou droit
    if (
      this.ball.x - this.ball.radius < 0 ||
      this.ball.x + this.ball.radius > this.canvasDimensions.width
    ) {
      const lostLeftPaddle = this.ball.x - this.ball.radius < 0;
      this.ball.x = this.canvasDimensions.width / 2;
      this.ball.y = this.canvasDimensions.height / 2;

      // Si le paddle gauche a perdu, la balle se déplace vers la droite (vitesse positive en X)
      // Sinon, elle se déplace vers la gauche (vitesse négative en X)
      this.ball.speedX = lostLeftPaddle ? -Math.abs(5) : Math.abs(5);
      this.ball.speedY = this.getRandomNumber(-5, 5);

      lostLeftPaddle ? (this.scores.left += 1) : (this.scores.right += 1);
    }

    // Vérifie si l'un des joueurs a atteint 10 points
    if (this.scores.left === 10 || this.scores.right === 10) {
      this.resetScores();
      this.state = GameState.STOPPED;
    }
  }

  update(): void {
    this.updatePaddlePosition();
    this.updateBallPosition();
  }

  // async updateEloRating(result: MatchResult): Promise<void> {
  //   const kFactor = 32;

  //   const expectedOutcomeWinner =
  //     1 / (1 + 10 ** ((result.loser.elo - result.winner.elo) / 400));
  //   const expectedOutcomeLoser =
  //     1 / (1 + 10 ** ((result.winner.elo - result.loser.elo) / 400));

  //   const actualOutcomeWinner = result.isDraw ? 0.5 : 1;
  //   const actualOutcomeLoser = result.isDraw ? 0.5 : 0;

  //   const newRatingWinner =
  //     result.winner.elo +
  //     kFactor * (actualOutcomeWinner - expectedOutcomeWinner);
  //   const newRatingLoser =
  //     result.loser.elo +
  //     kFactor * (actualOutcomeLoser - expectedOutcomeLoser);

  //   await this.prisma.statistic.update({
  //     where: {
  //       userId: result.loser.id,
  //     },
  //     data: {
  //       elo: Math.round(newRatingLoser),
  //     },
  //   });

  //   try {
  //     await this.prisma.statistic.update({
  //       where: {
  //         userId: result.winner.id,
  //       },
  //       data: {
  //         elo: Math.round(newRatingWinner),
  //       },
  //     });
  //   } catch (e) {
  //     // update back to old value to avoid biased ranking
  //     await this.prisma.statistic.update({
  //       where: {
  //         userId: result.loser.id,
  //       },
  //       data: {
  //         elo: result.loser.elo,
  //       },
  //     });
  //     throw e;
  //   }
  // }

  // async createGame(userId: number): Promise<number> {
  //   const game = await this.prisma.game.create({
  //     data: {
  //       status: 'waiting',
  //       playerOneId: userId,
  //       players: {
  //         connect: [{ id: userId }],
  //       },
  //     },
  //   });
  //   return game.id;
  // }

  // async joinGame(gameId: number, playerTwoId: number): Promise<void> {
  //   await this.prisma.game.update({
  //     where: {
  //       id: gameId,
  //     },
  //     data: {
  //       playerTwoId: playerTwoId,
  //       launchedAt: new Date().toISOString(),
  //       players: {
  //         connect: [{ id: playerTwoId }],
  //       },
  //     },
  //   });
  // }

  // async launchGame({ gameId, playerTwoId }: LaunchGame): Promise<void> {
  //   await this.prisma.game.update({
  //     where: {
  //       id: gameId,
  //     },
  //     data: {
  //       playerTwoId: playerTwoId,
  //       launchedAt: new Date().toISOString(),
  //       players: {
  //         connect: [{ id: playerTwoId }],
  //       },
  //     },
  //   });
  // }
}
