import { ChannelService } from '@/channel/channel.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelGateway } from './channel.gateway';

@Module({
  imports: [PrismaModule],
  providers: [ChannelService, ChannelGateway],
  controllers: [ChannelController],
})
export class ChannelModule {}
