import {
  Ball,
  IFindGame,
  Paddle,
  Player,
  GameRoom,
} from '@/game/types/game.types';
import { PrismaService } from '@/prisma/prisma.service';
import { SocketUserService } from '@/socket/user/socket.service';
import { Injectable } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { Game } from '@prisma/client';
import { Mutex } from 'async-mutex';
import { Socket } from 'socket.io';

@Injectable()
export class RoomService {
  constructor(
    private prisma: PrismaService,
    private socketUserService: SocketUserService,
  ) {}

  private playerQueue: Player[] = [];
  // private mutex = new Mutex();
  private rooms: { [id: number]: GameRoom } = {};

  async getGame(gameId: number): Promise<Game | null> {
    return await this.prisma.game.findUnique({
      where: {
        id: gameId,
      },
    });
  }

  async getOrCreateGame(
    playerOneId: number,
    playerTwoId: number,
  ): Promise<number | null> {
    try {
      const existingGame = await this.prisma.game.findFirst({
        where: {
          OR: [
            { playerOneId: playerOneId, playerTwoId: playerTwoId },
            { playerOneId: playerTwoId, playerTwoId: playerOneId },
          ],
          status: {
            equals: 'waiting',
            mode: 'insensitive',
          },
        },
      });

      if (existingGame) {
        return existingGame.id;
      }

      const game = await this.prisma.game.create({
        data: {
          status: 'waiting',
          playerOneId: playerOneId,
          playerTwoId: playerTwoId,
          players: {
            connect: [{ id: playerOneId }, { id: playerTwoId }],
          },
        },
      });

      return game.id;
    } catch (e: unknown) {
      console.error(e);
      return null;
    }
  }

  async deleteGame(gameId: number): Promise<void> {
    try {
      const _deletedGame = await this.prisma.game.delete({
        where: {
          id: gameId,
        },
      });
      console.log({ _deletedGame });
    } catch (e: unknown) {
      console.error(e);
    }
  }

