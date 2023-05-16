import { IChannel, IChannelPage } from '@/channel/types/channel.types';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async createChannel(
    ownerUserId: number,
    _private: boolean,
    password?: string,
  ): Promise<IChannel> {
    const channel = await this.prisma.channel.create({
      data: {
        private: _private,
        ownerId: ownerUserId,
        password: password,
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

  async getChannelPage(
    userId: number,
    page: number,
    limit: number,
  ): Promise<IChannelPage> {
    const where = {
      OR: [
        {
          users: {
            some: {
              userId: userId,
            },
          },
        },
        {
          ownerId: userId,
        },
      ],
    } as Prisma.ChannelWhereInput;

    const totalCount = await this.prisma.channel.count({
      where,
    });
    const channels = await this.prisma.channel.findMany({
      where,
      select: {
        id: true,
        ownerId: true,
        private: true,
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            username: true,
          },
        },
        users: {
          select: {
            admin: true,
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                profilePicture: true,
                username: true,
              },
            },
          },
        },
      },
      take: limit,
      skip: page * limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      totalCount,
      channels: channels as IChannel[],
      page,
      limit,
      hasNextPage: (page + 1) * limit < totalCount,
    };
  }
}
