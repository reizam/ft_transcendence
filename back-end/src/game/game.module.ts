import { GameController } from '@/game/game.controller';
import { GameGateway } from '@/game/game.gateway';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { GameService } from './game.service';

@Module({
  imports: [PrismaModule],
  providers: [GameService, GameGateway],
  controllers: [GameController],
})
export class GameModule {}