  async createUniqueGameId(): Promise<number> {
    const generateUniqueId = (): number => {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000) + 1;
      let uniqueId = Math.floor(timestamp / random);

      while (uniqueId.toString.length > 9) uniqueId /= 10;
      return uniqueId;
    };
    let gameId = generateUniqueId();
    while ((await this.getGame(gameId)) != null) {
      gameId = generateUniqueId();
    }
    console.log({ gameId });
    return gameId;
  }

  removeFromPlayerQueue(@ConnectedSocket() client: Socket): void {
    const user = this.socketUserService.getSocketUser(client);

    if (!user) return;

    // const release = await RoomService.mutex.acquire();
    const clientIndex = this.playerQueue.findIndex(
      (player) => player.id === user.id,
    );

    if (clientIndex != -1) {
      this.playerQueue.splice(clientIndex, 1);
    }
    // console.log(this.playerQueue);
    // release();
  }

  addToPlayerQueue(@ConnectedSocket() client: Socket): void {
    const user = this.socketUserService.getSocketUser(client);

    if (!user) return;
    if (!this.playerQueue.find((player) => player.id === user.id)) {
      // const release = await RoomService.mutex.acquire();
      this.playerQueue.push({
        id: user.id,
        socketId: client.id,
        elo: user.elo,
        searchGameSince: Date.now(),
      });
      if (this.playerQueue.length < 3) {
        this.playerQueue.push({
          id: user.id + 1,
          socketId: client.id, //+ '_2',
          elo: user.elo - 50,
          searchGameSince: Date.now() - 5000,
        });
        this.playerQueue.push({
          id: user.id + 2,
          socketId: client.id, //+ '_3',
          elo: user.elo + 80,
          searchGameSince: Date.now() + 1000,
        });
      }
      this.playerQueue.sort((a, b) => a.elo - b.elo);
      // release();
    }
  }

  async findMatch(
    @ConnectedSocket() client: Socket,
  ): Promise<void | IFindGame> {
    const user = this.socketUserService.getSocketUser(client);

    if (!user) return { error: 'Unable to load user infos' };

    console.log(this.playerQueue);

    return new Promise<void | IFindGame>((resolve) => {
      const findMatchingPlayer = async (): Promise<void> => {
        // const release = await RoomService.mutex.acquire();
        const resolveMatchingPlayers = (
          playerOne: Player,
          playerOneIndex: number,
          playerTwo: Player,
          playerTwoIndex: number,
        ) => {
          this.playerQueue.splice(Math.min(playerOneIndex, playerTwoIndex), 2);
          this.playerQueue.splice(0, 1);
          console.log({ playerOne });
          console.log({ playerTwo });
          return resolve({ players: [playerOne, playerTwo] });
        };

        try {
          const userIndex = this.playerQueue.findIndex(
            (player) => player.id === user.id,
          );
          const user_: Player = this.playerQueue[userIndex];
          const userBelow: Player = this.playerQueue[userIndex - 1];
          const userAbove: Player = this.playerQueue[userIndex + 1];
          const userBelowEloDiff: number =
            userBelow && user_ ? user_.elo - userBelow.elo : 1000000000;
          const userAboveEloDiff: number =
            userAbove && user_ ? userAbove.elo - user_.elo : 1000000000;
          const userBelowMsWait: number =
            userBelow && user_
              ? Math.abs(Date.now() - userBelow.searchGameSince)
              : -1;
          const userAboveMsWait: number =
            userAbove && user_
              ? Math.abs(Date.now() - userAbove.searchGameSince)
              : -1;
          const maxMsWait = 15000;

          if (userIndex === -1) return resolve();
          if (!userBelow && !userAbove) {
            setTimeout(findMatchingPlayer, 3000);
            return;
          }
          if (userBelow && !userAbove) {
            if (userBelowEloDiff <= 100 || userBelowMsWait > maxMsWait)
              return resolveMatchingPlayers(
                user_,
                userIndex,
                userBelow,
                userIndex - 1,
              );
          }
          if (!userBelow && userAbove) {
            if (userAboveEloDiff <= 100 || userAboveMsWait > maxMsWait)
              return resolveMatchingPlayers(
                user_,
                userIndex,
                userAbove,
                userIndex + 1,
              );
          }
          if (userBelowEloDiff <= 100 || userAboveEloDiff <= 100) {
            return resolveMatchingPlayers(
              user_,
              userIndex,
              userBelowEloDiff < userAboveEloDiff ? userBelow : userAbove,
              userBelowEloDiff < userAboveEloDiff
                ? userIndex - 1
                : userIndex + 1,
            );
          }
          if (userBelowMsWait > maxMsWait || userAboveMsWait > maxMsWait) {
            return resolveMatchingPlayers(
              user_,
              userIndex,
              userBelowMsWait > userAboveMsWait ? userBelow : userAbove,
              userBelowMsWait > userAboveMsWait ? userIndex - 1 : userIndex + 1,
            );
          } else {
            setTimeout(findMatchingPlayer, 3000);
            return;
          }
        } finally {
          // if (RoomService.mutex.isLocked()) release();
        }
      };

      findMatchingPlayer();
    });
  }

  joinRoom(
    @ConnectedSocket() client: Socket,
    userId: number,
    game: Game,
  ): void {
    const room: GameRoom | undefined = this.rooms[game.id];

    client.join(String(game.id));
    if (!room) {
      this.rooms[game.id] = {
        game: {
          ...game,
          ball: new Ball(),
          paddles: { left: new Paddle('left'), right: new Paddle('right') },
          keyState: { w: false, s: false, ArrowUp: false, ArrowDown: false },
        },
        userIds: [userId],
      };
      this.rooms[game.id].game.paddles.left.reset();
      this.rooms[game.id].game.paddles.right.reset();
    } else if (room.userIds.findIndex((id) => id === userId) == -1)
      room.userIds.push(userId);
    console.log(this.rooms);
  }

  playersReady(game: Game): boolean {
    const room: GameRoom | undefined = this.rooms[game.id];

    if (
      room?.userIds.findIndex((id) => game.playerOneId === id) !== -1 || //&&
      room?.userIds.findIndex((id) => game.playerTwoId === id) !== -1
    )
      return true;
    return false;
  }

  getRoom(gameId: number): GameRoom | undefined {
    return this.rooms[gameId];
  }

  leaveRoom(
    @ConnectedSocket() client: Socket,
    userId: number,
    gameId: number,
  ): void {
    // TODO:
    // Update DB before deleting GameRoom ?

    const room: GameRoom | undefined = this.rooms[gameId];

    client.leave(String(gameId));
    if (room) {
      const i = room.userIds.findIndex((id) => id === userId);
      if (i != -1) room.userIds.splice(i, 1);
    }
    if (room?.userIds?.length === 0) delete this.rooms[gameId];
    console.log(this.rooms);
  }

  leaveGame(game: Game, userId: number): void {
    //
  }

  // async launchGame({ gameId, playerTwoId }: LaunchGame): Promise<void> {
  //   await this.prisma.game.update({
  //     where: {
  //       id: gameId,
  //     },
  //     data: {
  //       playerTwoId: playerTwoId,
  //       launchedAt: new Date().toISOString(),
  //       players: {
  //         connect: [{ id: playerTwoId }],
  //       },
  //     },
  //   });
  // }
}
