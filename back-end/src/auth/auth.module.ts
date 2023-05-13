import { FortyTwoStrategy } from '@/auth/strategy/fortytwo.strategy';
import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { JwtStrategy } from '@/auth/strategy/jwt.strategy';
import { UserService } from '@/user/user.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { SocketGateway } from '@/socket/socket.gateway';
import { SocketModule } from '@/socket/socket.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    ConfigModule.forRoot(),
    PrismaModule,
    HttpModule,
    SocketModule,
  ],
  providers: [AuthService, UserService, JwtStrategy, FortyTwoStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
