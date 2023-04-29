import { IUser } from '@/auth/types/auth.types';
import { IJWTPayload } from '@/auth/types/jwt.types';
import { PrismaService } from '@/prisma/prisma.service';
import type { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async validateUser(profile: IUser | IJWTPayload): Promise<User | null> {
    type payload = IUser | IJWTPayload;
    const isUser = (obj: payload): obj is IUser => {
      return 'fortytwoId' in obj;
    };
    let user: User | null;

    if (!isUser(profile)) {
      user = await this.prisma.user.findFirst({
        where: {
          id: profile.sub,
        },
      });
      return user;
    }
    user = await this.prisma.user.findFirst({
      where: {
        fortytwoId: profile.fortytwoId,
      },
    });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          has2FA: false,
          fortytwoId: profile.fortytwoId,
          username: profile.username,
          firstName: profile.firstName,
          lastName: profile.lastName,
          profilePicture: profile.profilePicture,
          email: profile.email,
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

  async login(user: User): Promise<{ accessToken: string }> {
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
