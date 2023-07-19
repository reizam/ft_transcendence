import { PrismaService } from '@/prisma/prisma.service';
import { ISocketUser } from '@/socket/types/socket.types';
import { Status } from '@/user/types/user.types';
import { Injectable } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Socket } from 'socket.io';

@Injectable()
export class SocketUserService {
  constructor(private prisma: PrismaService) {}

  private onlineUsers: ISocketUser[] = [];

  async addUser(user: ISocketUser): Promise<void> {
    this.onlineUsers.push(user);

    const game = await this.prisma.game.findFirst({
      where: {
        players: {
          some: {
            id: user.id,
          },
        },
        status: {
          in: ['WAITING', 'playing'],
          mode: 'insensitive',
        },
      },
    });
    const status = game ? Status.IN_GAME : Status.ONLINE;

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        status,
      },
    });
  }

  async removeUser(clientId: string): Promise<void> {
    const removedUserIndex = this.onlineUsers.findIndex(
      (user) => user.clientId === clientId,
    );

    if (removedUserIndex < 0) return;

    const removedUser = this.onlineUsers.splice(removedUserIndex, 1);

    if (removedUser.length < 1) return;

    await this.prisma.user.update({
      where: {
        id: removedUser[0].id,
      },
      data: {
        status: Status.OFFLINE,
      },
    });
  }

  getOnlineUsers(): ISocketUser[] {
    return this.onlineUsers;
  }

  getOnlineUsersCount(): number {
    return this.onlineUsers.length;
  }

  getSocketUser(@ConnectedSocket() client: Socket): User | undefined {
    return client?.data?.user;
  }
}
