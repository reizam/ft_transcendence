import { IUserData } from '@/api/user/user.type';

export type ProfileData = Pick<
  IUserData,
  'firstName' | 'lastName' | 'username' | 'profilePicture' | 'has2FA'
>;

export type UserInfo = Pick<ProfileData, 'firstName' | 'lastName' | 'username'>;

export type Game = {
  id: number;
  players: IUserData[];
  playerOneId: number;
  playerTwoId: number;
  playerOneScore: number;
  playerTwoScore: number;
  status: string;
};

export type GameStats = {
  wins: number;
  losses: number;
  draws: number;
  elo: number;
  rank?: number;
};
