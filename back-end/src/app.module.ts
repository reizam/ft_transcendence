import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/auth/auth.module';
import { AuthService } from '@/auth/auth.service';
import { GameService } from '@/game/game.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { SocketsGateway } from '@/sockets/sockets.gateway';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GameController } from './game/game.controller';
import { GameModule } from './game/game.module';
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
    GameModule,
  ],
  controllers: [AppController, GameController],
  providers: [
    AppService,
    AuthService,
    UserService,
    JwtService,
    SocketsGateway,
    GameService,
  ],
})
export class AppModule {}
