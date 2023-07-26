import {
  BlockUserDto,
  CreateChannelDto,
  GetChannelMessagesDto,
  GetChannelsDto,
  JoinChannelDto,
  JoinDMDto,
  PostChannelSendMessageDto,
  PutChannelDto,
  SanctionUserDto,
} from '@/channel/channel.dto';
import { ChannelService } from '@/channel/channel.service';
import {
  IChannel,
  IChannelPage,
  IChatUser,
  IMessage,
  IMessagePage,
  Sanction,
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
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Prisma, User } from '@prisma/client';
import { Response } from 'express';
import { ChannelGateway } from './channel.gateway';

@UseGuards(AuthGuard('jwt'))
@Controller('channel')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly channelGateway: ChannelGateway,
  ) {}

  @Post()
  async postChannel(
    @Body() createChannelDto: CreateChannelDto,
    @DUser() user: User,
  ): Promise<IChannel> {
    const channel = await this.channelService.createChannel(
      user.id,
      createChannelDto.isPrivate,
      createChannelDto.password?.length && !createChannelDto.isPrivate
        ? createChannelDto.password
        : undefined,
    );

    return channel;
  }

  @Post('message')
  async sendMessage(
    @Body() sendMessageDto: PostChannelSendMessageDto,
    @DUser() user: User,
  ): Promise<IMessage> {
    const message = await this.channelService.sendMessage(
      user.id,
      sendMessageDto.channelId,
      sendMessageDto.message,
    );

    this.channelGateway.emitNewMessage(message.channelId);
    return message;
  }

  @Post('join')
  async joinChannel(
    @Body() data: JoinChannelDto,
    @DUser() user: User,
  ): Promise<IChannel> {
    const channel = await this.channelService.getChannel(
      user.id,
      Number(data.channelId),
    );

    if (!channel)
      throw new NotFoundException('Channel not found, or incorrect permission');
    if (
      this.channelService.isBanned(
        data.invitedId ?? user.id,
        channel.bannedUserIds,
      )
    )
      throw new ForbiddenException('User is banned');
    if (
      !data.invitedId &&
      channel.users.find((channelUser) => channelUser.userId === user.id)
    )
      return channel;
    if (channel.isProtected && !data.invitedId)
      return await this.channelService.joinProtectedChannel(
        user.id,
        data.channelId,
        data.password,
      );
    if (channel.isPrivate) {
      if (!data.invitedId)
        throw new ConflictException('You must provide the invitedId');
      return await this.channelService.joinChannel(
        data.invitedId,
        data.channelId,
      );
    }

    const joinedChannel = await this.channelService.joinChannel(
      user.id,
      data.channelId,
    );

    this.channelGateway.emitChannelUpdate(data.channelId);
    return joinedChannel;
  }

  @Post('joinDM')
  async joinDMChannel(
    @Body() data: JoinDMDto,
    @DUser() user: User,
  ): Promise<IChannel> {
    const channel = await this.channelService.joinDMChannel(
      user.id,
      Number(data.otherUserId),
    );

    return channel;
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

    if (!channel)
      throw new NotFoundException('Channel not found, or incorrect permission');
    if (this.channelService.isBanned(user.id, channel.bannedUserIds))
      throw new ForbiddenException('You are banned from this channel');
    return channel;
  }

  // TODO: Make it Patch
  @Post('leave')
  async leaveChannel(
    @Query('channelId') channelId: string,
    @DUser() user: User,
  ): Promise<boolean> {
    await this.channelService
      .leaveChannel(user.id, Number(channelId))
      .catch((error) => {
        console.error({ error });
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025' || error.code === 'P2015')
            throw new NotFoundException('The Channel or User was not found');
        } else {
          throw error;
        }
      });

    this.channelGateway.emitChannelUpdate(Number(channelId));
    return true;
  }

  // TODO: Make it Patch
  @Put()
  async putChannel(
    @Body() putChannelDto: PutChannelDto,
    @DUser() user: User,
  ): Promise<boolean> {
    return await this.channelService.updateChannel(
      user.id,
      putChannelDto.channelId,
      putChannelDto.password,
    );
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

  @Patch('sanction')
  async sanctionUser(
    @Body() sanctionUserDto: SanctionUserDto,
    @DUser() user: User,
    @Res() res: Response,
  ): Promise<Response> {
    if (sanctionUserDto.userId === user.id)
      throw new ConflictException('You cannot sanction yourself');
    if (
      sanctionUserDto.sanction === Sanction.KICK ||
      sanctionUserDto.sanction === Sanction.DEMOTE ||
      sanctionUserDto.sanction === Sanction.PROMOTE ||
      sanctionUserDto.sanction === Sanction.UNMUTE ||
      (sanctionUserDto.sanction === Sanction.MUTE &&
        sanctionUserDto.minutesToMute)
    ) {
      await this.channelService.changeSanctionOrPrivileges(
        user.id,
        sanctionUserDto.userId,
        sanctionUserDto.channelId,
        sanctionUserDto.sanction,
        sanctionUserDto.minutesToMute,
      );
      this.channelGateway.emitChannelUpdate(sanctionUserDto.channelId);
      return res.status(204).send();
    }

    if (
      sanctionUserDto.sanction === Sanction.BAN ||
      sanctionUserDto.sanction === Sanction.UNBAN
    ) {
      await this.channelService.banOrUnban(
        user.id,
        sanctionUserDto.userId,
        sanctionUserDto.channelId,
        sanctionUserDto.sanction,
      );
      return res.status(204).send();
    }
    this.channelGateway.emitChannelUpdate(sanctionUserDto.channelId);
    throw new UnprocessableEntityException();
  }

  @Get('allChatUsers')
  async getAllUsers(
    @Query('channelId') channelId: string,
    @DUser() user: User,
  ): Promise<IChatUser[]> {
    return await this.channelService.getAllChatUsers(
      user.id,
      Number(channelId),
    );
  }
}
