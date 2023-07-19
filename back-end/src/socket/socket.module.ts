import { Module } from '@nestjs/common';
import { SocketUserService } from './user/socket.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SocketUserService],
  exports: [SocketUserService],
})
export class SocketModule {}
