import { IUserData } from '@/api/user/user.types';

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
  elo: number;
  wins: number;
  draws: number;
  losses: number;
};
