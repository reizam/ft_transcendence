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
  constructor(private roomService: RoomService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('findGame')
  async onFindGame(
    @ConnectedSocket() client: Socket,
  ): Promise<void | WsResponse<string | Player[]>> {
    // TODO:
    // in front wait for two players - if not in room within 10s,
    // then error and redirect to game index
    // otherwise create socket room for players and spectators

    this.roomService.addToPlayerQueue(client);
    const res = await this.roomService.findGame(client);
    if (!res) return;
    if (res?.error) return { event: 'findError', data: res.error };
    if (res?.players) {
      const gameId = await this.roomService.findOrCreateGame(
        res.players[0].id,
        res.players[1].id,
      );

      if (!gameId) return { event: 'findError', data: 'Game creation error' };
      this.server
        .timeout(10000)
        .to(res.players[0].socketId)
        .to(res.players[1].socketId)
        .volatile.emit('foundGame', (err: unknown, _resp: string) => {
          if (err) {
            this.server
              .to(res.players![0].socketId)
              .to(res.players![1].socketId)
              .volatile.emit(
                'joinTimeout',
                "Your opponent is taking a shit. Let's find someone else",
              );
            this.roomService.deleteGame(gameId);
          } else {
            this.server
              .to(res.players![0].socketId)
              .to(res.players![1].socketId)
              .volatile.emit('joinGame', gameId);
          }
        });
    }
    return;
  }

  @SubscribeMessage('stopFindGame')
  onStopFindGame(@ConnectedSocket() client: Socket): void {
    console.log('Stoooooooooooooooooooooooooooooooooooop');
    this.roomService.removeFromPlayerQueue(client);
  }
}
