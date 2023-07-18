import { GameController } from '@/game/game.controller';
import { GameService } from '@/game/game.service';
import { RoomService } from '@/game/room.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProfileModule } from '@/profile/profile.module';
import { SocketModule } from '@/socket/socket.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(),
    SocketModule,
    ProfileModule,
    UserModule,
  ],
  providers: [GameService, RoomService],
  exports: [GameService, RoomService],
  controllers: [GameController],
})
export class GameModule {}
