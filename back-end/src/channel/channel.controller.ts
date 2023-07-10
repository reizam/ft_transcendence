import {
  BlockUserDto,
  CreateChannelDto,
  GetChannelMessagesDto,
  GetChannelsDto,
  JoinProtectedChannelDto,
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
  InternalServerErrorException,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Response } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  async postChannel(
    @Body() createChannelDto: CreateChannelDto,
    @DUser() user: User,
  ): Promise<IChannel> {
    const channel = await this.channelService.createChannel(
      user.id,
      createChannelDto.isPrivate,
      createChannelDto.password?.length ? createChannelDto.password : undefined,
    );

    return channel as IChannel;
  }

  @Post('message')
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

  @Post('join')
  async joinProtectedChannel(
    @Body() data: JoinProtectedChannelDto,
    @DUser() user: User,
  ): Promise<boolean> {
    return await this.channelService.joinProtectedChannel(
      user.id,
      data.channelId,
      data.password,
    );
  }

  @Get()
  async getChannel(
    @Query('channelId') channelId: string,
    @DUser() user: User,
  ): Promise<IChannel | null> {
    const channel = await this.channelService.getChannel(
      user.id,
      Number(channelId),
    );

    return channel;
  }

  @Post('leave')
  async deleteChannel(
    @Query('channelId') channelId: string,
    @DUser() user: User,
  ): Promise<boolean> {
    await this.channelService.leaveChannel(user.id, Number(channelId));

    return true;
  }

  @Put()
  async putChannel(
    @Body() putChannelDto: PutChannelDto,
    @DUser() user: User,
  ): Promise<boolean> {
    await this.channelService.updateChannel(
      user.id,
      putChannelDto.channelId,
      putChannelDto.password,
    );

    return true;
  }

  @Get('message/page')
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
  async blockUser(
    @Body() blockUserDto: BlockUserDto,
    @DUser() user: User,
    @Res() res: Response,
  ): Promise<Response> {
    if (blockUserDto.id === user.id)
      throw new InternalServerErrorException('You cannot block yourself');
    await this.channelService
      .setBlockUser(user.id, blockUserDto.id, blockUserDto.toggleBlock)
      .catch((error) => {
        console.error({ error });
        throw new InternalServerErrorException();
      });
    return res.status(204).send();
  }
}
