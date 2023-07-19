import { Injectable } from '@nestjs/common';
import { Status } from '@/user/types/user.types';
import { PrismaService } from '@/prisma/prisma.service';
import { SocketUserService } from '@/socket/user/socket.service';
import { ISocketUser } from '@/socket/types/socket.types';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private socketUserService: SocketUserService,
  ) {}

  async getInGameIds(): Promise<number[]> {
    const games = await this.prisma.game.findMany({
      where: {
        status: {
          in: ['WAITING', 'playing'],
          mode: 'insensitive',
        },
      },
      select: {
        playerOneId: true,
        playerTwoId: true,
      },
    });

    const playerIds = games.flatMap((game) => [
      game.playerOneId,
      game.playerTwoId,
    ]);
    return playerIds;
  }

  getOnlineIds(): number[] {
    const onlineUsers: ISocketUser[] = this.socketUserService.getOnlineUsers();
    const onlineIds: number[] = onlineUsers?.map((onlineUser) => onlineUser.id);
    return onlineIds;
  }

  getUserStatus(
    userId: number,
    inGameIds: number[],
    onlineIds: number[],
  ): Status {
    let status = Status.OFFLINE;

    if (inGameIds.includes(userId)) status = Status.IN_GAME;
    else if (onlineIds.includes(userId)) status = Status.ONLINE;
    return status;
  }
}
