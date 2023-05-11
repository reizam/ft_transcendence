import { GameController } from '@/game/game.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { GameService } from './game.service';

@Module({
  imports: [PrismaModule],
  providers: [GameService],
  controllers: [GameController],
})
export class GameModule {}
