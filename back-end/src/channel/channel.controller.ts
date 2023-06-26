import {
  BlockUserDto,
  CreateChannelDto,
  GetChannelMessagesDto,
  GetChannelsDto,
  PostChannelSendMessageDto,
  PutChannelDto,
} from '@/channel/channel.dto';
import { ChannelService } from '@/channel/channel.service';
import {
  IChannel,
  IChannelPage,
  IMessage,
  IMessagePage,
} from '@/channel/types/channel.types';
import { DUser } from '@/decorators/user.decorator';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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

  @Post('message')
  @UseGuards(AuthGuard('jwt'))
  async sendMessage(
    @Body() sendMessageDto: PostChannelSendMessageDto,
    @DUser() user: User,
  ): Promise<IMessage> {
    return await this.channelService.sendMessage(
      user.id,
      sendMessageDto.channelId,
      sendMessageDto.message,
    );
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getChannel(
    @Query('channelId') channelId: string,
    @DUser() user: User,
  ): Promise<IChannel> {
    const channel = await this.channelService.getChannel(
      user.id,
      Number(channelId),
    );

    return channel as IChannel;
  }

  @Post('leave')
  @UseGuards(AuthGuard('jwt'))
  async deleteChannel(
    @Query('channelId') channelId: string,
    @DUser() user: User,
  ): Promise<boolean> {
    await this.channelService.leaveChannel(user.id, Number(channelId));

    return true;
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  async putChannel(
    @Body() putChannelDto: PutChannelDto,
    @DUser() user: User,
  ): Promise<boolean> {
    await this.channelService.updateChannel(
      user.id,
      putChannelDto.channelId,
      putChannelDto.admins,
      putChannelDto.withPassword,
      putChannelDto.password,
    );

    return true;
  }

  @Get('message/page')
  @UseGuards(AuthGuard('jwt'))
  async getChannelMessages(
    @Query() getChannelMessagesDto: GetChannelMessagesDto,
    @DUser() user: User,
  ): Promise<IMessagePage> {
    const messagePage = await this.channelService.getChannelMessagePage(
      user.id,
      getChannelMessagesDto.channelId,
      getChannelMessagesDto.page,
      getChannelMessagesDto.limit,
    );

    return messagePage;
  }

  @Get('page')
  @UseGuards(AuthGuard('jwt'))
  async getChannels(
    @Query() getChannelsDto: GetChannelsDto,
    @DUser() user: User,
  ): Promise<IChannelPage> {
    const channelPage = await this.channelService.getChannelPage(
      user.id,
      getChannelsDto.page,
      getChannelsDto.limit,
    );

    return channelPage;
  }

  @Patch('block')
  @UseGuards(AuthGuard('jwt'))
  async blockUser(
    @Body() blockUserDto: BlockUserDto,
    @DUser() user: User,
  ): Promise<boolean> {
    if (blockUserDto.id === user.id) return false;

    await this.channelService.setBlockUser(
      user.id,
      blockUserDto.id,
      blockUserDto.toggleBlock,
    );

    return true;
  }
}
