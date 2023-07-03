import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/auth/auth.module';
import { GameModule } from '@/game/game.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { SocketGateway } from '@/socket/socket.gateway';
import { SocketModule } from '@/socket/socket.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ChannelModule } from './channel/channel.module';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { FriendsModule } from './friends/friends.module';
import { RoomGateway } from './game/room.gateway';
import { GameGateway } from './game/game.gateway';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    ConfigModule.forRoot(),
    ProfileModule,
    SocketModule,
    ChannelModule,
    GameModule,
    FriendsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserService,
    JwtService,
    SocketGateway,
    GameGateway,
    RoomGateway,
  ],
})
export class AppModule {}
