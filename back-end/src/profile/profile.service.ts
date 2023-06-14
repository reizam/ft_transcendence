import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async switch2FA(user: User, value: boolean): Promise<string | null> {
    let secret: string | null = null;
    let qrCodeDataUrl: string | null = null;

    if (value === true) {
      secret = authenticator.generateSecret();
      const otpauth = authenticator.keyuri(
        user.email,
        'ft_transcendence',
        secret,
      );
      qrCodeDataUrl = await toDataURL(otpauth);
    }
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        has2FA: value,
        twoFactorSecret: secret,
      },
    });
    return qrCodeDataUrl;
  }

  async updatePicture(userId: number, value: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profilePicture: value,
      },
    });
  }

  async updateUsername(userId: number, value: string): Promise<boolean> {
    if (
      await this.prisma.user.findUnique({
        where: {
          username: value,
        },
      })
    )
      return false;
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username: value,
      },
    });
    return true;
  }
}
