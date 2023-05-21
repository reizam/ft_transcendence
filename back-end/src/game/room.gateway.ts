import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from '@/game/room.service';

@WebSocketGateway()
export class RoomGateway {
  constructor(private gameService: RoomService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('findGame')
  async onFindGame(@ConnectedSocket() client: Socket): Promise<void | string> {
    return this.gameService.joinGame(client).then((err) => {
      if (err) return err;
      else return;
    });
  }
}
