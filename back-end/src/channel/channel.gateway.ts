import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ChannelGateway {
  constructor() {
    console.log('ChannelGateway');
  }

  @WebSocketServer()
  server: Server;

  emitChannelUpdate(channelId: number) {
    this.server.emit('channelUpdate', channelId);
  }
}
