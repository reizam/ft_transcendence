import { IUser } from '@/auth/types/auth.types';
import { IJWTPayload } from '@/auth/types/jwt.types';
import { PrismaService } from '@/prisma/prisma.service';
import { WithRank, WithWasJustCreated } from '@/profile/types/profile.types';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@prisma/client';
import axios from 'axios';
import { authenticator } from 'otplib';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  //TODO: put the player stats/rank logic somewhere else
  async getRank(user?: User | null): Promise<number> {
    if (!user) {
      console.error('Cannot find statistics');
      return 0;
    }
    const higherEloCount = await this.prisma.user.count({
      where: { elo: { gt: user.elo } },
    });
    return higherEloCount + 1;
  }

  async validateUser(profile: IJWTPayload): Promise<WithRank<User> | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: profile.sub,
      },
      include: {
        matchHistory: {
          where: {
            status: {
              equals: 'finished',
              mode: 'insensitive',
            },
          },
          orderBy: {
            finishedAt: 'desc',
          },
          include: {
            players: true,
          },
          take: 20,
        },
        blockedUsers: {
          select: {
            id: true,
          },
        },
      },
    });
    const rank = await this.getRank(user);
    const userWithRank = { ...(user as WithRank<User>), rank: rank };
    return userWithRank;
  }

  async validateOrCreateUser(
    profile: IUser,
  ): Promise<WithWasJustCreated<User>> {
    let wasJustCreated: boolean = false;
    let user = await this.prisma.user.findFirst({
      where: {
        fortytwoId: profile.fortytwoId,
      },
    });

    if (!user) {
      const image = await axios.get(profile.profilePicture, {
        responseType: 'arraybuffer',
      });
      // TODO: Handle case where prisma fails
      user = await this.prisma.user.create({
        data: {
          ...profile,
          profilePicture:
            'data:image/jpg;base64,' +
            Buffer.from(image.data).toString('base64'),
          has2FA: false,
        },
        include: {
          matchHistory: true,
          blockedUsers: {
            select: {
              id: true,
            },
          },
        },
      });
      wasJustCreated = true;
    }
    const userWithWasJustCreated = { ...user, wasJustCreated };
    return userWithWasJustCreated;
  }

  async validateToken(token: string): Promise<User | null> {
    const payload = this.jwtService.verify(token);
    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.sub,
      },
    });

    return user;
  }

  async verify2FA(user: User, token: string): Promise<boolean> {
    if (!user.twoFactorSecret) {
      throw new Error(
        'Two factor authentification is not enabled for this user.',
      );
    }

    const isValid = authenticator.verify({
      token,
      secret: user.twoFactorSecret,
    });
    return isValid;
  }

  login(user: User): { accessToken: string } {
    const payload: IJWTPayload = {
      sub: user.id,
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '24d',
      }),
    };
  }
}
