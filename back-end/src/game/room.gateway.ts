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
    // TODO: implement actual matching
    // remove two users from array
    // create the game in the back
    // emit volatile event foundGame with gameId for front redirect
    // in front wait for two players - if not in room within 10s,
    // then error and redirect to game index
    // otherwise create socket room for players and spectators

    this.roomService.addToPlayerQueue(client);
    const res = await this.roomService.findGame(client);
    if (!res) return;
    if (res?.error) return { event: 'findError', data: res.error };
    if (res?.players) {
      // const gameId = await this.roomService.findOrCreateGame(
      //   res.players[0].id,
      //   res.players[1].id,
      // );
      const gameId = 3;

      if (!gameId) return { event: 'findError', data: 'Game creation error' };
      // enit to all with ack, if timeout send findTimeout with
      // 'Your opponent is taking a shit. Let's find someone else'
      // to router.push('/game/find')
      // OR
      // push to game if ready, and set timeout there if two players not in
      // the game within 10 sec?
      this.server
        .timeout(3000)
        .to(res.players[0].socketId)
        .to(res.players[1].socketId)
        .volatile.emit('foundGame', gameId, (err: unknown, resp: string) => {
          if (err) {
            // console.log({ err });
            this.server
              .to(res.players![0].socketId)
              .to(res.players![1].socketId)
              .volatile.emit(
                'joinTimeout',
                "Your opponent is taking a shit. Let's find someone else",
              );
            // deleteGame();
          } else {
            console.log({ resp });
            this.server
              .to(res.players![0].socketId)
              // .to(res.players![1].socketId)
              //   .volatile.emit('joinGame', gameId);
              .volatile.emit(
                'joinTimeout',
                "Your opponent is taking a shit. Let's find someone else",
              );
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
