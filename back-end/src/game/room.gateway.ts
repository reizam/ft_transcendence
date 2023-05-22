import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from '@/game/room.service';

interface IFindGame {
  event: string;
  msg: string;
}

@WebSocketGateway()
export class RoomGateway {
  constructor(private gameService: RoomService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('findGame')
  async onFindGame(
    @ConnectedSocket() client: Socket,
  ): Promise<void | IFindGame> {
    // return this.gameService.joinGame(client).then((err) => {
    //   if (err) return err;
    //   else return;
    // });
    return this.gameService.joinGame(client).then((err) => {
      console.log(err);
      if (err) return { event: 'findError', msg: err };
      else return;
    });
  }
}
