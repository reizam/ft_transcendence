import { DUser } from '@/decorators/user.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Res,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';
import { RoomService } from './room.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateGame } from './types/game.types';

@UseGuards(AuthGuard('jwt'))
@Controller('game')
export class GameController {
  constructor(
    private roomService: RoomService,
    private prisma: PrismaService,
  ) {}

  // Route for testing purposes
  // @Patch('finish')
  // async updateStats(@Body() resultDto: ResultDto): Promise<void> {
  //   const winner = await this.prisma.statistic.findUnique({
  //     where: {
  //       userId: resultDto.winnerId,
  //     },
  //   });
  //   const loser = await this.prisma.statistic.findUnique({
  //     where: {
  //       userId: resultDto.loserId,
  //     },
  //   });
  //   if (winner && loser) {
  //     await this.gameService.updateEloRating({
  //       isDraw: resultDto.draw,
  //       winner: { id: winner.userId, elo: winner.elo },
  //       loser: { id: loser.userId, elo: loser.elo },
  //     });
  //   }
  // }

  // @Post('createGame')
  // async createGame(
  //   @DUser() user: User,
  //   @Body() createGameDto: CreateGame,
  //   @Res() res: Response,
  // ): Promise<Response> {
  //   console.log({ createGameDto });

  //   if (user.id === createGameDto.challengedId)
  //     throw new UnprocessableEntityException('You cannot challenge yourself');

  //   const gameId = await this.roomService
  //     .getOrCreateGame(user.id, createGameDto.challengedId)
  //     .catch((error: any) => {
  //       console.error({ error });
  //       throw new InternalServerErrorException();
  //     });

  //   return res.status(200).json({ gameId: gameId });
  // }

  // @Patch(':id')
  // async launchGame(
  //   @DUser() user: User,
  //   @Param('id', ParseIntPipe) id: number,
  //   @Res() res: Response,
  // ): Promise<Response> {
  //   await this.gameService.joinGame(id, user.id);
  //   return res.status(204).send();
  // }

  // @Patch('launch')
  // async launchGame(
  //   @Body() launchGameDto: LaunchGame,
  //   @Res() res: Response,
  // ): Promise<Response> {
  //   await this.gameService.launchGame(launchGameDto);
  //   return res.status(204).send();
  // }
}
