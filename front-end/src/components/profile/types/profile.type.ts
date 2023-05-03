import { IUserData } from '@/api/user/user.type';

export type ProfileData = Pick<
  IUserData,
  'firstName' | 'lastName' | 'username' | 'profilePicture' | 'has2FA'
>;

export type UserInfo = Pick<ProfileData, 'firstName' | 'lastName' | 'username'>;
