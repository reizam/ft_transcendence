import { ChannelModule } from '@/channel/channel.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [ChannelModule],
})
export class SocketModule {}
