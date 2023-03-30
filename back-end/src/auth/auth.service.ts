import { IUserValidate } from '@/auth/types/auth.types';
import { IJWTPayload } from '@/auth/types/jwt.types';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async validateUser(profile: IUserValidate): Promise<any> {
    let user = await this.prisma.user.findFirst({
      where: {
        fortytwoId: profile.fortytwoId,
      },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          has2FA: false,
          fortytwoId: profile.fortytwoId,
        },
      });
    }

    return user;
  }

  async login(user: any) {
    const payload: IJWTPayload = { fortytwoId: user.fortytwoId, sub: user.id };

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '24d',
      }),
    };
  }
}
