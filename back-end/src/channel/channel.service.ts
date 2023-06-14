import {
  IChannel,
  IChannelPage,
  IMessage,
  IMessagePage,
} from '@/channel/types/channel.types';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async leaveChannel(userId: number, channelId: number): Promise<void> {
    const channel = await this.getChannel(userId, channelId);

    if (!channel) {
      throw new Error('Channel not found');
    }

    if (channel.ownerId === userId) {
      if (channel.users.length === 0) {
        await this.prisma.channel.delete({
          where: {
            id: channelId,
          },
        });
      } else {
        await this.prisma.channel.update({
          where: {
            id: channelId,
          },
          data: {
            ownerId: channel.users[0].userId,
          },
        });
      }
    } else {
      await this.prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          users: {
            delete: {
              channelId_userId: {
                channelId,
                userId,
              },
            },
          },
        },
      });
    }
  }

  async sendMessage(
    userId: number,
    channelId: number,
    message: string,
  ): Promise<IMessage> {
    const channel = await this.getChannel(userId, channelId);

    if (!channel) {
      throw new Error('Channel not found');
    }

    return await this.prisma.message.create({
      data: {
        channelId,
        userId,
        message,
      },
      select: {
        channelId: true,
        id: true,
        message: true,
        userId: true,
        createdAt: true,
        gameId: true,
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    });
  }

  async getChannelMessagePage(
    userId: number,
    channelId: number,
    page: number,
    limit: number,
  ): Promise<IMessagePage> {
    const channel = await this.getChannel(userId, channelId);

    if (!channel) {
      throw new Error('Channel not found');
    }

    const where = {
      channelId,
    } as Prisma.MessageWhereInput;

    const messages = await this.prisma.message.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        channelId: true,
        id: true,
        message: true,
        userId: true,
        createdAt: true,
        gameId: true,
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
      skip: page * limit,
      take: limit,
    });

    const count = await this.prisma.message.count({
      where,
    });

    return {
      messages: messages.map((message) => ({
        ...message,
        own: message.userId === channel.ownerId,
      })),
      totalCount: count,
      hasNextPage: count > (page + 1) * limit,
      limit,
      page,
    };
  }

  async isAdminWithChannel(
    userId: number,
    channel: IChannel,
  ): Promise<boolean> {
    return channel.ownerId === userId || channel.users.some((u) => u.admin);
  }

  async isAdmin(userId: number, channelId: number): Promise<boolean> {
    const channel = await this.getChannel(userId, channelId);

    if (!channel) {
      throw new Error('Channel not found');
    }

    return this.isAdminWithChannel(userId, channel);
  }

  async getChannel(
    userId: number,
    channelId: number,
    password?: string,
  ): Promise<IChannel> {
    const fixedChannelId = Number(channelId);

    const where = {
      OR: [
        {
          id: fixedChannelId,
          private: true,
          password,
          users: {
            some: {
              userId: userId,
            },
          },
        },
        {
          id: fixedChannelId,
          private: true,
          ownerId: userId,
        },
        {
          id: fixedChannelId,
          private: false,
        },
      ],
    } as Prisma.ChannelWhereInput;

    const channel = await this.prisma.channel.findFirst({
      where,
      select: {
        id: true,
        ownerId: true,
        private: true,
        password: true,
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
    });

    return channel as IChannel;
  }

  async createChannel(
    ownerUserId: number,
    _private: boolean,
    password?: string,
  ): Promise<IChannel> {
    const channel = await this.prisma.channel.create({
      data: {
        private: _private,
        ownerId: ownerUserId,
        password: password ? hashSync(password, 10) : null,
      },
    });

    return channel as IChannel;
  }

  async updateChannel(
    userId: number,
    channelId: number,
    admins: number[],
    withPassword: boolean,
    password?: string,
  ): Promise<boolean> {
    const channel = await this.getChannel(userId, channelId);

    if (!channel) {
      throw new Error('Channel not found');
    }

    if (!this.isAdminWithChannel(userId, channel)) {
      throw new Error('You are not the admin of this channel');
    }

    if (withPassword) {
      await this.prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          password: password ? hashSync(password, 10) : null,
          users: {
            deleteMany: {},
            create: channel.users.map((user) => ({
              admin: admins.includes(user.user.id),
              userId: user.user.id,
            })),
          },
        },
      });
    } else {
      await this.prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          password: null,
          users: {
            deleteMany: {},
            create: channel.users.map((user) => ({
              admin: admins.includes(user.user.id),
              userId: user.user.id,
            })),
          },
        },
      });
    }

    return true;
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
