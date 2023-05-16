export type Player = {
  id: number;
  rating: number;
};

export type MatchResult = {
  isDraw: boolean;
  winner: Player;
  loser: Player;
};
