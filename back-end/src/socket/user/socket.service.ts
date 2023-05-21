import { ISocketUser } from '@/socket/types/socket.types';
import { Injectable } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Socket } from 'socket.io';

@Injectable()
export class SocketUserService {
  private onlineUsers: ISocketUser[] = [];

  addUser(user: ISocketUser): void {
    this.onlineUsers.push(user);
  }

  removeUser(clientId: string): void {
    this.onlineUsers = this.onlineUsers.filter(
      (user) => user.clientId !== clientId,
    );
  }

  getOnlineUsersCount(): number {
    return this.onlineUsers.length;
  }

  getSocketUser(@ConnectedSocket() client: Socket): User | undefined {
    return client?.data?.user;
  }
}
