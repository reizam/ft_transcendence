import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { SocketModule } from '@/socket/socket.module';

@Module({
  imports: [PrismaModule, SocketModule],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
