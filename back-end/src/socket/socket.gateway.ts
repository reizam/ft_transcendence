import { ISocketUser } from '@/socket/types/socket.types';
import { SocketUserService } from '@/socket/user/socket.service';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  constructor(private socketUserService: SocketUserService) {}

  handleConnection(client: Socket, ...args: any[]): void {
    const user: ISocketUser = {
      id: client.data.user.id,
      clientId: client.id,
    };

    this.socketUserService.addUser(user);

    console.log(
      'Client connected: ',
      client.id,
      `(${this.socketUserService.getOnlineUsersCount()} online)`,
    );
  }

  handleDisconnect(client: Socket): void {
    this.socketUserService.removeUser(client.id);

    console.log(
      'Client disconnected: ',
      client.id,
      `(${this.socketUserService.getOnlineUsersCount()} online)`,
    );
  }
}
