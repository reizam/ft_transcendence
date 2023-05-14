import { GameService } from '@/game/game.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Body, Controller, Patch } from '@nestjs/common';

// Type for testing purpose
type ResultDto = {
  draw: boolean;
  winnerId: number;
  loserId: number;
};

// @UseGuards(AuthGuard('jwt'))
@Controller('game')
export class GameController {
  constructor(
    private gameService: GameService,
    private prisma: PrismaService,
  ) {}

  // Route for testing purposes
  @Patch()
  async updateStats(@Body() resultDto: ResultDto): Promise<void> {
    const winner = await this.prisma.statistic.findUnique({
      where: {
        userId: resultDto.winnerId,
      },
    });
    const loser = await this.prisma.statistic.findUnique({
      where: {
        userId: resultDto.loserId,
      },
    });
    if (winner && loser) {
      await this.gameService.updateEloRating({
        isDraw: resultDto.draw,
        winner: { id: winner.userId, rating: winner.elo },
        loser: { id: loser.userId, rating: loser.elo },
      });
    }
  }
}
