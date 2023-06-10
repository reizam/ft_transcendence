import { GameService } from '@/game/game.service';
import { GameInfos, GameRoom, GameState } from '@/game/types/game.types';
import { SocketUserService } from '@/socket/user/socket.service';
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

  async loop(game: GameInfos): Promise<void> {
    if (game.status === GameState.STOPPED) {
      this.schedulerRegistry.deleteInterval(`${game.id}`);
      game.finishedAt = new Date();
      this.server.emit('endGame');
      void this.roomService.getGame(game.id).then((res) => {
        if (res) {
          this.roomService
            .recordGame(game)
            .catch((_e: unknown) => {
              this.server
                .to(String(game.id))
                .volatile.emit('gameError', 'The game could not be saved');
            })
            .finally(() => {
              setTimeout(() => this.roomService.deleteRoom(game.id), 2000);
            });
        } else {
          this.roomService.deleteRoom(game.id);
        }
      });
    } else if (game.status === GameState.INGAME) {
      game.status = this.gameService.update(game);
      this.server.to(String(game.id)).volatile.emit('gameState', {
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

  // TODO [low priority]: paddle position value correction
  @SubscribeMessage('move')
  onMove(
    @ConnectedSocket() client: Socket,
    @MessageBody('gameId') gameId: number,
    @MessageBody('data')
    data: { paddleY: { left: number; right: number } },
  ): { left: number; right: number } | void {
    const user = this.socketUserService.getSocketUser(client);
    const gameRoom: GameRoom | undefined = this.roomService.getRoom(gameId);

    if (
      !user ||
      !gameRoom ||
      (!gameRoom.isLocal &&
        user.id !== gameRoom.game.playerOneId &&
        user.id !== gameRoom.game.playerTwoId)
    )
      return;
    if (gameRoom.isLocal) {
      gameRoom.game.paddles.left.update(data.paddleY.left);
      gameRoom.game.paddles.right.update(data.paddleY.right);
    } else if (user.id === gameRoom.game.playerOneId) {
      gameRoom.game.paddles.left.update(data.paddleY.left);
    } else if (user.id === gameRoom.game.playerTwoId) {
      gameRoom.game.paddles.right.update(data.paddleY.left);
    }
    return {
      left: gameRoom.game.paddles.left.y,
      right: gameRoom.game.paddles.right.y,
    };
  }

  startGame(game: GameInfos): void {
    game.status = GameState.INGAME;
    setTimeout(() => {
      this.server.to(String(game.id)).emit('startCountdown');
    }, 100);
    setTimeout(() => {
      const interval = setInterval(() => this.loop(game), 1000 / 120);

      game.launchedAt = new Date();
      this.server.to(String(game.id)).emit('startGame');
      this.schedulerRegistry.addInterval(`${game.id}`, interval);
    }, 11000);
  }
}
