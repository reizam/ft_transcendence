import { Player } from '@/game/types/game.type';
import { PrismaService } from '@/prisma/prisma.service';
import { SocketUserService } from '@/socket/user/socket.service';
import { Injectable } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { Mutex } from 'async-mutex';
import { Socket } from 'socket.io';

@Injectable()
export class RoomService {
  constructor(
    private prisma: PrismaService,
    private socketUserService: SocketUserService,
  ) {}

  private playerQueue: Player[] = [];
  private mutex = new Mutex();

  async joinGame(@ConnectedSocket() client: Socket): Promise<void | string> {
    const user = this.socketUserService.getSocketUser(client);

    // if no user, return error message as acknowledgement or emit error?
    if (1) return 'Error in interval';
    if (!user) return 'Unable to load user infos';

    if (!this.playerQueue.find((player) => player.id === user.id)) {
      const release = await this.mutex.acquire();

      this.playerQueue.push({
        id: user.id,
        socketId: client.id,
        elo: user.elo,
        searchGameSince: Date.now(),
      });
      this.playerQueue.push({
        id: user.id + 1,
        socketId: client.id + '_2',
        elo: user.elo - 50,
        searchGameSince: Date.now() - 5000,
      });
      this.playerQueue.push({
        id: user.id + 2,
        socketId: client.id + '_3',
        elo: user.elo + 80,
        searchGameSince: Date.now() + 1000,
      });
      this.playerQueue.sort((a, b) => a.elo - b.elo);
      release();
    }

    console.log(this.playerQueue);

    return new Promise<void | string>((resolve) => {
      const findMatchingPlayer = async (): Promise<void> => {
        const release = await this.mutex.acquire();
        const resolveMatchingPlayers = (
          playerOneSocketId: string,
          playerTwoSocketId: string,
        ) => {
          //
          console.log(playerOneSocketId);
          console.log(playerTwoSocketId);
          resolve();
        };

        try {
          const userIndex = this.playerQueue.findIndex(
            (player) => player.id === user.id,
          );
          const user_: Player = this.playerQueue[userIndex];
          const userBelow: Player = this.playerQueue[userIndex - 1];
          const userAbove: Player = this.playerQueue[userIndex + 1];
          const userBelowEloDiff: number =
            userBelow && user_ ? userBelow.elo - user_.elo : 1000000000;
          const userAboveEloDiff: number =
            userAbove && user_ ? user_.elo - userAbove.elo : 1000000000;
          const userBelowMsDiff: number =
            userBelow && user_
              ? Math.abs(userBelow.searchGameSince - user_.searchGameSince)
              : -1;
          const userAboveMsDiff: number =
            userAbove && user_
              ? Math.abs(userAbove.searchGameSince - user_.searchGameSince)
              : -1;

          if (userIndex === -1) return resolve();
          if (!userBelow && !userAbove) {
            setTimeout(findMatchingPlayer, 3000);
            return resolve();
          }
          if (userBelow && !userAbove) {
            if (userBelowEloDiff <= 100 || userBelowMsDiff > 60000)
              return resolveMatchingPlayers(user_.socketId, userBelow.socketId);
          }
          if (!userBelow && userAbove) {
            if (userAboveEloDiff <= 100 || userAboveMsDiff > 60000)
              return resolveMatchingPlayers(user_.socketId, userAbove.socketId);
          }
          if (userBelowEloDiff <= 100 || userAboveEloDiff <= 100) {
            return resolveMatchingPlayers(
              user_.socketId,
              userBelowEloDiff < userAboveEloDiff
                ? userBelow.socketId
                : userAbove.socketId,
            );
          }
          if (userBelowMsDiff > 60000 || userAboveMsDiff > 60000) {
            return resolveMatchingPlayers(
              user_.socketId,
              userBelowMsDiff > userAboveMsDiff
                ? userBelow.socketId
                : userAbove.socketId,
            );
          } else {
            setTimeout(findMatchingPlayer, 3000);
          }
        } finally {
          release();
        }
      };

      findMatchingPlayer();
    });

    // Check in the queue every 3 seconds if there is a match:
    // players are sorted by elo rating
    // compare the first better with the first worst
    // if only one ± 100 points, select it
    // if two at ± 100 points, select the longest waiting one
    // (or the best one if added at same time)
    // if none in ± 100 points, select the closest once it has
    // been waiting more than 1 minute
  }

  // async createGame(userId: number): Promise<number> {
  //   const game = await this.prisma.game.create({
  //     data: {
  //       status: 'waiting',
  //       playerOneId: userId,
  //       players: {
  //         connect: [{ id: userId }],
  //       },
  //     },
  //   });
  //   return game.id;
  // }

  // async joinGame(gameId: number, playerTwoId: number): Promise<void> {
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
