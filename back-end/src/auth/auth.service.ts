import { IUser } from '@/auth/types/auth.types';
import { IJWTPayload } from '@/auth/types/jwt.types';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async validateUser(profile: IJWTPayload): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        id: profile.sub,
      },
      include: {
        matchHistory: {
          include: {
            players: true,
          },
        },
        statistics: true,
      },
    });
  }

  async validateOrCreateUser(profile: IUser): Promise<User> {
    let user = await this.prisma.user.findFirst({
      where: {
        fortytwoId: profile.fortytwoId,
      },
    });
    if (!user) {
      const image = await axios.get(profile.profilePicture, {
        responseType: 'arraybuffer',
      });
      user = await this.prisma.user.create({
        data: {
          ...profile,
          profilePicture:
            'data:image/jpg;base64,' +
            Buffer.from(image.data).toString('base64'),
          has2FA: false,
          statistics: {
            create: {},
          },
        },
        include: {
          matchHistory: true,
          statistics: true,
        },
      });
    }
    return user;
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
