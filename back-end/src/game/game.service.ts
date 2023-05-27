import { GameState } from '@/game/types/game.types';
import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
export class GameService {
  @WebSocketServer()
  server: Server;

  keyStates: { [key: string]: boolean } = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false,
  };

  canvasDimensions = { width: 1920, height: 1080 };

  paddleSpeed = 20;

  paddlePositions = {
    left: this.canvasDimensions.height / 2 - this.canvasDimensions.height * 0.1,
    right:
      this.canvasDimensions.height / 2 - this.canvasDimensions.height * 0.1,
  };

  paddleHeight = this.canvasDimensions.height * 0.2;
  paddleWidth = this.canvasDimensions.width * 0.02;

  ball = {
    x: this.canvasDimensions.width / 2,
    y: this.canvasDimensions.height / 2,
    radius: 10,
    speedX: 10,
    speedY: this.getRandomNumber(-5, 5),
  };

  scores = {
    left: 0,
    right: 0,
  };

  getRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  resetScores(): void {
    this.scores.left = 0;
    this.scores.right = 0;
  }

  updatePaddlePosition(): void {
    if (this.keyStates.w && this.paddlePositions.left > 0) {
      this.paddlePositions.left -= this.paddleSpeed;
    }
    if (
      this.keyStates.s &&
      this.paddlePositions.left <
        this.canvasDimensions.height - this.paddleHeight
    ) {
      this.paddlePositions.left += this.paddleSpeed;
    }
    if (this.keyStates.ArrowUp && this.paddlePositions.right > 0) {
      this.paddlePositions.right -= this.paddleSpeed;
    }
    if (
      this.keyStates.ArrowDown &&
      this.paddlePositions.right <
        this.canvasDimensions.height - this.paddleHeight
    ) {
      this.paddlePositions.right += this.paddleSpeed;
    }
  }

  updateBallPosition(): void {
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
      this.ball.x - this.ball.radius < this.paddleWidth &&
      this.ball.y + this.ball.radius > this.paddlePositions.left &&
      this.ball.y - this.ball.radius <
        this.paddlePositions.left + this.paddleHeight;

    const rightPaddleCollision =
      this.ball.x + this.ball.radius >
        this.canvasDimensions.width - this.paddleWidth &&
      this.ball.y + this.ball.radius > this.paddlePositions.right &&
      this.ball.y - this.ball.radius <
        this.paddlePositions.right + this.paddleHeight;

    if (leftPaddleCollision || rightPaddleCollision) {
      this.ball.speedX *= -1.1;

      const paddle = leftPaddleCollision
        ? this.paddlePositions.left
        : this.paddlePositions.right;
      const relativeIntersectY = this.ball.y - (paddle + this.paddleHeight / 2);

      // Utiliser une interpolation linéaire pour déterminer la vitesse en Y de la balle
      const maxYSpeed = 8; // Vitesse maximale en Y pour la balle
      this.ball.speedY =
        (relativeIntersectY / (this.paddleHeight / 2)) * maxYSpeed;

      // Ajuster la position de la balle pour éviter qu'elle ne reste bloquée dans le paddle
      if (leftPaddleCollision) {
        this.ball.x = this.paddleWidth + this.ball.radius;
      } else {
        this.ball.x =
          this.canvasDimensions.width - this.paddleWidth - this.ball.radius;
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
      this.ball.speedX = lostLeftPaddle ? -10 : 10;
      this.ball.speedY = this.getRandomNumber(-5, 5);

      lostLeftPaddle ? (this.scores.left += 1) : (this.scores.right += 1);
    }
  }

  update(): GameState {
    this.updatePaddlePosition();
    this.updateBallPosition();

    // Vérifie si l'un des joueurs a atteint 10 points
    if (this.scores.left === 10 || this.scores.right === 10) {
      this.resetScores();
      return GameState.STOPPED;
    } else return GameState.INGAME;
  }
}
