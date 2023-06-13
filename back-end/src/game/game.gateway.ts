import { GameService } from '@/game/game.service';
import { GameInfos, GameRoom, GameState, Role } from '@/game/types/game.types';
import { SocketUserService } from '@/socket/user/socket.service';
import { Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import e from 'express';
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
              Logger.error(e);
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
      console.log({
        ball: {
          x: game.ball.x,
          y: game.ball.y,
          radius: game.ball.radius,
        },
        player: {
          [Role.PLAYER1]: {
            fuseCount: game.player[Role.PLAYER1].fuse.count,
            score: game.playerOneScore,
          },
          [Role.PLAYER2]: {
            fuseCount: game.player[Role.PLAYER2].fuse.count,
            score: game.playerTwoScore,
          },
        },
      });
      this.server.to(String(game.id)).volatile.emit('gameState', {
        ball: {
          x: game.ball.x,
          y: game.ball.y,
          radius: game.ball.radius,
        },
        player: {
          [Role.PLAYER1]: {
            fuseCount: game.player[Role.PLAYER1].fuse.count,
            score: game.playerOneScore,
          },
          [Role.PLAYER2]: {
            fuseCount: game.player[Role.PLAYER2].fuse.count,
            score: game.playerTwoScore,
          },
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
    data: { paddleY: { [key: number]: number } },
  ): { paddleY: { [key: number]: number } } | void {
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
      gameRoom.game.player[Role.PLAYER1].paddle.update(
        data.paddleY[Role.PLAYER1],
      );
      gameRoom.game.player[Role.PLAYER2].paddle.update(
        data.paddleY[Role.PLAYER2],
      );
    } else if (user.id === gameRoom.game.playerOneId) {
      gameRoom.game.player[Role.PLAYER1].paddle.update(
        data.paddleY[Role.PLAYER1],
      );
    } else if (user.id === gameRoom.game.playerTwoId) {
      gameRoom.game.player[Role.PLAYER2].paddle.update(
        data.paddleY[Role.PLAYER2],
      );
    }

    return {
      paddleY: {
        [Role.PLAYER1]: gameRoom.game.player[Role.PLAYER1].paddle.y,
        [Role.PLAYER2]: gameRoom.game.player[Role.PLAYER2].paddle.y,
      },
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
