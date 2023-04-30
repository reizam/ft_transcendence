import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async switch2FA(userId: number, value: boolean): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        has2FA: value,
      },
    });
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
