import { IUser } from '@/auth/types/auth.types';
import { IJWTPayload } from '@/auth/types/jwt.types';
import { PrismaService } from '@/prisma/prisma.service';
import { WithWasJustCreated } from '@/profile/types/profile.types';
import { Status } from '@/user/types/user.types';
import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@prisma/client';
import axios from 'axios';
import { authenticator } from 'otplib';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async validateUser(profile: IJWTPayload): Promise<User | null> {
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
            players: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
              },
            },
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

    return user;
  }

  async validateOrCreateUser(
    profile: IUser,
  ): Promise<WithWasJustCreated<User>> {
    let wasJustCreated = false;
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
          status: Status.ONLINE,
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
      throw new ConflictException(
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

  async updateOfflineUsers(): Promise<void> {
    await this.prisma.user.updateMany({
      where: {
        status: {
          not: Status.OFFLINE,
        },
      },
      data: {
        status: Status.OFFLINE,
      },
    });
  }
}
