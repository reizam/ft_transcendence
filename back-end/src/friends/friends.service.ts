import { PrismaService } from '@/prisma/prisma.service';
import { SocketUserService } from '@/socket/user/socket.service';
import { Injectable } from '@nestjs/common';
import { UserSummary, WithStatus } from './types/friends.types';
import { ISocketUser } from '@/socket/types/socket.types';

@Injectable()
export class FriendsService {
  constructor(
    private prisma: PrismaService,
    private socketUserService: SocketUserService,
  ) {}

  async getInGameIds(): Promise<number[]> {
    const games = await this.prisma.game.findMany({
      where: {
        status: {
          in: ['WAITING', 'playing'],
          mode: 'insensitive',
        },
      },
      select: {
        playerOneId: true,
        playerTwoId: true,
      },
    });

    const playerIds = games.flatMap((game) => [
      game.playerOneId,
      game.playerTwoId,
    ]);
    return playerIds;
  }

  getOnlineIds(): number[] {
    const onlineUsers: ISocketUser[] = this.socketUserService.getOnlineUsers();
    const onlineIds: number[] = onlineUsers?.map((onlineUser) => onlineUser.id);
    return onlineIds;
  }

  async getFriends(
    userId: number,
    inGameIds: number[],
    onlineIds: number[],
  ): Promise<WithStatus<UserSummary[]>> {
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
          },
        },
      },
    });
    if (!users || !users.friends) return [];
    const friendsWithStatus = users.friends.map((friend) => {
      let status = 'Offline';
      if (inGameIds.includes(friend.id)) status = 'In-Game';
      else if (onlineIds.includes(friend.id)) status = 'Online';
      return { ...(friend as WithStatus<UserSummary>), status };
    });
    return friendsWithStatus;
  }

  async getNonFriends(
    userId: number,
    friends: UserSummary[],
    inGameIds: number[],
    onlineIds: number[],
  ): Promise<WithStatus<UserSummary[]>> {
    // create a list of ids to exclude (friends and user)
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
      },
    });
    const nonFriendsWithStatus = nonFriends.map((nonFriend) => {
      let status = 'Offline';
      if (inGameIds.includes(nonFriend.id)) status = 'In-Game';
      else if (onlineIds.includes(nonFriend.id)) status = 'Online';
      return { ...(nonFriend as WithStatus<UserSummary>), status };
    });
    return nonFriendsWithStatus;
  }

  async isFriend(userId: number, friendId: number): Promise<Boolean> {
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

  async addFriend(userId: number, friendId: number) {
    if ((await this.isFriend(userId, friendId)) == true) return;
    const friend = await this.prisma.user.findUnique({
      where: {
        id: friendId,
      },
    });

    if (!friend) {
      throw new Error('Friend not found');
    }

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

  async removeFriend(userId: number, friendId: number) {
    if ((await this.isFriend(userId, friendId)) == false) return;
    const friend = await this.prisma.user.findUnique({
      where: {
        id: friendId,
      },
    });

    if (!friend) {
      throw new Error('Friend not found');
    }

    const updateUser = await this.prisma.user.update({
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
