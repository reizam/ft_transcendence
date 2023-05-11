import { GameService } from '@/game/game.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('game')
export class GameController {
  constructor(
    private gameService: GameService,
    // private playerService: PlayerService,
    private prisma: PrismaService,
  ) {}
}
