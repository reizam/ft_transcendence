import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/auth/auth.module';
import { AuthService } from '@/auth/auth.service';
import { GameModule } from '@/game/game.module';
import { GameService } from '@/game/game.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { SocketGateway } from '@/socket/socket.gateway';
import { SocketModule } from '@/socket/socket.module';
import { SocketUserService } from '@/socket/user/socket.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ChannelModule } from './channel/channel.module';
import { ChannelService } from './channel/channel.service';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';

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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    UserService,
    JwtService,
    SocketGateway,
    SocketUserService,
    ChannelService,
    GameService,
  ],
})
export class AppModule {}
