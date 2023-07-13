import { GameInfos } from '@/game/types/game.types';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Game, User } from '@prisma/client';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getRank(user: User): Promise<number> {
    const higherEloCount = await this.prisma.user.count({
      where: { elo: { gt: user.elo } },
    });
    return higherEloCount + 1;
  }

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

  async getUserMatchesAndAchievements(
    userId: number,
  ): Promise<{ matchHistory: Game[]; achievements: string[] } | null> {
    return await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
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
        },
        achievements: true,
      },
    });
  }

  async updateUserAchievements(userId: number, newAchievements: string[]) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        achievements: newAchievements,
      },
    });
  }

  async recordMasterAchievement(userId: number): Promise<void> {
    const user = await this.getUserMatchesAndAchievements(userId);

    if (
      !user ||
      user.achievements.find((value) => value.toLowerCase() === 'master')
    ) {
      return;
    }
    if (
      user.matchHistory.filter((game) => {
        return (
          (game.playerOneId === userId &&
            game.playerOneScore > game.playerTwoScore) ||
          (game.playerTwoId === userId &&
            game.playerTwoScore > game.playerOneScore)
        );
      }).length >= 42
    ) {
      const newAchievements = [...user.achievements, 'master'];

      await this.updateUserAchievements(userId, newAchievements);
    }
  }

  async recordNinjaAchievement(userId: number): Promise<void> {
    const user = await this.getUserMatchesAndAchievements(userId);

    if (
      !user ||
      user.achievements.find((value) => value.toLowerCase() === 'ninja')
    ) {
      return;
    }
    if (
      user.matchHistory.find((game) => {
        return (
          (game.playerOneId === userId &&
            game.playerOneScore > game.playerTwoScore &&
            game.finishedAt &&
            game.finishedAt.getTime() - game.createdAt.getTime() < 60000) ||
          (game.playerTwoId === userId &&
            game.playerTwoScore > game.playerOneScore &&
            game.finishedAt &&
            game.finishedAt.getTime() - game.createdAt.getTime() < 60000)
        );
      })
    ) {
      const newAchievements = [...user.achievements, 'ninja'];

      await this.updateUserAchievements(userId, newAchievements);
    }
  }

  async recordSeriesAchievement(userId: number): Promise<void> {
    const user = await this.getUserMatchesAndAchievements(userId);

    if (
      !user ||
      (user.achievements.find(
        (value) => value.toLowerCase() === 'professional',
      ) &&
        user.achievements.find(
          (value) => value.toLowerCase() === 'perfectionist',
        ))
    ) {
      return;
    }
    user.matchHistory.sort(
      (gameA, gameB) =>
        (gameB.finishedAt?.getTime() ?? 0) - (gameA.finishedAt?.getTime() ?? 0),
    );
    for (let i = 0, serie = 0; i < user.matchHistory.length; ++i) {
      const game = user.matchHistory[i];
      const won: boolean =
        (game.playerOneId === userId &&
          game.playerOneScore > game.playerTwoScore) ||
        (game.playerTwoId === userId &&
          game.playerTwoScore > game.playerOneScore);

      if (won) ++serie;
      if (!won) serie = 0;
      if (serie === 3 && !user.achievements.find((a) => a === 'professional')) {
        const newAchievements = [...user.achievements, 'professional'];

        await this.updateUserAchievements(userId, newAchievements);
      }
      if (
        serie === 10 &&
        !user.achievements.find((a) => a === 'perfectionist')
      ) {
        const newAchievements = [...user.achievements, 'perfectionist'];

        await this.updateUserAchievements(userId, newAchievements);
        return;
      }
    }
  }

  async recordTerminatorAchievement(userId: number): Promise<void> {
    const user = await this.getUserMatchesAndAchievements(userId);

    if (
      !user ||
      user.achievements.find((value) => value.toLowerCase() === 'terminator')
    ) {
      return;
    }
    if (
      user.matchHistory.find((game) => {
        return (
          (game.playerOneId === userId &&
            game.playerOneScore === 10 &&
            game.playerTwoScore === 0) ||
          (game.playerTwoId === userId &&
            game.playerTwoScore === 10 &&
            game.playerOneScore === 0)
        );
      })
    ) {
      const newAchievements = [...user.achievements, 'terminator'];

      await this.updateUserAchievements(userId, newAchievements);
    }
  }

  async recordAchievements(game: GameInfos): Promise<void> {
    try {
      await this.recordMasterAchievement(game.playerOneId);
      await this.recordNinjaAchievement(game.playerOneId);
      await this.recordSeriesAchievement(game.playerOneId);
      await this.recordTerminatorAchievement(game.playerOneId);
    } catch (err) {
      console.error(err);
    }
    try {
      await this.recordMasterAchievement(game.playerTwoId);
      await this.recordNinjaAchievement(game.playerTwoId);
      await this.recordSeriesAchievement(game.playerTwoId);
      await this.recordTerminatorAchievement(game.playerTwoId);
    } catch (err) {
      console.error(err);
    }
  }
}
