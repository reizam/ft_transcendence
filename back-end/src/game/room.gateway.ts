import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from '@/game/room.service';

@WebSocketGateway()
export class RoomGateway {
  constructor(private gameService: RoomService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('findGame')
  async onFindGame(
    @ConnectedSocket() client: Socket,
  ): Promise<void | WsResponse<string>> {
    return this.gameService.joinGame(client).then((err) => {
      if (err) return { event: 'findError', data: err };
      else return;
    });
  }

  @SubscribeMessage('stopFindGame')
  async onStopFindGame(@ConnectedSocket() client: Socket): Promise<void> {
    this.gameService.stopFindGame(client);
  }
}
