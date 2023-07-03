import { Module } from '@nestjs/common';
import { SocketUserService } from './user/socket.service';

@Module({
  providers: [SocketUserService],
  exports: [SocketUserService],
})
export class SocketModule {}
