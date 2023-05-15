import { CreateChannelDto, GetChannelsDto } from '@/channel/channel.dto';
import { ChannelService } from '@/channel/channel.service';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IChannel, IChannelPage } from '@/channel/types/channel.types';
import { DUser } from '@/decorators/user.decorator';
import { User } from '@prisma/client';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async postChannel(
    @Body() createChannelDto: CreateChannelDto,
    @DUser() user: User,
  ): Promise<IChannel> {
    const channel = await this.channelService.createChannel(
      user.id,
      createChannelDto.private,
      createChannelDto.password?.length ? createChannelDto.password : undefined,
    );

    return channel as IChannel;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getChannels(
    @Query() getChannelsDto: GetChannelsDto,
  ): Promise<IChannelPage> {
    const channelPage = await this.channelService.getChannelPage(
      1,
      getChannelsDto.page,
      getChannelsDto.limit,
    );

    return channelPage;
  }
}
