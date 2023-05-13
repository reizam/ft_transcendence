import { ISocketUser } from '@/socket/types/socket.types';
import { Injectable } from '@nestjs/common';

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
}
