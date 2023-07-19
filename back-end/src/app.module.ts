import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { GameModule } from '@/game/game.module';
import { SocketGateway } from '@/socket/socket.gateway';
import { SocketModule } from '@/socket/socket.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ChannelModule } from './channel/channel.module';
import { FriendsModule } from './friends/friends.module';
import { RoomGateway } from './game/room.gateway';
import { GameGateway } from './game/game.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SocketModule,
    ChannelModule,
    GameModule,
    FriendsModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, SocketGateway, GameGateway, RoomGateway],
})
export class AppModule {}
