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

  async leaveChannel(userId: number, channelId: number): Promise<void>;
  async leaveChannel(userId: number, channel: IChannel): Promise<void>;
  async leaveChannel(
    userId: number,
    channelOrId: number | IChannel,
  ): Promise<void> {
    let channel: IChannel | null;
    let channelId: number;

    if (typeof channelOrId === 'number') {
      channel = await this.getChannel(userId, channelOrId);
      if (!channel) {
        throw new Error('Channel not found, or incorrect permission');
      }
      channelId = channelOrId;
    } else {
      channel = channelOrId;
      channelId = channel.id;
    }

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

    if (channel.users.length === 1) {
      await this.prisma.channel.delete({
        where: {
          id: channelId,
        },
      });
    } else if (userId === channel.ownerId) {
      await this.setOwner(channelId);
    }
  }

  // async joinChannel(userId: number, channelId: number): Promise<void> {
  //   const channel = await this.getChannel(channelId);

  //   if (!channel) {
  //     throw new Error('Channel not found');
  //   }

  //   await this.prisma.channel.update({
  //     where: {
  //       id: channelId,
  //     },
  //     data: {
  //       users: {
  //         connect: {
  //           channelId_userId: {
  //             channelId,
  //             userId,
  //           },
  //         },
  //       },
  //     },
  //   });
  // }

  async setOwner(channelId: number, newOwnerId?: number): Promise<void> {
    if (newOwnerId !== undefined) {
      await this.prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          owner: {
            connect: {
              id: newOwnerId,
            },
          },
        },
      });
    } else {
      const channelUsers = await this.prisma.channelUser.findMany({
        where: {
          channelId,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
      let newOwner = channelUsers.find((user) => user.isAdmin);
      if (newOwner === undefined) {
        newOwner = channelUsers[0];
        await this.prisma.channelUser.update({
          where: {
            channelId_userId: {
              channelId: newOwner.channelId,
              userId: newOwner.userId,
            },
          },
          data: {
            isAdmin: true,
          },
        });
      }
      await this.prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          owner: {
            connect: {
              id: newOwner.userId,
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
    return channel.ownerId === userId || channel.users.some((u) => u.isAdmin);
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
  ): Promise<IChannel | null> {
    const fixedChannelId = Number(channelId);

    const where = {
      OR: [
        {
          id: fixedChannelId,
          isPrivate: true,
          users: {
            some: {
              userId: userId,
            },
          },
        },
        {
          id: fixedChannelId,
          isPrivate: false,
        },
      ],
    } as Prisma.ChannelWhereInput;

    const channel = await this.prisma.channel.findFirst({
      where,
      select: {
        id: true,
        ownerId: true,
        isPrivate: true,
        isProtected: true,
        users: {
          select: {
            isAdmin: true,
            userId: true,
            channelId: true,
            user: {
              select: {
                id: true,
                profilePicture: true,
                username: true,
              },
            },
          },
        },
        bannedUserIds: true,
      },
    });

    return channel;
  }

  async createChannel(
    ownerUserId: number,
    isPrivate: boolean,
    password?: string,
  ): Promise<IChannel> {
    const channel = await this.prisma.channel.create({
      data: {
        isPrivate,
        ownerId: ownerUserId,
        isProtected: password ? true : false,
        password: password ? hashSync(password, 10) : null,
        users: {
          create: {
            userId: ownerUserId,
            isAdmin: true,
          },
        },
        bannedUserIds: [],
      },
      include: {
        users: {
          select: {
            isAdmin: true,
            userId: true,
            channelId: true,
            user: {
              select: {
                id: true,
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

  async updateChannel(
    userId: number,
    channelId: number,
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

    await this.prisma.channel.update({
      where: {
        id: channelId,
      },
      data: {
        password: password ? hashSync(password, 10) : null,
        isProtected: password ? true : false,
      },
    });

    return true;
  }

  async getChannelPage(
    userId: number,
    page: number,
    limit: number,
  ): Promise<IChannelPage> {
    const where = {
      OR: [
        {
          isPrivate: true,
          users: {
            some: {
              userId: userId,
            },
          },
        },
        {
          isPrivate: false,
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
        isPrivate: true,
        isProtected: true,
        users: {
          select: {
            isAdmin: true,
            userId: true,
            channelId: true,
            user: {
              select: {
                id: true,
                profilePicture: true,
                username: true,
              },
            },
          },
        },
        bannedUserIds: true,
      },
      take: limit,
      skip: page * limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      totalCount,
      channels,
      page,
      limit,
      hasNextPage: (page + 1) * limit < totalCount,
    };
  }

  async setBlockUser(
    userId: number,
    targetId: number,
    toggleBlock: boolean,
  ): Promise<void> {
    if (toggleBlock === true) {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          blockedUsers: {
            connect: { id: targetId },
          },
        },
      });
    } else {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          blockedUsers: {
            disconnect: { id: targetId },
          },
        },
      });
    }
  }
}
