import {
  BlockUserDto,
  CreateChannelDto,
  GetChannelMessagesDto,
  GetChannelsDto,
  KickUserDto,
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
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Prisma, User } from '@prisma/client';
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

    return channel;
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

  @Get()
  async getChannel(
    @Query('channelId') channelId: string,
    @DUser() user: User,
  ): Promise<IChannel> {
    const channel = await this.channelService.getChannel(
      user.id,
      Number(channelId),
    );

    if (!channel) throw new NotFoundException();
    return channel;
  }

  // TODO: Make it Patch
  @Post('leave')
  async leaveChannel(
    @Query('channelId') channelId: string,
    @DUser() user: User,
  ): Promise<boolean> {
    await this.channelService.leaveChannel(user.id, Number(channelId));

    return true;
  }

  // TODO: Make it Patch
  @Put()
  async putChannel(
    @Body() putChannelDto: PutChannelDto,
    @DUser() user: User,
  ): Promise<boolean> {
    await this.channelService.updateChannel(
      user.id,
      putChannelDto.channelId,
      putChannelDto.withPassword,
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
      throw new ConflictException('You cannot block yourself');
    await this.channelService
      .setBlockUser(user.id, blockUserDto.id, blockUserDto.toggleBlock)
      .catch((error) => {
        console.error({ error });
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025')
            throw new NotFoundException("Your profile wasn't found");
          if (error.code === 'P2015')
            throw new NotFoundException('User not found');
        }
        throw new InternalServerErrorException();
      });
    return res.status(204).send();
  }

  @Patch('kick')
  async kickUser(
    @Body() kickUserDto: KickUserDto,
    @DUser() user: User,
    @Res() res: Response,
  ): Promise<Response> {
    const channel = await this.channelService.getChannel(
      user.id,
      Number(kickUserDto.channelId),
    );
    if (!channel)
      throw new NotFoundException('Channel not found, or incorrect permission');

    const requesterUser = channel.users.find(
      (channelUser) => channelUser.userId == user.id,
    );
    const targetUser = channel.users.find(
      (channelUser) => channelUser.userId === kickUserDto.userId,
    );
    if (!requesterUser || !targetUser)
      throw new NotFoundException('User not found');

    if (
      this.channelService.isBanned(
        requesterUser.userId,
        channel.bannedUserIds,
      ) ||
      this.channelService.isBanned(targetUser.userId, channel.bannedUserIds)
    )
      throw new ForbiddenException('User is banned');

    if (
      !this.channelService.hasPrivileges(
        requesterUser,
        targetUser,
        channel.ownerId,
      )
    )
      throw new ForbiddenException("You don't have the required privileges");

    await this.channelService
      .leaveChannel(kickUserDto.userId, channel)
      .catch((error) => {
        console.error({ error });
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2015')
            throw new NotFoundException('User not found');
        }
        throw new InternalServerErrorException();
      });
    return res.status(204).send();
  }
}
