import { Module } from '@nestjs/common';
import { SocketUserService } from './user/socket.service';
import { SocketGateway } from './socket.gateway';
import { GameModule } from '@/game/game.module';

@Module({
  providers: [SocketUserService],
  exports: [SocketUserService],
})
export class SocketModule {}
