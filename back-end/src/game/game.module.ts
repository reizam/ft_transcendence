import { GameController } from '@/game/game.controller';
import { GameGateway } from '@/game/game.gateway';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { GameService } from '@/game/game.service';
import { RoomService } from '@/game/room.service';
import { RoomGateway } from '@/game/room.gateway';
import { SocketUserService } from '@/socket/user/socket.service';

@Module({
  imports: [PrismaModule],
  providers: [
    SocketUserService,
    GameService,
    GameGateway,
    RoomService,
    RoomGateway,
  ],
  controllers: [GameController],
})
export class GameModule {}
