import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/auth/auth.module';
import { AuthService } from '@/auth/auth.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { SocketGateway } from '@/socket/socket.gateway';
import { ProfileModule } from './profile/profile.module';
import { SocketModule } from '@/socket/socket.module';
import { SocketUserService } from '@/socket/user/socket.service';
import { ChannelService } from './channel/channel.service';
import { ChannelModule } from './channel/channel.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    ConfigModule.forRoot(),
    ProfileModule,
    SocketModule,
    ChannelModule,
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
  ],
})
export class AppModule {}
