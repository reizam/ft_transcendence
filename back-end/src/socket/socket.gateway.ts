import { RoomGateway } from '@/game/room.gateway';
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

  constructor(
    private socketUserService: SocketUserService,
    private roomGateway: RoomGateway,
  ) {}

  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    const user: ISocketUser = {
      id: client.data.user.id,
      clientId: client.id,
    };

    await this.socketUserService.addUser(user);

    // TODO: does it need to be async and awaited?
    client.on('disconnecting', () => {
      client.rooms.forEach((roomId) => {
        if (roomId !== client.id)
          this.roomGateway.onLeaveGame(client, parseInt(roomId));
      });
    });

    console.log(
      'Client connected: ',
      client.id,
      `(${this.socketUserService.getOnlineUsersCount()} online)`,
    );
  }

  async handleDisconnect(client: Socket): Promise<void> {
    await this.socketUserService.removeUser(client.id);

    console.log(
      'Client disconnected: ',
      client.id,
      `(${this.socketUserService.getOnlineUsersCount()} online)`,
    );
  }
}
