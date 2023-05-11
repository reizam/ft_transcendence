import { Game } from '@/components/profile/types/profile.type';

export interface IUserData {
  id: number;
  fortytwoId: number;
  username: string;
  firstName: string;
  lastName: string;
  has2FA: boolean;
  profilePicture: string;
  matchHistory: Game[];
}

export type UpdateProfile = Partial<
  Pick<IUserData, 'username' | 'has2FA' | 'profilePicture'>
>;
