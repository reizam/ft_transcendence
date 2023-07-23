import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserSummary } from './types/friends.types';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  async getFriends(userId: number): Promise<UserSummary[]> {
    const users = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        friends: {
          select: {
            id: true,
            username: true,
            elo: true,
            profilePicture: true,
            status: true,
          },
        },
      },
    });
    if (!users || !users.friends) return [];
    return users.friends;
  }

  async getNonFriends(
    userId: number,
    friends: UserSummary[],
  ): Promise<UserSummary[]> {
    const friendsId = friends.map((friend) => friend.id);
    friendsId.push(userId);

    const nonFriends = await this.prisma.user.findMany({
      where: {
        id: { notIn: friendsId },
      },
      select: {
        id: true,
        username: true,
        elo: true,
        profilePicture: true,
        status: true,
      },
    });
    return nonFriends;
  }

  async isFriend(userId: number, friendId: number): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: {
        id: userId,
        friends: {
          some: {
            id: friendId,
          },
        },
      },
    });
    return count > 0;
  }

  async addFriend(userId: number, friendId: number): Promise<void> {
    if ((await this.isFriend(userId, friendId)) == true) return;
    const friend = await this.prisma.user.findUnique({
      where: {
        id: friendId,
      },
    });

    if (!friend) throw new NotFoundException('Friend not found');

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        friends: {
          connect: {
            id: friendId,
          },
        },
      },
    });
  }

  async removeFriend(userId: number, friendId: number): Promise<void> {
    if ((await this.isFriend(userId, friendId)) == false) return;
    const friend = await this.prisma.user.findUnique({
      where: {
        id: friendId,
      },
    });

    if (!friend) throw new NotFoundException('Friend not found');

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        friends: {
          disconnect: {
            id: friendId,
          },
        },
      },
    });
  }
}
