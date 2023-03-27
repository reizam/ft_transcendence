import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getHello(): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: 1,
      },
    });

    if (user) {
      return `Il y a ${user.name} dans la BDD 😉`;
    }

    return `Il n'y a personne dans la BDD 😢`;
  }
}
