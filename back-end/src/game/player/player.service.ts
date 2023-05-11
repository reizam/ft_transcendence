import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';

@Injectable()
export class PlayerService {
  constructor(private prisma: PrismaService) {}

  async getPlayer(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  // async updatePlayerStatistics(id: number): Promise<Statistic | null> {
  //   return await this.prisma.statistic.upsert({
  //     create: { userId: id } },
  //     update: {  },
  //     where: { userId: id },
  //   });
  // }

  // async getPlayerRank(id: number): Promise<number> {
  //   const user = await this.getPlayer(id);

  //   const higherRatedUsersCount = await this.prisma.statistic.count({
  //     where: { rating: { gte: statistic.rating } },
  //   });

  //   return higherRatedUsersCount + 1;
  // }
}
