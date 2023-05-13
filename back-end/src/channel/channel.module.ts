import { ChannelService } from '@/channel/channel.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  providers: [ChannelService],
})
export class ChannelModule {}
