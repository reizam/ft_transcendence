import { prisma } from '@lib/prisma.lib';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    const user = await prisma.user.findUnique({
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
