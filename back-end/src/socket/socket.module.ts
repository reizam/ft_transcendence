import { ChannelModule } from '@/channel/channel.module';
import { SocketGateway } from '@/socket/socket.gateway';
import { SocketUserService } from '@/socket/user/socket.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [ChannelModule],
  providers: [SocketUserService],
})
export class SocketModule {}
