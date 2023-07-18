import { Module } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { SocketModule } from '@/socket/socket.module';

@Module({
  imports: [PrismaModule, SocketModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
