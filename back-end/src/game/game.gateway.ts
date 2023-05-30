import { GameService } from '@/game/game.service';
import { GameState } from '@/game/types/game.types';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class GameGateway {
  constructor(
    private readonly game: GameService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  state: GameState = GameState.WAITING;

  @WebSocketServer()
  server: Server;

  loop(): void {
    if (this.state === GameState.STOPPED) {
      this.state = GameState.WAITING;
      this.schedulerRegistry.deleteInterval('gameLoop');
      this.server.emit('stop');
    } else if (this.state === GameState.INGAME) {
      this.state = this.game.update();
      this.server.emit('gameState', {
        canvasDimensions: this.game.canvasDimensions,
        paddlePositions: this.game.paddlePositions,
        ball: this.game.ball,
        score: this.game.scores,
      });
    }
  }

  @SubscribeMessage('move')
  onMove(_client: Socket, data: { [key: string]: boolean }): void {
    Object.entries(data).forEach(([key, value]) => {
      this.game.keyStates[key] = value;
    });
  }

  @SubscribeMessage('start')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStart(_client: Socket): void {
    if (this.state === GameState.WAITING) {
      this.state = GameState.INGAME;
      this.server?.emit('ready');
      const interval = setInterval(() => this.loop(), 1000 / 120);
      this.schedulerRegistry.addInterval('gameLoop', interval);
    }
  }
}
