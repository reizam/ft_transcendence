import { MatchResult } from '@/game/types/game.type';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async updateEloRating(result: MatchResult): Promise<void> {
    const kFactor = 32;

    const expectedOutcomeWinner =
      1 / (1 + 10 ** ((result.loser.rating - result.winner.rating) / 400));
    const expectedOutcomeLoser =
      1 / (1 + 10 ** ((result.winner.rating - result.loser.rating) / 400));

    const actualOutcomeWinner = result.isDraw ? 0.5 : 1;
    const actualOutcomeLoser = result.isDraw ? 0.5 : 0;

    const newRatingWinner =
      result.winner.rating +
      kFactor * (actualOutcomeWinner - expectedOutcomeWinner);
    const newRatingLoser =
      result.loser.rating +
      kFactor * (actualOutcomeLoser - expectedOutcomeLoser);

    await this.prisma.statistic.update({
      where: {
        userId: result.loser.id,
      },
      data: {
        elo: Math.round(newRatingLoser),
      },
    });

    try {
      await this.prisma.statistic.update({
        where: {
          userId: result.winner.id,
        },
        data: {
          elo: Math.round(newRatingWinner),
        },
      });
    } catch (e) {
      // update back to old value to avoid biased ranking
      await this.prisma.statistic.update({
        where: {
          userId: result.loser.id,
        },
        data: {
          elo: result.loser.rating,
        },
      });
      throw e;
    }
  }

  async createGame(userId: number): Promise<number> {
    const game = await this.prisma.game.create({
      data: {
        status: 'waiting',
        playerOneId: userId,
        players: {
          connect: [{ id: userId }],
        },
      },
    });
    return game.id;
  }

  async joinGame(gameId: number, playerTwoId: number): Promise<void> {
    await this.prisma.game.update({
      where: {
        id: gameId,
      },
      data: {
        playerTwoId: playerTwoId,
        launchedAt: new Date().toISOString(),
        players: {
          connect: [{ id: playerTwoId }],
        },
      },
    });
  }

  // async launchGame({ gameId, playerTwoId }: LaunchGame): Promise<void> {
  //   await this.prisma.game.update({
  //     where: {
  //       id: gameId,
  //     },
  //     data: {
  //       playerTwoId: playerTwoId,
  //       launchedAt: new Date().toISOString(),
  //       players: {
  //         connect: [{ id: playerTwoId }],
  //       },
  //     },
  //   });
  // }
}
