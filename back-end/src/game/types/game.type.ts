import { User } from '@prisma/client';

export type Player = Pick<User, 'id' | 'elo'> & {
  socketId: string;
  searchGameSince: number;
};

export type MatchResult = {
  isDraw: boolean;
  winner: Player;
  loser: Player;
};
