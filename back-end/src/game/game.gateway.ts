import { GameService } from '@/game/game.service';
import { GameState } from '@/game/types/game.types';
import { Interval } from '@nestjs/schedule';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class GameGateway {
  constructor(private readonly game: GameService) {}

  @WebSocketServer()
  server: Server;

  @Interval(1000 / 60)
  loop(): void {
    if (this.game.state === GameState.STOPPED) {
      this.game.state = GameState.WAITING;
      this.server.emit('stop');
    }
    if (this.game.state === GameState.INGAME) {
      this.game.update();
      this.server.emit('gameState', {
        paddlePositions: this.game.paddlePositions,
        ball: this.game.ball,
      });
    }
  }

  @SubscribeMessage('keyDown')
  onKeyDown(client: Socket, key: string): void {
    this.game.keyStates[key] = true;
  }

  @SubscribeMessage('keyUp')
  onKeyUp(client: Socket, key: string): void {
    this.game.keyStates[key] = false;
  }

  @SubscribeMessage('dimensions')
  update(client: Socket, dimensions: any): void {
    // Écoutez les messages du client pour obtenir les dimensions de la div
    this.game.canvasDimensions.width = dimensions.width;
    this.game.canvasDimensions.height = dimensions.height;

    // Mettre à jour le positionnement de la balle
    this.game.ball.x = this.game.canvasDimensions.width / 2;
    this.game.ball.y = this.game.canvasDimensions.height / 2;

    // Mettre à jour le posionnement des paddles
    this.game.paddlePositions.left =
      (this.game.canvasDimensions.height -
        this.game.canvasDimensions.height * this.game.paddleHeight) /
      2;
    this.game.paddlePositions.right =
      (this.game.canvasDimensions.height -
        this.game.canvasDimensions.height * this.game.paddleHeight) /
      2;
  }

  @SubscribeMessage('start')
  createLocalGame(client: Socket): void {
    this.game.state = GameState.INGAME;
    this.server?.emit('ready');
  }
}
