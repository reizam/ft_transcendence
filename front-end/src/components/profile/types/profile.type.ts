import { IUserData } from '@/api/user/user.type';

export type ProfileData = Pick<
  IUserData,
  'firstName' | 'lastName' | 'username' | 'profilePicture' | 'has2FA'
>;

export type UserInfo = Pick<ProfileData, 'firstName' | 'lastName' | 'username'>;

export type Game = {
  players: IUserData[];
  playerOneId: number;
  playerTwoId: number;
  playerOneScore: number;
  playerTwoScore: number;
  status: string;
};
