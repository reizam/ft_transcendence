import { User } from '@prisma/client';

export type Player = Pick<User, 'id' | 'elo'> & {
  socketId: string;
  searchGameSince: number;
};

export interface IFindGame {
  error?: string;
  players?: Player[];
}

export type MatchResult = {
  isDraw: boolean;
  winner: Player;
  loser: Player;
};

export enum GameState {
  WAITING,
  INGAME,
  STOPPED,
}
