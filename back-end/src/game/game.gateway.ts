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

  state: GameState = GameState.WAITING;

  @WebSocketServer()
  server: Server;

  @Interval(1000 / 60)
  loop(): void {
    console.log(this.game);
    if (this.state === GameState.STOPPED) {
      this.state = GameState.WAITING;
      this.server.emit('stop');
    } else if (this.state === GameState.INGAME) {
      this.state = this.game.update();
      this.server.emit('gameState', {
        canvasDimensions: this.game.canvasDimensions,
        paddlePositions: this.game.paddlePositions,
        ball: this.game.ball,
      });
    }
  }

  @SubscribeMessage('keyDown')
  onKeyDown(_client: Socket, key: string): void {
    this.game.keyStates[key] = true;
  }

  @SubscribeMessage('keyUp')
  onKeyUp(_client: Socket, key: string): void {
    this.game.keyStates[key] = false;
  }

  @SubscribeMessage('start')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStart(_client: Socket): void {
    if (this.state === GameState.WAITING) {
      this.state = GameState.INGAME;
      this.server?.emit('ready');
    }
  }
}
