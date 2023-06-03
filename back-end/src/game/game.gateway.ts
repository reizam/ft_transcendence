import { GameService } from '@/game/game.service';
import { GameInfos, GameRoom, GameState } from '@/game/types/game.types';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
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

  state: GameState = GameState.WAITING;

  @WebSocketServer()
  server: Server;

  loop(game: GameInfos): void {
    if (game.status === GameState.STOPPED) {
      this.schedulerRegistry.deleteInterval('gameLoop');
      this.server.emit('stopGame');
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

  // @SubscribeMessage('startGame')
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // onStartGame(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() gameId: number,
  // ): void | WsResponse<string> {
  //   // TODO:
  //   // Give the scheduler a unique ID related to the gameId ?
  //   // Or no need if the interval is a unique value ?

  //   const user = this.socketUserService.getSocketUser(client);
  //   const gameRoom: GameRoom | undefined = this.roomService.getRoom(gameId);

  //   if (!user) return { event: 'gameError', data: 'User not found' };
  //   if (!gameRoom)
  //     return { event: 'gameError', data: "This game doesn't exist" };
  //   if (gameRoom.game.playerOneId != 0 && gameRoom.game.playerTwoId != 0) {
  //     setTimeout(() => {
  //       if (gameRoom.game.status === GameState.WAITING)
  //         this.server.to(String(gameId)).emit('startCountdown');
  //     }, 1500);
  //     setTimeout(() => {
  //       if (gameRoom.game.status === GameState.WAITING) {
  //         gameRoom.game.launchedAt = new Date();
  //         gameRoom.game.status = GameState.INGAME;
  //         const interval = setInterval(
  //           () => this.loop(gameRoom.game),
  //           1000 / 120,
  //         );
  //         this.schedulerRegistry.addInterval('gameLoop', interval);
  //       }
  //     }, 12500);
  //   }
  // }

  startGame(game: GameInfos): void {
    // TODO:
    // Give the scheduler a unique ID related to the gameId ?
    // Or no need if the interval is a unique value ?
    // Send gameStarted to players to make sure they see the game
    // and not the countdown if they did not started it yet
    // Stop the interval when the game is stopped,
    // even if not finished (e.g. a player left)

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
