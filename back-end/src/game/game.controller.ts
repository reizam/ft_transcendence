import { GameService } from '@/game/game.service';
import { PrismaService } from '@/prisma/prisma.service';
import {
  Body,
  Controller,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { DUser } from '@/decorators/user.decorator';
import { Response } from 'express';

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
  @Patch('finish')
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

  @Post('create')
  async createGame(
    @DUser() user: User,
    @Res() res: Response,
  ): Promise<Response> {
    const gameId = await this.gameService
      .createGame(user.id)
      .catch((error: any) => {
        console.error({ error });
        throw new InternalServerErrorException();
      });
    return res.status(200).json({ gameId: gameId });
  }

  @Patch(':id')
  async launchGame(
    @DUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    await this.gameService.joinGame(id, user.id);
    return res.status(204).send();
  }

  // @Patch('launch')
  // async launchGame(
  //   @Body() launchGameDto: LaunchGame,
  //   @Res() res: Response,
  // ): Promise<Response> {
  //   await this.gameService.launchGame(launchGameDto);
  //   return res.status(204).send();
  // }
}
