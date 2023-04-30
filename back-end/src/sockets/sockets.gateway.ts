import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class SocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  public server: Server;

  handleConnection(client: any, ...args: any[]): void {
    console.log('Client connected: ', client.id, args);
  }

  handleDisconnect(client: any): void {
    console.log('Client disconnected: ', client.id);
  }
}
