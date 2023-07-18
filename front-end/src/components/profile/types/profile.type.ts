import { IUserData, Status } from '@/api/user/user.types';

export type ProfileData = Pick<
  IUserData,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'username'
  | 'profilePicture'
  | 'has2FA'
  | 'status'
>;

export type UserInfo = Pick<ProfileData, 'firstName' | 'lastName' | 'username'>;

export type Game = {
  id: number;
  players: IUserData[];
  playerOneId: number;
  playerTwoId: number;
  playerOneScore: number;
  playerTwoScore: number;
  status: Status;
};

export type GameStats = {
  elo: number;
  wins: number;
  draws: number;
  losses: number;
};
