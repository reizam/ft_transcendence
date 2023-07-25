import { GameService } from '@/game/game.service';
import { GameInfos, GameRoom, GameState } from '@/game/types/game.types';
import { SocketUserService } from '@/socket/user/socket.service';
import { Status } from '@/user/types/user.types';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { User } from '@prisma/client';
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
      await this.gameService.updateUserStatus(game.playerOneId);
      await this.gameService.updateUserStatus(game.playerTwoId);

      const winnerId =
        game.playerOneScore > game.playerTwoScore
          ? game.playerOneId
          : game.playerTwoId;
      const loserId =
        game.playerOneScore < game.playerTwoScore
          ? game.playerOneId
          : game.playerTwoId;
      const playersInfos: { winner: User; loser: User } =
        await this.roomService.getPlayerStats(winnerId, loserId);

      this.server.to(String(game.id)).emit('endGame', {
        id: winnerId,
        username: playersInfos.winner.username,
        profilePicture: playersInfos.winner.profilePicture,
      });
      void this.roomService.getGame(game.id).then((res) => {
        if (res) {
          this.roomService
            .recordGame(game)
            .catch(() => {
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
      this.server.to(String(game.id)).volatile.emit(
        'gameState',
        {
          ball: {
            x: game.ball.x,
            y: game.ball.y,
            radius: game.ball.radius,
          },
          score: {
            left: game.playerOneScore,
            right: game.playerTwoScore,
          },
        },
        {
          left: game.paddles.left.y,
          right: game.paddles.right.y,
        },
      );
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
      gameRoom.game.paddles.right.update(data.paddleY.right);
    }

    return {
      left: gameRoom.game.paddles.left.y,
      right: gameRoom.game.paddles.right.y,
    };
  }

  async startGame(game: GameInfos, isLocal = false): Promise<void> {
    game.status = GameState.INGAME;
    game.launchedAt = new Date();
    if (!isLocal) {
      await this.gameService.updateGameStatus(game.id, GameState.INGAME);
      await this.gameService.updateUserStatus(game.playerOneId, Status.IN_GAME);
      await this.gameService.updateUserStatus(game.playerTwoId, Status.IN_GAME);
    }
    setTimeout(() => {
      this.server.to(String(game.id)).emit('startCountdown');
    }, 100);
    setTimeout(() => {
      const interval = setInterval(() => this.loop(game), 1000 / 120);

      this.server.to(String(game.id)).emit('startGame');
      this.schedulerRegistry.addInterval(`${game.id}`, interval);
    }, 6000);
  }
}
