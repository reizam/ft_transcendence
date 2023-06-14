import { RoomService } from '@/game/room.service';
import { SocketUserService } from '@/socket/user/socket.service';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Game } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { GameGateway } from './game.gateway';
import { GameState, Player } from './types/game.types';

@WebSocketGateway()
export class RoomGateway {
  constructor(
    private roomService: RoomService,
    private socketUserService: SocketUserService,
    private gameGateway: GameGateway,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('findGame')
  async onFindGame(
    @ConnectedSocket() client: Socket,
  ): Promise<void | WsResponse<string | Player[]>> {
    this.roomService.addToPlayerQueue(client);
    const res = await this.roomService.findMatch(client);
    if (!res) return;
    if (res?.error) return { event: 'findError', data: res.error };
    if (res?.players) {
      const gameId = await this.roomService.getOrCreateGame(
        res.players[0].id,
        res.players[1].id,
      );

      if (!gameId) return { event: 'findError', data: 'Game creation error' };

      this.server
        .timeout(10000)
        .to(res.players[0].socketId)
        .to(res.players[1].socketId)
        .volatile.emit('foundGame', (err: unknown, _resp: string) => {
          if (err) {
            this.server
              .to(res.players![0].socketId)
              .to(res.players![1].socketId)
              .volatile.emit(
                'joinTimeout',
                "Your opponent is taking a shit. Let's find someone else",
              );
            this.roomService.deleteGame(gameId);
          } else {
            this.server
              .to(res.players![0].socketId)
              .to(res.players![1].socketId)
              .volatile.emit('joinGame', gameId);
          }
        });
    }
    return;
  }

  @SubscribeMessage('stopFindGame')
  onStopFindGame(@ConnectedSocket() client: Socket): void {
    console.log('Stoooooooooooooooooooooooooooooooooooop');
    this.roomService.removeFromPlayerQueue(client);
  }

  @SubscribeMessage('joinGame')
  async onJoinGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameId: number,
  ): Promise<{ asPlayer: boolean; gameStarted: boolean } | WsResponse<string>> {
    // TODO:
    // Check if game exists, otherwise gameError
    // Add client to room
    // Check if player (if so return true to isPlayer)
    // When two players are in game, start timer
    // When leave before game start, delete game ? Or button to leave ? Or prompt confirm ?
    // If game left by a player, count him as loser and X as score (-1 in DB)
    // When game over, update DB and check achievements
    // When all have left room, delete game if hasn't started ?

    // Also:
    // Deal with 'join-room' and 'leave-room' in case of disconnect/reconnect
    // in the middle of a game ? Or through the front useEffect?

    console.log({ gameId });
    const user = this.socketUserService.getSocketUser(client);
    const gameInDB = await this.roomService.getGame(gameId);
    let gameRoom = this.roomService.getRoom(gameId);

    if (!user) return { event: 'gameError', data: 'User not found' };
    if (!gameInDB)
      return { event: 'gameError', data: "This game doesn't exist" };
    if (
      gameRoom?.game.status === GameState.STOPPED ||
      gameInDB.status === GameState.STOPPED
    )
      return { event: 'gameError', data: 'This game is finished' };

    gameRoom = this.roomService.joinRoom(client, user.id, gameInDB, false);
    if (!gameRoom)
      return { event: 'gameError', data: "This room doesn't exist" };

    let gameStarted = false;
    if (this.roomService.playersReady(gameRoom)) {
      if (gameRoom.game.status === GameState.WAITING) {
        this.gameGateway.startGame(gameRoom.game);
      } else {
        gameStarted = true;
      }
    }
    // TODO:
    // Send something else if game has started in order to let the
    // spectators join and mount the right countdown or directly the game
    if (user.id === gameInDB.playerOneId || user.id === gameInDB.playerTwoId)
      return { asPlayer: true, gameStarted };
    return { asPlayer: false, gameStarted };
  }

  @SubscribeMessage('joinLocalGame')
  async onJoinLocalGame(
    @ConnectedSocket() client: Socket,
  ): Promise<number | WsResponse<string>> {
    // TODO:
    // Create UUID for local game
    // Add client to room
    // Check if player (if so return true to isPlayer)
    // When leave before game start, delete game ? Or button to leave ? Or prompt confirm ?
    // When all have left room, delete game if hasn't started ?
    // Also:
    // Deal with 'join-room' and 'leave-room' in case of disconnect/reconnect
    // in the middle of a game ? Or through the front useEffect?

    const user = this.socketUserService.getSocketUser(client);

    if (!user) return { event: 'gameError', data: 'User not found' };

    const gameId = await this.roomService.createUniqueGameId();
    const game: Game = {
      id: gameId,
      playerOneId: user.id,
      playerOneScore: 0,
      playerTwoId: user.id,
      playerTwoScore: 0,
      createdAt: new Date(),
      launchedAt: null,
      finishedAt: null,
      status: GameState.WAITING,
    };
    const gameRoom = this.roomService.joinRoom(client, user.id, game, true);

    if (!gameRoom)
      return { event: 'gameError', data: "This room doesn't exist" };
    if (gameRoom.game.status === GameState.WAITING) {
      this.gameGateway.startGame(gameRoom.game);
    }
    return gameId;
  }

  // TODO:
  // Add an interval to clear the dangling inactive rooms that have
  // not already been deleted

  @SubscribeMessage('leaveGame')
  async onLeaveGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameId: number,
  ): Promise<void> {
    console.log(gameId);
    const user = this.socketUserService.getSocketUser(client);
    const gameInDB = await this.roomService.getGame(gameId);

    if (!user) return;
    if (!gameInDB) {
      const localGame = this.roomService.leaveRoom(client, user.id, gameId);

      if (localGame) {
        localGame.game.status = GameState.STOPPED;
      }
      return;
    }

    const gameRoom = this.roomService.leaveRoom(client, user.id, gameId);

    if (
      gameRoom &&
      (user.id === gameInDB.playerOneId || user.id === gameInDB.playerTwoId)
    ) {
      const userId = user.id;
      const player: string =
        user.id === gameInDB.playerOneId ? 'Player one' : 'Player two';

      setTimeout(() => {
        if (gameRoom?.game && this.roomService.hasLeftGame(gameRoom, userId)) {
          this.server.to(String(gameId)).volatile.emit('playerHasLeft', player);
          if (userId === gameRoom.game.playerOneId) {
            gameRoom.game.playerOneScore = -1;
          } else {
            gameRoom.game.playerTwoScore = -1;
          }
          gameRoom.game.status = GameState.STOPPED;
        }
      }, 2000);
    }
  }
}
