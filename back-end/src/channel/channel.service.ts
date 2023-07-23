import {
  IChannel,
  IChannelPage,
  IChannelUser,
  IChatUser,
  IMessage,
  IMessagePage,
  Sanction,
} from '@/channel/types/channel.types';
import { PrismaService } from '@/prisma/prisma.service';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { compareSync, hashSync } from 'bcrypt';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async leaveChannel(userId: number, channel: IChannel): Promise<void>;
  async leaveChannel(userId: number, channelId: number): Promise<void>;
  async leaveChannel(
    userId: number,
    channelOrId: IChannel | number,
  ): Promise<void> {
    let channel: IChannel | null;
    let channelId: number;

    if (typeof channelOrId === 'number') {
      channel = await this.getChannel(userId, channelOrId);
      if (!channel) {
        throw new NotFoundException(
          'Channel not found, or incorrect permission',
        );
      }
      channelId = channelOrId;
    } else {
      channel = channelOrId;
      channelId = channel.id;
    }

    if (channel.isDM)
      throw new ConflictException('You cannot leave a DM channel');

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

    if (!channel)
      throw new NotFoundException('Channel not found, or incorrect permission');

    const mutedRemaining = this.mutedRemaining(userId, channel.users);
    if (mutedRemaining) {
      const minutes = mutedRemaining.getMinutes();
      const seconds = minutes > 0 ? 0 : mutedRemaining.getSeconds();

      throw new ForbiddenException(
        'You are muted during ' +
          (seconds
            ? seconds.toString() + ' seconds'
            : minutes.toString() + ' minutes'),
      );
    }

    const newMsg = await this.prisma.message.create({
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
            status: true,
          },
        },
      },
    });

    await this.prisma.channel.update({
      where: {
        id: channelId,
      },
      data: {
        lastMessageId: newMsg.id,
      },
    });
    return newMsg;
  }

  async getChannelMessagePage(
    userId: number,
    channelId: number,
    page: number,
    limit: number,
  ): Promise<IMessagePage> {
    const channel = await this.getChannel(userId, channelId);

    if (!channel)
      throw new NotFoundException('Channel not found, or incorrect permission');

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
            status: true,
          },
        },
      },
      skip: page * limit,
      take: limit,
    });

    if (messages.at(0)) {
      await this.prisma.channelUser.update({
        where: {
          channelId_userId: {
            channelId: channelId,
            userId: userId,
          },
        },
        data: {
          lastReadMessageId: messages.at(0)?.id ?? 1,
        },
      });
    }

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

    if (!channel)
      throw new NotFoundException('Channel not found, or incorrect permission');

    return this.isAdminWithChannel(userId, channel);
  }

  async createChannelUser(userId: number, channelId: number): Promise<void> {
    await this.prisma.channel.update({
      where: {
        id: channelId,
      },
      data: {
        users: {
          create: {
            userId,
            isAdmin: false,
          },
        },
      },
    });
  }

  async joinProtectedChannel(
    userId: number,
    channelId: number,
    password: string,
  ): Promise<IChannel> {
    const fixedChannelId = Number(channelId);
    const channel = await this.prisma.channel.findFirst({
      where: {
        id: fixedChannelId,
      },
    });

    if (!channel)
      throw new NotFoundException(`Channel [id: ${channelId}] not found`);
    if (!channel.password) {
      return await this.joinChannel(userId, channelId);
    }
    if (!compareSync(password, channel.password)) {
      Logger.warn(
        `User ${userId} failed to authenticate to channel ${channelId}`,
      );
      throw new UnauthorizedException('Wrong password');
    }
    return await this.joinChannel(userId, channelId);
  }

  async joinChannel(userId: number, channelId: number): Promise<IChannel> {
    const channelUser = await this.prisma.channelUser.upsert({
      where: {
        channelId_userId: {
          channelId: channelId,
          userId: userId,
        },
      },
      update: {},
      create: {
        channelId: channelId,
        userId: userId,
      },
      select: {
        channel: {
          select: {
            id: true,
            ownerId: true,
            isPrivate: true,
            isProtected: true,
            isDM: true,
            lastMessageId: true,
            users: {
              select: {
                isAdmin: true,
                userId: true,
                channelId: true,
                mutedUntil: true,
                lastReadMessageId: true,
                user: {
                  select: {
                    id: true,
                    profilePicture: true,
                    username: true,
                    status: true,
                  },
                },
              },
            },
            bannedUserIds: true,
          },
        },
      },
    });

    return channelUser.channel;
  }

  async joinDMChannel(userId: number, otherUserId: number): Promise<IChannel> {
    let channel: IChannel | null = await this.prisma.channel.findFirst({
      where: {
        AND: [
          {
            users: {
              some: {
                userId: userId,
              },
            },
          },
          {
            users: {
              some: {
                userId: otherUserId,
              },
            },
          },
          { isDM: true },
        ],
      },
      select: {
        id: true,
        ownerId: true,
        isPrivate: true,
        isProtected: true,
        isDM: true,
        lastMessageId: true,
        users: {
          select: {
            isAdmin: true,
            userId: true,
            channelId: true,
            mutedUntil: true,
            lastReadMessageId: true,
            user: {
              select: {
                id: true,
                profilePicture: true,
                username: true,
                status: true,
              },
            },
          },
        },
        bannedUserIds: true,
      },
    });

    if (!channel) {
      channel = await this.createChannel(userId, true, undefined, otherUserId);
    }
    return channel;
  }

  async getChannel(
    userId: number,
    channelId: number,
  ): Promise<IChannel | null> {
    const fixedChannelId = Number(channelId);

    const where: Prisma.ChannelWhereInput = {
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
    };

    const channel = await this.prisma.channel.findFirst({
      where,
      select: {
        id: true,
        ownerId: true,
        isPrivate: true,
        isProtected: true,
        isDM: true,
        lastMessageId: true,
        users: {
          select: {
            isAdmin: true,
            userId: true,
            channelId: true,
            mutedUntil: true,
            lastReadMessageId: true,
            user: {
              select: {
                id: true,
                profilePicture: true,
                username: true,
                status: true,
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
    otherUserId?: number,
  ): Promise<IChannel> {
    const channel = await this.prisma.channel.create({
      data: {
        isPrivate,
        ownerId: ownerUserId,
        isProtected: password ? true : false,
        password: password ? hashSync(password, 10) : null,
        isDM: otherUserId ? true : false,
        lastMessageId: null,
        users: {
          create: [
            { userId: ownerUserId, isAdmin: true },
            ...(otherUserId ? [{ userId: otherUserId, isAdmin: true }] : []),
          ],
        },
        bannedUserIds: [],
      },
      include: {
        users: {
          select: {
            isAdmin: true,
            userId: true,
            channelId: true,
            lastReadMessageId: true,
            user: {
              select: {
                id: true,
                profilePicture: true,
                username: true,
                status: true,
              },
            },
          },
        },
      },
    });

    return channel;
  }

  async updateChannel(
    userId: number,
    channelId: number,
    password?: string,
  ): Promise<boolean> {
    const channel = await this.getChannel(userId, channelId);

    if (!channel)
      throw new NotFoundException('Channel not found, or incorrect permission');

    if (!this.isAdminWithChannel(userId, channel))
      throw new ForbiddenException('You are not the admin of this channel');

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
        isDM: true,
        lastMessageId: true,
        users: {
          select: {
            isAdmin: true,
            userId: true,
            channelId: true,
            mutedUntil: true,
            lastReadMessageId: true,
            user: {
              select: {
                id: true,
                profilePicture: true,
                username: true,
                status: true,
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

  mutedRemaining(userId: number, channelUsers: IChannelUser[]): Date | null {
    const channelUser = channelUsers.find(
      (channelUser) => channelUser.userId == userId,
    );

    if (!channelUser) throw new NotFoundException('Channel user not found');
    if (!channelUser.mutedUntil) return null;

    const timeMuted: number = channelUser.mutedUntil.getTime() - Date.now();

    if (timeMuted < 0) return null;
    return new Date(timeMuted);
  }

  isBanned(userId: number, bannedUserIds: number[]): boolean {
    return bannedUserIds.includes(userId);
  }

  getRole(user: IChannelUser | undefined, ownerId: number): number {
    enum Role {
      User = 0,
      Admin,
      Owner,
    }
    if (!user) return Role.User;
    if (user.userId == ownerId) return Role.Owner;
    else if (user.isAdmin) return Role.Admin;
    return Role.User;
  }

  hasPrivileges(
    requesterUser: IChannelUser,
    targetUser: IChannelUser | undefined,
    ownerId: number,
  ): boolean {
    const requesterRole = this.getRole(requesterUser, ownerId);
    const targetRole = this.getRole(targetUser, ownerId);

    return requesterRole > targetRole;
  }

  async muteUser(
    userId: number,
    channel: IChannel,
    minutesToAdd: number,
  ): Promise<void> {
    await this.prisma.channelUser.update({
      where: {
        channelId_userId: {
          channelId: channel.id,
          userId,
        },
      },
      data: {
        mutedUntil: new Date(Date.now() + minutesToAdd * 60000),
      },
    });
  }

  async unmuteUser(userId: number, channel: IChannel): Promise<void> {
    await this.prisma.channelUser.update({
      where: {
        channelId_userId: {
          channelId: channel.id,
          userId,
        },
      },
      data: {
        mutedUntil: null,
      },
    });
  }

  async promoteUser(userId: number, channel: IChannel): Promise<void> {
    await this.prisma.channelUser.update({
      where: {
        channelId_userId: {
          channelId: channel.id,
          userId,
        },
      },
      data: {
        isAdmin: true,
      },
    });
  }

  async demoteUser(userId: number, channel: IChannel): Promise<void> {
    await this.prisma.channelUser.update({
      where: {
        channelId_userId: {
          channelId: channel.id,
          userId,
        },
      },
      data: {
        isAdmin: false,
      },
    });
  }

  async changeSanctionOrPrivileges(
    requesterUserId: number,
    targetUserId: number,
    channelId: number,
    sanction: string,
    minutesToMute?: number,
  ): Promise<void> {
    const channel = await this.getChannel(requesterUserId, channelId);
    if (!channel)
      throw new NotFoundException('Channel not found, or incorrect permission');

    const requesterUser = channel.users.find(
      (channelUser) => channelUser.userId == requesterUserId,
    );
    const targetUser = channel.users.find(
      (channelUser) => channelUser.userId === targetUserId,
    );
    if (!requesterUser || !targetUser)
      throw new NotFoundException('Channel user not found');

    if (
      this.isBanned(requesterUser.userId, channel.bannedUserIds) ||
      this.isBanned(targetUser.userId, channel.bannedUserIds)
    )
      throw new ForbiddenException('User is banned');
    if (!this.hasPrivileges(requesterUser, targetUser, channel.ownerId))
      throw new ForbiddenException("You don't have the required privileges");

    if (sanction === Sanction.KICK) {
      await this.leaveChannel(targetUserId, channel).catch((error) => {
        console.error({ error });
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2015')
            throw new NotFoundException('User not found');
        }
        throw error;
      });
    } else if (sanction === Sanction.MUTE && minutesToMute) {
      await this.muteUser(targetUserId, channel, minutesToMute);
    } else if (sanction === Sanction.UNMUTE) {
      await this.unmuteUser(targetUserId, channel);
    } else if (sanction === Sanction.PROMOTE) {
      await this.promoteUser(targetUserId, channel);
    } else if (sanction === Sanction.DEMOTE) {
      await this.demoteUser(targetUserId, channel);
    } else {
      throw new UnprocessableEntityException();
    }
  }

  async addToBannedList(userId: number, channel: IChannel): Promise<void> {
    const newBannedList = [...channel.bannedUserIds, userId];

    await this.prisma.channel.update({
      where: {
        id: channel.id,
      },
      data: {
        bannedUserIds: newBannedList,
      },
    });
  }

  async removeFromBannedList(userId: number, channel: IChannel): Promise<void> {
    const newBannedList = channel.bannedUserIds.filter(
      (bannedUser) => bannedUser !== userId,
    );

    await this.prisma.channel.update({
      where: {
        id: channel.id,
      },
      data: {
        bannedUserIds: newBannedList,
      },
    });
  }

  async banOrUnban(
    requesterUserId: number,
    targetUserId: number,
    channelId: number,
    sanction: string,
  ): Promise<void> {
    const channel = await this.getChannel(requesterUserId, channelId);
    if (!channel)
      throw new NotFoundException('Channel not found, or incorrect permission');

    const requesterUser = channel.users.find(
      (channelUser) => channelUser.userId == requesterUserId,
    );
    if (!requesterUser) throw new NotFoundException('Channel user not found');
    if (this.isBanned(requesterUser.userId, channel.bannedUserIds))
      throw new ForbiddenException('User is banned');
    if (
      this.isBanned(targetUserId, channel.bannedUserIds) &&
      sanction !== Sanction.UNBAN
    )
      throw new ForbiddenException('User is already banned');

    const targetUser = channel.users.find(
      (channelUser) => channelUser.userId === targetUserId,
    );
    if (!this.hasPrivileges(requesterUser, targetUser, channel.ownerId))
      throw new ForbiddenException("You don't have the required privileges");

    if (sanction === Sanction.BAN) {
      if (targetUser) {
        await this.leaveChannel(targetUserId, channel).catch((error) => {
          console.error({ error });
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2015')
              throw new NotFoundException('User not found');
          }
          throw error;
        });
      }
      await this.addToBannedList(targetUserId, channel);
    } else if (sanction === Sanction.UNBAN) {
      await this.removeFromBannedList(targetUserId, channel);
    } else {
      throw new UnprocessableEntityException();
    }
  }

  async getAllChatUsers(
    userId: number,
    channelId: number,
  ): Promise<IChatUser[]> {
    const channel = await this.getChannel(userId, channelId);

    if (!channel)
      throw new NotFoundException('Channel not found, or incorrect permission');
    if (!channel.users.find((channelUser) => channelUser.userId == userId))
      throw new NotFoundException('Channel user not found');
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        profilePicture: true,
        status: true,
      },
    });
  }
}
