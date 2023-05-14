import { IChannel } from '@/channel/types/channel.types';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async createChannel(
    onwerUserId: string,
    _private: boolean,
    password?: string,
  ): Promise<IChannel> {
    const channel = await this.prisma.channel.create({
      data: {
        private: _private,
        owner: onwerUserId,
        password: password,
        admins: [],
        users: [],
      },
    });

    return channel as IChannel;
  }

  async getChannelById(channelId: number): Promise<IChannel> {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
    });

    return channel as IChannel;
  }
}
