import { GameController } from '@/game/game.controller';
import { GameGateway } from '@/game/game.gateway';
import { GameService } from '@/game/game.service';
import { RoomService } from '@/game/room.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { SocketUserService } from '@/socket/user/socket.service';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [PrismaModule, ScheduleModule.forRoot()],
  providers: [SocketUserService, GameService, GameGateway, RoomService],
  controllers: [GameController],
})
export class GameModule {}
