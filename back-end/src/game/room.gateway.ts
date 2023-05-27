import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from '@/game/room.service';
import { Player } from './types/game.types';

@WebSocketGateway()
export class RoomGateway {
  constructor(private gameService: RoomService) {}

  // @WebSocketServer()
  // server: Server;

  @SubscribeMessage('findGame')
  async onFindGame(
    @ConnectedSocket() client: Socket,
  ): Promise<void | WsResponse<string | Player[]>> {
    // TODO: implement actual matching
    // remove two users from array
    // create the game in the back
    // emit event foundGame, wait ack from two (button 'let's go' within 10s)
    // otherwise end with error
    // emit event with game id for front redirect
    // create socket room for players and spectators

    this.gameService.addToPlayerQueue(client);
    const res = await this.gameService.findGame(client);
    if (!res) return;
    if (res?.error) return { event: 'findError', data: res.error };
    if (res?.players) {
      console.log({ res });
      return { event: 'foundGame', data: res.players };
    }
    return;
  }

  @SubscribeMessage('stopFindGame')
  onStopFindGame(@ConnectedSocket() client: Socket): void {
    console.log('Stoooooooooooooooooooooooooooooooooooop');
    this.gameService.removeFromPlayerQueue(client);
  }
}
