import { IsNotEmpty, IsNumber } from 'class-validator';

export type Player = {
  id: number;
  rating: number;
};

export type MatchResult = {
  isDraw: boolean;
  winner: Player;
  loser: Player;
};

export class LaunchGame {
  @IsNotEmpty()
  @IsNumber()
  gameId: number;

  @IsNotEmpty()
  @IsNumber()
  playerTwoId: number;
}
