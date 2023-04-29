import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async switch2FA(userId: number, value: boolean) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        has2FA: value,
      },
    });
    return user;
  }
}
