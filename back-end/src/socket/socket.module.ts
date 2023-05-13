import { SocketGateway } from '@/socket/socket.gateway';
import { SocketUserService } from '@/socket/user/socket.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [SocketGateway, SocketUserService],
})
export class SocketModule {}
