import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ChannelGateway {
  @WebSocketServer()
  server: Server;

  emitNewMessage(channelId: number): void {
    this.server.emit('newMessage', channelId);
  }

  emitChannelUpdate(channelId: number): void {
    this.server.emit('channelUpdate', channelId);
  }
}
