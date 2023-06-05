import { GameService } from '@/game/game.service';
import { GameInfos, GameRoom, GameState } from '@/game/types/game.types';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';
import { SocketUserService } from '@/socket/user/socket.service';

@WebSocketGateway()
export class GameGateway {
  constructor(
    private readonly gameService: GameService,
    private schedulerRegistry: SchedulerRegistry,
    private roomService: RoomService,
    private socketUserService: SocketUserService,
  ) {}

  @WebSocketServer()
  server: Server;

  loop(game: GameInfos): void {
    if (game.status === GameState.STOPPED) {
      this.schedulerRegistry.deleteInterval('gameLoop');
      game.finishedAt = new Date();
      this.server.emit('endGame');
      this.roomService.getGame(game.id).then((res) => {
        if (res) {
          this.roomService
            .recordGame(game)
            .catch((_e: unknown) => {
              this.server
                .to(String(game.id))
                .volatile.emit('gameError', 'The game could not be saved');
            })
            .finally(() => {
              setTimeout(() => this.roomService.deleteRoom(game.id), 2500);
            });
        } else {
          this.roomService.deleteRoom(game.id);
        }
      });
    } else if (game.status === GameState.INGAME) {
      game.status = this.gameService.update(game);
      this.server.to(String(game.id)).volatile.emit('gameState', {
        paddles: {
          left: game.paddles.left.y,
          right: game.paddles.right.y,
        },
        ball: {
          x: game.ball.x,
          y: game.ball.y,
          radius: game.ball.radius,
        },
        score: {
          left: game.playerOneScore,
          right: game.playerTwoScore,
        },
      });
    }
  }

  @SubscribeMessage('move')
  onMove(
    @ConnectedSocket() client: Socket,
    @MessageBody('gameId') gameId: number,
    @MessageBody('data') data: { [key: string]: boolean },
  ): void {
    const user = this.socketUserService.getSocketUser(client);
    const gameRoom: GameRoom | undefined = this.roomService.getRoom(gameId);

    if (!user || !gameRoom) return;
    if (
      user.id !== gameRoom.game.playerOneId &&
      user.id !== gameRoom.game.playerTwoId
    )
      return;
    Object.entries(data).forEach(([key, value]) => {
      gameRoom.game.keyState[key] = value;
    });
  }

  startGame(game: GameInfos): void {
    // TODO:
    // Give the scheduler a unique ID related to the gameId ?
    // Or no need if the interval is a unique value ?

    game.status = GameState.INGAME;
    setTimeout(() => {
      this.server.to(String(game.id)).emit('startCountdown');
    }, 100);
    setTimeout(() => {
      const interval = setInterval(() => this.loop(game), 1000 / 120);

      game.launchedAt = new Date();
      this.server.to(String(game.id)).emit('startGame');
      this.schedulerRegistry.addInterval('gameLoop', interval);
    }, 11000);
  }
}
