import { PrismaService } from '@/prisma/prisma.service';
import { ISocketUser } from '@/socket/types/socket.types';
import { Status } from '@/user/types/user.types';
import { Injectable } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { Game, User } from '@prisma/client';
import { Socket } from 'socket.io';

@Injectable()
export class SocketUserService {
  constructor(private prisma: PrismaService) {}

  private onlineUsers: ISocketUser[] = [];

  addUser(user: ISocketUser): void {
    this.onlineUsers.push(user);
    this.prisma.game
      .findFirst({
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
      })
      .then((game: Game | null) => {
        const status = !!game ? Status.IN_GAME : Status.ONLINE;
        this.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            status,
          },
        });
      });
  }

  removeUser(clientId: string): void {
    this.onlineUsers = this.onlineUsers.filter((user) => {
      if (user.clientId !== clientId) {
        return true;
      } else {
        this.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            status: Status.OFFLINE,
          },
        });
        return false;
      }
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
