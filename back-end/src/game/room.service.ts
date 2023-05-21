import { MatchResult, Player } from '@/game/types/game.type';
import { PrismaService } from '@/prisma/prisma.service';
import { SocketUserService } from '@/socket/user/socket.service';
import { Injectable } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class RoomService {
  constructor(
    private prisma: PrismaService,
    private socketUserService: SocketUserService,
  ) {}

  playerQueue: Player[] = [];

  async joinGame(@ConnectedSocket() client: Socket): Promise<void | string> {
    const user = this.socketUserService.getSocketUser(client);

    // if no user, return error message as acknowledgement or emit error?
    if (!user) return 'Unable to load user infos';

    if (!this.playerQueue.find((player) => player.id === user.id)) {
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
    }

    console.log(this.playerQueue);

    return new Promise<void | string>((resolve) => {
      const findMatchingPlayer = (): void => {
        const userIndex = this.playerQueue.findIndex(
          (player) => player.id === user.id,
        );
        const userBelow = this.playerQueue[userIndex - 1];
        const userAbove = this.playerQueue[userIndex + 1];

        console.log('test');
        if (1) {
          resolve();
          resolve('Error in interval');
        } else {
          setTimeout(findMatchingPlayer, 3000);
        }
      };

      findMatchingPlayer();
    });
    // return new Promise((resolve) => {
    //   const interval = setInterval(() => {
    //     const userIndex = this.playerQueue.findIndex(
    //       (player) => player.id === user.id,
    //     );
    //     const userBelow = this.playerQueue[userIndex - 1];
    //     const userAbove = this.playerQueue[userIndex + 1];

    //     clearInterval(interval);
    //     console.log('test');
    //     resolve();
    //     resolve('Error in interval');
    //   }, 3000);
    // });

    // const arr: number[] = [0, 1];
    // console.log(arr[-1]);
    // console.log(arr[1]);
    // console.log(arr[2]);

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
